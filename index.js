var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var server = require("http").createServer(app);
var mongoose = require('mongoose');
var request = require('request');


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log("Loaded environment cofinguration")
  }
  
  /**
   * Connect to MongoDB.
   */
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useNewUrlParser', true);
  //mongoose.connect("mongodb://localhost/stezy");
  
  mongoose.connect('mongodb://narendra:narendra@cluster0-shard-00-00-6leor.mongodb.net:27017,cluster0-shard-00-01-6leor.mongodb.net:27017,cluster0-shard-00-02-6leor.mongodb.net:27017/huddl_sales?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',{ useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false });

  
  mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('âœ—'));
    process.exit();
  });
  
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  //app.use(cors())
  app.use(express.Router());
  require(__dirname+'/Routes/Users')(app, request, mongoose);  
  



  app.get("/", function (req, res) {
    res.send("Hello");
  })
  
  server.listen(8080, function () {
    console.log('ready to go!');
  });
  