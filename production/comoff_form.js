var startTime = "";
var myOdRequests = "";
var isApicall = false
var selectedDate;
var duarationList = []
var EmployeeID_Value;
var EmployeeGUID_Value;
var EmployeeEmail_Value;

qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    var lsvalue = new CustomEvent('setlskey', { detail: { key: "user_key" } })
    window.parent.document.dispatchEvent(lsvalue)
    window.document.addEventListener('getlsvalue', getLocalstoreageDetails)


    getObject()
    clearInterval(qafServiceLoaded);
  }
}, 10);

function getObject() {
  window.QafService.GetObjectById('Comp_Off_Request').then((responses) => {
    responses[0].Fields.forEach(val => {
      if (val.InternalName === 'Duration') {
        let durationDropdown = document.getElementById('Duration');
        let options = `<option value=''></option>`
        if (durationDropdown) {
          val.Choices.split(";#").forEach((val, index) => {
            duarationList.push(
              {
                recordID: index + 1,
                duration: val
              }
            )
          })
          duarationList.forEach(choise => {
            options += `<option value=${choise.recordID}>${choise.duration}</option>`
          })
          durationDropdown.innerHTML = options;
        }
      }

    })
  })
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


document.getElementById("startTime").addEventListener("change", function () {
  startTime = this.value ? new Date(this.value) : "";
  if(!startTime){
    document.getElementById('requestDatelabel').style.fontSize = '16px';
  }
 
  let displayStartTimeElement = document.getElementById('displayStartTime');
  if (displayStartTimeElement) {
    displayStartTimeElement.value = startTime ? moment(startTime).format('DD-MM-YYYY') : "";
  }

});


async function SaveRecord() {
  AddBlurInPage();
  user = getCurrentUser();
  let requestTitle = document.getElementById('RequestTitle').value;
  let displayStartTime = document.getElementById('displayStartTime').value;
  let duration = document.getElementById('Duration').value;
  let reason = document.getElementById('Reason').value;
  let currentEmployee = [{ UserType: 1, RecordID: EmployeeGUID_Value }];

  if (requestTitle == "") {
    openAlert('Brief about the request is required')
  }
  else if (displayStartTime == "") {
    openAlert('Request Date is required')
  }
  else if (duration == "") {
    openAlert('Duration is required')
  }
  else {
    let saveButton = document.getElementById("saveRequest")
    if (saveButton) {
      saveButton.disabled = true;
    }
    let isvalidate = await externalFormValidationRule()
    if (isvalidate) {
      isApicall = false;

      let durationValue = "";
      let durationFind = duarationList.filter(a => a.recordID === Number(duration));
      if (durationFind && durationFind.length > 0) {
        durationValue = durationFind[0].duration;
      }
      let object = {
        RequestFor: JSON.stringify(currentEmployee),
        RequestDate: startTime ? storeDateWithTimeZone(startTime, '', false, false) : "",
        Title: requestTitle,
        Description: reason,
        Duration: durationValue,
      };
      save(object, "Comp_Off_Request");
    }
  }

}

function externalFormValidationRule() {
  if (!isApicall) {
    isApicall = true
    return new Promise(async (resolve) => {
      selectedDate = document.getElementById('displayStartTime')
      if (selectedDate.value) {
        selectedDate = selectedDate.value
        var currentdate = new Date();
        selectedDate = (convertDate(selectedDate));
        if (moment(selectedDate).isAfter(currentdate, 'date')) {
          openAlert("Please select current date or previous date ");
          resolve(false)
        }
        else {
          let compOff_Records = await getcompOff_Records();
          if (compOff_Records && compOff_Records.length > 0) {
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

function convertDate(date) {
  const dateString = date;
  const [datePart, timePart] = dateString.split(",");
  const [day, month, year] = datePart.split("-");
  const dateObject = new Date(year, month - 1, day);
  return dateObject
}

function getcompOff_Records() {
  return new Promise((resolve) => {
    let TodayDate = moment(selectedDate).format('YYYY/MM/DD');
    let user = getCurrentUser();
    let objectName = "Comp_Off_Request";
    let list = 'RequestDate';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `(RequestDate>='${TodayDate}'<AND>RequestDate<='${TodayDate}')<<NG>>(CreatedByGUID='${EmployeeGUID_Value}')`
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


function getByKey(key) {
  let cacheValue = this.localStorage.getItem(key);
  if (cacheValue && (cacheValue != "undefined")) {
    return JSON.parse(cacheValue);
  }
}

function storeDateWithTimeZone(dateString, timeZone = "", isTimeSelected = false, isTimePresent = false) {
  let dateFormate = getByKey("TimeZone");
  let timezoneLable = dateFormate ? dateFormate.split(",")[1] : "Asia/Kolkata";
  timeZone = timeZone ? timeZone : timezoneLable
  let totaloffset = moment.tz(timeZone).utcOffset();
  let offsethours = Number(Math.floor(totaloffset / 60));
  let offsetMinutes = Number(totaloffset % 60);
  if (offsethours < 0) {
    offsethours = Math.abs(offsethours)
    offsetMinutes = Math.abs(offsetMinutes)
  } else {
    offsethours = -Math.abs(offsethours);
    offsetMinutes = -Math.abs(offsetMinutes);
  }

  if (dateString) {
    // date convert year,month,date
    let year = Number(moment(dateString).format("YYYY"))
    let month = Number(moment(dateString).format("MM"))
    let date = Number(moment(dateString).format("DD"))
    let hour = Number(moment(dateString).format("hh"))
    let modifier = (moment(dateString).format("a"))
    let minutes = Number(moment(dateString).format('mm'));
    if (isTimeSelected) {
      let currentTime = this.getCurrentTime()
      hour = Number(moment(currentTime).format("hh"))
      modifier = (moment(currentTime).format("a"))
      minutes = Number(moment(currentTime).format('mm'));
    }
    // check meridian 
    if (modifier.toUpperCase() === 'PM') {
      if (hour === 12) {
        hour = 12
      } else {
        hour = hour + 12;
      }
    } else {
      if (hour === 12) {
        hour = 0
      }
    }
    if (isTimeSelected && !isTimePresent) {
      let dateTime = new Date(year, month - 1, date, hour + offsethours, minutes + offsetMinutes, 0);
      return moment(dateTime).format("YYYY-MM-DDTHH:mm:ss")
    }
    if (!isTimeSelected && isTimePresent) {
      let dateTime = new Date(year, month - 1, date, hour + offsethours, minutes + offsetMinutes, 0);
      return moment(dateTime).format("YYYY-MM-DDTHH:mm:ss")
    }
    else {
      let dateTime = new Date(year, month - 1, date, 12 + offsethours, 0 + offsetMinutes, 0)
      return moment(dateTime).format("YYYY-MM-DDTHH:mm:ss")
    }
  };
}


function save(object, repositoryName) {
  return new Promise((resolve) => {
    var recordFieldValueList = [];
    var intermidiateRecord = {}
    user = getCurrentUser()
    Object.keys(object).forEach((key, value) => {
      recordFieldValueList.push({
        FieldID: null,
        FieldInternalName: key,
        FieldValue: object[key]
      });
    });
    intermidiateRecord.CreatedByID = EmployeeID_Value;
    intermidiateRecord.CreatedDate = new Date();
    intermidiateRecord.LastModifiedBy = null;
    intermidiateRecord.ObjectID = repositoryName;
    intermidiateRecord.RecordID = null;
    intermidiateRecord.RecordFieldValues = recordFieldValueList;
    window.QafService.CreateItem(intermidiateRecord).then(response => {
      clearFormField()
      resolve({
        response
      })
    });
  }
  )
}

function clearFormField() {
  RemoveBlurInPage()
  let saveButton = document.getElementById("saveRequest")
  if (saveButton) {
    saveButton.disabled = false;
  }
  let requestTitleElement = document.getElementById('RequestTitle');
  let displayStartTimeElement = document.getElementById('displayStartTime');
  let DurationElement = document.getElementById('Duration');
  let reasonElement = document.getElementById('Reason');
  let startTimeElement = document.getElementById("startTime")

  if (requestTitleElement) {
    requestTitleElement.value = "";
  }
  if (displayStartTimeElement) {
    displayStartTimeElement.value = "";
  }
  if (DurationElement) {
    DurationElement.value = "";
  }
  if (reasonElement) {
    reasonElement.value = "";
    startTimeElement = ""
  }
  let closeformevent = new CustomEvent('closeformevent')
  window.parent.document.dispatchEvent(closeformevent)
}

function openAlert(message) {
  RemoveBlurInPage()
  let saveButton = document.getElementById("saveRequest")
  if (saveButton) {
    saveButton.disabled = false;
  }
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

function AddBlurInPage() {
  let blurdivElement = document.getElementById('blurdiv');
  if (blurdivElement) {
    blurdivElement.classList.add('page-blur')
  }
}

function RemoveBlurInPage() {
  let blurdivElement = document.getElementById('blurdiv');
  if (blurdivElement) {
    blurdivElement.classList.remove('page-blur')
  }
}

document.querySelectorAll('.apply-input').forEach(function(input) {
  input.addEventListener('focus', function() {
      this.previousElementSibling.style.fontSize = '12px';
  });

  input.addEventListener('blur', function() {
      if (this.value === '') {
          this.previousElementSibling.style.fontSize = '16px';
      }
  });
});


document.getElementById('startTime').addEventListener('focus', function() {
  document.getElementById('requestDatelabel').style.fontSize = '12px';
});

document.getElementById('startTime').addEventListener('blur', function() {
  if (this.value === '') {
      document.getElementById('requestDatelabel').style.fontSize = '16px';
  }
});

function getLocalstoreageDetails(event) {
  if (typeof (event.detail) === 'object') {
    const { EmployeeGUID, EmployeeID, Email } = event.detail;
    EmployeeID_Value = EmployeeID;
    EmployeeGUID_Value = EmployeeGUID;
    EmployeeEmail_Value = Email;
  }
}