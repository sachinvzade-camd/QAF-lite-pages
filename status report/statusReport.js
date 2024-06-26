var recruiterValue = ""
var sourceValue = ""
var jobpostValue = ""
var startTime = ""
var endTime = "";
var employeeList = []
var appNameDetails;
var teamList = [];
var jobpostingList = [];
var userpermissionsList = [];
var RecruiterData;
document.getElementById("startTime").addEventListener("change", function () {
    startTime = new Date(this.value);
});
document.getElementById("endTime").addEventListener("change", function () {
    endTime = new Date(this.value);
});



var gridExpenseColumns = [
    { field: 'JobPost', displayName: 'Job Post', sequence: 1, sorting: false },
    { field: 'Candidate', displayName: 'Name', sequence: 2, sorting: false },
    { field: 'CreatedDate', displayName: 'Tracker Date', sequence: 3, sorting: true },
    { field: 'Recruiter', displayName: 'Recruiter', sequence: 4, sorting: false },
    { field: 'CurrentStatus', displayName: 'Status', sequence: 5, sorting: true },
    { field: 'Source', displayName: 'Source', sequence: 6, sorting: true },
    { field: 'ContactNumber', displayName: 'Contact Number', sequence: 7, sorting: true },
    { field: 'Email', displayName: 'Email', sequence: 8, sorting: true },
];

var expenseGrid = {
    repository: 'Job_Tracker',
    columns: [
        { field: 'JobPost', displayName: 'Job Post', sorting: false },
        { field: 'Candidate', displayName: 'Name', sorting: false },
        { field: 'CreatedDate', displayName: 'Tracker Date', sorting: true },
        { field: 'Recruiter', displayName: 'Recruiter', sorting: false },
        { field: 'CurrentStatus', displayName: 'Status', sorting: true },
        { field: 'Source', displayName: 'Source', sorting: true },
        { field: 'ContactNumber', displayName: 'Contact Number', sorting: true },
        { field: 'Email', displayName: 'Email', sorting: true },
    ],
    viewFields: ['JobPost', 'Recruiter', 'Candidate', 'CurrentStatus', 'Source', 'ContactNumber', 'Email'],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: ""
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

function startDate() {
    var currentDate = expenseGrid.currentSelectedDate;
    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return firstDay;
}

function endDate() {
    var currentDate = expenseGrid.currentSelectedDate;
    var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return lastDay;
}

function loadExpenseGrid() {
    RecruiterData = []
    let mainGridElement = document.getElementById('main-grid');
    let noGridElement = document.getElementById('no-grid');
    let exportBtnElement = document.getElementById("export")
    if (exportBtnElement) {
        exportBtnElement.disabled = false;
    }
    if (mainGridElement) {
        mainGridElement.style.display = 'block'
    }
    if (noGridElement) {
        noGridElement.style.display = "none"
    }
    let userId = getCurrentUserGuid();
    let filterGridCondition = getWhereClause();
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.Data = []
        expenseGridElement.show = true;
        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition, null, false).then((filteredExpense) => {
            if (Array.isArray(filteredExpense) && filteredExpense.length > 0) {
                RecruiterData = filteredExpense;
                expenseGridElement.Data = filteredExpense;
            } else {

                let mainGridElement = document.getElementById('main-grid');
                let noGridElement = document.getElementById('no-grid');
                if (mainGridElement) {
                    mainGridElement.style.display = 'none'
                }
                if (noGridElement) {
                    let exportBtnElement = document.getElementById("export")
                    if (exportBtnElement) {
                        exportBtnElement.disabled = true;
                    }
                    noGridElement.style.display = "block"
                }
            }
            expenseGridElement.show = false;
        });

        // Add event handlers
        expenseGridElement.addEventListener('onNextPageEvent', nextPageEvent);
        expenseGridElement.addEventListener('onPrevPageEvent', prevPageEvent);
        expenseGridElement.addEventListener('onGridSortEvent', sortEvent);
        expenseGridElement.addEventListener('onPageSizeEvent', pageSizeEvent);
    }
}

function pageSizeEvent(page) {
    expenseGrid.pageSize = page.detail.pageSize;
    loadExpenseGrid();
}

function nextPageEvent(page) {
    RecruiterData = []
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

    let filterGridCondition = getWhereClause();
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense) => {
            RecruiterData = filteredExpense;
            expenseGridElement.Data = filteredExpense;
            expenseGridElement.show = false;
        });
    }
}

function prevPageEvent(page) {
    RecruiterData = []
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

    let filterGridCondition = getWhereClause();
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense) => {
            RecruiterData = filteredExpense;
            expenseGridElement.Data = filteredExpense;
            expenseGridElement.show = false;
        });
    }
}

function sortEvent(page) {
    let filterGridCondition = getWhereClause();
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order).then((filteredExpense) => {
            expenseGridElement.Data = filteredExpense;
            expenseGridElement.show = false;
        });
    }
}

function addVendor() {
    if (window.QafPageService) {
        window.QafPageService.AddItem(expenseGrid.repository, function () {
            loadExpenseGrid();
        });
    }
}

function nextMonth(e) {
    RecruiterData = []
    //Get grid by id
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        if (window.QafService) {
            expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() + 1);
            expenseGridElement.show = true;

            let userId = getCurrentUserGuid();
            let firstDay = startDate();
            let lastDay = endDate();
            let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
            let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
            let filterFormat = expenseGrid.filter;
            filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
            filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
            filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

            let filterGridCondition = filterFormat;

            window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
                RecruiterData = filteredExpense;
                expenseGridElement.Data = filteredExpense;
                expenseGridElement.show = false;
            })
        }
    }
}

function prevMonth(e) {
    //Get grid by id
    RecruiterData = []
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        if (window.QafService) {
            expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() - 1);
            expenseGridElement.show = true;

            let userId = getCurrentUserGuid();
            let firstDay = startDate();
            let lastDay = endDate();
            let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
            let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
            let filterFormat = expenseGrid.filter;
            filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
            filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
            filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

            let filterGridCondition = filterFormat;

            window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
                RecruiterData = filteredExpense;
                expenseGridElement.Data = filteredExpense;
                expenseGridElement.show = false;
            })
        }
    }
}



function expgrid_onItemRender(cname, cvalue, row) {

    if (cvalue) {
        if (cname === 'JobPost') {
            if (cvalue && cvalue.indexOf(';#') !== -1) {
                let values = cvalue.split(';#');
                let oddArray = [];
                values.forEach((v, idx) => {
                    oddArray.push(idx);
                })
                let odds = oddArray.filter(n => n % 2);
                let returnItems = [];
                odds.forEach((d) => {
                    returnItems.push(values[d]);
                })
                return `<a href=recruitment/job-details?rid=${cvalue.split(";#")[0]} target="_blank">${returnItems.join(';')}</a> 
        <style>.row-menu{display:none}        .qaf-grid__row-item{
          width: 136px;
          word-break: break-word;
         }.qaf-grid__header-item{
          width: 136px;
         }
                                .qaf-grid__footer {
                                  border-top: 1px solid rgba(0,0,0,.12);
                                  background-color: #ffffff;
                              }
                              .qaf-grid{
                                border:none;
                                box-shadow: 1px 2px 5px;
                              }
                              .qaf-grid__header
                              {
                                background-color: #f2f2f2;
                                border-bottom: 1px solid rgba(0,0,0,.12);
                                font-size: 13px;
                                font-weight: 500 !important;
                                
                              }
                              .qaf-grid__row {
                                  font-size: 12px;
                                  font-weight: 500;
                                  background-color: #fff;
                              }
                            
                            .qaf-grid__header-item {
                              font-weight: 500 !important;
                              font-size:13px;
                              
                          }
                           .qaf-grid-page-size label {
                                  font-weight: 500;
                              }
                              .qaf-grid-page-size select {
                                  background-color: #fff;
                                  color: #333;
                              }
                              .qaf-grid__footer > button{
                                background-color: #fff;
                              }
                              .qaf-grid__footer > button > svg {
                                  
                                  fill: #333;
                              }
        
                              .qaf-grid__row-item>a{
                                color: #009ce7;
                                text-decoration: none;
                              }
                              
                            </style>`
            } else {
                let value = jobpostingList.find(a => a.RecordID === cvalue)
                return `<a href=recruitment/job-details?rid=${value.RecordID} target="_blank">${value.JobID + " - " + value.JobTitle}</a> <style>.row-menu{display:none}        .qaf-grid__row-item{
          width: 136px;
          word-break: break-word;
         }.qaf-grid__header-item{
          width: 136px;
         }</style>`
            }
        }
        if (cname === 'Candidate') {
            if (cvalue && cvalue.indexOf(';#') !== -1) {
                let values = cvalue.split(';#');
                let oddArray = [];
                values.forEach((v, idx) => {
                    oddArray.push(idx);
                })
                let odds = oddArray.filter(n => n % 2);
                let returnItems = [];
                odds.forEach((d) => {
                    returnItems.push(values[d]);
                })
                return returnItems.join(';');
            }
        }
        if (cname === 'Recruiter') {
            let recruiterID = JSON.parse(cvalue)[0].RecordID;
            let employee = employeeList.filter(emp => emp.RecordID === recruiterID);
            if (employee && employee.length > 0) {
                return employee[0].FirstName + " " + employee[0].LastName
            }
            return ""
        }
        if (cname === 'CreatedDate') {
            if (cvalue) {
                let date = new Date(cvalue);
                let formatedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                return formatedDate;
            } else {
                return ''
            }
        }

    }
    if (cvalue) {
        return cvalue;
    } else {
        return '';
    }
}






function expgrid_onRowActionEvent(eventName, row) {
    if (window.QafPageService) {
        if (eventName === 'VIEW') {
            window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function () {
                loadExpenseGrid();
            });

        } else if (eventName === 'EDIT') {
            window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function () {
                loadExpenseGrid();
            });

        } else if (eventName === 'DELETE') {
            window.QafPageService.DeleteItem(row.RecordID, function () {
                loadExpenseGrid();
            });
        }
    }
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        let date = new Date();
        let currentMonthStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let currentMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let startDate = formatDate(currentMonthStartDate)
        let EndDate = formatDate(currentMonthLastDate)

        document.getElementById('startTime').valueAsDate = new Date(startDate);
        document.getElementById('endTime').valueAsDate = new Date(EndDate);

        startTime = new Date(startDate)
        endTime = new Date(EndDate)
        let noGridElement = document.getElementById('no-grid');
        if (noGridElement) {
            noGridElement.style.display = "none"
        }
        getAppName();
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getAppName() {
    let objectName = "App_Configuration";
    let list = "RecordID,AppName,EncryptedName,Accessible,AppID"
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `AppID='6.22'`
    let orderBy = ""

    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((appDetails) => {
        if (Array.isArray(appDetails) && appDetails.length > 0) {
            appNameDetails = appDetails[0];
            getApppermission()
        }
    });
}
function getApppermission() {
    let objectName = "App_Permission";
    let list = 'RecordID,Application,Permission'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Application='${appNameDetails.AppName}')<<NG>>(Permission='Read Only')`;;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((permissions) => {
        if (Array.isArray(permissions) && permissions.length > 0) {
            getUserpermission(permissions)
        } else {
            getUserpermission(permissions)
        }

    });
}
function getUserpermission(permissions) {
    let roleID = ""
    if (permissions && permissions.length > 0) {
        roleID = permissions.map(a => a.ParentRecordID).join("'<OR>Role!='")
    }
    let objectName = "User_Permission";
    let list = 'RecordID,ProfileorTeam,AppName,Role'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `Application='Recruitment'`;
    if (roleID) {
        whereClause = `(AppName='${appNameDetails.RecordID}')<<NG>>(Role!='${roleID}')`;
    } else {
        whereClause = `AppName='${appNameDetails.RecordID}'`;
    }
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((userpermissions) => {
        debugger
        if (Array.isArray(userpermissions) && userpermissions.length > 0) {
            userpermissionsList = userpermissions
            formatPermissionUser(userpermissions)
        }
else{
    getObjectID()
    getjobposting()

}
    });
}
function formatPermissionUser(userpermissions) {
    let teamID = [];
    userpermissions.forEach(val => {
        let jsonValue = JSON.parse(val.ProfileorTeam);
        jsonValue.forEach(user => {
            if (user.UserType === 2) {
                teamID.push(user.RecordID)
            }
        })
    })

    if (teamID && teamID.length > 0) {
        this.getTeam(teamID);
    } else {
        getUserPermissionMember()
    }
}
function getTeam(teamID) {
    let teamWhereClause = teamID.join("'<OR>RecordID='");
    let objectName = "Teams";
    let list = "RecordID,TeamMembers"
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `RecordID='${teamWhereClause}'`;
    let orderBy = ""

    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((teams) => {
        if (Array.isArray(teams) && teams.length > 0) {
            teamList = teams;
            getUserPermissionMember()
        }
    });
}
function getUserPermissionMember() {
    let profileTeam = [];
    userpermissionsList.forEach(val => {
        if (val.ProfileorTeam) {
            let jsonValue = JSON.parse(val.ProfileorTeam);
            jsonValue.forEach(user => {
                if (user.UserType === 1) {
                    profileTeam.push(user.RecordID)
                }
            })
        }
    })
    let memberIds = [];
    teamList.forEach(val => {
        if (val.TeamMembers) {
            val.TeamMembers.split(";#").forEach((member, index) => {
                if (index % 2 === 0) {
                    memberIds.push(member)
                }
            })
        }
    })
    profileTeam = [...profileTeam, ...memberIds]
    let recordID = profileTeam.join("'<OR>RecordID='")
    getObjectID()
    getRecruiter(recordID)
}
function getObjectID() {
    fieldListObject = []
    window.QafService.GetObjectById('Job_Tracker').then((responses) => {
        responses[0].Fields.forEach((ele) => {
            if (ele.InternalName === "Source") {
                let sourceDropdown = document.getElementById('source');
                let options = `<option value=''>Select Source</option>`
                if (sourceDropdown) {
                    ele.Choices.split(";#").forEach(source => {
                        options += `<option value='${source}'>${source}</option>`
                    })
                    sourceDropdown.innerHTML = options;
                }
            }
        })
    })
}
function getRecruiter(recordID) {
    employeeList = []
    let objectName = "Employees";
    let list = 'FirstName,LastName'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `RecordID='${recordID}'`;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            employeeList = employees
            let recruiterDropdown = document.getElementById('recruiter');
            let options = `<option value=''>Select Recruiter</option>`
            if (recruiterDropdown) {
                employees.forEach(emp => {
                    options += `<option value=${emp.RecordID}>${emp.FirstName} ${emp.LastName}</option>`
                })
                recruiterDropdown.innerHTML = options;
            }

        }
        getjobposting()
    });
}
function getjobposting() {
    let objectName = "Job_Posting";
    let list = 'JobTitle,JobID'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobpostings) => {
        if (Array.isArray(jobpostings) && jobpostings.length > 0) {
            jobpostingList = jobpostings
            jobpostings = jobpostings.reverse()
            let jobpostDropdown = document.getElementById('jobpost');
            let options = `<option value=''>Select Job Post</option>`
            if (jobpostDropdown) {
                jobpostings.forEach(job => {
                    options += `<option value=${job.RecordID}>${job.JobTitle}</option>`
                })
                jobpostDropdown.innerHTML = options;
            }
        }
        loadExpenseGrid()

    });
}
function searchReport() {
    loadExpenseGrid();
}

function getWhereClause() {
    let whereclause = [];
    let recruiter = document.getElementById("recruiter");
    let source = document.getElementById("source");
    let jobpost = document.getElementById("jobpost");
    if (recruiter) {
        recruiterValue = recruiter.value;
    }
    if (source) {
        sourceValue = source.value;
    }
    if (jobpost) {
        jobpostValue = jobpost.value;
    }
    if (recruiterValue) {
        whereclause.push(`(Recruiter='${recruiterValue}')`)
    }
    if (sourceValue) {
        whereclause.push(`(Source='${sourceValue}')`)
    }
    if (jobpostValue) {
        whereclause.push(`(JobPost='${jobpostValue}')`)
    }
    if (startTime && endTime) {
        let startDate = `${startTime.getFullYear()}/${startTime.getMonth() + 1}/${startTime.getDate()}`;
        let endDate = `${endTime.getFullYear()}/${endTime.getMonth() + 1}/${endTime.getDate()}`;
        whereclause.push(`(CreatedDate>='${startDate}'<AND>CreatedDate<='${endDate}')`)
    }

    if (whereclause && whereclause.length > 0) {
        if (whereclause.length === 1) {
            return (whereclause[0].substring(0, whereclause[0].length - 1)).substring(1);
        }
        return whereclause.join("<<NG>>")
    }
    return ""
}

function ExportReport() {

    let data = RecruiterData;
    let csvData = [];
    let csvHeader = ["Job Post", "Name", "Tracker Date", "Recruiter", "Status", "Source", "Contact Number", "Email"].join(',');
    csvData.push(csvHeader);

    data.forEach(val => {
        let JobPost = val["JobPost"] ? val["JobPost"].split(';#')[1] : "";
        let Recruiter = getRecruiterName(val["Recruiter"])
        let Name = val["Candidate"] ? val["Candidate"].split(';#')[1] : "";
        let TrackerDate = val["CreatedDate"] ? formatedDate(val["CreatedDate"]) : "";
        let CurrentStatus = val["CurrentStatus"] ? val["CurrentStatus"] : "";
        let Source = val["Source"] ? val["Source"] : "";
        let ContactNumber = val["ContactNumber"] ? val["ContactNumber"] : "";
        let Email = val["Email"] ? val["Email"] : "";

        csvData.push([JobPost, Name, TrackerDate, Recruiter, CurrentStatus, Source, ContactNumber, Email].join(","));
    });
    let csvBody = csvData.join('\n');
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Recruiter_status_report.csv';
    hiddenElement.click();
}


function getFullNameByRecordID(RecordIDID) {
    const Employee_Data = employeeList;
    const Employee_Record = Employee_Data.find(record => record.RecordID === RecordIDID);
    if (Employee_Record) {
        const fullName = `${Employee_Record.FirstName} ${Employee_Record.LastName}`;
        return fullName;
    } else {
        return '';
    }
}

function formatedDate(Datevalue) {
    let date = new Date(Datevalue);
    let formatedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    if (formatedDate) {
        return formatedDate;
    }
    else {
        return ''
    }
}

function getRecruiterName(val) {
    
    let recruiterName = "";
    let recruiterData = val;
    if (recruiterData && recruiterData !== "undefined") {
        recruiterData = JSON.parse(recruiterData);
        if (recruiterData.length > 0) {
            recruiterName = getFullNameByRecordID(recruiterData[0].RecordID);
            return recruiterName;
        }
    } else {
        return "";
    }

}

