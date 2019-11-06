import express from "express";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import cors from "cors";
import PouchDB from "pouchdb";
import ExpressPouchDB from "express-pouchdb";

// Controllers (route handlers)
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
// app.use(bodyParser.json()); // conflict with pouchdb
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
const whitelist = [
  "http://127.0.0.1:8000",
  "https://127.0.0.1:8000",
  "http://localhost:8000",
  "https://localhost:8000",
  "http://poigoi.com",
  "https://poigoi.com",
  "http://poigoi.cn",
  "https://poigoi.cn",
  // fauxton url (same origin)
  "http://localhost:3000",
  "https://localhost:3000",
  "http://poigoi.poiapis.com",
  "https://poigoi.poiapis.com",
  "http://poigoi.poiapis.cn",
  "https://poigoi.poiapis.cn",
  "http://poigoi-server.westus.azurecontainer.io/",
  "https://poigoi-server.westus.azurecontainer.io/"
];
app.use(
  cors({
    origin: (origin: string, callback: any) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

/**
 * Primary app routes.
 */

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);
app.post("/users", apiController.createUser);

/**
 * PouchDB routes.
 */
const PouchDBPrefix = process.env.POUCHDB_PREFIX || "/tmp/poigoi/data/";
const LevelPouchDB = PouchDB.defaults({ prefix: PouchDBPrefix });
// Must be registered at root for fauxton
// app.use("/pouchdb", ExpressPouchDB(LevelPouchDB));
app.use("/", ExpressPouchDB(LevelPouchDB));

export default app;
