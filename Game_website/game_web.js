const change = document.querySelector('p');

function picB() {
    document.getElementById('target').src = "img/picB.jpg";
}
change.addEventListener('mouseover', picB);


function picA() {
    document.getElementById('target').src = "img/picA.jpg";
}
change.addEventListener('mouseout', picA); 