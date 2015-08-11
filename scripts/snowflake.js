var SnowFlake=(function()
{window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame;function SnowFlake(container)
{this.container=container;};SnowFlake.prototype.Render=function(points,options)
{if(options===undefined||options==null)
return;if(SnowFlake.Animated===undefined&&requestAnimationFrame!==undefined)
{SnowFlake.Animated={};SnowFlake.Animator=requestAnimationFrame(Animate,50);}
var isAnimated=(options.animated==true&&window.requestAnimationFrame!==undefined);options.borderMinColor=options.borderMinColor||"#00ff00";options.borderMaxColor=options.borderMaxColor||"#ff00ff";options.flakeMinColor=options.flakeMinColor||"#00ff00";options.flakeMaxColor=options.flakeMaxColor||"#ff0000";options.flakeColor=CalculateMidColor(options.flakeMinColor,options.flakeMaxColor,options.flakeColorValue,options.flakeAlpha||0.5,options.flakeAlpha||0.75);options.flakeBorder=CalculateMidColor(options.borderMinColor,options.borderMaxColor,options.borderColorValue,options.borderAlpha||0.5,options.borderAlpha||1.0);this.container.style.position="relative";var w=this.container.clientWidth;var h=this.container.clientHeight;var diam=Math.min(w,h)*options.diameter;var center={x:w/2,y:h/2};var canvas;if(this.container.firstElementChild!=null)
{canvas=this.container.children[1];}
else
{var bgdiv=document.createElement("div");bgdiv.width=w;bgdiv.height=h;bgdiv.style.minWidth=w;bgdiv.style.minHeight=h;bgdiv.style.display="block";bgdiv.style.overflow="hidden";bgdiv.style.position="absolute";this.container.appendChild(bgdiv);if(options.background!==undefined)
{var img=document.createElement("img");img.src=options.background;img.style.margin="auto auto";img.width=w;img.height=h;bgdiv.appendChild(img);}
canvas=document.createElement("canvas");canvas.id=GetUniqueID();canvas.width=w;canvas.height=h;canvas.style.position="absolute";this.container.appendChild(canvas);canvas.nodes=points;canvas.options=options;if(!isAnimated)
{canvas.growFactor=1;RenderChart(canvas);}
if(options.image!==undefined)
{var imgdiv=document.createElement("div");imgdiv.style.display="block";imgdiv.style.width=w;imgdiv.style.height=h;imgdiv.style.minWidth=w;imgdiv.style.minHeight=h;imgdiv.style.lineHeight=h;imgdiv.style.overflow="hidden";imgdiv.style.position="absolute";imgdiv.style.zIndex=2147483646;this.container.appendChild(imgdiv);img=document.createElement("img");img.src=options.image;img.style.opacity=Math.min(options.imageAlpha||1.0,0.999);img.style.left=img.style.top=img.style.right=img.style.bottom="0";img.style.margin="auto";img.style.position="absolute";imgdiv.appendChild(img);}
if(options.hyperlinks!==undefined)
{var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");svg.setAttribute("height",h.toString());svg.setAttribute("width",w.toString());svg.setAttribute("class",'hoverZone');svg.setAttribute("id",GetUniqueID());svg.setAttribute("viewBox","0 0 "+ w+" "+ h);svg.style.display="block";svg.style.position="absolute";svg.style.top=0;svg.style.zIndex=2147483646;this.container.appendChild(svg);var tooltipdiv=document.createElement("div");if(options.tooltips!==undefined){tooltipdiv.style.display="none";tooltipdiv.style.backgroundColor="black";tooltipdiv.style.padding="5px";tooltipdiv.style.maxWidth="240px";tooltipdiv.style.position="absolute";tooltipdiv.style.zIndex=2147483646;tooltipdiv.style.pointerEvents="none";tooltipdiv.innerHTML="tooltip!";this.container.appendChild(tooltipdiv);}
var r=diam/2.0;for(var i=0;i<options.hyperlinks.length;i++)
{var startangle=(i-0.5)*2*Math.PI/options.hyperlinks.length;var endangle=(i+0.5)*2*Math.PI/options.hyperlinks.length;var x1=center.x+ r*Math.sin(startangle);var y1=center.y- r*Math.cos(startangle);var x2=center.x+ r*Math.sin(endangle);var y2=center.y- r*Math.cos(endangle);var d="M "+ center.x+","+ center.y+" L "+ x1+","+ y1+" A "+ r+","+ r+" 0 0 1 "+ x2+","+ y2+" Z";var path=document.createElementNS("http://www.w3.org/2000/svg","path");path.setAttribute("d",d);path.setAttribute("fill","transparent");path.setAttribute("fill-opacity",options.hoverAlpha||"0.2");path.setAttribute("data-scroll","");path.setAttribute("data-url",options.hyperlinks[i]);if(options.highlightSections!==undefined&&options.highlightSections==true){path.setAttribute("id",'SF'+i);console.log(i+" "+options.highlightSections);}
if(options.hoverOver==undefined){path.style.cursor="hand";path.onmousemove=function(evt){this.setAttribute("fill",options.hoverColor||"#808080");if(options.tooltips!==undefined)
{if(evt.offsetX==undefined)
{xpos=evt.pageX-$('#snowflakeCanvas').offset().left;ypos=evt.pageY-$('#snowflakeCanvas').offset().top;}
else
{xpos=evt.offsetX;ypos=evt.offsetY;}
tooltipdiv.style.left=(xpos)+"px";tooltipdiv.style.top=(ypos+ 30)+"px";tooltipdiv.innerHTML=this.getAttribute("data-tooltip");tooltipdiv.style.display="inline-block";}};path.onmouseleave=path.onmouseout=function(){this.setAttribute("fill","transparent");if(options.tooltips!==undefined)
{tooltipdiv.style.display="none";}};path.onclick=function(){window.location.href=this.getAttribute("data-url");}
if(options.tooltips!==undefined)
path.setAttribute("data-tooltip",options.tooltips[i]);}
svg.appendChild(path);}}}
if(isAnimated)
{canvas.growFactor=0;SnowFlake.Animated[canvas.id]=canvas;}}
function Animate()
{var count=0;var canvas;var first=true;var remaining=false;for(var id in SnowFlake.Animated)
{if(first||SnowFlake.Sequential!=true){canvas=SnowFlake.Animated[id];if(RenderCanvas(canvas))
count++;first=false;}else{remaining=true;}}
if(count>0||remaining)
requestAnimationFrame(Animate,50);else
delete SnowFlake.Animated;}
function RenderCanvas(canvas)
{if(canvas.growFactor>=1)
{delete SnowFlake.Animated[canvas.id];return false;}
canvas.growFactor+=0.15;RenderChart(canvas);return true;}
function RenderChart(canvas)
{var w=canvas.width;var h=canvas.height;var diam=Math.min(w,h)*canvas.options.diameter;var center={x:w/2,y:h/2};var ctx=canvas.getContext('2d');var points=[];var max=7;var nodes=canvas.nodes;var nodeCount=nodes.length;var options=canvas.options;ctx.clearRect(0,0,w,h);for(var i=0;i<nodeCount;i++)
{max=Math.max(max,nodes[i]);}
for(i=0;i<nodeCount;i++){var radius=diam/2*nodes[i]/max*(options.easing?Easing(canvas.growFactor):canvas.growFactor);var angle=-Math.PI/2+ 2*Math.PI/nodeCount*i;var x=center.x+ Math.cos(angle)*radius;var y=center.y+ Math.sin(angle)*radius;points.push({x:x,y:y});}
ctx.strokeStyle=options.flakeBorder;ctx.fillStyle=options.flakeColor;ctx.lineWidth=options.borderWidth||Math.max(1,diam/150);ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);var bezier;var x0,y0,x1,y1,x2,y2,x3,y3;for(i=0;i<nodeCount;i++){x0=points[(i- 1+ nodeCount)%nodeCount].x;y0=points[(i- 1+ nodeCount)%nodeCount].y;x1=points[i].x;y1=points[i].y;x2=points[(i+ 1)%nodeCount].x;y2=points[(i+ 1)%nodeCount].y;x3=points[(i+ 2)%nodeCount].x;y3=points[(i+ 2)%nodeCount].y;bezier=CalculateControlPoints(x0,y0,x1,y1,x2,y2,x3,y3,options.tensor||1);ctx.bezierCurveTo(bezier[0],bezier[1],bezier[2],bezier[3],points[(i+ 1)%nodeCount].x,points[(i+ 1)%nodeCount].y);}
ctx.fill();ctx.stroke();ctx.strokeStyle="black";ctx.lineWidth=1;if(options.diagnose===true)
{for(i=0;i<nodeCount;i++)
{x1=points[i].x;y1=points[i].y;ctx.beginPath();ctx.moveTo(x1- 5,y1- 5);ctx.lineTo(x1+ 5,y1+ 5);ctx.moveTo(x1+ 5,y1- 5);ctx.lineTo(x1- 5,y1+ 5);ctx.stroke();}}}
function CalculateControlPoints(x0,y0,x1,y1,x2,y2,x3,y3,tensor)
{var len1=Math.sqrt((x1- x0)*(x1- x0)+(y1- y0)*(y1- y0));var len2=Math.sqrt((x2- x1)*(x2- x1)+(y2- y1)*(y2- y1));var len3=Math.sqrt((x3- x2)*(x3- x2)+(y3- y2)*(y3- y2));var k1=len1/(len1+ len2);var k2=len2/(len2+ len3);var xc1=(x0+ x1)/ 2.0;var yc1=(y0+ y1)/ 2.0;var xc2=(x1+ x2)/ 2.0;var yc2=(y1+ y2)/ 2.0;var xc3=(x2+ x3)/ 2.0;var yc3=(y2+ y3)/ 2.0;var xm1=xc1+(xc2- xc1)*k1;var ym1=yc1+(yc2- yc1)*k1;var xm2=xc2+(xc3- xc2)*k2;var ym2=yc2+(yc3- yc2)*k2;var cx1=xm1+(xc2- xm1)*tensor+ x1- xm1;var cy1=ym1+(yc2- ym1)*tensor+ y1- ym1;var cx2=xm2+(xc2- xm2)*tensor+ x2- xm2;var cy2=ym2+(yc2- ym2)*tensor+ y2- ym2;return[cx1,cy1,cx2,cy2];}
function Easing(t)
{var s=1.70158;return((t=t- 1)*t*((s+ 1)*t+ s)+ 1);}
function CalculateMidColor(minColor,maxColor,value,alpha)
{var rgb1=ParseColor(minColor);var rgb2=ParseColor(maxColor);var hsl1=RgbToHsl(rgb1[0],rgb1[1],rgb1[2]);var hsl2=RgbToHsl(rgb2[0],rgb2[1],rgb2[2]);var hsli=[(hsl1[0]+ value*(hsl2[0]- hsl1[0])),(hsl1[1]+ value*(hsl2[1]- hsl1[1])),(hsl1[2]+ value*(hsl2[2]- hsl1[2]))];var color=HslToRgb(hsli[0],hsli[1],hsli[2]);return"rgba("+ Math.round(color[0])+","+ Math.round(color[1])+","+ Math.round(color[2])+","+ alpha+")";}
function ParseColor(color)
{var parts;color=color.replace(/\s\s*/g,'');if(parts=/^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(color))
parts=[parseInt(parts[1],16),parseInt(parts[2],16),parseInt(parts[3],16)];else if(parts=/^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(color))
parts=[parseInt(parts[1],16)*17,parseInt(parts[2],16)*17,parseInt(parts[3],16)*17];else if(parts=/^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(color))
parts=[+parts[1],+parts[2],+parts[3]];else if(parts=/^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(color))
parts=[+parts[1],+parts[2],+parts[3]];else throw Error(color+' is not supported by $.parseColor');return parts.slice(0,3);}
function HslToRgb(h,s,l){var r,g,b;if(s==0){r=g=b=l;}else{function hue2rgb(p1,q1,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)
return p1+(q1- p1)*6*t;if(t<1/2)
return q1;if(t<2/3)
return p1+(q1- p1)*(2/3- t)*6;return p1;}
var q=l<0.5?l*(1+ s):l+ s- l*s;var p=2*l- q;r=hue2rgb(p,q,h+ 1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h- 1/3);}
return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];}
function RgbToHsl(r,g,b)
{r/=255,g/=255,b/=255;var max=Math.max(r,g,b);var min=Math.min(r,g,b);var h=0,s,l=(max+ min)/ 2;if(max==min){h=s=0;}else{var d=max- min;s=l>0.5?d/(2- max- min):d/(max+ min);switch(max)
{case r:h=(g- b)/ d + (g < b ? 6 : 0);break;case g:h=(b- r)/ d + 2;break;case b:h=(r- g)/ d + 4;break;}
h/=6;}
return[h,s,l];}
function GetUniqueID()
{var time=new Date().getTime();while(time==new Date().getTime());return new Date().getTime();}
return SnowFlake;})();