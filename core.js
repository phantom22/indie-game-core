(function() {

/****/
/*gE(s)=document.getElementById(s),qS(s,p)=p.querySelectorAll(s),ce(s)=document.createElement(s),aC(s,p)=p.appendChild(s)*/
function gE(s){if(s){return document.getElementById(s)}}function qS(s,p){p=p?p:document.body;if(s){return p.querySelectorAll(s)}}function cE(s){if(s){return document.createElement(s)}}function aC(s,p){p=p?p:document.body;if(p&&s){p.appendChild(s)}}
/****/

/****/
/*Transforms a string like "1-1,2-2" into [{X:1,Y:1},{X:2,Y:2}]*/
function objectify(s){if(s){let st=s.split(",");let a=[];st.forEach(v=>{v=v.split("-");a.push({X:v[0],Y:v[1]})});return a}}
/****/

/****/
/*Cell display based on X,Y and also registering the displayed cell*/
function objDisplay(cl,objs,nd){if(cl&&!nd){qS("."+cl).forEach(v=>v.classList.remove(cl))}[...objs].forEach(v=>{let row=qS("tr")[v.Y];let cell=qS("td",row)[v.X];cell.classList.add(cl);let x=v.X;let y=v.Y;register({X:x,Y:y},cl,cell)})}
/****/

/****/
/*Creating a table with an X num of cells and Y num of rows*/
let rows=21;let cells=21;(function(){let table=cE("table");table.id="game-wrapper";let tbody=cE("tbody");for(let i=0;i<rows;i++){let row=cE("tr");for(let ii=0;ii<cells;ii++){let cell=cE("td");cell.dataset.x=ii;cell.dataset.y=i;aC(cell,row)}aC(row,tbody);aC(tbody,table);aC(table)}})()
/****/

/****/
/*Registering all the non-path cells and cell HTMLElement return based on X and Y coords*/
let reg={};
// register custom cell
function register({X,Y},p,e){if(X&&Y&&p!=="pos"&&e instanceof HTMLElement){reg[X+"-"+Y]={X:X,Y:Y,p:p,e:e}}}
// search cell in register and after that based on its X and Y if not found in register
function regSearch(x,y,n){let t=gE("game-wrapper");if(!isNaN(x)&&!isNaN(y)&&x<cells&&y<cells&&!n) {let re=reg[`${x}-${y}`];let c;if(!re){let r=qS("tr",t)[y];c=qS("td",r)[x];}return re?{p:re.p,e:re.e}:{p:"path",e:c}}else{if(!isNaN(n)){let r=qS("tr",t)[n];return qS("td",r)}}}
/****/

/****/
/*All the events that occur when a player goes on a cell*/
// check targeted cell
class propertyCheck{constructor(a){this.canMove=true;this.isCoin=false;this.isExit=false;if(a){let s=regSearch(a.dataset.x,a.dataset.y);if(s.p=="obs"){this.canMove=false}else if(s.p=="coi"){this.isCoin=true}else if(s.p=="exi"){this.isExit=true}}}}
// event handler
function eventHandler(e){let pl=player[0];if(e instanceof HTMLElement){let p=new propertyCheck(e);let x=e.dataset.x;let y=e.dataset.y;let xd=Math.abs(x-pl.X);let yd=Math.abs(y-pl.Y);if(xd<=pl.R&&yd<=pl.R){if(p.canMove){pl.X=x;pl.Y=y;objDisplay("pos",player);sight(player);if(p.isCoin){e.classList.remove("coi");pl.O+=1}if(p.isExit&&pl.O==pl.T){e.classList.remove("exi");alert("you won")}}}}}
/****/

/****/
/*Randomize special cells like coins or exit*/
function randomPlace(n,p){let o=[];let t=[];let res="";if(!isNaN(n)&&n>0){for(let i=0;i<n;i++){let p=[];let r=Math.floor(Math.random()*rows);r=r==0?1:r;r=r==rows-1?rows-2:r;let c=regSearch(null,null,r);c.forEach(v=>{let x=v.dataset.x;let y=v.dataset.y;let s=regSearch(x,y);if(!reg[`${x}-${y}`]){p.push(v)}});if(p.length){let a=Math.floor(Math.random()*p.length);o.push(p[a])}}o.forEach(v=>{let x=v.dataset.x;let y=v.dataset.y;t.push([x,y].join("-"))});t=t.join(",");}if(t&&!p){return t}else if(t&&p){return t.split("-")}}
/****/

/****/
/*Player Sight functions*/
let prev_l = [];
// light the block
function light(b,l){if(Array.isArray(b)&&!isNaN(l)){b.forEach(v=>{if(v[0]>=0&&v[1]>=0){let e=!isNaN(v[0])&&!isNaN(v[1])?regSearch(v[0],v[1]):undefined;if(typeof e!=="undefined"&&e.p!=="obs"){e.e.style.setProperty("background",`hsl(0,0%,${l}%)`);prev_l.push(e.e)} else{return}}})}}
// call light function
function sight(p){for(let i=0;i<prev_l.length;i++){prev_l[i].setAttribute("style","background:hsl(0, 0%, 1.25%) !important")}prev_l=[];let x=Number(p[0].X);let y=Number(p[0].Y);light([[x,y]],100);let b1=[[x,y-1],[x+1,y],[x,y+1],[x-1,y]];light(b1,20);let b2=[[x,y-2],[x+1,y-1],[x+2,y],[x+1,y+1],[x,y+2],[x-1,y+1],[x-2,y],[x-1,y-1]];light(b2, 10);let b3=[[x,y-3],[x+1,y-2],[x+2,y-1],[x+3,y],[x+2,y+1],[x+1,y+2],[x,y+3],[x-1,y+2],[x-2,y+1],[x-3,y],[x-2,y-1],[x-1,y-2]];light(b3,5);let b4=[[x,y-4],[x+1,y-3],[x+2,y-2],[x+3,y-1],[x+4,y],[x+3,y+1],[x+2,y+2],[x+1,y+3],[x,y+4],[x-1,y+3],[x-2,y+2],[x-3,y+1],[x-4,y],[x-3,y-1],[x-2,y-2],[x-1,y-3]];light(b4,2.5)}
/****/

/****/
// Map objects
let obstacles = objectify("0-0,0-1,0-2,0-3,0-4,0-5,0-6,0-7,0-8,0-9,0-10,0-11,0-12,0-13,0-14,0-15,0-16,0-17,0-18,0-19,0-20,1-0,2-0,3-0,4-0,5-0,6-0,7-0,8-0,9-0,10-0,11-0,12-0,13-0,14-0,15-0,16-0,17-0,18-0,19-0,20-0,20-1,20-2,20-3,20-4,20-5,20-6,20-7,20-8,20-9,20-10,20-11,20-12,20-13,20-14,20-15,20-16,20-17,20-18,20-19,20-20,1-20,2-20,3-20,4-20,5-20,6-20,7-20,8-20,9-20,10-20,11-20,12-20,13-20,14-20,15-20,16-20,17-20,18-20,19-20,10-2,10-3,10-4,10-6,10-7,10-8,10-12,10-13,10-14,10-16,10-18,2-10,3-10,4-10,6-10,7-10,8-10,12-10,13-10,14-10,16-10,17-10,18-10,8-8,12-8,8-12,12-12,4-4,6-4,8-4,9-4,11-4,12-4,14-4,15-4,16-4,4-16,5-16,6-16,8-16,9-16,11-16,12-16,14-16,16-16,4-5,4-6,4-8,4-9,4-11,4-12,4-14,16-6,16-8,16-9,16-11,16-12,16-14,16-15,5-8,6-8,12-5,12-6,14-12,15-12,8-14,8-15,5-6,6-6,7-6,8-6,9-6,14-5,14-6,14-7,14-8,14-9,11-14,12-14,13-14,14-14,15-14,6-11,6-12,6-13,6-14,6-15,8-7,13-8,12-13,7-12,4-2,5-2,6-2,7-2,8-2,9-2,12-2,13-2,15-2,16-2,18-4,18-5,18-6,18-7,18-8,18-9,18-12,18-13,18-15,18-16,4-18,5-18,7-18,8-18,11-18,12-18,13-18,14-18,15-18,16-18,2-4,2-5,2-7,2-8,2-11,2-12,2-13,2-14,2-15,2-16,6-5,15-6,14-15,5-14,12-1,19-12,8-19,1-8,4-1,1-4,19-4,16-1,16-19,19-16,1-16,4-19,10-17");
objDisplay("obs", obstacles);
let exit=objectify(randomPlace(1));
let coins=objectify(randomPlace(10));
objDisplay("coi", coins);
let pl_r=randomPlace(1,true);
let player=[{X:pl_r[0],Y:pl_r[1],R:1,O:0,T:coins.length}];
objDisplay("pos", player);
objDisplay("exi", exit);
/****/

/****/
/*User Movement*/
// player movement
function inputHandler(k){let x=Number(player[0].X);let y=Number(player[0].Y);if(k){let e;switch(k){case 87:e=[x,y-1];break;case 83:e=[x,y+1];break;case 65:e=[x-1,y];break;case 68:e=[x+1,y];break}e=regSearch(e[0],e[1]);if(typeof e!=="undefined"){eventHandler(e.e)}}}
// user input
document.addEventListener('keydown',function(event){inputHandler(event.keyCode)},true);
/****/

/****/
/*Hide coins and exits and they will be revealed when they will be close enough to the player*/
(function(){let c=qS(".coi");let e=qS(".exi");[...c, ...e].forEach(v=>v.setAttribute("style","background:black !important"))})()
/****/
sight(player);

})()