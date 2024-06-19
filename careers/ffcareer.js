

var EmployeeType;
var jobLocation=[];
var updatedJob = [];
var searchValue = document.getElementById("search")
var job_type = document.getElementById("job_type")
var job_location = document.getElementById("job_location")
var job_category = document.getElementById("job_category")

let qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    getjobLocation()
    clearInterval(qafServiceLoaded);
  }
}, 10);

function getjobLocation() {
  jobLocation = []
  let objectName = "Location";
  let list = 'RecordID,Name,City';
  let fieldList = list.split(",");
  let pageSize = "20000";
  let pageNumber = "1"
  let orderBy = "true";
  let whereClause = "";
  return window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((locationList) => {
    if (Array.isArray(locationList) && locationList.length > 0) {
      jobLocation = locationList;
    }
    getObjectID();
    setLocation();
  });
}

function getObjectID() {
  window.QafService.GetObjectById('Job_Posting').then((responses) => {
    responses[0].Fields.forEach(val => {
      if (val.InternalName === 'EmployeeType') {
        let jobType = document.getElementById('job_type');
        let options = `<option value=''>All Job Type</option>`;
        if (jobType) {

          val.Choices.split(";#").forEach(choice => {
            options += `<option value='${choice}'>${choice}</option>`;
          });
          jobType.innerHTML = options;
        }
      }
      if (val.InternalName === 'JobCategory') {
        let jobCategory = document.getElementById('job_category');
        let options = `<option value=''>All Job Category</option>`;
        if (jobCategory) {
          val.Choices.split(";#").forEach(choice => {
            options += `<option value='${choice}'>${choice}</option>`;
          });
          jobCategory.innerHTML = options;
        }
      }
    });
    getJobPosting();
  });
}

function setLocation() {
  let jobLocations = document.getElementById('job_location');
  let options = `<option value=''>All Job Location</option>`;
  if (jobLocations) {
    jobLocation.forEach(loc => {
      if (loc.City) {
        options += `<option value="${loc.RecordID}">${loc.City}</option>`;
      }
    });
    jobLocations.innerHTML = options;
  }
}

function getJobPosting() {
  updatedJob = []
  TotalJob = "";
  let date = new Date()
  let startDate = moment(date).format('YYYY/MM/DD');;
  let objectName = "Job_Posting";
  let list = "RecordID,JobID,JobTitle,PostingExpiresOn,IsPublish,Location,RelevantExperience,EmployeeType,JobCategory,YearsofExperience,YearsofExperienceMaximum,JobRole";
  let orderBy = "";
  whereClause = "(PostingExpiresOn>='" + startDate + "'<OR>PostingExpiresOn='')<<NG>>(IsPublish='true')";
  let fieldList = list.split(",")
  let pageSize = "20000";
  let pageNumber = "1";
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobsList) => {
    if (Array.isArray(jobsList) && jobsList.length > 0) {
      updatedJob = jobsList
      displayResults(updatedJob)
    }
    else {
      displayResults(updatedJob)
    }
  });

}

function displayResults(results) {
  
  let myContent = document.querySelector(".jobs-container");
  let html = "";
  myContent.classList.add("grid");
  myContent.classList.remove("nodata");
  if (results && results.length > 0) {
    number0fJobs(results.length)
    results.forEach(job => {

      let yearsOfExperience = job.YearsofExperience;
      let yearsOfExperienceMaximum = job.YearsofExperienceMaximum;
      if (yearsOfExperience === 0 && yearsOfExperienceMaximum === 0) {
        experienceDisplay = "0 Years";
      } else {
        experienceDisplay = `${yearsOfExperience} - ${yearsOfExperienceMaximum} Years`;
      }
      html += `
            <div class="job-item">
                <h3 class="job-Title">
                    <a href="pages/jobdetails?jobID=${job.RecordID}" class="job-link">${job.JobTitle ? job.JobTitle : ""}</a>
                </h3>
                <div class="job-overview">
                    <p >${job.JobRole ? job.JobRole : ""}</p>
                </div>
                <div class="job-bottom">
                    <div class="job-bottom-item pull-left">
                        <strong class="primary-color">Experience:</strong>
                        <span class="experience">${experienceDisplay ? experienceDisplay : ""}</span>
                    </div>
                </div>
                <div class="job-bottom clear">
                    <div class="job-bottom-item pull-left">
                        <strong class="primary-color">Location:</strong>
                        <span>${job.Location ? job.Location.split(";#")[1] : ""}</span>
                    </div>
                </div>
            </div>   
          `
    })
    myContent.innerHTML = html;

  }
  else {
    number0fJobs(results.length)
    myContent.classList.remove("grid");
    myContent.classList.add("nodata");
    html += `
            <div class="nodata">No Job Found</div>`
  }
  myContent.innerHTML = html;
}

function number0fJobs(num) {
  if (num > 0) {
    let filteredJob = document.getElementById("filteredJob");
    let NumberOfJobs = document.getElementById("NumberOfJobs");
    if (NumberOfJobs) {
      NumberOfJobs.style.display = 'block';
      NumberOfJobs.textContent = `${num} Jobs Found`;
    }
    if (filteredJob) {
      if (num > 0) {
        filteredJob.style.display = 'block';
        filteredJob.textContent = `Displayed Here: 1 - ${num} Jobs`;
      }
      else {
        filteredJob.style.display = 'block';
        filteredJob.textContent = `Displayed Here: ${num} - ${num} Jobs`;
      }


    }
  }
  else {
    let filteredJob = document.getElementById("filteredJob");
    let NumberOfJobs = document.getElementById("NumberOfJobs");
    if (NumberOfJobs) {
      NumberOfJobs.style.display = 'none';
    }
    if (filteredJob) {
      filteredJob.style.display = 'none';
    }

  }
}

function removeAllValues() {
  if (searchValue) {
    searchValue.value = ''

  } if (job_type) {
    job_type.value = ''

  }
  if (job_location) {
    job_location.value = ''
  }
  if (job_category) {
    job_category.value = ''
  }
  displayResults(updatedJob)
}

function SearchJob() {
  let jobTitle = searchValue.value.toLowerCase();
  let employeeType = job_type.value;
  let location = job_location.value;
  let jobCategory = job_category.value;
  let currentLocation = "";
  if (location) {
    let Location = jobLocation.filter(lc => lc.RecordID === location);
    if (Location && Location.length > 0) {
      currentLocation = Location[0].City
    }
  }
  let results = updatedJob.filter(job => {
    return (jobTitle === "" || (job.JobTitle && job.JobTitle.toLowerCase().includes(searchValue.value.toLowerCase()))) &&
      (employeeType === "" || job.EmployeeType === employeeType) &&
      (location === "" || (job.Location && job.Location.includes(currentLocation))) &&
      (jobCategory === "" || job.JobCategory === jobCategory);
  });

  displayResults(results);
}