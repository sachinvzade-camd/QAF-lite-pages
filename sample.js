setTimeout(() => {
    
let creatediv=document.createElement('button')
creatediv.setAttribute("id","submitbutton");
creatediv.appendChild(document.createTextNode("click me"))
document.getElementById('sample').appendChild(creatediv)

document.getElementById('submitbutton').addEventListener('click',openalert)
var lsvalue = new CustomEvent('setlskey', { detail: {key:"user_key"} })
window.parent.document.dispatchEvent(lsvalue)
var callLocation = new CustomEvent('callLocation')
window.parent.document.dispatchEvent(callLocation)
window.document.addEventListener('getLocation', getLocation)
window.document.addEventListener('getlsvalue', getLocalstoreageDetails)
// window.document.addEventListener('eventfrommobile', getEventFromMobile)
}, 10);

function openalert(){
    // window.location.href="tabs/tab1/ozilmain"
    var event = new CustomEvent('openlocation')
    window.parent.document.dispatchEvent(event)
}
function getEventFromMobile(event){
    setTimeout(() => {
        const {latitude,longitude}=event.detail
    }, 5000);
}
function getLocation(event){
        const {latitude,longitude}=event.detail
}

function getLocalstoreageDetails(event){
    const {EmployeeGUID,EmployeeID}=event.detail
}