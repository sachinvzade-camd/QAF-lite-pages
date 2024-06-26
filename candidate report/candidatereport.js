
var recruiterValue = "";
var jobpostValue = "";
var startTime = "";
var endTime = "";
var employeeList = [];
var MyCandidateData = [];
var myVendors = [];
var vendorRecordID;
var isLP=true;
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        document.getElementById('startTime').valueAsDate = new Date();
        document.getElementById('endTime').valueAsDate = new Date();
        startTime = new Date()
        endTime = new Date()
        getjobposting()
        isUserFullControll()
        clearInterval(qafServiceLoaded);
    }

}, 10);


function isUserFullControll() {
    let User = getCurrentUser();
    if (User && User.LP) {
        let isLP37 = User.LP.split(',').includes("37-3");
        let isLP11 = User.LP.split(',').includes("11");
        if (isLP37 || isLP11) {
            let myVendorGrid = document.getElementById('myvendorGrid');
            if (myVendorGrid) {
                myVendorGrid.style.display = 'block';
                getmyVendors()
            }

        }
    }
}

document.getElementById("startTime").addEventListener("change", function () {
    startTime = new Date(this.value);
});


document.getElementById("endTime").addEventListener("change", function () {
    endTime = new Date(this.value);
});


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

function getWhereClause() {
    let whereclause = [];
    let currentUser = getCurrentUser();
    let jobpost = document.getElementById("jobpost");
    if (jobpost) {
        jobpostValue = jobpost.value;
    }
    if (currentUser) {
        whereclause.push(`(Recruiter='${currentUser.EmployeeGUID}')`);
    }
    if (jobpostValue) {
        whereclause.push(`(JobPost='${jobpostValue}')`);
    }
    if (startTime && endTime) {

        let startDate = moment(startTime).format('YYYY/MM/DD');
        let endDate = moment(endTime).format('YYYY/MM/DD');
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

function getjobposting() {
    let objectName = "Job_Posting";
    let list = "JobTitle";
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobpostings) => {
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
        getMyCandidate()
    });
}

function searchReport() {
    getMyCandidate()
}

function getMyCandidate() {
    ShowLoader()
    MyCandidateData = []
    let objectName = "Job_Tracker";
    let list = 'Candidate,JobPost,Recruiter,CurrentStatus,Email,Source,ContactNumber';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = getWhereClause();
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((vendors) => {
        if (Array.isArray(vendors) && vendors.length > 0) {
            MyCandidateData = vendors;
            mycandidategenerateReport();
        }
        else {
            mycandidategenerateReport();
        }

    });
}

function mycandidategenerateReport() {
    TableData = MyCandidateData;
    const ExportButton = document.getElementById('export');
    let reportContainerElement = document.getElementById('mycandidate-Container')
    reportContainerElement.innerHTML = ""
    if (TableData && TableData.length > 0) {
        ExportButton.classList.remove('hide');

        let tableHead = `
        <th class="qaf-th">Job Post</th>
        <th class="qaf-th">Name</th>
        <th class="qaf-th">Tracker Date</th>
        <th class="qaf-th">Status</th>
        <th class="qaf-th">Source</th>
        <th class="qaf-th">Contact Number</th>
        <th class="qaf-th">Email</th>
        `;
        let tableRow = "";

        TableData.forEach(entry => {

            const jobPost = entry.JobPost.split(";#")[1];
            const candidate = entry.Candidate.split(";#")[1];
            const trackerDate = moment(entry.CreatedDate).format('DD/MM/YYYY');
            const currentStatus = entry.CurrentStatus;
            const source = entry.Source;
            const contactNumber = entry.ContactNumber;
            const email = entry.Email;

            tableRow += `
                <tr class="qaf-tr">
                    <td class="qaf-td"><a href=recruitment/job-details?rid=${entry.JobPost.split(";#")[0]} target="_blank">${jobPost ? jobPost : ""}</a></td>
                    <td class="qaf-td">${candidate ? candidate : ""}</td>
                    <td class="qaf-td">${trackerDate ? trackerDate : ""}</td>
                    <td class="qaf-td">${currentStatus ? currentStatus : ""}</td>
                     <td class="qaf-td">${source ? source : ""}</td>
                    <td class="qaf-td">${contactNumber ? contactNumber : ""}</td>
                    <td class="qaf-td">${email ? email : ""}</td>
                    
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

        reportContainerElement.innerHTML = tableValue;
        HideLoader();
    }
    else {
        ExportButton.classList.add('hide');
        let tableHead = `
       <th class="qaf-th">Job Post</th>
        <th class="qaf-th">Name</th>
        <th class="qaf-th">Tracker Date</th>
        <th class="qaf-th">Status</th>
        <th class="qaf-th">Source</th>
        <th class="qaf-th">Contact Number</th>
        <th class="qaf-th">Email</th> `;
        let tableBody = '';
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
        reportContainerElement.innerHTML = tableHTML;
        HideLoader();
    }
}

function ExportReport() {
    let data = MyCandidateData;
    let csvData = [];
    let csvHeader = ["Job Post", "Name", "Tracker Date", "Status", "Source", "Contact Number", "Email"].join(',');
    csvData.push(csvHeader);

    data.forEach(val => {
        let JobPost = val["JobPost"] ? val["JobPost"].split(';#')[1] : "";
        let Name = val["Candidate"] ? val["Candidate"].split(';#')[1] : "";
        let TrackerDate = val["CreatedDate"] ? formatedDate(val["CreatedDate"]) : "";
        let CurrentStatus = val["CurrentStatus"] ? val["CurrentStatus"] : "";
        let Source = val["Source"] ? val["Source"] : "";
        let ContactNumber = val["ContactNumber"] ? val["ContactNumber"] : "";
        let Email = val["Email"] ? val["Email"] : "";

        csvData.push([JobPost, Name, TrackerDate, CurrentStatus, Source, ContactNumber, Email].join(","));
    });
    let csvBody = csvData.join('\n');
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'My Candidate Report.csv';
    hiddenElement.click();
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

function getmyVendors() {
    ShowLoader()
    let user = getCurrentUser();
    myVendors = []
    let objectName = "R_Vendor";
    let list = 'RecordID,FirstName,LastName,Email,CompanyName,MobileNumber,AssignTo';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `AssignTo='${user.EmployeeGUID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((vendors) => {
        if (Array.isArray(vendors) && vendors.length > 0) {
            myVendors = vendors;
            generateReport();
        }
        else {
            generateReport();
        }

    });
}

function generateReport() {
    TableData = myVendors.reverse();
    // const ExportButton = document.getElementById('ExportButton');
    let reportContainerElement = document.getElementById('myvendor-Container')
    reportContainerElement.innerHTML = ""
    if (TableData && TableData.length > 0) {
        // ExportButton.classList.remove('hide');
        let tableHead = `
        <th class="qaf-th">Vendor</th>
        <th class="qaf-th">Email</th>
        <th class="qaf-th">Company Name</th>
        <th class="qaf-th">Mobile Number</th>
        `;
        let tableRow = "";

        TableData.forEach(entry => {
            const vendor = entry.FirstName + " " + entry.LastName;
            const email = entry.Email;
            const companyName = entry.CompanyName;
            const mobileNumber = entry.MobileNumber;

            tableRow += `
                <tr class="qaf-tr">
                    <td class="qaf-td">${vendor ? vendor : ""}</td>
                    <td class="qaf-td">${email ? email : ""}</td>
                    <td class="qaf-td">${companyName ? companyName : ""}</td>
                    <td class="qaf-td">${mobileNumber ? mobileNumber : ""}</td>
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

        reportContainerElement.innerHTML = tableValue;
        HideLoader();
    }
    else {
        // ExportButton.classList.add('hide');
        let tableHead = `
        <th class="qaf-th">Vendor</th>
        <th class="qaf-th">Email</th>
        <th class="qaf-th">Company Name</th>
        <th class="qaf-th">Mobile Number</th>  `;
        let tableBody = '';
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
        reportContainerElement.innerHTML = tableHTML;
        HideLoader();
    }
}

// function ExportReport() {
//     let data = myVendors;
//     let csvData = [];
//     let csvHeader = ["Vendor", "Email","CompanyName","MobileNumber"].join(',');
//     csvData.push(csvHeader);
//     data.forEach(val => {
//         vendor=""
//         let FirstName = val["Vendor"] ? val["Vendor"].split(';#')[1] : "";
//         let LastName = val["JobPost"] ? val["JobPost"].split(';#')[1] : "";
//         let Email = val["Email"] ? val["Email"] : "";
//         let CompanyName = val["CompanyName"] ? val["CompanyName"].split(';#')[1] : "";
//         let MobileNumber = val["MobileNumber"] ? val["MobileNumber"].split(';#')[1] : "";
//         vendor=FirstName+" "+LastName;

//         csvData.push([Vendor, Email, CompanyName,MobileNumber].join(","));
//     });
//     let csvBody = csvData.join('\n');
//     var hiddenElement = document.createElement('a');
//     hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvBody);
//     hiddenElement.target = '_blank';
//     hiddenElement.download = 'My Vendor Report.csv';
//     hiddenElement.click();
// }
