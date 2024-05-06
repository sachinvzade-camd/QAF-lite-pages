var recruiterValue = "";
var jobpostValue = "";
var startTime = "";
var endTime = "";
var employeeList = [];
document.getElementById("startTime").addEventListener("change", function () {
    startTime = new Date(this.value);
});
document.getElementById("endTime").addEventListener("change", function () {
    endTime = new Date(this.value);
});

let expenseGrid = {
    repository: "Job_Tracker",
    columns: [
        { field: "JobPost", displayName: "Job Post", sorting: false },
        { field: "Recruiter", displayName: "Recruiter", sorting: true },
        { field: "Candidate", displayName: "Name", sorting: false },
        { field: "CreatedDate", displayName: "Tracker Date", sorting: true },
        { field: "CurrentStatus", displayName: "Status", sorting: false },
        { field: "Source", displayName: "Source", sorting: false },
        { field: "ContactNumber", displayName: "Contact Number", sorting: false },
        { field: "Email", displayName: "Email", sorting: false },
    ],
    viewFields: [
        "JobPost",
        "Recruiter",
        "Candidate",
        "CurrentStatus",
        "Source",
        "ContactNumber",
        "Email",
    ],
    page: 1,
    pageSize: 10,
    dateFormat: "YYYY/MM/DD",
    currentSelectedDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    ),
    filter: "",
};

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

let gridExpenseColumns = [
    { field: "JobPost", displayName: "Job Post", sequence: 1, sorting: false },
    { field: "Candidate", displayName: "Name", sequence: 2, sorting: false},
    {
        field: "CreatedDate",
        displayName: "Tracker Date",
        sequence: 3,
        sorting: true,
    },
    { field: "CurrentStatus", displayName: "Status", sequence: 4, sorting: false },
    { field: "Source", displayName: "Source", sequence: 5, sorting: false },
    {
        field: "ContactNumber",
        displayName: "Contact Number",
        sequence: 6,
        sorting: false,
    },
    { field: "Email", displayName: "Email", sequence: 7, sorting: false },
];

function getCurrentUserGuid() {
    let guid = "";
    let userKey = window.localStorage.getItem("user_key");
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
    var lastDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );
    return lastDay;
}

function loadCandidateReport() {
    let mainGridElement = document.getElementById("main-grid");
    let noGridElement = document.getElementById("no-grid");
    if (mainGridElement) {
        mainGridElement.style.display = "none";
    }
    if (noGridElement) {
        noGridElement.style.display = "none";
    }
    let userId = getCurrentUserGuid();
    let filterGridCondition = getWhereClause();
    let expenseGridElement = document.querySelector("#expgrid");
    if (expenseGridElement) {
        expenseGridElement.Data = [];
        expenseGridElement.show = true;
        window.QafService.GetItems(
            expenseGrid.repository,
            expenseGrid.viewFields,
            expenseGrid.pageSize,
            expenseGrid.page,
            filterGridCondition,
            null,
            false
        ).then((filteredExpense) => {
            if (Array.isArray(filteredExpense) && filteredExpense.length > 0) {
                let mainGridElement = document.getElementById("main-grid");
                if (mainGridElement) {
                    mainGridElement.style.display = "block";
                }
                expenseGridElement.Data = filteredExpense;
            } else {
                let mainGridElement = document.getElementById("main-grid");
                let noGridElement = document.getElementById("no-grid");
                if (mainGridElement) {
                    mainGridElement.style.display = "none";
                }
                if (noGridElement) {
                    noGridElement.style.display = "block";
                }
            }
            expenseGridElement.show = false;
        });

        // Add event handlers
        expenseGridElement.addEventListener("onNextPageEvent", nextPageEvent);
        expenseGridElement.addEventListener("onPrevPageEvent", prevPageEvent);
        expenseGridElement.addEventListener("onGridSortEvent", sortEvent);
        expenseGridElement.addEventListener("onPageSizeEvent", pageSizeEvent);
    }
}

function pageSizeEvent(page) {
    expenseGrid.pageSize = page.detail.pageSize;
    loadCandidateReport();
}

function nextPageEvent(page) {
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1
        }/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1
        }/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace("{{CURRENTUSERID}}", userId);
    filterFormat = filterFormat.replace("{{STARTOFMONTH}}", startMonth);
    filterFormat = filterFormat.replace("{{ENDOFMONTH}}", endMonth);

    let filterGridCondition = getWhereClause();
    let expenseGridElement = document.querySelector("#expgrid");
    if (expenseGridElement) {
        expenseGridElement.Data=[]
        expenseGridElement.show = true;
        window.QafService.GetItems(
            expenseGrid.repository,
            expenseGrid.viewFields,
            expenseGrid.pageSize,
            page.detail.currentPage,
            filterGridCondition,
            null,
            false
        ).then((filteredExpense) => {
            expenseGridElement.Data = filteredExpense;
            expenseGridElement.show = false;
        });
    }
}

function prevPageEvent(page) {
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1
        }/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1
        }/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace("{{CURRENTUSERID}}", userId);
    filterFormat = filterFormat.replace("{{STARTOFMONTH}}", startMonth);
    filterFormat = filterFormat.replace("{{ENDOFMONTH}}", endMonth);

    let filterGridCondition = getWhereClause();
    let expenseGridElement = document.querySelector("#expgrid");
    if (expenseGridElement) {
        expenseGridElement.Data=[]
        expenseGridElement.show = true;
        window.QafService.GetItems(
            expenseGrid.repository,
            expenseGrid.viewFields,
            expenseGrid.pageSize,
            page.detail.currentPage,
            filterGridCondition,null,false
        ).then((filteredExpense) => {
            expenseGridElement.Data = filteredExpense;
            expenseGridElement.show = false;
        });
    }
}

function sortEvent(page) {
    let filterGridCondition = getWhereClause();
    let expenseGridElement = document.querySelector("#expgrid");
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.GetItems(
            expenseGrid.repository,
            expenseGrid.viewFields,
            expenseGrid.pageSize,
            1,
            filterGridCondition,
            page.detail.field,
            page.detail.order
        ).then((filteredExpense) => {
            expenseGridElement.Data = filteredExpense;
            expenseGridElement.show = false;
        });
    }
}

function nextMonth(e) {
    //Get grid by id
    let expenseGridElement = document.querySelector("#expgrid");
    if (expenseGridElement) {
        if (window.QafService) {
            expenseGrid.currentSelectedDate.setMonth(
                expenseGrid.currentSelectedDate.getMonth() + 1
            );
            expenseGridElement.show = true;

            let userId = getCurrentUserGuid();
            let firstDay = startDate();
            let lastDay = endDate();
            let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1
                }/${firstDay.getDate()}`;
            let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1
                }/${lastDay.getDate()}`;
            let filterFormat = expenseGrid.filter;
            filterFormat = filterFormat.replace("{{CURRENTUSERID}}", userId);
            filterFormat = filterFormat.replace("{{STARTOFMONTH}}", startMonth);
            filterFormat = filterFormat.replace("{{ENDOFMONTH}}", endMonth);

            let filterGridCondition = filterFormat;

            window.QafService.GetItems(
                expenseGrid.repository,
                expenseGrid.viewFields,
                expenseGrid.pageSize,
                expenseGrid.page,
                filterGridCondition,
                null,
            false
            ).then((filteredExpense) => {
                expenseGridElement.Data = filteredExpense;
                expenseGridElement.show = false;
            });
        }
    }
}

function prevMonth(e) {
    //Get grid by id
    let expenseGridElement = document.querySelector("#expgrid");
    if (expenseGridElement) {
        if (window.QafService) {
            expenseGrid.currentSelectedDate.setMonth(
                expenseGrid.currentSelectedDate.getMonth() - 1
            );
            expenseGridElement.show = true;

            let userId = getCurrentUserGuid();
            let firstDay = startDate();
            let lastDay = endDate();
            let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1
                }/${firstDay.getDate()}`;
            let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1
                }/${lastDay.getDate()}`;
            let filterFormat = expenseGrid.filter;
            filterFormat = filterFormat.replace("{{CURRENTUSERID}}", userId);
            filterFormat = filterFormat.replace("{{STARTOFMONTH}}", startMonth);
            filterFormat = filterFormat.replace("{{ENDOFMONTH}}", endMonth);

            let filterGridCondition = filterFormat;

            window.QafService.GetItems(
                expenseGrid.repository,
                expenseGrid.viewFields,
                expenseGrid.pageSize,
                expenseGrid.page,
                filterGridCondition,
                null,
            false
            ).then((filteredExpense) => {
                expenseGridElement.Data = filteredExpense;
                expenseGridElement.show = false;
            });
        }
    }
}

function expgrid_onItemRender(cname, cvalue, row) {
    if (cvalue) {
        if (cname === "JobPost") {
            if (cvalue && cvalue.indexOf(";#") !== -1) {
                let values = cvalue.split(";#");
                let oddArray = [];
                values.forEach((v, idx) => {
                    oddArray.push(idx);
                });
                let odds = oddArray.filter((n) => n % 2);
                let returnItems = [];
                odds.forEach((d) => {
                    returnItems.push(values[d]);
                });
                return `<a href=recruitment/job-details?rid=${cvalue.split(";#")[0]
                    } target="_blank">${returnItems.join(
                        ";"
                    )}</a> <style>.row-menu{display:none}        .qaf-grid__row-item{
          width: 200px;
          word-break: break-word;
         }.qaf-grid__header-item{
          width: 136px!important;
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
        
         
         </style>`;
            }
        }
        if (cname === "Candidate") {
            if (cvalue && cvalue.indexOf(";#") !== -1) {
                let values = cvalue.split(";#");
                let oddArray = [];
                values.forEach((v, idx) => {
                    oddArray.push(idx);
                });
                let odds = oddArray.filter((n) => n % 2);
                let returnItems = [];
                odds.forEach((d) => {
                    returnItems.push(values[d]);
                });
                return returnItems.join(";");
            }
        }
        if (cname === "Recruiter") {
            let recruiterID = JSON.parse(cvalue)[0].RecordID;
            let employee = employeeList.filter((emp) => emp.RecordID === recruiterID);
            if (employee && employee.length > 0) {
                return employee[0].FirstName + " " + employee[0].LastName;
            }
            return "";
        }
        if (cname === "CreatedDate") {
            if (cvalue) {
                let date = new Date(cvalue);
                let formatedDate = `${date.getDate()}/${date.getMonth() + 1
                    }/${date.getFullYear()}`;
                return formatedDate;
            } else {
                return "";
            }
        }
    }
    if (cvalue) {
        return cvalue;
    } else {
        return "";
    }
}

function expgrid_onRowActionEvent(eventName, row) {
    if (window.QafPageService) {
        if (eventName === "VIEW") {
            window.QafPageService.ViewItem(
                expenseGrid.repository,
                row.RecordID,
                function () {
                    loadCandidateReport();
                }
            );
        } else if (eventName === "EDIT") {
            window.QafPageService.EditItem(
                expenseGrid.repository,
                row.RecordID,
                function () {
                    loadCandidateReport();
                }
            );
        } else if (eventName === "DELETE") {
            window.QafPageService.DeleteItem(row.RecordID, function () {
                loadCandidateReport();
            });
        }
    }
}

let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        document.getElementById('startTime').valueAsDate = new Date();
        document.getElementById('endTime').valueAsDate = new Date();
        let mainGridElement = document.getElementById("main-grid");
        let noGridElement = document.getElementById("no-grid");
        if (mainGridElement) {
            mainGridElement.style.display = "none";
        }
        if (noGridElement) {
            noGridElement.style.display = "none";
        }
        startTime=new Date()
        endTime=new Date()
        getjobposting();
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getjobposting() {
    let objectName = "Job_Posting";
    let list = "JobTitle";
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true";
    window.QafService.GetItems(
        objectName,
        fieldList,
        pageSize,
        pageNumber,
        whereClause,
        "",
        orderBy
    ).then((jobpostings) => {
        if (Array.isArray(jobpostings) && jobpostings.length > 0) {
            jobpostings = jobpostings.reverse();
            let jobpostDropdown = document.getElementById("jobpost");
            let options = `<option value=''>Select Job Post</option>`;
            if (jobpostDropdown) {
                jobpostings.forEach((job) => {
                    options += `<option value=${job.RecordID}>${job.JobTitle}</option>`;
                });
                jobpostDropdown.innerHTML = options;
            }
        }
        loadCandidateReport();
    });
}
function searchReport() {
    loadCandidateReport();
}

function getWhereClause() {
    let whereclause = [];
    let currentUser = getCurrentUserGuid();
    let jobpost = document.getElementById("jobpost");
    if (jobpost) {
        jobpostValue = jobpost.value;
    }
    if (currentUser) {
        whereclause.push(`(Recruiter='${currentUser}')`);
    }
    if (jobpostValue) {
        whereclause.push(`(JobPost='${jobpostValue}')`);
    }
    if (startTime && endTime) {
        let startDate = `${startTime.getFullYear()}/${startTime.getMonth() + 1
            }/${startTime.getDate()}`;
        let endDate = `${endTime.getFullYear()}/${endTime.getMonth() + 1
            }/${endTime.getDate()}`;
        whereclause.push(
            `(CreatedDate>='${startDate}'<AND>CreatedDate<='${endDate}')`
        );
    }

    if (whereclause && whereclause.length > 0) {
        if (whereclause.length === 1) {
            return whereclause[0]
                .substring(0, whereclause[0].length - 1)
                .substring(1);
        }
        return whereclause.join("<<NG>>");
    }
    return "";
}