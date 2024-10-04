var workEmailvalue;
async function onclickworkemail() {
    
    // let workEmailValueElement = document.getElementById('w-email');
    // if (workEmailValueElement) {
    //     workEmailvalue = workEmailValueElement.value;
    // }
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