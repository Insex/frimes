'use strict'	
var Num=0;
var checkEvent=true;
		  function animateDad(firstColor,secondColor,time,elem){

			$(elem).css("color","firstColor")
			$(elem).children("#animateBaby").css("background-color",secondColor)}

	function animatePosters (opacity,time,children,self){$(self).children(children).animate({opacity:opacity},time,"linear")}	  
		  
	  
		  
$("div#animateDad").hover(function(dom){

	animateDad("#e55a4c","#e55a4c",70,this)
	}
,
	function(dom){
	animateDad("#666666","white",70,this)
})
$(document).ready(function(){

$(".playButton").hover(function(dom){
	
	animatePosters(0.4,300,"div#recommendation",this)
},function(){
	
	animatePosters(0.0,300,"div#recommendation",this)
})
$(".playButton").hover(function(dom){
	
	animatePosters(1,300,"#button",this)	
},
function(dom){	

	animatePosters(0.0,300,"#button",this)
})
})

function getMenu (elem,distance,time,bool){
	$(elem).animate({left:distance},{duration:time,easeing:"easein"})

}



$('#buttonOut').on('click',function(obj){
	if(checkEvent){
    checkEvent=false;   
 $('#menu').css('box-shadow','0.5px 30px 40px -8px rgb(110, 110, 110)')  
	getMenu('#menu','55%',150) 
 
    
    $('.menuBlock').css('display','block')
    $('html').css('overflow-y','hidden')
    
        console.log('button:'+checkEvent)
  setTimeout(function(){  
    	$('.touch').on('click',function(obj){
            if(!checkEvent){
     $('#menu').css('box-shadow','none')              
    $('.menuBlock').css('display','none')
    $('html').css('overflow-y','visible')
      checkEvent=true;
                    console.log('.touch:'+checkEvent)
	getMenu('#menu','100%',150)
        $('.touch').unbind('click');}                     
})},3)} 
})




$('.svgStripe').on('mouseover',function(){
	$('#tool').css('opacity',1)
	
})
$('.svgStripe').on('mouseout',function(){
	$('#tool').css('opacity',0)
	
})




function select(elem,selectElem,arrow,serie){
			 function style (angle,css){
			return function(){
				console.log('style')
	$(selectElem).css('display',css);
	arrow.rotate(angle)	;
		}}
	
	
	function touchleave (){
		style({angle:0,animateTo:90},'block')();
setTimeout(() => {
	$('html').on('touchstart',function (e) {	
	e.target.className.indexOf(serie)==-1?style({angle:90,animateTo:0},'none')():''
	$(this).unbind('touchstart')
		})},1)
	}
	
	
	function leave () {
		style({angle:0,animateTo:90},'block')()
		elem.on('mouseleave',style({angle:90,animateTo:0},'none'))
	}
	

'ontouchstart' in document.documentElement?
elem.on('touchstart',touchleave):
elem.on('mouseenter',leave);
	
}
select($('.selectSeason'),'.selectSeasonDown',$("#arrowSeason"),'season')
select($('.selectSerie'),'.selectSerieDown',$("#arrowSerie"),'serie')