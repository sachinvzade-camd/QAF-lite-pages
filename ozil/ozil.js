function openTab(evt, id) {
    let locationOrigin=window.location.origin
    var i, tabcontent, tablinks;
    document.getElementById('candidate').style.display = "block";
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(id).style.display = "block";
    evt.currentTarget.className += " active";
    if(id==='customer'){
        let customer=document.getElementById('customer');
        if(customer){
            customer.innerHTML=`<iframe
            src="${locationOrigin}/crm/crm-customer-directory?ln=false&header=false" frameborder="0" width="100%"
            height="100%"></iframe>`
        }
    }
    if(id==='contact'){
        let contact=document.getElementById('contact');
        if(contact){
            contact.innerHTML=`<iframe
            src="${locationOrigin}/crm/crm-contact-directory?ln=false&header=false" frameborder="0" width="100%"
            height="100%"></iframe>`
        }
    }
    if(id==='candidate'){
        let candidate=document.getElementById('candidate');
        if(candidate){
            candidate.innerHTML=`<iframe
            src="${locationOrigin}/recruitment/candidate-Search?ln=false&header=false" frameborder="0" width="100%"
            height="100%"></iframe>`
        }
    }
}
setTimeout(() => {
    let locationOrigin=window.location.origin
    let candidate=document.getElementById('candidate');
if(candidate){
    candidate.innerHTML=`<iframe
    src="${locationOrigin}/recruitment/candidate-Search?ln=false&header=false" frameborder="0" width="100%"
    height="100%"></iframe>`
}
}, 1000);
