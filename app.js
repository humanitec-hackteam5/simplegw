
const createError = require("http-errors");
const express = require("express");
const proxy = require("express-http-proxy");
const logger = require("morgan");

// Environmental variable for configuring backend
const PRODUCT_BE_SERVER_URL=process.env.PRODUCT_BE_SERVER_URL || "PRODUCT_BE_SERVER_URL";


const app = express();


app.use(logger("dev"));
app.use(express.json());


// Read entire environment
// Filter environment based on variables prefixed with GWRULE
// Sort them
const rules = Object.entries(process.env)
  .filter(v => v[0].startsWith("GWRULE"))
  .sort((a,b) => a[0].localeCompare(b[0]))
  .map(r => r[1].split("|"))
  .map(r => {
    return {
     prefix: r[0],
     pattern: new RegExp(r[1])
   };
  });

rules.forEach(rule => {
  app.use('/', proxy(rule.prefix, {
    filter: function(req, res) {
      return req.path.match(rule.pattern);
    }
  }));
});



app.use("/api", proxy(PRODUCT_BE_SERVER_URL));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    if (err.code === "ENOTFOUND") {
      console.error(`Unable to find host "${err.host}"`);
    } else if (err.code === "ECONNREFUSED") {
      console.error(`Unable to connect to host "${err.address} on port ${err.port}. Connection Refused."`);
    }

  console.log(err);
  // set locals, only providing error in development
  res.status(err.status || 500);
  res.send(err.message);
  next();
});

module.exports = app;
