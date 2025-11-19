document.getElementById("downloadBtn").addEventListener("click", async () => {
  const url = document.getElementById("spotifyUrl").value.trim();
  if (!url) return alert("Bhai link daal pehle 😭");

  const resultBox = document.getElementById("result");

  try {
    const res = await fetch("/api/spotify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (data.status !== "success") {
      alert("Error: " + data.message);
      return;
    }

    document.getElementById("cover").src = data.cover;
    document.getElementById("title").textContent = data.title;
    document.getElementById("artist").textContent = "Artist: " + data.artist;
    document.getElementById("duration").textContent = "Duration: " + data.duration + " seconds";
    document.getElementById("downloadLink").href = data.url;

    resultBox.classList.remove("hidden");

  } catch (e) {
    alert("Server error: " + e.message);
  }
});