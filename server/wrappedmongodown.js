// @ts-nocheck
/* tslint:disable */
/* eslint-disable */

const inherits = require("inherits");
const MongoDOWN = require("mongodown");

const WrappedMongoDOWN = function() {
  if (!(this instanceof WrappedMongoDOWN)) {
    return new WrappedMongoDOWN();
  }
  MongoDOWN.call(this, process.env.MONGO_URI);
};

inherits(WrappedMongoDOWN, MongoDOWN);

module.exports = WrappedMongoDOWN;
