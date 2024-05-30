var jobPosting = [];
var jobTracker = [];
var shareCandidate = []
var interviewDetailList = [];
var jobOfferList = [];
var performanceList = [];
var LeaveAuditLogList = [];
var Employee = [];

var jobTrackerforPopUP = []
var CandidateDetailList = []
var InterViewDetailsforPopUp = [];
var OfferListforPopUP = []
var currentDate = new Date();
var DateElement = document.getElementById("nevigatorDate");
var FirstDay;
var LastDay
var leaveTypeList=[]

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

function getLeaveType(){
    leaveTypeList=[]
    let objectName = "Leave_Type";
    let list = 'Name'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((leaveTypes) => {
        if (Array.isArray(leaveTypes) && leaveTypes.length > 0) {
            leaveTypeList=leaveTypes
            let leaveTypeElment=document.getElementById('leaveTypeBalance');
            let options=`<option value=''>Select Leave Type</option>`
            if(leaveTypeElment){
                leaveTypes.forEach(leave=>{
                options+= `<option value=${leave.RecordID}>${leave.Name}</option>`
              })
              leaveTypeElment.innerHTML=options;
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
    getAuditLog();
}

function getAuditLog() {
    
    let selectLeaveType=""
    let selectedElement=document.getElementById('leaveTypeBalance')
    if(selectedElement){
        selectLeaveType=selectedElement.value
    }
    LeaveAuditLogList = [];
    performanceList = [];
    let objectName = "Leave_Audit_Log";
    let list = ["RecordID,EmployeeName,Month,Year,LeaveType,OpeningBalance,LeaveAccrual,LeaveUsage"]
    let fieldList = list.join(",");
    let pageSize = "10000000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``
    let month= moment(FirstDay).format('M');
    let year= moment(FirstDay).format('YYYY');
     whereClause = `Month=${Number(month)}<AND>Year=${Number(year)}`
     if(selectLeaveType){
        whereClause+=`<AND>LeaveType='${selectLeaveType}'`
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
            let commonemp=LeaveAuditLogList.filter((v,i,a)=>a.findIndex(t=>t.EmployeeName===v.EmployeeName)===i)
            commonemp.forEach(emp=>{
                let logs=LeaveAuditLogList.filter(log=>log.EmployeeName===emp.EmployeeName);
                if(logs&&logs.length>0){
                    logs.forEach((val,index)=>{
                        performanceList.push({
                             EmployeeName :index===0?getFullNameByRecordID(val.EmployeeName):'',
                             Month :index===0?(val.Month ? val.Month : ""):"",
                             Year :index===0?val.Year:"",
                             LeaveType:val.LeaveType?val.LeaveType.split(";#")[1]:"",
                            OpeningBalance :val.OpeningBalance,
                            LeaveAccrual :val.LeaveAccrual,
                            LeaveUsage :val.LeaveUsage,
                
                        })
                    })
                }

            })


         

            generateReport()
        }else{
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


function generateReport() {
    let TableData = performanceList;
    let TableElement = document.getElementById('intervieandhired-table');
    TableElement.innerHTML = ""
    if (TableData && TableData.length > 0) {
        const ExportButton = document.getElementById('ExportButton');
        ExportButton.classList.remove('hide');
        let tableHead = `
        <th class="qaf-th">Employee</th>
        <th class="qaf-th">Month</th>
        <th class="qaf-th">Year</th>
        <th class="qaf-th">Leave Type</th>
        <th class="qaf-th">Opening Balance</th>
        <th class="qaf-th">Leave Accrual</th>
        <th class="qaf-th">Leave Usage</th>
        
      
        `;
        let tableRow = "";
        TableData.forEach(entry => {
            const EmployeeName = entry.EmployeeName
            const Month = entry.Month ? entry.Month : "";
            const Year = entry.Year;
            const LeaveType = entry.LeaveType;
            const OpeningBalance = entry.OpeningBalance;
            const LeaveAccrual = entry.LeaveAccrual;
            const LeaveUsage = entry.LeaveUsage;

            tableRow += `
                <tr class="qaf-tr">
                <td class="qaf-td">${EmployeeName}</td>
                <td class="qaf-td">${Month}</td>
                <td class="qaf-td">${Year}</td>
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
        <th class="qaf-th">Employee</th>
        <th class="qaf-th">Month</th>
        <th class="qaf-th">Year</th>
        <th class="qaf-th">Leave Type</th>
        <th class="qaf-th">Opening Balance</th>
        <th class="qaf-th">Leave Accrual</th>
        <th class="qaf-th">Leave Usage</th>`
        ;

        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="7" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
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
    let csvHeader = ["Employee", "Month", "Month", "Leave Type", "Opening Balance","Leave Accrual","Leave Usage"].join(',');
    csvData.push(csvHeader);
    data.forEach(val => {
        let EmployeeName = val["EmployeeName"] ? val["EmployeeName"] : "";
        let Month = val["Month"] ? val["Month"] : ""
        let Year = val["Year"] ? val["Year"] : ""
        let LeaveType = val["LeaveType"] ? val["LeaveType"] : ""
        let OpeningBalance = val["OpeningBalance"] ? val["OpeningBalance"] : ""
        let LeaveAccrual = val["LeaveAccrual"] ? val["LeaveAccrual"] : ""
        let LeaveUsage = val["LeaveUsage"] ? val["LeaveUsage"] : ""

        csvData.push([EmployeeName, Month, Year, LeaveType, OpeningBalance,LeaveAccrual,LeaveUsage].join(","));
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


function AddForm(RecordID, TableName) { 
    let popUp = document.getElementById("popupForm");
    if (popUp) {
        popUp.style.display = 'block';
        addCssforscroll()
        if (TableName.toLowerCase() === 'InterviewScheduled'.toLowerCase()) {
            let tableTitle = document.getElementById("tableTitle");
            tableTitle.textContent = "Interview Scheduled"
            getInterViewDetailsForPoppUP(RecordID, TableName)

        }
        else if (TableName.toLowerCase() === 'Shortlisted'.toLowerCase()) {
            let tableTitle = document.getElementById("tableTitle");
            tableTitle.textContent = "Shortlisted Candidates"
            getjobTrackerForPoppUP(RecordID, TableName)


        }
        else {
            getJobOfferForPoppUP(RecordID, TableName);
        }
    }
}

function CloseForm() {
    let popUp = document.getElementById("popupForm");
    if (popUp) {
        let TableElement = document.getElementById('popupTable');
        TableElement.innerHTML = ""
        popUp.style.display = 'none';
        removeCss()

    }
}

function getjobTrackerForPoppUP(RecordID, TableName) {
    jobTrackerforPopUP = []
    let objectName = "Job_Tracker";
    let list = 'RecordID,Candidate,TotalExperience,ContactNumber,Skills,ShortList,JobPost';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `(CreatedDate>='${FirstDay}'<AND>CreatedDate<='${LastDay}')<<NG>>(JobPost='${RecordID}')`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((tracker) => {
        if (Array.isArray(tracker) && tracker.length > 0) {
            jobTrackerforPopUP = tracker;
            const RecordIdsArray = jobTrackerforPopUP.map(item => item.Candidate.split(';#')[0]);
            const whereClause = `RecordID='${RecordIdsArray.join("'<OR> RecordID='")}'`;
            getCandidateDetails(whereClause);

        }
        else {
            LoadjobTrackerDataInTable();
        }

    });

}

function getCandidateDetails(whereClause) {
    CandidateDetailList = []
    let objectName = "Candidate";
    let list = 'CandidateID,FirstName,LastName,CurrentLocation,Skill,Mobile,Email,YearsofExperience,Gender,Presentsalary,Expectedsalary,AttachResume,RecordID';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((candidates) => {
        if (Array.isArray(candidates) && candidates.length > 0) {
            CandidateDetailList = candidates;
            LoadjobTrackerDataInTable();
        }
        else {
            LoadjobTrackerDataInTable();
        }

    });
}

function LoadjobTrackerDataInTable() {
    let TableData = jobTrackerforPopUP;
    let TableElement = document.getElementById('popupTable');
    TableElement.innerHTML = ""
    if (TableData && TableData.length > 0) {
        let tableHead = `
        <th class="qaf-th">Name </th>
        <th class="qaf-th">Gender</th>
        <th class="qaf-th">Contact Number </th>
        <th class="qaf-th">Email</th>
        <th class="qaf-th">Experience </th>
        <th class="qaf-th">Current salary</th>
        <th class="qaf-th">Expected salary </th>

        `;
        let tableRow = "";

        TableData.forEach(entry => {
            
            let CandidateGender = "";
            let CandidateMobile = "";
            let candidateEmail = "";
            let CandidateExpectedSalary = "";
            let CandidatePresentSalary = "";
            let candidateExperience = 0;

            let CandidateRecord = CandidateDetailList.filter(val => val.RecordID === entry.Candidate.split(";#")[0]);
            if (CandidateRecord && CandidateRecord.length > 0) {
                
                let record = CandidateRecord[0];
                CandidateGender = record.Gender;
                CandidateMobile = record.Mobile;
                candidateEmail = record.Email;
                CandidateExpectedSalary = record.Expectedsalary;
                CandidatePresentSalary = record.Presentsalary;
                candidateExperience = record.YearsofExperience;
            }

            const Name = entry.Candidate ? entry.Candidate.split(";#")[1] : "";
            const Gender = CandidateGender ? CandidateGender : "";
            const Mobile = CandidateMobile ? CandidateMobile : "";
            const Email = candidateEmail ? candidateEmail : "";
            const YearsofExperience = candidateExperience ? candidateExperience : 0;
            const Presentsalary = CandidatePresentSalary ? CandidatePresentSalary : "";
            const Expectedsalary = CandidateExpectedSalary ? CandidateExpectedSalary : "";
            tableRow += `
                <tr class="qaf-tr">
                <td class="qaf-td">${Name}</td>
                <td class="qaf-td">${Gender}</td>
                <td class="qaf-td">${Mobile}</td>
                <td class="qaf-td">${Email}</td>
                <td class="qaf-td">${YearsofExperience}</td>
                <td class="qaf-td">${Presentsalary}</td>
                <td class="qaf-td">${Expectedsalary}</td>
           
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
    }
    else {
        let tableHead = `
        <th class="qaf-th">Name </th>
        <th class="qaf-th">Gender</th>
        <th class="qaf-th">Contact Number </th>
        <th class="qaf-th">Email</th>
        <th class="qaf-th">Experience </th>
        <th class="qaf-th">Current salary</th>
        <th class="qaf-th">Expected salary </th> `;

        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="7" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
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
        TableElement.innerHTML = tableHTML;
    }
}


function getInterViewDetailsForPoppUP(Id, TableName) {
    // 
    InterViewDetailsforPopUp = []
    let objectName = "Interview_Detail";
    let list = 'RecordID,Candidate,AppliedForJob,JobID,Interviewer,InterviewStartDate,Status,InterviewRound,InterviewStatus';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `(CreatedDate>='${FirstDay}'<AND>CreatedDate<='${LastDay}')<<NG>>(AppliedForJob='${Id.split(";#")[0]}')`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((interviewlist) => {
        if (Array.isArray(interviewlist) && interviewlist.length > 0) {
            InterViewDetailsforPopUp = interviewlist;

        }
        LoadInterviewDataInTable();
    });
}

function LoadInterviewDataInTable() {
    let TableData = InterViewDetailsforPopUp;
    let TableElement = document.getElementById('popupTable');
    TableElement.innerHTML = ""
    if (TableData && TableData.length > 0) {

        let tableHead = `
        <th class="qaf-th">Candidate </th>
        <th class="qaf-th">Applied For Job</th>
        <th class="qaf-th">Interview Start Date</th>
        <th class="qaf-th">Status</th>
        <th class="qaf-th">interview Round</th>
        `;
        let tableRow = "";

        TableData.forEach(entry => {
            const Candidate = entry.Candidate ? entry.Candidate.split(";#")[1] : "";
            const jobAppliedFor = entry.AppliedForJob ? entry.AppliedForJob.split(";#")[1] : "";
            const interviewDate = entry.InterviewStartDate ? formatRepoDateTime(entry.InterviewStartDate) : "";
            const Status = entry.InterviewRound ? entry.InterviewRound : "";
            const interviewRound = entry.InterviewRound ? entry.InterviewRound : "";
            tableRow += `
                <tr class="qaf-tr">
                <td class="qaf-td">${Candidate}</td>
                <td class="qaf-td">${jobAppliedFor}</td>
                <td class="qaf-td">${interviewDate}</td>
                <td class="qaf-td">${Status}</td>
                <td class="qaf-td">${interviewRound}</td>
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
    }
    else {
        let tableHead = `
        <th class="qaf-th">Candidate </th>
        <th class="qaf-th">Applied For Job</th>
        <th class="qaf-th">Interview Start Date</th>
        <th class="qaf-th">Status</th>
        <th class="qaf-th">interview Round</th> `;

        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="5" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
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
        TableElement.innerHTML = tableHTML;
    }
}



function getJobOfferForPoppUP(RecordID, TableName) {
    let tableTitle = document.getElementById("tableTitle");
    OfferListforPopUP = []
    let objectName = "Job_Offer";
    let list = 'RecordID,Candidate,JoiningDate,JobAppliedFor,IsOnboarded,OfferDate';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = '';
    if (TableName.toLowerCase() === 'Hired'.toLowerCase()) {

        tableTitle.textContent = "Hired"
        whereClause = `(CreatedDate>='${FirstDay}'<AND>CreatedDate<='${LastDay}')<<NG>>(JobAppliedFor='${RecordID}')<<NG>>(IsOnboarded='True')`
    }
    else {
        whereClause = `(CreatedDate>='${FirstDay}'<AND>CreatedDate<='${LastDay}')<<NG>>(JobAppliedFor='${RecordID}')`
        tableTitle.textContent = "Offer Release"
    }
    // let whereClause = `RecordID='35ca58a5-b456-4f0a-8f10-0254ab94abfc'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((offerlist) => {
        if (Array.isArray(offerlist) && offerlist.length > 0) {
            OfferListforPopUP = offerlist;

        }
        LoadDataInTable();
    });
}

function LoadDataInTable() {
    let TableData = OfferListforPopUP;
    let TableElement = document.getElementById('popupTable');
    TableElement.innerHTML = ""
    if (TableData && TableData.length > 0) {
        let tableHead = `
        <th class="qaf-th">Candidate </th>
        <th class="qaf-th">Job Applied For</th>
        <th class="qaf-th">Joining Date</th>
        <th class="qaf-th">IsOnboarded</th>
        `;
        let tableRow = "";

        TableData.forEach(entry => {
            const Candidate = entry.Candidate ? entry.Candidate.split(";#")[1] : "";
            const JobAppliedFor = entry.JobAppliedFor ? entry.JobAppliedFor.split(";#")[1] : "";
            const JoiningDate = entry.JoiningDate ? formatRepoDateTime(entry.JoiningDate) : "";
            const IsOnboarded = entry.IsOnboarded ? entry.IsOnboarded : "";


            tableRow += `
                <tr class="qaf-tr">
                <td class="qaf-td">${Candidate}</td>
                <td class="qaf-td">${JobAppliedFor}</td>
                <td class="qaf-td">${JoiningDate}</td>
                <td class="qaf-td">${IsOnboarded}</td>
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
    }
    else {
        let tableHead = `
        <th class="qaf-th">Candidate </th>
        <th class="qaf-th">Job Applied For</th>
        <th class="qaf-th">Joining Date</th>
        <th class="qaf-th">IsOnboarded</th> `;

        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="4" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
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
        TableElement.innerHTML = tableHTML;
    }
}

function addCssforscroll() {
    var element = document.querySelector("body");
    element.classList.add("hide-y-scroll");
}
function removeCss() {
    var element = document.querySelector("body");
    element.classList.remove("hide-y-scroll");
}

function formatRepoDateTime(inputDate) {
    const dateTimeUTC = new Date(inputDate + "Z");
    const dateTimeIST = new Date(dateTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = dateTimeIST.getDate().toString().padStart(2, '0');
    const month = (dateTimeIST.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = dateTimeIST.getFullYear();
    let hours = dateTimeIST.getHours();
    const minutes = dateTimeIST.getMinutes();
    const seconds = dateTimeIST.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    const fullDate = `${day}/${month}/${year} ${formattedTime}`;
    return fullDate;
}