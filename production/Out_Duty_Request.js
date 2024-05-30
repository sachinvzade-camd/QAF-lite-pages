var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = SITapiURL
var isApicall=false
var selectedDate
var hiddenFieldsFormWindow = ["RequestFor"];
var sitHostURL='qaffirst.quickappflow.com'
var funFirstHostURL='funfirst.quickappflow.com'
var maHostName=funFirstHostURL
function externalFormValidationRule() {
    if(!isApicall){
        isApicall=true
    return new Promise(async (resolve) => {
         selectedDate = document.getElementById('RequestDate')
        if (selectedDate.value) {
            selectedDate = convertDate(selectedDate.value)
            let od_Request_Records = await getODRequest();
            if (od_Request_Records&&od_Request_Records.length>0) {
                openAlert("Request has already been raised for the selected date")
            }
            else {
                resolve(true)
            }
        }
    })}

}
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        window.localStorage.setItem('ma',maHostName)
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getODRequest() {
    return new Promise((resolve) => {
        let TodayDate = moment(selectedDate).format('YYYY/MM/DD');
        let user = getCurrentUser();
        let objectName = "Out_Duty_Request";
        let list = 'RequestDate';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause =  `(RequestDate>='${TodayDate}'<AND>RequestDate<='${TodayDate}')<<NG>>(CreatedByGUID='${user.EmployeeGUID}')`
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy)
            .then((request) => {
                if (request && request.length > 0) {
                    resolve(request);
                }
                else {
                    resolve([])
                }
            });
    });

}

function isMobileDevice() {
    var screenWidth = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    return screenWidth < 768 ? true : false;

}


function formatDate(dateStr) {
    let parts = dateStr.split('/');
    let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
}


function extractDateIndianFormat(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-IN', { month: 'long' });
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
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

function getByKey(key) {
    let cacheValue = this.localStorage.getItem(key);
    if (cacheValue && (cacheValue != "undefined")) {
        return JSON.parse(cacheValue);
    }
}
function onQafInit() {
    hiddenFieldsFormWindow = ["RequestFor"];
    addCustomjs()
}
function convertDate(date) {
    const dateString = date;
    const [datePart, timePart] = dateString.split(",");
    const [day, month, year] = datePart.split("/");
    const dateObject = new Date(year, month - 1, day);
    return dateObject
}
function addCustomjs() {
    // let jsList = ["https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fmoment.min_aeca73b2-1458-4180-a20b-835e450886be.js", "https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2FnewLibrary_0a09c189-4d90-427b-aafd-76eb76eb80b7.js", "https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fng4qafLiteComponents.bundle_178c4750-2177-4105-a58a-028f725dd466.js"]
    let jsList=["https://funfirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fmoment.min_44ef7032-a417-43ef-b473-87c4067fc427.js"]
    jsList.forEach(val => {
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


function openAlert(message) {
    isApicall=false
    
    let qafAlertObject = {
        IsShow: true,
        Message: message,
        Type: 'ok'
    }
    const body = document.body;
    let alertElement = document.createElement('qaf-alert')
    body.appendChild(alertElement);
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}