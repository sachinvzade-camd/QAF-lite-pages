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
var MyleavesList = [];


qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getMyLeaveRequest();
        getLeaveType();
        getEmployee()
        getObject()
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getMyLeaveRequest() {
    MyleavesList = []
    let objectName = "Leave_Request";
    let list = 'RecordID,Title,StartDate,EndDate,LeaveStatus';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `CreatedByGUID='${user.EmployeeGUID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((leaves) => {
        if (Array.isArray(leaves) && leaves.length > 0) {
            MyleavesList = leaves;
        }
    });
}

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

    let user = getCurrentUser();
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
                        alertmessage = "You are eligible for privilege leave 6 months after joining date"
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
        alertmessage = "Leave balance isnÃ¢â‚¬â„¢t configured for this employee.";
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
            let alertMessage = "Brief about the request is required"
            openAlert(alertMessage)
        }
        else if (!leaveTypeValue) {
            if (leaveButton) {
                leaveButton.disabled = false
            }

            let alertMessage = "Leave Type is required"
            openAlert(alertMessage)

        }
        else if (!startTime) {
            if (leaveButton) {
                leaveButton.disabled = false
            }
            let alertMessage = "Start Date is required"
            openAlert(alertMessage)

        }
        else if (!endTime) {
            if (leaveButton) {
                leaveButton.disabled = false
            }
            let alertMessage = "End Date is required"
            openAlert(alertMessage)


        }
        else {
            if (MyleavesList && MyleavesList.length > 0) {
                let isLeaveAlreadyPresent = false;
                let MessageAlert;
                let MyLeave = [];
                let leaveObject = [];
                MyleavesList.forEach(leave => {
                    let InputLeaveStartDate = new Date(extractDateIndianFormat(startTime));
                    let InputLeaveEndDate = new Date(extractDateIndianFormat(endTime));
                    let LeaveStartDate = new Date(extractDateIndianFormat(leave.StartDate));
                    let LeaveEndDate = new Date(extractDateIndianFormat(leave.EndDate));
                    let condition1 = (InputLeaveStartDate >= LeaveStartDate && InputLeaveStartDate <= LeaveEndDate);
                    let condition2 = (InputLeaveEndDate >= LeaveStartDate && InputLeaveEndDate <= LeaveEndDate);
                    if (condition1 || condition2) {
                        // MessageAlert = "Leave request has already been raised for the selected date";
                        MyLeave.push(leave);
                    } else {
                        isLeaveAlreadyPresent = true;
                    }
                });
                if (MyLeave.length > 0) {
                    
                    MyLeave.forEach(val => {
                        
                        let LeaveStatus = val.LeaveStatus;
                        // if (LeaveStatus.toLowerCase() === "Cancel Closed".toLowerCase()) {
                        //     isLeaveAlreadyPresent = true;
                        // }
                        // else {
                        //     isLeaveAlreadyPresent = false;
                        //     leaveObject.push(val)
                        // }
                        if ((LeaveStatus.toLowerCase() === "Closed".toLowerCase()) || (LeaveStatus.toLowerCase() === "Cancellation submitted".toLowerCase())) {
                            MessageAlert = "Leave request has already been raised for the selected date";
                            leaveObject.push(val)
                        }
                        else {
                            isLeaveAlreadyPresent = true;
                        }
                    })
                    if (leaveObject.length > 0) {
                        
                        openAlert(MessageAlert)
                        if (leaveButton) {
                            leaveButton.disabled = false
                        }
                    }
                    else {
                        save(object, 'Leave_Request')
                    }
                }
                else {
                    if (isLeaveAlreadyPresent) {
                        save(object, 'Leave_Request')
                    }
                    else {
                        openAlert(MessageAlert)
                        if (leaveButton) {
                            leaveButton.disabled = false
                        }
                    }
                }
            }
            else {
                save(object, 'Leave_Request')
            }
        }
    }
    else {
        openAlert(alertmessage)
        if (leaveButton) {
            leaveButton.disabled = false
        }
    }

}

function extractDateIndianFormat(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-IN', { month: 'long' });
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
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

        let alertMessage = "'Please select proper date range"
        openAlert(alertMessage)
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

    let dateObject = new Date(dateString);
    let year = dateObject.getFullYear();
    let month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
    let day = String(dateObject.getDate()).padStart(2, '0');
    let hours = String(dateObject.getHours()).padStart(2, '0');
    let minutes = String(dateObject.getMinutes()).padStart(2, '0');
    let seconds = String(dateObject.getSeconds()).padStart(2, '0');
    let formattedDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return formattedDateString;
}


function openAlert(message) {
    let qafAlertObject = {
        IsShow: true,
        Message: message,
        Type: 'ok'
    }
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}

function clearDateTimefield(inputID) {
    let FromDate = "FromDate";
    if (inputID.toLowerCase() === FromDate.toLowerCase()) {
        let startTime = document.getElementById('startTime');
        startTime.value = "";

    }
    else {
        let endTime = document.getElementById('endTime');

        endTime.value = "";
    }
}