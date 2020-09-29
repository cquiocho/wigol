'use strict';

// Configurations
require('dotenv').config();
require('ejs');

// Application Dependencies
const cors = require('cors');
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
app.get('/search', getSearchResults);

function renderHomePage(request, response) {
    response.status(200).render('index.ejs');
}

function getSearchResults(request, response) {
    // console.log(request.query);
    let url = 'https://api.lyrics.ovh/v1/';
    const queryObject = {
        artist: request.query.artist,
        song: request.query.song
    }
    superagent.get(url).query(queryObject)
        .then(data => {
            console.log(data);
            const info = data.map(object => new Words(object));
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

function Words(object) {
    this.artist = object.artist;
    this.song = object.song;
}

// Connect Port
client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Wigoling on ${PORT}`);
        });
    })
