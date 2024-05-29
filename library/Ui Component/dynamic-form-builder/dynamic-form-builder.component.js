try {
  var objectDefination;
    class DynamicFormBuilderComponent extends HTMLElement {
      static observedAttributes = ["field"];
      constructor() {
        super();
      }
      connectedCallback() {
        objectDefination.Fields.forEach(element => {
          buildControl(element)
        });
      }
      disconnectedCallback() {
      }
      adoptedCallback() {
          buildControl(fields)
      }
      attributeChangedCallback(name, oldValue, newValue) {
        
        if (name === 'field') {
          
         let  objectDefine = JSON.parse(newValue)
         objectDefination=objectDefine
          if (typeof (objectDefine) === 'object') {
              this.innerHTML = `
              <button onclick="submitForm()">Click</button>
              <div id="form-builder"></div>
                `;
               
          }
       
        } 
      }
    }
    
  var dynamicFormBuilderComponentExists = document.querySelector("dynamic-form-builder");
  if (typeof (dynamicFormBuilderComponentExists) === 'undefined' || dynamicFormBuilderComponentExists === null) {
    customElements.define("dynamic-form-builder", DynamicFormBuilderComponent);
  }
  } catch (error) {
   
  }

function buildControl(fieldDefination){
  let createDynamicformBuilderElement=document.createElement('single-line-text')
  let formcontrolsElement=document.getElementById('form-builder')
  createDynamicformBuilderElement.setAttribute("fieldsss",JSON.stringify(fieldDefination));
  formcontrolsElement.appendChild(createDynamicformBuilderElement)
}
function submitForm(){
  let saveObject={}
  objectDefination.Fields.forEach(element => {
    let value=""
    let objectElement=document.getElementById(element.InternalName)
    if(objectElement){
      value=objectElement.value
    }
    saveObject[element.InternalName]=value


  });

  saveForm(saveObject)
}

function saveForm(submitFormObject) {
  if(submitFormObject){
  return new Promise((resolve) => {
      var recordFieldValueList = [];
      var intermidiateRecord = {}
      var user = getCurrentUser()
      Object.keys(submitFormObject).forEach((key, value) => {
         recordFieldValueList.push({
              FieldID: null,
              FieldInternalName: key,
              FieldValue: submitFormObject[key]
          });
      });
      intermidiateRecord.CreatedByID = user.EmployeeID;
      intermidiateRecord.CreatedDate = new Date();
      intermidiateRecord.LastModifiedBy = null;
      intermidiateRecord.ObjectID = objectDefination.ObjectName;
      intermidiateRecord.RecordID = null;
      intermidiateRecord.RecordFieldValues = recordFieldValueList;
      window.QafService.CreateItem(intermidiateRecord).then(response => {
          resolve({
              response
          })
      });
  })
}}
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