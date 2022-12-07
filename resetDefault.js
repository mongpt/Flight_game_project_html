document.getElementById('reset').addEventListener("click", resetDefault);
function resetDefault() {
    fetch('http://127.0.0.1:5000/resetDefault');
    alert("User results have been reset to the default value");
}