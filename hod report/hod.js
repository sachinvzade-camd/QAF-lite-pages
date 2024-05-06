var TableData;
var departmentList=[];
var jobPostingList=[];
var proposeCandidateList=[];
var jobOfferList=[];
var isOffboarded = false
var formated = 'YYYY/MM/DD';
var todaysDate
let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
    todaysDate= moment().format(formated);
        getDepartment()
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getDepartment() {
    departmentList = []
    let objectName = "Department";
    let list = 'RecordID,Name,DepartmentHead';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((departments) => {
        if (Array.isArray(departments) && departments.length > 0) {
            departmentList = departments.filter(dep=>dep.DepartmentHead);
        }
        getJobPosting();
    });
}


function getJobPosting() {
    let whereClause = "";
    let whereClauseArray = [];
    whereClauseArray.push(`(PostingExpiresOn>='${this.todaysDate}')`)
    if(departmentList&&departmentList.length>0){
        let departmentId = departmentList.map(dep => dep.RecordID).join("'<OR>Department='");
        whereClauseArray.push(`(Department='${departmentId}')`)
    }
    if (whereClauseArray && whereClauseArray.length > 0) {
        if (whereClauseArray.length === 1) {
            whereClause= (whereClauseArray[0].substring(0, whereClauseArray[0].length - 1)).substring(1);
        }
        whereClause= whereClauseArray.join("<<NG>>")
      }
    jobPostingList = []
    let objectName = "Job_Posting";
    let list = 'Department,NumberofVacancies,PostingExpiresOn';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((posts) => {
        if (Array.isArray(posts) && posts.length > 0) {
            jobPostingList = posts;
        }
        getProposeCandidate();

    });
}
function getProposeCandidate() {
    const firstDay = moment().startOf('month').format('YYYY/MM/DD');
    const lastDay = moment().endOf('month').format('YYYY/MM/DD');

    let whereClause = ``
    let whereClauseArray = [];
    whereClauseArray.push(`(PropositionDate>='${firstDay}'<AND>PropositionDate<='${lastDay}')`)
    if (departmentList && departmentList.length > 0) {
        let departmentId = departmentList.map(dep => dep.DepartmentHead.split(";#")[0]).join("'<OR>SelectProposeApprover='");
        whereClauseArray.push(`(SelectProposeApprover='${departmentId}')`)
    }
    if (whereClauseArray && whereClauseArray.length > 0) {
        if (whereClauseArray.length === 1) {
            whereClause = (whereClauseArray[0].substring(0, whereClauseArray[0].length - 1)).substring(1);
        }
        whereClause = whereClauseArray.join("<<NG>>")
    }


    proposeCandidateList = []
    let objectName = "Propose_Candidate";
    let list = 'JobPost,SelectProposeApprover,PropositionDate';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((proposes) => {
        if (Array.isArray(proposes) && proposes.length > 0) {
            proposeCandidateList = proposes;
        }
        getJobOffer()
    });
}

function getJobOffer() {
    const firstDay = moment().startOf('month').format('YYYY/MM/DD');
    const lastDay = moment().endOf('month').format('YYYY/MM/DD');
    let whereClause = ``
    let whereClauseArray = [];
    whereClauseArray.push(`(OfferDate>='${firstDay}'<AND>OfferDate<='${lastDay}')`)
    if (departmentList && departmentList.length > 0) {
        let departmentId = departmentList.map(dep => dep.RecordID).join("'<OR>Department='");
        whereClauseArray.push(`(Department='${departmentId}')`)
    }
    if (whereClauseArray && whereClauseArray.length > 0) {
        if (whereClauseArray.length === 1) {
            whereClause = (whereClauseArray[0].substring(0, whereClauseArray[0].length - 1)).substring(1);
        }
        whereClause = whereClauseArray.join("<<NG>>")
    }
   
    jobOfferList = []
    let objectName = "Job_Offer";
    let list = 'Department,OfferDate';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";

    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((offers) => {
        if (Array.isArray(offers) && offers.length > 0) {
            jobOfferList = offers;
        }

        generateReport()
    });
}
function generateReport(){
    let hodreportList=[]
    departmentList.forEach(dep=>{
        let totaljobPost=jobPostingList.filter(post=>post.Department.split(";#")[0]===dep.RecordID);
        let totaljobcount=0
        if(totaljobPost&&totaljobPost.length>0){
             totaljobcount=totaljobPost.reduce((acc, value) => acc + value.NumberofVacancies, 0);
        }
        let todaypropse=0
        let monthpropse=0
        let todayjobOffer=0
        let monthjobOffer=0
        let curremtTime = moment();
        const firstDay = moment().startOf('month').format('YYYY/MM/DD');
        const lastDay = moment().endOf('month').format('YYYY/MM/DD');
        if(proposeCandidateList&&proposeCandidateList.length>0){
            let approverProposeList=proposeCandidateList.filter(pro=>userOrGroupFieldRecordID(pro.SelectProposeApprover)===userOrGroupFieldRecordID(dep.DepartmentHead))
          
            if(approverProposeList&&approverProposeList.length>0){
                let todaypropseList=approverProposeList.filter(ap=>moment(curremtTime).isSame(moment(ap.PropositionDate), 'date'))
                todaypropse=todaypropseList.length
                let monthpropseList=approverProposeList.filter(ap=>moment(ap.PropositionDate).isBetween(firstDay, lastDay,'date','[]'))
                monthpropse=monthpropseList.length
            }
           
        }

        if(jobOfferList&&jobOfferList.length>0){
            let departmentJobOfferList=jobOfferList.filter(offer=>userOrGroupFieldRecordID(offer.Department)===(dep.RecordID))
            if(departmentJobOfferList&&departmentJobOfferList.length>0){
                let todayjobOfferList=departmentJobOfferList.filter(ap=>moment(curremtTime).isSame(moment(ap.OfferDate), 'date'))
                todayjobOffer=todayjobOfferList.length
                let monthjobOfferList=departmentJobOfferList.filter(ap=>moment(ap.OfferDate).isBetween(firstDay, lastDay,'date','[]'))
                monthjobOffer=monthjobOfferList.length
            }
        }
        hodreportList.push({
            Name:dep.DepartmentHead.split(";#")[1],
            OpenPostion:totaljobcount,
            TodayPropse:todaypropse,
            CurrentMonthPropose:monthpropse,
            TodayJobOffer:todayjobOffer,
            CurrentMonthJobOffer:monthjobOffer
        })
    })
    generateTable(hodreportList);

}
function userOrGroupFieldRecordID(id) {
    if (id) {
      if (id && id.includes("[{")) {
        return (JSON.parse(id))[0].RecordID;
      }
      else {
        return id && id.includes(";#") ? id.split(";#")[0] : id;
      }
    }
  }
function findEmployeeNameFromSummary(attendanceSummary, employees) {
    let tableData = [];

    attendanceSummary.forEach(summary => {
        const employeeRecordID = JSON.parse(summary.EmployeeName)[0].RecordID;
        const matchingEmployee = employees.find(employee => employee.RecordID === employeeRecordID);
        if (matchingEmployee) {
            const { FirstName, LastName, IsOffboarded } = matchingEmployee;
            tableData.push({ ...summary, FirstName, LastName, IsOffboarded });
        }
    });

    return tableData;
}




function sortData(data) {
    return data.slice().sort((a, b) => {
        if (a.FirstName && b.FirstName) {
            const firstNameA = a.FirstName.toLowerCase();
            const firstNameB = b.FirstName.toLowerCase();

            if (firstNameA < firstNameB) {
                return -1;
            }
            if (firstNameA > firstNameB) {
                return 1;
            }
            return 0;
        } else if (!a.FirstName && b.FirstName) {

            return 1;
        } else if (a.FirstName && !b.FirstName) {

            return -1;
        } else {

            return 0;
        }
    });
}


function generateTable(TableData) {
    document.getElementById('table-container').innerHTML = ""

    if (TableData && TableData.length > 0) {
        let tableHead = `
        <th class="qaf-th">Employee Name</th>
        <th class="qaf-th">Present Days</th>
        <th class="qaf-th">Absent Days</th>
        `;
        let tableRow = "";

        TableData.forEach(entry => {
            const employeeName = entry.FirstName +" "+ entry.LastName;
            const PresentDays = entry.PresentDay;
            const AbsentDays = entry.AbsentDays
            tableRow += `
                <tr class="qaf-tr">
                    <td class="qaf-td">${employeeName}</td>
                    <td class="qaf-td">${PresentDays}</td>
                    <td class="qaf-td">${AbsentDays}</td>
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

        document.getElementById('table-container').innerHTML = tableValue;
    }
    else {

        let tableHead = `
                        <th class="qaf-th">Employee Name</th>
                        <th class="qaf-th">Present Days</th>
                        <th class="qaf-th">Absent Days</th>  `;
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="3" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
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
        document.getElementById('table-container').innerHTML = tableHTML;
    }
}


function download_csv() {
    
    let data = TableData;
    let csvData = [];
    data.forEach(val => {
        let EmployeeName = (val["FirstName"] ? val["FirstName"] : "") + " " + (val["LastName"] ? val["LastName"] : "");
        let PresentDay = val["PresentDay"] ? val["PresentDay"] : 0;
        let AbsentDays = val["AbsentDays"] ? val["AbsentDays"] : 0;

        csvData.push([EmployeeName, PresentDay, AbsentDays].join(","));
    });

    let csvBody = csvData.join('\n');


    let csvHeader = ["Employee Name", "Present Days", "Absent Days"].join(',') + '\n';

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Attendance Summary' + '.csv';
    hiddenElement.click();
}

