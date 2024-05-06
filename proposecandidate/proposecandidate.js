const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get('candidateID');
const idsArray = idParam ? idParam.split(',') : [];
let condtion_whereClause = "";
if (idsArray.length > 0) {
  condtion_whereClause= `Candidate='${idsArray.join("'<OR>Candidate='")}'`;
}

let qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    getcandidateList();
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

function getInitials(candidate) {
  let firstName=candidate[0].split(" ")[0]
  let lastName=candidate[0].split(" ")[1]
  if (!firstName && !lastName) {
    return "No Name";
  } else {
    var firstInitial = firstName ? firstName.charAt(0) : "";
    var lastInitial = lastName ? lastName.charAt(0) : "";

    // Return the initials
    return firstInitial + lastInitial;
  }
}


function saveStatus(status, trackerID) {
  let candidateStatus = status;
  let candidateRecordI = trackerID;
    document.getElementById(`reject${trackerID}`).disabled = true;
    document.getElementById(`approve${trackerID}`).disabled = true;
    document.getElementById(`reject${trackerID}`).style.opacity = "0.5";
    document.getElementById(`approve${trackerID}`).style.opacity = "0.5";
    let object = {}
    if(status==='Approved'){
       object = {
        RecordID: trackerID,
        CurrentStatus:'Proposed approved'
      };
    }else{
      object = {
        RecordID: trackerID,
        CurrentStatus:'Proposed rejected'
      };
    }
   
    save(object, "Job_Tracker")

  // savepopForm(candidateStatus, candidateRecordI);
  }


function savepopForm(candidateStatus, candidateId) {
  let status = candidateStatus;
  let CandidateId = candidateId;
  let objectName = "Job_Tracker";
  let list = "RecordID,Candidate,JobPost,HighestQualification,RelevantExperience,HighestQualification,Recruiter,TotalExperience";
  let orderBy = "";
  let whereClause = `RecordID='${CandidateId}'`;
  let fieldList = list.split(";#")
  let pageSize = "20000";
  let pageNumber = "1";
  let object = {};
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((trackers) => {
    if (Array.isArray(trackers) && trackers.length > 0) {
      let tracker = trackers[0];
      getjobpost(tracker.JobPost.split(";#")[0],tracker,candidateStatus)
    }

  })

}

function getjobpost(jobid,tracker,candidateStatus) {
  let objectName = "Job_Posting";
  let list = "RecordID,JobLevel";
  let orderBy = "";
  let whereClause = `RecordID='${jobid}'`;
  let fieldList = list.split(";#")
  let pageSize = "20000";
  let pageNumber = "1";
  let object = {};
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobs) => {
    let object = {
      Candidate: tracker.Candidate,
      JobPost:tracker.JobPost,
      JobRole:jobs[0].JobLevel,
      Qualification:tracker.HighestQualification,
      TotalExperience:tracker.TotalExperience,
      RelevantExperience:tracker.RelevantExperience,
      Recruiter:tracker.Recruiter,
      Status:candidateStatus,
      Propositiondate:new Date()
    };
    save(object, "Propose_Approval_Candidate")
  })

}

function save(object, repositoryName) {
  return new Promise((resolve) => {
    var recordFieldValueList = [];
    var intermidiateRecord = {}
    var user = getCurrentUser()
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
    intermidiateRecord.RecordID = object.RecordID;
    intermidiateRecord.RecordFieldValues = recordFieldValueList;
    window.QafService.UpdateItem(intermidiateRecord).then(response => {
      resolve({
        response
      })
    });
  }
  )

}



function getcandidateList() {
  let objectName = "Job_Tracker";
  let list = "RecordID,Candidate,Resume,ContactNumber,CurrentSalary,Email,TotalExperience,CurrentLocation,ExpectedSalary,YearsofExperience,NoticePeriod,CurrentLocation,Presentsalary,PreferredLocation,HighestQualification,Skill,PhotoUrl";
  // let list="*";
  let orderBy = "";
  let whereClause = condtion_whereClause;
  let fieldList = list.split(";#")
  let pageSize = "20000";
  let pageNumber = "1";
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((settings) => {
    if (Array.isArray(settings) && settings.length > 0) {

      let propertiesToSplit = ["CurrentLocation", "PreferredLocation", "Skill", "HighestQualification","Candidate"];
      let updatedJob = splitIdentifiers(settings, propertiesToSplit);
      const myContent = document.querySelector(".card-container");
      let html = "";
      const showInHtml = updatedJob.forEach((candidate, index) => {
        html += `  
         <div class="card">
        <div class="main">
          <div class="profile-details">
            <div class="row1">
              <div class="profile-photo">
                <span>${getInitials(candidate.Candidate)}</span>
              </div>
            </div>
            <div class="row2">
              <div class="column">
                <div class="name">
                <p>${candidate.Candidate}</p>
                </div>
                <div class="experiance">
                  <p>₹&nbsp;${candidate.ExpectedSalary == null ? "" : candidate.ExpectedSalary}&nbsp;|&nbsp;${candidate.TotalExperience == null ? "" : candidate.TotalExperience}Y&nbsp;|&nbsp; ${candidate.NoticePeriod == null ? "" : candidate.NoticePeriod} d &nbsp;|&nbsp; ${candidate.CurrentLocation == null ? "" : candidate.CurrentLocation}</p>
                </div>
              </div>
              <div class="contact">
              <div class="number">
              <p><i class="fas fa-mobile-alt"></i> ${candidate.ContactNumber == null ? "" : candidate.ContactNumber}</p>
            </div>
            <div class="email">
              <p><i class="fas fa-envelope"></i> ${candidate.Email == null ? "" : candidate.Email}</p>
            </div>
      
              </div>
            </div>
            <div class="row3">
              <div>
                <button class="shortlist-button" id="approve${candidate.RecordID}" onclick="saveStatus('Approved','${candidate.RecordID}')">Approve</button>
              </div>
              <div>
                <button class="shortlist-button" id="reject${candidate.RecordID}" onclick="saveStatus('Rejected','${candidate.RecordID}')">Reject</button>
              </div>
            </div>
          </div>
          <div class="job">
          <p><em>Current Salary:</em>&nbsp; <span>₹&nbsp;${candidate.CurrentSalary == null ? "" : candidate.CurrentSalary}</span></p>
          <p><em>Pref Locations</em>&nbsp; <span>${candidate.PreferredLocation == null ? "" : candidate.PreferredLocation}</span></p>
          <p><em>Qualification:</em>&nbsp; <span>${candidate.HighestQualification == null ? "" : candidate.HighestQualification}</span></p>
          <p><em>Skill:</em>&nbsp;<span>${candidate.Skill == null ? "" : candidate.Skill}
          </span></p>
          </div>
        </div>
        <hr>
        <div class="link-buttons">
         ${candidate.Resume?`<a class="envelop" href="${downloadResume(candidate.Resume)}" download><i class="fa fa-download"></i>Download</a>`:""} 
        </div>
      </div>`
      });

      myContent.innerHTML = html;
    }
  })

};
  
function downloadResume(url){
  return window.location.origin+"/Attachment/downloadfile?fileUrl="+encodeURIComponent(getURLFromJson((url)))
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