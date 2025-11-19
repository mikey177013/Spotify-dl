const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const Asu = require("./Asu");

const app = express();

app.use(cors());
app.use(express.json());

// Serve your frontend from ROOT folder
app.use(express.static(path.join(__dirname, "..")));

// ---------- SEARCH API ----------
app.get("/api/search", async (req, res) => {
  const q = req.query.q;

  if (!q) return res.json({ tracks: [] });

  try {
    const search = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song`
    );

    const tracks = search.data.results.map(song => ({
      name: song.trackName,
      artist: song.artistName,
      image: song.artworkUrl100,
      url: `https://open.spotify.com/track/${song.trackId || song.trackName}`
    }));

    res.json({ tracks });
  } catch (err) {
    res.json({ tracks: [] });
  }
});

// ---------- DOWNLOAD API ----------
app.post("/api/spotify", async (req, res) => {
  const { url } = req.body;

  if (!url)
    return res.json({ status: "error", message: "No URL provided" });

  const result = await Asu(url);
  res.json(result);
});

// ---------- SERVER LISTEN (RENDER-FRIENDLY) ----------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
