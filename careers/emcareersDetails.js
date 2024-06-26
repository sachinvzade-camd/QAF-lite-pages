var applyButton;
var socialNetworkShare;
var sharedJDURL;
var jobDetails;
var jobTrackerRoleField;
var tempInternalName=[
  "CandidateID","FirstName","Email","Nationality","Source","Gender","PreferredLocation","MaritalStatus","DescribedYourSelfin5Lines","CommunicationSkilloutof5","ReasonforJobChange","Religion","CurrentLocation","DateofBirth","AlternatePhoneNumber","Mobile","LastName","YearsofExperience","RelevantExperience","USAccountingExperience","QuickbooksExperience","TeamHandlingExperience","ClientHandlingExperience","Presentsalary","Expectedsalary","NoticePeriod","Company","CurrentRole","Designation","MISReports","ClientVisit","LateWorking","FinalisationofAccountsonTallyS","ExcelRating","TallyRating","ZohoRating","GSTTDSReturns","Skill","AttachResume","HighestQualification","Percentagein10th","Percentagein12th","PercentageinGraduation","PercentageinPostGraduation","ProfessionalCourse","CandidateDocuments","Street1","Street2","Pincode","District","Country","CityTown","LinkedinLink","FacebookLink","TwitterLink","GooglePlusLink","PhotoUrl","Iagreewiththeprivacypolicy"
]
let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
      // window.localStorage.setItem('ma',"medvolant.quickappflow.com")
        getSharedJDURL()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getJobPosting() {
  
    // let URL = getParentUrl()
    // let URL2 = getOriginUrl()
    let URL=window.location.href
    let paramString = URL.split('?')[1];
    const urlParams = new URLSearchParams(paramString);
    const jobID = urlParams.get('jobID');
    socialNetworkShare=encodeURIComponent(sharedJDURL+`?jobID=${jobID}`)
    let objectName = "Job_Posting";
    let list = "JobTitle,RecordID,JobImage,PostingExpiresOn,RequiredQualification,RelevantExperience,RelevantExperience,Location,WebsiteCandidateSpecification,WebsiteJobDetails,EmployeeType,Shift,JobLevel,JobID,JobTemplate";
    let orderBy = "";
    // let whereClause = ``;
    let whereClause = `RecordID='${jobID}'`;
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobsList) => {
        if (Array.isArray(jobsList) && jobsList.length > 0) {
             jobDetails = jobsList[0]
             getQafConfigurationField()
            document.title=jobDetails.JobTitle
            let jobDetailstemplate = `
            <div class="job-title-wrapper">
            <h1>${jobDetails.JobTitle}</h1>
        </div>
        <div class="job-details">
            <div class="job-details-main" >
              ${jobDetails.JobTitle?  `<div class="desc-main" >
                    <div class="head-title">Job Title</div>
                    <div class="head-desc">${jobDetails.JobTitle}</div>
                </div>`:''}
                ${jobDetails.RequiredQualification?`<div class="desc-main" >
                    <div class="head-title">Educational Qualification</div>
                    <div class="head-desc">${jobDetails.RequiredQualification ? formatString(jobDetails.RequiredQualification) : ""}</div>
                </div>`:''}
              ${jobDetails.RelevantExperience? ` <div class="desc-main" >
                    <div class="head-title">Relevant Experience</div>
                    <div class="head-desc">${jobDetails.RelevantExperience}</div>
                </div>`:''}
              ${jobDetails.WebsiteJobDetails?  `<div class="desc-main" >
                    <div class="head-title">Job Role & Responsibilities</div>
                    <div class="head-desc" id="jobRole">
                    </div>
                </div>`:''}
                ${jobDetails.WebsiteCandidateSpecification? `<div class="desc-main" >
                    <div class="head-title">Candidate Specifications</div>
                    <div class="head-desc" id="candidatespecification"></div>
                </div>`:''}
           ${jobDetails.Location?`<div class="desc-main" >
                    <div class="head-title">Job Location</div>
                    <div class="head-desc">${jobDetails.Location ? formatString(jobDetails.Location) : ''}</div>
                </div>`:''}
             ${jobDetails.EmployeeType||jobDetails.Shift?`<div class="desc-main" >
                    <div class="head-title">Job Type
                    </div>
                    <div class="head-desc">${getDetailsJobType(jobDetails)}</div>
                </div>`:''}
            </div>
            <div class="second-column">
               
                <div class="apply-job-social">
                <div class="applyJob  m-l-10">
                <button class="apply-button" id="applyjob">Apply for this job</button>
                </div>
                <div class="share m-t-30">
                    <ul>
                        <li><a href="https://www.facebook.com/sharer.php?u=${socialNetworkShare}" target="_blank"><i
                                    class="fa fa-facebook" aria-hidden="true"></i></a></li>
                        <li><a href="https://www.linkedin.com/shareArticle?url=${socialNetworkShare}"
                                target="_blank"><i class="fa fa-linkedin" aria-hidden="true"></i></a></li>
                        <li><a href="https://twitter.com/share?url=${socialNetworkShare}" target="_blank"><i
                                    class="fa fa-twitter" aria-hidden="true"></i></a></li>
                    </ul>

                </div>
            </div>

            </div>
        </div>`
            document.getElementById('jobdetails').innerHTML = jobDetailstemplate;
            setTimeout(() => {
              let candidatespecification=document.getElementById('candidatespecification')
              if(candidatespecification){
              candidatespecification.innerHTML = jobDetails.WebsiteCandidateSpecification;
            }
            let jobRole= document.getElementById('jobRole')
            if(jobRole){
              jobRole.innerHTML = jobDetails.WebsiteJobDetails;
            }
                applyButton=document.getElementById('applyjob')
                if(applyButton){
                    applyButton.addEventListener('click',applytemparoryCandidate)
                    }
            }, 1000);
        }
    });

}
function getDetailsJobType(jobDetail) {
    let array = [];
    if (jobDetail.EmployeeType) {
      array.push(`${jobDetail.EmployeeType}`)
    }
    if (jobDetail.Shift) {
      array.push(`${jobDetail.Shift}`)
    }
    return array.join(`-`)
  }
function formatString(value){
        let returnValue = value ? value : "";
        let updatedRetunValue = [];
        if (returnValue.indexOf(';#') !== -1) {
          let valuesWithGuid = returnValue.split(';#');
          for (let i = 0; i < valuesWithGuid.length; i++) {
            if (!isValidGuid(valuesWithGuid[i])) {
              updatedRetunValue.push(valuesWithGuid[i].trim());
            }
          }
          returnValue = updatedRetunValue.join('; ');
        } else {
          if (isValidGuid(returnValue)) {
            returnValue = '';
          }
        }
        return returnValue;
}
function isValidGuid(guidString) {
    guidString = guidString ? guidString.trim() : '';
    let guidRegexPattern = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g)
    return guidRegexPattern.test(guidString);
  }

  function getParentUrl() {
    var isInIframe = (parent !== window),
        parentUrl = null;

    if (isInIframe) {
        parentUrl = document.referrer;
    }

    return parentUrl;
}
function getOriginUrl() {
  var href = document.location.href;
  var referrer = document.referrer;
  // Check if window.frameElement not null
  if(window.frameElement) {
      href = window.frameElement.ownerDocument.location.href;
      // This one will be origin
      if(window.frameElement.ownerDocument.referrer != "") {
          referrer = window.frameElement.ownerDocument.referrer;
      }
  }
  // Compare if href not equal to referrer
  if(href != referrer) {
      // Take referrer as origin
      return referrer;
  } else {
      // Take href
      return href
  }
}
function applytemparoryCandidate(){
    if(window.QafPageService){
        let fieldsValue = [];
        
        jobTrackerRoleField.forEach(val => {
          if (val === 'Source') {
            fieldsValue.push({ fieldName: val, fieldValue: "Career Portal" })
          }else  if (val === 'JobPost') {
            fieldsValue.push({ fieldName: val, fieldValue:jobDetails.RecordID+";#"+jobDetails.JobID+"-"+ jobDetails.JobTitle})
          }
          else {
            fieldsValue.push({ fieldName: val, fieldValue: null })
          }
        })
        let fieldsDoNotdiaply = ["VendorNameReference", "Source", "Rating", "Status", "InternalCandidateProfile", "CandidatePassword","CandidateID","JobPost","LinkedinLink","FacebookLink","TwitterLink","GooglePlusLink","Street1","Street2","Pincode","District","Country","CityTown","PhotoUrl","HighestQualification","Percentagein10th","Percentagein12th","PercentageinGraduation","PercentageinPostGraduation","ProfessionalCourse","CandidateDocuments","PreferredLocation","CurrentLocation",'RevenueGeneration'];//check
       let displayFieldlist = jobTrackerRoleField.filter((objOne) => {
          return !fieldsDoNotdiaply.some((objTwo) => {
            return objOne === objTwo;
          });
        });
        let excludeFieldFromForm=["LinkedinLink","FacebookLink","TwitterLink","GooglePlusLink","Street1","Street2","Pincode","District","Country","CityTown","PhotoUrl","HighestQualification","Percentagein10th","Percentagein12th","PercentageinGraduation","PercentageinPostGraduation","ProfessionalCourse","CandidateDocuments","PreferredLocation","CurrentLocation",'RevenueGeneration']
        window.QafPageService.AddItem("Temporary_Candidate",itemAdd,displayFieldlist,fieldsValue,null,null,fieldsDoNotdiaply,excludeFieldFromForm,null,null,null,true,null,null,null,'Email')
    }
}


function itemAdd(recordID){
}
function getSharedJDURL() {
    let objectName = "Recruitment_Settings";
    let list = "SettingName,SettingValue";
    let orderBy = "";
    let whereClause = `SettingName='SharedJD'`;
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((settings) => {
      if (Array.isArray(settings) && settings.length > 0) {
        sharedJDURL=settings[0].SettingValue
        getJobPosting()
      }
    })
  }

  function getQafConfigurationField() {
    let objectName = "Job_Profile_Template";
    let list = "RecordID,CareerPortalField";
    let orderBy = "";
    let whereClause =`RecordID='${jobDetails.JobTemplate ? jobDetails.JobTemplate.split(";#")[0] : ''}'`;
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((response) => {
      if (Array.isArray(response) && response.length > 0) {
        debugger
        jobTrackerRoleField = getCareerField(response[0])
      }
    })
  }
 function getCareerField(templateRecord) {
    if (templateRecord) {
      let responses = JSON.parse(templateRecord.CareerPortalField);
      if (responses && responses.length > 0) {
        let fields = responses.map(a => a.InternalName)
        return fields
      }
    }
    return ""
  }
 function getTypeOfJobPost(role) {

    let indiaJobs = ["Jr. Accountant", "AP Associate", "AP Executive", "TL Bookkeeping", "TL-Domestic Accounting", "Accountant","BDM", 'Business Development Manager','Business Development Manager (International Sales)']
    let usJobs = ["Jr. US Bookkeeper", "TL/Clients Relationship Manager", "Deputy TL", "US Bookkeeper", "Sr. US Accountant", "US Accountant"];

    let isIndiaPresent = indiaJobs.filter(jobRole => jobRole.toLowerCase() === role.toLowerCase())
    let isusJobsPresent = usJobs.filter(jobRole => jobRole.toLowerCase() === role.toLowerCase())

    if (isIndiaPresent && isIndiaPresent.length > 0) {
      return "India"
    } else {
      if (isusJobsPresent && isusJobsPresent.length > 0) {
        return "us"
      }
    }
    return ""
  }
 function ShowFieldLevel(role, fields) {
    let notshowFieldList= this.roleWiseNotShowField();
    let notshowField = notshowFieldList.find(a => a.JobRole.toLowerCase() === role.toLowerCase());
    if (notshowField && notshowField.JobRole) {
      let newfields = fields.filter((objOne) => {
        return !notshowField.Fields.some((objTwo) => {
          return objOne === objTwo;
        });
      });
      newfields.push('TeamHandlingExperience')
      newfields.push('ClientHandlingExperience')
      return newfields
    }
    else {
      let notshowFieldNew = ["RevenueGeneration"]
      let newfieldsText = fields.filter((objOne) => {
        return !notshowFieldNew.some((objTwo) => {
          return objOne === objTwo;
        });
      });
      return newfieldsText
    }

  }
  function roleWiseNotShowField() {
    return [
      {
        Fields: ["MISReports", "ClientVisit", "ExcelRating", "FinalisationofAccountsonTallyS", "ZohoRating", "GSTTDSReturns", "TallyRating", "HWTestTargetDate", "ExtensionExpiryDate", "Feedback", "HWTestExtensionReason"],
        JobRole: 'BDM'
      },
      {
        Fields: ["MISReports", "ClientVisit", "ExcelRating", "FinalisationofAccountsonTallyS", "ZohoRating", "GSTTDSReturns", "TallyRating", "HWTestTargetDate", "ExtensionExpiryDate", "Feedback", "HWTestExtensionReason"],
        JobRole: 'Business Development Manager'
      },
      {
        Fields: ["MISReports", "ClientVisit", "ExcelRating", "FinalisationofAccountsonTallyS", "ZohoRating", "GSTTDSReturns", "TallyRating", "HWTestTargetDate", "ExtensionExpiryDate", "Feedback", "HWTestExtensionReason"],
        JobRole: 'Business Development Manager (International Sales)'
      }
    ]
  }