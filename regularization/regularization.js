function externalFormValidationRule() {
    return new Promise((resolve) => {
        let selected = document.getElementById('SelectDate')
        if (selected.value) {
            let dateFormate = getByKey("TimeZone");
            let timezoneLable = dateFormate ? dateFormate.split(",")[1] : "Asia/Kolkata";
            let language = dateFormate ? dateFormate.split(",")[0] : "IN";
            let date = (new Date(selected.value).toLocaleString(language, { timeZone: timezoneLable }))
            let selectedDate = convertDate(date)
            var currentdate = new Date();
            var last2datefromcurentDate = new Date();
            last2datefromcurentDate.setDate(last2datefromcurentDate.getDate() - 2);
            if (moment(selectedDate).isAfter(currentdate)) {
                alert("Not allow date more than current date");
            }
            else if (moment(selectedDate).isBefore(last2datefromcurentDate)) {
                alert("only 2 days allow from current date");
            }
            else {
                resolve(true)
            }
        }
    })

}
function convertDate(date) {
    const dateString = date;
    const [datePart, timePart] = dateString.split(",");
    const [month, day, year] = datePart.split("/");
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
    debugger
    window.hiddenFieldsFormWindow=["Lookup","SingleLine"]
}

function addCustomjs(){
    let jsList=["https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fmoment.min_aeca73b2-1458-4180-a20b-835e450886be.js"]

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