const app = document.getElementById("app");

const startScreen = document.createElement("div");

startScreen.style.display = "flex";
startScreen.style.alignItems = "center";
startScreen.style.justifyContent = "center";
startScreen.style.flexDirection = "column";
startScreen.style.backgroundColor = "#00BFFF";
startScreen.style.height = "100vh";
startScreen.style.color = "#fff";

const title = document.createElement("h1");
title.innerHTML = "ドライバーズハイゲーム";
startScreen.appendChild(title);

const startButton = document.createElement("button");
startButton.style.padding = "10px 20px";
startButton.innerHTML = "始める";
startButton.style.fontSize = "20px";
startScreen.appendChild(startButton);



startButton.addEventListener("click", () => {

  window.location.href = "game.html";
});

app.appendChild(startScreen);
