// TuneWave - full frontend demo
(() => {
  const revenuePerStream = 0.005; // USD per stream
  const DB_KEY = "tunewave_db_v1";

  const seed = {
    artists: [
      { id: "a1", name: "Nova Echo", bio: "Ambient electronica", totalStreams: 0, campaignId: null },
      { id: "a2", name: "Rogue Pulse", bio: "Indie/rock", totalStreams: 0, campaignId: null }
    ],
    songs: [
      { id: "s1", title: "Song 1", artistId: "a1", duration: "3:15", file: "/songs/song1.wav", plays: 1200 },
      { id: "s2", title: "Song 2", artistId: "a2", duration: "2:58", file: "/songs/song2.wav", plays: 980 },
      { id: "s3", title: "Song 3", artistId: "a1", duration: "4:05", file: "/songs/song3.wav", plays: 1450 }
    ],
    campaigns: [],
    library: [] // saved songs
  };

  // Utils
  function loadDB() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

  const db = loadDB();

  // DOM helpers
  function $(sel, root = document) { return root.querySelector(sel) }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)) }

  // Views
  const views = {
    home: $("#homeView"),
    crowdfund: $("#crowdfundView"),
    search: $("#searchView"),
    library: $("#libraryView")
  };
  function switchView(name) {
    Object.values(views).forEach(v => v.classList.remove("active"));
    views[name].classList.add("active");
    if (name === "library") renderLibrary();
  }
  $all(".nav-btn").forEach(b => b.addEventListener("click", () => switchView(b.dataset.view)));

  // Render artists
  function renderArtists() {
    const row = $("#artistsRow");
    row.innerHTML = "";
    db.artists.forEach(a => {
      const tpl = $("#artistCardTpl").content.cloneNode(true);
      tpl.querySelector(".artist-art").textContent = a.name.split(" ").map(s => s[0]).slice(0, 2).join("");
      tpl.querySelector(".artist-name").textContent = a.name;
      tpl.querySelector(".artist-meta").textContent = a.bio + " · " + (a.totalStreams || 0) + " streams";
      const btn = tpl.querySelector(".view-campaign-btn");
      btn.addEventListener("click", () => openCampaignForArtist(a.id));
      row.appendChild(tpl);
    });
  }

  // Render songs
  function renderSongs() {
    const tbody = $("#songsTable tbody");
    tbody.innerHTML = "";
    db.songs.forEach((s, idx) => {
      const tr = $("#songRowTpl").content.cloneNode(true);
      tr.querySelector(".idx").textContent = idx + 1;
      tr.querySelector(".title").textContent = s.title;
      const artist = db.artists.find(x => x.id === s.artistId);
      tr.querySelector(".artist").textContent = artist ? artist.name : "Unknown";
      tr.querySelector(".duration").textContent = s.duration;
      tr.querySelector(".plays").textContent = s.plays || 0;
      const playBtn = tr.querySelector(".play-row-btn");
      playBtn.addEventListener("click", () => playSongById(s.id));
      tbody.appendChild(tr);
    });
  }

  // Player
  let audio = new Audio();
  let currentSong = null;
  let isPlaying = false;
  const playerTitle = $("#player-title");
  const playerArtist = $("#player-artist");
  const playBtn = $("#playBtn");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const curTime = $("#curTime");
  const durTime = $("#durTime");
  const seek = $("#seek");
  const volume = $("#volume");
  const likeBtn = $("#likeBtn");

  function formatTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
  }

  function setSong(s) {
    currentSong = s;
    audio.src = s.file;
    playerTitle.textContent = s.title;
    const artist = db.artists.find(a => a.id === s.artistId);
    playerArtist.textContent = artist ? artist.name : "";
    $("#player-art").textContent = (artist ? artist.name[0] : "T");
    seek.value = 0;
    curTime.textContent = "0:00";
    durTime.textContent = s.duration || "0:00";
    saveDB(db);
    updateLikeBtn();
  }

  function playSongById(id) {
    const s = db.songs.find(x => x.id === id);
    if (!s) return;
    setSong(s);
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
  }

  // Like / Unlike
  function updateLikeBtn() {
    if (!currentSong) return;
    if (db.library.includes(currentSong.id)) {
      likeBtn.textContent = "♥"; // liked
    } else {
      likeBtn.textContent = "♡"; // not liked
    }
  }

  likeBtn.addEventListener("click", () => {
    if (!currentSong) return;
    const idx = db.library.indexOf(currentSong.id);
    if (idx === -1) {
      db.library.push(currentSong.id);
      alert("Added to your library!");
    } else {
      db.library.splice(idx, 1);
      alert("Removed from your library!");
    }
    saveDB(db);
    renderLibrary();
    updateLikeBtn();
  });

  // Big play button
  playBtn.addEventListener("click", () => {
    if (!currentSong) { playSongById(db.songs[0].id); return; }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = "▶";
    } else {
      audio.play();
      isPlaying = true;
      playBtn.textContent = "⏸";
    }
  });

  prevBtn.addEventListener("click", () => {
    if (!currentSong) return;
    const idx = db.songs.findIndex(x => x.id === currentSong.id);
    const prev = db.songs[(idx - 1 + db.songs.length) % db.songs.length];
    playSongById(prev.id);
  });

  nextBtn.addEventListener("click", () => {
    if (!currentSong) return;
    const idx = db.songs.findIndex(x => x.id === currentSong.id);
    const next = db.songs[(idx + 1) % db.songs.length];
    playSongById(next.id);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    seek.value = (audio.currentTime / audio.duration) * 100;
    curTime.textContent = formatTime(audio.currentTime);
    durTime.textContent = formatTime(audio.duration);
  });

  seek.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (seek.value / 100) * audio.duration;
  });

  volume.addEventListener("input", () => { audio.volume = parseFloat(volume.value) });

  audio.addEventListener("ended", () => {
    if (currentSong) {
      const s = db.songs.find(x => x.id === currentSong.id);
      s.plays = (s.plays || 0) + 1;
      const artist = db.artists.find(a => a.id === s.artistId);
      if (artist) artist.totalStreams = (artist.totalStreams || 0) + 1;
      saveDB(db);
      renderSongs();
      renderArtists();
      renderCampaigns();
    }
    const idx = db.songs.findIndex(x => x.id === currentSong.id);
    const next = db.songs[(idx + 1) % db.songs.length];
    setSong(next);
    audio.play();
  });

  // Crowdfund system
  function renderCampaigns() {
    const list = $("#campaignsList");
    list.innerHTML = "";
    db.campaigns.forEach(c => {
      const tpl = $("#campaignCardTpl").content.cloneNode(true);
      tpl.querySelector(".campaign-artist").textContent = db.artists.find(a => a.id === c.artistId)?.name || "Unknown";
      tpl.querySelector(".campaign-title").textContent = c.title;
      tpl.querySelector(".campaign-progress").style.width = ((c.raised / c.target) * 100) + "%";
      tpl.querySelector(".campaign-progress").textContent = "$" + c.raised + " / $" + c.target;
      tpl.querySelector(".campaign-btn").addEventListener("click", () => openCampaign(c.id));
      list.appendChild(tpl);
    });
  }

  function openCampaignForArtist(id) {
    const artist = db.artists.find(a => a.id === id);
    if (!artist) return;
    const camp = db.campaigns.find(c => c.artistId === id);
    if (camp) {
      openCampaign(camp.id);
    } else {
      createCampaign(artist, "Support " + artist.name);
    }
  }

  function openCampaign(id) {
    const camp = db.campaigns.find(c => c.id === id);
    if (!camp) return;
    alert("Campaign: " + camp.title + "\nRaised: $" + camp.raised + " / $" + camp.target);
    const amt = prompt("Contribute how much (USD)?");
    const num = parseFloat(amt);
    if (num > 0) contributeToCampaign(camp, "anon", num);
  }

  function createCampaign(artist, title) {
    const c = { id: "c" + Date.now(), artistId: artist.id, title, target: 1000, raised: 0, contributors: [] };
    db.campaigns.push(c);
    artist.campaignId = c.id;
    saveDB(db);
    renderCampaigns();
  }

  function contributeToCampaign(c, name, amt) {
    c.raised += amt;
    c.contributors.push({ name, amt });
    saveDB(db);
    renderCampaigns();
    alert("Thanks for contributing $" + amt + "!");
  }

  // Wallet connect/disconnect
  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  let currentAccount = null;

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        currentAccount = accounts[0];
        connectBtn.textContent = "Connected: " + currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);
        connectBtn.style.display = "none";
        disconnectBtn.style.display = "inline-block";
      } catch (error) {
        console.error("User rejected connection:", error);
      }
    } else {
      alert("MetaMask is not installed.");
    }
  }

  function disconnectWallet() {
    currentAccount = null;
    connectBtn.textContent = "Connect Wallet";
    connectBtn.style.display = "inline-block";
    disconnectBtn.style.display = "none";
  }

  connectBtn?.addEventListener("click", connectWallet);
  disconnectBtn?.addEventListener("click", disconnectWallet);

  // Search
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");

  function runSearch(q) {
    q = q.toLowerCase();
    searchResults.innerHTML = "";

    // Songs
    db.songs.filter(s => s.title.toLowerCase().includes(q) || db.artists.find(a => a.id === s.artistId)?.name.toLowerCase().includes(q))
      .forEach(s => {
        const div = document.createElement("div");
        div.className = "search-song";
        div.textContent = s.title + " — " + (db.artists.find(a => a.id === s.artistId)?.name || "Unknown");
        div.addEventListener("click", () => playSongById(s.id));
        searchResults.appendChild(div);
      });

    // Artists
    db.artists.filter(a => a.name.toLowerCase().includes(q)).forEach(a => {
      const div = document.createElement("div");
      div.className = "search-artist";
      div.textContent = "Artist: " + a.name;
      div.addEventListener("click", () => openCampaignForArtist(a.id));
      searchResults.appendChild(div);
    });
  }

  searchInput.addEventListener("input", e => runSearch(e.target.value));

  // Library
  function renderLibrary() {
    const list = $("#libraryList");
    list.innerHTML = "";
    db.library.forEach(id => {
      const s = db.songs.find(x => x.id === id);
      if (s) {
        const div = document.createElement("div");
        div.className = "lib-song";
        div.textContent = s.title + " — " + (db.artists.find(a => a.id === s.artistId)?.name || "Unknown");
        div.addEventListener("click", () => playSongById(s.id));
        list.appendChild(div);
      }
    });
    if (db.library.length === 0) {
      list.textContent = "No songs saved yet.";
    }
  }

  // Initial render
  renderArtists();
  renderSongs();
  renderCampaigns();
  renderLibrary();

  // Defaults
  audio.volume = parseFloat($("#volume").value);
  if (db.songs.length) setSong(db.songs[0]);
})();
