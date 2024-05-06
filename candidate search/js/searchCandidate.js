var menuList = [
  {
    Title: 'Requisition',
    Icons: "fa-user-plus",
    URL:`recruitment/Candidate-Requisition`,
    Iframe:true,
  },
  {
    Title: 'Candidate Search',
    Icons: "fa-search",
    URL: `pages/candidatesearch`,
    Html: `<div class="data"> <header> <div class="title"> <p>Candidate Search</p> </div> <div class="search-bar-container"> <div class="search-bar"> <i class="fas fa-search search-icon"></i> <input type="text" class="search-input" id="search" placeholder="" /> <i id="cancelSearch" onclick="cancelSearch()" class="fas fa-times cancel-icon"></i> </div> </div> <div class="header-button"> <div> <button class="listview button"> <i class="fas fa-list-alt fa-lg"></i> </button> </div> <div> <button class="gridview button"> <i class="fas fa-th fa-lg"></i> </button> </div> <div> <button class="addjob button" onclick="addCandidate()"><i class="fa-solid fa-plus"></i> Candidate</button> </div> </div> </header> <div class="card-container"> </div> </div> <!-- Popupform Schedule Interview --> <div class="interviewDetailsPopup" id="interviewDetailsPopup"> <div class="formPopup" id="popupForm"> <div class="formContainer"> <p> Select a job posting to shortlist</p> <div class="form-actions"> <div class="field-height"> <div class="control"> <select id="interviewer" class="filter"> </select> </div> </div> </div> <div class="buttonConatiner"> <button class="btn submit qaf-btn-primary" onclick=" savepopForm()">Save</button> <button type="button" class="btn cancel qaf-btn-primary" onclick="closeForm()">Cancel</button> </div> </div> </div> </div>`,
    IsFirstComponent: true
  },

  {
    Title: 'Job Posting',
    Icons: "fa-podcast",
    URL: `pages/jobposting`
  },

  {
    Title: 'Setting',
    Icons: "fa-cog",
    URL: `recruitment/recruitment-setting`,
    Iframe: true

  },
  {
    Title: 'Customer',
    Icons: "fa-users",
    URL: `crm/crm-customer-directory`,
    Iframe: true

  },
  {
    Title: 'Contact',
    Icons: "fa-phone",
    URL: `crm/crm-contact-directory`,
    Iframe: true
  },
  {
    Title: 'Vendor',
    Icons: "fa-id-card-o",
    URL: `pages/vendor`
  },
  // {
  //   Title: 'Manage Timesheet',
  //   Icons: "fa-calendar",
  //   URL: `pages/managetimesheet`
  // },
  {
    Title: 'Resources',
    Icons: "fa-crosshairs",
    URL: `pages/resources`

  },
]

let qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    document.getElementById('menu').data = menuList
    cancle();
    popup();
    getcandidateList('');
    searchValue();
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

function addCandidate() {
  if (window.QafPageService) {
    window.QafPageService.AddItem("Candidate", function () {
      getcandidateList();
    });
  }
}

function openview(RecordID) {
  window.QafPageService.ViewItem("Candidate", RecordID, function () {
  });
}
function openEdit(RecordID) {
  window.QafPageService.EditItem("Candidate", RecordID, function () {
    getcandidateList();
  });
}

function getInitials(firstName, lastName) {
  if (!firstName && !lastName) {
    return "No Name";
  } else {
    var firstInitial = firstName ? firstName.charAt(0) : "";
    var lastInitial = lastName ? lastName.charAt(0) : "";

    // Return the initials
    return firstInitial + lastInitial;
  }
}



function searchValue() {
  let searchInput = document.getElementById("search");
  searchInput.addEventListener("keyup", function (event) {
    let searchCancle = document.getElementById('cancelSearch')
    if (searchInput.value == "") {
      searchCancle.style.display = 'none';
    }
    else {
      searchCancle.style.display = 'block';
    }
    event.preventDefault();
    if (event.keyCode === 13) {
      handleEnterKeyPress();
    }
  });
}

function handleEnterKeyPress() {
  let searchCancle = document.getElementById('cancelSearch')
  if (searchCancle) {
    searchCancle.style.display = 'block'
  }
  let searchValue = document.getElementById("search").value;
  let whereClause = ``;
  if (searchValue) {
    whereClause = ("FirstName<contains>'" + searchValue + "'<OR>LastName<contains>'" + searchValue + "'<OR>Email<contains>'" + searchValue + "'");
    getcandidateList(whereClause);
  }

}

function cancelSearch() {

  let searchCancle = document.getElementById('cancelSearch')
  if (searchCancle) {
    searchCancle.style.display = 'none'
  }
  var searchInput = document.getElementById("search");
  searchInput.value = '';
  let whereClause = "";
  getcandidateList(whereClause);

}

function cancle() {
  let searchCancle = document.getElementById('cancelSearch')
  if (searchCancle) {
    searchCancle.style.display = 'none'
  }
}


function popup() {
  let interviewDetailsPopup = document.getElementById('interviewDetailsPopup')
  if (interviewDetailsPopup) {
    interviewDetailsPopup.style.display = 'none'
  }
  let popupForm = document.getElementById("popupForm");
  if (popupForm) {
    popupForm.style.display = "none";
  }
}

function openForm(RecordId) {
  let candidateRecordID = RecordId;

  let interviewDetailsPopup = document.getElementById('interviewDetailsPopup')
  if (interviewDetailsPopup) {
    interviewDetailsPopup.style.display = 'block'
  }
  let popupForm = document.getElementById("popupForm");
  if (popupForm) {
    popupForm.style.display = "block";
  }
  getjobPosting(candidateRecordID);
}

function closeForm() {
  document.getElementById("popupForm").style.display = "none";
  let interviewDetailsPopup = document.getElementById('interviewDetailsPopup')
  if (interviewDetailsPopup) {
    interviewDetailsPopup.style.display = 'none'
  }
}

function getjobPosting(candidate) {
  let candidateRecordID = candidate;
  employeeList = []
  let objectName = "Job_Posting";
  let list = 'JobID,JobTitle,RecordID'
  let fieldList = list.split(",")
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = ``;
  let orderBy = "true"
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobposting) => {
    if (Array.isArray(jobposting) && jobposting.length > 0) {
      employeeList = jobposting
      let interviewerDropdown = document.getElementById('interviewer');
      let options = `<option value=''>Select Job Post</option>`
      if (interviewerDropdown) {
        jobposting.forEach(job => {
          options += `<option value=${job.RecordID} data-value1="${candidateRecordID}">${job.JobID}-${job.JobTitle}</option>`
        })
        interviewerDropdown.innerHTML = options;
      }

    }
  });
}


function savepopForm() {
  
  let selectElement = document.getElementById("interviewer");
  var selectedOption = selectElement.options[selectElement.selectedIndex];
  let jobPost = selectedOption.value;
  var CandidateId = selectedOption.getAttribute("data-value1");
  let objectName = "Candidate";

  console.log(jobPost)

  let list = "RecordID,FirstName,LastName,,Mobile,Email,CurrentLocation,Expectedsalary,YearsofExperience,NoticePeriod,CurrentLocation,Presentsalary,PreferredLocation,HighestQualification,Skill,PhotoUrl";
  let orderBy = "";
  let whereClause =`RecordID='${CandidateId}'`; 
  let fieldList = list.split(";#")
  let pageSize = "20000";
  let pageNumber = "1";
  let object={};
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((candidate) => {
    if (Array.isArray(candidate) && candidate.length > 0) {
      console.log(candidate);
      let shortListcandidate = candidate[0];
  
      let object = {
        Candidate: shortListcandidate.RecordID+";#"+shortListcandidate.FirstName+" "+shortListcandidate.LastName,
        Email: shortListcandidate.Email,
        ContactNumber: shortListcandidate.Mobile,
        JobPost:jobPost,
        TotalExperience: shortListcandidate.YearsofExperience,
        CurrentSalary: shortListcandidate.Presentsalary,
        ExpectedSalary: shortListcandidate.Expectedsalary,
        NoticePeriod: shortListcandidate.NoticePeriod,
        HighestQualification: shortListcandidate.HighestQualification,
      };
      
    save(object, "Job_Tracker")
    alert("Record Save")
    closeForm();
    }
 
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
    intermidiateRecord.RecordID = null;
    intermidiateRecord.RecordFieldValues = recordFieldValueList;
    window.QafService.CreateItem(intermidiateRecord).then(response => {
     getcandidateList()
      resolve({
        response
      })
    });
  }
  )

}

function whatsAppClick(row) {
  let Mobile= row;
  console.log(Mobile);
  let Message = "Hi There";
  if(Mobile){
    let link = `https://wa.me/${Mobile}?text=${Message}`;
    window.open(link, '_blank');

  }
 
 
}


function getcandidateList(whereClause) {
  const myContent = document.querySelector(".card-container");
  let html = "";
  let objectName = "Candidate";
  let list = "RecordID,FirstName,LastName,,Mobile,Email,CurrentLocation,Expectedsalary,YearsofExperience,NoticPeriod,CurrentLocation,Presentsalary,PreferredLocation,HighestQualification,Skill,PhotoUrl";
  let orderBy = "";
  let fieldList = list.split(";#")
  let pageSize = "20000";
  let pageNumber = "1";
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((candidateList) => {
    if (Array.isArray(candidateList) && candidateList.length > 0) {
      let propertiesToSplit = ["CurrentLocation", "PreferredLocation", "Skill", "HighestQualification"];
      let updatedJob = splitIdentifiers(candidateList, propertiesToSplit);      
      const showInHtml = updatedJob.forEach((candidate, index) => {

        html += `  
      
      <div class="card">
      <div class="main">
        <div class="profile-details">
          <div class="row1">
            <div class="profile-photo">
              <!-- Circular profile photo goes here -->
              <!--<img src="${candidate.PhotoUrl == null ? "" : candidate.PhotoUrl}" alt=""/>-->
              <span>${getInitials(candidate.FirstName, candidate.LastName)}</span>
            </div>
          </div>
          <div class="row2">
            <div class="column">
              <div class="name">
                <p>${candidate.FirstName == null ? "" : candidate.FirstName}&nbsp${candidate.LastName == null ? "" : candidate.LastName}</p>
              </div>
              <div class="experiance">
                <p>₹&nbsp;${candidate.Expectedsalary == null ? "" : candidate.Expectedsalary}&nbsp;|&nbsp;${candidate.YearsofExperience == null ? "" : candidate.YearsofExperience}Y&nbsp;|&nbsp; ${candidate.NoticePeriod == null ? "" : candidate.NoticePeriod}M &nbsp;|&nbsp; ${candidate.CurrentLocation == null ? "" : candidate.CurrentLocation}</p>
              </div>
            </div>
            <div class="contact">
              <div class="number">
                <p><i class="fas fa-mobile-alt"></i>&nbsp;Mobile: ${candidate.Mobile == null ? "" : candidate.Mobile}</p>
              </div>
              <div class="email">
                <p><i class="fas fa-envelope"></i>&nbsp;Email: ${candidate.Email == null ? "" : candidate.Email}</p>
              </div>

            </div>
          </div>
          <div class="row3">
            <div>
              <button onclick="openForm('${candidate.RecordID}')" class="shortlist-button">Shortlist</button>
            </div>
          </div>
        </div>
        <div class="job">
          <p><em>Current Salary:</em>&nbsp; <span>₹&nbsp;${candidate.Presentsalary == null ? "" : candidate.Presentsalary}</span></p>
          <p><em>Pref Locations</em>&nbsp; <span>${candidate.PreferredLocation == null ? "" : candidate.PreferredLocation}</span></p>
          <p><em>Qualification:</em>&nbsp; <span>${candidate.HighestQualification == null ? "" : candidate.HighestQualification}</span></p>
          <p><em>Skill:</em>&nbsp;<span>${candidate.Skill == null ? "" : candidate.Skill}
          </span></p>
        </div>
      </div>
      <hr>
      <div class="link-buttons">
        <p class="envelop"> <a href="mailto:{${candidate.Email}}" target="_blank"><i class="fas fa-envelope"></i> </a></p>

        <p class="whatsapp" onclick="whatsAppClick('${candidate.Mobile}')"><i class="fab fa-whatsapp"></i></p>
        <p class="editjob btn-link"onclick="openEdit('${candidate.RecordID}')">
          <i class="fa fa-pencil" aria-hidden="true"></i>
        </p>
      </div>
    </div> `
    });     
      myContent.innerHTML = html;
    }
    else {
      html += `
      <div class="nodata">No Candidate Found</div>`
    }
    myContent.innerHTML = html;

  })
};

