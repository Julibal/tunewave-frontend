// Full TuneWave frontend (restore ABIs + on-chain integration + safe fallbacks)
// Replace your existing app.js with this file.

(() => {
  // -------------------------
  // Config (on-chain addresses & ABIs you provided)
  // -------------------------
  const DB_KEY = "tunewave_db_v1";
  const revenuePerStream = 0.005;

  const TWE_CA = "0xE457c164d488E2Bd1A66d80e83de6be9fa4b877a";
  const CROWDFUNDING_CA = "0x0E29B0A637721804ffD464BEBCF8da7d78Dfc6CA";

  // TWE ABI (you provided — trimmed to same methods/events but kept the supplied spec)
  const TWE_ABI = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
  ];

  // Crowdfund ABI (you provided)
  const CROWDFUNDING_ABI = [
    { "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "raised", "type": "uint256" }], "name": "CampaignClosed", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "artist", "type": "address" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "goal", "type": "uint256" }], "name": "CampaignCreated", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "contributor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Contribution", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "claimant", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "ProfitClaimed", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RevenueDeposited", "type": "event" },
    { "inputs": [], "name": "campaignCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "claimProfit", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "closeCampaign", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "contribute", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "address", "name": "_user", "type": "address" }], "name": "contributionOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "uint256", "name": "_goal", "type": "uint256" }], "name": "createCampaign", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "depositRevenue", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "getCampaign", "outputs": [{ "internalType": "address", "name": "artist", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "goal", "type": "uint256" }, { "internalType": "uint256", "name": "raised", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "uint256", "name": "revenue", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "token", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
  ];

  // -------------------------
  // Utility: load ethers CDN if missing
  // -------------------------
  function loadEthersIfMissing() {
    return new Promise((resolve) => {
      if (typeof window.ethers !== "undefined") return resolve(window.ethers);
      const s = document.createElement("script");
      s.type = "text/javascript";
      // using a modern v6 CDN; if you want v5, swap URL
      s.src = "https://cdn.jsdelivr.net/npm/ethers@6.9.0/dist/ethers.min.js";
      s.onload = () => resolve(window.ethers || null);
      s.onerror = () => {
        console.warn("Failed loading ethers CDN");
        resolve(null);
      };
      document.head.appendChild(s);
    });
  }

  // -------------------------
  // Local demo DB seed (unchanged UI content)
  // -------------------------
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
    library: []
  };

  function loadDB() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return JSON.parse(JSON.stringify(seed));
  }
  function saveDB(db) { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch(_) {} }
  const db = loadDB();

  // -------------------------
  // Init & main
  // -------------------------
  (async function init() {
    const ETHERS = await loadEthersIfMissing();
    const isV6 = ETHERS && (typeof ETHERS.BrowserProvider !== "undefined" || (typeof ETHERS.formatEther !== "undefined" && typeof ETHERS.formatUnits !== "undefined"));
    const isV5 = ETHERS && ETHERS.utils && ETHERS.providers && ETHERS.providers.Web3Provider;

    // wrappers for formatting/parsing across v5/v6
    function formatEther(value) {
      if (!ETHERS) return value.toString();
      if (isV6) return ETHERS.formatEther(value);
      return ETHERS.utils.formatEther(value);
    }
    function formatUnits(value, decimals) {
      if (!ETHERS) return value.toString();
      if (isV6) return ETHERS.formatUnits(value, decimals);
      return ETHERS.utils.formatUnits(value, decimals);
    }
    function parseUnits(val, decimals) {
      if (!ETHERS) throw new Error("ethers missing");
      if (isV6) return ETHERS.parseUnits(val.toString(), decimals);
      return ETHERS.utils.parseUnits(val.toString(), decimals);
    }

    // DOM helpers
    const $ = (sel, root = document) => root.querySelector(sel);
    const $all = (sel, root = document) => Array.from((root || document).querySelectorAll(sel || []));

    // Ensure balance UI spans exist (inject minimal if missing)
    (function ensureBalanceSpans() {
      const header = document.querySelector("header.header") || document.querySelector("header") || null;
      const searchInput = $("#searchInput");
      const headerParent = header || (searchInput ? searchInput.parentElement : null);
      if (!headerParent) return;

      let balanceWrap = document.getElementById("tw-balance-wrap");
      if (!balanceWrap) {
        balanceWrap = document.createElement("div");
        balanceWrap.id = "tw-balance-wrap";
        balanceWrap.style.display = "flex";
        balanceWrap.style.alignItems = "center";
        balanceWrap.style.gap = "8px";
        balanceWrap.style.marginLeft = "12px";
        if (searchInput && searchInput.parentElement) searchInput.parentElement.appendChild(balanceWrap);
        else headerParent.appendChild(balanceWrap);
      }
      if (!document.getElementById("nativeBalance")) {
        const nb = document.createElement("span");
        nb.id = "nativeBalance";
        nb.style.fontSize = "13px";
        nb.style.color = "#aeb8c2";
        nb.textContent = "";
        balanceWrap.appendChild(nb);
      }
      if (!document.getElementById("tokenBalance")) {
        const tb = document.createElement("span");
        tb.id = "tokenBalance";
        tb.style.fontSize = "13px";
        tb.style.color = "#aeb8c2";
        tb.textContent = "";
        balanceWrap.appendChild(tb);
      }
    })();

    // Get UI elements (create connect/disconnect if missing)
    const connectBtn = document.getElementById("connectBtn") || (function () {
      const hdr = document.querySelector("header.header") || document.querySelector("header") || document.body;
      const b = document.createElement("button");
      b.id = "connectBtn";
      b.className = "connect-btn";
      b.textContent = "Connect";
      b.style.marginLeft = "8px";
      hdr.appendChild(b);
      return b;
    })();

    const disconnectBtn = document.getElementById("disconnectBtn") || (function () {
      const hdr = document.querySelector("header.header") || document.querySelector("header") || document.body;
      const b = document.createElement("button");
      b.id = "disconnectBtn";
      b.className = "disconnect-btn";
      b.textContent = "Disconnect";
      b.style.marginLeft = "8px";
      b.style.display = "none";
      hdr.appendChild(b);
      return b;
    })();

    const createCampaignBtn = document.getElementById("createCampaignBtn");
    const cfArtist = document.getElementById("cfArtist");
    const cfTarget = document.getElementById("cfTarget");
    const contributeBtn = document.getElementById("contributeBtn");
    const contriSelect = document.getElementById("contriSelect");
    const contriAmount = document.getElementById("contriAmount");
    const contriName = document.getElementById("contriName");

    // player vars
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

    const artistCardTpl = $("#artistCardTpl");
    const songRowTpl = $("#songRowTpl");

    // Audio player (same behavior)
    let audio = new Audio();
    let currentSong = null;
    let isPlaying = false;

    function formatTime(sec) {
      sec = Math.max(0, Math.floor(sec));
      return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
    }

    function setSong(s) {
      currentSong = s;
      try { audio.src = s.file; } catch (_) {}
      if (playerTitle) playerTitle.textContent = s.title;
      if (playerArtist) playerArtist.textContent = db.artists.find(a => a.id === s.artistId)?.name || "";
      const artEl = document.getElementById("player-art");
      if (artEl) artEl.textContent = (db.artists.find(a => a.id === s.artistId)?.name || "T")[0] || "T";
      if (seek) seek.value = 0;
      if (curTime) curTime.textContent = "0:00";
      if (durTime) durTime.textContent = s.duration || "0:00";
      try { saveDB(db); } catch (_) {}
      updateLikeBtn();
    }

    function playSongById(id) {
      const s = db.songs.find(x => x.id === id);
      if (!s) return;
      setSong(s);
      audio.play().catch(() => { /* autoplay blocked */ });
      isPlaying = true;
      if (playBtn) playBtn.textContent = "⏸";
    }

    function updateLikeBtn() {
      if (!likeBtn || !currentSong) return;
      likeBtn.textContent = db.library.includes(currentSong.id) ? "♥" : "♡";
    }

    playBtn?.addEventListener("click", () => {
      if (!currentSong) { if (db.songs.length) playSongById(db.songs[0].id); return; }
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playBtn.textContent = "▶";
      } else {
        audio.play().catch(() => { });
        isPlaying = true;
        playBtn.textContent = "⏸";
      }
    });
    prevBtn?.addEventListener("click", () => {
      if (!currentSong) return;
      const idx = db.songs.findIndex(x => x.id === currentSong.id);
      const prev = db.songs[(idx - 1 + db.songs.length) % db.songs.length];
      playSongById(prev.id);
    });
    nextBtn?.addEventListener("click", () => {
      if (!currentSong) return;
      const idx = db.songs.findIndex(x => x.id === currentSong.id);
      const next = db.songs[(idx + 1) % db.songs.length];
      playSongById(next.id);
    });
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      if (seek) seek.value = (audio.currentTime / audio.duration) * 100;
      if (curTime) curTime.textContent = formatTime(audio.currentTime);
      if (durTime) durTime.textContent = formatTime(audio.duration);
    });
    seek?.addEventListener("input", () => {
      if (!audio.duration) return;
      audio.currentTime = (seek.value / 100) * audio.duration;
    });
    volume?.addEventListener("input", () => { audio.volume = parseFloat(volume.value); });
    likeBtn?.addEventListener("click", () => {
      if (!currentSong) return;
      const idx = db.library.indexOf(currentSong.id);
      if (idx === -1) db.library.push(currentSong.id);
      else db.library.splice(idx, 1);
      saveDB(db);
      updateLikeBtn();
      renderLibrary();
    });
    audio.addEventListener("ended", () => {
      if (currentSong) {
        const s = db.songs.find(x => x.id === currentSong.id);
        if (s) s.plays = (s.plays || 0) + 1;
        const artist = db.artists.find(a => a.id === s.artistId);
        if (artist) artist.totalStreams = (artist.totalStreams || 0) + 1;
        try { saveDB(db); } catch (_) {}
        renderSongs(); renderArtists(); renderCampaigns();
      }
      if (!currentSong) return;
      const idx = db.songs.findIndex(x => x.id === currentSong.id);
      const next = db.songs[(idx + 1) % db.songs.length];
      setSong(next);
      audio.play().catch(() => {});
    });

    // Rendering lists (defensive)
    function renderArtists() {
      const row = $("#artistsRow");
      if (!row) return;
      row.innerHTML = "";
      (db.artists || []).forEach(a => {
        if (!artistCardTpl) {
          const div = document.createElement("div");
          div.className = "artist-card";
          div.innerHTML = `<div class="artist-art">${(a.name||"")[0]||"A"}</div><div class="artist-name">${a.name}</div><div class="artist-meta">${a.bio || ""}</div>`;
          const btn = document.createElement("button");
          btn.textContent = "View Campaign";
          btn.className = "view-campaign-btn";
          btn.addEventListener("click", () => openCampaignForArtist(a.id));
          div.appendChild(btn);
          row.appendChild(div);
          return;
        }
        const tpl = artistCardTpl.content.cloneNode(true);
        tpl.querySelector(".artist-art") && (tpl.querySelector(".artist-art").textContent = (a.name || "").split(" ").map(s => s[0]).slice(0, 2).join(""));
        tpl.querySelector(".artist-name") && (tpl.querySelector(".artist-name").textContent = a.name);
        tpl.querySelector(".artist-meta") && (tpl.querySelector(".artist-meta").textContent = a.bio + " · " + (a.totalStreams || 0) + " streams");
        const btn = tpl.querySelector(".view-campaign-btn");
        btn && btn.addEventListener("click", () => openCampaignForArtist(a.id));
        row.appendChild(tpl);
      });
    }

    function renderSongs() {
      const tbody = $("#songsTable tbody");
      if (!tbody) return;
      tbody.innerHTML = "";
      (db.songs || []).forEach((s, idx) => {
        if (!songRowTpl) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${idx+1}</td><td>${s.title}</td><td>${db.artists.find(a=>a.id===s.artistId)?.name||""}</td><td>${s.duration||""}</td><td>${s.plays||0}</td><td><button class="play-row-btn">Play</button></td>`;
          tr.querySelector("button")?.addEventListener("click", () => playSongById(s.id));
          tbody.appendChild(tr);
          return;
        }
        const tr = songRowTpl.content.cloneNode(true);
        tr.querySelector(".idx") && (tr.querySelector(".idx").textContent = idx + 1);
        tr.querySelector(".title") && (tr.querySelector(".title").textContent = s.title);
        tr.querySelector(".artist") && (tr.querySelector(".artist").textContent = db.artists.find(a => a.id === s.artistId)?.name || "Unknown");
        tr.querySelector(".duration") && (tr.querySelector(".duration").textContent = s.duration || "");
        tr.querySelector(".plays") && (tr.querySelector(".plays").textContent = s.plays || 0);
        const playBtnRow = tr.querySelector(".play-row-btn");
        playBtnRow && playBtnRow.addEventListener("click", () => playSongById(s.id));
        tbody.appendChild(tr);
      });
    }

    function renderCampaigns() {
      const el = document.getElementById("campaignsList");
      if (!el) return;
      el.innerHTML = "";
      if (!Array.isArray(db.campaigns) || db.campaigns.length === 0) {
        el.innerHTML = "<div class='campaign'>No campaigns. Artists can create one below.</div>";
        populateContriSelect();
        return;
      }
      db.campaigns.forEach(c => {
        const art = db.artists.find(a => a.id === c.artistId);
        const total = c.raised || 0;
        const pct = c.target ? Math.min(100, Math.round((total / c.target) * 100)) : 0;
        const div = document.createElement("div");
        div.className = "campaign";
        div.innerHTML = `
          <h3>${art ? art.name : (c.title || "Artist")}</h3>
          <p>Target: ${c.target} · Raised: ${total} (${pct}%)</p>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p>Contributors: ${Array.isArray(c.contributors) ? c.contributors.length : 0}</p>
        `;
        const openBtn = document.createElement("button");
        openBtn.className = "play-row-btn";
        openBtn.textContent = "Open";
        openBtn.addEventListener("click", () => openCampaign(c.id));
        div.appendChild(openBtn);
        el.appendChild(div);
      });
      populateContriSelect();
    }

    function populateContriSelect() {
      const sel = document.getElementById("contriSelect");
      if (!sel) return;
      sel.innerHTML = "";
      (db.campaigns || []).forEach(c => {
        const o = document.createElement("option");
        o.value = c.id;
        o.textContent = (c.title ? c.title : "Campaign") + " — Raised " + (c.raised || 0) + " / " + (c.target || 0);
        sel.appendChild(o);
      });
    }

    function openCampaignForArtist(artistId) {
      const c = db.campaigns.find(x => x.artistId === artistId) || db.campaigns[0];
      if (!c) {
        if (cfArtist) cfArtist.value = db.artists.find(a => a.id === artistId)?.name || "";
        const navBtn = document.querySelector('.nav-btn[data-view="crowdfund"]');
        navBtn && navBtn.click();
        return;
      }
      openCampaign(c.id);
    }

    function openCampaign(id) {
      const c = db.campaigns.find(x => x.id == id);
      if (!c) return alert("Campaign not found");
      let details = `Campaign: ${c.title || "—"}\nTarget: ${c.target}\nRaised: ${c.raised}\nContributors:\n`;
      (c.contributors || []).forEach(con => details += `${con.name || "anon"} — ${con.amount || con.amt}\n`);
      const action = prompt(details + "\nType 'contribute' to contribute, or Cancel.");
      if (action && action.toLowerCase() === "contribute") {
        const name = prompt("Your name (optional):");
        const a = prompt("Amount (in TWE):");
        const n = parseFloat(a);
        if (n > 0) {
          if (crowdfundContract && signer) contributeToCampaignOnchain(parseInt(id, 10), n);
          else {
            const cc = db.campaigns.find(x => x.id == id);
            if (!cc) return alert("Campaign not found (local).");
            cc.raised = (cc.raised || 0) + n;
            cc.contributors = cc.contributors || [];
            cc.contributors.push({ name: name || "anon", amount: n });
            saveDB(db); renderCampaigns();
            alert("Local contribution added.");
          }
        }
      }
    }

    function createCampaignLocal(artist, title) {
      const c = { id: "c" + Date.now(), artistId: artist.id || null, title, target: 1000, raised: 0, contributors: [] };
      db.campaigns.push(c);
      if (artist) artist.campaignId = c.id;
      saveDB(db); renderCampaigns();
    }

    function renderLibrary() {
      const list = $("#libraryList");
      if (!list) return;
      list.innerHTML = "";
      (db.library || []).forEach(id => {
        const s = db.songs.find(x => x.id === id);
        if (!s) return;
        const div = document.createElement("div");
        div.className = "lib-song";
        div.textContent = s.title + " — " + (db.artists.find(a => a.id === s.artistId)?.name || "Unknown");
        div.addEventListener("click", () => playSongById(s.id));
        list.appendChild(div);
      });
      if (!db.library || db.library.length === 0) list.textContent = "No songs saved yet.";
    }

    // -------------------------
    // On-chain integration
    // -------------------------
    let provider = null;
    let signer = null;
    let currentAccount = null;
    let tweContract = null;
    let crowdfundContract = null;

    function clearOnchainInstances() {
      provider = null;
      signer = null;
      tweContract = null;
      crowdfundContract = null;
      currentAccount = null;
    }

    async function connectWallet() {
      if (!window.ethereum) return alert("MetaMask (or another injected wallet) not found.");
      try {
        if (!ETHERS) {
          // try load once more
          await loadEthersIfMissing();
        }
        if (!window.ethers) return alert("Ethers library not available; install/enable it or use the offline demo.");
        // create provider + signer depending on version
        if (isV6) {
          provider = new ETHERS.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          signer = await provider.getSigner();
          currentAccount = await signer.getAddress();
          tweContract = new ETHERS.Contract(TWE_CA, TWE_ABI, signer);
          crowdfundContract = new ETHERS.Contract(CROWDFUNDING_CA, CROWDFUNDING_ABI, signer);
        } else if (isV5) {
          provider = new ETHERS.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          signer = provider.getSigner();
          currentAccount = await signer.getAddress();
          tweContract = new ETHERS.Contract(TWE_CA, TWE_ABI, signer);
          crowdfundContract = new ETHERS.Contract(CROWDFUNDING_CA, CROWDFUNDING_ABI, signer);
        } else {
          return alert("Unsupported ethers version or missing library.");
        }

        if (connectBtn) {
          connectBtn.textContent = "Connected: " + currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);
          connectBtn.disabled = true;
        }
        if (disconnectBtn) disconnectBtn.style.display = "inline-block";

        await updateBalances();
        await loadCampaignsOnchainToLocal();
        console.log("Connected", currentAccount);
      } catch (err) {
        console.error("connectWallet error:", err);
        alert("Connection failed (see console).");
      }
    }

    function disconnectWallet() {
      clearOnchainInstances();
      if (connectBtn) { connectBtn.textContent = "Connect"; connectBtn.disabled = false; }
      if (disconnectBtn) disconnectBtn.style.display = "none";
      const nb = document.getElementById("nativeBalance"); if (nb) nb.innerText = "";
      const tb = document.getElementById("tokenBalance"); if (tb) tb.innerText = "";
    }

    connectBtn?.addEventListener("click", connectWallet);
    disconnectBtn?.addEventListener("click", disconnectWallet);

    async function updateBalances() {
      const nbEl = document.getElementById("nativeBalance");
      const tbEl = document.getElementById("tokenBalance");
      if (!provider || !currentAccount) {
        // simulation fallback when not connected (shows random values)
        if (nbEl) nbEl.innerText = `BNB: —`;
        if (tbEl) tbEl.innerText = `TWE: —`;
        return;
      }
      try {
        let nativeRaw = await provider.getBalance(currentAccount);
        let nativeFmt = formatEther(nativeRaw);
        if (nbEl) nbEl.innerText = `BNB: ${parseFloat(nativeFmt).toFixed(6)}`;

        if (!tweContract) {
          tweContract = isV6 ? new ETHERS.Contract(TWE_CA, TWE_ABI, provider) : new ETHERS.Contract(TWE_CA, TWE_ABI, provider);
        }
        const decimals = await (tweContract.decimals ? tweContract.decimals() : (await tweContract.functions.decimals())[0]);
        const rawBal = await (tweContract.balanceOf ? tweContract.balanceOf(currentAccount) : tweContract.functions.balanceOf(currentAccount));
        const tokenFormatted = formatUnits(rawBal, decimals);
        if (tbEl) tbEl.innerText = `TWE: ${parseFloat(tokenFormatted).toFixed(6)}`;
      } catch (err) {
        console.error("updateBalances error:", err);
        // fallback to simulated values if call fails
        if (nbEl) nbEl.innerText = `BNB: —`;
        if (tbEl) tbEl.innerText = `TWE: —`;
      }
    }

    // Load campaigns onchain into local db
    async function loadCampaignsOnchainToLocal() {
      if (!crowdfundContract || !provider) {
        renderCampaigns();
        return;
      }
      try {
        const countBn = await crowdfundContract.campaignCount();
        const count = Number(countBn.toString ? countBn.toString() : countBn);
        db.campaigns = [];
        for (let i = 0; i < count; i++) {
          const c = await crowdfundContract.getCampaign(i);
          // returns (artist, name, goal, raised, active, revenue)
          const artistAddr = c[0];
          const name = c[1];
          const goalRaw = c[2];
          const raisedRaw = c[3];
          const active = c[4];
          const decimals = await tweContract.decimals();
          const goal = parseFloat(formatUnits(goalRaw, decimals));
          const raised = parseFloat(formatUnits(raisedRaw, decimals));
          db.campaigns.push({
            id: i.toString(),
            artistId: null,
            artistAddr,
            title: name,
            target: goal,
            raised,
            contributors: [],
            active
          });
        }
        saveDB(db); renderCampaigns(); populateContriSelect();
      } catch (err) {
        console.error("loadCampaignsOnchainToLocal error:", err);
        renderCampaigns();
      }
    }

    async function createCampaignOnchain() {
      if (!crowdfundContract || !signer) return alert("Connect wallet first to create campaign on-chain.");
      const artistName = (cfArtist && cfArtist.value) ? cfArtist.value.trim() : "";
      const targetInput = (cfTarget && cfTarget.value) ? cfTarget.value.trim() : "";
      if (!artistName || !targetInput) return alert("Fill artist name and target amount.");
      try {
        const decimals = await tweContract.decimals();
        const goalUnits = parseUnits(targetInput.toString(), decimals);
        const tx = await crowdfundContract.createCampaign(artistName, goalUnits);
        // handle v5/v6 tx differences
        if (tx.wait) await tx.wait();
        alert("Campaign created on-chain!");
        await loadCampaignsOnchainToLocal();
      } catch (err) {
        console.error("createCampaignOnchain error:", err);
        alert("Failed to create campaign on-chain (see console).");
      }
    }

    async function contributeToCampaignOnchain(campaignId, amount) {
      if (!crowdfundContract || !tweContract || !signer) return alert("Connect wallet first to contribute.");
      try {
        const decimals = await tweContract.decimals();
        const amountUnits = parseUnits(amount.toString(), decimals);
        // Approve
        const approveTx = await tweContract.approve(CROWDFUNDING_CA, amountUnits);
        if (approveTx.wait) await approveTx.wait();
        // Contribute
        const tx = await crowdfundContract.contribute(campaignId, amountUnits);
        if (tx.wait) await tx.wait();
        alert("Contribution successful on-chain!");
        await updateBalances();
        await loadCampaignsOnchainToLocal();
      } catch (err) {
        console.error("contributeToCampaignOnchain error:", err);
        alert("Contribution failed (see console).");
      }
    }

    // Wire up create / contribute UI
    if (createCampaignBtn) {
      createCampaignBtn.addEventListener("click", async () => {
        if (crowdfundContract && signer) await createCampaignOnchain();
        else {
          const artistName = (cfArtist && cfArtist.value) ? cfArtist.value.trim() : "";
          const target = (cfTarget && cfTarget.value) ? parseFloat(cfTarget.value) : 0;
          if (!artistName || !target) return alert("Fill artist and target for local campaign.");
          const artist = db.artists[0] || { id: "a_local", name: artistName };
          createCampaignLocal(artist, artistName + " — " + target);
          alert("Local campaign created (offline demo).");
        }
      });
    }

    if (contributeBtn) {
      contributeBtn.addEventListener("click", async () => {
        const sel = document.getElementById("contriSelect");
        const selected = sel && sel.value ? sel.value : null;
        const amountStr = (document.getElementById("contriAmount") && document.getElementById("contriAmount").value) ? document.getElementById("contriAmount").value : null;
        const name = (document.getElementById("contriName") && document.getElementById("contriName").value) ? document.getElementById("contriName").value : "anon";
        if (!selected || !amountStr) return alert("Select a campaign and enter amount.");
        const amount = parseFloat(amountStr);
        if (crowdfundContract && signer) {
          await contributeToCampaignOnchain(Number(selected), amount);
        } else {
          const c = db.campaigns.find(x => x.id == selected);
          if (!c) return alert("Campaign not found.");
          c.raised = (c.raised || 0) + amount;
          c.contributors = c.contributors || [];
          c.contributors.push({ name, amount });
          saveDB(db); renderCampaigns(); populateContriSelect();
          alert("Local contribution added (offline).");
        }
      });
    }

    // -------------------------
    // Search & nav wiring
    // -------------------------
    const views = {
      home: $("#homeView"),
      crowdfund: $("#crowdfundView"),
      search: $("#searchView"),
      library: $("#libraryView")
    };
    function switchView(name) {
      Object.values(views).forEach(v => v && v.classList.remove("active"));
      views[name] && views[name].classList.add("active");
      if (name === "library") renderLibrary();
    }
    Array.from(document.querySelectorAll(".nav-btn") || []).forEach(b => {
      b.addEventListener("click", () => switchView(b.dataset.view));
    });

    const searchInput = $("#searchInput");
    const searchResults = $("#searchResults");
    function runSearch(q) {
      if (!searchResults) return;
      q = (q || "").toLowerCase();
      searchResults.innerHTML = "";
      (db.songs || []).filter(s => (s.title || "").toLowerCase().includes(q) || (db.artists.find(a => a.id === s.artistId)?.name || "").toLowerCase().includes(q))
        .forEach(s => {
          const div = document.createElement("div");
          div.className = "search-song";
          div.textContent = s.title + " — " + (db.artists.find(a => a.id === s.artistId)?.name || "Unknown");
          div.addEventListener("click", () => playSongById(s.id));
          searchResults.appendChild(div);
        });
      (db.artists || []).filter(a => (a.name || "").toLowerCase().includes(q)).forEach(a => {
        const div = document.createElement("div");
        div.className = "search-artist";
        div.textContent = "Artist: " + a.name;
        div.addEventListener("click", () => openCampaignForArtist(a.id));
        searchResults.appendChild(div);
      });
    }
    if (searchInput) searchInput.addEventListener("input", e => runSearch(e.target.value));

    // -------------------------
    // Initial render & defaults
    // -------------------------
    function initialRender() {
      renderArtists();
      renderSongs();
      renderCampaigns();
      renderLibrary();
      populateContriSelect();
      try { audio.volume = parseFloat($("#volume") ? $("#volume").value : 0.8); } catch (_) {}
      if (db.songs && db.songs.length) setSong(db.songs[0]);
    }
    initialRender();

    // Expose debug helpers
    window.tunewave_onchain = {
      connectWallet,
      disconnectWallet,
      updateBalances,
      loadCampaignsOnchainToLocal,
      TWE_CA,
      CROWDFUNDING_CA,
      isEthersV6: isV6,
      isEthersV5: isV5
    };

    // Auto refresh balances periodically:
    setInterval(async () => {
      try {
        if (provider && currentAccount) await updateBalances();
        else {
          // when disconnected, show simulated values for preview (so header doesn't look empty)
          const nbEl = document.getElementById("nativeBalance");
          const tbEl = document.getElementById("tokenBalance");
          if (nbEl && !provider) nbEl.innerText = `BNB: ${(Math.random() * 2).toFixed(3)}`;
          if (tbEl && !provider) tbEl.innerText = `TWE: ${(Math.random() * 800).toFixed(2)}`;
        }
      } catch (_) {}
    }, 8000);

    // If the wallet is already connected in the provider session, attempt to fetch balances (best-effort)
    try {
      if (window.ethereum && (window.ethereum.selectedAddress || (window.ethereum.request && typeof window.ethereum.request === "function"))) {
        // do not auto-connect popup; only refresh if user already had connection
        // call updateBalances only if ETHERS and provider exist
        // (we avoid auto-requesting accounts to respect privacy)
        if (window.ethers) {
          // try building a provider to check connection state
          try {
            if (isV6) {
              const tmpProv = new ETHERS.BrowserProvider(window.ethereum);
              const accounts = await tmpProv.send("eth_accounts", []);
              if (accounts && accounts.length) {
                // user previously connected in this session
                provider = new ETHERS.BrowserProvider(window.ethereum);
                signer = await provider.getSigner();
                currentAccount = await signer.getAddress();
                tweContract = new ETHERS.Contract(TWE_CA, TWE_ABI, provider);
                crowdfundContract = new ETHERS.Contract(CROWDFUNDING_CA, CROWDFUNDING_ABI, provider);
                await updateBalances();
                await loadCampaignsOnchainToLocal();
                if (connectBtn) { connectBtn.textContent = "Connected: " + currentAccount.slice(0,6) + "..." + currentAccount.slice(-4); connectBtn.disabled = true; }
                if (disconnectBtn) disconnectBtn.style.display = "inline-block";
              }
            } else if (isV5) {
              const tmpProv = new ETHERS.providers.Web3Provider(window.ethereum);
              const accounts = await tmpProv.send("eth_accounts", []);
              if (accounts && accounts.length) {
                provider = tmpProv;
                signer = provider.getSigner();
                currentAccount = await signer.getAddress();
                tweContract = new ETHERS.Contract(TWE_CA, TWE_ABI, provider);
                crowdfundContract = new ETHERS.Contract(CROWDFUNDING_CA, CROWDFUNDING_ABI, provider);
                await updateBalances();
                await loadCampaignsOnchainToLocal();
                if (connectBtn) { connectBtn.textContent = "Connected: " + currentAccount.slice(0,6) + "..." + currentAccount.slice(-4); connectBtn.disabled = true; }
                if (disconnectBtn) disconnectBtn.style.display = "inline-block";
              }
            }
          } catch (err) { /* ignore pre-connect checks */ }
        }
      }
    } catch (_) {}

  })(); // end init

})(); // end IIFE
