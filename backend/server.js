const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect("mongodb+srv://byishimocedrick:king@users.cicbbds.mongodb.net/")
  .then((response) => {
    console.log("Connected");
  })
  .catch((err) => console.log(err));

const Users = require("./model/Users");

app.use(express.json());

app.get("/users", (req, res) => {
  Users.find()
  .then(response=>{
    res.send(response)
  })
  .catch(error => {
    console.log(error);
  })
});

app.post("/users", async (req, res) => {
  try {
    let user = await new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    user.save()
    .then(response=>{
        res.status(201).send(user);
    })
    .catch(err=>{
        console.log(err);
    })
  } catch (err) {
    console.log(err);
  }
});

app.get("/users/:id", (req, res) => {
  let id = req.params.id;
  res.json({ id: id });
});

app.listen(5000);
