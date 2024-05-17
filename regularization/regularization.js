function externalFormValidationRule() {
    return new Promise((resolve) => {
        let selected = document.getElementById('SelectDate')
        if (selected.value) {
            let selectedDate = convertDate(selected.value)
            var currentdate = new Date();
            var last2datefromcurentDate = new Date();
            last2datefromcurentDate.setDate(last2datefromcurentDate.getDate() - 1);
            if (moment(selectedDate).isAfter(currentdate)) {
                openAlert("Please select current date or previous date ");
                resolve(false)
            }
            // else if (moment(selectedDate).isBefore(last2datefromcurentDate)) {
            //     alert("Please select current date or previous date ");
            //     resolve(false)
            // }
            else {
                resolve(true)
            }
        }
    })

}
function convertDate(date) {
    const dateString = date;
    const [datePart, timePart] = dateString.split(",");
    const [day,month,  year] = datePart.split("/");
    const dateObject = new Date(year, month - 1, day);
    return dateObject
}
function getByKey(key) {
    let cacheValue = this.localStorage.getItem(key);
    if (cacheValue && (cacheValue != "undefined")) {
        return JSON.parse(cacheValue);
    }
}
function onQafInit(){
  
}

function addCustomjs(){
    let jsList=["https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fmoment.min_aeca73b2-1458-4180-a20b-835e450886be.js","https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Flibraray_9d8ef3ed-d2a4-4648-9706-91f5d7c21f9f.js"]
    jsList.forEach(val=>{
        loadScript(val)
    })
}
function loadScript(url) {
    const body = document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
  addCustomjs()

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
