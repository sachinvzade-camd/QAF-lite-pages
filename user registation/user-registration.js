var workEmailvalue;
var emailDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "aol.com",
    "hotmail.co.uk",
    "hotmail.fr",
    "msn.com",
    "yahoo.fr",
    "wanadoo.fr",
    "orange.fr",
    "comcast.net",
    "yahoo.co.uk",
    "yahoo.com.br",
    "yahoo.co.in",
    "live.com",
    "rediffmail.com",
    "free.fr",
    "gmx.de",
    "web.de",
    "yandex.ru",
    "ymail.com",
    "libero.it",
    "outlook.com",
    "uol.com.br",
    "bol.com.br",
    "mail.ru",
    "cox.net",
    "hotmail.it",
    "sbcglobal.net",
    "sfr.fr",
    "live.fr",
    "verizon.net",
    "live.co.uk",
    "googlemail.com",
    "yahoo.es",
    "ig.com.br",
    "live.nl",
    "bigpond.com",
    "terra.com.br",
    "yahoo.it",
    "neuf.fr",
    "yahoo.de",
    "alice.it",
    "rocketmail.com",
    "att.net",
    "laposte.net",
    "facebook.com",
    "bellsouth.net",
    "yahoo.in",
    "hotmail.es",
    "charter.net",
    "yahoo.ca",
    "yahoo.com.au",
    "rambler.ru",
    "hotmail.de",
    "tiscali.it",
    "shaw.ca",
    "yahoo.co.jp",
    "sky.com",
    "earthlink.net",
    "optonline.net",
    "freenet.de",
    "t-online.de",
    "aliceadsl.fr",
    "virgilio.it",
    "home.nl",
    "qq.com",
    "telenet.be",
    "me.com",
    "yahoo.com.ar",
    "tiscali.co.uk",
    "yahoo.com.mx",
    "voila.fr",
    "gmx.net",
    "mail.com",
    "planet.nl",
    "tin.it",
    "live.it",
    "ntlworld.com",
    "arcor.de",
    "yahoo.co.id",
    "frontiernet.net",
    "hetnet.nl",
    "live.com.au",
    "yahoo.com.sg",
    "zonnet.nl",
    "club-internet.fr",
    "juno.com",
    "optusnet.com.au",
    "blueyonder.co.uk",
    "bluewin.ch",
    "skynet.be",
    "sympatico.ca",
    "windstream.net",
    "mac.com",
    "centurytel.net",
    "chello.nl",
    "live.ca",
    "aim.com",
    "bigpond.net.au"
  ];
  
async function onclickworkemail() {
    
    let workEmailValueElement = document.getElementById('w-email');
    if (workEmailValueElement) {
        workEmailvalue = workEmailValueElement.value;

        let isPresent=emailDomains.includes(workEmailvalue)
        if(isPresent){
            return
        }
        
    }
    // let value =await apiCall('','')

    let workemailElement = document.getElementById('work-email');
    if (workemailElement) {
        workemailElement.style.display = 'none'
    }
    let verificationElement = document.getElementById('verification');
    if (verificationElement) {
        verificationElement.style.display = 'block'
    }


}

 async function apiCall(url,payLoad){
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(payLoad)
    })
        await response.json();
}

async function onclickverification(){

// let displayEmailElement=document.getElementById('displayemail');
// if(displayEmailElement){
//     displayEmailElement.value=workEmailvalue;
// }
// let verificationCodeElement=document.getElementById('verification-code');
// if(verificationCodeElement){
//    let code=verificationCodeElement.value;
//    if(!code){
//     let errorVerifyElement = document.getElementById('error-verify');
//     if (errorVerifyElement) {
//         errorVerifyElement.innerHTML = 'please add code '
//     }
//     return
//    }
// }
// let value =await apiCall('','')
// if(!value){

//     return;
// }
    let wverificationElement=document.getElementById('verification');
    if(wverificationElement){
        wverificationElement.style.display='none'
    }
    let workspaceElement=document.getElementById('workspace');
    if(workspaceElement){
        workspaceElement.style.display='block'
    }
}
async function onresentCode(){
let value =await apiCall('','')

}
function onchangeEmailID(){
    let workemailElement = document.getElementById('work-email');
    if (workemailElement) {
        workemailElement.style.display = 'block'
    }
    let verificationElement = document.getElementById('verification');
    if (verificationElement) {
        verificationElement.style.display = 'none'
    }
}
function onClickWorksendDetails(){
    let firstNameValue;
    let firstNameElement = document.getElementById('fname');
    if (firstNameElement) {
        firstNameValue = firstNameElement.value
    }
    let lastNameValue;
    let lastNameElement = document.getElementById('lname');
    if (lastNameElement) {
        lastNameValue = lastNameElement.value
    }
    let contactnumberValue;
    let contactNumberElement = document.getElementById('contactnumber');
    if (contactNumberElement) {
        contactnumberValue = contactNumberElement.value
    }

    let websiteValue;
    let websiteElement = document.getElementById('website');
    if (websiteElement) {
        websiteValue = websiteElement.value
    }
    let companySizeValue;
    let companySizeElement = document.getElementById('companySize');
    if (companySizeElement) {
        companySizeValue = companySizeElement.value
    }
    let employee = {
        a: firstNameValue,
        b: lastNameValue,
        c: contactnumberValue,
        d: websiteValue,
        e: companySizeValue
    }

    let workspaceElement=document.getElementById('workspace');
    if(workspaceElement){
        workspaceElement.style.display='none'
    }
    let sentDetilsElement=document.getElementById('sent-details');
    if(sentDetilsElement){
        sentDetilsElement.style.display='block'
    }
 
}