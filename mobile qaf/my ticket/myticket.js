var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = funFirstapiURL;
var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;
var user;
var serviceList;
let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        user = getCurrentUser();
        window.QafService.SetEnvUrl(apURL)
        let breadcum = document.getElementById("breadcrum");
        if (breadcum) {
            document.getElementById("breadcrum").style.display = "none";
        }
        getPendingServices()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getPendingServices() {
    fetch(`${apURL}/api/MyServices?option=MS&app=helpdesk&templateType=ehelpdesk`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.value.EmployeeGUID,
            'Hrzemail': user.value.Email
        },
    })
        .then(response => response.json())
        .then(services => {
            if (Array.isArray(services) && services.length > 0) {
                serviceList=services
                let servicesText = "";
                services.forEach(val => {
                    servicesText += ` <div class="employee-heady-body" onclick='requestclick("${val.RecordID}")'>
    <div class="first-div">
        <div class="first-head">${topheader(val)}</div>
        <div class="second-head"><span>${convertTimeFormat(val.DueDate)}</span></div>
    </div>
    <div class="second-div">
        <p class="section-title">${val.RequestTitle}</p>
    </div>
    <div class="third-div">
        <p class="normal">${getRequestStatus(val)}</p>
    </div>
</div>`
                })

                document.getElementById('requests').innerHTML = servicesText
            }
        })
}
function convertTimeFormat(dates) {
    if (dates) {
        const dateformat = "hh:mm A";
        const localTime = moment.utc(dates).toDate();
        return moment(localTime).format(dateformat);
    } else {
        return ""
    }
}
function getRequestStatus(services) {
    let request = [];
    if (services.RequestStatus) {
        request.push(formatLookupFieldValue(services.RequestStatus))
    }
    if (services.RequestType) {
        request.push((services.RequestType))
    }
    return request.join(" | ")
}

function topheader(services) {
    let request = [];
    if (services.TicketID) {
        request.push((services.TicketID))
    }
    if (services.Priority) {
        request.push(formatLookupFieldValue(services.Priority))
    }
    return request.join(" | ")
}


function formatLookupFieldValue(value) {
    let returnValue = value ? value : "";//fix change by mayur
    let updatedRetunValue = [];
    if (returnValue && returnValue.indexOf(';#') !== -1) {
        let valuesWithGuid = returnValue.split(';#');
        for (let i = 0; i < valuesWithGuid.length; i++) {
            if (!isValidGuid(valuesWithGuid[i])) {
                updatedRetunValue.push(valuesWithGuid[i].trim());
            }
        }
        returnValue = updatedRetunValue.join('; ');
    } else {
        if (isValidGuid(returnValue)) {
            returnValue = '';
        }
    }
    return returnValue;
}
function isValidGuid(guidString) {
    let guidRegexPattern = new RegExp(guidPattern)
    return guidRegexPattern.test(guidString);
}
function toggleMenu() {
    var menu = document.getElementById('menu');
    if (menu.style.left === '-350px') {
      menu.style.left = '0';
    } else {
      menu.style.left = '-350px';
    }
  }
  function changePage(url){
    window.location.href=window.location.origin+url
  }
  function requestclick(recordID){
    
    let service=serviceList.find(a=>a.RecordID===recordID);
    if(service.RequestType.includes("Regularization")){
        window.location.href=window.location.origin+`/pages/qafrg_request?RecordID=${service.RecordID}&InstanceID=${service.InstanceID}&ObjectID=${service.ObjectID}&PendingWithIDs=${service.PendingWithIDs}`
    }else{
        window.location.href=window.location.origin+`/pages/qafod_request?RecordID=${service.RecordID}&InstanceID=${service.InstanceID}&ObjectID=${service.ObjectID}&PendingWithIDs=${service.PendingWithIDs}`
    }
  }