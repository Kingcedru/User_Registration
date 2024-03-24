const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

mongoose
  .connect("mongodb+srv://byishimocedrick:king@users.cicbbds.mongodb.net/")
  .then((response) => {
    console.log("Connected");
  })
  .catch((err) => console.log(err));

const Users = require("./model/Users");

app.use(express.json());

authCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "success");
    req.userData = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ message: "No allowed to access" });
  }
};

app.get("/users", authCheck, (req, res) => {
  Users.find()
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/users", async (req, res) => {
  try {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        let user = new Users({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then((response) => {
            res.status(201).send(user);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Auth failed" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          email: user.email,
          password: user.password,
        },
        "success",
        {
          expiresIn: "1h",
        }
      );
      return res.json({ message: "Auth successful", token: token });
    } else {
      res.status(401).json({ message: "Auth failed" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/users/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const user = await Users.findById(id);
    if (!user) {
      res.send("User not found");
    }
    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/users/:id", (req, res) => {
  Users.deleteOne({ _id: req.params.id })
    .then((response) => {
      res.json({ message: "success" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.patch("/users/:id", (req, res) => {
  Users.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
});

app.listen(5000);
