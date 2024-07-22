
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
let recordID = urlParams.get("id");
var jobLevel;
var candidateRecordID = ""
var trackerData = [];
var jobPostingList = [];
var companySetting = [];
var jobTittle = ""
var employeeType = ""
var jobLocation = ""
var YearofExperiance = ""
var vendorDetails = []
var jobTemplateID = "";
var candidateFields = "";
var tracketFields = "";
var vendorCompany = ""
var defaultRecruiter = ""
var candidateJobpost = ""
var candidatevendor = ""
var Employee = []
var apURL = ""
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        apURL = window.localStorage.getItem('ma')
        setBackLink()
        isVendorPresentInCache()
        getJobDetailsList()
        getEmployee()
        removeVendorkey()
        clearInterval(qafServiceLoaded);
    }
}, 10);


function setBackLink() {
    let linkElement = document.getElementById('backlink');
    if (linkElement) {
        linkElement.href =`https://${apURL}/pages/public/vendorportal`;
    }
}


function isVendorPresentInCache() {
    let userKey = window.localStorage.getItem('R_Vendor_KEY');
    if (userKey) {
        getCompanySetting()
        CallVendor()
    } else {
        window.location.href = `https://${apURL}/pages/public/vendorlogin`;
    }
}

function removeVendorkey() {
    setTimeout(function () {
        localStorage.removeItem('R_Vendor_KEY');
        window.location.href = `https://${apURL}/pages/public/vendorlogin`;
    }, 1800000);
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
    let list = "Email,LoginKey,LastName,FirstName,CompanyName,AssignTo";
    let fieldList = list.split(",")
    let orderBy = "";
    let whereClause = `RecordID='${vendor.RecordID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((vendors) => {
        if (Array.isArray(vendors) && vendors.length > 0) {

            vendorDetails = vendors[0]
            vendorCompany = vendorDetails.CompanyName
            candidatevendor = vendorDetails.RecordID + ";#" + vendorDetails.CompanyName
        }
        getjobTracker()
    })
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



function getJobDetailsList() {
    const myContent = document.getElementById("jobdeatail-container");
    let objectName = "Job_Posting";
    let list = "RecordID,JobID,JobTitle,JobLevel,Location,RequiredSkills,JobTemplate,EmployeeType,Designation,RelevantExperience,Salary,JobResponsibilities,YearsofExperience,JobRole,DefaultRecruiter,WebsiteJobDetails";
    let orderBy = "";
    let whereClause = `RecordID='${recordID}'`;
    let fieldList = list.split(";#")
    let pageSize = "20000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobdescriptionList) => {
        if (Array.isArray(jobdescriptionList) && jobdescriptionList.length > 0) {
            let propertiesToSplit = ["Location", "Designation", "RequiredSkills"];
            let newJob = splitIdentifiers(jobdescriptionList, propertiesToSplit);
            let job = newJob[0];
            jobTittle = job.JobTitle
            employeeType = job.EmployeeType
            jobLocation = job.Location
            YearofExperiance = job.YearsofExperience
            jobTemplateID = job.JobTemplate.split(";#")[0];
            defaultRecruiter = job.DefaultRecruiter;
            candidateJobpost = job.RecordID + ";#" + job.JobID + "-" + job.JobTitle
            rendorDetails();
            let html = `       
                   <div class="col-lg-8 job-description p-b-0" >
                        <div class="job-list-div">
                            <h4><b>Job Description</b></h4>
                            <h5><b>Job Post-</b>&nbsp;<span id="jobPost"></span>${job.JobTitle ? job.JobTitle : ""}</h5>
                            <h5><b>Experience-</b>&nbsp; <span id="experience">${job.YearsofExperience ? `${job.YearsofExperience} Year` : "0 Year"}</span></h5>
                            <h5><b>Salary-</b>&nbsp;<span id="jobSalary">${job.Salary ? `&nbsp;&nbsp;${job.Salary}` : ""}</span></h5>
                            <h5><b>Location-</b>&nbsp;<span id="job_Location">${job.Location ? job.Location : ""}</span></h5>
                            <h5><b>Required Skills-</b>&nbsp;<span id="jobSkill">${job.RequiredSkills ? job.RequiredSkills : ""}</span></h5>
                            <div class="job-objective">
                                <h5><b>Objective of this Role</b></h5>
                                <p id="jobObjective">${job.WebsiteJobDetails ? job.WebsiteJobDetails : ""}</p>

                            </div>
                        </div>
                    </div>`
                ;
            myContent.innerHTML = html;
        }
        getjobProfileTemplate()
    })
}

function getjobProfileTemplate() {

    candidateFields = "";
    let objectName = "Job_Profile_Template";
    let list = "CandidateField,TrackerField";
    let fieldList = list.split(",")
    let orderBy = "";
    let whereClause = `RecordID='${jobTemplateID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((templates) => {
        if (Array.isArray(templates) && templates.length > 0) {

            let jobTemplate = templates[0]
            candidateFields = getCandidateField(jobTemplate);
            tracketFields = getTrackerField(jobTemplate);

        }
    })
}


function rendorDetails() {
    let employeeTypeElement = document.getElementById("employeeType")
    let jobLocationElement = document.getElementById("jobLocation")
    let YearofExperianceElement = document.getElementById("YearofExperiance")
    let jobTitleElement = document.getElementById("jobTitle")

    if (jobTitleElement) {
        jobTitleElement.innerHTML = jobTittle
    }
    if (employeeType) {
        if (employeeTypeElement) {
            employeeTypeElement.innerHTML = `${employeeType ? `${employeeType}` : ""}`
        }
    }
    if (jobLocation && jobLocation.length > 0) {
        if (employeeType) {
            if (jobLocationElement) {
                jobLocationElement.innerHTML = `${jobLocation ? `&nbsp|&nbsp${jobLocation}` : ""}`
            }
        } else {
            if (jobLocationElement) {
                jobLocationElement.innerHTML = `${jobLocation ? `${jobLocation}` : ""}`
            }
        }

    }
    if (YearofExperiance) {
        if ((jobLocation && jobLocation.length > 0) || employeeType) {
            if (YearofExperianceElement) {
                YearofExperianceElement.innerHTML = `${YearofExperiance ? `&nbsp|&nbsp${YearofExperiance}&nbspYear Experience` : ""}`
            }
        }
        else {
            if (YearofExperianceElement) {
                YearofExperianceElement.innerHTML = `${YearofExperiance ? `${YearofExperiance}&nbspYear Experience` : ""}`
            }
        }

    }
}

function getjobTracker() {

    trackerData = []
    let objectName = "Job_Tracker";
    let list = 'Candidate,Vendor,JobPost,CurrentStatus,CurrentRole,Email,TotalExperience,USAccountingExperience,QuickbooksExperience,TeamHandlingExperience,Resume,FinalStatus,HighestQualification,ContactNumber,HWTestTargetDate,RejectionReason,HWTestExtensionReason';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `(Vendor='${vendorDetails.RecordID}')<<NG>>(JobPost='${recordID}')`;
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
            let jobPostRecord = jobPostingList.filter(val => val.RecordID === recordID);
            if (jobPostRecord && jobPostRecord.length > 0) {
                jobLevel = jobPostRecord[0].JobLevel.split(";#")[1];
            }
            generateReport();
        }
    });
}



function generateReport() {

    let TableData = trackerData.sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate));;
    let reportContainerElement = document.getElementById('reportContainer')
    reportContainerElement.innerHTML = ""
    if (TableData && TableData.length > 0) {
        let tableHead = `
        <th class="qaf-th action-head"></th>
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
                <td class="qaf-td action-cell">
                        <button class="action-btn" onclick="toggleActionButtons(this,'${entry.RecordID}')">
                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </button>
                    </td>
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
        let tableRow = `<td colspan="13" class="qaf-td" ></td>`;
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

{/* <div class='no-record'>No Record Found</div> */ }

function toggleActionButtons(button, recordID) {
    candidateRecordID = recordID;
    const actionButtons = button.nextElementSibling;
    const allActionButtons = document.querySelectorAll('.action-buttons');
    allActionButtons.forEach(btn => {
        if (btn !== actionButtons) {
            btn.style.display = 'none';
        }
    });
    if (actionButtons) {
        if (actionButtons.style.display === 'block') {
            actionButtons.style.display = 'none';
        } else {
            actionButtons.style.display = 'block';
        }
    }
}

window.onclick = function (event) {
    if (!(event.target.classList.contains('fa-ellipsis-v') || event.target.classList.contains('action-btn'))) {
        document.getElementById("menuId").innerHTML = ``
    } else {
        document.getElementById("menuId").innerHTML = `<div class="action-buttons" id="actionsButtons"  style="top: ${event.pageY - 170}px;left: ${event.pageX - 50}px;">
         <button class="edit-btn" onclick="EditRecord('${candidateRecordID}')"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</button>
    </div>`
    }
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

function getCandidateField(templateRecord) {
    let responses = JSON.parse(templateRecord.CandidateField);
    if (responses && responses.length > 0) {
        let fields = responses.map(a => a.InternalName)
        return fields
    }
    return ""
}

function getEmployee() {
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,IsOffboarded';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `IsOffboarded!='True'<OR>IsOffboarded=''`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;
        }
    });
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



function addCandidate() {
    // console.log("Default Recruiter", defaultRecruiter);
    // console.log("Candidate Fields", candidateFields.sort());
    // console.log("Recruiter Fields", tracketFields.sort());
    // console.log("Candidate Vendor",candidatevendor)
    let repository = "Candidate";
    let fieldsList = candidateFields;
    let fieldsValue = [];
    let excludeFromForm = ['ReferredByEmployee'];
    let fields = [];
    let fieldsDoNotdiaply = ["AgencyName", "Source", "OtherSkills", 'Recruiter', 'ReferredByEmployee', 'CandidateID'];
    // console.log("fields", fieldsList)
    fieldsList.forEach(val => {

        if (val === 'Source') {
            fieldsValue.push({ fieldName: val, fieldValue: "Agency" });

        }
        else if (val === 'AgencyName') {
            fieldsValue.push({ fieldName: val, fieldValue: vendorDetails.RecordID + ";#" + vendorDetails.CompanyName });
        }
        else if (val === 'Recruiter') {
            if (vendorDetails && vendorDetails.RecordID) {
                let assignToList = vendorDetails.AssignTo ? JSON.parse(vendorDetails.AssignTo) : '';
                let userList = [];
                if (assignToList && assignToList.length > 0) {
                    assignToList.forEach(val => {
                        let id = val.RecordID;
                        let fullName = getFullNameByRecordID(id);
                        userList.push(`${id};#${fullName}`);
                    });
                }
                fieldsValue.push({ fieldName: val, fieldValue: userList.join(";#") });
            }
            else {
                if (defaultRecruiter) {
                    let fullName = vendorDetails.FirstName + " " + vendorDetails.LastName
                    let id = userOrGroupFieldRecordID(defaultRecruiter)
                    fieldsValue.push({ fieldName: val, fieldValue: `${id};#${fullName}` })
                }
            }
        } else {
            fieldsValue.push({ fieldName: val, fieldValue: null });
        }
    });

    fields = fieldsList.filter(objOne => {
        return !fieldsDoNotdiaply.some(objTwo => {
            return objOne === objTwo;
        });
    });

    let fieldNotRequired = ["PercentageinPostGraduation", "PercentageinPostGraduation", "OtherSkills", "Designation", "CurrentRole", "Company", "LinkedinLink", "FacebookLink", "TwitterLink", "GooglePlusLink", "PhotoUrl", "Street1", "Street2", "Pincode", "District", "Country", "CityTown", "MaritalStatus", "Gender", "DescribedYourSelfin5Lines", "PreferredLocation", "Religion", "Nationality", "DateofBirth", "IsServingNoticePeriod", "CandidateID","Recruiter","CandidateDocuments"]

    // let fieldNotRequired = ["PercentageinPostGraduation", "PercentageinGraduation", "OtherSkills", "Designation", "CurrentRole", "Company", "LinkedinLink", "FacebookLink", "TwitterLink", "GooglePlusLink", "PhotoUrl", "Street1", "Street2", "Pincode", "District", "Country", "CityTown", "MaritalStatus", "Gender", "DescribedYourSelfin5Lines", "PreferredLocation", "Religion", "Nationality", "DateofBirth", "IsServingNoticePeriod", "CurrentLocation", "ReasonforJobChange", "CommunicationSkilloutof5", "YearsofExperience", "RelevantExperience", "Expectedsalary", "Presentsalary", "NoticePeriod", "MISReports", "LateWorking", "ExcelRating", "ClientVisit", "ZohoRating", "TallyRating", "Skill", "GSTTDSReturns", "Percentagein12th", "Percentagein10th", "ProfessionalCourse", "HighestQualification", "AttachResume", "CandidateID"];

    let requiredFormField = [];
    requiredFormField = fieldsList.filter(objOne => {
        return !fieldNotRequired.some(objTwo => {
            return objOne === objTwo;
        });
    });

    if (window.QafPageService) {
        window.QafPageService.AddItem(repository, function (response) {
            candidateResponseID = response
            getCandidate(candidateResponseID)

        }, fields, fieldsValue, null, null, fieldsDoNotdiaply, excludeFromForm, null, null, null, null, null, null, requiredFormField);
    }
}

var candidateResponseID = ""
function EditRecord(RecordID) {
    let fieldsList = tracketFields;
    let fields = [];
    let fieldsDoNotdiaply = ["Source", "Vendor", "CurrentStatus", "FinalStatus", "Feedback", "Remarks", "CommunicationSkilloutof5", "HWTestTargetDate", "RejectionReason", "HWTestExtensionReason", "IsExtensionRequest", "ExtensionExpiryDate", "ReferredByEmployee", "OtherSkills", "Recruiter", 'JobPost', 'PSCHRpt', 'TECHRpt', 'QBFeedback'];
    fields = fieldsList.filter(function (objOne) {
        return !fieldsDoNotdiaply.some(function (objTwo) {
            return objOne === objTwo;
        });
    });

    let fieldNotRequired = ["PercentageinPostGraduation", "PercentageinPostGraduation", "OtherSkills", "Designation", "CurrentRole", "Company", "Date", "NextAvailableDate", "IsServingNoticePeriod"];
    let requiredFormField = [];
    requiredFormField = fieldsList.filter(function (objOne) {
        return !fieldNotRequired.some(function (objTwo) {
            return objOne === objTwo;
        });
    });

    let readonlyField = ["NextAvailableDate"];

    if (window.QafPageService) {
        window.QafPageService.EditItem("Job_Tracker", RecordID, function () {
        
            getObjectID(RecordID);
            getjobTracker();
        }, fields, null, null, null, null, null, null, null, null, null, readonlyField, null, requiredFormField);
    }
}



function getObjectID(RecordID) {

    fieldListObject = []
    window.QafService.GetObjectById('Job_Tracker').then((responses) => {
    
        responses[0].Fields.forEach((ele) => {
            fieldListObject.push(ele.InternalName)
        })
        getRecordFormTracker(RecordID, fieldListObject);
    })
}


function getRecordFormTracker(jobRecordID,fieldListObject) {
    let objectName = "Job_Tracker";
    let list = fieldListObject.join(",");
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${jobRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((val) => {
        if (Array.isArray(val) && val.length > 0) {
            let tracker = val[0];
            tracker['FirstName'] = tracker.Candidate.split(";#")[1].split(" ")[0];
            tracker['LastName'] = tracker.Candidate.split(";#")[1].split(" ")[1];
            tracker['CandidateID'] = tracker.Candidate ? tracker.Candidate.split(";#")[0] : '';
            tracker['Mobile']=tracker.ContactNumber;
            tracker['IsTracker'] = "true"
            save(tracker, 'Edit_Temp_Candidate')
        }
    });
}

function getTrackerField(templateRecord) {
    if (templateRecord) {
        let responses = JSON.parse(templateRecord.TrackerField);
        if (responses && responses.Candidate && responses.Candidate.length > 0) {
            let fields = responses.Candidate.map(a => a.InternalName)
            return fields
        }
    }
    return ""
}

function userOrGroupFieldRecordID(id) {
    if (id) {
        if (id && id.includes("[{")) {
            let jsonArray = (JSON.parse(id));
            if (jsonArray.length > 0) {
                return jsonArray.map(a => a.RecordID)
            }
        }
        else {
            return id && id.includes(";#") ? id.split(";#")[0] : id;
        }
    }
}


function getCandidate(candidateResponseID) {
    let objectName = "Candidate";
    let list = "RecordID,Street1,Street2,FirstName,LastName,LinkedinLink,FacebookLink,CandidateID,CandidateDocuments,HighestQualification,Percentagein10th,RatinginNumber,VerbalCommunication,Percentagein12th,RevenueGeneration,PercentageinGraduation,CityTown,RelevantExperience,Pincode,GooglePlusLink,TwitterLink,Mobile,Email,Country,ClientHandlingExperience,AlternatePhoneNumber,YearsofExperience,ProfessionalCourse,PercentageinPostGraduation,District,USAccountingExperience,QuickbooksExperience,PhotoUrl,DateofBirth,Nationality,CurrentLocation,TeamHandlingExperience,CommunicationSkilloutof5,Expectedsalary,Presentsalary,ReasonforJobChange,IsServingNoticePeriod,Religion,Gender,Company,NoticePeriod,PreferredLocation,Recruiter,CurrentRole,Designation,MaritalStatus,ReferredByEmployee,Source,MISReports,ClientVisit,FinalisationofAccountsonTallyS,AgencyName,LateWorking,ExcelRating,TallyRating,DescribedYourSelfin5Lines,ZohoRating,GSTTDSReturns,OtherSkills,Skill,AttachResume";
    let fieldList = list.split(",")
    let orderBy = "";
    let whereClause = `RecordID='${candidateResponseID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((candidate) => {
        if (Array.isArray(candidate) && candidate.length > 0) {
            let candidateData = candidate[0]
            saveintracker(candidateData);
        }

    })
}

function saveintracker(Candidatedata) {
    let CandidateRecord = Candidatedata.RecordID + ";#" + Candidatedata.FirstName + " " + Candidatedata.LastName;
    let CandidateResume = Candidatedata.AttachResume;
    let ContactNumber = Candidatedata.Mobile
    let CurrentSalary=Candidatedata.Presentsalary
    let ExpectedSalary=Candidatedata.Expectedsalary
    let TotalExperience=Candidatedata.YearsofExperience
    let removeField = ["ID", "objectid", "ParentRecordID", "CreatedByGUID", "CreatedDate", "LastModifiedDate", "CreatedByName", "InstanceID", "AttachResume", "RecordID", "AgencyName"];
    let candidate = Candidatedata;
    removeField.forEach(field => {
        delete candidate[field];
    });
    candidate.Candidate = CandidateRecord;
    candidate.Resume = CandidateResume;
    candidate.CurrentStatus = "Screening pending";
    candidate.JobPost = candidateJobpost;
    candidate.Vendor = candidatevendor;
    candidate.ContactNumber = ContactNumber;
    candidate.CurrentSalary=CurrentSalary
    candidate.ExpectedSalary=ExpectedSalary
    candidate.TotalExperience=TotalExperience
    save(candidate, "Job_Tracker")

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
            getjobTracker();
            resolve({
                response
            })
        });
    }
    )
}


