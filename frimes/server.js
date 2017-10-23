'use strict'
var utf=require('urlencode');
var express=require('express');
var app=express();
const fs=require('fs');
var url=require('url')
var http = require('http');
var port=80,mainUrl="frimes.ru";
var bodyParser = require('body-parser');


function client (obj){
	
    function getPage(db,path,del,conf){
        return function(req, res){
    obj.collection(db).find({},del,conf).toArray(function(err, docs) {
	res.render(path,{body:JSON.stringify(docs)})
        
    })
    
}
    }
    
		function getVideo (){
      
        
            
		return function (req, res) {
           
                    function   getRecommendation(obj,collection,res){
  
    collection.aggregate(obj).toArray(function(err,docs){
                    if(!err&&docs[0]!=undefined){
                        res(docs) 
                    }else{
                   
                    }
                })
                                
                            }
                        


             var parsedUrl=url.parse(req.url)
          //   console.log(parsedUrl.query)
            	var urlMass=parsedUrl.query?parsedUrl.query.split("="):not("notFound",404)(req,res);

    function get(name,resolve,func){        
	collection.aggregate({$match:{[name]:utf.decode(urlMass[1])}},{$limit:1}).toArray(function(err, docs) {

	if(err||docs[0]==undefined){
        console.log('err',err)
not("notFound",503)(req,res);	
		}else{	
    var obj={
        docs: docs[0]
    }    
    }


    resolve(obj)
    })
    }
                var collection=urlMass[0]?obj.collection(urlMass[0]):not("notFound",404)(req,res);

     switch(urlMass[0]){
         case 'films':
          new Promise((resolve,rej)=>{
              get("name",resolve)
          }).then((resultt)=>{
              
new Promise((res,rejj)=>{
           
getRecommendation([{$match:{"info.genres":resultt.docs.info.genres[Math.round((resultt.docs.info.genres.length-1)*Math.random())]}},{$sample:{size:11}},{$project:{"info.imgDes":1,name:1,_id:0,id:1}}],collection,res);

}).then((resul)=>{

                 res.render('playerFilms.ejs',{
                    body:JSON.stringify(resultt.docs),
                     frame:JSON.stringify(resul),
                     name:resultt.docs.name,
                     year:resultt.docs.year,
                     description:resultt.docs.text,
                     })
                 })
             })
             
            break;
    case 'anime':
          new Promise((resolve,rej)=>{
              get("name",resolve)
          }).then((resultt)=>{
              
new Promise((res,rejj)=>{
           
getRecommendation([{$match:{"info.genres":resultt.docs.info.genres[Math.round((resultt.docs.info.genres.length-1)*Math.random())]}},{$sample:{size:11}},{$project:{"info.imgDes":1,name:1,_id:0,id:1}}],collection,res);

}).then((resul)=>{

                 res.render('playerAnime.ejs',{
                    body:JSON.stringify(resultt.docs),
                     frame:JSON.stringify(resul),
                     name:resultt.docs.name,
                     year:resultt.docs.year,
                     description:resultt.docs.text,
                     })
                 })
             })
             
            break;     
         case 'series':
            
                       new Promise((resolve,rej)=>{
                          
              get("id",resolve)
          }).then((resultt)=>{
             
                  new Promise((res,rejj)=>{

                
getRecommendation([{$match:{"info.genres":resultt.docs.info.genres[Math.round((resultt.docs.info.genres.length-1)*Math.random())]}},{$sample:{size:11}},{$project:{"info.imgDes":1,name:1,_id:0,id:1}}],collection,res);

}).then((resul)=>{
               
if(!resultt.docs.link){

                 res.render('player.ejs',{
                    body:JSON.stringify(resultt.docs),
                     frame:JSON.stringify(resul),
                     name:resultt.docs.name,
                     year:resultt.docs.info.year,
                     description:resultt.docs.db.text,
                     })}
else{
      
                     res.render('playerIframe.ejs',{
                    body:JSON.stringify(resultt.docs),
                     frame:JSON.stringify(resul),
                     name:resultt.docs.name,
                     year:resultt.docs.year,
                     description:resultt.docs.text,
                     })
}
                      
                 })
             })
                       
                       break;
                       
                       default:
             console.log("default")
             not("notFound",503)(req,res)             

     }       
            
}
		
	}
	function not (path,code){
    return function (req,res){
            res.statusCode=code;
        res.render(path);
    }}

var server=http.createServer(app)
app.set('view engine', 'ejs');
	app.use(express.static('static'))	
	app.use(bodyParser.json()); 
    	app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/player',getVideo())
app.get('/moontest',function(req,res){
    res.render('moontest.ejs')
})
app.get('/standup',not("notMade.ejs",503))

app.get('/films',getPage('films',"films.ejs",{text:0,"_id":0},{limit:51}))

app.get('/anime',getPage('anime',"anime.ejs",{text:0,"_id":0},{limit:51}))

app.get('/categories',not("notMade.ejs",503))

app.get('/hot',not("notMade.ejs",503))
app.post('/ajax',function(req,res){
   var ajax=req.body

   ajax.obj=JSON.parse(ajax.obj,function(key,val){
       if(typeof val=='string'){
           var xuy=new RegExp(val,'i');
       return xuy
       
       }
       return val
   })
        var collection=obj.collection(ajax.col);
	collection.find(ajax.obj,{text:0,"_id":0},ajax.conf).toArray(function(err, docs) {
	if(err||docs[0]==undefined){
        res.send([])
       res.end()
		}else{	
         
    res.send(docs)
       res.end()
        }
})
})
app.get('/standup',not("notMade.ejs",503))
app.get('/', getPage('series',"index.ejs",{text:0,url:0,link:0,db:0,"_id":0},{limit:51}))

app.use(not("notFound",404))

server.listen(port,mainUrl);

}
		
module.exports=client