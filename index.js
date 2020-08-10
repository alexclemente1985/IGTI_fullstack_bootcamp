import express from "express";
import fs from "fs";
import { promisify } from "util";
import router from "./routes/index";
import Constants from "./Constants";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const app = express();
app.use(express.json());

app.use("/routes", router);

app.listen(2700, async () => {
  console.log("API iniciada!");
  try {
    await readFile(Constants.GRADES_FILENAME);
  } catch (err) {
    const initialJson = {
      nextID: 1,
      grades: [],
    };
    try {
      await writeFile(
        Constants.GRADES_FILENAME,
        JSON.stringify(initialJson)
      ).then(() => {
        console.log("API iniciou e recriou o json de carregamento");
      });
    } catch (err) {
      console.log("Erro: ", err);
    }
  }
});
