import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import SpotifyWebApi from "spotify-web-api-node";

import genres from './genres.json' assert { type: 'json' };
import popularGenres from './populargenres.json' assert { type: 'json' };

dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const app = express();
const port = 3000;

// middleware & rate limit. max 10 requests per minute
app.use(express.json());
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10
}));

// get token & refresh hourly (spotify access token lasts 1h)
refreshSpotifyToken();
setInterval(refreshSpotifyToken, 3600000);

// endpoint
app.get('/fish/:market', async (req, res) => {
  const market = req.params.market;

  try {

    // selects 10/90 from two lists: popular and all
    const genreList = Math.random() < 0.9 ? genres : popularGenres;
    const selectedGenre = selectRandomGenre(genreList);
    // 1382 in genres.json
    // 13 in populargenres.json

    const track = await searchRepresentativeTrack(selectedGenre.name, market);
    if (!track) {
      return res.status(404).json({ error: 'No track found for genre' });
    }
 
    const caughtFish = {
      genre: selectedGenre.name,
      id: selectedGenre.id,
      tier: genreList === genres ? "uncommon" : "common",
      representative_track_name: track.name,
      representative_track_main_artist: track.artists[0].name,
      representative_track_album_name: track.album.name,
      representative_track_popularity: track.popularity,
      timestamp: new Date().toISOString(),
    };

    res.json(caughtFish);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to fish',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🎣 Spotify Fishing API ready at http://localhost:${port}`);
});



// ========================================

async function refreshSpotifyToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

function selectRandomGenre(genreList) {
return genreList[Math.floor(Math.random() * genreList.length)];
}

async function searchRepresentativeTrack(genre, market) {
  const { body } = await spotifyApi.searchTracks(`genre:${genre}`, { market, limit: 1 });
  return body.tracks.items[0];
}





// ========================================

// EXPERIMENTATION GROUND