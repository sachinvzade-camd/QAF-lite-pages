// Declare variables
var events = new Array(24).fill(null).map(() => []);
var Employee;
var Meeting;
var Meeting_Room_Request;
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
var todaysDate = document.getElementById("today");
var MeetingSelect = document.getElementById("meetingName");

let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        window.localStorage.setItem('ma', "qaffirst.quickappflow.com")
        let breadcum = document.getElementById("breadcrum");
        if (breadcum) {
            document.getElementById("breadcrum").style.display = "none";
        }
        whereClausecreate = `FromTime>='${year + '/' + month + '/' + day}'<AND>FromTime<='${year + '/' + month + '/' + day}'`;
        todaysDate.innerHTML = getformatDate(currentDate);
        getEmployee()
        user = getCurrentUser();
        loadDayEvent()
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getEmployee() {
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    // let whereClause="";
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
    console.log("meeting Name1", creativemeeting)
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
    // showLoader()
    // monthNavigator('subtract');
    console.log("meeting Name1", creativemeeting)
}

function showLoader() {

    document.getElementById("loaderContainer").style.display = "block";
    document.getElementById("table").style.display = "none";
    setTimeout(function () {
        document.getElementById("table").style.display = "table";
        document.getElementById("loaderContainer").style.display = "none";
    }, 500);

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


function loadDayEvent() {
    const table = document.querySelector('table');
    for (let i = 0; i < 24; i++) {
        const row = document.createElement('tr');
        row.classList.add('qaf-tr');
        const hour = i < 10 ? '0' + i : i;
        row.innerHTML = `
            <td class="qaf-td">${hour}:00</td>
            <td id="hour-${hour}" class="qaf-td"></td>
        `;
        table.appendChild(row);
    }
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
        loadMeeting();
    });
}

function loadMeeting() {
    let MeetingName = document.getElementById('meetingName');
    let options = `<option value=''> Select Meeting</option>`;
    if (MeetingName) {
        Meeting.forEach(meeting => {
            options += `<option value="${meeting.RecordID}">${meeting.Name}</option>`;

        });
        MeetingName.innerHTML = options;
        MeetingName.value = selectMeetingRoom.RecordID
        creativemeeting = selectMeetingRoom.RecordID;
        getmeetingrommrequest(MeetingName.value);
        console.log("meeting Name1", creativemeeting)
    }
}

function getmeetingrommrequest(MeetingName) {

    if (MeetingName) {
        Meeting_Room_Request = []
        const MeetingRoom = MeetingName
        const objectName = "Meeting_Room_Request";
        const list = "Title,MeetingRoom,FromTime,ToTime,IsApproved,RequestFor";
        const orderBy = "";
        const whereClause = `(FromTime>='${year}/${month}/${day}'<AND>FromTime<='${year}/${month}/${day}')<<NG>>(MeetingRoom='${MeetingRoom}')<<NG>>(IsApproved!='False')`;
        // const whereClause = " ";
        const fieldList = list.split(";#");
        const pageSize = "20000";
        const pageNumber = "1";
        let html = "";
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((meetingrommrequest) => {
            if (Array.isArray(meetingrommrequest) && meetingrommrequest.length > 0) {
                Meeting_Room_Request = meetingrommrequest;
            }
            ShowMeeting(Meeting_Room_Request);
        });
    }
    else {
        Meeting_Room_Request = [];
        ShowMeeting(Meeting_Room_Request);
    }

}

function submitScheduleForm() {
    if (MeetingSelect.value) {
        let currentUserID = getCurrentUserGuid();
        let MeetingName = ""
        const MeetingNameValue = MeetingSelect.value;
        if (MeetingNameValue) {
            let meeting = Meeting.filter(pln => pln.RecordID === MeetingNameValue);
            if (meeting && meeting.length > 0) {
                MeetingName = meeting[0].RecordID + ";#" + meeting[0].Name;
            }
        }
        const object = {
            MeetingRoom: MeetingName,
            FromTime: currentDate,
        };
        window.QafService.GetObjectById('Meeting_Room_Request').then((responses) => {

            let fields = [];
            let fieldsValue = [];

            responses[0].Fields.forEach((ele) => {
                fields.push(ele.InternalName)
            })
            fields.forEach(val => {
                if (val === "MeetingRoom") {
                    fieldsValue.push({
                        fieldName: val,
                        fieldValue: MeetingName
                    })
                }
                else if (val === "RequestFor") {

                    fieldsValue.push({
                        fieldName: val,
                        fieldValue: user.EmployeeGUID + ";#" + user.FirstName + " " + user.LastName
                    })
                }
                else {
                    fieldsValue.push({ fieldName: val, fieldValue: "" })
                }
            })
            let fieldsDoNotdiaply = ['MeetingRoom']
            // let fieldsDoNotdiaply = ['MeetingRoom', 'RequestFor']

            fields = fields.filter((objOne) => {
                return !fieldsDoNotdiaply.some((objTwo) => {
                    return objOne === objTwo;
                });
            });
            if (window.QafPageService) {
                window.QafPageService.AddItem('Meeting_Room_Request', function () {
                    getmeetingrommrequest(MeetingNameValue)
                }, fields, fieldsValue, null, null, fieldsDoNotdiaply);
            }

        })
    }
    else {
        alert("Please select meeting room")

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

function ShowMeeting(data) {
    events = new Array(24).fill(null).map(() => []);
    console.log("Meeting Request Data", data);
    if (Array.isArray(data)) {
        data.forEach(event => {
            const startTime = adjustTimeToIST(event.FromTime);
            const endTime = adjustTimeToIST(event.ToTime);
            const startHour = startTime.getHours();
            const endHour = endTime.getHours();
            const startMinutes = startTime.getMinutes();
            const endMinutes = endTime.getMinutes();
            const startTimeString = formatTime(startTime);
            const endTimeString = formatTime(endTime);
            const eventName = `${event.Title} (${startTimeString} - ${endTimeString})`;
            let RequestFor = JSON.parse(event.RequestFor);
            let RecordID = RequestFor[0].RecordID;
            let Fullname = getFullNameByRecordID(RecordID)
            // Store the event name with title, start time, and end time
            events[startHour].push({
                title: event.Title,
                startTime: startTimeString,
                endTime: endTimeString,
                CreatedByName: Fullname
            });
        });
    } else if (typeof data === 'object') {
        const startTime = adjustTimeToIST(data.FromTime);
        const endTime = adjustTimeToIST(data.ToTime);
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();
        const startTimeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTimeString = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const eventName = `${data.Title} (${startTimeString} - ${endTimeString})`;
        let RequestFor = JSON.parse(data.RequestFor);
        let RecordID = RequestFor[0].RecordID;
        let Fullname = getFullNameByRecordID(RecordID)
        // Store the event name with title, start time, and end time
        events[startHour].push({
            title: data.Title,
            startTime: startTimeString,
            endTime: endTimeString,
            CreatedByName: Fullname

        });
    } else {
        console.error('Invalid data format:', data);
    }
    updateTable();
}

function adjustTimeToIST(dateString) {
    const date = new Date(dateString);
    // Adjust for Indian Standard Time (IST)
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    return date;
}

function formatTime(date) {
    const hour = date.getHours() % 12 || 12;
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${ampm}`;
}


function calculateHourDifference(startTime, endTime) {
    // Function to convert time to 24-hour format
    function convertTo24HourFormat(timeStr) {
        let [hours, minutes] = timeStr.substring(0, 5).split(":").map(Number);
        const isPM = timeStr.endsWith("PM");

        if (isPM && hours !== 12) {
            hours += 12;
        } else if (!isPM && hours === 12) {
            hours = 0;
        }
        return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
    }

    startTime = convertTo24HourFormat(startTime);
    endTime = convertTo24HourFormat(endTime);

    const startHour = parseInt(startTime.substring(0, 2), 10);
    const startMinute = parseInt(startTime.substring(3), 10);
    const endHour = parseInt(endTime.substring(0, 2), 10);
    const endMinute = parseInt(endTime.substring(3), 10);

    let differenceInHours = endHour - startHour;
    let differenceInMinutes = endMinute - startMinute;


    if (differenceInMinutes < 0) {
        differenceInHours--;
        differenceInMinutes += 60;
    }

    if (differenceInHours < 0) {
        differenceInHours += 24;
    }
    const totalDifference = differenceInHours + (differenceInMinutes / 60);

    console.log("startTime", startTime, "endTime", endTime, "differenceInHours", totalDifference)
    return totalDifference;
}


//if i want to display all event without negative time
function updateTable() {
    
    const table = document.querySelector('table');
    // Clear existing table data
    table.querySelectorAll('td:nth-child(2)').forEach(td => {
        td.textContent = '';
        td.classList.remove('event', 'highlight');
        td.rowSpan = 1;
    });

    for (let i = 0; i < events.length; i++) {
        const hour = i < 10 ? '0' + i : i;
        const eventDetails = events[i];
        if (eventDetails.length > 0) {
            eventDetails.sort((a, b) => {
                return a.startTime.localeCompare(b.startTime);
            });
            
            const row = table.querySelector(`#hour-${hour}`);
            const timeDifferences = eventDetails.map(event => calculateHourDifference(event.startTime, event.endTime));

            if (row) {
                // Clear existing content in the row
                row.innerHTML = '';
                let meeting_Time_Difference;

                timeDifferences.forEach((time, index) => {
                    meeting_Time_Difference = time;
                    const event = eventDetails[index];

                    const eventCell = document.createElement('td');
                    eventCell.textContent = `${event.title} (${event.startTime} - ${event.endTime}) by ${event.CreatedByName}`;
                    if (meeting_Time_Difference < 1) {
                        eventCell.classList.add('event', 'highlight');
                    }
                    else if (meeting_Time_Difference >= 1 && meeting_Time_Difference < 2) {
                        eventCell.classList.add('event', 'highlight');
                    } else {
                        eventCell.classList.add('event');
                    }
                    row.appendChild(eventCell);

                    console.log("Hour Difference", meeting_Time_Difference);
                    console.log("Minute Difference", meeting_Time_Difference % 1);

                    if (meeting_Time_Difference < 1) {
                        row.rowSpan = 1;
                    } else if (meeting_Time_Difference >= 1 && meeting_Time_Difference < 2) {
                        if (meeting_Time_Difference % 1 >= 0 && meeting_Time_Difference % 1 < 1) {
                            if (meeting_Time_Difference === 1) {
                                row.rowSpan = 2;
                            } else {
                                row.rowSpan = 1;
                            }
                        } else {
                            row.rowSpan = 2;
                        }
                    } else {
                        row.rowSpan = Math.ceil(meeting_Time_Difference) + 1;
                    }

                    if (eventDetails.length === 1 && row.rowSpan === 1) {
                        row.classList.add('highlight');
                        eventCell.classList.remove('highlight')
                    }
                    else if (eventDetails.length > 1 && row.rowSpan === 1) {
                        if (meeting_Time_Difference < 1 && row.rowSpan >= 1) {
                            if (row.rowSpan === 1) {
                                row.classList.add('highlight');
                            }
                            else {
                                eventCell.classList.remove('highlight')
                            }

                        }
                        else {
                            row.classList.add('event');
                        }

                    }
                    else {
                        row.classList.add('highlight', 'event');
                    }
                });


            }
        } else {
            const row = table.querySelector(`#hour-${hour}`);
            if (row) {
                row.classList.remove('highlight');
            }
        }
    }
}


