

window.document.addEventListener('sampleTwitter', getTwitter)
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getTwitter(event){
    
    console.log(event);
    let popUp = document.getElementById("Twitter");
    if (popUp) {
        popUp.style.display = 'block';
    }
}
function closeTwitter(){
    let popUp = document.getElementById("Twitter");
    if (popUp) {
        popUp.style.display = 'none';
    }
}