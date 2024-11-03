import express from "express";
import fs from "fs/promises";


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("."));

//scoreをファイルから読み込む

const readScores = async () => {
  try {
    const data = await fs.readFileSync("score.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // ファイルが存在しない、または読み込みに失敗した場合は空の配列を返す
    return [];
  }
}; // スコアをファイルに保存する

const writeScores = async (scores) => {
  try {
    await fs.writeFileSync("score.json", JSON.stringify(scores, null, 2));
  } catch (error) {
    console.error("Failed to write scores:", error);
  }
};

// スコアの取得

app.get("/scores", async (req, res) => {
  const scores = await readScores();
  //上位5位のスコアを返す
  res.json(scores.sort((a, b) => b.score - a.score).slice(0, 5));
});

// スコアの保存
app.post("/score", async (req, res) => {
  const { name, score } = req.body;
  if (typeof name === "string" && typeof score === "number") {
    const scores = await readScores();
    scores.push({ name, score });
    await writeScores(scores);
    res.status(201).send("Score added");
  } else {
    res.status(400).send("Invalid input");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
