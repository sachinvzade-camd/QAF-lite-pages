var jobPosting = [];
var jobTracker = [];
var shareCandidate = []
var interviewDetailList = [];
var jobOfferList = [];
var performanceList = [];
var LeaveAuditLogList = [];
var leaveRequestList = [];
var Employee = [];

var jobTrackerforPopUP = []
var CandidateDetailList = []
var InterViewDetailsforPopUp = [];
var OfferListforPopUP = []
var currentDate = new Date();
var DateElement = document.getElementById("nevigatorDate");
var FirstDay;
var LastDay
var leaveTypeList = []

let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getEmployee()
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
    let whereClause = `IsOffboarded!='True'<OR>IsOffboarded=''`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;
        }
        getLeaveType()
        updateDateDisplay()

    });
}

function getLeaveType() {
    leaveTypeList = []
    let objectName = "Leave_Type";
    let list = 'Name'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((leaveTypes) => {
        if (Array.isArray(leaveTypes) && leaveTypes.length > 0) {
            leaveTypeList = leaveTypes
            let leaveTypeElment = document.getElementById('leaveTypeBalance');
            let options = `<option value=''>Select Leave Type</option>`
            if (leaveTypeElment) {
                leaveTypes.forEach(leave => {
                    options += `<option value=${leave.RecordID}>${leave.Name}</option>`
                })
                leaveTypeElment.innerHTML = options;
            }

        }
    });
}


function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateDateDisplay();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateDateDisplay();
}

function updateDateDisplay() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    FirstDay = moment(startDate).format('YYYY/MM/DD');
    LastDay = moment(endDate).format('YYYY/MM/DD');
    const currentMonthText = `${startDate.toLocaleString('default', { month: 'short' })}-${year}`;
    DateElement.innerHTML = currentMonthText;
    getLeaveRequest();
}
function getLeaveRequest() {
    
    let selectLeaveType = ""
    let selectedElement = document.getElementById('leaveTypeBalance')
    if (selectedElement) {
        selectLeaveType = selectedElement.value
    }
    leaveRequestList = [];
    performanceList = [];
    let objectName = "Leave_Request";
    let list = ["RecordID,LeaveType,StartDate,NumberofDays,LeaveStatus"]
    let fieldList = list.join(",");
    let orderBy = "true";
    let whereClause = ``
    const firstDay = moment(FirstDay).startOf('month').format('YYYY/MM/DD');
    const lastDay = moment(FirstDay).endOf('month').format('YYYY/MM/DD');
    whereClause = ``
    whereClause = `(StartDate>='${firstDay}'<AND>StartDate<='${lastDay}')<<NG>>(LeaveStatus='Closed'<OR>LeaveStatus='Cancellation Submitted')`
    if (selectLeaveType) {
        whereClause += `<<NG>>(LeaveType='${selectLeaveType}')`
    }
    let recordForField
    recordForField = {
        Tod: objectName,
        Ldft: fieldList,
        Ybod: orderBy,
        Ucwr: whereClause,
        Zps: 1000000,
        Rmgp: 1,
        Diac: "false",
    };

    window.QafService.Rfdf(recordForField).then((requests) => {
        if (Array.isArray(requests) && requests.length > 0) {
            
            leaveRequestList = requests
        }
        getAuditLog()
    });
}


function getAuditLog() {

    let selectLeaveType = ""
    let selectedElement = document.getElementById('leaveTypeBalance')
    if (selectedElement) {
        selectLeaveType = selectedElement.value
    }
    LeaveAuditLogList = [];
    performanceList = [];
    let objectName = "Leave_Audit_Log";
    let list = ["RecordID,EmployeeID,EmployeeName,Month,Year,LeaveType,OpeningBalance,LeaveAccrual,LeaveUsage"]
    let fieldList = list.join(",");
    let pageSize = "10000000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``
    let month = moment(FirstDay).format('M');
    let year = moment(FirstDay).format('YYYY');
    whereClause = `Month=${Number(month)}<AND>Year=${Number(year)}`
    if (selectLeaveType) {
        whereClause += `<AND>LeaveType='${selectLeaveType}'`
    }
    let recordForField
    recordForField = {
        Tod: objectName,
        Ldft: fieldList,
        Ybod: orderBy,
        Ucwr: whereClause,
        Zps: 1000000,
        Rmgp: 1,
        Diac: "false",
    };

    window.QafService.Rfdf(recordForField).then((logs) => {
        
        if (Array.isArray(logs) && logs.length > 0) {
            
            LeaveAuditLogList = logs
            let commonemp = LeaveAuditLogList.filter((v, i, a) => a.findIndex(t => t.EmployeeName === v.EmployeeName) === i)
            commonemp.forEach(emp => {
                let logs = LeaveAuditLogList.filter(log => log.EmployeeName === emp.EmployeeName);
                if (logs && logs.length > 0) {
                    logs.forEach((val, index) => {
                        
                        let usageValue = 0
                        let empGuid = val.EmployeeName ? JSON.parse(val.EmployeeName)[0].RecordID : ''
                        let userLeaveRequest = leaveRequestList.filter(a => a.LeaveType.split(";#")[0] === val.LeaveType.split(";#")[0] && empGuid === a.CreatedByGUID);

                        if (userLeaveRequest && userLeaveRequest.length > 0) {
                            usageValue = userLeaveRequest.reduce((acc, value) => acc + value.NumberofDays, 0)
                        }
                        performanceList.push({
                            EmployeeName: index === 0 ? getFullNameByRecordID(val.EmployeeName) : '',
                            EmployeeID: index === 0 ? (val.EmployeeID ? val.EmployeeID : '') : '',
                            Month: index === 0 ? (val.Month ? val.Month : "") : "",
                            Year: index === 0 ? val.Year : "",
                            LeaveType: val.LeaveType ? val.LeaveType.split(";#")[1] : "",
                            OpeningBalance: val.OpeningBalance,
                            LeaveAccrual: val.LeaveAccrual,
                            LeaveUsage: usageValue,

                        })
                    })
                }

            })
            generateReport()
        } else {
            generateReport()
        }
    });
}

function getFullNameByRecordID(emp) {
    let RequestFor = JSON.parse(emp);
    let targetRecordID = RequestFor[0].RecordID;
    const Employee_Data = Employee;
    const targetRecord = Employee_Data.find(record => record.RecordID === targetRecordID);
    if (targetRecord) {
        const fullName = `${targetRecord.FirstName} ${targetRecord.LastName}`;
        return fullName;
    } else {
        return '';
    }
}
// <th class="qaf-th">Month</th>
// <th class="qaf-th">Year</th>
// const Month = entry.Month
// const Year = entry.Year
// <td class="qaf-td">${Month}</td>
// <td class="qaf-td">${Year}</td>

function generateReport() {
    
    let TableData = ""
    TableData = performanceList;
    let TableElement = document.getElementById('intervieandhired-table');
    TableElement.innerHTML = ""
    if (TableData && TableData.length > 0) {
        const ExportButton = document.getElementById('ExportButton');
        ExportButton.classList.remove('hide');
        let tableHead = `
        <th class="qaf-th">Employee ID</th>
        <th class="qaf-th">Employee</th>
    
        <th class="qaf-th">Leave Type</th>
        <th class="qaf-th">Opening Balance</th>
        <th class="qaf-th">Leave Accrual</th>
        <th class="qaf-th">Leave Usage</th>
        
      
        `;
        let tableRow = "";
        TableData.forEach(entry => {
            const EmployeeID = entry.EmployeeID
            const EmployeeName = entry.EmployeeName

            const LeaveType = entry.LeaveType;
            const OpeningBalance = entry.OpeningBalance;
            const LeaveAccrual = entry.LeaveAccrual;
            const LeaveUsage = entry.LeaveUsage;

            tableRow += `
                <tr class="qaf-tr">
                <td class="qaf-td">${EmployeeID}</td>
                <td class="qaf-td">${EmployeeName}</td>
                <td class="qaf-td">${LeaveType}</td>
                <td class="qaf-td">${OpeningBalance}</td>
                <td class="qaf-td">${LeaveAccrual}</td>
                <td class="qaf-td">${LeaveUsage}</td>
                </tr>
            `;


        });

        let tableValue = `
                <table class="qaf-table" id="table">
                    <thead class="qaf-thead">
                        <tr class="qaf-tr">
                            ${tableHead}
                        </tr>
                    </thead>
                    <tbody class="qaf-tbody">
                        ${tableRow}
                    </tbody>
                </table>
            `;

        TableElement.innerHTML = tableValue;
        HideLoader()
    }
    else {
        const ExportButton = document.getElementById('ExportButton');
        ExportButton.classList.add('hide');
        let tableHead = `
        <th class="qaf-th">Employee ID</th>
        <th class="qaf-th">Employee</th>
        <th class="qaf-th">Leave Type</th>
        <th class="qaf-th">Opening Balance</th>
        <th class="qaf-th">Leave Accrual</th>
        <th class="qaf-th">Leave Usage</th>`
            ;

        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="6" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
        let tableHTML = `
                <table class="qaf-table" id="table">
                    <thead class="qaf-thead">
                        <tr class="qaf-tr">
                            ${tableHead}
                        </tr>
                     </thead>
                     <tbody class="qaf-tbody">
                        ${startRow}
                            ${tableRow}
                         ${endRow}
                    </tbody>
                </table>
        `;
        HideLoader()
        TableElement.innerHTML = tableHTML;
    }
}

function ExportReport() {
    let data = performanceList;
    let csvData = [];
    let csvHeader = ["Employee ID", "Employee", "Leave Type", "Opening Balance", "Leave Accrual", "Leave Usage"].join(',');
    csvData.push(csvHeader);
    data.forEach(val => {
        let EmployeeID = val["EmployeeID"] ? val["EmployeeID"] : "";
        let EmployeeName = val["EmployeeName"] ? val["EmployeeName"] : "";
        let LeaveType = val["LeaveType"] ? val["LeaveType"] : ""
        let OpeningBalance = val["OpeningBalance"];
        let LeaveAccrual = val["LeaveAccrual"];
        let LeaveUsage = val["LeaveUsage"];

        csvData.push([EmployeeID, EmployeeName, LeaveType, OpeningBalance, LeaveAccrual, LeaveUsage].join(","));
    });
    let csvBody = csvData.join('\n');
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Leave Balance.csv';
    hiddenElement.click();
}


function ShowLoader() {
    let pageDisabledElement = document.getElementById('pageDisabled');
    if (pageDisabledElement) {
        pageDisabledElement.classList.add('page-disabled')
    }
    let isloadingElement = document.getElementById('isloading');
    if (isloadingElement) {
        isloadingElement.style.display = 'block'
    }
}

function HideLoader() {
    let pageDisabledElement = document.getElementById('pageDisabled');
    let isloadingElement = document.getElementById('isloading');
    if (pageDisabledElement) {
        pageDisabledElement.classList.remove('page-disabled')
    }
    if (isloadingElement) {
        isloadingElement.style.display = 'none'
    }
}
