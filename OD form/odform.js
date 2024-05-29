var startTime = "";
var myOdRequests = "";
var isApicall=false
var selectedDate
var duarationList=[]
qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    getObject()
    clearInterval(qafServiceLoaded);
  }
}, 10);

function getObject() {
  duarationList=[]
  window.QafService.GetObjectById('Out_Duty_Request').then((responses) => {
    responses[0].Fields.forEach(val => {
      if (val.InternalName === 'Duration') {
        let durationDropdown = document.getElementById('Duration');
        let options = `<option value=''></option>`
        if (durationDropdown) {

          val.Choices.split(";#").forEach((val,index)=>{

            duarationList.push(
              {
                recordID:index+1,
                duration:val
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
  
  startTime = new Date(this.value);
  let displayStartTimeElement = document.getElementById('displayStartTime');
  if (displayStartTimeElement) {
    displayStartTimeElement.value = moment(startTime).format('DD-MM-YYYY')
  }

});

async function SaveRecord() {
  
  user = getCurrentUser();
  let requestTitle = document.getElementById('RequestTitle').value;
  let displayStartTime = document.getElementById('displayStartTime').value;
  let duration = document.getElementById('Duration').value;
  let reason = document.getElementById('Reason').value;
  let currentEmployee = [{ UserType: 1, RecordID: user.EmployeeGUID }];

  if (requestTitle == "") {
    alert('Brief about the request is required')
  }
  else if (displayStartTime == "") {
    alert('Request Date is required')
  }
  else if (duration == "") {
    alert('Duration is required')
  }
  else {
    
    let isvalidate=await externalFormValidationRule()
  
    if(isvalidate){
      let durationvalue=""
      let durationfind=duarationList.filter(a=>a.recordID===duration);
      if(durationfind&&durationfind.length>0){
        durationvalue=durationfind[0].duration
      }

      let object = {
        RequestFor: JSON.stringify(currentEmployee),
        StartDate: startTime ? storeDateWithTimeZone(startTime, '', false, false) : "",
        Title: requestTitle,
        Description: reason,
        Duration: durationvalue,
      };
      save(object, "Out_Duty_Request");
    }
  }

}
function externalFormValidationRule() {
  if(!isApicall){
      isApicall=true
  return new Promise(async (resolve) => {
    selectedDate =   document.getElementById('displayStartTime')
      if (selectedDate.value) {
        selectedDate =selectedDate.value
        selectedDate=(convertDate(selectedDate));
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
function convertDate(date) {
  const dateString = date;
  const [datePart, timePart] = dateString.split(",");
  const [day, month, year] = datePart.split("-");
  const dateObject = new Date(year, month - 1, day);
  return dateObject
}
function getODRequest() {
  return new Promise((resolve) => {
      let TodayDate = moment(selectedDate).format('YYYY/MM/DD');
      let user = getCurrentUser();
      let objectName = "Out_Duty_Request";
      let list = 'StartDate';
      let fieldList = list.split(",");
      let pageSize = "20000";
      let pageNumber = "1";
      let orderBy = "true";
      let whereClause =  `(StartDate>='${TodayDate}'<AND>StartDate<='${TodayDate}')<<NG>>(CreatedByGUID='${user.EmployeeGUID}')`
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
    intermidiateRecord.CreatedByID = user.EmployeeID;
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
