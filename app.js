// 🎵 Demo Songs (just the files you uploaded in repo root)
const demoSongs = [
  {
    title: "Chill Vibes",
    artist: "Demo Artist",
    duration: "3:20",
    plays: 1200,
    url: "song1.mp3"   // file at repo root
  },
  {
    title: "Top Hit",
    artist: "Demo Artist 2",
    duration: "2:45",
    plays: 4500,
    url: "song2.mp3"   // file at repo root
  },
  {
    title: "Ocean Drift",
    artist: "Demo Artist 3",
    duration: "4:10",
    plays: 900,
    url: "song3.mp3"   // file at repo root
  }
];

// Load songs into the UI
function loadSongs() {
  const tableBody = document.querySelector("#songsTable tbody");
  tableBody.innerHTML = "";
  demoSongs.forEach((song, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td>${song.title}</td>
      <td>${song.artist}</td>
      <td>${song.duration}</td>
      <td>${song.plays}</td>
      <td><button class="play-row-btn" data-url="${song.url}">Play</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// 🎧 Simple audio player
let audio = new Audio();

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("play-row-btn")) {
    const url = e.target.getAttribute("data-url");
    playSong(url);
  }
});

function playSong(url) {
  audio.src = url;
  audio.play();
  console.log("Playing:", url);
}

// ---------------- Wallet Connect / Disconnect ----------------
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
      console.log("Wallet connected:", currentAccount);
    } catch (error) {
      console.error("User rejected connection:", error);
    }
  } else {
    alert("MetaMask is not installed. Please install it to connect your wallet.");
  }
}

function disconnectWallet() {
  currentAccount = null;
  connectBtn.textContent = "Connect Wallet";
  connectBtn.style.display = "inline-block";
  disconnectBtn.style.display = "none";
  console.log("Wallet disconnected.");
}

if (connectBtn && disconnectBtn) {
  connectBtn.addEventListener("click", connectWallet);
  disconnectBtn.addEventListener("click", disconnectWallet);
}

// ---------------- Initialize ----------------
document.addEventListener("DOMContentLoaded", () => {
  loadSongs(); // show demo songs
});
