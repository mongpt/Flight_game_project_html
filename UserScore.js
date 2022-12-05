// Heejin - top5 button, startgame > AJAX

document.getElementById('top5').addEventListener("click", top5Clicked);
async function top5Clicked() {
  document.getElementById('top5-txt').style.visibility="visible";

  console.log('asynchronous download begins');
    try {
        const response = await fetch('http://127.0.0.1:5000/top5Players');
        const jsonData = await response.json();
        console.log(jsonData);
        for (let x =0; x < jsonData.length; x++){
          console.log(jsonData[x])
          const list = document.createElement("li");
          const data = document.createTextNode(`${jsonData[x][0]} / ${jsonData[x][1]}`);
          list.appendChild(data);
          document.getElementById("top5-list").appendChild(list);
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        console.log('asynchronous load complete');
    }

}
document.getElementById('top5-close').addEventListener("click", top5CloseClicked);
function top5CloseClicked() {
  document.getElementById('top5-txt').style.visibility="hidden";
}

let username;
document.getElementById('startgame').addEventListener("click", startGameClicked);
function startGameClicked(event) {
  event.preventDefault() //prevent refreshing all the other settings
  username = document.getElementById('username').value
  console.log(username);
  document.getElementById('username-entry').style.visibility="hidden";
}
