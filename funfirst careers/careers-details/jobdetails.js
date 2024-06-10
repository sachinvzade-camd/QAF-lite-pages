
let FullName=document.getElementById("FullName");
let Email=document.getElementById("Email");
let CoverLetter=document.getElementById("CoverLetter");
const urlParams = new URLSearchParams(window.location.search);
const recordID = urlParams.get('jobID');
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
        document.getElementById('deleteicon').style.display='none'
        getJobDetailsList()
        clearInterval(qafServiceLoaded);
    }
}, 10);


function splitIdentifiers(arrayOfObjects, propertiesToSplit) {
    // Copy the original array to avoid modifying the original data
    let updatedArray = arrayOfObjects.map(obj => ({ ...obj }));

    // Function to split identifiers in an array of objects
    updatedArray = updatedArray.map(obj => {
        propertiesToSplit.forEach(property => {
            // Check if the property exists and is not null or undefined
            if (obj && obj.hasOwnProperty(property) && obj[property] !== null && obj[property] !== undefined && typeof obj[property] === 'string') {
                // Split the property's values into an array using the specified delimiter
                let valuesArray = obj[property].split(';#').filter(Boolean);

                // Update the property with the array excluding the identifier
                obj[property] = valuesArray.filter((value, index) => index % 2 !== 0);
            }
        });

        return obj;
    });

    return updatedArray;
}


function getJobDetailsList() {

    const myContent = document.querySelector(".job-details-container");
    let objectName = "Job_Posting";
    let list = "RecordID,JobTitle,Location,RequiredSkills,EmployeeType,Designation,RelevantExperience,Salary,JobResponsibilities,JobLevel,NumberofVacancies,RequiredQualification,JobID";
    let orderBy = "";
    let whereClause = `RecordID='${recordID}'`;
    let fieldList = list.split(";#")
    let pageSize = "20000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobdescriptionList) => {
        if (Array.isArray(jobdescriptionList) && jobdescriptionList.length > 0) {

            let propertiesToSplit = ["Location", "Designation", "RequiredSkills","JobLevel","RequiredQualification"];
            let newJob = splitIdentifiers(jobdescriptionList, propertiesToSplit);



            let job = newJob[0];
            jobDetails=job
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
                            ${job.JobTitle ? job.JobTitle : ""} </div>
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
                        Interested candidates can send their resumes to info@gslfoundation.org mentioning "Job Title" in the subject
                        line. </p>
                    <a class="apply-link apply-button" onclick="OpenForm()">Apply Now</a>
                </div>
          `
                ;
            myContent.innerHTML = html;
        }
    })
};

function OpenForm(){
    let applyForm = document.getElementById("popupContainer");
        if (applyForm) {
            applyForm.style.display = 'block'
        }
        deleteFile()
}

async function saveAppplyForm() {
        uploadAttachment()
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

        let applyForm = document.getElementById("popupContainer");
        if (applyForm) {
            applyForm.style.display = 'none'
        }
        resolve({
          response
        })
      });
    }
    )
  
  }
  function onFileChange(event){
    let selectedFiles = event.files;
    let type = selectedFiles[0] && selectedFiles[0].name.substr(selectedFiles[0].name.lastIndexOf('.'), selectedFiles[0].name.length).toLowerCase();
    if (type != ".exe") {
      let recordId = "";
      file = selectedFiles[0];
      filename = file && file.name ?file.name : '';
        attachmentRepoAndFieldName = `Temporary_Candidate;#AttachResume`;
        document.getElementById('filename').innerHTML=filename
        document.getElementById('deleteicon').style.display='block'
    }
  }
 function  deleteFile(){
    filename=""
    file=null
    attachmentRepoAndFieldName=""
    document.getElementById('filename').innerHTML=filename
    document.getElementById('deleteicon').style.display='none'
    document.getElementById('UploadResume').value = "";

  }

  function   uploadAttachment() {
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
        body:form
    })
        .then(response => response.json())
        .then(fileResponse => {
         let object = {
             FirstName: FullName.value.split(";#")[0],
             LastName: FullName.value.split(";#")[1],
             Email: Email.value,
             CoverLetter: CoverLetter.value,
             AttachResume: fileResponse.url,
             JobPost:jobDetails.RecordID+";#"+jobDetails.JobID+"-"+jobDetails.JobTitle
           };
        save(object, 'Temporary_Candidate')
        })
  }