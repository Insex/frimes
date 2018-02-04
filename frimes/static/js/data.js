function getData (dataBase,collection){ 
  const db = collection;//просто константа для коллекции
  const limit = 9;//количество добавляемых элементов при скроллинге
  var find = {
      obj:{//шаблон обЪекта запроса
          conf:{
              limit:limit,
              skip:''
          },
          obj:'{}',
          col:collection
      },
      get:(callBack)=>{//пост запрос к серверу
               console.log('post',find.obj);
               axios.post('/ajax',find.obj)
               .then(callBack)
                    },
      set:(val,skip)=>{//настройка объекта запроса
         find.obj.conf.skip = skip;      
         find.obj.obj = val==''?'{}':JSON.stringify({$or:
                [                  
            {"genres":{$in:[val]}},       
            {"country":{$in:[val]}},
            {"year":val},
            {"rating":val},
            {"name":val},
            {"id":val}
                        ] }) 
                         }
                     }  
        
        var films = new Vue({//выкидывает фильмы на страницу
            el:'.divForFilms',
            data:{
                scrollCheck:true,//флаг который блокирует лишний скролл, до тех пор пока не придут новые объекты из бд
                movies:JSON.parse(dataBase),//изначальные фильмы из бд
            scroll:(e)=>{             
        if(window.pageYOffset+screen.height>=//если высота прокрутки+высота экрана >= чем все высота страницы, кароч если если прокрутка внизу странцы, загрузи ещё фильмов 
        document.documentElement.scrollHeight
        && films.scrollCheck){
                films.scrollCheck=false;  // чек в фолсе, чтобы не было лишних запрос пока объекты приходят
                find.set(input.input,films.movies.length)// шаблонизируем объект значением инпута/ и говорим сколько объектов нужно поставить в параметр skip
                find.get((res)=>{// колбек который вызывается при приходе фильмов
                            console.log('res',res)
                            if(res.data.length==0)return// если количество фильмов == 0, выходим из функциии, т.к нахуй нам заполнять то  чего нет, плюс чек не станет труе, это сделано для того, чтобы когда фильмы подгрузились в максимальном количестве, то не делать лишних запросов к бд
                            films.movies=films.movies.concat(res.data);
                    //соединяем ответ с массивом mvc
                            films.scrollCheck=true;
                        });
                
                }
            }
            },
            methods:{
                //функция для поиска жанров
                setGanre:(arr,i)=>{
                    console.log(arr,i)
                    input.input=arr[i];
                }
            },
            created: function () {
                // событие для скролла
        window.addEventListener('scroll', this.scroll);
            },
        })

        var input = new Vue({
            // в-модель для инпута
            el:'.inp.inpStyle',
            data:{
                input:''
            },
            watch:{
                input:(newVal,oldVal)=>{
                    // при изменении значения инпута делаем запрос к бд
                    console.log(oldVal,newVal)
                    if(newVal!=oldVal)
                    {
    /*------------------------------------------------------------------*/
                        //здесь можно добавить перебор по существующим фильмам, чтобы не спрашивать фильмы из бд, которые уже есть на странице
                        find.set(newVal,0);
                        find.get((res)=>{
                            films.movies=res.data;
                            films.scrollCheck=true;
                        });
                        
                                            }
                }
            }
        })
        input.input=decodeURI(window.location.hash.substring(1));    
        /*var scroll = new Vue({
            el:'body',
            methods:{
                scroll:()=>{
                    console.log('scroll')
                }
            }
        })*/

}