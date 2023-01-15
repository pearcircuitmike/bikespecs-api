import express from "express";
import dotenv from "dotenv";
import * as cors from "cors";
import * as fs from "fs";
import _ from "lodash";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const bikedata = require("../data/bikes.json");

var app = express();

app.use(express.json()); // enables json to work

// Endpoint to Get a list of bikes
app.get("/bikes", paginatedResults(bikedata), function (req, res) {
  res.json(res.paginatedResults); // you can also use res.send()
});

// Endpoint to get a list of all IDs
app.get("/bikeids", function (req, res) {
  const idList = _.map(bikedata, "id");
  res.json(idList); // you can also use res.send()
});

// Endpoint to get a bike by id
app.get("/bikes/:id", function (req, res) {
  const id = req.params.id;
  let bikedetails;

  try {
    bikedetails = _.chain(bikedata).keyBy("id").at(id).value();
    // console.log(bikedetails);
    res.json(bikedetails[0]); // you can also use res.send()
  } catch (err) {
    return res.sendStatus(404);
  }
});

// Create a server to listen at port 8080
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  //console.log("REST API demo app listening at http://%s:%s", host, port);
});

// paginated function for reuse
function paginatedResults(model) {
  return (req, res, next) => {
    //paginate
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // return paginated data
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // creating response object, including info on next and prev pages
    const results = {};

    if (endIndex < results.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = model.slice(startIndex, endIndex);
    res.paginatedResults = results;
    next();
  };
}
