//using router
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const mongoose = require("mongoose");
const path = require("path");

// //database connection
mongoose.connect(
  "mongodb+srv://BhargavPattanayak:bhargav00007@cluster0.npaegrt.mongodb.net/Mental"
);
var db = mongoose.connection;
db.on("error", () => {
  console.log("Error in Connecting to Database");
});
db.once("open", () => {
  console.log("Connected to Database in USERS");
});
const userSchema = new mongoose.Schema({
  Name: String,
  password: String,
});
USER = mongoose.model("User", userSchema);
//todo
// 1. some variable is storing user in server --> remove that variable
// 2. null placing in message db when no user (bug occurs when u signout on diff place and upload on diff page)
// 3. change sessionStorage --> localStorage before deploying
// 4. also check on multiple browsers

// -------------------------------------C O D E   S T A R T S   H E R E------------------------------------

var sendingJSON = { status: "null", requestType: "null", userName: "null" };
module.exports.auth = sendingJSON;

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "sign.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

//-------------------------------------------THE INCREDIBLE POST REQUEST------------------------------

router.post("/data", async (req, res) => {
  // console.log("REQUEST:", req.body);
  //if else for sign-in/up/out
  if (typeof req.body != "undefined") {
    //signUp
    if (typeof req.body.cpassword != "undefined") {
      //if cpassword is a field in form -> run this code
      var functionResponse = await insertUser(req.body.name, req.body.password);
      //if-else for success or fail
      if (functionResponse == false) {
        sendingJSON = {
          status: "failed",
          requestType: "signUp",
          userName: "null",
        };
      } else {
        sendingJSON = {
          status: "success",
          requestType: "signUp",
          userName: functionResponse,
        };
      }
      module.exports.auth = sendingJSON;
      res.redirect("/user/");

      // ----------------------------------------------SIGN IN----------------------------------------------
    } else if (typeof req.body.password != "undefined") {
      //sign-in code goes here
      var functionResponse = await loginUser(req.body.name, req.body.password);
      //if-else for success or fail
      if (functionResponse != false) {
        res.render("upload", { userData: functionResponse });
      }
    }

    //-----------------------------------------S I G N - O U T---------------------------------------------
    else {
      //sign-out code here
      res.redirect("/user");
    }
  } else if (typeof req.body == "undefined") {
    // console.log("no body");
    res.send("No body found you're good!");
  }
});

//-------------------------FUNCTIONS---------------------------------

//signup function
async function insertUser(name, password) {
  var data = new USER({ Name: name, password: password });
  try {
    var already = await USER.findOne({ Name: name });
    if (already == null) {
      await data.save();
      console.log("Welcome to EchoChamber " + data.Name);
      return data.Name; //return userName to the variable where the fn was called
    } else {
      //userName taken
      res.send("Username Already Taken");
      return false;
    }
  } catch (e) {
    console.log(e.message);
  }
}

//login function
async function loginUser(name, password) {
  try {
    var data = await USER.findOne({ Name: name, password: password });
    if (data == null) {
      console.log("DB said:", name, "+", password, "not in use");
      return false;
    } else {
      console.log("How have you been " + data.Name);

      return data.Name; //return userName to the variable where the fn was called
    }
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = router;
