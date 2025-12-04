const mongoose = require("mongoose");
const config = require('config')
const dbgr = require('debug')("development:mongoose");

mongoose
  .connect(`${config.get("MONGODB_URI")}/nazakatstudio`)
  .then(() => dbgr("MongoDB connected"))
  .catch(err => dbgr("Error: " + err));

module.exports = mongoose.connection;
