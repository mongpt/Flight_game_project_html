const initPosBox = {
  0.24: 0.42, //US
  0.37: 0.68, //Brazil
  0.89: 0.73, //Australia
  0.74: 0.40, //China
  0.40: 0.20, //GreenLand
  0.15: 0.25, //Canada
  0.57: 0.60, //Congo
  0.56: 0.24, //Finland
  0.80: 0.20 //Russia
};

const initPosNum = {
  0.24: 0.45, //US
  0.37: 0.71, //Brazil
  0.89: 0.76, //Australia
  0.74: 0.43, //China
  0.40: 0.23, //GreenLand
  0.15: 0.28, //Canada
  0.57: 0.63, //Congo
  0.56: 0.27, //Finland
  0.80: 0.23 //Russia
};

const initPosWp = {
  0.285: 0.34, //US
  0.29: 0.68, //Brazil
  0.89: 0.61, //Australia
  0.82: 0.43, //China
  0.44: 0.11, //GreenLand
  0.19: 0.15, //Canada
  0.65: 0.60, //Congo
  0.62: 0.20, //Finland
  0.87: 0.17 //Russia
};

// Define audio files
//BG music
var bgMusic = new Audio("Sounds/Backgound.mp3");
//Buttons clicked sound
var clickSound = new Audio("Sounds/Click.mp3");
//Congrats sound
var congratSound = new Audio("Sounds/Congrats.mp3");
//Bomb explosion sound
var exploSound = new Audio("Sounds/explosion.mp4");
//Game over sound
var gOverSound = new Audio("Sounds/gameover.wav");
//Treasure box sound
var treasureSound = new Audio("Sounds/OpenBox.mp3");

//Generate box type: treasure or bomb
var boxTypeList = [];
for (let i = 1; i < 10; i++) {
  var rand = Math.floor(Math.random() * 110) + 1
  boxTypeList.push(Math.floor(Math.random() * 110) + 1);
  if (rand > 99) {
    document.querySelector('li a').style.color="red";
  }
}
console.log(boxTypeList)
var curPlaneLeft = 100; // initial value of airplane position to the left (100px)
var curPlaneTop = 50; // initial value of airplane position to the top (50px)
var airPlane = document.getElementById('airplane-img');

// Get the map screen dimension
var widthMap = document.getElementById('bg-container').clientWidth;
var heightMap = document.getElementById('bg-container').clientHeight;
var bottomSpace = 0.91 * heightMap; //this reserves space at the bottom page to avoid mouse Click event
// Create list of Boxes' positions
var boxNum = 1;
var leftBoxLower = [];
var leftBoxHigher = [];
var topBoxLower = [];
var topBoxHigher = [];
//place boxes to the webpage
for (let x in initPosBox) {
  let leftBox = Math.round(widthMap * x);
  let topBox = Math.round(heightMap * initPosBox[x]);
  document.getElementById('box' + boxNum).style = "left:" + x * 100 + "%; top:" + initPosBox[x] * 100 + "%;"
  document.getElementById('openBox' + boxNum).style = "left:" + x * 100 + "%; top:" + initPosBox[x] * 100 + "%; visibility: hidden;"
  document.getElementById('bomb' + boxNum).style = "left:" + x * 100 + "%; top:" + initPosBox[x] * 100 + "%; visibility: hidden;"
  document.getElementById('point' + boxNum).style = "left:" + x * 100 + "%; top:" + initPosNum[x] * 100 + "%; visibility: hidden;"
  document.getElementById('point' + boxNum).innerHTML = '$' + boxTypeList[boxNum - 1];
  boxNum++;

  // Creating a map for xBoxSize and yBoxSize
  leftBoxLower.push(leftBox - 25);
  leftBoxHigher.push(leftBox + 25);
  topBoxLower.push(topBox - 23);
  topBoxHigher.push(topBox + 23);
}
boxNum = 1;
for (let x in initPosWp) {
  document.getElementById('wp' + boxNum).style = "left:" + x * 100 + "%; top:" + initPosWp[x] * 100 + "%;"
  document.getElementById('show' + boxNum).style = "left:" + x * 100 + "%; top:" + initPosWp[x] * 100 + "%;"
  boxNum++;
}
//add addEventListener for arrow keys
document.addEventListener("keydown", keys);

function keys(e) {
  //  console.log(event.key);
  switch (event.key) {
    case "ArrowLeft":
      turnLeft();
      break;
    case "ArrowRight":
      turnRight();
      break;
    case "ArrowUp":
      goUp();
      break;
    case "ArrowDown":
      goDown();
      break;
    case "Enter":
      collectTreasure();
      break;
  }
  airPlane.style = "left:" + curPlaneLeft + "px; top:" + curPlaneTop + "px; transition: all 0.4s linear;"
}

function turnLeft() {
  curPlaneLeft -= 5;
}

function turnRight() {
  curPlaneLeft += 5;
}

function goUp() {
  curPlaneTop -= 5;
}

function goDown() {
  curPlaneTop += 5;
}

var totalScore = 0; //stores total score the player.
var collectedBoxes = 0; //count number of clicks on boxes (max 9 clicks for 9 boxes)
var isCollected = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //flg for makring if a box has been collected or not (0: available, 1: collected)
function collectTreasure() {
  //if not all boxes have been collected, do something
  if (collectedBoxes < 10) {
    //check which box has been selected
    //var tmp;
    for (let i = 1; i < 10; i++) {

      if (curPlaneLeft >= leftBoxLower[i - 1] && curPlaneLeft <= leftBoxHigher[i - 1] && curPlaneTop >= topBoxLower[i - 1] && curPlaneTop <= topBoxHigher[i - 1]) {
        if (isCollected[i - 1] == 0) {
          isCollected[i - 1] = 1;
          document.getElementById('box' + i).style.visibility = "hidden";
          //decide which box is a treasure box or a bomb using data in boxTypeList
          if (boxTypeList[i - 1] < 100) {
            collectedBoxes++;
            document.getElementById('openBox' + i).style.visibility = "visible";
            document.getElementById('point' + i).style.visibility = "visible";
            treasureSound.play();
            totalScore += boxTypeList[i - 1];
            document.getElementById('score').innerText = "$$$: " + totalScore;
            if (collectedBoxes === 9) { // end game if all treasure boxes has been discorverd
              //show end game
              sendScore();
              setTimeout(function() {
                document.getElementById('congrats').style.visibility = "visible";
                bgMusic.pause();
                congratSound.play();
              }, 1500);
            }
          } else {
            document.getElementById('bomb' + i).style.visibility = "visible";
            bgMusic.pause();
            exploSound.play();
            sendScore();
            setTimeout(function() {
              document.getElementById('gameover').style.visibility = "visible";
              gOverSound.play();
            }, 1500);
          }
        }
        break;
      }
    }
  }
}

//define event restart button click
document.getElementById('restart').addEventListener("click", restartClicked);
//function responses the restart button clicked (reload page)
function restartClicked() {
  clickSound.play();
  location.reload();
}

//define event Reset Score button click
document.getElementById('reset').addEventListener("click", resetForm);
//function call resetForm
function resetForm() {
  clickSound.play();
  document.getElementById('reset-confirm').style.visibility = "visible";
}
//define event reset YES button click
document.getElementById('reset-yes').addEventListener("click", resetYes);

// Save to database function   - totalScore / username

async function sendScore() {
  const data = {
    body: JSON.stringify({
      username: username,
      score: totalScore,
    }),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  }
  // send the data
  try {
    const response = await fetch('https://mongpt.pythonanywhere.com/top5Players', data); // Send data to server and receive a server response
    if (!response.ok) throw new Error('Invalid input!'); // If an error occurs, an error message is thrown
    const json = await response.json(); // convert the loaded text JSON to a JavaScript object / array
    console.log('result', json); // print the result to the console
  } catch (e) {
    console.log('error', e);
  }
}

//function responses the restart button clicked (reload page)
async function resetYes() {
  clickSound.play();
  const response = await fetch('https://mongpt.pythonanywhere.com/resetDefault'); // Send data to server and receive a server response

  resetNo();
}
//define event reset YES button click
document.getElementById('reset-no').addEventListener("click", resetNo);
//function responses the restart button clicked (reload page)
function resetNo() {
  clickSound.play();
  document.getElementById('reset-confirm').style.visibility = "hidden";
}

// Heejin - top5 button, startgame > AJAX

document.getElementById('top5').addEventListener("click", top5Clicked);
async function top5Clicked() {
  clickSound.play();
  document.getElementById('table').style.visibility = "visible";
  console.log('asynchronous download begins');
  try {
    const response = await fetch('https://mongpt.pythonanywhere.com/top5Players');
    const jsonData = await response.json();
    //console.log(jsonData);
    var tBody = document.getElementById('tBody');
    //delete all rows first
    for (let i = 0; i < 6; i++) {
      tBody.deleteRow(0);
    }
    //Insert new data
    for (let x = 0; x < 5; x++) {
      console.log(jsonData[x])
      var tRow = tBody.insertRow(x);
      var cell1 = tRow.insertCell(0);
      var cell2 = tRow.insertCell(1);
      var cell3 = tRow.insertCell(2);
      cell1.innerHTML = x+1;
      cell2.innerHTML = `${jsonData[x][0]}`;
      cell3.innerHTML = `${jsonData[x][1]}`;
    }
    var tRow = tBody.insertRow(5);

  } catch (error) {
    console.log(error.message);
  } finally {
    console.log('asynchronous load complete');
  }
}
document.getElementById('top5-btn').addEventListener("click", top5OK);

function top5OK(event) {
  clickSound.play();
  document.getElementById('table').style.visibility = "hidden";
}

var username;
document.getElementById('name-btn').addEventListener("click", nameOK);

function nameOK(event) {
  clickSound.play();
  username = document.getElementById('username').value;
  if (username == "") {
    username = "noname";
  }
  console.log(username);
  document.getElementById('username-entry').style.visibility = "hidden";
  document.getElementById('pName').innerHTML = "Hello: " + username;
  event.preventDefault() //prevent refreshing all the other settings
  bgMusic.play();
}

// Xuan weather part
var cityId = [
  4140963, //US
  3469058, //Brazil
  2172517, //Australia
  1816670, //China
  3421319, //GreenLand
  6094817, //Canada
  2314302, //Congo
  658225, //Finland
  524901 //Russia
];
//function to fetch data from API
async function getData(cityId) {
  try {
    var response = await fetch('https://mongpt.pythonanywhere.com/' + cityId);
    var data = await response.json();
    return data
  } catch (error) {
    console.log(error.message);
  } finally {}
};
for (let i = 1; i < 10; i++) {
  var city = getData(cityId[i - 1]);
  city.then(
    (value) => weatherData(value, 'show' + i)
  );
}

function weatherData(a, b) {
  //console.log(a); // "Some User token"
  var temp = JSON.parse(JSON.stringify(a));
  var city = temp['name'];
  var description = temp['weather'][0]['description'];
  var icon = "http://openweathermap.org/img/wn/" + temp['weather'][0]['icon'] + ".png";
  var temper = Math.round(temp['main']['temp'] - 273.15); // in F
  var humid = temp['main']['humidity'];
  var windSpeed = temp['wind']['speed'];
  //console.log(temp['weather'][0]['icon']);
  document.getElementById(b).innerHTML += "<img src=" + icon + " alt=''></img> <br>";
  document.getElementById(b).innerHTML += city + "<br>";
  document.getElementById(b).innerHTML += description + "<br>";
  document.getElementById(b).innerHTML += "T: " + temper + "°C" + "<br>";
  document.getElementById(b).innerHTML += "H: " + humid + "%";
}
