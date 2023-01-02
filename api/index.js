import express from "express";
import dotenv from "dotenv";
import * as cors from "cors";
import * as fs from "fs";
import _ from "lodash";

//REST API demo in Node.js

var app = express();

app.use(express.json()); // enables json to work

// Endpoint to Get a list of bikes
app.get("/bikes", function (req, res) {
  fs.readFile(`./data/bikes.json`, "utf8", function (err, data) {
    const bikes = _.map(JSON.parse(data));
    console.log(bikes);
    res.json(bikes); // you can also use res.send()
  });
});

// Endpoint to get a bike by id
app.get("/bikes/:id", function (req, res) {
  const id = req.params.id;
  let bikedetails;

  try {
    fs.readFile(`./data/bikes.json`, "utf8", function (err, data) {
      bikedetails = _.chain(JSON.parse(data)).keyBy("id").at(id).value();
      console.log(bikedetails);
      res.json(bikedetails); // you can also use res.send()
    });
  } catch (err) {
    return res.sendStatus(404);
  }
});

// Create a server to listen at port 8080
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("REST API demo app listening at http://%s:%s", host, port);
});
