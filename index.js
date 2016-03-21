textAlpha=1;
refresh=true;
player=false;
explode=false;
trackNo=1;
flag=0;
toggleMenu=document.getElementById('ham_icon');
playerRad=$('#titling').width()*0.5;
canvas=document.getElementById('titlePlexus');
text=document.getElementById('titleArray');
ctx=canvas.getContext('2d');
textcontext=text.getContext('2d');
cursor={x:null,y:null};
w=window.innerWidth;
h=window.innerHeight;
canvas.width=text.width=w;
canvas.height=text.height=h;
window.onresize=function(){
    w=window.innerWidth;
h=window.innerHeight;
canvas.width=text.width=w;
canvas.height=text.height=h;
}
arr=[];

/*Particle Delivery*/
function generate(amount,a,o,remLife){
    for(i=0;i<amount;i++){
        arr.push({
            x:a||Math.random()*w,//Well
            y:o||Math.random()*h,//Obviously
            vi:Math.pow(-1,Math.floor(Math.random()*10))*Math.max(7,Math.random()*10),//Horizontal Velocity
            vj:Math.pow(-1,Math.floor(Math.random()*10))*Math.max(7,Math.random()*10),//Vertical Velocity
            life:remLife||Math.max(0.5,Math.random()*1),//total lifespan
            eta:0,//elapsed lifetime
            loops:0,//track for drunk steps
            allowed:Math.ceil(Math.random()*3),//allowed no of drunk steps
            //Lets get Drunk
            //random change in direction
            explode:function(){
                this.vi=Math.pow(-1,Math.floor(Math.random()*10))*Math.max(7,Math.random()*10);
                this.vj=Math.pow(-1,Math.floor(Math.random()*10))*Math.max(7,Math.random()*10);
                this.eta=0;
                this.loops++;
            },
            //Draw my dot
            draw:function(){
                ctx.fillStyle='#ccc';
                ctx.fillRect(this.x,this.y,1,1);
            }
        });
    }
}

//raster Update holder
rasterUpdated={points:[]};
for(i=0;i<raster.points.length;i++)
    {
        if(i%4==0)
            rasterUpdated.points.push({x:Math.random()*w-(w/2),y:-h/2});
    else if(i%4==2)
            rasterUpdated.points.push({x:-w/2,y:(Math.random()*h)-h/2});
    else if(i%4==1)
            rasterUpdated.points.push({x:(Math.random()*w)-(w/2),y:h/2});
    else if(i%4==3)
            rasterUpdated.points.push({x:w/2,y:(Math.random()*h)-(h/2)});
    }
var rasterTarget={points:[]};
    for(i=0;i<raster.points.length;i++)
    {
        if(i%4==0)
            rasterTarget.points.push({x:Math.random()*w-(w/2),y:-h/2});
    else if(i%4==2)
            rasterTarget.points.push({x:-w/2,y:(Math.random()*h)-h/2});
    else if(i%4==1)
            rasterTarget.points.push({x:(Math.random()*w)-(w/2),y:h/2});
    else if(i%4==3)
            rasterTarget.points.push({x:w/2,y:(Math.random()*h)-(h/2)});
    }

//Where we'll be next
function update()
{
    ctx.clearRect(0,0,w,h);
    for(i=0;i<arr.length;i++)
        {
            n=arr[i];
            n.eta+=0.1;
            n.x=n.x+(n.vi*Math.max(0.2,1-(n.eta/n.life)));
            n.y=n.y+(n.vj*Math.max(0.2,1-(n.eta/n.life)));
            if((n.eta>=n.life)&&(n.loops<n.allowed))
                {n.explode();}
            if(n.eta>=n.life&&(n.loops>=n.allowed))
                arr.splice(i,1);
        }
    if(!player && !explode)
    for(i=0;i<raster.points.length;i++)
        {
            refresh=false;
            d=dist({x:cursor.x-w/2,y:cursor.y-h/2},raster.points[i]);
            if(d<=150)
            {
                refresh=true;
                r=Math.pow(d,0.25);
                diffX=((((r*raster.points[i].x)+(cursor.x-(w/2)))/(r+1))-rasterUpdated.points[i].x);
                diffY=((((r*raster.points[i].y)+(cursor.y-(h/2)))/(r+1))-rasterUpdated.points[i].y);
                if(diffX>0||diffY>0)
                    refresh=true;
                rasterUpdated.points[i].x+=diffX/10;
                rasterUpdated.points[i].y+=diffY/10;
            }
            else{
                diffX=(raster.points[i].x-rasterUpdated.points[i].x);
                diffY=(raster.points[i].y-rasterUpdated.points[i].y);
                rasterUpdated.points[i].x+=diffX/5;
                rasterUpdated.points[i].y+=diffY/5;
            }
        }
    else if(player){
            refresh=true;
            for(i=0;i<rasterUpdated.points.length;i++)
            {
                cX=spectrum.points[i].x;
                cY=spectrum.points[i].y;
                rasterUpdated.points[i].x+=(cX-rasterUpdated.points[i].x)/5;
                rasterUpdated.points[i].y+=(cY-rasterUpdated.points[i].y)/5;
            }
        }
    else if(explode)
        {
            refresh=true;
            for(i=0;i<rasterUpdated.points.length;i++)
            {
                cX=rasterTarget.points[i].x;
                cY=rasterTarget.points[i].y;
                rasterUpdated.points[i].x+=(cX-rasterUpdated.points[i].x)/7;
                rasterUpdated.points[i].y+=(cY-rasterUpdated.points[i].y)/7;
            }
        }
        for(i=0;i<raster.points.length;i++)
            {
                if(Math.floor(raster.points[i].x-rasterUpdated.points[i].x)>0||Math.floor(raster.points[i].y-rasterUpdated.points[i].y)>0)
                    {refresh=true;break;}
            }
    draw();
}
spectrum={points:[]};
deg=(2*Math.PI)/(rasterUpdated.points.length-1);
for(i=0;i<raster.points.length;i++)
    {
        spectrum.points.push({x:(playerRad)*Math.cos(deg*i),y:(playerRad)*Math.sin(deg*i)});
    }
/*for(i=0;i<Math.max(50,Math.floor(Math.random()*100));i++)
    {
        scatter.push({
            x:Math.pow(-1,Math.floor(Math.random()*10))*Math.random()*20,
            y:Math.pow(-1,Math.floor(Math.random()*10))*Math.random()*Math.sqrt(400-Math.pow(this.x,2))
        });
    }*/
/*Onload Shit*/
$('document').ready(function(){
    document.getElementById('fore').onmousemove=function(e){hit(e);}
    $('#fore').mousedown(function(e){flag=1;});
    window.onmouseup=function(){flag=0;}
        function hit(e){
        cursor.x=e.pageX;
        cursor.y=e.pageY-window.scrollY;
        /*generate(Math.floor(Math.random()*2),cursor.x,cursor.y);*/
    }
    $('#nav>li').removeClass('init');
    $('#nav>li').click(function(){
        $('#nav>li').removeClass('activeSibling').removeClass('active');
        $(this).addClass('active');
        $(this).next().addClass('activeSibling');
        $(this).prev().addClass('activeSibling');
    });
    $('#nav').css({'margin-top':'-'+(($('#nav>li').length-1)*22)+'px',
                   'height':$('#nav>li').length*44+'px'});
});
window.setInterval(function(){if(flag)generate(Math.floor(Math.random()*2),cursor.x,cursor.y)},20);


/*Paint It Out*/
function draw()
{
    if(refresh==true){
        textcontext.clearRect(0,0,w,h);
        if(!player || explode)
        {   for(n=0;n<4;n++)
                for(i=n;i<raster.points.length;i+=4)
                {
                    for(j=n;j<raster.points.length;j+=(i*j%2+3)){
                        textcontext.strokeStyle='rgba(200,200,200,'+Math.min((1/dist(rasterUpdated.points[i],rasterUpdated.points[j])),0.05)+')';
                        textcontext.beginPath();
                        textcontext.moveTo(w/2+rasterUpdated.points[i].x,h/2+rasterUpdated.points[i].y);
                        textcontext.lineTo(w/2+rasterUpdated.points[j].x,h/2+rasterUpdated.points[j].y);
                        textcontext.closePath();
                        textcontext.stroke();
                    }
                }
            for(i=0;i<rasterUpdated.points.length;i++)
            {
                textcontext.fillStyle='rgba(255,255,255,0.5)';
                textcontext.fillRect(w/2+rasterUpdated.points[i].x,h/2+rasterUpdated.points[i].y,1,1);
            }
        }
        else{
            textcontext.beginPath();
            textcontext.lineWidth=1;
            textcontext.strokeStyle="rgba(255,255,255,0.2)";
            textcontext.arc(w/2,h/2,playerRad+15,0,2*Math.PI);
            textcontext.closePath();
            textcontext.stroke();
            textcontext.lineWidth=2;
            textcontext.strokeStyle="rgba(255,255,255,0.5)";
            textcontext.beginPath();
            textcontext.moveTo(w/2+rasterUpdated.points[raster.points.length-1].x,h/2+rasterUpdated.points[raster.points.length-1].y);
            for(i=0;i<raster.points.length;i++)
                {
                    textcontext.lineTo(w/2+rasterUpdated.points[i].x,h/2+rasterUpdated.points[i].y);
                }
            textcontext.closePath();
            textcontext.stroke();
            textcontext.lineWidth=1;
            for(i=1;i<raster.points.length;i++)
                {
                    for(j=i-1;j<=i+1;j++)
                    {
                        temp={x:(playerRad+15)*Math.cos(deg*j),y:(playerRad+15)*Math.sin(deg*j)};
                        textcontext.strokeStyle='rgba(255,255,255,'+(1/dist(temp,rasterUpdated.points[i]))+')'
                        textcontext.beginPath();
                        textcontext.moveTo(w/2+rasterUpdated.points[i].x,h/2+rasterUpdated.points[i].y);
                        textcontext.lineTo(w/2+temp.x,h/2+temp.y);
                        textcontext.closePath();
                        textcontext.stroke();
                    }
                }
            textcontext.stroke();
        }
    }

    for(i=0;i<arr.length;i++)
        {
            arr[i].draw();
            ctx.lineWidth=1;
            for(j=0;j<arr.length;j++)
                {
                    ctx.strokeStyle='rgba(200,200,200,'+Math.min((1/dist(arr[i],arr[j])),0.1)+')';
                    ctx.beginPath();
                    ctx.moveTo(arr[i].x,arr[i].y);
                    ctx.lineTo(arr[j].x,arr[j].y);
                    ctx.closePath();
                    ctx.stroke();
                }
        }
}
//How far you are
function dist(m,n)
{
    return Math.sqrt(Math.pow(m.x-n.x,2)+Math.pow(m.y-n.y,2));
}
//Get Set Go!
function init()
{
    update();
    window.requestAnimationFrame(init);
}
init();



//Navigation Dock Animation
navList=[];
$('#nav>li').each(function(i){
    navList.push({
                    element:i,
                    x:$(this).position().left,
                    y:i*44-(($('#nav>li').length-1)*22),
                    position:function(){
                        $('#nav>li').eq(i).css({'left':(this.x+50)+'px',
                                                'top':(this.y)+'px'
                                               });
                    },
                    activate:function(){
                        $('#nav>li').removeClass('activeSibling').removeClass('active');
                        $('#nav>li').eq(i).addClass('active');
                        $('#nav>li').eq(i).next().addClass('activeSibling');
                        $('#nav>li').eq(i).prev().addClass('activeSibling');
                    }
                });
});
heightOfNav=navList[navList.length-1].y-navList[0].y;
$('#nav').mouseover(function(){
    $(this).css({"width":heightOfNav-100+'px'});
    button.style.marginLeft='-95px';
    step=Math.PI/($('#nav>li').length-1);
    for(i=0;i<navList.length;i++)
        {
            angle=(Math.PI/2)-(step*i);
            navList[i].x=(heightOfNav/2)*Math.cos(angle);
            navList[i].y=(heightOfNav/2)*(1-Math.sin(angle));
            navList[i].position();
        }
    $('#buttonUp').removeClass('inactive');
    $('#buttonDown').removeClass('inactive');
})
$('#nav').mouseout(function(){
    $(this).css({"width":'unset'});
    button.style.marginLeft='-205px';
    for(i=0;i<navList.length;i++)
        {
            navList[i].x=0;
            navList[i].y=i*44;
            navList[i].position();
        }
    $('#buttonUp').addClass('inactive');
    $('#buttonDown').addClass('inactive');
});

//Nav Dot track
window.onscroll=function(){
    $('#underlay').css({'margin-left':'-'+(window.scrollY/2)+'px'});
    $('#projects').css({'margin-left':'-'+(window.scrollY)+'px'});
    y=window.scrollY;
    navList[Math.floor(y/h)].activate();
}
$('#titling').mousemove(function(){
    generate(Math.floor(Math.random()*2),cursor.x,cursor.y);
});

//Create Button in Nav
button=document.getElementById('buttonContext');
button.onclick=function(){
    if(player)
    {
        player=false;
        audio.pause();
        button.innerHTML='play_arrow';
        playerRad=playerRad*(4/3);
        $('#titling').removeClass('playered');
        $('#audioData').animate({'opacity':0},200);
    }
    else
    {
        audio.play();
        player=true;
        button.innerHTML='pause';
        window.setTimeout(function(){playerRad=playerRad*(3/4);},1000);
        $('#titling').addClass('playered');
        $('#audioData').animate({'opacity':1},200);
    }
}
//Audio Player
var audio = document.getElementById('audio');
var context = new webkitAudioContext();
var analyser = context.createAnalyser();

audio.onended=function(){
    buttonDown.click();
}
// Wait for window.onload to fire. See crbug.com/112368
window.addEventListener('load',function(e) {
  // Our <audio> element will be the audio source.
  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
 analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);
    function visualize() {
        window.requestAnimationFrame(visualize);
        analyser.getByteTimeDomainData(dataArray);
        for(i=0;i<spectrum.points.length;i++)
            {
                spectrum.points[i].x=(playerRad+Math.pow(dataArray[i]/50,3))*Math.cos(deg*i);
                spectrum.points[i].y=(playerRad+Math.pow(dataArray[i]/50,3))*Math.sin(deg*i);
            }
        avg=(spectrum.points[spectrum.points.length-1].x+spectrum.points[0].x)/2;
        spectrum.points[0].x=spectrum.points[spectrum.points.length-1].x=avg;
    };
    visualize();
},false);
xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                reqResult = xmlhttp.responseText.split("|");
                audio.src=reqResult[3];
                audio.play();
                $('#audioData>.title').html(reqResult[0]);
                $('#audioData>.album').html(reqResult[1]);
                $('#audioData>.artist').html(reqResult[2]);
            }
        };
$('#buttonDown').click(function(){trackNo=trackNo+1;});
$('#buttonUp').click(function(){trackNo=Math.max(1,trackNo-1);});
$('.change_track').click(function(){
    xmlhttp.open("GET","requestTrack.php?id="+trackNo,true);
    xmlhttp.send();
});

$('#ham_icon').click(function(){
    $(this).toggleClass('ham');
    $(this).toggleClass('cross');
    explode=!explode;
    $(this).hasClass('cross')?$('#projects').animate({'left':'20vh'},500):$('#projects').animate({'left':'150vh','margin-left':'0px'},500);
});