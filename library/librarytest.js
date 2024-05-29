function createForm() {
}
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        createForm()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function submitForm(){
    let arrayOFID=["SingleLine","Multiline","Email"]
    let saveObject={}
    arrayOFID.forEach(id=>{
        let objectElement=document.getElementById(id)
        if(objectElement){
            value=objectElement.value
            saveObject[id]=value
        }
    })

    let isvalid=checkValidation(saveObject)
    if(isvalid){
        saveForm(saveObject);
    }
}

    function checkValidation(saveObject){

        if(!saveObject.Email){
            openAlert("Please enter your email")
            return false
        }else if(!validateEmail(saveObject.Email)){
            openAlert("Please enter a correct email address format")
            return false
        }
        return true
    }


function openAlert(message) {
    let qafAlertObject={
        IsShow:true,
        Message:message,
        Type:'ok'
    }
    const body = document.body;
    let alertElement=document.createElement('qaf-alert')
    body.appendChild(alertElement);
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}

function validateEmail(value) {
	// check if the value is not empty
	if (!value) {
		return false;
	}
	// validate email format
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const email = value.trim();
	if (!emailRegex.test(email)) {
		return false;
	}
	return true;
}

function saveForm(submitFormObject) {
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
        intermidiateRecord.ObjectID = "KrunalTestingRepository";
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.CreateItem(intermidiateRecord).then(response => {
            openAlert("Record has been saved")
            resolve({
                response
            })
        });
    })
}