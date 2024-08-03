

window.document.addEventListener('samplemobile', getMobileDetails)
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getMobileDetails(event){
    debugger
    console.log(event);
    let popUp = document.getElementById("mobile");
    if (popUp) {
        popUp.style.display = 'block';
    }
}
function closeMobile(){
    let popUp = document.getElementById("mobile");
    if (popUp) {
        popUp.style.display = 'none';
    }
}