'use strict'
var utf=require('urlencode');
var express=require('express');
var app=express();
const fs=require('fs');
var url=require('url')
var http = require('http');
var port=80,mainUrl="localhost";
var bodyParser = require('body-parser');


function client (obj){
	
    function getPage(page,path,del,conf){
        return function(req, res){
    obj.collection(page.col).find({},del,conf).toArray(function(err, docs) {
        if(err){
            
        }
	res.render('index.ejs',{link:page.link,body:JSON.stringify(docs),collection:page.col,title:page.title,headerIndex:page.headerIndex})
        
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
           
getRecommendation([{$match:{"genres":resultt.docs.genres[Math.round((resultt.docs.genres.length-1)*Math.random())]}},{$sample:{size:11}},{$project:{"imgDes":1,name:1,_id:0,id:1}}],collection,res);

}).then((resul)=>{

                 res.render('playerIframe.ejs',{
                     link:'name',
                     title:'Фильм',
                     collection:'films',
                     type:resultt.docs.link?'films':'series',
                     body:JSON.stringify(resultt.docs),
                     frame:JSON.stringify(resul),
                     name:resultt.docs.name,
                     year:resultt.docs.year,
                     description:resultt.docs.text,
                     })
                 })
             })
             
            break;
         case 'cartoons':
          new Promise((resolve,rej)=>{
              get("name",resolve)
          }).then((resultt)=>{
              
new Promise((res,rejj)=>{
           
getRecommendation([{$match:{"genres":resultt.docs.genres[Math.round((resultt.docs.genres.length-1)*Math.random())]}},{$sample:{size:11}},{$project:{"imgDes":1,name:1,_id:0,id:1}}],collection,res);

}).then((resul)=>{

                 res.render('playerIframe.ejs',{
                     link:'name',
                     title:'мультфильм',
                     collection:'cartoons',
                    body:JSON.stringify(resultt.docs),
                     type:resultt.docs.link?'films':'series',
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
           
getRecommendation([{$match:{"genres":resultt.docs.genres[Math.round((resultt.docs.genres.length-1)*Math.random())]}},{$sample:{size:11}},{$project:{"imgDes":1,name:1,_id:0,id:1}}],collection,res);

}).then((resul)=>{

                 res.render('playerIframe.ejs',{
                     link:'name',
                     title:'Аниме',
                     type:resultt.docs.link?'films':'series',
                     collection:'anime',
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
                          
              get("name",resolve)
          }).then((resultt)=>{
             
                  new Promise((res,rejj)=>{

                
getRecommendation([{$match:{"genres":resultt.docs.genres[Math.round((resultt.docs.genres.length-1)*Math.random())]}},{$sample:{size:11}},{$project:{"imgDes":1,name:1,_id:0,id:1}}],collection,res);

}).then((resul)=>{
               
      
                     res.render('playerIframe.ejs',{
                     link:'name',
                     title:'Сериал',
                     collection:'series',
                     type:resultt.docs.link?'films':'series',
                    body:JSON.stringify(resultt.docs),
                     frame:JSON.stringify(resul),
                     name:resultt.docs.name,
                     year:resultt.docs.year,
                     description:resultt.docs.text,
                     })
                      
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

var server=http.createServer((req,res)=>{
    if(req.headers.host!=mainUrl){
        res.statusCode=404;
        res.end()
    }
     else return app(req,res)

})
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

app.get('/films',getPage(
    {col:'films',
     link:'name',
     title:'Поиск фильмов',
     headerIndex:1},
    {db:0,"_id":0},
    {text:0,url:0,link:0},
    {limit:51}))
app.get('/cartoons',getPage(
    {col:'cartoons',
     link:'name',
     title:'Поиск мультфильмов',
     headerIndex:2},
    {db:0,"_id":0},
    {text:0,url:0,link:0},
    {limit:51}))

app.get('/anime',getPage(
    {col:'anime',
     link:'name',
     title:'Поиск аниме',
     headerIndex:3},
    {db:0,"_id":0},
    {text:0,url:0,link:0},
    {limit:51}))

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
app.get('/', getPage(
    {col:'series',
     link:'name',
     title:'Поиск сериалов',
     headerIndex:0},
    {db:0,"_id":0},
    {text:0,url:0,link:0},
    {limit:51}))
app.get('/series', getPage(
    {col:'series',
     link:'name',
     title:'Поиск сериалов',
     headerIndex:0},
    {db:0,"_id":0},
    {text:0,url:0,link:0},
    {limit:51}))
function getNew(conf){
        function concat(arr1,arr2){
        for(var i=0;i<=arr2.length-1;i++){
            arr1.push(arr2[i])
        }
    }
    
   return new Promise((resolve,rej)=>{
var check=0;
const collections=[{col:'anime',url:'name'},{col:'series',url:'name'},{col:'films',url:'name'},{col:'cartoons',url:'cartoons'}];
var array=[];     
    collections.forEach((item,i)=>{

     obj.collection(item.col).find({"date":{$exists:true}},{text:0,"_id":0},conf).toArray(function(err, docs) {
         //concat(array,docs);
         item.docs=docs;
         array=array.concat(item)
         check++;
         if(check==collections.length)resolve(array);
     })
    })

  })
}
    
app.get('/addFilm',(req,res)=>{
    res.render('addFilm.ejs',{
    })
})
app.get('/new',(req,res)=>{
getNew({limit:15,sort:{"date":-1}}).then((ans)=>{
        res.render('new.ejs',{
        data:JSON.stringify(ans)
    })
})        
})
app.post('/addFilm_ajax',function(req,res){
    var ajax=JSON.parse(req.body.ajax);
    console.log({"login":ajax.login.login})
obj.collection('admin').findOne({"login":ajax.login.login},(err,docs)=>{
    if(err||!docs){
            res.send({res:'Логин неверен'})
            res.end()
        return console.log(err)
    };
    console.log(docs)
        if(docs.password==ajax.login.passw){
            console.log('yes')
            obj.collection(ajax.login.col).insertOne(ajax.obj, function(err, response) {
          if(err)return console.log(err)
          res.send({res:'Готово'})
            res.end()
        })
        }
        else{
            res.send({res:'Пароль не верен'})
            res.end()
            console.log(docs.password,ajax.login.passw)
            console.log('no')
        }
    })
})
app.post('/ajax_new',function(req,res){
    var ajax = req.body;
    ajax.sort = {"date":-1};
    getNew(ajax).then((ans)=>{
            res.send(JSON.stringify(ans))
            res.end()
    })
    
})
app.use(not("notFound",404))

server.listen(port,mainUrl);

}
		
module.exports=client