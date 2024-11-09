let container;
const width = 300;
const height = 300;
const perspective = 50;

const carSize = 80;
const objectSize = 50;
const gameTime = 15000;

let ground;
const groundWidth = 50000;
const groundHeight = 50000;
const eyeToGround = 30;

let road;
const roadWidth = 300;
const roadHeight = 3000;
const eyeToRoad = eyeToGround - 1;

let message = null;
let continueButton = null;
let startButton = null;
let bgm = null;
let rankingElement = null;
let gameCount = 0;
let updateDistanceNumber = 500;
let latestScoreId = null;

const gameStart = () => {

  if (gameCount >= 1) {
    for (const object of objectList) {
      object.element.remove();
    }
    objectList = [];
    score = 0;
    heroX = 0;
    heroY = 0;
    heroDeg = 0;
    updateDistance = updateDistanceNumber;
    latestScoreId = null;
    if (message) {
      message.remove();
    }

    if (container) {
      container.remove();
    }

    if (ground) {
      ground.remove();
    }

    if (road) {
      road.remove();
    }

    if (startButton) {
      startButton.remove();
    }
    if (bgm) {
      bgm.remove();
    }

    init();
  }
  bgm.play();
  raceStart();
};

const addBGM = () => {

  bgm = document.createElement("audio");
  bgm.src = "GTO.mp3";

  bgm.loop = true;
  bgm.volume = 0.5;
  document.body.appendChild(bgm);

};
const render = () => {
  ground.style.transform = `
    translate3d(${width / 2 - groundWidth / 2}px, ${height / 2 - groundHeight / 2
    }px, 0)
    rotate3d(0, 0, 1, ${-heroDeg}deg)
    translate3d(0,${eyeToGround}px,0)
    rotate3d(1,0,0, 90deg)`;

  road.style.transform = `
    translate3d(${width / 2 - roadWidth / 2}px, ${height / 2 - roadHeight / 2
    }px, 0)
    rotate3d(0, 0, 1, ${-heroDeg}deg)
    translate3d(${-heroX}px,${eyeToRoad}px,0)
    rotate3d(1,0,0, 90deg)
    translate3d(0,${heroY % 100}px,0)
    `;

  for (const object of objectList) {
    const { x, y, element } = object;
    element.style.transform = `
        translate3d(${width / 2 - objectSize / 2}px, ${height / 2 - objectSize / 2
      }px, 0)
        rotate3d(0, 0, 1, ${-heroDeg}deg)
        translate3d(${-heroX}px,${eyeToRoad}px,0)
        rotate3d(1,0,0, 90deg)
        translate3d(${x}px,${heroY - y}px,${objectSize / 2}px)
        rotate3d(1,0,0, -90deg)
        `;
  }
};

const blinkCar = () => {

  let isVisible = true;

  const intervalId = setInterval(() => {
    svg.style.visibility = isVisible ? 'hidden' : 'visible';
    isVisible = !isVisible;
  },100);

  setTimeout(() => {
    clearInterval(intervalId);
    svg.style.visibility = 'visible';
  },1000);

}
let objectList = [];

const createObject = (fromY) => {
  const addObjects = [];
  for (let i = 0; i < 10; i++) {
    const isCoin = Math.random() < 0.7;
    const x = (Math.random() - 0.5) * roadWidth;
    const y = fromY + Math.random() * 1000;
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.width = `${objectSize}px`;
    element.style.height = `${objectSize}px`;
    element.style.fontSize = `${objectSize}px`;
    element.style.overflow = "hidden";
    element.textContent = isCoin ? "💰" : "🗿";

    addObjects.push({ x, y, element, isCoin });
  }
  addObjects.sort((a, b) => a.y - b.y);
  addObjects.forEach((object) =>
    container.insertBefore(object.element, road.nextSibling)
  );

  objectList = [...objectList, ...addObjects];

};
let score = 0;

const checkCollision = (from, to) => {
  let collision = false;

  for (const object of objectList) {
    const { x, y, element, isCoin } = object;
    if (from <= y && y <= to) {
      if (Math.abs(x - heroX) < objectSize / 2) {
        if (isCoin) {
          score += 100;
          element.remove();
          object.willRemove = true;
        } else {
          collision = true;
        }
      } else {
        element.remove();
        object.willRemove = true;
      }
    }
  }
  objectList = objectList.filter((object) => !object.willRemove);
  return collision;
};

let updateDistance = updateDistanceNumber;
let dx = 0;

let svg;
const documentCreate = () => {

  svg = document.getElementsByTagName("svg")[0];
  svg.style.position = "absolute";

  svg.style.width = `${carSize}px`;
  svg.style.height = `${carSize}px`;
  svg.style.top = `${((height - carSize) / 4) * 3}px`;
  svg.style.left = `${(width - carSize) / 2}px`;

  message = document.createElement("div");
  document.body.append(message);
  message.style.position = "absolute";
  message.style.top = `${height}px`;
  message.style.left = `${5}px`;
  message.textContent = "";

  startButton = document.createElement("button");
  startButton.style.position = "absolute";
  startButton.style.padding = "10px 20px";

  startButton.innerHTML = "レーススタート";

  startButton.fontSize = "20px";
  startButton.style.color = "#fff";
  startButton.style.backgroundColor = "#77DD77";
  startButton.style.border = "none";
  startButton.style.display = "block";
  startButton.style.top = `${height + 25}px`;
  startButton.style.left = `${5}px`;
  startButton.style.cursor = "pointer";
  startButton.addEventListener("click", gameStart);

  document.body.append(startButton);

  container = document.createElement("div");
  document.body.insertBefore(container, svg);
  container.style.position = "absolute";
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.left = 0;
  container.style.top = 0;

  container.style.backgroundColor = "#0ff";
  container.style.overflow = "hidden";
  container.style.perspective = `${perspective}px`;

  ground = document.createElement("div");
  container.append(ground);
  ground.style.position = "absolute";
  ground.style.width = `${groundWidth}px`;
  ground.style.height = `${groundHeight}px`;
  ground.style.backgroundColor = "#080";

  road = document.createElement("div");
  container.append(road);
  road.style.position = "absolute";
  road.style.width = `${roadWidth}px`;
  road.style.height = `${roadHeight}px`;
  road.style.backgroundColor = "#00f";

  road.style.background = "linear-gradient(0, #00f 50%, #f00 50%)";
  road.style.backgroundSize = "100px 100px";
  addBGM();



}

// ランキングの表示

const displayRanking = async () => {


  let titleElement, scoreContainer;
  // ランキング全体のコンテナを初期化
  if (!rankingElement) {
    rankingElement = document.createElement("div");
    rankingElement.style.position = "absolute";
    rankingElement.style.top = `${height + 85}px`;
    rankingElement.style.left = `${5}px`;
    document.body.appendChild(rankingElement);
    // タイトル要素を作成して追加
    titleElement = document.createElement("div");
    titleElement.textContent = "■Ranking";
    titleElement.style.fontWeight = "bold";
    rankingElement.appendChild(titleElement);

    scoreContainer = document.createElement("div");
    rankingElement.appendChild(scoreContainer);


  } else {

        // 初期化時にタイトルとスコアリストコンテナを取得
        titleElement = rankingElement.firstChild;
        scoreContainer = rankingElement.lastChild;
        titleElement.textContent = "■Ranking";
        scoreContainer.innerHTML = ""; // 前のスコアリストをクリア
  }

  try {
    const response = await fetch("http://localhost:3000/scores");
    const topScores = await response.json();


    topScores.forEach((score, index) => {
      const scoreElement = document.createElement("div");
      scoreElement.textContent = `${index + 1}. ${score.score
        } (${new Date(score.date).toLocaleString("ja-JP", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })})`;

      if (score.date === latestScoreId) {
        scoreElement.style.color = '#f00';
        titleElement.textContent += " ★更新";
      }

      scoreContainer.appendChild(scoreElement);
    });
  } catch (error) {
    console.log("Failed to fetch scores:", error);
  }
};

const init = () => {


  documentCreate();
  displayRanking();

  const styleSheet = document.createElement("style");
  // @keyframeルールをjavascriptで定義
  const keyframes = `
  @keyframes skyTransition {
    0% {
      background-color: #00ffff; /* シアン: 明るい青空 */
    }
    10% {
      background-color: #87ceeb; /* スカイブルー: 薄い青 */
    }
    20% {
      background-color: #1e90ff; /* ドッジブルー: 濃い青 */
    }
    30% {
      background-color: #6495ed; /* コーンフラワーブルー: 少し紫がかった青 */
    }
    40% {
      background-color: #7b68ee; /* ミディアムスレートブルー: 青紫 */
    }
    50% {
      background-color: #9370db; /* ミディアムパープル: 紫に近づく */
    }
    60% {
      background-color: #cd5c5c; /* インディアンレッド: 夕焼けが始まる赤紫 */
    }
    70% {
      background-color: #ff6347; /* トマト: オレンジがかった赤 */
    }
    80% {
      background-color: #ff4500; /* オレンジレッド: 強いオレンジ */
    }
    90% {
      background-color: #ff8c00; /* ダークオレンジ: 濃いオレンジ */
    }
    100% {
      background-color: #ff8c00; /* 濃いオレンジ: 夕焼けのピーク */
    }
  }`;

  const skyBackground = document.createElement("div");
  document.body.appendChild(skyBackground);
  skyBackground.style.position = "absolute";
  skyBackground.width = "100%";
  skyBackground.height = "100%";
  skyBackground.top = 0;
  skyBackground.height = 0;
  skyBackground.style.zIndex = -1;
  skyBackground.style.animation = `skyTransition ${gameTime / 1000}s forwards`;
  // スタイルシートに追加
  styleSheet.innerHTML = keyframes;
  document.head.appendChild(styleSheet);
  //　アニメーションを適用
 // container.style.animation = `skyTransition ${gameTime / 1000}s forwards`;




  let originalX = -1;
  document.onmousedown = document.ontouchstart = (e) => {
    e.preventDefault();
    if (e.touches && e.touches[0]) {
      e = e.touches[0];
    }
    originalX = e.pageX;
    dx = 0;
  };



  document.onmousemove = document.ontouchmove = (e) => {
    e.preventDefault();
    if (e.touches && e.touches[0]) {
      e = e.touches[0];
    }
    if (originalX !== -1) {
      if (e.pageX - originalX > 0) {
        dx = 1;
      } else if (e.pageX - originalX < 0) {
        dx = -1;
      }
    }
  };
  document.onmouseup = document.ontouchend = (e) => {
    e.preventDefault();
    originalX = -1;
    dx = 0;
  };

  render();
  createObject(500);
  render();
};

// ゲーム終了時にスコアを保存し、ランキングを表示する
const endGame = async () => {

  bgm.pause();
  gameCount++;
  startButton.innerHTML = "再スタート";
  startButton.style.display = "block";

  // 新しいスコアのIDを生成
  latestScoreId = new Date().toISOString();

  // スコアを表示
  try {
    await fetch("http://localhost:3000/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score, date: latestScoreId }),
    });
    displayRanking(); // スコア保存時にランキングを更新表示
  } catch (error) {

    console.error("スコアの保存に失敗しました：", error);
  }

};
let heroX = 0;
let heroY = 0;
let heroDeg = 0;

const raceStart = async () => {

  startButton.style.display = "none";

  //　アニメーションを適用
  container.style.animation = `skyTransition ${gameTime / 1000}s forwards`;


  let v = 0;
  let endTime = Date.now() + gameTime;
  while (true) {
    v += 0.1;
    v -= v ** 3 * 0.0005;
    let leftTime = Math.max(0, (endTime - Date.now()) / 1000);
    message.textContent = `Time: ${leftTime.toFixed(3)} / score:${score}`;
    if (v > 0 && checkCollision(heroY - 30, heroY - 30 + v)) {
      blinkCar();
      v = -v;
    }
    if (heroY > updateDistance) {
      updateDistance += 1000;
      createObject(updateDistance);
    }
    if (dx > 0) {
      if (heroDeg < 0) {
        heroDeg += 2;
      } else {
        heroDeg++;
      }
    } else if (dx < 0) {
      if (heroDeg > 0) {
        heroDeg -= 2;
      } else {
        heroDeg--;
      }
    } else {
      if (heroDeg > 0) {
        heroDeg--;
      } else if (heroDeg < 0) {
        heroDeg++;
      }
    }
    heroDeg = Math.max(Math.min(30, heroDeg), -30);
    heroY += v;
    heroX += dx * 3;
    heroX = Math.max(Math.min(heroX, roadWidth / 2), -roadWidth / 2);

    render();
    if (leftTime === 0) {
      endGame();

      return;
    }
    await new Promise((r) => setTimeout(r, 16));
  }
};



window.onload = init;
