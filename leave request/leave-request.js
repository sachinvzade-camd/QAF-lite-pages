var leaveTypesList = [];
var leaveBalance;
var user = getCurrentUser()
var startTime = ""
var endTime = "";
var attachmenturl = "";

var file;
var filename;
var attachmentRepoAndFieldName;
var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var Employee;
var fieldlist = []
document.getElementById("startTime").addEventListener("change", function () {
    startTime = new Date(this.value);
    if (startTime && endTime) {
        calculateDifference()
    }
});
document.getElementById("endTime").addEventListener("change", function () {
    endTime = new Date(this.value);
    if (startTime && endTime) {
        calculateDifference()
    }
});

qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getLeaveType();
        getEmployee()
        getObject()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getObject() {
    window.QafService.GetObjectById('Employee_Leave_Balance').then((responses) => {
        responses[0].Fields.forEach(val => {
            fieldlist.push(val.InternalName)
        });
        getEmployeeLeaveBalance();

    });
}
function getEmployee() {

    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,JoiningDate';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${user.EmployeeGUID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;

        }
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
function getEmployeeLeaveBalance() {
    employeeList = []
    let currentYear = new Date().getFullYear()
    let objectName = "Employee_Leave_Balance";
    let list = fieldlist.join(",")
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Year='${currentYear}')<<NG>>(Employee='${user.EmployeeGUID}')`;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((balance) => {
        if (Array.isArray(balance) && balance.length > 0) {
            leaveBalance = balance[0]
        }
    });
}

function getLeaveType() {
    employeeList = []
    let objectName = "Leave_Type";
    let list = 'Name,MappingwithLeaveBalance'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((leaveTypes) => {
        if (Array.isArray(leaveTypes) && leaveTypes.length > 0) {
            leaveTypesList = leaveTypes
            let leaveDropdown = document.getElementById('leaveType');
            let options = `<option value='' class='blank-leave'></option>`
            if (leaveDropdown) {
                leaveTypesList.forEach(type => {
                    options += `<option class='leave-type' value=${type.RecordID}>${type.Name}</option>`
                })
                leaveDropdown.innerHTML = options;
            }

        }
    });
}
function handleChangeleaveType() {
    let leaveType = document.getElementById('leaveType');
    if (leaveType) {
        let value = leaveTypesList.find(type => type.RecordID === leaveType.value)
        if (value) {
            let currentLeaveBalance = leaveBalance[value.MappingwithLeaveBalance]
            let leaveBalanceElement = document.getElementById('leaveBalance');
            if (leaveBalanceElement) {
                leaveBalanceElement.value = currentLeaveBalance
            }
        }
    }
}
function saveAppplyForm() {
    alertmessage = ""
    let leaveButton = document.getElementById('apply_leave');
    if (leaveButton) {
        leaveButton.disabled = true
    }
    let leaveTypeValue = ""
    let titleValue = ""
    let NoteValue = ""
    let numberofdaysValue = 0
    let leaveType = document.getElementById('leaveType');
    let Title = document.getElementById('Title');
    let Note = document.getElementById('Note');
    let numberofdays = document.getElementById('numberofdays');
    let joiningDate = Employee[0].JoiningDate;
    let isSaveSubmit = true;
    if (numberofdays) {
        numberofdaysValue = numberofdays.value
    }
    if (leaveBalance) {
        if (leaveType) {
            let value = leaveTypesList.find(type => type.RecordID === leaveType.value)
            if (value) {
                leaveTypeValue = value.RecordID + ";#" + value.Name
                if (value.Name.toLowerCase() === "Unpaid Leave".toLowerCase()) {
                    isSaveSubmit = true
                }
                else if (value.Name.toLowerCase() === "Privilege Leave".toLowerCase()) {
                    let joiningDate = Employee[0].JoiningDate;
                    if (joiningDate) {
                        if (startTime) {
                            let startDate = formatDate(startTime);
                            let diffInMilliseconds = Math.abs(new Date(startDate) - new Date(joiningDate));
                            let diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
                            let diffInMonths = Math.floor(diffInDays / 30);
                            if (diffInMonths >= 6) {
                                if (leaveBalance) {
                                    let currentLeaveBalance = leaveBalance[value.MappingwithLeaveBalance]
                                    if (currentLeaveBalance !== null && currentLeaveBalance !== undefined) {
                                        if (parseFloat(numberofdaysValue) > currentLeaveBalance) {
                                            alertmessage = "Leave taken is more than leave balance"
                                            isSaveSubmit = false
                                        }
                                    }
                                    else {
                                        alertmessage = "Record not added in employee leave balance";
                                        isSaveSubmit = false;
                                    }

                                }
                                else {
                                    alertmessage = "Record not added in employee leave balance";
                                    isSaveSubmit = false;
                                }
                            } else {
                                alertmessage = "You are eligible for privilege leave 6 months after joining date "
                                isSaveSubmit = false;
                            }
                        }
                        else {
                            alertmessage = 'Start Date is required'
                            isSaveSubmit = false
                        }
                    }
                    else {
                        alertmessage = "You are not eligible for privilege leave"
                        isSaveSubmit = false
                    }
                }
                else {
                    if (leaveBalance) {
                        let currentLeaveBalance = leaveBalance[value.MappingwithLeaveBalance];
                        if (currentLeaveBalance !== null && currentLeaveBalance !== undefined) {
                            if (parseFloat(numberofdaysValue) > currentLeaveBalance) {
                                alertmessage = "Leave taken is more than leave balance";
                                isSaveSubmit = false;
                            }
                        } else {
                            alertmessage = "Record not added in employee leave balance";
                            isSaveSubmit = false;
                        }
                    } else {
                        alertmessage = "Record not added in employee leave balance";
                        isSaveSubmit = false;
                    }


                }

            }
        }
    }
    else {
        alertmessage = "Employee leave balance not configured for this employee";
        isSaveSubmit = false;
    }

    if (isSaveSubmit) {
        if (Title) {
            titleValue = Title.value
        }
        if (Note) {
            NoteValue = Note.value
        }
        let halfdayelement = document.getElementById("halfday");
        let halfvalue = halfdayelement.checked;
        let object = {
            Title: titleValue,
            LeaveType: leaveTypeValue,
            StartDate: startTime ? storeDateWithTimeZone(startTime, '', false, false) : "",
            EndDate: endTime ? storeDateWithTimeZone(endTime, '', false, false) : "",
            HalfDayLeave: halfvalue ? true : false,
            NumberofDays: numberofdaysValue ? parseFloat(numberofdaysValue) : '',
            Note: NoteValue,
            Attachment: attachmenturl
        }
        if (!titleValue) {
            if (leaveButton) {
                leaveButton.disabled = false
            }
            alert('Brief about the request is required')
        }
        else if (!leaveTypeValue) {
            if (leaveButton) {
                leaveButton.disabled = false
            }
            alert('Leave Type is required')

        }
        else if (!startTime) {
            if (leaveButton) {
                leaveButton.disabled = false
            }
            alert('Start Date is required')

        }
        else if (!endTime) {
            if (leaveButton) {
                leaveButton.disabled = false
            }
            alert('End Date is required')
        } else {
            save(object, 'Leave_Request')
        }
    }
    else {
        alert(alertmessage)
        if (leaveButton) {
            leaveButton.disabled = false
        }
    }

}
function storeDateWithTimeZone(dateString, timeZone = "", isTimeSelected = false, isTimePresent = false) {
    let dateFormate = getByKey("TimeZone");
    let timezoneLable = dateFormate ? dateFormate.split(",")[1] : "Asia/Kolkata";
    timeZone = timeZone ? timeZone : timezoneLable

    // offset to hours and minutes
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
            clearForm()
            resolve({
                response
            })
        });
    }
    )

}
function getByKey(key) {
    let cacheValue = this.localStorage.getItem(key);
    if (cacheValue && (cacheValue != "undefined")) {
        return JSON.parse(cacheValue);
    }
}

function calculateDifference() {
    if (moment(endTime).isSameOrAfter(startTime, 'date')) {
        const date1 = new Date(startTime);
        const date2 = new Date(endTime);
        const diffTime = Math.abs(date2 - date1);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        let totaldays = document.getElementById('numberofdays');
        let halfdayelement = document.getElementById("halfday");
        let halfvalue = halfdayelement.checked;
        if (halfvalue) {
            diffDays = diffDays / 2
        }

        if (totaldays) {
            totaldays.value = diffDays;
        }
    }
    else {
        alert('Please select proper date range')
    }

}
function handleChangehalfday() {

    if (startTime && endTime) {
        calculateDifference()
    }
}
function clearForm() {
    let Title = document.getElementById('Title');
    let leaveType = document.getElementById('leaveType');
    let startDate = document.getElementById("startTime")
    let endDate = document.getElementById("endTime")
    let halfdayelement = document.getElementById("halfday");
    let Note = document.getElementById('Note');
    let numberofdays = document.getElementById('numberofdays');

    if (Title) {
        Title.value = ""
    }
    if (leaveType) {
        leaveType.value = ""
    }
    if (Note) {
        Note.value = ""
    }
    if (numberofdays) {
        numberofdays.value = ""
    }
    if (startDate) {
        startDate.value = "";
        startTime = ""
    }
    if (endDate) {
        endDate.value = "";
        endTime = ""
    }
    if (halfdayelement) {
        halfdayelement.checked = false
    }
    let leaveButton = document.getElementById('apply_leave');
    if (leaveButton) {
        leaveButton.disabled = false
    }
    var callLocation = new CustomEvent('closeformevent')
    window.parent.document.dispatchEvent(callLocation)
}
function formatDate(dateString) {
    // Create a Date object from the provided dateString
    let dateObject = new Date(dateString);

    // Extract year, month, day, hour, minute, and second from the date object
    let year = dateObject.getFullYear();
    let month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
    let day = String(dateObject.getDate()).padStart(2, '0');
    let hours = String(dateObject.getHours()).padStart(2, '0');
    let minutes = String(dateObject.getMinutes()).padStart(2, '0');
    let seconds = String(dateObject.getSeconds()).padStart(2, '0');

    // Create the formatted date string
    let formattedDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return formattedDateString;
}
//   function onFileChange(event){
//     let selectedFiles = event.files;
//     let type = selectedFiles[0] && selectedFiles[0].name.substr(selectedFiles[0].name.lastIndexOf('.'), selectedFiles[0].name.length).toLowerCase();
//     if (type != ".exe") {
//       let recordId = "";
//       file = selectedFiles[0];
//       filename = file && file.name ?file.name : '';
//         attachmentRepoAndFieldName = `Leave_Request;#Attachment`;
//         document.getElementById('filename').innerHTML=filename
//         document.getElementById('deleteicon').style.display='block'

//     }
//   }
//   function  deleteFile(){
//     filename=""
//     file=null
//     attachmentRepoAndFieldName=""
//     document.getElementById('filename').innerHTML=filename
//     document.getElementById('deleteicon').style.display='none'
//     document.getElementById('UploadResume').value = "";

//   }
//   function   uploadAttachment() {
//     if(file){

//     const form = new FormData();
//     form.append('file', file, file && file.name);
//     form.append("file_type", attachmentRepoAndFieldName);
//     form.append("recordID", '');
//     fetch(`https://qaffirst.quickappflow.com/Attachment/uploadfile`, {
//         method: 'POST',
//         headers: {
//             'Host': 'demtis.quickappflow.com',
//             'Employeeguid': user.value.EmployeeGUID,
//             'Hrzemail': user.value.Email
//         },
//         body:form
//     })
//         .then(response => response.json())
//         .then(fileResponse => {
//           attachmenturl=fileResponse.url
//     saveAppplyForm()
//         })
//     }
// else{
//     saveAppplyForm()
// }
//   }