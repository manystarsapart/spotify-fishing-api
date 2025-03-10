# Spotify Fishing API

an API to "fish" for random Spotify songs based on genres.

## Endpoints

### GET `/fish/:market`
fishes for a random song in a given market (i.e. region in Spotify).

**Example Request**:
```http
GET /fish/US
```

**Example Response**:

```json
{
"genre":"Jazz Orchestra",
"id":770,
"tier":"uncommon",
"representative_track_name":"Santa Baby (with Henri René & His Orchestra)",
"representative_track_main_artist":"Eartha Kitt",
"representative_track_album_name":"Heavenly Eartha",
"representative_track_popularity":61,
"timestamp":"2025-03-10T09:18:57.991Z"   
}
```

## Setup
1. clone this repository
2. `npm install` to install dependencies
3. set up `.env` with your Spotify API credentials (sign in to [Spotify for Developers](https://developer.spotify.com/) and create an app)
4. run the server: `node index.js`.

##### credentials needed: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`


## Disclaimer

project is still a W.I.P.

the representative track output from the random genre endpoint may not actually be representative of the genre. this API uses spotify's search query which is not well documented even on spotify's web API docs.  