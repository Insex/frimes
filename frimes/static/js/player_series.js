'use strict'
function createPlayer(data){  
    console.log(data)
    var movie = new Vue({
        el:'#movie',
        data:{
            noTrans:function(){
                console.log(data.links[0].translation)
                return data.links[0].translation?false:true
            },
            cifra:cifra,//функция для преобразования 9 в 09
            movie:data,//объект сериала/фильма
            active (val,key){//при обновлении vue, совпадают ли обновлённые перевод,серия,сезон активному объекту фильма, если да то ставим им класс gradient
                if(val==this.frimes[key])return 'gradient';
                
            },
            getEpisodes (seasons,season) {
                    if(!seasons)return [];
                    var eps =  seasons.filter((el)=>{//функция, котороя возвращает массив серий, актуальный выбранному сезону
                        if(el.season_number==season)return el.episodes
                    });
                return eps[0]?eps[0].episodes:[];
            },
            frimes:{//данные об активном видосе
                time:'',
                translation:'',
                season:'',
                serie:'',
                src:'',
                playing:{}//активный объект видоса
            
            },
            change:{// функции выбора сезона\серии\перевода,после выбора пользователем нужного сезона\серии\перевода меняем активный объект сериала и изменяем vue, также заносим изменения в куки
                translation (trans) {
                    let frimes = movie.frimes; 
                    frimes.time=0;
                    frimes.translation = trans;
                    var playing = getTrans(movie.movie.links,trans);
                    Cookies.set('translation',frimes.translation
                                ,cookieExp);
                    var episodes = movie.getEpisodes
                                (playing.seasons,frimes.season);
                    console.log('set trans')
                    if(!episodes[0]){
                        console.log(playing.seasons)
                        movie.change.season
                            (playing.seasons[0].season_number);
                    }
                    else if(episodes.indexOf(frimes.serie)==-1 ){//если данной серии нет в данном переводе, то ставим первую серию
                       frimes.serie = 1;Cookies.set('serie',1, cookieExp);
                        
                    }
                        frimes.playing=playing;
                },
                season (season) {
                    movie.frimes.time=0;
                    movie.frimes.season = season;
                    movie.change.serie(1);
	                Cookies.set('season',movie.frimes.season,cookieExp);
                },
                serie (serie) {
                   console.log('serie',serie)
                   let frimes = movie.frimes; 
                     frimes.time=0;
                     frimes.serie = serie;
                    
	                Cookies.set('serie',frimes.serie,cookieExp);
                }
            }
        }
    })          
    var frimes = movie.frimes;//просто укороченные ссылки, и дефолтый объект для фильма
    var links = movie.movie.links;
    const defaultFrimes = function (){
                movie.change.serie(1);
                movie.change.season(1);
                movie.change.translation(links[0].translation);
                
                return {    
                    serie:1,
                    season:1,
                    translation:links[0].translation,
                    src:links[0].iframe_url
                       }
                };
    var cooks = {// объект с куками
        uid : Cookies.get('uid'),
        trans : Cookies.get('translation'),
        season:Number(Cookies.get('season')),
        serie:Number(Cookies.get('serie')),
        time:Number(Cookies.get('time'))
    };
    console.log(cooks);
    var hash = window.location.hash.substring(1);
    var seriesHash=hash.length>0?hash.split('s').filter((el)=>Number(el)):null;
        seriesHash = seriesHash?{// объект с указанием серии/сезона в url
            season:Number(seriesHash[0]),
            serie:Number(seriesHash[1]),
        }:null;
    
        console.log(cooks.trans,movie.movie.uid==cooks.uid)
    if(cooks.trans&&movie.movie.uid==cooks.uid&&cooks.uid){// если полдьзователь уже открывал сериал
            var trans = getTrans(links,cooks.trans);
            console.log(cooks);
            frimes.translation = cooks.trans;
            frimes.src=trans.iframe_url;
            if(seriesHash){// если еще есть указание серии/сезона в ссылке
                if(findSeason(trans.seasons,seriesHash.season,seriesHash.serie)){//если для данного перевода есть серия указанная в ссылке, то ставим её
                    frimes.season=seriesHash.season;
                    frimes.serie=seriesHash.serie;
                }
                else movie.frimes = findHash(//если нет, то ставим либо первый переовд в котором эта серия есть, либо дефолтный объект
                              links,
                              seriesHash.season,
                              seriesHash.serie
                             );
            }
            else{//если серия/сезон в ссылке не указаны ставим то что было в куках
                console.log('set time')
                frimes.season=cooks.season;
                frimes.serie=cooks.serie;
                frimes.time=cooks.time?cooks.time:0;
            }
        }
    else if(seriesHash) movie.frimes = findHash(//если пользователь сериал не открывал, и сезон/серия в ссылке указаны, то ставим либо первый переовд в котором эта серия есть, либо дефолтный объект
                              links,
                              seriesHash.season,
                              seriesHash.serie
                             );
    else movie.frimes = defaultFrimes();//если ваще нихуя не указано, ставим дефолтный объект
        console.log(movie.frimes);
    movie.frimes.playing = getTrans(links,movie.frimes.translation);
    //после этого ставим куки по умолчанию
    Cookies.set('uid',movie.movie.uid,cookieExp);
    //Cookies.set('serie',movie.frimes.serie);
    //Cookies.set('season',movie.frimes.season);
    //Cookies.set('translation',movie.frimes.translation);
    
    function findHash(arr,season,serie){// функция которая проверяет есть ли данная сезон/серия в массиве, и находит первый попавшийся перевод с данной мерией/сезоном, если не находит возвращает дефолтный объект
        
        for(var i = 0;i<arr.length-1;i++){
            var obj = findSeason(arr[i].seasons,season,serie);
            console.log(obj)
            if(obj) return {
                    serie:obj.serie,
                    season:obj.season[0].season_number,
                    translation:arr[i].translation,
                    src:arr[i].iframe_url
                };
        }
        return defaultFrimes()
 
    
    }
    
    function getTrans(arr,trans){
    return arr.filter((el)=>{
        if(el.translation == trans)return el;
    })[0]
    }

          
    function cifra(num){
    if(Number(num<10))return '0'+num;
    return num;
    }
    
    function findSeason(arr,season,serie){//функция,котороя проверяет существование данного сезоа/серии в массиве, если не находит возвращет ложь
      var seas = arr.filter((el)=>{
        if(el.season_number == season)return el;
    })
      if(seas.length>0&&seas){
          var ser = seas[0].episodes.indexOf(serie);
          return ser==-1?false:{season:seas,serie:seas[0].episodes[ser]};
      }
    }    
}
          
function loc (season,serie){
    window.location.hash=season+'s'+serie;
}