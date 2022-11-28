
const leftRightPosBox = {
  0.24 : 0.40,  //US
  0.37 : 0.65,  //Brazil
  0.89 : 0.73,  //Australia
  0.74 : 0.40,  //China
  0.40 : 0.13,  //GreenLand
  0.15 : 0.25,  //Canada
  0.57 : 0.60,  //Congo
  0.56 : 0.24,  //Finland
  0.80 : 0.20   //Russia
};

const leftRightPosNum = {
  0.24 : 0.50,  //US
  0.37 : 0.75,  //Brazil
  0.89 : 0.63,  //Australia
  0.74 : 0.30,  //China
  0.40 : 0.23,  //GreenLand
  0.15 : 0.35,  //Canada
  0.57 : 0.50,  //Congo
  0.56 : 0.14,  //Finland
  0.80 : 0.10   //Russia
};

//Generate box type: treasure or bomb
var boxTypeList = [];
for (let i=1;i<10;i++) {
  boxTypeList.push(Math.floor(Math.random()*12)+1);
}

var curPlaneLeft = 100; // initial value of airplane position to the left (100px)
var curPlaneTop = 50; // initial value of airplane position to the top (50px)
var airPlane = document.getElementById('airplane-img');

// Get the map screen dimension
var widthMap = document.getElementById('bg-container').clientWidth;
var heightMap = document.getElementById('bg-container').clientHeight;
var bottomSpace = 0.91 * heightMap; //this reserves space at the bottom page to avoid mouse Click event
// Create list of Boxes' positions
var boxNum = 0;
var leftBoxLower = [];
var leftBoxHigher = [];
var topBoxLower = [];
var topBoxHigher = [];
//place boxes to the webpage
var temp = 0;
for (let x in leftRightPosBox) {
  boxNum ++;
  let leftBox = Math.round(widthMap * x);
  let topBox = Math.round(heightMap * leftRightPosBox[x]);
  document.getElementById('box'+boxNum).style = "left:" + x*100 + "%; top:" + leftRightPosBox[x]*100 + "%;"
  document.getElementById('openBox'+boxNum).style = "left:" + x*100 + "%; top:" + leftRightPosBox[x]*100 + "%; visibility: hidden;"
  document.getElementById('bomb'+boxNum).style = "left:" + x*100 + "%; top:" + leftRightPosBox[x]*100 + "%; visibility: hidden;"
  document.getElementById('num'+boxNum).style = "left:" + x*100 + "%; top:" + leftRightPosNum[x]*100 + "%; visibility: hidden;"

  // Creating a map for xBoxSize and yBoxSize
  leftBoxLower.push(leftBox - 25);
  leftBoxHigher.push(leftBox + 25);
  topBoxLower.push(topBox - 23);
  topBoxHigher.push(topBox + 23);
}

//define event mouse click on map and boxes
document.getElementById('map-img').addEventListener("click", mouseClickPos);
document.querySelectorAll('.box').forEach(box => {box.addEventListener("click", mouseClickPos)});
var totalScore = 0; //stores total score the player.
var clickNum = 0; //count number of clicks on boxes (max 9 clicks for 9 boxes)
// Function getting screen position Mouse Click
function mouseClickPos(e) {
  var cursorX = e.pageX;
  var cursorY = e.pageY;
  if (cursorY <= bottomSpace) {
    //calculate new distance
    var newDistance = calDistance(cursorX, cursorY);
    //update new position of airplane
    curPlaneLeft = cursorX;
    curPlaneTop = cursorY;
    //calculate new travel time for airplane
    var travelTime = (newDistance / 210) * 2; // time for airplane travels from current position to a new position (210: minimum distant unit; 2: seconds)
    airPlane.style = "left:" + cursorX + "px; top:" + cursorY + "px; transition: all "+travelTime+"s ease;"
    // Choose a relative box to change its state
    for (let i=1; i<10; i++) {
      if (cursorX >= leftBoxLower[i-1] && cursorX <= leftBoxHigher[i-1] && cursorY >= topBoxLower[i-1] && cursorY <= topBoxHigher[i-1]) {
        setTimeout(function(){document.getElementById('box'+i).style.visibility="hidden";}, travelTime*1000);
        //decide which box is a treasure box or a bomb using data in boxTypeList
        if (boxTypeList[i-1] < 10) {
          clickNum += 1;
          if (clickNum <= 9) {
            setTimeout(function(){document.getElementById('openBox'+i).style.visibility="visible";}, travelTime*1000);
            setTimeout(function(){document.getElementById('num'+i).style.visibility="visible";}, travelTime*1000);
            totalScore += i;
            setTimeout(function(){document.getElementById('score').innerText="SCORE: "+totalScore}, travelTime*1000+500);
          }
          if (clickNum === 9) { // end game if all treasure boxes has been discorverd
            //show end game
            setTimeout(function(){document.getElementById('awesome-job').style.visibility="visible";}, travelTime*1000+1000);
          }
        }
        else {
          setTimeout(function(){document.getElementById('bomb'+i).style.visibility="visible";}, travelTime*1000);
          //setTimeout(function(){document.getElementById('bg-container').style.opacity="20%";}, travelTime*1000+500);
          setTimeout(function(){document.getElementById('gameover').style.visibility="visible";}, travelTime*1000+1000);
        }

        break;
      }
    }
  }
}

//define event help button click
document.getElementById('help').addEventListener("click", helpClicked);
//function responses the help button clicked
function helpClicked() {
  document.getElementById('help-txt').style.visibility="visible";
}

//define event restart button click
document.getElementById('restart').addEventListener("click", restartClicked);
//function responses the restart button clicked (reload page)
function restartClicked() {
  location.reload();
}

//define event reset button click
document.getElementById('reset').addEventListener("click", resetClicked);
//function responses the restart button clicked (reload page)
function resetClicked() {
  var isReset = confirm('Do you want to reset all scores to default values?')
}

//define event help-close button click
document.getElementById('help-close').addEventListener("click", helpCloseClicked);
//function responses the help-close button clicked
function helpCloseClicked() {
  document.getElementById('help-txt').style.visibility="hidden";
}

//function to calculate the flying distance base on old and new airplane positions
var distance;
function calDistance(newLeft, newTop){
  distance = Math.sqrt((newLeft-curPlaneLeft)**2 + (newTop-curPlaneTop)**2);
  return distance;
}
/*
// Maps function
$(document).ready(function() {
  $("#vmap").vectorMap({
    map: 'world_en',
    backgroundColor: '#000',
    borderColor: '#d02525',
    color: '#555',
    hoverOpacity: 0.5,
    selectedColor: '#a49151',
    enableZoom: false,
    enableDrag: false,
    showTooltip: true,
    normalizeFunction: 'polynomial'
  });
});
*/
