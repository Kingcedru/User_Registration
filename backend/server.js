const express = require("express");
const mongoose = require("mongoose")
const app = express();

mongoose.connect("mongodb+srv://byishimocedrick:king@users.cicbbds.mongodb.net/")
.then(response=>{
    console.log("Connected")
})
.catch(err=>console.log(err))

app.use(express.json());

app.get("/users", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.post("/users", (req, res) => {
  res.json({
    name: req.body.name,
    email: req.body.email,
    paassword: req.body.password,
  });
});

app.get("/users/:id", (req, res) => {
    let id = req.params.id;
    res.json({id:id})
})

app.listen(5000);
