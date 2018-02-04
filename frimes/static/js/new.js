'use strict'
function news (data){
    const limit=15;
    var skip={
        counter:0,
        i:0,
        get(){return limit*this.counter},
        set(num){this.i=num}
    }
    const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    function getMoviesByTime(mass){
        //skip.set(mass.length+skip.get())
        var newArray = [];
        var array = [];
        mass.forEach((it)=>{
            var url={col:it.col,url:it.url}
            it.docs.forEach((item)=>{
                item.url=url;
                item.date=new Date(item.date)
            })
            array=array.concat(it.docs);
        })
        array.sort((a,b)=>{
            return b.date.getTime() - a.date.getTime();
        }).forEach((item,i,arr)=>{
            var itMon=item.date.getMonth();
            if(i==0||itMon!=arr[i-1].date.getMonth()){
                newArray.push({
                    month:months[itMon],
                    year:item.date.getFullYear(),
                    movies:[item]
                })
            }
            else{
                newArray[newArray.length-1].movies.push(item)
            }
        })
        console.log(newArray)
        return newArray;
        
    }
    
            var news = new Vue({
            el:'.new',
            data:{
                scrollCheck:true,
                scroll:(e)=>{
                    if(window.pageYOffset+screen.height>=//если высота прокрутки+высота экрана >= чем все высота страницы, кароч если если прокрутка внизу странцы, загрузи ещё фильмов 
                    document.documentElement.scrollHeight
                    && news.scrollCheck){
                        news.scrollCheck=false;
                        skip.counter++;
                        console.log(skip.counter)
                        axios.post('/ajax_new' , {skip:skip.get(),limit:limit})
                        .then(ans=>{
                    console.log(ans)          
                    getMoviesByTime(ans.data).forEach((item,num,arrF)=>{
                        news.months.forEach((it,i,arr)=>{
                            if(!item)return console.log(item);
                            if(item.year==it.year&&it.month==item.month){
                                it.movies=it.movies.concat(item.movies)
                               item=false;
                            }
                            else {
                                console.log(item);
                              arr.push(item) ;
                                 item=false;
                            }  
                            
                        })
                    })
                        })
                    }
                },
                months:getMoviesByTime(data)
            },
            created: function () {
                // событие для скролла
        window.addEventListener('scroll', this.scroll);
            }
        })
}