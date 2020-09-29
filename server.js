'use strict';

// Configurations
require('dotenv').config();
require('ejs');

// Application Dependencies
const cors = require('cors');
const { request, response } = require('express');
const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const superagent = require('superagent');

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
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

// Routes
app.get('/', renderHomePage);
app.get('/team', renderTeamPage);
app.get('/search', getSearchResults);
app.post('/songs', addSongToDatabase);
app.get('/library', renderLibrary);
app.delete('/delete/:song_id', deleteSong);
app.get('/details/:song_id', songDetails);
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
            response.status(200).render('pages/search/show', {info : info});
        })
        .catch(error => {
            console.log(error)
            response.render('error.ejs');
        })
    // const sql = 'SELECT * FROM chartlyric;';
    // client.query(sql)
    //     .then(results => {
    //         let mySongs = results.rows;
    //         response.status(200).render('pages/search/show', {mySongs : mySongs});
    //     })
    //     .catch(error => {
    //         console.log(error)
    //         response.render('error.ejs');
    //     })
}

function renderTeamPage(request, response) {
    response.status(200).render('pages/team');
}

function renderLibrary(request, response) {
    const sql = 'SELECT * FROM chartlyric;';
    client.query(sql)
        .then(favoriteInfo => {
            let arrayofresults = favoriteInfo.rows;
            response.render('pages/library/show', {arrayofresults : arrayofresults});
        })
}

function addSongToDatabase(request,response) {
    const {lyrics, artist, title} = request.body;
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
        response.render('pages/library/detail.ejs', {storedSong : storedSong});
        // PLEASE CHECK CSS PATH
    });
}

function handleError(request, response) {
    response.status(404).render('error.ejs');
}
// function Words(object) {
//     this.artist = object.artist;
//     this.song = object.song;
// }

// Connect Port
client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Wigoling on ${PORT}`);
        });
    })
