DROP TABLE IF EXISTS chartlyric;

CREATE TABLE chartlyric(
    id SERIAL PRIMARY KEY,
    artist VARCHAR(255),
    song VARCHAR(255),
    lyrics TEXT
);