const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
require("dotenv").config();

app.set("views", __dirname);
app.set("view engine", "ejs");

var utcTime = new Date();
var currentdate = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000); //IST
var datetime =
  "Last Sync: " +
  currentdate.getDate() +
  "/" +
  (currentdate.getMonth() + 1) +
  "/" +
  currentdate.getFullYear() +
  " @ " +
  currentdate.getHours() +
  ":" +
  currentdate.getMinutes() +
  ":" +
  currentdate.getSeconds();

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://BhargavPattanayak:bhargav00007@cluster0.npaegrt.mongodb.net/Mental",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// Define MongoDB Schema and Model for News
const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  time: String,
  like: { type: Number, default: "0" },
  dislike: { type: Number, default: "0" },
});
const News = mongoose.model("News", newsSchema);

const likeSchema = new mongoose.Schema({
  like: Number,
});
const Like = mongoose.model("likes", likeSchema);

// Set up middleware for parsing JSON
app.use(express.json());
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));

//usable variables
const user = require(path.join(__dirname, "signin", "user"));
app.use("/user", user);
let likeRecord = [];

// ---------------------------------Define routes for handling news operations--------------------------------
app.get("/upload", (req, res) => {
  res.render("upload", { userData: null });
});

// Example route for retrieving news
app.get("/", async (req, res) => {
  likeRecord = {};
  let rec = await News.find();
  // console.log("rec",rec[0])
  rec.forEach((article) => {
    // console.log("article",article)
    likeRecord[
      "lik" +
        JSON.stringify(article._id).slice(
          1,
          JSON.stringify(article._id).length - 1
        )
    ] = article.like.toString();
    likeRecord[
      "dis" +
        JSON.stringify(article._id).slice(
          1,
          JSON.stringify(article._id).length - 1
        )
    ] = article.dislike.toString();
  });

  res.sendFile(path.join(__dirname, "news.html"));
});

// get put delete

app.get("/api/upload", async (req, res) => {
  const newsList = await News.find();
  // console.log(newsList)
  res.json(newsList);
});

//------------------------------------------------post----------------------------------------------------

// Example route for uploading news
app.post("/api/upload", async (req, res) => {
  const { title, content, image } = req.body;
  let time = new Date().toLocaleString();
  try {
    let newsItem = new News({ title, content, image, time });
    // console.log(typeof newsItem, "\n", newsItem);
    await newsItem.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/like", (req, res) => {
  // console.log("UPDATEREC",req.body)
  // console.log("LIKEREC",likeRecord)

  // comparing each object, if we find difference we update db
  Object.keys(req.body).forEach(async (thumb) => {
    // console.log("req:",req.body[thumb],"saved:",likeRecord[thumb])
    if (req.body[thumb] != likeRecord[thumb]) {
      // console.log(thumb.slice(3)) //id
      //lik
      if (thumb.slice(0, 3) == "lik") {
        // console.log("Like Update Mode")
        let update = await News.findOneAndUpdate(
          { _id: thumb.slice(3) },
          { like: req.body[thumb] }
        );
        // console.log("from DB",update)
        likeRecord[thumb] = req.body[thumb];
      } else if (thumb.slice(0, 3) == "dis") {
        // console.log("Dislike Update Mode")

        let update = await News.findOneAndUpdate(
          { _id: thumb.slice(3) },
          { dislike: req.body[thumb] }
        );
        // console.log("from DB",update)
        likeRecord[thumb] = req.body[thumb];
      }
    }
  });
  res.status(204).send();
});

app.post("/delete", async (req, res) => {
  if (typeof req.body.article == "string") {
    let response = await News.deleteOne({ _id: req.body.article });
  } else {
    req.body.article.forEach(async (art) => {
      let response = await News.deleteOne({ _id: art });
    });
  }
  res.redirect("/delete.html");
});

app.post("/pass", (req, res) => {
  let pass = "undercook";

  if (req.body.passkey == pass) {
    res.sendFile(path.join(__dirname, "upload.html"));
  } else {
    res
      .status(401)
      .send(
        "Wrong Password!  &nbsp &nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp  Ip Adress:198.02.40.7"
      );
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
