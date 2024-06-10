// Declare variables
var Employee;
var Meeting;
var Meeting_Room_Request;
var AllMeetingRequestData;
var todaysDate;
var whereClausecreate;
var selectMeetingRoom;
var currentDateTime = new Date();
var day = currentDateTime.getDate();
var month = currentDateTime.getMonth() + 1;
var year = currentDateTime.getFullYear();
var creativemeeting;
var user;
day = day < 10 ? '0' + day : day;
month = month < 10 ? '0' + month : month;
var currentDate = `${day}/${month}/${year}`;
var todaysDateforWhereclause = `${year}/${month}/${day}`;
var todaysDate = document.getElementById("today");
var MeetingSelect = document.getElementById("meetingName");

let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        let breadcum = document.getElementById("breadcrum");
        if (breadcum) {
            document.getElementById("breadcrum").style.display = "none";
        }
        whereClausecreate = `FromTime>='${year + '/' + month + '/' + day}'<AND>FromTime<='${year + '/' + month + '/' + day}'`;
        todaysDate.innerHTML = getformatDate(currentDate);
        getEmployee()
        user = getCurrentUser();
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getEmployee() {
    showLoader();
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `IsOffboarded!='True'<OR>IsOffboarded=''`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;
        }
        getMeeting()
    });
}


function getCurrentUserGuid() {
    let guid = '';
    let userKey = window.localStorage.getItem('user_key');
    if (userKey) {
        let user = JSON.parse(userKey);
        if (user.value) {
            guid = user.value.EmployeeGUID;
        }
    }
    return guid;
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
// Month Nevigator
function nextDate() {
    const addButton = document.getElementById('addform');
    if (MeetingSelect.value == "") {
        MeetingSelect.value = creativemeeting
        addButton.setAttribute('onclick', 'submitScheduleForm()');
        showLoader()
        monthNavigator('add');

    }
    else {
        showLoader()
        monthNavigator('add');
    }

}

function previousDate() {
    const addButton = document.getElementById('addform');
    if (MeetingSelect.value == "") {
        MeetingSelect.value = creativemeeting
        addButton.setAttribute('onclick', 'submitScheduleForm()');
        showLoader()
        monthNavigator('subtract');
    }
    else {
        showLoader()
        monthNavigator('subtract');
    }
}

function showLoader() {
    document.getElementById("loaderContainer").style.display = "block";
    document.getElementById("table").style.display = "none";
    // setTimeout(function () {
    //     document.getElementById("table").style.display = "table";
    //     document.getElementById("loaderContainer").style.display = "none";
    // }, 1000);

}

function HideLoader(){
    document.getElementById("table").style.display = "table";
    document.getElementById("loaderContainer").style.display = "none";
}


function monthNavigator(month) {
    if (month === 'subtract') {
        currentDateTime.setDate(currentDateTime.getDate() - 1);
    } else {
        currentDateTime.setDate(currentDateTime.getDate() + 1);
    }
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth() + 1;
    year = currentDateTime.getFullYear();
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    currentDate = `${day}/${month}/${year}`;
    todaysDate.innerHTML = getformatDate(currentDate);
    whereClausecreate = `FromTime>='${year}/${month}/${day}'<AND>FromTime<='${year}/${month}/${day}'`;

    const Name = MeetingSelect.value
    getmeetingrommrequest(Name)
}

MeetingSelect.addEventListener('change', loadNewMeeting);
function loadNewMeeting() {
    const MeetingNameValue = MeetingSelect.value;
    getmeetingrommrequest(MeetingNameValue)
}

function getformatDate(inputDate) {
    const [day, month, year] = inputDate.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[date.getMonth()];
    const formattedDate = `${day}-${monthName}-${year}`;
    return formattedDate;
}

function formatTime(date) {

    const hour = date.getHours() % 12 || 12;
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${ampm}`;
}

//function to convert time to 24 hour
function formatTime1(date) {

    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
}


function getMeeting() {
    Meeting = []
    let objectName = "Meeting_Room";
    let list = 'RecordID,Name';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((meetings) => {
        if (Array.isArray(meetings) && meetings.length > 0) {
            Meeting = meetings;
            selectMeetingRoom = Meeting[0]
        }
        getAllMeetngRequest();
        loadMeeting();

    });
}

// const whereClause = `(FromTime>='${todaysDateforWhereclause}')<<NG>>(IsApproved!='False')`;
function getAllMeetngRequest() {
    AllMeetingRequestData = []
    const objectName = "Meeting_Room_Request";
    const list = "Title,MeetingRoom,FromTime,ToTime,IsApproved,RequestFor";
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    const whereClause = `FromTime>='${todaysDateforWhereclause}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((meetings) => {
        if (Array.isArray(meetings) && meetings.length > 0) {
            AllMeetingRequestData = meetings;

        }
    });
}

function loadMeeting() {
    let MeetingName = document.getElementById('meetingName');
    let options = `<option value=''> Select Meeting Room</option>`;
    if (MeetingName) {
        Meeting.forEach(meeting => {
            options += `<option value="${meeting.RecordID}">${meeting.Name}</option>`;

        });
        MeetingName.innerHTML = options;
        MeetingName.value = selectMeetingRoom.RecordID
        creativemeeting = selectMeetingRoom.RecordID;
        getmeetingrommrequest(MeetingName.value);

    }
}

// const whereClause = `(FromTime>='${year}/${month}/${day}'<AND>FromTime<='${year}/${month}/${day}')<<NG>>(MeetingRoom='${MeetingRoom}')<<NG>>(IsApproved!='False')`;
function getmeetingrommrequest(MeetingName) {
    if (MeetingName) {
        Meeting_Room_Request = []
        const MeetingRoom = MeetingName
        const objectName = "Meeting_Room_Request";
        const list = "Title,MeetingRoom,FromTime,ToTime,IsApproved,RequestFor";
        const orderBy = "";
        const whereClause = `(FromTime>='${year}/${month}/${day}'<AND>FromTime<='${year}/${month}/${day}')<<NG>>(MeetingRoom='${MeetingRoom}')`;
        // const whereClause = " ";
        const fieldList = list.split(";#");
        const pageSize = "20000";
        const pageNumber = "1";
        let html = "";
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((meetingrommrequest) => {
            if (Array.isArray(meetingrommrequest) && meetingrommrequest.length > 0) {
                Meeting_Room_Request = meetingrommrequest;
            }
            updateMeetinginTable(Meeting_Room_Request);

        });
    }
    else {
        Meeting_Room_Request = [];
        updateMeetinginTable(Meeting_Room_Request);
    }
}

function closeForm() {
    var MeetingSelect = document.getElementById("meetingName");

    if (MeetingSelect) {
        MeetingSelect.value = ""
    }
}

function getFullNameByRecordID(targetRecordID) {
    const Employee_Data = Employee;
    const targetRecord = Employee_Data.find(record => record.RecordID === targetRecordID);
    if (targetRecord) {
        const fullName = `${targetRecord.FirstName} ${targetRecord.LastName}`;
        return fullName;
    } else {
        return '';
    }
}


function updateMeetinginTable(EventData) {
    

    const table = document.getElementById('table');
    table.innerHTML = '';
    for (let hour = 0; hour < 24; hour++) {
        const TableRows = document.createElement('tr');
        TableRows.classList.add("qaf-tr");
        const TimeRow = document.createElement('td');
        TimeRow.classList.add("qaf-td");
        TimeRow.textContent = `${hour < 10 ? '0' + hour : hour}:00`;
        TableRows.appendChild(TimeRow);

        const EventForSameTime = [];
        EventData.forEach(event => {
            
            const startTime = formatTime1(adjustTimeToIST(event.FromTime));
            const startHour = parseInt(startTime.split(':')[0]);
            if (startHour === hour) {
                EventForSameTime.push(event);
            }
        });

        if (EventForSameTime.length > 0) {
            EventForSameTime.sort((a, b) => {
                let starta = formatTime(adjustTimeToIST(a.FromTime));
                let startb = formatTime(adjustTimeToIST(b.FromTime));
                return starta.localeCompare(startb);
            });

       
            EventForSameTime.forEach(event => {
                
                let RequestFor = JSON.parse(event.RequestFor);
                let RecordID = RequestFor[0].RecordID;
                let Fullname = getFullNameByRecordID(RecordID)
                const startHour = formatTime(adjustTimeToIST(event.FromTime));
                const endHour = formatTime(adjustTimeToIST(event.ToTime));

                const eventCell = document.createElement('td');
                eventCell.classList.add("qaf-td");
                eventCell.textContent = `${event.Title} (${startHour} - ${endHour}) by ${Fullname}`;
                let FromTime = convertTime_12_TO_24(startHour);
                let ToTime = convertTime_12_TO_24(endHour)
                const duration = parseInt(ToTime.split(':')[0]) - parseInt(FromTime.split(':')[0]);

             
                let isEventisSeparateTime = false;

                if (duration == 1 && parseInt(ToTime.split(':')[1]) == 0) {
                    eventCell.setAttribute('rowspan', 1);
                }
                else {
                    eventCell.setAttribute('rowspan', duration + 1);
                }

                if (EventForSameTime.length > 1) {
                    eventCell.setAttribute('colspan', 0);
                }
                else {
                    EventData.forEach(time => {
                        
                        let eventDataFromTime1 = formatTime(adjustTimeToIST(time.FromTime));
                        let NewFromTime1 = convertTime_12_TO_24(eventDataFromTime1)
                        let eventDataFromTime = parseInt(NewFromTime1.split(':')[0]);

                        let eventDataToTime1 = formatTime(adjustTimeToIST(time.ToTime));
                        let NewToTime1 = convertTime_12_TO_24(eventDataToTime1)
                        let eventDataToTime = parseInt(NewToTime1.split(':')[0]);

                        let currentEventFromTime = parseInt(FromTime.split(':')[0]);
                        let currentEventToTime = parseInt(ToTime.split(':')[0]);

                        if (eventDataFromTime === currentEventToTime || eventDataToTime === currentEventFromTime) {
                            if (eventDataFromTime == eventDataToTime) {
                                isEventisSeparateTime = false;
                            }
                            else {
                                isEventisSeparateTime = true;
                            }
                        }

                    })
                    if (isEventisSeparateTime) {
                        eventCell.setAttribute('colspan', 0);
                    }
                    else {
                        eventCell.setAttribute('colspan', 100);
                    }

                }
                eventCell.classList.add('highlight');
                TableRows.appendChild(eventCell);
            });
        }
        else {
            const noEventCell = document.createElement('td');
            noEventCell.classList.add("qaf-td");
            TableRows.appendChild(noEventCell);
        }

        table.appendChild(TableRows);
    }
    HideLoader()
}

function convertTime_12_TO_24(Time) {
    var match = Time.match(/^(\d+):(\d+) (AM|PM)$/);
    if (!match) {
        return "Invalid time format";
    }
    var hours = parseInt(match[1]);
    var minutes = parseInt(match[2]);
    var period = match[3];
    if (period === 'AM' && hours === 12) {
        hours = 0;
    } else if (period === 'PM' && hours !== 12) {
        hours += 12;
    }
    var newTime = ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2);
    return newTime;
}

function adjustTimeToIST(dateString) {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    return date;
}


function AddForm() {
    // loadTable()
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'block';
        addCssforscroll()

    }
    setEmployeeinDropdown()
}

function CloseForm() {
    clearTableInputValues()
    let popUp = document.getElementById("expense-from");
    if (popUp) {
        popUp.style.display = 'none';

        removeCss()
    }
}

function setEmployeeinDropdown() {
    let requestForElement = document.getElementById('requestfor');
    let options = `<option value=''></option>`;
    if (requestForElement) {
        Employee.sort((a, b) => (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0));
        Employee.forEach(emp => {
            options += `<option value="${emp.RecordID}">${emp.FirstName} ${emp.LastName}</option>`;
        });
        requestForElement.innerHTML = options;
    }
    requestForElement.value = getCurrentUserGuid();
    SetMeetingroomdropdown()
}


function SetMeetingroomdropdown() {
    let meetingName = document.getElementById('meetingName');
    let MeetingRoom = document.getElementById('meetingroom');
    let options = `<option value=''> Select Meeting Room</option>`;
    if (MeetingRoom) {
        Meeting.forEach(meeting => {
            options += `<option value="${meeting.RecordID}">${meeting.Name}</option>`;

        });
        MeetingRoom.innerHTML = options;
    }
    MeetingRoom.value = meetingName.value;
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
            clearTableInputValues()
            CloseForm()
            resolve({
                response
            })
        });
    }
    )
}

function addCssforscroll() {
    var element = document.querySelector("body");
    element.classList.add("hide-y-scroll");
}
function removeCss() {
    var element = document.querySelector("body");
    element.classList.remove("hide-y-scroll");
}

function clearDateTimefield(inputID) {
    let FromDate = "FromDate";
    if (inputID.toLowerCase() === FromDate.toLowerCase()) {
        let fromDate = document.getElementById('fromDate');
        let fromtime = document.getElementById('fromtime');
        fromDate.value = "";
        fromtime.value = "";
    }
    else {
        let ToDate = document.getElementById('ToDate');
        let ToTime = document.getElementById('ToTime');
        ToDate.value = "";
        ToTime.value = "";
    }
}

function SaveRecord() {
    
    let RequestFor = document.getElementById('requestfor').value;
    let requesttitle = document.getElementById('requesttitle').value;
    let meetingroom = document.getElementById('meetingroom').value;
    let fromDate = document.getElementById('fromDate').value;
    let fromtime = document.getElementById('fromtime').value;
    let ToDate = document.getElementById('ToDate').value;
    let ToTime = document.getElementById('ToTime').value;

    let DateCondition
    const EmployeName = RequestFor;
    const meetingroomValue = meetingroom;
    let SelectedEmployee;
    let SelectedMeeting;
    const fromdate = fromDate;
    const from_time = fromtime;
    const NewfromTime = new Date(`${fromdate}T${from_time}`);
    const todate = ToDate;
    const to_time = ToTime;
    const NewtoTime = new Date(`${todate}T${to_time}`);

    if (EmployeName) {
        let employee = Employee.filter(emp => emp.RecordID === EmployeName);
        if (employee && employee.length > 0) {
            SelectedEmployee = [{ UserType: 1, RecordID: employee[0].RecordID }];
        }
    }
    if (meetingroomValue) {
        let meetingroomName = Meeting.filter(dept => dept.RecordID === meetingroomValue);
        if (meetingroomName && meetingroomName.length > 0) {
            SelectedMeeting = meetingroomName[0].RecordID + ";#" + meetingroomName[0].Name;
        }
    }
    if (RequestFor == "") {
        let alertMessage = ("Request For field is required");
        openAlert(alertMessage);
    }
    else if (requesttitle.trim() == "") {
        let alertMessage = ("Brief about the request field is required");
        openAlert(alertMessage);
    }
    else if (requesttitle.trim().length > 20) {
        let alertMessage = ("Brief about the request allow 20 characters");
        openAlert(alertMessage);
    }
    else if (meetingroom == "") {
        let alertMessage = ("Meeting Room field is required");
        openAlert(alertMessage);
    }
    else if (fromDate == "") {
        let alertMessage = ("From Time field is required");
        openAlert(alertMessage);

    }
    else if (moment(fromDate, "YYYY-MM-DD").isBefore(moment(), 'day')) {
        let alert = "From Date should be today or after today."
        openAlert(alert)
    }
    else if (fromtime == "") {
        let alertMessage = ("From Time field is required");
        openAlert(alertMessage);
    }
    else if (ToDate == "") {
        let alertMessage = ("To Date field is required");
        openAlert(alertMessage);
    }
    else if (!moment(ToDate).isSame(moment(fromDate), 'date')) {
        let alertMessage = ("To Date should be same as From Date");
        openAlert(alertMessage);
    }
    else if (ToTime == "") {
        let alertMessage = ("To Time field is required");
        openAlert(alertMessage);
    }
    else {
        DateCondition = compareInputDates(NewfromTime, NewtoTime)
        if (!DateCondition) {
            let alertMessage = ("Please select current time or future time");
            openAlert(alertMessage);
        }
        else {
            
            const Meeting_FromDate = moment(NewfromTime)
            const Meeting_ToDate = moment(NewtoTime)
            const meetingsWithinTimeRange = [];
            let Ismeetingdataloading = true;
            let selectedmeetingsRequests = getSelectedMeetingData(SelectedMeeting);

            selectedmeetingsRequests.forEach(request => {
                
                let fromDateandTime = adjustTimeToIST(request.FromTime);
                let toDateandTime = adjustTimeToIST(request.ToTime);

                const requestFromTime = formatRepositoryDate(fromDateandTime);
                const requestToTime = formatRepositoryDate(toDateandTime);

                const combinefromDate = formatRepositoryDate(NewfromTime);
                const combineToDate = formatRepositoryDate(NewtoTime);

                var isBetweenDates1 = moment(combinefromDate).isBetween(requestFromTime, requestToTime, 'date', '[]');
                var isBetweenDates2 = moment(combineToDate).isBetween(requestFromTime, requestToTime, 'date', '[]');

                if (isBetweenDates1 && isBetweenDates2) {

                    const timeFormat = 'HH:mm A';
                    let time1 = moment(combinefromDate).format(timeFormat)
                    let time2 = moment(combineToDate).format(timeFormat)
                    let req1 = moment(requestFromTime).format(timeFormat)
                    let req2 = moment(requestToTime).format(timeFormat)
                    let firstTime = isTimeBetween(req1, req2, time1)
                    let secondTime = isTimeBetween(req1, req2, time2)

                    let outFirstTime = isTimeBetween(time1, time2, req1)
                    let outsecondTime = isTimeBetween(time1, time2, req2)
                    if (firstTime || secondTime || outFirstTime ||outsecondTime) {
                        Ismeetingdataloading = false;
                        meetingsWithinTimeRange.push(request)
                    }
                }
            })
            if (meetingsWithinTimeRange.length > 0) {
                let alert = "Selected meeting room and time slot already booked."
                openAlert(alert)

            }
            else {

                if (Ismeetingdataloading) {
                    let pageDisabledElement = document.getElementById('pageDisabled');
                    if (pageDisabledElement) {
                        pageDisabledElement.classList.add('page-disabled')
                    }
                    let isloadingElement = document.getElementById('isloading');
                    if (isloadingElement) {
                        isloadingElement.style.display = 'block'
                    }

                    let object = {
                        RequestFor: JSON.stringify(SelectedEmployee),
                        Title: requesttitle,
                        MeetingRoom: SelectedMeeting,
                        FromTime: NewfromTime,
                        ToTime: NewtoTime
                    };
                    save(object, 'Meeting_Room_Request');
                    getMeeting();
                }
                else {
                    let alertMessage = "Selected meeting room and time slot already booked."
                    openAlert(alertMessage)
                }
            }
        }


    }
}


function clearTableInputValues() {
    let RequestFor = document.getElementById('requestfor');
    let requesttitle = document.getElementById('requesttitle');
    let meetingroom = document.getElementById('meetingroom');
    let fromDate = document.getElementById('fromDate');
    let fromtime = document.getElementById('fromtime');
    let ToDate = document.getElementById('ToDate');
    let ToTime = document.getElementById('ToTime');
    RequestFor.value = "";
    requesttitle.value = "";
    meetingroom.value = "";
    fromDate.value = "";
    fromtime.value = "";
    ToDate.value = "";
    ToTime.value = "";
    let pageDisabledElement = document.getElementById('pageDisabled');
    if (pageDisabledElement) {
        pageDisabledElement.classList.remove('page-disabled')
    }
    let isloadingElement = document.getElementById('isloading');
    if (isloadingElement) {
        isloadingElement.style.display = 'none'
    }
}

function getSelectedMeetingData(selectedMeeting) {
    let selectedMeetingData = AllMeetingRequestData.filter(meeting => meeting.MeetingRoom === selectedMeeting);
    return selectedMeetingData;
}

function isTimeBetween(startTime, endTime, checkTime) {

    const startTimeMinutes = convertToMinutes(startTime);
    const endTimeMinutes = convertToMinutes(endTime);
    const checkTimeMinutes = convertToMinutes(checkTime);

    return checkTimeMinutes >= startTimeMinutes && checkTimeMinutes <= endTimeMinutes;
}

// Function to convert time to minutes since midnight
function convertToMinutes(time) {
    const [hours, minutes] = time.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}


function getByKey(key) {
    let cacheValue = this.localStorage.getItem(key);
    if (cacheValue && (cacheValue != "undefined")) {
        return JSON.parse(cacheValue);
    }
}

function getDateDisplayFormatTimeWithTimezone(value, timezone = "", displaytimeFormat = "", timeDisplayFormat = "") {

    let timeformat = getByKey("TimeZone");
    if (value === "0001-01-01T00:00:00") {
        value = "";
        return;
    }
    let dateFormate = getByKey("TimeZone");
    if (value) {
        return convertUTCtoLocalDateTime(value.toString(), timezone ? timezone : dateFormate, displaytimeFormat ? displaytimeFormat : timeformat, timeDisplayFormat).toString();
    } else {
        return value;
    }
}
function convertUTCtoLocalDateTime(dateString, timezone, timeFormateg, timesDisplayFormat) {
    let timezoneLable = timezone ? timezone.split(",")[1] : "Asia/Kolkata";
    let language = timezone ? timezone.split(",")[0] : "IN";
    let options = {
        timeZone: timezoneLable,
        hour: "numeric",
        minute: "numeric",
        hour12: timeFormate === "12 Hour" ? true : false
    };

    if (dateString) {
        return tz(moment.utc(dateString), timezoneLable || language).format(timesDisplayFormat ? timesDisplayFormat : getTimeZone(language))
    } else {
        return "";
    }
}
function getTimeZone(language) {
    let timeFormat = " h:mm:ss A";
    let timezoneList = [
        {
            Language: 'IN',
            Format: 'DD/MM/YYYY' + timeFormat
        },
        {
            Language: 'en-US',
            Format: 'MM/DD/YYYY' + timeFormat
        },
        {
            Language: 'ms',
            Format: 'DD/MM/YYYY' + timeFormat
        },
        {
            Language: 'en-GB',
            Format: 'DD/MM/YYYY' + timeFormat
        },
        {
            Language: 'en-TZ',
            Format: 'DD/MM/YYYY' + timeFormat
        },
        {
            Language: 'CST',
            Format: 'DD/MM/YYYY' + timeFormat
        },
        {
            Language: 'en-uk',
            Format: 'DD/MM/YYYY' + timeFormat
        },
        {
            Language: 'GMT',
            Format: 'DD/MM/YYYY' + timeFormat
        },
        {
            Language: 'AUS',
            Format: 'DD/MM/YYYY' + timeFormat
        },
        {
            Language: 'CST',
            Format: 'MM/DD/YYYY' + timeFormat
        },
        {
            Language: 'HKT',
            Format: 'MM/DD/YYYY' + timeFormat
        },
        {
            Language: 'CA',
            Format: 'DD/MM/YYYY' + timeFormat
        }
    ]
    let timezone = timezoneList.filter(time => time.Language === language)
    if (timezone && timezone.length > 0) {
        return timezone[0].Format
    } else {
        return 'DD/MM/YYYY' + timeFormat
    }
}

function convertUTCtoCompanyTime(dateString, timezone, language = "IN") {
    let totaloffset = moment.tz(timezone).utcOffset();
    let offsethours = Number(Math.floor(totaloffset / 60));
    let offsetMinutes = Number(totaloffset % 60);
    if (dateString) {
        let year = Number(moment(dateString).format("YYYY"))
        let month = Number(moment(dateString).format("MM"))
        let date = Number(moment(dateString).format("DD"))
        let hour = Number(moment(dateString).format("hh"))
        let modifier = (moment(dateString).format("a"))
        let minutes = Number(moment(dateString).format('mm'));
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
        let dateTime = new Date(year, month - 1, date, hour + offsethours, minutes + offsetMinutes, 0)
        let dateformat = dateTime.toLocaleDateString(language);
        return dateformat;
    } else {
        return "";
    }
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



function formatRepositoryDate(inputDate) {
    const dateTimeUTC = new Date(inputDate + "Z");
    const dateTimeIST = new Date(dateTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = dateTimeIST.getDate().toString().padStart(2, '0');
    const month = (dateTimeIST.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = dateTimeIST.getFullYear();

    const hour = inputDate.getHours() % 12 || 12;
    const minute = inputDate.getMinutes().toString().padStart(2, '0');
    const ampm = inputDate.getHours() >= 12 ? 'PM' : 'AM';
    let newhour = (hour < 10 ? "0" : "") + hour;
    const formattedTime = `${newhour}:${minute} ${ampm}`;
    // const fullDate = `${day}${month}/${year} ${formattedTime}`;
    const fullDate = `${year}-${month}-${day} ${formattedTime}`;
    return fullDate;
}

function compareInputDates(fromDate, Todate) {

    var FromDate = new Date(fromDate);
    var ToDate = new Date(Todate);
    var currentDateTime = new Date();
    var endOfSelectedDate = new Date(FromDate);
    endOfSelectedDate.setHours(23, 59, 59, 999);
    const timeFormat = 'HH:mm A';

    if (moment(ToDate).isSame(moment(currentDateTime), 'date')) {
        let FromTime1 = moment(fromDate).format(timeFormat)
        let ToTime1 = moment(ToDate).format(timeFormat)
        let EndDayTime1 = moment(endOfSelectedDate).format(timeFormat)
        let currentTime1 = moment(currentDateTime).format(timeFormat)

        let fromTime2 = convertToMinutes(FromTime1);
        let toTime2 = convertToMinutes(ToTime1);
        let currentTime2 = convertToMinutes(currentTime1)
        let endDaytime2 = convertToMinutes(EndDayTime1)

        if (toTime2 >= fromTime2 && (fromTime2 >= currentTime2 && toTime2 <= endDaytime2)) {
            return true
        } else {
            return false
        }
    }
    else {
        let FromTime3 = moment(fromDate).format(timeFormat)
        let ToTime3 = moment(ToDate).format(timeFormat)
        let EndDayTime3 = moment(endOfSelectedDate).format(timeFormat)
        let fromTime4 = convertToMinutes(FromTime3);
        let ToTime4 = convertToMinutes(ToTime3)
        let EndDayTime4 = convertToMinutes(EndDayTime3)
        if (ToTime4 >= fromTime4 && ToTime4 <= EndDayTime4) {
            return true
        }
        else {
            return false
        }
    }
}