// var FullName = document.getElementById("FullName");
// var Email = document.getElementById("Email");
// var CoverLetter = document.getElementById("CoverLetter");
var FirstName = document.getElementById("FirstName");
var LastName = document.getElementById("LastName");
var Email = document.getElementById("Email");
var Mobile = document.getElementById("Mobile");
var AlternateMobile = document.getElementById("AlternateMobile");
var Gender = document.getElementById("Gender");
var DateOfBirth = document.getElementById("DateOfBirth");
var Qualification = document.getElementById("Qualification");
var CurrentCTC = document.getElementById("CurrentCTC");
var ExpectedCTC = document.getElementById("ExpectedCTC");
var CurrentLocation = document.getElementById("CurrentLocation");
var CurrentCompany = document.getElementById("CurrentCompany");
var NoticePeriod = document.getElementById("NoticePeriod");
var CurrentRole = document.getElementById("CurrentRole");
var UploadResume = document.getElementById("UploadResume");

const urlParams = new URLSearchParams(window.location.search);
const jobID = urlParams.get('jobID');
// const jobID="06954388-0ff5-455d-a411-2b14964275b3";
var file;
var filename;
var attachmentRepoAndFieldName;
var apURL = localStorage.getItem('env')
var user;
var jobDetails;

qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        user = getCurrentUser()
        document.getElementById('deleteicon').style.display = 'none'
        getJobDetailsList()
        getQualification()
        clearInterval(qafServiceLoaded);
    }
}, 10);

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
    let objectName = "Job_Posting";
    let list = "RecordID,JobTitle,Location,RequiredSkills,EmployeeType,Designation,RelevantExperience,Salary,JobResponsibilities,JobLevel,NumberofVacancies,RequiredQualification,JobID,JobRole";
    let orderBy = "";
    let whereClause = `RecordID='${jobID}'`;
    let fieldList = list.split(";#")
    let pageSize = "20000";
    let pageNumber = "1";
    const myContent = document.querySelector(".job-details-container");

    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobdescriptionList) => {
        if (Array.isArray(jobdescriptionList) && jobdescriptionList.length > 0) {

            let propertiesToSplit = ["Location", "Designation", "RequiredSkills", "JobLevel", "RequiredQualification"];
            let newJob = splitIdentifiers(jobdescriptionList, propertiesToSplit);
            let job = newJob[0];
            jobDetails = job
            let html = `
                    <div class="title-div">
                        <p class="job-Title">${job.JobTitle ? job.JobTitle : ""}</p>
                    </div>
                    <div class="job-details-area">
                        <div class="job-details-area-container">
                            <div class="content-row">
                                <div class="left-cell">
                                </div>
                                <div class="right-cell">
                                </div>
                                <div class="clear"></div>
                            </div>
                            <!-- Overview -->
                            <div class="content-row">
                                <div class="left-cell">
                                    <h5 class="label">Overview</h5>
                                </div>
                                <div class="right-cell text">
                                    <p>${job.JobRole ? job.JobRole : ""}</p>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <!-- Vacancies -->
                            <div class="content-row">
                                <div class="left-cell">
                                    <h5 class="label">No. of Vacancies</h5>
                                </div>
                                <div class="right-cell text">
                                ${job.NumberofVacancies ? job.NumberofVacancies : ""}
                                </div>
                                <div class="clear"></div>
                            </div>
                            <!-- Skills -->
                            <div class="content-row">
                                <div class="left-cell">
                                    <h5 class="label">Specific Skills</h5>
                                </div>
                                <div class="right-cell">
                                    <div class="custom-list text">
                                    ${job.RequiredSkills ? job.RequiredSkills : ""} </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <!-- Responsible -->
                            <!-- Additional -->
                            <!-- Job Nature -->
                            <div class="content-row">
                                <div class="left-cell">
                                    <h5 class="label">Job Nature</h5>
                                </div>
                                <div class="right-cell text">
                                ${job.EmployeeType ? job.EmployeeType : ""} </div>
                                <div class="clear"></div>
                            </div>

                            <!-- Educational -->
                            <div class="content-row">
                                <div class="left-cell">
                                    <h5 class="label">Educational Requirements</h5>
                                </div>
                                <div class="right-cell text">
                                    <p>${job.RequiredQualification ? job.RequiredQualification : ""}</p>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <!-- Experience -->
                            <div class="content-row">
                                <div class="left-cell">
                                    <h5 class="label">Experience Requirements</h5>
                                </div>
                                <div class="right-cell text">
                                ${job.RelevantExperience ? job.RelevantExperience + "&nbsp;years" : ""}
                                </div>
                                <div class="clear"></div>
                            </div>
                            <!-- Location -->
                            <div class="content-row">
                                <div class="left-cell">
                                    <h5 class="label">Job Location</h5>
                                </div>
                                <div class="right-cell text">
                                ${job.Location ? job.Location : ""} </div>
                                <div class="clear"></div>
                            </div>
                            <!-- Salary -->
                            <!-- Other Benefits -->
                            <!-- Job Level -->
                            <div class="content-row">
                                <div class="left-cell padding-bottom-50">
                                    <h5 class="label">Job Level</h5>
                                </div>
                                <div class="right-cell text">
                                ${job.JobLevel ? job.JobLevel : ""} </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    </div>
                    <div class="job-details-footer">
                        <h3 class="apply-heading">How to Apply</h3>
                        <span class="apply-heading-border">&nbsp;</span>
                        <p class="apply-to-email">
                            Interested candidates can send their resumes to official email id and mentioning "Job Title" in the subject
                            line. </p>
                        <a class="apply-link apply-button" id="openButton"onclick="OpenForm()">Apply Now</a>
                    </div>`
                ;
            myContent.innerHTML = html;
        }
    })
};

function OpenForm() {
    addCssforscroll()
    
    let applyForm = document.getElementById("popupContainer");
    if (applyForm) {
        applyForm.style.display = 'block'
    }
    let popup = document.getElementById("popup-content");
    if (popup) {
        popup.style.display = 'block'
    }
    deleteFile()
}

function deleteFile() {
    filename = ""
    file = null
    attachmentRepoAndFieldName = ""
    document.getElementById('filename').innerHTML = filename
    document.getElementById('deleteicon').style.display = 'none'
    document.getElementById('UploadResume').value = "";
}

function closeApplyForm() {
    removeCss()
    let applyForm = document.getElementById("popupContainer");
    if (applyForm) {
        applyForm.style.display = 'none';
    }
    let popup = document.getElementById("popup-content");
    if (popup) {
        popup.style.display = 'none';
    }
    const fieldIds = ['FirstName', 'LastName', 'Email', 'Mobile', 'AlternateMobile', 'Gender', 'DateOfBirth', 'Qualification', 'CurrentCTC', 'ExpectedCTC', 'CurrentLocation', 'CurrentCompany', 'NoticePeriod', 'CurrentRole', 'UploadResume'];
    fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
            const parentElement = field.parentElement;
            const errorSpan = parentElement.querySelector(".error-message");
            if (errorSpan) {
                parentElement.removeChild(errorSpan);
            }
        }
    });
}


function onFileChange(event) {
    let selectedFiles = event.files;
    let type = selectedFiles[0] && selectedFiles[0].name.substr(selectedFiles[0].name.lastIndexOf('.'), selectedFiles[0].name.length).toLowerCase();
    if (type != ".exe") {
        let recordId = "";
        file = selectedFiles[0];
        filename = file && file.name ? file.name : '';
        attachmentRepoAndFieldName = `Temporary_Candidate;#AttachResume`;
        document.getElementById('filename').innerHTML = filename
        document.getElementById('deleteicon').style.display = 'block'
    }
}
//   FirstName: FullName.value.split(";#")[0],
//   LastName: FullName.value.split(";#")[1],


function uploadAttachment() {
    
    let QualificationElement = document.getElementById("Qualification");
    let qualification = ""
    if (QualificationElement) {
        let value = QualificationElement.value;
        if (value) {
            let singlequalification = qualificationList.filter(lc => lc.RecordID === value);
            if (singlequalification && singlequalification.length > 0) {
                qualification = singlequalification[0].RecordID + ";#" + singlequalification[0].Name
            }
        }
    }
    let currentLocationElement = document.getElementById("CurrentLocation");
    let currentLocation = ""
    if (currentLocationElement) {
        let locationValue = currentLocationElement.value;
        if (locationValue) {
            let singlecurrentLocation = LocationList.filter(lc => lc.RecordID === locationValue);
            if (singlecurrentLocation && singlecurrentLocation.length > 0) {
                currentLocation = singlecurrentLocation[0].RecordID + ";#" + singlecurrentLocation[0].Name
            }
        }
    }

    const form = new FormData();
    form.append('file', file, file && file.name);
    form.append("file_type", attachmentRepoAndFieldName);
    form.append("recordID", '');
    fetch(`https://qaffirst.quickappflow.com/Attachment/uploadfile`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.value.EmployeeGUID,
            'Hrzemail': user.value.Email
        },
        body: form
    })
        .then(response => response.json())
        .then(fileResponse => {
            
            let object = {
                FirstName: FirstName.value,
                LastName: LastName.value,
                Email: Email.value,
                Mobile: Mobile.value,
                AlternatePhoneNumber: AlternateMobile.value,
                Gender: Gender.value,
                DateofBirth: DateOfBirth.value,
                HighestQualification: qualification,
                Presentsalary: CurrentCTC.value,
                Expectedsalary: ExpectedCTC.value,
                CurrentLocation: currentLocation,
                Company: CurrentCompany.value,
                NoticePeriod: NoticePeriod.value,
                CurrentRole: CurrentRole.value,
                AttachResume: fileResponse.url,
                JobPost: jobDetails.RecordID + ";#" + jobDetails.JobID + "-" + jobDetails.JobTitle
            };
            save(object, 'Temporary_Candidate')
            closeApplyForm()
        })
}


function save(object, repositoryName) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}

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
            resolve({
                response
            })
        });
    }
    )

}



async function saveApplyForm() {
    ;

    removeErrorMessage(FirstName);
    removeErrorMessage(LastName);
    removeErrorMessage(Email);
    removeErrorMessage(Mobile);
    removeErrorMessage(AlternateMobile);
    removeErrorMessage(UploadResume);

    // let validFullName = validateFullName(FullName.value);
    // let validEmail = validateEmail(Email.value);
    // let validFile = validateFile(UploadResume);

    if (!validateFullName(FirstName.value)) {
        displayErrorMessage(FirstName, "Please Enter Your Firstname");
    }
    else if (!validateFullName(LastName.value)) {
        displayErrorMessage(LastName, "Please Enter Your Lastname");
    }
    else if (!validateEmail(Email.value)) {
        displayErrorMessage(Email, "Please Enter Valid Email Address");
    }
    else if (!validateMobile(Mobile.value)) {
        displayErrorMessage(Mobile, "Please Enter Valid Mobile Number");
    }
    else if (!validateMobile(AlternateMobile.value)) {
        displayErrorMessage(AlternateMobile, "Please Enter Valid Alternate Mobile Number");
    }
    else if (!validateFile(UploadResume)) {
        displayErrorMessage(UploadResume, "Please select a file to upload");
    }
    else {
        uploadAttachment()
    }
}



// Functions For Validations
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validateMobile(mobile) {
    // Regular expression to validate a mobile number (assuming 10-digit Indian numbers)
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
}

function validateFullName(fullName) {
    return fullName.trim() !== "";
}
function validateFile(field) {
    return field.files[0] != null; // Check if file is not null
}

// Function to display error message
function displayErrorMessage(field, message) {
    removeErrorMessage(field);
    const parentElement = field.parentElement;
    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    errorSpan.textContent = message;
    parentElement.appendChild(errorSpan);
}

// Function to remove error message
function removeErrorMessage(field) {
    const parentElement = field.parentElement;
    const errorSpan = parentElement.querySelector(".error-message");
    if (errorSpan) {
        parentElement.removeChild(errorSpan);
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

// document.body.addEventListener("click", function (evt) {
//     if (!(evt.target.closest(".popup-content"))) {
//         closeApplyForm()
//     }
// });

// document.body.addEventListener("click", function (evt) {
//     if (!(evt.target.closest(".popup-content") || evt.target.closest("#job_apply_btn"))) {
//         closeApplyForm()
//     }

// });
var qualificationList = []
function getQualification() {
    qualificationList = []
    let objectName = "Qualification";
    let list = 'Name';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((quals) => {
        if (Array.isArray(quals) && quals.length > 0) {
            qualificationList = quals;
            SetQualification();
        }

    });
    getLocation();
}

var LocationList = []
function getLocation() {
    LocationList = []
    let objectName = "Location";
    let list = 'Name';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((locations) => {
        if (Array.isArray(locations) && locations.length > 0) {
            LocationList = locations;
            SetOfficeloacationdropdown()
        }

    });

}
function SetQualification() {
    let officeQualificationElement = document.getElementById('Qualification');
    let options = `<option value=''> Select Qualification</option>`;
    if (officeQualificationElement) {
        qualificationList.forEach(qual => {
            options += `<option value="${qual.RecordID}">${qual.Name}</option>`;
        });
        officeQualificationElement.innerHTML = options;
    }
}

function SetOfficeloacationdropdown() {
    let officeLocationElement = document.getElementById('CurrentLocation');
    let options = `<option value=''> Select Current Location</option>`;
    if (officeLocationElement) {
        LocationList.forEach(loc => {
            options += `<option value="${loc.RecordID}">${loc.Name}</option>`;
        });
        officeLocationElement.innerHTML = options;
    }

}

// Function to Close the popup-Container
function HideForm() {
    closeApplyForm()
}
const popupContainer = document.getElementById('popupContainer');
const popupContent = document.getElementById('popup-content');
popupContainer.addEventListener('click', HideForm);
popupContent.addEventListener('click', function (event) {
    event.stopPropagation();
});