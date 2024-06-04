const express = require("express");
const app = express();
const port = 3030;

let uniqId = 4;

const fs = require("fs");
const path = require("path");

const joi = require("joi");
const userSchema = joi.object({
  name: joi.string().min(1).required(),
  surname: joi.string().min(1).required(),
  age: joi.number().min(0).required(),
  city: joi.string(),
});

const filePath = path.join(__dirname, "person.json");

app.use(express.json());

app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(filePath));
  res.send({ users });
});

app.get("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync(filePath));
  const user = users.find((item) => item.id === +req.params.id);
  if (user) {
    res.send({ user });
  } else {
    res
      .status(404)
      .send({ user: null, error: "User not found", status: "error" });
  }
});

app.put("/users/:id", (req, res) => {
  const result = userSchema.validate(req.body);
  if (result.error) {
    return res
      .status(404)
      .send({ error: result.error.details, status: "error" });
  }
  const users = JSON.parse(fs.readFileSync(filePath));
  const user = users.find((item) => item.id === +req.params.id);
  if (user) {
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.age = req.body.age;
    user.city = req.body.city;

    fs.writeFileSync(filePath, JSON.stringify(users));
    res.send({ user });
  } else {
    res
      .status(404)
      .send({ user: null, error: "User not found", status: "error" });
  }
});

app.post("/users/", (req, res) => {
  const result = userSchema.validate(req.body);
  if (result.error) {
    return res
      .status(404)
      .send({ error: result.error.details, status: "error" });
  }
  const users = JSON.parse(fs.readFileSync(filePath));
  const user = {
    id: uniqId++,
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age,
    city: req.body.city,
  };
  users.push(user);
  fs.writeFileSync(filePath, JSON.stringify(users));
  res.send({ user });
});

app.delete("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync(filePath));
  const userIndex = users.findIndex((item) => item.id === +req.params.id);
  if (userIndex > -1) {
    users.splice(userIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(users));
    res.send({ users });
  } else {
    res
      .status(404)
      .send({ user: null, error: "User not found", status: "error" });
  }
});

app.listen(port, () => console.log(`Example listening ${port}`));
