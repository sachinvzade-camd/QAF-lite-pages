var user = ""
var jobPostingList = []
var trackerData = [];
var companySetting = []
var jobsToVendorData = [];
var vendorDetails = []
var apURL = ""
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        apURL = window.localStorage.getItem('ma')
        getlocalVendor()
        getCompanySetting()
        removeVendorkey()
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getlocalVendor() {
    let userKey = window.localStorage.getItem('R_Vendor_KEY');
    if (userKey) {
        LoadMainPage()
        CallVendor()
    } else {
        window.location.href = `https://${apURL}/pages/public/vendorlogin`
    }
}

function getCurrentVendor() {
    let userDetails = '';
    let userKey = window.localStorage.getItem('R_Vendor_KEY');
    if (userKey) {
        let user = JSON.parse(userKey);
        userDetails = user;
    }
    return userDetails;
}

function CallVendor() {
    let vendor = getCurrentVendor()
    vendorDetails = []
    let objectName = "R_Vendor";
    let list = "Email,LoginKey,LastName,FirstName,CompanyName";
    let fieldList = list.split(",")
    let orderBy = "";
    let whereClause = `RecordID='${vendor.RecordID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((vendors) => {
        if (Array.isArray(vendors) && vendors.length > 0) {
            vendorDetails = vendors[0]
        }
        rendorEmployeeName()
        getJobsTo_Vendor()
    })
}


function rendorEmployeeName() {
    let vendor = vendorDetails
    let firstName = capitalizeFirstLetter(vendor.FirstName)
    let lastName = capitalizeFirstLetter(vendor.LastName)
    let userName = document.getElementById("userName")
    let profileName = document.getElementById("profile-initials")

    if (userName) {
        userName.innerHTML = firstName + " " + lastName
    }
    if (profileName) {
        profileName.innerHTML = getInitials(firstName, lastName)
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getJobsTo_Vendor() {
    
    jobsToVendorData = []
    let objectName = "Jobs_To_Vendor";
    let list = 'RecordID,JobPost,Vendor,PublishToAll';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `Vendor='${vendorDetails.RecordID}'<OR>PublishToAll='True'`;
    let RecordIDs = ""
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((vendors) => {
        if (Array.isArray(vendors) && vendors.length > 0) {
            
            jobsToVendorData = vendors;
            let RecordIdsArray = jobsToVendorData.map(item => item.JobPost ? item.JobPost.split(';#')[0] : "");
            RecordIDs = `RecordID='${RecordIdsArray.join("'<OR> RecordID='")}'`;
            getjobdetailsList(RecordIDs)
        }
        else {
            getjobdetailsList(RecordIDs)
        }

    });
}

function getjobdetailsList(RecordIDs) {
    let RecordID = RecordIDs
    let objectName = "Job_Posting";
    let list = "JobID,JobTitle,JobLevel,RecordID,Location,RequiredSkills,EmployeeType,Designation,RelevantExperience,Salary,YearsofExperience,PostingExpiresOn,ShareToVendor,JobTemplate";
    let orderBy = "";
    let currentDate = moment(new Date()).format('YYYY/MM/DD');
    let whereClause
    if (RecordID) {
        whereClause = `(PostingExpiresOn>='${currentDate}')<<NG>>(${RecordIDs})`;
    }
    else {
        whereClause = `(PostingExpiresOn>='${currentDate}')<<NG>>(RecordID="")`;
    }
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    const myContent = document.getElementById("job-cards");
    let html = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((settings) => {
        if (Array.isArray(settings) && settings.length > 0) {
            let propertiesToSplit = ["Location", "Designation", "RequiredSkills", "JobLevel"];
            let updatedJob = splitIdentifiers(settings, propertiesToSplit);
            updatedJob.forEach(job => {
                html += `       
                        <div class="col-md-4 job-card">
                            <div class="card card-box">
                                <div class="card-body">
                                        <a class="btn btn-link" href="https://${apURL}/pages/public/vendorjobdetail?id=${job.RecordID}"><p class="card-text">${job.JobTitle}</p></a>
                                        <div class="job-deatils">
                                        <li><em>Job ID:</em>&nbsp; <span>${job.JobID}</span></li>
                                            <li><em>Experience:</em>&nbsp; <span>${job.YearsofExperience ? job.YearsofExperience : "0"}&nbspYear</span> 
                                            <span>${job.Salary ? `|&nbsp;&nbsp${job.Salary}` : ""}</span></li>
                                            <li>
                                            <li><em>Location:</em>&nbsp; <span>${job.Location ? job.Location : ""}</span></li>
                                            <li><em>Job Role:</em>&nbsp; <span>${job.JobLevel ? job.JobLevel : ""}</span></li>
                                            <li>
                                            <li> <em>Skill:</em> <span>${job.RequiredSkills ? job.RequiredSkills : ""}</span></li>
                                            </li>
                                            <li><em>Employment Type:</em>&nbsp; <span>${job.EmployeeType ? job.EmployeeType : ""}</span></li>
                                        </div>
                                        <div class="view-detail-div">
                                        <a class="btn btn-link" href="https://${apURL}/pages/public/vendorjobdetail?id=${job.RecordID}">View Details</a>
                                        </div>
                                </div>
                            </div>
                        </div>
                        `
            });
            myContent.innerHTML = html;
        }
        else {
            html += `
              <div class="nodata">No Jobs Found</div>`
        }
        myContent.innerHTML = html;

    })
};

function getInitials(firstName, LastName) {
    if (!firstName && !LastName) {
        return "No Name";
    } else {
        var firstInitial = firstName ? firstName.charAt(0) : "";
        var lastInitial = LastName ? LastName.charAt(0) : "";
        // Return the initials
        return firstInitial + lastInitial;

    }
}

function splitIdentifiers(arrayOfObjects, propertiesToSplit) {
    let updatedArray = arrayOfObjects.map(obj => ({ ...obj }));
    updatedArray = updatedArray.map(obj => {
        propertiesToSplit.forEach(property => {
            if (obj && obj.hasOwnProperty(property) && obj[property] !== null && obj[property] !== undefined && typeof obj[property] === 'string') {
                let valuesArray = obj[property].split(';#').filter(Boolean);
                obj[property] = valuesArray.filter((value, index) => index % 2 !== 0);
            }
        });

        return obj;
    });

    return updatedArray;
}

function currentOpening() {
    let currentOpening = document.getElementById("current-opening")
    let myCandidates = document.getElementById("my-candidates")
    if (currentOpening) {
        currentOpening.style.display = 'flex'
    }
    if (myCandidates) {
        myCandidates.style.display = 'none'
    }
    getJobsTo_Vendor();
}

function viewMyCandidate() {
    let currentOpening = document.getElementById("current-opening")
    let myCandidates = document.getElementById("my-candidates")
    if (currentOpening) {
        currentOpening.style.display = 'none'
    }
    if (myCandidates) {
        myCandidates.style.display = 'block'
    }
    getjobTracker()
}

function getjobTracker() {
    let vendor = getCurrentVendor()
    trackerData = []
    let objectName = "Job_Tracker";
    let list = 'Candidate,Vendor,JobPost,CurrentStatus,CurrentRole,Email,TotalExperience,USAccountingExperience,QuickbooksExperience,TeamHandlingExperience,Resume,FinalStatus,HighestQualification,ContactNumber,HWTestTargetDate,RejectionReason,HWTestExtensionReason';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `Vendor='${vendor.RecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobs) => {
        if (Array.isArray(jobs) && jobs.length > 0) {
            trackerData = jobs;
            const RecordIdsArray = trackerData.map(item => item.JobPost.split(';#')[0]);
            const whereClause = `RecordID='${RecordIdsArray.join("'<OR> RecordID='")}'`;
            getjobPosting(whereClause);

        }
        else {
            generateReport();
        }

    });
}


function getjobPosting(WhereClause) {
    jobPostingList = []
    let objectName = "Job_Posting";
    let list = 'RecordID,JobLevel';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = WhereClause;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((joblist) => {
        if (Array.isArray(joblist) && joblist.length > 0) {

            jobPostingList = joblist;
            generateReport();
        }
    });
}


function generateReport() {
    let TableData = trackerData.reverse();
    let reportContainerElement = document.getElementById('reportContainer')
    reportContainerElement.innerHTML = ""
    if (TableData && TableData.length > 0) {
        let tableHead = `
        
        <th class="qaf-th">Job Post</th>
        <th class="qaf-th">Candidate</th>
        <th class="qaf-th">Email</th>
        <th class="qaf-th">Current Status</th>
        <th class="qaf-th">Applied Role</th>
        <th class="qaf-th">Highest Qualification</th>
        <th class="qaf-th">Total Experience</th>
        <th class="qaf-th">Resume</th>
        <th class="qaf-th">Final Status</th>
        <th class="qaf-th">HW Test Target Date</th>
        <th class="qaf-th">Rejection Reason</th>
        <th class="qaf-th">HW Test Extension Reason</th>
        <th class="qaf-th">Shared Date</th>
        `;
        let tableRow = "";

        TableData.forEach(entry => {
            let jobLevel = "";
            let jobRecord = jobPostingList.filter(val => val.RecordID === entry.JobPost.split(";#")[0]);
            if (jobRecord && jobRecord.length > 0) {
                jobLevel = jobRecord[0].JobLevel.split(";#")[1];
            }
            const jobPost = entry.JobPost ? entry.JobPost.split(";#")[1] : "";
            const candidate = entry.Candidate ? entry.Candidate.split(";#")[1] : "";
            const email = entry.Email;
            const CurrentStatus = entry.CurrentStatus;
            const HighestQualification = entry.HighestQualification ? entry.HighestQualification.split(";#")[1] : "";
            const TotalExperience = entry.TotalExperience;
            const Resume = entry.Resume ? JSON.parse(entry.Resume)[0].displayName : "";
            const FinalStatus = entry.FinalStatus;
            const HWTestTargetDate = entry.HWTestTargetDate;
            const RejectionReason = entry.RejectionReason;
            const HWTestExtensionReason = entry.HWTestExtensionReason;
            const sharedDate = moment(entry.CreatedDate).format("D/M/YYYY");

            tableRow += `
                <tr class="qaf-tr">
                    <td class="qaf-td"><a>${jobPost ? jobPost : ""}</a></td>
                    <td class="qaf-td">${candidate ? candidate : ""}</td>
                    <td class="qaf-td">${email ? email : ""}</td>
                    <td class="qaf-td">${CurrentStatus ? CurrentStatus : ""}</td>
                    <td class="qaf-td">${jobLevel ? jobLevel : ""}</td>
                    <td class="qaf-td">${HighestQualification ? HighestQualification : ""}</td>
                    <td class="qaf-td">${TotalExperience ? TotalExperience : "0"}</td>
                    <td class="qaf-td"><a href="${downloadResume(entry.Resume)}">${Resume ? Resume : ""}</a></td>
                    <td class="qaf-td">${FinalStatus ? FinalStatus : ""}</td>
                    <td class="qaf-td">${HWTestTargetDate ? HWTestTargetDate : ""}</td>
                    <td class="qaf-td">${RejectionReason ? RejectionReason : ""}</td>
                    <td class="qaf-td">${HWTestExtensionReason ? HWTestExtensionReason : ""}</td>
                    <td class="qaf-td">${sharedDate ? sharedDate : ""}</td>


                  
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

    }
    else {
        let tableHead = `
        <th class="qaf-th no-record-th">Job Post</th>
        <th class="qaf-th no-record-th">Candidate</th>
        <th class="qaf-th no-record-th">Email</th>
        <th class="qaf-th no-record-th">Current Status</th>
        <th class="qaf-th no-record-th">Applied Role</th>
        <th class="qaf-th no-record-th">Highest Qualification</th>
        <th class="qaf-th no-record-th">Total Experience</th>
        <th class="qaf-th no-record-th">Resume</th>
        <th class="qaf-th no-record-th">Final Status</th>
        <th class="qaf-th no-record-th">HW Test Target Date</th>
        <th class="qaf-th no-record-th">Rejection Reason</th>
        <th class="qaf-th no-record-th">HW Test Extension Reason</th>
        <th class="qaf-th no-record-th">Shared Date</th>
        `;
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        //let tableRow = `<td colspan="13" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
        let tableHTML = `
                <table class="qaf-table" id="table">
                    <thead class="qaf-thead">
                        <tr class="qaf-tr">
                            ${tableHead}
                        </tr>
                     </thead>
                     <tbody class="qaf-tbody">
                        ${startRow}
                           
                         ${endRow}
                    </tbody>
                </table>
        `;
        reportContainerElement.innerHTML = tableHTML
        let noRecordDiv = document.createElement('div');
        noRecordDiv.className = 'recordNo';
        noRecordDiv.id = 'NoRecord';
        let span = document.createElement('span');
        span.textContent = 'No Record Found';
        noRecordDiv.appendChild(span);
        reportContainerElement.appendChild(noRecordDiv);

    }
}

function getCompanySetting() {
    companySetting = [];
    let objectName = "Company_Settings";
    let list = 'RecordID,Title,State,Country,City,Logo';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((settings) => {
        if (Array.isArray(settings) && settings.length > 0) {
            companySetting = settings[0]
            setImageSrc()
        }
    });
}

function setImageSrc() {
    let imageUrl = downloadResume(companySetting.Logo)
    const imageElement = document.getElementById('company-logo');
    imageElement.src = imageUrl;
}



function downloadResume(url) {
    return window.location.origin + "/Attachment/downloadfile?fileUrl=" + encodeURIComponent(getURLFromJson((url)))
}

function getURLFromJson(values) {
    if (values) {
        if (values.includes('link')) {
            if (IsJsonString(values)) {
                let sampleval = JSON.parse(values)
                return sampleval && sampleval[0].link ? sampleval[0].link : "";
            } else {
                return values;
            }
        }
        else {
            return values;
        }
    }
    else {
        return '';
    }
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function removeVendorkey() {
    setTimeout(function () {
        localStorage.removeItem('R_Vendor_KEY');
        window.location.href = `https://${apURL}/pages/public/vendorlogin`;
    }, 1800000);
}

function LoadMainPage() {
    const mainpageElement = document.getElementById("mainpage");
    const html = `
       <header>
            <div class="section1">
                <div>
                    <div class="img-content">
                        <img src="" id="company-logo" width="30px" height="30px" />
                    </div>
                </div>
            </div>
            <div class="section2">
                <div>
                    <span>Quick App Flow</span>
                </div>
            </div>
        </header>
        <div class="navbar-main">
            <div class="header-container">
                <div class="profile_photo no-image">
                    <span class="profile-name" id="profile-initials"></span>
                </div>
                <div class="me-autok">
                    <div class="welcom-profile">
                        <span class="nav-link-name" >Welcome&nbsp;<span id="userName"></span></span>
                    </div>
                </div>
                <div class="buttons-tab">
                    <div class="current_opening">
                        <div class="btn-tab" onclick="currentOpening()">
                            <div class="font-icon">
                                <i aria-hidden="true" class="fa fa-handshake-o"></i>
                            </div>
                            <button class="button-right">Current Opening</button>
                        </div>
                    </div>
                    <div class="myCandidates">
                        <div class="btn-tab" onclick="viewMyCandidate()">
                            <div class="font-icon">
                                <i aria-hidden="true" class="fa fa-users"></i>
                            </div>
                            <button class="button-right">My Candidates</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    mainpageElement.innerHTML = html;
}