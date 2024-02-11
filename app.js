import express from 'express';
import charactersData from "./src/characters.json";

const app = express();
const port = 3005;

app.get('/characters', (req, res) => {
  res.send(charactersData.characters);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})