import express from "express";
import fs from "fs";
import { promisify } from "util";
import Constants from "../Constants";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const router = express.Router();

router.get("/teste", (req, res) => {
  res.send("Funcionou!!!");
});

router.post("/", async (req, res) => {
  try {
    let gradeOriginal = req.body;

    const data = JSON.parse(await readFile(Constants.GRADES_FILENAME));

    let grade = { id: data.nextId++ };
    grade = { ...grade, ...gradeOriginal, timestamp: new Date() };

    data.grades.push(grade);

    await writeFile(Constants.GRADES_FILENAME, JSON.stringify(data));
    res.send(grade);
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
});

router.put("/", async (req, res) => {
  try {
    let gradeToUpdate = req.body;

    const data = JSON.parse(await readFile(Constants.GRADES_FILENAME));

    const index = data.grades.findIndex(
      (grade) => grade.id === gradeToUpdate.id
    );

    if (index === -1) {
      res.status(400).send({ error: "Registro não encontrado!" });
      return;
    }

    data.grades[index].student = gradeToUpdate.student;
    data.grades[index].subject = gradeToUpdate.subject;
    data.grades[index].type = gradeToUpdate.type;
    data.grades[index].value = gradeToUpdate.value;
    data.grades[index].timestamp = new Date();

    await writeFile(Constants.GRADES_FILENAME, JSON.stringify(data, null, 2));

    res.send(data.grades[index]);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteId = req.params.id;
    const data = JSON.parse(await readFile(Constants.GRADES_FILENAME));
    const dataBkp = { ...data };
    data.grades = data.grades.filter(
      (grade) => grade.id !== parseInt(deleteId)
    );

    if (Object.keys(data.grades).length === dataBkp.grades.length) {
      res.status(400).send({ error: "Registro não encontrado!" });
      return;
    }

    await writeFile(Constants.GRADES_FILENAME, JSON.stringify(data, null, 2));
    res.send("Registro deletado com sucesso!");
  } catch (err) {
    console.log(err);
  }
});

router.get("/gradeId/:id", async (req, res) => {
  try {
    const gradeId = req.params.id;
    const data = JSON.parse(await readFile(Constants.GRADES_FILENAME));
    const grade = data.grades.filter((grade) => grade.id === parseInt(gradeId));

    if (grade.length === 0) {
      res.status(400).send({ error: "Registro não encontrado!" });
      return;
    }

    res.send(JSON.stringify(grade));
  } catch (err) {
    console.log(err);
  }
});

router.get("/nota-total", async (req, res) => {
  try {
    const student = req.query.student;
    const subject = req.query.subject;

    const data = JSON.parse(await readFile(Constants.GRADES_FILENAME));
    const grades = data.grades.filter(
      (grade) =>
        !!grade.student.match(student) && !!grade.subject.match(subject)
    );

    const totalValue = grades
      .map((grade) => grade.value)
      .reduce((acc, value) => (acc += value));

    res.send(`${totalValue}`);
  } catch (err) {
    console.log(err);
  }
});

router.get("/media-grades", async (req, res) => {
  try {
    const subject = new RegExp(req.query.subject);
    const type = new RegExp(req.query.type.replace("+", " "));
    const data = JSON.parse(await readFile(Constants.GRADES_FILENAME));

    const grades = data.grades.filter(
      (grade) => !!grade.subject.match(subject) && !!grade.type.match(type)
    );
    const media =
      grades &&
      grades
        .map((grade) => grade.value)
        .reduce((acc, value) => (acc += value), 0) / grades.length;
    res.send(`media: ${media}`);
  } catch (err) {
    console.log(err);
  }
});

router.get("/melhores-grades", async (req, res) => {
  try {
    const subject = new RegExp(req.query.subject.toLowerCase());
    const type = new RegExp(req.query.type.replace("+", " ").toLowerCase());

    const data = JSON.parse(await readFile(Constants.GRADES_FILENAME));

    const grades = data.grades
      .filter(
        (grade) =>
          !!grade.subject.toLowerCase().match(subject) &&
          !!grade.type.toLowerCase().match(type)
      )
      .sort((a, b) => {
        if (a.value < b.value) {
          return 1;
        }
        if (a.value > b.value) {
          return -1;
        }
        return 0;
      })
      .filter((grade, index) => {
        return index < 3;
      });

    res.send(grades);
  } catch (err) {
    console.log(err);
  }
});

export default router;
