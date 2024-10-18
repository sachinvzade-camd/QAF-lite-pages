var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = SITapiURL
var sitHostURL='demtis.quickappflow.com'
var funFirstHostURL='inskferda.azurewebsites.net'
var hostName=sitHostURL
var todayMonth = document.getElementById("today");
var date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
var currentMonth = `${date.toLocaleString([], { month: 'short' })} ${year}`;
var tz
var hours = "00"
var minutes = "00";
var seconds = "00";
var timedisplay = '00:00:00'
var checkinTimout
var attendanceStatus;
var timesheetEvent;
var checkInTime = "";
var checkOutTime = "";
var checkinButton = '<button class="check" onclick="checkinButtonClick()" id="checkin"> Check In</button>'
var checkOutButton = '<button class="check" onclick="checkOutButtonClick()" id="checkin"> Check Out</button>'
var userAttendenceType = 0;
var errormessage = ""
var coordinateValue = ""
var shiftCongfigration;
var configuredUserOfficeLocation;
var isLocationPermission = true
var locationLatitude;
var locationLongitute;
var EmployeeID_Value;
var EmployeeGUID_Value;
var EmployeeEmail_Value;
var webURL_Value;



 qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    window.QafService.SetEnvUrl(apURL)
    let loaderElement=document.getElementById('isloading');
    if(loaderElement){
      loaderElement.style.display='block'
    }

      let breadcum = document.getElementById("breadcrum");
      if (breadcum) {
        document.getElementById("breadcrum").style.display = "none";
      }

      var logos = document.getElementById("mobile_logo");
      if (logos) {
        logos.href = '/pages/newAttendence'
      }
      var lsvalue = new CustomEvent('setlskey', { detail: { key: "user_key" } })
      window.parent.document.dispatchEvent(lsvalue)
      var lsvalue = new CustomEvent('setlskey', { detail: { key: "weburl_key" } })
      window.parent.document.dispatchEvent(lsvalue)
      var callLocation = new CustomEvent('callLocation')
      window.parent.document.dispatchEvent(callLocation)

      window.document.addEventListener('getLocation', getLocation)
      window.document.addEventListener('getlsvalue', getLocalstoreageDetails)
      window.document.addEventListener('getlsvalue', getLocalstoreageWebUrl)
      setTimeout(() => {
        todayMonth.innerHTML = currentMonth;
        document.getElementById('attendancebutton').innerHTML = checkinButton;
        document.getElementById('displayTime').innerHTML = timedisplay;
        getQafConfigurationAttendanceType()
        getShiftAllocation()
        getCheckInTime()
        getAllAttendence()
      }, 200);
    clearInterval(qafServiceLoaded);
  }
}, 10);



function getCheckInTime() {
  let employeeid = EmployeeGUID_Value;
  fetch(`${apURL}/api/GetAttendance?employeeid=${employeeid}`, {
    method: 'POST',
    headers: {
      'Host': hostName,
      'Employeeguid': EmployeeGUID_Value,
      'Hrzemail': EmployeeEmail_Value,
      'ma':webURL_Value,
      // 'Content-Type': 'application/json'
    },
  })
    .then( response =>response.json())
    .then(checkIn => {
      resettimer()
      if (!checkIn) {
        attendanceStatus = 1;
        document.getElementById('attendancebutton').innerHTML = checkinButton;
      }
      else if (checkIn && checkIn.PunchOutTime) {
        attendanceStatus = 1;
        document.getElementById('attendancebutton').innerHTML = checkinButton;
      }
      else {

        if (checkIn.PunchInTime) {
          if (checkIn.PunchOutTime) {
            document.getElementById('attendancebutton').innerHTML = checkinButton;
          } else {
            attendanceStatus = 2;
            document.getElementById('attendancebutton').innerHTML = checkOutButton;
          }
        }
        else {
          if (checkIn.PunchInTime) {
            attendanceStatus = 2;
            document.getElementById('attendancebutton').innerHTML = checkOutButton;
          }
        }
      }
      if (checkIn) {
        timesheetEvent = checkIn;

        if (timesheetEvent.PunchInTime || timesheetEvent.PunchOutTime) {
        checkInTime = timesheetEvent.PunchInTime ? moment(convertUTCDateToLocalDate(new Date(timesheetEvent.PunchInTime))).format("YYYY-MM-DD[T]HH:mm:ss") : ""



        let punchIn = timesheetEvent.PunchInTime && timesheetEvent.PunchInTime ? moment.utc(timesheetEvent.PunchInTime).toDate() : '';
        checkInTime = moment(punchIn).format("YYYY-MM-DD[T]HH:mm:ss");

        checkOutTime = timesheetEvent.PunchOutTime ? moment(convertUTCDateToLocalDate(new Date(timesheetEvent.PunchOutTime))).format("YYYY-MM-DD[T]HH:mm:ss") : ""

        let punchout = timesheetEvent.PunchOutTime && timesheetEvent.PunchOutTime ? moment.utc(timesheetEvent.PunchOutTime).toDate() : '';
        if (punchout) {
          checkOutTime = moment(punchout).format("YYYY-MM-DD[T]HH:mm:ss");
        }

        if (attendanceStatus === 1) {
          document.getElementById('attendancebutton').innerHTML = checkinButton;
          resettimer()
        } else if (attendanceStatus === 2) {
          document.getElementById('attendancebutton').innerHTML = checkOutButton;
          resettimer()
          showCheckInTimeDiff()
        }
        else if (attendanceStatus === 3) {

          showCheckInCheckOutTimeDiff(checkInTime, checkOutTime);
        }


        if (checkOutTime) {
          showCheckInCheckOutTimeDiff(checkInTime, checkOutTime);
        }

      }
    }
    })
    .catch(error => console.error(error));

}
function resettimer() {
  hours = "00";
  minutes = "00";
  seconds = "00";
  document.getElementById('displayTime').innerHTML = `${hours}:${minutes}:${seconds} `;
  clearTimeout(checkinTimout)
}
function showCheckInTimeDiff() {
  let checkInTimenew = moment(checkInTime);
  let formatedCurrentTime = moment(new Date())
  let currentTime = moment(formatedCurrentTime);
  let diff = moment(currentTime).diff(checkInTimenew);
  if (Math.sign(diff) === -1) {
    diff = 0
  }
  let sec = diff / 1000;
  let min = 0;
  let hr = 0;
  let d = 0;
  for (; sec >= 60; sec -= 60) {
    min++;
    for (; min >= 60; min -= 60) {
      hr++;
      for (; hr >= 24; hr -= 24) {
        d++;
      }
    }
  }
  hours = "00".substring(hr.toString().length) + hr;
  minutes = "00".substring(min.toString().length) + min;

  seconds = "00".substring(sec.toString().length) + sec;
  seconds = seconds.split(".")[0]
  document.getElementById('displayTime').innerHTML = `${hours}:${minutes}:${seconds} `;

  checkinTimout = setTimeout(() => {
    showCheckInTimeDiff();
  }, 1000);
}

function showCheckInCheckOutTimeDiff(checkInTime, checkOutTime) {
  checkInTime = timesheetEvent.PunchInTime ? moment((checkInTime)) : "";
  let checkIn = moment(checkInTime);
  let checkOut = moment(checkOutTime);
  let diff = moment(checkOut).diff(checkIn);
  if (Math.sign(diff) === -1) {
    diff = 0
  }
  if (isNaN(diff)) {
    diff = 0
  }
  let sec = diff / 1000;
  let min = 0;
  let hr = 0;
  let d = 0;
  for (; sec >= 60; sec -= 60) {
    min++;
    for (; min >= 60; min -= 60) {
      hr++;
      for (; hr >= 24; hr -= 24) {
        d++;
      }
    }
  }
  days = d.toString();
  hours = "00".substring(hr.toString().length) + hr;
  minutes = "00".substring(min.toString().length) + min;
  seconds = "00".substring(sec.toString().length) + sec;
  document.getElementById('displayTime').innerHTML = `${hours}:${minutes}:${seconds} `;

}



function getQafConfigurationAttendanceType() {
  let objectName = "QAF_Configuration";
  let list = "RecordID,Key,Value";
  let orderBy = "";
  let whereClause = "Key='ATTENDANCE_TYPE'";
  let pageSize = "100000";
  let pageNumber = "1";
  let isAscending = "true";
  let fieldList = list.split(",")

  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((attendencyTypes) => {
    if (Array.isArray(attendencyTypes) && attendencyTypes.length > 0) {
      var item = attendencyTypes[0];
      if (item) {
        var value = item.Value ? item.Value : "1";
        if (value) {

          var attendenceType = parseInt(value);// 1, 2, 3
          userAttendenceType = attendenceType;
          if (attendenceType === 2 || attendenceType === 3) {
            // request locaiton permission
            getCoordinates()
          }
        }
      }
    }
  })
}

 function getCoordinates() {
  // var callLocation = new CustomEvent('callLocation')
  // window.parent.document.dispatchEvent(callLocation)
  var callLocation = new CustomEvent('callLocation')
  window.parent.document.dispatchEvent(callLocation)
  window.document.addEventListener('getLocation', getLocation)
}

function getShiftAllocation() {
  let objectName = "Shift_Allocation";
  let list = "RecordID,Employee,ShiftName";
  let whereClause = "Employee='" + EmployeeGUID_Value + "'";
  let orderBy = "";
  let pageSize = "100000";
  let pageNumber = "1";
  let fieldList = list.split(",")

  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((allocations) => {
    if (Array.isArray(allocations) && allocations.length > 0) {
      let allocation = allocations[0]
      getShiftConfiguration(allocation)
    }
  })
}

function getShiftConfiguration(allocation) {
  let objectName = "Shift_Configuration";
  let list = "RecordID,StartTime,CutOffTime";
  let orderBy = "";
  let pageSize = "100000";
  let pageNumber = "1";
  let fieldList = list.split(",")
  let isAscending = "true";
  let whereClause = "RecordID='" + allocation.ShiftName.split(";#")[0] + "'";
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((configures) => {
    if (Array.isArray(configures) && configures.length > 0) {
      shiftCongfigration = configures[0]

    }
  })
}

function addBlur(){
  let disabled=document.getElementById('disabled');
  if(disabled){
    disabled.classList.add('page-blur')
  }
}
function removeBlur(){
  let disabled=document.getElementById('disabled');
  if(disabled){
    disabled.classList.remove('page-blur')
  }
}

async function checkinButtonClick() {
  addBlur()
  resettimer()
  getCoordinates()

  setTimeout(() => {
    if (userAttendenceType === 1) {
      let isLatelogin = isLateCheckin()
      let checkoutDetails = {}
      checkoutDetails['EmployeeID'] = EmployeeID_Value;
      checkoutDetails['Type'] = "in";
      checkoutDetails['IsWebLogin'] = true;
      checkoutDetails['EmployeeGUID'] = EmployeeGUID_Value;
      checkoutDetails['Qld1'] = 0
      checkoutDetails['Qld2'] = 0
      checkoutDetails['IsLate'] = isLatelogin
      checkout(checkoutDetails)
  
    }
  
    if (userAttendenceType === 2 || userAttendenceType === 3) {
      if (isLocationPermission) {
        if (userAttendenceType === 2) {
          attendanceTypeTwo()
        }
        if (userAttendenceType === 3) {
  
          if (configuredUserOfficeLocation) {
            let lat = parseFloat(configuredUserOfficeLocation.Latitude);
            let long = parseFloat(configuredUserOfficeLocation.Longitude);
            let rad = parseInt(configuredUserOfficeLocation.Radius);
  
            let latitude = parseFloat(locationLatitude);// position.coords.latitude;
            let longitude = parseFloat(locationLongitute);//position.coords.longitude;
            let startCordinate = {
              latitude: lat,
              longitude: long,
            }
            let destCordinate = {
              latitude: latitude,
              longitude: longitude,
            }
            var distanceJson = haversine(startCordinate, destCordinate)
            if (errormessage) {
              alert(errormessage)
              removeBlur()
              return
            }
            let distanceInMeter = distanceJson;
            if (distanceInMeter <= rad) {
              let isLatelogin = isLateCheckin()
  
              let checkoutDetails = {}
              checkoutDetails['EmployeeID'] = EmployeeID_Value;
              checkoutDetails['Type'] = "in";
              checkoutDetails['IsWebLogin'] = true;
              checkoutDetails['EmployeeGUID'] = EmployeeGUID_Value;
              checkoutDetails['Qld1'] = latitude
              checkoutDetails['Qld2'] = longitude
              checkoutDetails['IsLate'] = isLatelogin
              checkout(checkoutDetails)
  
            } else {
             removeBlur()
  
              alert('Not allowed to check in from this location!')
            }
          } else {
            // Geolocation details and distance
            getGeofenceDetails().then(async (geofence) => {
  
              if (geofence) {
                configuredUserOfficeLocation = geofence;
                let lat = parseFloat(configuredUserOfficeLocation.Latitude);
                let long = parseFloat(configuredUserOfficeLocation.Longitude);
                let rad = parseInt(configuredUserOfficeLocation.Radius);
                let latitude = parseFloat(locationLatitude);// position.coords.latitude;
                let longitude = parseFloat(locationLongitute);//position.coords.longitude;
                let startCordinate = {
                  latitude: lat,
                  longitude: long,
                }
                let destCordinate = {
                  latitude: latitude,
                  longitude: longitude,
                }
                var distanceJson = haversine(startCordinate, destCordinate)
                if (errormessage) {
                  alert(errormessage)
    removeBlur()
  
                  return
                }
  
                if (distanceJson <= rad) {
                  let isLatelogin = isLateCheckin()
                  let checkoutDetails = {}
                  checkoutDetails['EmployeeID'] = EmployeeID_Value;
                  checkoutDetails['Type'] = "in";
                  checkoutDetails['IsWebLogin'] = true;
                  checkoutDetails['EmployeeGUID'] = EmployeeGUID_Value;
                  checkoutDetails['Qld1'] = latitude
                  checkoutDetails['Qld2'] = longitude
                  checkoutDetails['IsLate'] = isLatelogin
                  checkout(checkoutDetails)
                } else {
               removeBlur()
  
                  alert('Not allowed to check in from this location!')
                }
              } else {
                if (isLocationPermission) {
                  attendanceTypeTwo()
                } else {
    removeBlur()
  
                  alert('Enable location permission to check in or check out')
                }
              }
            })
          }
        }
      } else {
        if (userAttendenceType === 2 || userAttendenceType === 3) {
    removeBlur()
  
          alert('Enable location permission to check in or check out',)
        }
      }
    }
  }, 200);


}



async function getGeofenceDetails() {
  return new Promise((resolve, reject) => {
    let objectName = "Geofence_Allocation";
    let list = "RecordID,Employee,GeofencePolicy";
    let whereClause = "Employee='" + EmployeeGUID_Value + "'";
    let orderBy = "";
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    let fieldList = list.split(",")

    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((geofancings) => {
      if (Array.isArray(geofancings) && geofancings.length > 0) {
        let fancing = geofancings[0];
        let objectName = "Geofencing";
        let list = "RecordID,Latitude,Longitude,Radius";
        let whereClause = "RecordID='" + fancing.GeofencePolicy.split(";#")[0] + "'";
        let orderBy = "";
        let pageSize = "100000";
        let pageNumber = "1";
        let isAscending = "true";
        let fieldList = list.split(",")

        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((newfancings) => {
          if (Array.isArray(newfancings) && newfancings.length > 0) {
            resolve(newfancings[0]);
          } else {
            resolve("");
          }
        }, (error) => {
          reject(error);
        })
      } else {
        resolve("");
      }
    }, (error) => {
      reject(error);
    })
  });
}

function isLateCheckin() {
  if (shiftCongfigration && shiftCongfigration.StartTime) {
    let startTime = moment(shiftCongfigration.StartTime, 'hh:mm A');
    var beginningTime = moment(startTime).add((shiftCongfigration.CutOffTime), 'minute');
    var endTime = moment(moment(new Date()))
    if (endTime.isAfter(beginningTime)) {

      alert("You are late for check-in")
      return true
    } else {
      return false
    }
  }
  return false
}

function checkout(timesheet,istype) {
  fetch(`${apURL}/api/WebAttendance`, {
    method: 'POST',
    headers: {
      'Host': hostName,
      'Employeeguid': EmployeeGUID_Value,
      'Hrzemail':EmployeeEmail_Value,
      'ma':webURL_Value,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(timesheet)
  })
    .then(response => response.json())
    .then(data => {
     
     removeBlur()
      resettimer()
      getCheckInTime()
    })
    .catch(error => console.error(error));
}


async function checkOutButtonClick() {
  addBlur()
  resettimer()
  getCoordinates()
  setTimeout(() => {
    if (userAttendenceType === 1) {
      let latitude = parseFloat(locationLatitude);// position.coords.latitude;
      let longitude = parseFloat(locationLongitute);//position.coords.longitude;
      let checkoutDetails = {}
      checkoutDetails['EmployeeID'] = EmployeeID_Value;
      checkoutDetails['Type'] = "out";
      checkoutDetails['IsWebLogin'] = true;
      checkoutDetails['EmployeeGUID'] = EmployeeGUID_Value;
      checkoutDetails['Qld1'] = parseFloat(latitude)
      checkoutDetails['Qld2'] = parseFloat(longitude);
      checkout(checkoutDetails)

    }

    if (userAttendenceType === 2 || userAttendenceType === 3) {
      if (isLocationPermission) {
        if (userAttendenceType === 2) {
          attendanceTypeTwo()
        }
        if (userAttendenceType === 3) {

          if (configuredUserOfficeLocation) {
            let lat = parseFloat(configuredUserOfficeLocation.Latitude);
            let long = parseFloat(configuredUserOfficeLocation.Longitude);
            let rad = parseInt(configuredUserOfficeLocation.Radius);

            let latitude = parseFloat(locationLatitude);// position.coords.latitude;
            let longitude = parseFloat(locationLongitute);//position.coords.longitude;
            let startCordinate = {
              latitude: lat,
              longitude: long,
            }
            let destCordinate = {
              latitude: latitude,
              longitude: longitude,
            }
            var distanceJson = haversine(startCordinate, destCordinate)
            if (errormessage) {
              alert(errormessage)
              removeBlur()
              return
            }
            let distanceInMeter = distanceJson;
            if (distanceInMeter <= rad) {

              let checkoutDetails = {}
              checkoutDetails['EmployeeID'] = EmployeeID_Value;
              checkoutDetails['Type'] = "out";
              checkoutDetails['IsWebLogin'] = true;
              checkoutDetails['EmployeeGUID'] = EmployeeGUID_Value;
              checkoutDetails['Qld1'] = parseFloat(latitude)
              checkoutDetails['Qld2'] = parseFloat(longitude);
              checkout(checkoutDetails)

            } else {
              removeBlur()

              alert('Not allowed to check out from this location!')
            }
          } else {
            // Geolocation details and distance
            getGeofenceDetails().then(async (geofence) => {

              if (geofence) {
                configuredUserOfficeLocation = geofence;
                let lat = parseFloat(configuredUserOfficeLocation.Latitude);
                let long = parseFloat(configuredUserOfficeLocation.Longitude);
                let rad = parseInt(configuredUserOfficeLocation.Radius);
                let latitude = parseFloat(locationLatitude);// position.coords.latitude;
                let longitude = parseFloat(locationLongitute);//position.coords.longitude;
                let startCordinate = {
                  latitude: lat,
                  longitude: long,
                }
                let destCordinate = {
                  latitude: latitude,
                  longitude: longitude,
                }
                var distanceJson = haversine(startCordinate, destCordinate)
                if (errormessage) {
                  alert(errormessage)
                  removeBlur()

                  return
                }

                if (distanceJson <= rad) {
                  let checkoutDetails = {}
                  checkoutDetails['EmployeeID'] = EmployeeID_Value;
                  checkoutDetails['Type'] = "out";
                  checkoutDetails['IsWebLogin'] = true;
                  checkoutDetails['EmployeeGUID'] = EmployeeGUID_Value;
                  checkoutDetails['Qld1'] = parseFloat(latitude)
                  checkoutDetails['Qld2'] = parseFloat(longitude);
                  checkout(checkoutDetails)
                } else {
                  removeBlur()

                  alert('Not allowed to check out from this location!')
                }
              } else {
                if (isLocationPermission) {
                  attendanceTypeTwo()
                } else {
                  removeBlur()

                  alert('Enable location permission to check in or check out')
                }
              }
            })
          }
        }
      } else {
        if (userAttendenceType === 2 || userAttendenceType === 3) {
          removeBlur()

          alert('Enable location permission to check in or check out',)
        }
      }
    }
  }, 200);
}

function showError(error) {
  this.isLocationPermission = false
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log(
        "User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.")
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.")
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.")
      break;
  }
}


async function attendanceTypeTwo() {
   getCoordinates()
   setTimeout(() => {
    if (errormessage) {
      alert(errormessage)
      removeBlur()
  
      return
    }
    if (locationLatitude&&locationLongitute) {
      let isLatelogin = isLateCheckin()
      let latitude = locationLatitude;// position.coords.latitude;
      let longitude = locationLongitute;//position.coords.longitude; 
  
      let checkoutDetails = {}
      checkoutDetails['EmployeeID'] = EmployeeID_Value;
      checkoutDetails['Type'] = "in";
      checkoutDetails['IsWebLogin'] = true;
      checkoutDetails['EmployeeGUID'] = EmployeeGUID_Value;
      checkoutDetails['Qld1'] = parseFloat(latitude);
      checkoutDetails['Qld2'] = parseFloat(longitude);
      checkoutDetails['IsLate'] = isLatelogin
      checkout(checkoutDetails)
    }
   }, 200);

}
function haversine(startCordinate, destCordinate) {
  let lat1 = startCordinate.latitude
  let lon1 = startCordinate.longitude
  let lat2 = destCordinate.latitude
  let lon2 = destCordinate.longitude
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance * 1000;
}
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}
// second section




// MOnth NEvigator
function leftNavigator() {
  monthNavigator('subtract')
}

function rightNavigator() {
  monthNavigator('plus')
}


function monthNavigator(month) {
  addBlur()
  
  let currentDate=new Date()
  date.setHours(6, 30, 1);
  date.setDate(1);
  let allowDate=new Date(JSON.parse(JSON.stringify(date)));
  if (month === 'subtract') {
    allowDate.setMonth(allowDate.getMonth() - 1);
  } else {
    allowDate.setMonth(allowDate.getMonth() + 1);
  }
  if((allowDate.getMonth()<=currentDate.getMonth())||(allowDate.getFullYear()<currentDate.getFullYear())){
    if (month === 'subtract') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
  
  
    day = date.getDate();
    month = (date.getMonth() + 1);
    year = date.getFullYear();
    currentDate = `${date.toLocaleString([], { month: 'short' })} ${year}`;
    todayMonth.innerHTML = currentDate;
  
  
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    // 'YYYY/MM/DD'
    getAllAttendence()
  }else{
    removeBlur()
  }


  
}

function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);
  return newDate;
}



function getAllAttendence() {

  let replacemonth = (date.getMonth() + 1);
  let replaceyear = (date.getFullYear());
  fetch(`${apURL}/api/MonthlyAttendance?employeeid=${EmployeeGUID_Value}&month=${replacemonth}&year=${replaceyear}`, {
    method: 'POST',
    headers: {
      'Host': hostName,
      'Employeeguid': EmployeeGUID_Value,
      'Hrzemail':EmployeeEmail_Value,
      'ma':webURL_Value
    },
  })
    .then(response => response.json())
    .then(attendanceList => {
      let loaderElement=document.getElementById('isloading');
      if(loaderElement){
        loaderElement.style.display='none'
      }
      let attendancecontainerElement=document.getElementById('attendance-container');
      if(attendancecontainerElement){
        attendancecontainerElement.style.display='block'
      }

removeBlur()
      let attendanceCard = ""
      if (Array.isArray(attendanceList) && attendanceList.length > 0) {
        attendanceList.reverse()
        attendanceList.forEach((attendance,index) => {
          let date = moment((new Date(attendance.Day)))
          // let date = moment(convertUTCDateToLocalDate(new Date(attendance.Day)))
          if (moment(date).isSameOrBefore(moment(), 'date')) {
            if (moment(date).isSame(moment(), 'date')) {
              attendance.DayStatus=""
            }

            attendanceCard += ` <div class="card" style="height: ${attendance.NumberOfHours?(formatAttendence(attendance.NumberOfHours).length>15?80:68):68}px;">
<div class="main">
  <div class="attandance-date ${index%2===0 ? 'color-green':'color-yellow'}">
    <div class="attendance-timing month-container">
      <div>
        <span>${formatMonth(attendance)}</span>
      </div>
      <div>
        <span>${formatDay(attendance)}</span>
      </div>

    </div>
  </div>
  <div class="attendance-body">
    <div class="attendance-timing timing-container">
      <div class="start">
        <span>${attendance.FirstPunch ? attendance.FirstPunch : "--:--"}</span>
      </div>
      <div class="end">
        <span>${attendance.LastPunch ? attendance.LastPunch : "--:--"}</span>
      </div>
    </div>
    <div class="attendance-timing timing-container latein">
    ${attendance.IsLate?  '<div class="start"> <p class="late-in "> <span>Late in</span></p></div>' :""}
      <div class="${attendance.IsLate? 'end':""}">
        <p> ${attendance.IsRegularized ? '<i class="fa fa-repeat" aria-hidden="true"></i>' : ""} </p>
      </div>
    </div>
    <div class="attendance-timing timing-container staus-container" id="present">
      <div class="start">
       ${attendance.DayStatus? `<button class="attendance present ${getStatusColor(attendance.DayStatus)}">${attendance.DayStatus} </button>`:""}
      </div>
      <div class="end numberOfHours">
        <span>${attendance.NumberOfHours ? formatAttendence(attendance.NumberOfHours) : ""}</span>
      </div>
    </div>
  </div>
</div>
</div>`
          }


        })
        document.getElementById('cardBox').innerHTML = attendanceCard
      }
      else {
        document.getElementById('cardBox').innerHTML = `<div class="noRecordFound">No attendence found</div>`
      }
    })

}
function formatAttendence(time){
    if(time){
      if(time.includes('day')){
        let timeArray=[];
        let halfday=time.split(")")[0]
        timeArray=time.split(")")[1].split(".");
        let timestring= halfday+') '+timeArray[0]+" h "+(timeArray[1]?(timeArray[1].length===1?timeArray[1]+'0':timeArray[1]):'00')+" m"
        return timestring
      }else{
        let timeArray=[];
        timeArray=time.split(".");
        let timestring= timeArray[0]+" h "+(timeArray[1]?(timeArray[1].length===1?timeArray[1]+'0':timeArray[1]):'00')+" m"
        return timestring
      }
    }
    return ""

}
function getStatusColor(status) {
  let statusclass = "";
  if (status) {
    if (status.toLowerCase() === "Absent".toLowerCase()) {
      statusclass = "absent-color"
    }
   else if (status.toLowerCase() === "On Leave".toLowerCase()) {
      statusclass = "leave-color"
    }
   else if (status.toLowerCase() === "WO".toLowerCase()) {
      statusclass = "wo-color"
    }
   else if (status.toLowerCase() === "Holiday".toLowerCase()) {
      statusclass = "wo-color"
    }
    else{
      statusclass = "present-color"
    }
  }
  return statusclass
}
function formatDay(attendance) {
  return moment(attendance.Day).format("DD")
}
function formatMonth(attendance) {
  return moment(attendance.Day).format("MMM")
}
function getLocation(event) {
  const { latitude, longitude,message } = event.detail;
  locationLatitude = latitude;
  locationLongitute = longitude;
  errormessage = message
  if(errormessage){
    if(errormessage.toLowerCase()==='Location permission not granted'.toLowerCase()){
      errormessage="Enable location permission to check in or check out"
    }
  }
}

function getLocalstoreageDetails(event) {
  if(typeof(event.detail)==='object'){
  const { EmployeeGUID, EmployeeID,Email } = event.detail;
  EmployeeID_Value = EmployeeID;
  EmployeeGUID_Value = EmployeeGUID;
  EmployeeEmail_Value = Email;
}
}

function getLocalstoreageWebUrl(event){
  if(typeof(event.detail)==='string'){
    webURL_Value=event.detail
  }
}
function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}