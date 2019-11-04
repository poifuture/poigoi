var inherits = require("inherits");
var MongoDOWN = require("mongodown");

var WrappedMongoDOWN = function() {
  if (!(this instanceof WrappedMongoDOWN)) {
    return new WrappedMongoDOWN();
  }
  MongoDOWN.call(this, process.env.MONGO_URI);
};

inherits(WrappedMongoDOWN, MongoDOWN);

module.exports = WrappedMongoDOWN;
