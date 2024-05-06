let URL = window.location.href
let paramString = URL.split('?')[1];
const urlParams = new URLSearchParams(paramString);
const jobID = urlParams.get('jobID');
var tableData = ""
var jobDetails;
var interviewTime;
var employeeList = []
var interviewmodeSelect

var actionList = ["Shortlist", "Schedule Interview", "Send to customer for shortlisting", "Reject"]
var trackerFieldList = [
  {
      InternalName: "Candidate",
      DisplayName: "Candidate",
      Type: "Lookup"
  },
  {
      InternalName: "CurrentStatus",
      DisplayName: "Current Status",
  },
  {
      InternalName: "CurrentLocation",
      DisplayName: "Current Location",
      Type: "Lookup"
  },
  {
      InternalName: "ContactNumber",
      DisplayName: "Contact Number",
  },
  {
      InternalName: "Email",
      DisplayName: "Email",
  },
  {
      InternalName: "JobPost",
      DisplayName: "Job Post",
      Type: "Lookup"
  },
  {
      InternalName: "Source",
      DisplayName: "Source",
  }
]
var jobTrackerList = []

var menuList = [
  {
      Title: 'Requisition',
      Icons: "fa-user-plus",
      URL: `recruitment/Candidate-Requisition`,
      Iframe: true,
  },
  {
      Title: 'Candidate Search',
      Icons: "fa-search",
      URL:`pages/candidatesearch`,
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
  //     Title: 'Manage Timesheet',
  //     Icons: "fa-calendar",
  //     URL: `pages/managetimesheet`
  // },
  {
      Title: 'Resources',
      Icons: "fa-crosshairs",
      URL: `pages/resources`,
  },
  {
      Title: '',
      Icons: "",
      URL: ``,
      Display: false,
      Html: ` <div class="container-fluid"> <div class="page row"> <div class="page-content col-md-12 "> <div class="tracker-main"> <div class="jobDisplay" id="jobdisplay"></div> <div class="tracker-header"> <div class="header"> <div class="table-title"><span>Tracker </span> </div> <div class="dropdown" id="action-button"> <button onclick="myFunction()" class="dropbtn qaf-btn-primary">Action</button> <div id="myDropdown" class="dropdown-content"> </div> </div> </div> <div> <button class="qaf-btn-primary  btn button" onclick="add_To_Job_Tracker()">+ Candidate</button> </div> </div> <div style="overflow-x:auto;"> <table id="table"> </table> </div> </div> </div> </div> </div> <!-- PopFor Shortlist --> <div class="interviewDetailsPopup" id="detailsFormShortList"> <div class="formPopup" id="popupFormShortlist"> <div class="formContainer"> <p>Do you want to perform the action: Shortlist?</p> <button class="btn submit" onclick="actionForInterviewer('Shortlist')">Yes</button> <button type="button" class="btn cancel" onclick="closeForm()">No</button> </div> </div> </div> <!-- Popupform Schedule Interview --> <div class="interviewDetailsPopup" id="interviewDetailsPopup"> <div class="formPopup" id="popupForm"> <div class="formContainer"> <p>Do you want to perform the action: Schedule Interview?</p> <div class="form-actions"> <div class="field-height"> <div class="control-label-planner-filed"> Interview Mode </div> <div class="control"> <select id="interviewMode" class="filter" onchange="changeInterviewMode()"> <option value='F2F'>F2F</option> <option value='Online Interview'>Online Interview</option> </select> </div> </div> <div id="meetingUrldiv"> <div class="field-height"> <div class="k control-label-planner-filed"> Meeting URL </div> <div class="control"> <input type="text" id="meetingurl" placeholder="Meeting Url" name="meetingurl"> </div> </div> </div> <div class="field-height"> <div class=" proper control-label-planner-filed"> Interviewer </div> <div class="control"> <select id="interviewer" class="filter"> </select> </div> </div> <div class="field-height"> <div class="control-label-planner-filed"> Interview Date </div> <div class="control"> <input type="datetime-local" id="interviewDate" name="interviewDate" class="filter"> </div> </div> </div> <button class="btn submit" onclick="submitScheduleForm()">Submit</button> <button type="button" class="btn cancel" onclick="closeForm()">Close</button> </div> </div> </div> <!-- PopForm Send to customer for shortlisting --> <div class="interviewDetailsPopup" id="detailsFormSendCustomer"> <div class="formPopup" id="popupFormSendCustomer"> <div class="formContainer"> <p>Do you want to perform the action: Send to customer for shortlisting?</p>  <button class="btn submit" onclick="actionForInterviewer('Reject')">Yes</button> <button type="button" class="btn cancel" onclick="closeForm()">No</button> </div> </div> </div> <!-- PopForm Reject --> <div class="interviewDetailsPopup" id="detailsFormReject"> <div class="formPopup" id="popupFormReject"> <div class="formContainer"> <p>Do you want to perform the action: Reject?</p>  <button class="btn submit" onclick=" actionForInterviewer('Reject')">Yes</button> <button type="button" class="btn cancel" onclick="closeForm()">No</button> </div> </div> </div>`,
      IsFirstComponent: true
  },
]

let qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    document.getElementById('menu').data = menuList;
      oninit()
      clearInterval(qafServiceLoaded);
  }
}, 10);

function oninit() {
  let dropdown = document.getElementById('myDropdown');
  let actionmenu = ''
  if (dropdown) {
      actionList.forEach(action => {
          actionmenu += `<a onclick="openTabMenu('${action}')">${action}</a>`
      })
      dropdown.innerHTML = actionmenu
      getJobDetails()
      getTracker()
  }
  let interviewDetailsPopup = document.getElementById('detailsFormShortList')
  let interviewDetailsPopup2 = document.getElementById('interviewDetailsPopup')
  let interviewDetailsPopup3 = document.getElementById('detailsFormSendCustomer')
  let interviewDetailsPopup4 = document.getElementById('detailsFormReject')

  if (interviewDetailsPopup2) {
      interviewDetailsPopup2.style.display = 'none'
  }
  if (interviewDetailsPopup3) {
      interviewDetailsPopup3.style.display = 'none'
  }
  if (interviewDetailsPopup4) {
      interviewDetailsPopup4.style.display = 'none'
  }
  if (interviewDetailsPopup) {
      interviewDetailsPopup.style.display = 'none'
  }
}
function getTracker() {
  let trackerfields = trackerFieldList.map(a => a.InternalName)
  trackerfields = [...trackerfields, 'NextAvailableDate', 'AlternatePhoneNumber', 'CommunicationSkilloutof5', 'FinalStatus', 'ReasonforJobChange', 'Candidate', 'CurrentLocation', 'Date', 'Email', 'Source', 'Recruiter', 'CurrentStatus', 'ContactNumber', 'JobPost', 'Vendor', 'ReferredByEmployee', 'TotalExperience', 'RelevantExperience', 'USAccountingExperience', 'QuickbooksExperience', 'TeamHandlingExperience', 'ClientHandlingExperience', 'CurrentSalary', 'ExpectedSalary', 'NoticePeriod', 'Company', 'CurrentRole', 'Designation', 'MISReports', 'ClientVisit', 'LateWorking', 'FinalisationofAccountsonTallyS', 'ExcelRating', 'GSTTDSReturns', 'ZohoRating', 'TallyRating', 'OtherSkills', 'Resume', 'HighestQualification', 'Percentagein12th', 'PercentageinPostGraduation', 'Percentagein10th', 'PercentageinGraduation', 'ProfessionalCourse', 'HWTestTargetDate', 'Feedback', 'RejectionReason', 'InterviewStartDate', 'ExtensionExpiryDate', 'HWTestExtensionReason', 'IsExtensionRequest', 'CurrentInterviewer']
  jobTrackerList = []
  let objectName = "Job_Tracker";
  let list = trackerfields.join(",")
  let fieldList = list.split(",")
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = `JobPost='${jobID}'`;
  let orderBy = "true"
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((trackers) => {
      let actionbutton = document.getElementById('action-button')
      if (actionbutton) {
          document.getElementById('action-button').style.display = 'none'
      }
      if (Array.isArray(trackers) && trackers.length > 0) {
          jobTrackerList = trackers
          addHeaderField()

      }else{
        addHeaderField()
      }
  });
}



function add_To_Job_Tracker() {
  if (window.QafPageService) {
      window.QafPageService.AddItem("Candidate", function () {
          oninit();
      });
  }
}

function getJobDetails() {
  let objectName = "Job_Posting";
  let list = "RecordID,JobID,JobTitle,Designation,JobLevel,RequiredSkills,Location,Department,EmployeeType,Customer"
  let fieldList = list.split(",")
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = `RecordID='${jobID}'`;
  let orderBy = "true"
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobPosts) => {
      
      if (Array.isArray(jobPosts) && jobPosts.length > 0) {
          jobDetails = jobPosts[0]
          document.getElementById('jobdisplay').innerHTML = `${jobDetails.JobID}-${jobDetails.JobTitle}`
      }
      document.getElementById("interviewDate").addEventListener("change", function () {
          interviewTime = new Date(this.value);
      });
  });
}

function addHeaderField() {
  let startTag = '<tr>'
  let endTag = '</tr>'
  tableData = `${startTag} <th class="action-row-checkbox"></th>
  <th class="action-row">Action</th>`;
  trackerFieldList.forEach(val => {
      tableData += `<th>${val.DisplayName}</th>`
  })
  tableData += endTag
  addRowField()
}
function addRowField() {
  let startTag = '<tr>'
  let endTag = '</tr>'
  if(jobTrackerList&&jobTrackerList.length>0){
  jobTrackerList.forEach(row => {
      tableData += `${startTag}<td class="action-row-checkbox"><input type="checkbox" id="vehicle1" onchange="toggleCheckbox('${row.RecordID}',this)"></td>
    <td class="action-row"><i class="fa fa-eye" aria-hidden="true" onclick="openview('${row.RecordID}')"></i> <i class="fa fa-pencil" aria-hidden="true" onclick="openEdit('${row.RecordID}')"></i>
    </td>`;
      trackerFieldList.forEach(val => {
          tableData += `<td>${formatValue(row[val.InternalName], val)}</td>`
      })
      tableData += endTag
  })}else{
        // trackerFieldList.forEach(val => {
            tableData += `<tr><td colspan="${trackerFieldList.length+2}"><p class='no-record'>No Record Found</p></td></tr>`
        // })
      
  }
  let table = document.getElementById('table');
  if (table) {
      table.innerHTML = tableData
  }

}
function formatValue(value, objectDefination) {
  if (value) {
      if (objectDefination.Type && (objectDefination.Type.toLowerCase() === 'lookup')) {
          if (value && value.indexOf(';#') !== -1) {
              let values = value.split(';#');
              let oddArray = [];
              values.forEach((v, idx) => {
                  oddArray.push(idx);
              })
              let odds = oddArray.filter(n => n % 2);
              let returnItems = [];
              odds.forEach((d) => {
                  returnItems.push(values[d]);
              })
              return returnItems.join(';');
          }
      }
      return value
  }
  return ""
}
function openTabMenu(url) {
  let actionSelected = url;
  if (actionSelected.toLowerCase() === "Shortlist".toLowerCase()) {
      let recordlist = jobTrackerList.filter(a => a.IsChecked);
      if (recordlist && recordlist.length > 0) {
          console.log("RecordId Of Selected Candidate",recordlist)
          let interviewDetailsPopup = document.getElementById('detailsFormShortList')
          if (interviewDetailsPopup) {
              interviewDetailsPopup.style.display = 'block'
          }
          openFormShortlist();
      }
      else {
          alert("Please select candidate")
      }

  }
  else if (actionSelected.toLowerCase() === "Schedule Interview".toLowerCase()) {
      // scheduleInterview(url)
      let recordlist = jobTrackerList.filter(a => a.IsChecked);
      if (recordlist && recordlist.length > 0) {

          let meetingUrldiv = document.getElementById('meetingUrldiv')
          let interviewDetailsPopup = document.getElementById('interviewDetailsPopup')
          if (meetingUrldiv) {
              meetingUrldiv.style.display = 'none'
          }
          if (interviewDetailsPopup) {
              interviewDetailsPopup.style.display = 'block'
          }
          getInterviewer()
      }
      else {
          alert("Please select candidate")
      }
  }
  else if (actionSelected.toLowerCase() === "Send to customer for shortlisting".toLowerCase()) {
      let recordlist = jobTrackerList.filter(a => a.IsChecked);
      if (recordlist && recordlist.length > 0) {
          let interviewDetailsPopup = document.getElementById('detailsFormSendCustomer')
          if (interviewDetailsPopup) {
              interviewDetailsPopup.style.display = 'block'
          }
          openFormSendCustomer()
      }
      else {
          alert("Please select candidate")
      }
      // resourceAdd(actionSelected)
  }
  else if (actionSelected.toLowerCase() === "Reject".toLowerCase()) {
      let recordlist = jobTrackerList.filter(a => a.IsChecked);
      if (recordlist && recordlist.length > 0) {
          let interviewDetailsPopup = document.getElementById('detailsFormReject')
          if (interviewDetailsPopup) {
              interviewDetailsPopup.style.display = 'block'
          }
          openFormReject();
      }
      else {
          alert("Please select candidate")
      }
      // resourceAdd(actionSelected)
  }
  else {
      addtotrackerAction(actionSelected)
  }
}


function actionForInterviewer(url) {
  
  let actionSelected = url;
  if (actionSelected.toLowerCase() === "Shortlist".toLowerCase()) {

      let recordlist = jobTrackerList.filter(a => a.IsChecked);
      if (recordlist && recordlist.length > 0) {
          
          resourceAdd(actionSelected)
          closeForm()

      }
      else {
          alert("Please select candidate")
      }
  }
  else if (actionSelected.toLowerCase() === "Send to customer for shortlisting".toLowerCase()) {
      let recordlist = jobTrackerList.filter(a => a.IsChecked);
      if (recordlist && recordlist.length > 0) {
          
          resourceAdd(actionSelected)
          closeForm()
      }
      else {
          alert("Please select candidate")
      }
  }
  else if (actionSelected.toLowerCase() === "Reject".toLowerCase()) {
      let recordlist = jobTrackerList.filter(a => a.IsChecked);
      if (recordlist && recordlist.length > 0) {
          resourceAdd(actionSelected)
          closeForm()
      }
      else {
          alert("Please select candidate")
      }
  }

  else {
      addtotrackerAction(actionSelected)
  }
}


function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}
function toggleCheckbox(val, check) {
  jobTrackerList.forEach(record => {
      if (record.RecordID === val) {
          record['IsChecked'] = check.checked
      }
  })

  let checkUser = jobTrackerList.filter(a => a.IsChecked)
  if (checkUser && checkUser.length > 0) {
      document.getElementById('action-button').style.display = 'block'
  } else {
      document.getElementById('action-button').style.display = 'none'
  }
}

function addtotrackerAction(action) {
  let recordlist = jobTrackerList.filter(a => a.IsChecked);
  if (recordlist && recordlist.length > 0) {
      recordlist.forEach(val => {
          let candidate = val.Candidate.split(";#")[1]
          let object = {
              TrackerRecordID: val.RecordID,
              FirstName: candidate.split(" ")[0],
              LastName: candidate.split(" ")[1],
              Candidate: val.Candidate.split(";#")[0],
              JobPosting: val.JobPost,
              RelevantExperience: val.RelevantExperience,
              CurrentInterviewer: val.CurrentInterviewer,
              Email: val.Email,
              InterviewRound: val.CurrentStatus.includes("Round-1") ? "1" : (val.CurrentStatus.includes("Round-2") ? "2" : (val.CurrentStatus.includes("Round-3") ? "3" : '0')),
              JobRole: formatValueLookup(jobDetails.JobLevel),
              Designation: formatValueLookup(jobDetails.Designation),
              Location: formatValueLookup(jobDetails.Location),
              Department: formatValueLookup(jobDetails.Department),
              RequiredSkills: formatValueLookup(jobDetails.RequiredSkills),
              EmployeeType: jobDetails.EmployeeType,
              Action: action,
              Recruiter: val.Recruiter,
          }
          save(object, 'Tracker_Action')
      })
  }
  else {
      alert("Please select candidate")
  }

}
function scheduleInterview(action) {
  let recordlist = jobTrackerList.filter(a => a.IsChecked);
  if (recordlist && recordlist.length > 0) {
      recordlist.forEach(val => {
          let recruiter = document.getElementById("interviewer");
          let meetingUrl = document.getElementById("meetingurl");
          let meetingsURLDisplay = "";
          let employee
          if (recruiter) {
              employee = [{ UserType: 1, RecordID: recruiter.value }];
          }
          if (meetingUrl.value) {
              let meetingsURL = {
                  link: meetingUrl.value,
                  displayName: "Interview Link"
              }
              meetingsURLDisplay = JSON.stringify(meetingsURL)
          }

          let object = {
              Candidate: val.Candidate,
              ContactNumber: val.ContactNumber,
              Email: val.Email,
              AppliedForJob: val.JobPost,
              InterviewMode: interviewmodeSelect,
              InterviewRound: action.includes("Round 1") ? "1" : (action.includes("Round 2") ? "2" : (action.includes("Round 3") ? "3" : action === 'Schedule Interview - Screening' ? 'Screening Round' : '')),
              Interviewer: JSON.stringify(employee),
              Actions: action,
              // InterviewStartDate: interviewStartDate,
              InterviewStartDate: interviewTime,
              Resume: val.Resume,
              MeetingURL: meetingsURLDisplay,
              JobRole: (jobDetails.JobLevel),
              Designation: formatValueLookup(jobDetails.Designation),
              Recruiter: val.Recruiter,
              NoticePeriod: val.NoticePeriod,
              TotalExperience: val.TotalExperience,
              RelevantExperience: val.RelevantExperience,
              CurrentSalary: val.CurrentSalary,
              ExpectedSalary: val.ExpectedSalary,
              CurrentRole: val.CurrentRole,
              Company: val.Company,
              CommunicationSkilloutof5: val.CommunicationSkilloutof5,
              CurrentLocation: val.CurrentLocation,
              HighestQualification: val.HighestQualification,
              Percentagein10th: val.Percentagein10th,
              Percentagein12th: val.Percentagein12th,
              PercentageinGraduation: val.PercentageinGraduation,
              PercentageinPostGraduation: val.PercentageinPostGraduation,
              ProfessionalCourse: val.ProfessionalCourse,
              Source: val.Source,
              Vendor: val.Vendor,
              OtherSkills: val.OtherSkills,
              ReasonforJobChange: val.ReasonforJobChange,
              Feedback: val.Feedback,
              ReferredByEmployee: JSON.stringify(employee),
          }
          save(object, 'Interview_Detail')
      })

  }
  else {
      alert("Please select candidate")
  }
}
function resourceAdd() {
  
  let recordlist = jobTrackerList.filter(a => a.IsChecked);
  if (recordlist && recordlist.length > 0) {
      recordlist.forEach(val => {
          let candidate = val.Candidate.split(";#")[1]
          let object = {
              FirstName: candidate.split(" ")[0],
              LastName: candidate.split(" ")[1],
              Candidate: val.Candidate,
              JobPost: val.JobPost,
              ContactNumber: val.ContactNumber,
              Address: val.Address,
              Email: val.Email,
              Customer: jobDetails.Customer
          }
          save(object, 'Recruitment_Resources')
      })
  }
  else {
      alert("Please select candidate")
  }
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
          getTracker()
          resolve({
              response
          })
      });
  })
}
function formatValueLookup(value) {
  if (value) {
      if (value && value.indexOf(';#') !== -1) {
          let values = value.split(';#');
          let oddArray = [];
          values.forEach((v, idx) => {
              oddArray.push(idx);
          })
          let odds = oddArray.filter(n => n % 2);
          let returnItems = [];
          odds.forEach((d) => {
              returnItems.push(values[d]);
          })
          return returnItems.join(';');
      }
      return value
  }
  return ""
}

function openview(RecordID) {
  window.QafPageService.ViewItem("Job_Tracker", RecordID, function () {
  });
}
function openEdit(RecordID) {
  window.QafPageService.EditItem("Job_Tracker", RecordID, function () {
      getTracker();
  });
}

function openForm() {
  document.getElementById("popupForm").style.display = "block";
}
function openFormShortlist() {
  document.getElementById("popupFormShortlist").style.display = "block";
}
function openFormSendCustomer() {
  document.getElementById("popupFormSendCustomer").style.display = "block";
}
function openFormReject() {
  document.getElementById("popupFormReject").style.display = "block";
}

function closeForm() {

  document.getElementById("popupFormShortlist").style.display = "none";
  let interviewDetailsPopupShotlist = document.getElementById('detailsFormShortList')
  if ( interviewDetailsPopupShotlist) {
      interviewDetailsPopupShotlist.style.display = 'none'
  }

  document.getElementById("popupForm").style.display = "none";
  let interviewDetailsPopup = document.getElementById('interviewDetailsPopup')
  if (interviewDetailsPopup) {
      interviewDetailsPopup.style.display = 'none'
  }

  document.getElementById("popupFormSendCustomer").style.display = "none";
  let interviewDetailsPopupSendcustomer = document.getElementById('detailsFormSendCustomer')
  if (interviewDetailsPopupSendcustomer) {
      interviewDetailsPopupSendcustomer.style.display = 'none'
  }

  document.getElementById("popupFormReject").style.display = "none";
  let interviewDetailsPopupReject = document.getElementById('detailsFormReject')
  if (interviewDetailsPopupReject) {
      interviewDetailsPopupReject.style.display = 'none'
  }
}

function submitScheduleForm() {
    
  scheduleInterview('Schedule Interview')
  closeForm()
}
function getInterviewer() {
  employeeList = []
  let objectName = "Employees";
  let list = 'FirstName,LastName'
  let fieldList = list.split(",")
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = ``;
  let orderBy = "true"
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
      if (Array.isArray(employees) && employees.length > 0) {
          employeeList = employees
          let interviewerDropdown = document.getElementById('interviewer');
          let options = `<option value=''>Select Interviewer</option>`
          if (interviewerDropdown) {
              employees.forEach(emp => {
                  options += `<option value=${emp.RecordID}>${emp.FirstName} ${emp.LastName}</option>`
              })
              interviewerDropdown.innerHTML = options;
          }

      }
      openForm()
  });
}

function changeInterviewMode() {
  let meetingUrldiv = document.getElementById('meetingUrldiv')
  if (meetingUrldiv) {
      meetingUrldiv.style.display = 'none'
  }
  let selectedMode = document.getElementById('interviewMode');
  interviewmodeSelect = selectedMode.value
  if (selectedMode.value === 'Online Interview') {
      let meetingUrldiv = document.getElementById('meetingUrldiv')
      if (meetingUrldiv) {
          meetingUrldiv.style.display = 'block'
      }
  }
}