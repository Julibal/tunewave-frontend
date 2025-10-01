// TuneWave - single-file frontend demo + blockchain integration
(() => {
  // ---- On-chain config (paste of what you provided)
  const TOKEN_ADDRESS = "0xE457c164d488E2Bd1A66d80e83de6be9fa4b877a";
  const CROWDFUND_ADDRESS = "0x0E29B0A637721804ffD464BEBCF8da7d78Dfc6CA";

  // Token ABI (from your JSON)
  const TOKEN_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "owner", "type": "address" },
        { "internalType": "address", "name": "spender", "type": "address" }
      ],
      "name": "allowance",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "spender", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "spender", "type": "address" },
        { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }
      ],
      "name": "decreaseAllowance",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "spender", "type": "address" },
        { "internalType": "uint256", "name": "addedValue", "type": "uint256" }
      ],
      "name": "increaseAllowance",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "from", "type": "address" },
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "transferFrom",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Crowdfund ABI (from your JSON)
  const CROWDFUND_ABI = [
    {
      "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "raised", "type": "uint256" }
      ],
      "name": "CampaignClosed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "artist", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "goal", "type": "uint256" }
      ],
      "name": "CampaignCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "contributor", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "Contribution",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "claimant", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "ProfitClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "RevenueDeposited",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "campaignCount",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
      "name": "claimProfit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
      "name": "closeCampaign",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_id", "type": "uint256" },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" }
      ],
      "name": "contribute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_id", "type": "uint256" },
        { "internalType": "address", "name": "_user", "type": "address" }
      ],
      "name": "contributionOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "_name", "type": "string" },
        { "internalType": "uint256", "name": "_goal", "type": "uint256" }
      ],
      "name": "createCampaign",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_id", "type": "uint256" },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" }
      ],
      "name": "depositRevenue",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
      "name": "getCampaign",
      "outputs": [
        { "internalType": "address", "name": "artist", "type": "address" },
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "uint256", "name": "goal", "type": "uint256" },
        { "internalType": "uint256", "name": "raised", "type": "uint256" },
        { "internalType": "bool", "name": "active", "type": "bool" },
        { "internalType": "uint256", "name": "revenue", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // ---------------------------
  // UI demo data (unchanged)
  // ---------------------------
  const revenuePerStream = 0.005; // USD per stream (demo)
  const DB_KEY = "tunewave_db_v1";

  const seed = {
    artists: [
      { id: "a1", name: "Nova Echo", bio: "Ambient electronica", totalStreams: 0, campaignId: null },
      { id: "a2", name: "Rogue Pulse", bio: "Indie/rock", totalStreams: 0, campaignId: null }
    ],
    songs: [
      { id: "s1", title: "Dawn Loop", artistId: "a1", duration: "0:08", file: "assets/audio/song1.wav", plays: 42 },
      { id: "s2", title: "Midnight Ride", artistId: "a2", duration: "0:10", file: "assets/audio/song2.wav", plays: 87 },
      { id: "s3", title: "Ocean Drift", artistId: "a1", duration: "0:09", file: "assets/audio/song3.wav", plays: 63 }
    ],
    campaigns: []
  };

  // Utils
  function loadDB() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

  // Render helpers
  function $(sel, root = document) { return root.querySelector(sel) }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)) }

  const db = loadDB();

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
  }
  $all(".nav-btn").forEach(b => b.addEventListener("click", () => switchView(b.dataset.view)));

  // Populate artists row
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

  // Populate songs table
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
  }

  function playSongById(id) {
    const s = db.songs.find(x => x.id === id);
    if (!s) return;
    setSong(s);
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
  }

  playBtn.addEventListener("click", () => {
    if (!currentSong) { playSongById(db.songs[0].id); return; }
    if (isPlaying) { audio.pause(); isPlaying = false; playBtn.textContent = "▶" }
    else { audio.play(); isPlaying = true; playBtn.textContent = "⏸" }
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
    if (audio.duration) seek.value = Math.floor((audio.currentTime / audio.duration) * 100);
    curTime.textContent = formatTime(audio.currentTime || 0);
    durTime.textContent = formatTime(audio.duration || 0);
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

  // Crowdfund
  function renderCampaigns() {
    const el = $("#campaignsList");
    el.innerHTML = "";
    if (db.campaigns.length === 0) {
      el.innerHTML = "<div class='campaign'>No campaigns. Artists can create one below.</div>";
    } else {
      db.campaigns.forEach(c => {
        const art = db.artists.find(a => a.id === c.artistId);
        const total = c.raised || 0;
        const pct = Math.min(100, Math.round((total / c.target) * 100));
        const div = document.createElement("div");
        div.className = "campaign";
        div.innerHTML = `
          <h3>${art ? art.name : "Unknown artist"}</h3>
          <p>Target: $${c.target.toFixed(2)} · Raised: $${total.toFixed(2)} (${pct}%)</p>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p>Contributors: ${c.contributors.length} · Estimated revenue per stream: $${revenuePerStream.toFixed(3)}</p>
          <div class="campaign-earnings"><strong>Estimated payouts (based on current streams):</strong></div>
        `;
        const estimatedTotalRevenue = (db.artists.find(a => a.id === c.artistId).totalStreams || 0) * revenuePerStream;
        const cfDiv = div.querySelector(".campaign-earnings");
        if (c.contributors.length === 0) {
          cfDiv.innerHTML += "<p>No contributors yet.</p>";
        } else {
          const sumContrib = c.contributors.reduce((s, x) => s + x.amount, 0);
          c.contributors.forEach(con => {
            const share = con.amount / sumContrib;
            const payout = estimatedTotalRevenue * share;
            const p = document.createElement("p");
            p.textContent = `${con.name}: contributed $${con.amount.toFixed(2)} · share ${(share * 100).toFixed(2)}% · est. payout $${payout.toFixed(2)}`;
            cfDiv.appendChild(p);
          });
        }
        const openBtn = document.createElement("button");
        openBtn.textContent = "Open campaign";
        openBtn.className = "play-row-btn";
        openBtn.addEventListener("click", () => openCampaign(c.id));
        div.appendChild(openBtn);
        el.appendChild(div);
      });
    }
    const sel = $("#contriSelect");
    sel.innerHTML = "";
    db.campaigns.forEach(c => {
      const art = db.artists.find(a => a.id === c.artistId);
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = (art ? art.name : "Artist") + " · target $" + c.target.toFixed(2);
      sel.appendChild(o);
    });
  }

  function openCampaignForArtist(artistId) {
    let c = db.campaigns.find(x => x.artistId === artistId);
    if (!c) {
      $("#cfArtist").value = db.artists.find(a => a.id === artistId).name;
      switchView("crowdfund");
      return;
    }
    openCampaign(c.id);
    switchView("crowdfund");
  }

  function openCampaign(campaignId) {
    const c = db.campaigns.find(x => x.id === campaignId);
    if (!c) return alert("Campaign not found");
    let details = `Campaign for ${db.artists.find(a => a.id === c.artistId).name}\nTarget: $${c.target.toFixed(2)}\nRaised: $${c.raised.toFixed(2)}\nContributors:\n`;
    c.contributors.forEach(con => details += `${con.name} — $${con.amount.toFixed(2)}\n`);
    const name = prompt(details + "\nType 'contribute' to contribute, or Cancel to close.");
    if (name && name.toLowerCase() === "contribute") {
      const cname = prompt("Your name:");
      const amt = parseFloat(prompt("Amount USD:"));
      if (cname && amt > 0) {
        contributeToCampaign(c.id, cname, amt);
      }
    }
  }

  function createCampaign(artistName, target) {
    const artist = db.artists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
    if (!artist) return alert("Artist not found.");
    const existing = db.campaigns.find(x => x.artistId === artist.id);
    if (existing) return alert("This artist already has a campaign.");
    const id = "c" + Date.now().toString(36);
    const campaign = { id, artistId: artist.id, target: parseFloat(target), raised: 0, contributors: [] };
    db.campaigns.push(campaign);
    artist.campaignId = id;
    saveDB(db);
    renderCampaigns();
    alert("Campaign created.");
  }

  function contributeToCampaign(campaignId, name, amount) {
    const c = db.campaigns.find(x => x.id === campaignId);
    if (!c) return alert("Campaign not found.");
    c.contributors.push({ name, amount: parseFloat(amount) });
    c.raised = (c.contributors.reduce((s, x) => s + x.amount, 0));
    saveDB(db);
    renderCampaigns();
    alert("Thank you for your contribution!");
  }

  $("#createCampaignBtn").addEventListener("click", () => {
    const artistName = $("#cfArtist").value.trim();
    const target = parseFloat($("#cfTarget").value);
    if (!artistName || !target) return alert("Fill artist and target");
    createCampaign(artistName, target);
  });
  $("#contributeBtn").addEventListener("click", () => {
    const name = $("#contriName").value.trim();
    const amt = parseFloat($("#contriAmount").value);
    const sel = $("#contriSelect").value;
    if (!name || !amt || !sel) return alert("Fill contribution form");
    contributeToCampaign(sel, name, amt);
  });

  // Search
  $("#searchInput").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const out = $("#searchResults");
    out.innerHTML = "";
    if (!q) return;
    const foundSongs = db.songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (db.artists.find(a => a.id === s.artistId).name.toLowerCase().includes(q))
    );
    if (foundSongs.length === 0) out.textContent = "No results";
    else {
      foundSongs.forEach(s => {
        const div = document.createElement("div");
        const art = db.artists.find(a => a.id === s.artistId);
        div.innerHTML = `<strong>${s.title}</strong> — ${art ? art.name : ""} <button class="play-row-btn">Play</button>`;
        div.querySelector("button").addEventListener("click", () => playSongById(s.id));
        out.appendChild(div);
      });
    }
  });

  // initial render
  renderArtists();
  renderSongs();
  renderCampaigns();

  window.tunewave = {
    db,
    save: () => { saveDB(db); renderSongs(); renderArtists(); renderCampaigns(); },
    playSongById
  };

  audio.volume = parseFloat($("#volume").value);
  if (db.songs.length) setSong(db.songs[0]);

  // --------------------------------------
  // Blockchain: provider / contracts init
  // --------------------------------------
  let provider = null;
  let signer = null;
  let tokenContract = null;
  let crowdfundContract = null;
  let currentAccount = null;

  // safe init: call when user clicks Connect
  async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not installed. Please install MetaMask to use blockchain features.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      currentAccount = await signer.getAddress();

      // instantiate contracts with signer (allow read/write)
      tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      crowdfundContract = new ethers.Contract(CROWDFUND_ADDRESS, CROWDFUND_ABI, signer);

      // expose globally for other dev/testing convenience
      window.blockchain = { provider, signer };
      window.contracts = { token: tokenContract, crowdfund: crowdfundContract };

      // update UI connect button
      const connectBtn = document.getElementById("connectBtn");
      const disconnectBtn = document.getElementById("disconnectBtn");
      if (connectBtn) { connectBtn.style.display = "none"; }
      if (disconnectBtn) { disconnectBtn.style.display = "inline-block"; }
      if (connectBtn && currentAccount) {
        connectBtn.textContent = "Connected: " + currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);
      }

      // optional quick fetch (console)
      try {
        const supply = await tokenContract.totalSupply();
        const count = await crowdfundContract.campaignCount();
        console.log("TWE totalSupply (wei):", supply.toString());
        console.log("Crowdfund campaignCount:", count.toString());
      } catch (err) {
        console.warn("Could not fetch contract data (maybe RPC problem):", err);
      }

    } catch (err) {
      console.error("connectWallet error:", err);
      alert("Could not connect wallet. Check MetaMask and network RPC.");
    }
  }

  function disconnectWallet() {
    // just reset UI state — MetaMask cannot be programmatically disconnected
    currentAccount = null;
    tokenContract = null;
    crowdfundContract = null;
    window.blockchain = null;
    window.contracts = null;

    const connectBtn = document.getElementById("connectBtn");
    const disconnectBtn = document.getElementById("disconnectBtn");
    if (connectBtn) {
      connectBtn.style.display = "inline-block";
      connectBtn.textContent = "Connect Wallet";
    }
    if (disconnectBtn) disconnectBtn.style.display = "none";
    console.log("Wallet disconnected (UI only).");
  }

  // wire connect buttons (safe: only once)
  const _connectBtn = document.getElementById("connectBtn");
  const _disconnectBtn = document.getElementById("disconnectBtn");
  if (_connectBtn) _connectBtn.addEventListener("click", connectWallet);
  if (_disconnectBtn) _disconnectBtn.addEventListener("click", disconnectWallet);

  // optional: detect if already connected (wallet unlocked)
  (async function autoDetect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts && accounts.length > 0) {
          // show short address and set buttons (but don't force request)
          currentAccount = accounts[0];
          const connectBtn = document.getElementById("connectBtn");
          const disconnectBtn = document.getElementById("disconnectBtn");
          if (connectBtn) {
            connectBtn.textContent = "Connected: " + currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);
            connectBtn.style.display = "none";
          }
          if (disconnectBtn) disconnectBtn.style.display = "inline-block";
          // you can optionally call connectWallet() here to fully instantiate contracts:
          // await connectWallet();
        }
      } catch (err) {
        console.warn("autoDetect accounts failed:", err);
      }
    }
  })();

})(); // IIFE end
