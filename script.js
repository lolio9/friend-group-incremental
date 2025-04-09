let playerName = localStorage.getItem("playerName");

if (!playerName) {
  playerName = prompt("Enter your name (only once):");
  if (!playerName) playerName = "Anonymous";
  localStorage.setItem("playerName", playerName);
}

const friends = [
  { name: "Solar", count: 0, required: 0 },
  { name: "Lilith", count: 0, required: 10 },
  { name: "Leo", count: 0, required: 15 },
  { name: "M", count: 0, required: 20 },
  { name: "Sentenza", count: 0, required: 25 },
  { name: "Wovey", count: 0, required: 30 },
  { name: "Moonlight", count: 0, required: 35 },
  { name: "Ari", count: 0, required: 40 },
  { name: "Soulz", count: 0, required: 45 },
  { name: "Joel", count: 0, required: 50 }
];

const buttonsContainer = document.getElementById("buttons-container");
const leaderboardList = document.getElementById("leaderboard");

function renderButtons() {
  buttonsContainer.innerHTML = "";

  friends.forEach((friend, index) => {
    const btn = document.createElement("button");
    btn.className = "friend-button";
    btn.innerHTML = `${friend.name}: <span>${friend.count}</span>`;

    btn.onclick = () => {
      if (index === 0) {
        friend.count += 1;
        updateLeaderboard();
        renderButtons();
        return;
      }

      const prev = friends[index - 1];
      if (prev.count >= friend.required) {
        prev.count -= friend.required;
        friend.count += 1;
        updateLeaderboard();
        renderButtons();
      } else {
        const original = friend.name;
        btn.innerHTML = `You need ${friend.required} ${prev.name}`;
        btn.disabled = true;
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = `${original}: <span>${friend.count}</span>`;
        }, 1500);
      }
    };

    buttonsContainer.appendChild(btn);
  });
}

function updateLeaderboard() {
  const stats = {};
  friends.forEach(f => stats[f.name] = f.count);

  fetch("/leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: playerName, stats })
  });
}

function refreshLeaderboard() {
  fetch("/leaderboard")
    .then(res => res.json())
    .then(data => {
      leaderboardList.innerHTML = "";

      data.forEach(player => {
        const friendNames = friends.map(f => f.name);
        let bestName = "None";
        let bestValue = 0;

        for (let i = friendNames.length - 1; i >= 0; i--) {
          const name = friendNames[i];
          const value = player.stats?.[name] ?? 0;
          if (value > 0) {
            bestName = name;
            bestValue = value;
            break;
          }
        }

        const li = document.createElement("li");
        li.innerHTML = `<strong>${player.name}</strong>: (${bestName}) ${bestValue}`;
        leaderboardList.appendChild(li);
      });
    })
    .catch(err => console.error("Leaderboard load failed:", err));
}

setInterval(refreshLeaderboard, 5000);
renderButtons();
refreshLeaderboard();
