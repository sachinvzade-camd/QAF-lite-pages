
var FullName = document.getElementById("FullName");
var Email = document.getElementById("Email");
var CoverLetter = document.getElementById("CoverLetter");
var UploadResume = document.getElementById('UploadResume');
const urlParams = new URLSearchParams(window.location.search);
const jobID = urlParams.get('jobID');
var file;
var filename;
var attachmentRepoAndFieldName;
var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = SITapiURL
var user;
var jobDetails;
let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        user = getCurrentUser()
        document.getElementById('deleteicon').style.display = 'none'
        getJobDetailsList()
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
    let list = "RecordID,JobTitle,Location,RequiredSkills,EmployeeType,Designation,RelevantExperience,Salary,JobResponsibilities,JobLevel,NumberofVacancies,RequiredQualification,JobID";
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
                                    <p>${job.JobResponsibilities ? job.JobResponsibilities : ""}</p>
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
    const fieldIds = ['FullName', 'Email', 'CoverLetter', 'UploadResume'];
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
    let name_parts = FullName.value.split(" ");
    let firstName = name_parts[0];
    let lastName = name_parts.length > 1 ? name_parts[name_parts.length - 1] : "";
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
                FirstName: firstName,
                LastName: lastName,
                Email: Email.value,
                CoverLetter: CoverLetter.value,
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

    removeErrorMessage(FullName);
    removeErrorMessage(Email);
    removeErrorMessage(UploadResume);

    // let validFullName = validateFullName(FullName.value);
    // let validEmail = validateEmail(Email.value);
    // let validFile = validateFile(UploadResume);

    if (!validateFullName(FullName.value)) {
        displayErrorMessage(FullName, "Please Enter Your Full Name");
    }
    else if (!validateEmail(Email.value)) {
        displayErrorMessage(Email, "Please Enter Valid Email Address");
    } 
    else if (!validateFile(UploadResume)) {
        displayErrorMessage(UploadResume, "Please select a file to upload");
    } 
    else {
        uploadAttachment()
    }
}

// async function saveAppplyForm() {
//     

//     removeErrorMessage(FullName);
//     removeErrorMessage(Email);
//     removeErrorMessage(UploadResume);

//     if (!validateFullName(FullName.value)) {
//         displayErrorMessage(FullName, "Please Enter Your Full Name");

//     } else {
//         removeErrorMessage(FullName);
//     }

//     if (!validateEmail(Email.value)) {
//         displayErrorMessage(Email, "Please Enter Valid Email Address");
//     }

//     if (!validateFile(UploadResume)) {
//         displayErrorMessage(UploadResume, "Please select a file to upload");
//     }
//     else {
//         removeErrorMessage(UploadResume);
//     }

//     uploadAttachment()

// }

// Functions For Validations
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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