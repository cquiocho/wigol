'use strict';

// Configurations
require('dotenv').config();
require('ejs');

// Application Dependencies
const cors = require('cors');
const authCallbackPath = '/auth/spotify/callback';

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const superagent = require('superagent');
const { response } = require('express');

// Application Setup
const app = express();
app.use(cors());

// Port Setup
const PORT = process.env.PORT || 3001
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => {
  console.log(error);
});

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
app.get('/', renderHomePage);
app.get('/team', renderTeamPage);
app.get('/search', getSearchResults);
app.post('/songs', addSongToDatabase);
app.get('/library', renderLibrary);
app.delete('/delete/:song_id', deleteSong);
app.get('/details/:song_id', songDetails);
app.get('/spotifyLoggedin', spotLoggin)

// spotify Routes dont touch
app.get('/auth/spotify', function(request,response){
  const url = `https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000${authCallbackPath}&show_dialog=true&scope=user-read-email,user-read-private`;
  superagent.get(url)
    .then(results =>{
      console.log(results.redirects)
      response.redirect(results.redirects[0])
    })
});

app.get(authCallbackPath,
  function (req, res) {
    console.log("banapinapple")
    // let encodedData = `${base64.encode(process.env.CLIENT_ID)}:${base64.encode(process.env.CLIENT_SECRET)}`;
    const codeSpotify = req.query;
    console.log(codeSpotify.code)
    let token = [];
    superagent.post('https://accounts.spotify.com/api/token')
      .set({
        'Content-Type':'application/x-www-form-urlencoded',
        // 'Authorization' : `Basic ${encodedData}`
      })
      .send( {
        grant_type: "authorization_code",
        code: codeSpotify.code,
        redirect_uri: `http://localhost:3000${authCallbackPath}`,
        client_id: process.env.CLIENT_ID,
        client_secret:process.env.CLIENT_SECRET
      })
      .then(response =>{
        console.log(response.body);
        token = response.body;
        res.redirect(`/spotifyLoggedin?access_token=${token.access_token}`)
      }
      // create a db to dump res.body into
      // access db at api call for header information
      ).catch((e)=>{console.log(e)})
    console.log('im a token.' , token)
  });
app.get('/login', function (req, res) {
  res.status(200).send('we are pineapple');
})
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('*', handleError);

function renderHomePage(request, response) {
  response.status(200).render('index.ejs');
}

function getSearchResults(request, response) {
  // console.log(request.query);
  let url = `https://api.lyrics.ovh/v1/${request.query.artist}/${request.query.song}`;
  superagent.get(url)
    .then(data => {
      console.log(data.body);
      let info = {};
      info.lyrics = data.body.lyrics;
      info.artist = request.query.artist;
      info.title = request.query.song;
      // console.log(info);
      response.status(200).render('pages/search/show', { info: info });
    })
    .catch(error => {
      console.log(error)
      response.render('error.ejs');
    })
}

function renderTeamPage(request, response) {
  response.status(200).render('pages/team');
}

function renderLibrary(request, response) {
  const sql = 'SELECT * FROM chartlyric;';
  client.query(sql)
    .then(favoriteInfo => {
      let arrayofresults = favoriteInfo.rows;
      response.render('pages/library/show', { arrayofresults: arrayofresults });
    })
}

function addSongToDatabase(request, response) {
  const { lyrics, artist, title } = request.body;
  console.log(request.body);
  const sql = 'INSERT INTO chartlyric (lyrics, artist, song) VALUES ($1, $2, $3);';
  const safeValues = [lyrics, artist, title];
  client.query(sql, safeValues)
    .then((databaseInfo) => {
      response.redirect('/library');
    })
}

function deleteSong(request, response) {
  const id = request.params.song_id;
  const sql = 'DELETE FROM chartlyric WHERE id=$1;';
  const safeValues = [id];
  client.query(sql, safeValues)
    .then((item) => {
      response.redirect('/library');
    })
}

function songDetails(request, response) {
  const id = request.params.song_id;
  const sql = 'SELECT * FROM chartlyric WHERE id=$1;';
  const safeValues = [id];
  client.query(sql, safeValues)
    .then((info) => {
      const storedSong = info.rows[0];
      console.log(storedSong);
      response.render('pages/library/detail', { storedSong: storedSong });
    });
}

function spotLoggin(request,response) {
  let url = `https://api.spotify.com/v1/me`;
  console.log('rar',request.query)
  superagent.get(url)
    .set('Authorization', `Bearer ${request.query.access_token}` )
    .then(data => {
      console.log('YAY',data.body);
      let userInfo = {};
      userInfo.name = data.body.display_name;
      userInfo.email = data.body.email;
      userInfo.userStatus = data.body.product;

      response.render('pages/Spot.ejs', { userInfo: userInfo })
    })
    .catch(error => {
      console.log(error)
      response.render('error.ejs');
    })
}

function handleError(request, response) {
  response.status(404).render('error.ejs');
}

// Connect Port
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Wigoling on ${PORT}`);
    });
  })
