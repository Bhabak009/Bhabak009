import {getDatabase,ref,set,push, get,child,remove} from "firebase/database";
const axios = require("axios");
var express = require("express");
const cors = require("cors");
const app = express();
const db = require("./firebase");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

function getjson(uid) {
  var p = new Promise((resolve, reject) => {
    get(ref(db, "/" + uid))
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

app.get("/getuser/:uid", (req, res) => {                     //GET DATA FOR ONE USER FROM FIREBASE
  var uid = req.params.uid;
  get(ref(db, "/" + uid))
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
app.post("/setuser", async (req, res) => {                //SET DATA FOR NEW USER OR ADD NEW FIELDS TO USER
  var uid = req.body.uid;
  var data = await getjson(uid);
  if (data)
    set(ref(db, "/" + uid), {
      ...data,
      myphone3: uid + "3",
    });
  else
    set(ref(db, "/" + uid), {
      myphone: uid + "1",
    });

  //  console.log(`data: ${data}`);
  res.json({ response: "done added in database" });
});

app.delete("/deleteuser/:uid", (req, res) => {                         //Route for deleting data of user
  var uid = req.params.uid;
  remove(ref(db, "/" + uid))
    .then(() => {
      res.send("data deleted successfully");
    })
    .catch(() => {
      res.status(400).send("data deletion failed");
    });
});
app.post("/setrandom", async (req, res) => {                //SET DATA FOR NEW USER OR ADD NEW FIELDS TO USER
  var uid = req.body.uid;
  let arrdata = req.body.random.split("=");
  
  var data = await getjson(uid);
  if (data)
    set(ref(db, "/" + uid), {
      ...data,
      [arrdata[0]]: arrdata[1] || 'none',
    });
  else
    set(ref(db, "/" + uid), {
      [arrdata[0]]: arrdata[1] || 'none',
    });

  //  console.log(`data: ${data}`);
  res.json({ response: "done added in database" });
});
module.exports = app;
