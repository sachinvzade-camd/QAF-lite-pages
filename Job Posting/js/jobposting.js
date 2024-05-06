var menuList=[
  {
      Title:'Requisition',
      Icons:"fa-user-plus",
      URL:`pages/candidaterequisition`,
  },
  {
      Title:'Candidate Search',
      Icons:"fa-search",
      URL:`pages/candidatesearch`,
  },
  {
      Title:'Job Posting',
      Icons:"fa-podcast",
      URL:``,
      Html:`  <header> <div class="title"> <p>Job Posting</p> </div> <div class="search-bar-container"> <input type="text" class="search-bar" placeholder="Search..."> </div> <div class="header-button"> <div> <button class="button"> <i class="fas fa-list-alt fa-lg"></i></button> </div> <div> <button class="button"> <i class="fas fa-th fa-lg"></i></button> </div> <div> <button class="button" onclick="addJob()"><i class="fa-solid fa-plus"></i>Job</button> </div> </div> </header> <div class="row"> <div class="gridview"> </div> </div>`,
      IsFirstComponent:true
      
  },
  {
      Title:'Setting',
      Icons:"fa-cog",
      URL:`recruitment/recruitment-setting`,
      Iframe:true

  },
  {
      Title:'Customer',
      Icons:"fa-users",
      URL:`pages/customers`,
  },
  {
      Title:'Contact',
      Icons:"fa-phone",
      URL:`pages/contact`,
  },
  {
      Title:'Vendor',
      Icons:"fa-id-card-o",
      URL:`pages/vendor`
  },
  {
      Title:'Manage Timesheet',
      Icons:"fa-calendar",
      URL:`pages/managetimesheet`
  },
  {
      Title:'Resources',
      Icons:"fa-crosshairs",
      URL:`pages/resources`,
      
  },
]



let qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    document.getElementById('menu').data=menuList
    getjobdetailsList();
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

function addJob() {
  if (window.QafPageService) {
    window.QafPageService.AddItem("Job_Posting", function () {
      getjobdetailsList();
    });
  }
}

function openview(RecordID){
  window.QafPageService.ViewItem("Job_Posting", RecordID, function(){
  });
}
function openEdit(RecordID){
  window.QafPageService.EditItem("Job_Posting", RecordID, function(){
    getjobdetailsList();
  });
}

function getjobdetailsList() {
let date=new Date()
  let objectName = "Job_Posting";
  let list = "JobID,JobTitle,RecordID,JobLevel,Location,RequiredSkills,EmployeeType,Designation,RelevantExperience,YearsofExperience,PostingExpiresOn";
  // let list="*";
  let orderBy = "";
  let whereClause = `PostingExpiresOn>='${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}'`;
  let fieldList = list.split(";#")
  let pageSize = "20000";
  let pageNumber = "1";
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobPosts) => {
    if (Array.isArray(jobPosts) && jobPosts.length > 0) {

      let propertiesToSplit = ["Location","JobLevel", "Designation", "RequiredSkills"];
      let updatedJob = splitIdentifiers(jobPosts, propertiesToSplit);
      const myContent = document.querySelector(".gridview"); let html = "";
      const showInHtml = updatedJob.forEach((job, index) => {
        html += `  
        
      <div class="card">
      <div class="card_body">
      <div class="card-text"><a href="pages/tracker?jobID=${job.RecordID}" target="_blank">${job.JobTitle == null ? "" : job.JobTitle}</a></div>
      
      <p><em>Experience:</em>&nbsp; <span>${job.RelevantExperience == null ? "" : job.RelevantExperience}&nbsp;</span></p>
      <p><em>Location:</em>&nbsp; <span>${job.Location == null ? "" : job.Location}</span></p>
      <p><em>Job Role:</em>&nbsp; <span>${job.JobLevel == null ? "" : job.JobLevel}</span></p>
      <p class="skilloverflow"><em>Skill:</em> <span>${job.RequiredSkills == null ? "" : job.RequiredSkills}</span></p>
      <p><em>Employment Type:</em>&nbsp; <span>${job.EmployeeType== null ? "" : job.EmployeeType}</span></p>
     
      <div class="link-buttons">
      <p class="viewjob btn btn-link"><a href="pages/tracker?jobID=${job.RecordID}" target="_blank">View Details</a></p>
      <p class="editjob btn btn-link">  <i class="fa fa-pencil" onclick="openEdit('${job.RecordID}')" aria-hidden="true"></i></p>
        </div>
        </div>
  </div>  
          `
      });

    myContent.innerHTML = html;
    }
  })
};

 