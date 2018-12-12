(function() {

/****/
/*game mode*/
const gm=0;
/****/

/****/
/*gE(s)=document.getElementById(s),qS(s,p)=p.querySelectorAll(s),ce(s)=document.createElement(s),aC(s,p)=p.appendChild(s)*/
function gE(s){if(s){return document.getElementById(s)}}function qS(s,p){p=p?p:document.body;if(s){return p.querySelectorAll(s)}}function cE(s){if(s){return document.createElement(s)}}function aC(s,p){p=p?p:document.body;if(p&&s){p.appendChild(s)}}
/****/

/****/
/*Return indexes of recurring values in an array*/
function arrI(arr,s){s=String(s);if(Array.isArray(arr)&&s){let rec=[];for(let i=0;i<arr.length;i++){if(String(arr[i])==String(s)){rec.push(i)}}return rec}}
/****/

/****/
/*Calculate best path*/
/*function minCorrect(possible,final){
  if(Array.isArray([...possible,...final])){
    final=final.map(v=>Number(v));
    // pl.x-possible.x, pl.y-possible.y
    let t1=[];
    // pl.x-possible.x - pl.y-possible.y
    let t2=[];
    // pl.y - possible.y
    let yd=[];
    // pl.x - possible.x
    let xd=[];
    possible.forEach(v=>{
      t1.push([Number(final[0])-Number(v[0]),Number(final[1])-Number(v[1])])
      yd.push(Number(final[1])-v[1]);xd.push(Number(final[0]-v[0]))
      })
    t1.forEach(v=>{t2.push(Number(v[0])-Number(v[1]))})
    let min=Math.max(...t2);
    if (t2.filter(v=>v==min).length > 1) {
      let occ=arrI(t2,min);
      let fd=[];
      let fs=[];
      for(let i=0;i<occ.length;i++){
        fd.push([xd[occ[i]],yd[occ[i]]]);
      }
      fd.forEach(v=>{fs.push(v.reduce((a,b)=>a+b))})
      let t=fs.reduce((a,b)=>a+b)
      t=t/fs.length;
      if(fs.filter(v=>v==t).length==fs.length){
        return possible[occ[0]]
      }
      else{
        let ord=arrI(fs,Math.min(...fs));
        return possible[ord]
      }
    }
    else {
      return possible[t2.indexOf(min)]
    }
  }
}*/
/****/

/****/
/*Transforms a string like "1-1,2-2" into [0:{X:1,Y:1},1:{X:2,Y:2}]*/
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
function regSearch(x,y,n){let t=gE("game-wrapper");if(!isNaN(x)&&!isNaN(y)&&x<cells&&y<rows&&!n) {let re=reg[`${x}-${y}`];let c;if(!re){let r=qS("tr",t)[y];c=qS("td",r)[x];}return re?{p:re.p,e:re.e}:{p:"path",e:c}}else{if(!isNaN(n)){let r=qS("tr",t)[n];return qS("td",r)}}}
/****/

/****/
/*Enemy moves*/
/*function enemyMove(e){
  if(e){
    let x=Number(e[0].X);
    let y=Number(e[0].Y);
    let p=player[0];
    let z1=[regSearch(x,y-1),regSearch(x,y+1),regSearch(x-1,y),regSearch(x+1,y)];
    z1=z1.filter(v=>v.p!=="obs");
    let z2=[]; //[[1,2],[2,3]]
    z1.forEach(v=>{let x1=Number(v.e.dataset.x);let y1=Number(v.e.dataset.y);z2.push([Number(x1),Number(y1)])})
  let c=minCorrect(z2,[p.X,p.Y]);
  enemy[0].X=c[0];
  enemy[0].Y=c[1];
  objDisplay("ene",enemy);
  }
}*/
/****/

/****/
/*All the events that occur when a player goes on a cell*/
// check targeted cell
class propertyCheck{constructor(a){this.canMove=true;this.isCoin=false;this.isExit=false;if(a){let s=regSearch(a.dataset.x,a.dataset.y);if(s.p=="obs"){this.canMove=false}else if(s.p=="coi"){this.isCoin=true}else if(s.p=="exi"){this.isExit=true}}}}
// event handler
function eventHandler(e){let pl=player[0];if(e instanceof HTMLElement){let p=new propertyCheck(e);let x=e.dataset.x;let y=e.dataset.y;let xd=Math.abs(x-pl.X);let yd=Math.abs(y-pl.Y);if(xd<=pl.R&&yd<=pl.R){if(p.canMove){pl.B-=1;pl.X=x;pl.Y=y;/*enemyMove(enemy);*/objDisplay("pos",player);if(p.isCoin){e.classList.remove("coi");pl.O+=1;pl.B=13;reg[`${x}-${y}`].p="path"}if(p.isExit&&pl.O==coins.length){e.classList.remove("exi");alert("you won");reg[`${x}-${y}`].p="path"}sight(player)}}}}
/****/

/****/
/*Randomize special cells like coins or exit*/
function randomPlace(n,p){let o=[];let t=[];let res="";if(!isNaN(n)&&n>0){for(let i=0;i<n;i++){let p=[];let r=Math.floor(Math.random()*rows);r=r==0?1:r;r=r==rows-1?rows-2:r;let c=regSearch(null,null,r);c.forEach(v=>{let x=v.dataset.x;let y=v.dataset.y;let s=regSearch(x,y);if(!reg[`${x}-${y}`]){p.push(v)}});if(p.length){let a=Math.floor(Math.random()*p.length);o.push(p[a])}}o.forEach(v=>{let x=v.dataset.x;let y=v.dataset.y;t.push([x,y].join("-"))});t=t.join(",");}if(t&&!p){return t}else if(t&&p){return t.split("-")}}
/****/

/****/
/*prevents from randomizing 2 same places*/
function noR(s){if(s){s=s.split(",");let i=[];let b=[];let r=[];if(Array.isArray(s)){s.forEach(v=>{if(!b.includes(v)){let c=arrI(s,v);if(c.length>1){b.push(v);i.push(...c.slice(1))}}});for(let n=0;n<s.length;n++){if(!i.includes(n)){r.push(s[n])}}}return r.join(",")}}
/****/

/****/
/*Player Sight functions*/
let prev_l = [];
// light the block
function light(b,l){if(Array.isArray(b)&&!isNaN(l)&&!gm){b.forEach(v=>{if(v[0]>=0&&v[1]>=0){let e=!isNaN(v[0])&&!isNaN(v[1])?regSearch(v[0],v[1]):undefined;if(typeof e!=="undefined"&&e.p!=="obs"){e.e.style.setProperty("background",`hsl(0,0%,${l}%)`);prev_l.push(e.e)} else{return}}})}}
// call light function
function sight(p){if(!gm){let pl=player[0];for(let i=0;i<prev_l.length;i++){prev_l[i].setAttribute("style","background:hsl(0, 0%, 1.25%) !important")}prev_l=[];let x=Number(p[0].X);let y=Number(p[0].Y);light([[x,y]],100);let b1=[[x,y-1],[x+1,y],[x,y+1],[x-1,y]];if(pl.B>0){light(b1,20)}let b2=[[x,y-2],[x+1,y-1],[x+2,y],[x+1,y+1],[x,y+2],[x-1,y+1],[x-2,y],[x-1,y-1]];if(pl.B>3){light(b2, 10)}let b3=[[x,y-3],[x+1,y-2],[x+2,y-1],[x+3,y],[x+2,y+1],[x+1,y+2],[x,y+3],[x-1,y+2],[x-2,y+1],[x-3,y],[x-2,y-1],[x-1,y-2]];if(pl.B>6){light(b3,5)}let b4=[[x,y-4],[x+1,y-3],[x+2,y-2],[x+3,y-1],[x+4,y],[x+3,y+1],[x+2,y+2],[x+1,y+3],[x,y+4],[x-1,y+3],[x-2,y+2],[x-3,y+1],[x-4,y],[x-3,y-1],[x-2,y-2],[x-1,y-3]];if(pl.B>9){light(b4,2.5)}}}
/****/

/****/
// Map objects
let obstacles = objectify("0-0,0-1,0-2,0-3,0-4,0-5,0-6,0-7,0-8,0-9,0-10,0-11,0-12,0-13,0-14,0-15,0-16,0-17,0-18,0-19,0-20,1-0,2-0,3-0,4-0,5-0,6-0,7-0,8-0,9-0,10-0,11-0,12-0,13-0,14-0,15-0,16-0,17-0,18-0,19-0,20-0,20-1,20-2,20-3,20-4,20-5,20-6,20-7,20-8,20-9,20-10,20-11,20-12,20-13,20-14,20-15,20-16,20-17,20-18,20-19,20-20,1-20,2-20,3-20,4-20,5-20,6-20,7-20,8-20,9-20,10-20,11-20,12-20,13-20,14-20,15-20,16-20,17-20,18-20,19-20,10-2,10-3,10-4,10-6,10-7,10-8,10-12,10-13,10-14,10-16,10-18,2-10,3-10,4-10,6-10,7-10,8-10,12-10,13-10,14-10,16-10,17-10,18-10,8-8,12-8,8-12,12-12,4-4,6-4,8-4,9-4,11-4,12-4,14-4,15-4,16-4,4-16,5-16,6-16,8-16,9-16,11-16,12-16,14-16,16-16,4-5,4-6,4-8,4-9,4-11,4-12,4-14,16-6,16-8,16-9,16-11,16-12,16-14,16-15,5-8,6-8,12-5,12-6,14-12,15-12,8-14,8-15,5-6,6-6,7-6,8-6,9-6,14-5,14-6,14-7,14-8,14-9,11-14,12-14,13-14,14-14,15-14,6-11,6-12,6-13,6-14,6-15,8-7,13-8,12-13,7-12,4-2,5-2,6-2,7-2,8-2,9-2,12-2,13-2,15-2,16-2,18-4,18-5,18-6,18-7,18-8,18-9,18-12,18-13,18-15,18-16,4-18,5-18,7-18,8-18,11-18,12-18,13-18,14-18,15-18,16-18,2-4,2-5,2-7,2-8,2-11,2-12,2-13,2-14,2-15,2-16,6-5,15-6,14-15,5-14,12-1,19-12,8-19,1-8,4-1,1-4,19-4,16-1,16-19,19-16,1-16,4-19,10-17");
objDisplay("obs", obstacles);
let exit=objectify(noR(randomPlace(1)));
objDisplay("exi", exit);
let coins=objectify(noR(randomPlace(10)));
/*let enemy=objectify(randomPlace(1));
objDisplay("ene",enemy);*/
objDisplay("coi", coins);
let pl_r=randomPlace(1,true);
let player=[{X:pl_r[0],Y:pl_r[1],R:1,O:0,B:12}];
objDisplay("pos", player);
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
(function(){if(!gm){let c=qS(".coi");let e=qS(".exi");[...c, ...e].forEach(v=>v.setAttribute("style","background:black !important"))}})()
/****/

/****/
/*If game mode set to 1, then all the paths will be white*/
if(gm){player[0].R=Infinity;qS("td").forEach(v=>{v.addEventListener("click",function(evt){eventHandler(evt.target)})});document.body.style.setProperty("--path-c","white");document.body.style.setProperty("--o-c","#8c8c8c");document.body.style.setProperty("--p-c","black");gE("game-wrapper").style.setProperty("outline-color","#8c8c8c");document.body.style.setProperty("background","#8c8c8c")}
/****/
sight(player);

/*

LATEST THINGS THAT CHANGED:

  ● added new variable to player wich is brightness [B], the brightness level starts from 12 and with every players move it decreases by 1, collecting one coin sets the player brightness to 13 (with 1 additional move before the sight radius decreases)
  ● four brightness levels, and the levels number indicates the players sight radius. ["1 level": B>0, "2 level": B>3, "3 level": B>6, "4 level": B>9]
  ● toggle from register the exit after succesful win of the game
  ● now there won't be any issue if a cell is randomized 2 or more times for a coin or else, so there won't be any bug related to the exit event
  ● added a test mode for quick event checks (based on the gamemode const wich is "gm", when the value is 0 then the game behavior will be default, if value will be higher than 0 the test mode will be activated). Features of test mode: click on any cell that isn't an obstacle and you will immediately teleport there, there is no dark (all the non custom cells are white and the obstacles are darkgray while the players cell is black)
  
*/

/*

TO DO:

  ● a function that makes the enemy, an entity that is not in the game right now, move in the nearest to the player cell 

*/

})()