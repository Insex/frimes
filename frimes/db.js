var mongo = require('mongodb').MongoClient;
var server=require('./server.js');


mongo.connect( "mongodb://localhost:27017/site",function(err,db){

server(db)

	

})



