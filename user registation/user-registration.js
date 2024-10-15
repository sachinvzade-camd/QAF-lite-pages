var workEmailvalue;
var errorElement=document.getElementById('error-work')
var errorVerifyElement = document.getElementById('error-verify');
var errorWorkspaceElement = document.getElementById('error-workspace');
var apURL = localStorage.getItem('env')
var regFormElement=document.getElementById('regForm')
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

  var URegitryValue={
    Eumail:'',
    Duc:'',
    RType:'',
    DName:'',
    DCtct:'',
    DWeb:'',
    DName:''
}

  const validateEmail = (email) => {
    return(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    ).test(email);
  };
  function checkemail(){
    if(errorElement){
        errorElement.innerHTML=""
    }
  }
async function onclickworkemail() {
    
    if(errorElement){
        errorElement.innerHTML=""
    }
    let workEmailValueElement = document.getElementById('w-email');
    if (workEmailValueElement) {
        workEmailvalue = workEmailValueElement.value;

        if(!workEmailvalue){
            if(errorElement){
                errorElement.innerHTML="Please enter email"
            }
            return
        }
        if(workEmailvalue.length>50){
            if(errorElement){
                errorElement.innerHTML="email limit 50 char"
            } 
        }

        let isValidEmail=validateEmail(workEmailvalue)
        if(!isValidEmail){
            if(errorElement){
                errorElement.innerHTML="Enter valid email"
            }
            return
        }
        let extension=workEmailvalue.split("@")[1]
        let isPresent=emailDomains.includes(extension)
        if(isPresent){
            if(errorElement){
                errorElement.innerHTML="Please enter a valid business email address (e.g., jon@company.com)"
            }
            return
        }
        
    }
    URegitryValue={
        Eumail:workEmailvalue,
    }
    
    let response =await apiCall('rgup',URegitryValue);
    if (response) {
        if (response.RType === 1) {
            let verificationCodeElement=document.getElementById('verification-code');
if(verificationCodeElement){
  verificationCodeElement.value="";
}
            let workemailElement = document.getElementById('work-email');
            if (workemailElement) {
                workemailElement.style.display = 'none'
            }
            let verificationElement = document.getElementById('verification');
            if (verificationElement) {
                verificationElement.style.display = 'block'
            }
            let displayEmailElement = document.getElementById('displayemail');
            if (displayEmailElement) {
                displayEmailElement.innerHTML = workEmailvalue;
            }
        } else {
            if (errorElement) {
                errorElement.innerHTML = response.RMcs
            }
            return
        }
    }
}

 async function apiCall(apiName,payLoad){
    addDisableClass()

    let apiURL=`${apURL}/api/${apiName}`
    const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(payLoad)
    })
       let responseValue= await response.json();
    removeDisableClass()
       return responseValue
}

async function onclickverification(){

let displayEmailElement=document.getElementById('displayemail');
if(displayEmailElement){
    displayEmailElement.value=workEmailvalue;
}
let verificationCodeElement=document.getElementById('verification-code');
if(verificationCodeElement){
   let code=verificationCodeElement.value;
   if(!code){
    if (errorVerifyElement) {
        errorVerifyElement.innerHTML = 'Please enter the code'
    }
    return
   }
   if(code.length>10){
    if (errorVerifyElement) {
        errorVerifyElement.innerHTML = 'code length should not be more than 8 character '
    }
    return
   }
    URegitryValue['Duc'] = code
    let response = await apiCall('rguv', URegitryValue)
    if (response) {
        if (response.RType === 1) {
            let wverificationElement = document.getElementById('verification');
            if (wverificationElement) {
                wverificationElement.style.display = 'none'
            }
            let workspaceElement = document.getElementById('workspace');
            if (workspaceElement) {
                workspaceElement.style.display = 'block'
            }
        } else {
            if (errorVerifyElement) {
                errorVerifyElement.innerHTML = response.RMcs
            }
            return
        }
    }

   
}
  
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
async function onClickWorksendDetails(){
    let firstNameValue;
    let firstNameElement = document.getElementById('fname');
    if (firstNameElement) {
        firstNameValue = firstNameElement.value
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

    if(!(firstNameValue&&contactnumberValue&&websiteValue&&companySizeValue)){
        if(errorWorkspaceElement){
            errorWorkspaceElement.innerHTML='All fields are required'
        }
        return
    }
    if((contactnumberValue.length>10)){
        if(errorWorkspaceElement){
            errorWorkspaceElement.innerHTML='Please enter a valid contact number'
        }
        return
    }

    URegitryValue['DName'] = firstNameValue
    URegitryValue['DCtct'] = contactnumberValue
    URegitryValue['DWeb'] = websiteValue
    URegitryValue['DSez'] = companySizeValue

    let response =await apiCall('guda',URegitryValue);

    if (response) {
        if (response.RType === 1) {
            let workspaceElement=document.getElementById('workspace');
            if(workspaceElement){
                workspaceElement.style.display='none'
            }
            let sentDetilsElement=document.getElementById('sent-details');
            if(sentDetilsElement){
                sentDetilsElement.style.display='block'
            }
        } else {
            if (errorWorkspaceElement) {
                errorWorkspaceElement.innerHTML = response.RMcs
            }
            return
        }
    }
 
}

function addDisableClass() {
    if(regFormElement){
        regFormElement.classList.add('disable-reg-form')
    }
}
function removeDisableClass() {
    if(regFormElement){
        regFormElement.classList.remove('disable-reg-form')
    }
}