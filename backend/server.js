const express = require("express");
const app = express();

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
