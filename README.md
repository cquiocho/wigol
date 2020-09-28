# Project: WIGOL

Have you ever thought of a song and just couldn't remember the lyrics? Or heard a song and thought, "What are they saying? Did I hear what I think I heard?" If so, this is an application for you! 

Introducing Wigol, an application that will retrieve data from a third-party API that will include lyrics, song name and artist name. You will have the option to save your favorite lyrics to your own library and easily make updates to your list of songs.

## Authors:

- Andre Olivier Martin
- Christopher Quiocho
- Lee Thomas
- Matt Ravenmoore

### Wireframes

![Alt Text](images/wigol-wireframe.jpg)

### User Stories

**As a USER I would like an application that can search for song lyrics by ‘artist name’, ‘song name’ or by ‘entering a few lines of lyrics from a song’ and retrieve it’s complete lyrics for my personal use and entertainment.**

### Software Requirements

- Wigol would provide lyrics and overall information of the song including title, artist, album, genre. This application will generate numerous types of information in one place for easy access.

- Wigol will not find products related to the song or album (merchandise, videos, etc.), results are strictly related to the music. 

**MVP**: Wigol will take in information from a search form and retrieve 20 related songs that will include lyrics, title, artist and copyright information. User will be able to save ‘favorite songs’ to a library that will have the option to update/delete song information.

**Stretch Goals: Generate a karaoke feature that will sync music and lyrics to scroll over a background of album art.**

### SCOPE:

1. Search Songs
1. Receive Lyrics and Song Information from API
1. Viewer can View Save Songs as a Collection
1. Results can be Saved / Updated / Deleted by User

### Domain Modeling

![Alt Text](images/wrrc-diagram.jpg)

- Homepage: index.ejs => Search Form: by ‘artist name’ or by ‘song name’ or ‘by snippet of lyrics’.

- Results Page: show.ejs => API information presented in a list (limit 20) with ‘add to library’ button. When user clicks on button it will take them to their library/collection.

- Library Page: wigol.ejs => Song will be stored in database and displayed. User will have the option to update/delete song info. Upon doing so, user will be redirected to same page.


### Databse Relationship

1. key PRIMARY SERIAL NUMBER
1. song name VARCHAR(255)
1. artist name VARCHAR(255)
1. lyrics TEXT
1. copyright VARCHAR(255)


