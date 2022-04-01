import { application } from "express";
import {getDatabase,ref,set,push,get,child,remove} from "firebase/database";
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

app.get("/getuser/:uid", (req, res) => {
  //GET DATA FOR ONE USER FROM FIREBASE
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
app.post("/setuser", async (req, res) => {
  //SET DATA FOR NEW USER OR ADD NEW FIELDS TO USER
  var uid = req.body.uid;
  var name = req.body.name;
  var email = req.body.email;
  // var data = await getjson(uid);
  // if (data)
  //   set(ref(db, "/" + uid), {
  //     ...data,
  //     myphone3: uid + "3",
  //   });
  // else
  //   set(ref(db, "/" + uid), {
  //     myphone: uid + "1",
  //   });
  set(ref(db, "/" + uid + "/UserDetails"), {
    //Creating info bucket for the user
    name: name,
    email: email,
  })
    .then(() => console.log("added bucket correctly"))
    .catch((err) => console.log(err));

  set(ref(db, "/" + uid + "/Devices/esp32/trigger"), 
    //Creating  bucket for the storing details for Esp32
     false,
  );
  var object = { time: new Date().getTime(), power: 0 };
  set(ref(db, "/" + uid + "/Devices/esp32/powerUsage/0"), 
  
    JSON.stringify(object)
  );
  set(ref(db, "/" + uid + "/Devices/esp32/lastIndex"), 
    //Creating  bucket for the storing details for Esp32

     0
  );
  set(ref(db, "/" + uid + "/Devices/esp32/connectionlog/0"),
    //Creating  bucket for the storing details for Esp32
    new Date().getTime()
  );

  //  console.log(`data: ${data}`);
  res.json({ response: "done added in database" });
});

app.post("/addpower/:uid", async (req, res) => {
  //ADD NEW POWER DATA
  var uid = req.params.uid;
  var power = req.body.power;
  let index = -4;
  get(ref(db, "/" + uid + "/Devices/esp32/lastIndex")).then((snapshot) => {
    if (snapshot.exists()) {
      index = snapshot.val();
      console.log("index:" + index);
    } else {
      index = -1;
    }
    var obj = { time: new Date().getTime(), power: power - 0 };
    set(ref(db, "/" + uid + `/Devices/esp32/powerUsage/${index + 1}`),
       JSON.stringify(obj)
    ).then(() => {
      set(ref(db, "/" + uid + "/Devices/esp32/lastIndex"),
         index + 1,
      );
    });
  });

  res.json({ response: "done added  power data in database" });
});

app.get("/getpower/:uid", async (req, res) => {
  //GET POWER DATA

  var uid = req.params.uid;

  get(ref(db, "/" + uid + "/Devices/esp32/powerUsage"))
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

app.get("/gettrigger/:uid", (req, res) => {
  //API FOR GETTING THE STATUS OF SWITCH
  var uid = req.params.uid;
  get(ref(db, "/" + uid + "/Devices/esp32/trigger"))
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

app.post("/settrigger/:uid", (req, res) => {
  //API FOR TURNING THE SWITCH ON OR OFF
  var uid = req.params.uid;
  var status = req.body.status;
  console.log("set trigger API called");
  var value = status === "true" ? true : false;
  set(ref(db, "/" + uid + "/Devices/esp32/trigger"), 
    
     value
  );
  res.json("trigger changed");
});

app.get("/userdata/:uid", (req, res) => {
  //GET USER DATA BASED ON UID
  var uid = req.params.uid;
  get(ref(db, "/" + uid + "/UserDetails"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        res.send(snapshot.val());
      } else {
        res.status(400).send("No user data available");
      }
    })
    .catch((error) => {
      res.status(400).send("error reading the user data from DB");
    });
});

app.delete("/deleteuser/:uid", (req, res) => {
  //Route for deleting data of user
  var uid = req.params.uid;
  remove(ref(db, "/" + uid))
    .then(() => {
      res.send("data deleted successfully");
    })
    .catch(() => {
      res.status(400).send("data deletion failed");
    });
});
app.post("/setrandom", async (req, res) => {
  //SET DATA FOR NEW USER OR ADD NEW FIELDS TO USER
  var uid = req.body.uid;
  let arrdata = req.body.random.split("=");

  var data = await getjson(uid);
  if (data)
    set(ref(db, "/" + uid), {
      ...data,
      [arrdata[0]]: arrdata[1] || "none",
    });
  else
    set(ref(db, "/" + uid), {
      [arrdata[0]]: arrdata[1] || "none",
    });

  //  console.log(`data: ${data}`);
  res.json({ response: "done added in database" });

});
app.get("/testsum/:uid",async(req,res)=>{
  var uid = req.params.uid;
  let today_year = new Date().getFullYear();
  let date = new Date().getDate();
  let month = new Date().getMonth();
  let start = +new Date(today_year,month,date,0,0,0,0);
  let end= +new Date()
  // let start = 1646937000000;
  // var end = 1646980199999;
  console.log("start:",start);
  console.log("end:",end);
  var powervalues;
  get(ref(db, "/" + uid + "/Devices/esp32/powerUsage"))
  .then((snapshot) => {
    if (snapshot.exists()) {
     powervalues=snapshot.val();
      var objs = powervalues.map((p)=>JSON.parse(p));
      console.log("objs");
     var datas = objs.filter(o=>{return (o.time>=start && o.time<=end)});
     var record_nos=datas.length;
     console.log("power array:",datas);
    // console.log("objs:",objs)
    // var objs2=objs.slice(3,-1);
    //  var original_data = datas.map(data=>JSON.parse(data));
    //  console.log(original_data);
      var sum=0;
    datas.forEach(obj => {
       sum+=parseInt(obj.power);
     });
    console.log("power values:",powervalues);
    console.log("sum:",sum);
    console.log("length of arr:",record_nos);
    let avg = sum/record_nos;
    res.send({power:sum,samples:record_nos});
    } else {
      powervalues=null;
      res.send({power:powervalues,samples:null})
    }
  })
  .catch((error) => {
    console.log("in catch")
   powervalues=null
   res.send({power:powervalues,samples:null})
  });
 
  
})
app.get("/timinggetpower/:uid",async(req,res)=>{
  let minutes = req.query.mins;
  let hours = req.query.hours;
  let days = req.query.days;
  minutes=minutes||hours*60||days*24*60
  
  var uid = req.params.uid;
  let today_year = new Date().getFullYear();
  let date = new Date().getDate();
  let month = new Date().getMonth();
  
  let end= +new Date()
  
  let start = end-minutes*60000;
  // let start = 1646937000000;
  // var end = 1646980199999;
  console.log("start:",start);
  console.log("end:",end);
  var powervalues;
  get(ref(db, "/" + uid + "/Devices/esp32/powerUsage"))
  .then((snapshot) => {
    if (snapshot.exists()) {
     powervalues=snapshot.val();
      var objs = powervalues.map((p)=>JSON.parse(p));
      console.log("objs");
     var datas = objs.filter(o=>{return (o.time>=start && o.time<=end)});
     var record_nos=datas.length;
     console.log("power array:",datas);
    // console.log("objs:",objs)
    // var objs2=objs.slice(3,-1);
    //  var original_data = datas.map(data=>JSON.parse(data));
    //  console.log(original_data);
    //   var sum=0;
    // datas.forEach(obj => {
    //    sum+=parseInt(obj.power);
    //  });
    // console.log("power values:",powervalues);
    // console.log("sum:",sum);
    // console.log("length of arr:",record_nos);
    // let avg = sum/record_nos;
    res.send(datas);
    } else {
      powervalues=null;
      res.send(powervalues)
    }
  })
  .catch((error) => {
    console.log("in catch")
   powervalues=null
   res.send({powervalues})
  });
 
  
})

module.exports = app;
