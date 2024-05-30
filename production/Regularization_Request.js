var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = funFirstapiURL
var selectedDate
var isApicall = false;
var attendenceList = [];
var webURL_Value;
var sitHostURL='demtis.quickappflow.com'
var funFirstHostURL='inskferda.azurewebsites.net'
var hostName=funFirstHostURL
var hiddenFieldsFormWindow = ["RequestFor"];
var sitHostURL='qaffirst.quickappflow.com'
var funFirstHostURL='funfirst.quickappflow.com'
var maHostName=funFirstHostURL


var inputDate;
function externalFormValidationRule() {
    if (!isApicall) {
        isApicall = true
        return new Promise(async (resolve) => {
            selectedDate = document.getElementById('SelectDate')
            if (selectedDate.value) {
                inputDate = selectedDate.value
                selectedDate = selectedDate.value
                var currentdate = new Date();
                var last2datefromcurentDate = new Date();
                last2datefromcurentDate.setDate(last2datefromcurentDate.getDate() - 1);
                await getAllAttendence();
                let dateselected = (convertDate(selectedDate));
                if (moment(dateselected).isAfter(currentdate, 'date')) {
                    openAlert("Please select current date or previous date ");
                    resolve(false)
                }
                else {
                    
                    if (attendenceList && attendenceList.length > 0) {
                        let attendence = attendenceList.filter(att => moment(dateselected).isSame(att.Day, 'date'))
                        if (attendence && attendence.length > 0) {
                            if (attendence[0].DayStatus != "Present" || attendence[0].IsHalfDay) {
                                let rg_Requests = await getRegularizeRequest();
                                if (rg_Requests && rg_Requests.length > 0) {
                                    openAlert("Request has already been raised for the selected date")
                                    resolve(false)
                                }
                                else {
                                    resolve(true)
                                }
                            } else {
                                openAlert("You can't apply for regularization because you're already present.")
                                resolve(false)
                            }
                        }
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
        let date = moment(inputDate, 'DD/MM/YYYY');
        let inputSelectedDate = date.format('YYYY/MM/DD');
        let user = getCurrentUser();
        let objectName = "Regularization_Request";
        let list = 'SelectDate';
        let fieldList = list.split(",");
        let pageSize = "20000";
        let pageNumber = "1";
        let orderBy = "true";
        let whereClause = `(SelectDate>='${inputSelectedDate}'<AND>SelectDate<='${inputSelectedDate}')<<NG>>(CreatedByGUID='${user.EmployeeGUID}')`;
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


function getObject() {
    window.document.addEventListener('getlsvalue', getLocalstoreageWebUrl)

}

function getLocalstoreageWebUrl(event) {
    if (typeof (event.detail) === 'string') {
        webURL_Value = event.detail
    }
}

function getAllAttendence() {
    
    return new Promise(async (resolve) => { 
    attendenceList = []
    let user = getCurrentUser();
    let [day, month, year] = inputDate.split('/').map(Number);
    let dateforAttendance = new Date(year, month - 1, day);
    let replacemonth = dateforAttendance.getMonth() + 1;
    let replaceyear = dateforAttendance.getFullYear();
    let apiURL = `${apURL}/api/MonthlyAttendance?employeeid=${user.EmployeeGUID}&month=${replacemonth}&year=${replaceyear}`
    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Host': hostName,
            'Employeeguid': user.EmployeeGUID,
            'Hrzemail': user.Email,
            'ma': maHostName
        },
    })
        .then(response => response.json())
        .then(attendences => {
            attendenceList = attendences
            resolve(true)
        })
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
    hiddenFieldsFormWindow = ["RequestFor"];
    addCustomjs()

}

setTimeout(() => {
    qafServiceLoaded = setInterval(() => {
        if (window.QafService) {
            window.localStorage.setItem('ma',maHostName)
            getObject()

            clearInterval(qafServiceLoaded);
        }
    }, 10);
}, 2000);


function addCustomjs() {
    // let jsList = ["https://qaffirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fmoment.min_aeca73b2-1458-4180-a20b-835e450886be.js"]
    let jsList = ["https://funfirst.quickappflow.com/Attachment/downloadfile?fileUrl=JS_Library%2Fmoment.min_44ef7032-a417-43ef-b473-87c4067fc427.js"]

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
    isApicall = false
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