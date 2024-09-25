var integrationDetail;
window.document.addEventListener('authenticateForm', getSalesforceDetails)
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getSalesforceDetails(event){
integrationDetail=event.detail.integration;

    let popUp = document.getElementById("authenticateForm");
    if (popUp) {
        popUp.style.display = 'block';
        let pageNameElement=document.getElementById('pageName-au');
        if(pageNameElement){
            pageNameElement.innerHTML=integrationDetail.Title
        }
        setValue()
    }
}
function setValue(){
    let connectionNameElement=document.getElementById('connectionName-au');
    if(connectionNameElement){
       connectionNameElement.value=integrationDetail.ConnectionName
    }
    let consumerkeyElement=document.getElementById('consumerkey-au');
    if(consumerkeyElement){
        consumerkeyElement.value=integrationDetail.Secret1
    }
   
}
function CloseFormAuthentication(value){
    let popUp = document.getElementById("authenticateForm");
    if (popUp) {
        popUp.style.display = 'none';
    }
    var event = new CustomEvent('closeAuthentication', { detail: value })
    window.parent.document.dispatchEvent(event)
    clearForm()
}
function clearForm(){
    let connectionNameElement=document.getElementById('connectionName-au');
    if(connectionNameElement){
       connectionNameElement.value=""
    }
    let consumerkeyElement=document.getElementById('consumerkey-au');
    if(consumerkeyElement){
        consumerkeyElement.value=""
    }
   
}
function saveDetailsAuthentication(){
    let saveObject={};
    let connectionNameElement=document.getElementById('connectionName-au');
    if(connectionNameElement){
        saveObject['ConnectionName']=connectionNameElement.value
    }
    let consumerkeyElement=document.getElementById('consumerkey-au');
    if(consumerkeyElement){
        saveObject['Secret1']=consumerkeyElement.value
    }
    saveObject['Set']=true
    save(saveObject,'Integration_Hub',integrationDetail.RecordID)
}
function save(object, repositoryName,RecordID) {
    return new Promise((resolve) => {
      var recordFieldValueList = [];
      var intermidiateRecord = {}
      var user = getCurrentUser()
      Object.keys(object).forEach((key, value) => {
        recordFieldValueList.push({
          FieldID: null,
          FieldInternalName: key,
          FieldValue: object[key]
        });
      });
      intermidiateRecord.CreatedByID = user.EmployeeID;
      intermidiateRecord.CreatedDate = new Date();
      intermidiateRecord.LastModifiedBy = null;
      intermidiateRecord.ObjectID = repositoryName;
      intermidiateRecord.RecordID = RecordID;
      intermidiateRecord.RecordFieldValues = recordFieldValueList;
      window.QafService.UpdateItem(intermidiateRecord).then(response => {
      
        CloseFormAuthentication(true)
        resolve({
          response
        })
      });
    }
    )
  }
  function getCurrentUser() {
    let userDetails = '';
    let userKey = window.localStorage.getItem('user_key');
    if (userKey) {
        let user = JSON.parse(userKey);
        if (user.value) {
            userDetails = user.value;
        }
    }
    return userDetails;
}