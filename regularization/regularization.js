var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = SITapiURL
var selectedDate
var isApicall=false
function externalFormValidationRule() {
    if(!isApicall){
        isApicall=true
    return new Promise(async (resolve) => {
        selectedDate = document.getElementById('SelectDate')
        if (selectedDate.value) {
             selectedDate = convertDate(selectedDate.value)
            var currentdate = new Date();
            var last2datefromcurentDate = new Date();
            last2datefromcurentDate.setDate(last2datefromcurentDate.getDate() - 1);
            if (moment(selectedDate).isAfter(currentdate)) {
                openAlert("Please select current date or previous date ");
                resolve(false)
            }
            else {
                let rg_Requests = await getRegularizeRequest();
                    if (rg_Requests && rg_Requests.length > 0) {
                        openAlert("Request has already been raised for the selected date")
                        resolve(false)
                    }
                    else {
                        resolve(true)
                    }
                }
        }
    })
}

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

function getRegularizeRequest() {
    return new Promise((resolve) => {
        let currentDate = new Date();
        let TodayDate = moment(selectedDate).format('YYYY/MM/DD');
        let user = getCurrentUser();
        let objectName = "Regularization_Request";
        let list = 'SelectDate';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = `(SelectDate>='${TodayDate}'<AND>SelectDate<='${TodayDate}')<<NG>>(CreatedByGUID='${user.EmployeeGUID}')`;
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

function convertDate(date) {
    const dateString = date;
    const [datePart, timePart] = dateString.split(",");
    const [day, month, year] = datePart.split("/");
    const dateObject = new Date(year, month - 1, day);
    return dateObject
}
function getByKey(key) {
    let cacheValue = this.localStorage.getItem(key);
    if (cacheValue && (cacheValue != "undefined")) {
        return JSON.parse(cacheValue);
    }
}
function onQafInit() {
    addCustomjs()

}

setTimeout(() => {
    qafServiceLoaded = setInterval(() => {
        if (window.QafService) {
            clearInterval(qafServiceLoaded);
        }
    }, 10);
}, 2000);


function addCustomjs() {
    let jsList = ["https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fng4qafLiteComponents.bundle_178c4750-2177-4105-a58a-028f725dd466.js","https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fmoment.min_aeca73b2-1458-4180-a20b-835e450886be.js", "https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2FnewLibrary_0a09c189-4d90-427b-aafd-76eb76eb80b7.js" ]

    jsList.forEach(val => {
        loadScript(val)
    })
}


function loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = false;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
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
