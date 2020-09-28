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
// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', error => {
//     console.log(error);
// });

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

// Routes

// Connect Port
// client.connect()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`Wigoling on ${PORT}`);
//         });
//     })

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));    