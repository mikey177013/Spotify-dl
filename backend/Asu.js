const axios = require("axios");
const qs = require("querystring");

async function Asu(url) {
  try {
    const payload = qs.stringify({
      action: "spotify_downloader_get_info",
      url,
      nonce: "4658c378c7"
    });

    const res = await axios.post(
      "https://spotify.downloaderize.com/wp-admin/admin-ajax.php",
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest"
        }
      }
    );

    const data = res.data;

    if (!data.success || !data.data?.medias?.length) {
      return { status: "error", message: "Failed to fetch track info" };
    }

    const song = data.data;
    const media = song.medias[0];

    return {
      status: "success",
      title: song.title,
      artist: song.author,
      duration: song.duration,
      cover: song.thumbnail,
      url: media.url,
      quality: media.quality,
      ext: media.extension
    };
  } catch (e) {
    return { status: "error", message: e.response?.data || e.message };
  }
}

module.exports = Asu;