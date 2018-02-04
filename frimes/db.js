var mongo = require('mongodb').MongoClient;
var server = require('./server.js')


mongo.connect("mongodb://localhost:27017/site",function(err,db){
if(err)return console.log(err)
server(db)

	

})



