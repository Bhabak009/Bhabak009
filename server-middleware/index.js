import {getDatabase,ref,set,push, get,child,remove} from "firebase/database";
const axios = require("axios");
var express = require("express");
const cors = require("cors");
const app = express();

// var admin = require("firebase-admin");
// var serviceAccount = require("path/to/serviceAccountKey.json");

function getjson(email) {
  var p = new Promise((resolve, reject) => {
    get(ref(db, "/" + email))
      .then((snapshot) => {
        if (snapshot.exists()) {
          //  console.log(snapshot.val());
          resolve(snapshot.val());
        } else {
          return resolve(null);
        }
      })
      .catch((error) => {
        return resolve(null);
      });
  });
  return p;
}
const db = require("./firebase");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, resp) => {
  resp.send("<h1>this is test index file</h1>");
});

app.get("/getdata/:email", (req, res) => {                     //GET DATA FOR ONE USER FROM FIREBASE
 

  var email = req.params.email;
  get(ref(db, "/" + email))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        res.send(snapshot.val());
      } else {
        res.status(400).send("No data available");
      }
    })
    .catch((error) => {
      res.status(400).send("error reading the data from DB");
    });
});
app.post("/userauth", async (req, res) => {                //SET DATA FOR NEW USER OR ADD NEW FIELDS TO USER
  var email = req.body.email;
  var data = await getjson(email);
  if (data)
    set(ref(db, "/" + email), {
      ...data,
      myphone3: email + "3",
    });
  else
    set(ref(db, "/" + email), {
      myphone: email + "1",
    });

  //  console.log(`data: ${data}`);
  res.json({ response: "done added in database" });
});

app.delete("/deleteuser/:email", (req, res) => {                         //Route for deleting data of user
  var email = req.params.email;
  remove(ref(db, "/" + email))
    .then(() => {
      res.send("data deleted successfully");
    })
    .catch(() => {
      res.status(400).send("data deletion failed");
    });
});
module.exports = app;
