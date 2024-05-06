var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = funFirstapiURL;
var sitHostURL='demtis.quickappflow.com'
var funFirstHostURL='inskferda.azurewebsites.net'
var hostName=funFirstHostURL
const urlParams = new URLSearchParams(window.location.search);
const recordID = urlParams.get('RecordID');
const InstanceID = urlParams.get('InstanceID');
const ObjectID = urlParams.get('ObjectID');
const PendingWithIDs = urlParams.get('PendingWithIDs');
var user;
var workflowActionButtons;
var workflowComment;
var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;
var chuserID;
let currentTab = 1
function showContent(tabId, tabNum, clickedButton) {
  selectedTab = tabNum
  let newTabValue = selectedTab - currentTab
  movingTabs(newTabValue);
  currentTab = selectedTab

  var allButtons = document.querySelectorAll('.tab-btn');
  allButtons.forEach(function (button) {
    button.classList.remove('isActive');
    button.style.fontWeight = 'normal';
  });
  clickedButton.classList.add('isActive');
  clickedButton.style.fontWeight = '600';
  clickedButton.style.color='#5f96d8;'

  var line = document.getElementById('actbtn');
  if (line) {
    line.style.borderBottom = 'none';
  }
  var tabBox = document.querySelector('.tab-box');
  var lineElement = document.querySelector('.line');
  var button = document.querySelector('[data-tab="' + tabId + '"]');

  // Hide all tab contents and adjust the line position
  var tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(function (content) {
    content.classList.remove('active');
  });
  var buttonRect = button.getBoundingClientRect();
  var tabBoxRect = tabBox.getBoundingClientRect();
  var offsetLeft = buttonRect.left - tabBoxRect.left;

  lineElement.style.width = button.offsetWidth + 'px';
  lineElement.style.transform = 'translateX(' + offsetLeft + 'px)';

  // Show the selected tab content
  var selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  switch (tabId) {
    case 'activity':
      handleActivity();
      break;
    case 'empdetails':
      handleNotes();
      break;
    default:
      break;
  }
}

function movingTabs(value) {
  const cards = document.querySelectorAll('.tab-content');
  cards.forEach((card, index) => {
    card.classList.remove('moving-left', 'moving-right');
    if (value > 0) {
      card.classList.add('moving-left');

    } else if (value < 0) {
      card.classList.add('moving-right');

    } else {
      card.classList.remove('moving-left', 'moving-right');
    }
  });
}

function LineAdjust() {
  var line = document.getElementById('actbtn');
  if (line) {
    line.style.borderBottom = '4px solid #311212';
  }
}

function handleActivity() {

}

function handleNotes() {
  getEmployeesSingleDetails()
}

let qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    user = getCurrentUser();
    getWorkflowActions()
    clearInterval(qafServiceLoaded);
  }
}, 10);

function toggleMenu() {
  var menu = document.getElementById('menu');
  if (menu.style.left === '-350px') {
    menu.style.left = '0';
  } else {
    menu.style.left = '-350px';
  }
}
function changePage(url){
  window.location.href=window.location.origin+url
}

function getEmployeesSingleDetails(){
  let objectName = "Employees";
  
  let list = ['EmployeeID', 'FirstName', 'LastName', 'DesignationName', 'ContactNumber', 'Department', 'OfficeExtension', 'CreatedByGUID'].join(",")
  let fieldList = list.split(",")
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = `RecordID='${chuserID?chuserID:regularizationrequestDetails.CreatedByGUID}'`;
  let orderBy = "false"
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
      if (Array.isArray(employees) && employees.length > 0) {
          employeesDetails = employees[0]
          document.getElementById('empdetails').innerHTML=`
          <div class="accordion-body">
          <div class="info bodyContent">
              <h6>Employee ID</h6>
              <p>${employeesDetails.EmployeeID?employeesDetails.EmployeeID:""}</p>
          </div>
          <div class="info bodyContent">
              <h6>First Name</h6>
              <p> ${employeesDetails.FirstName?employeesDetails.FirstName:""}</p>
          </div>
          <div class="info bodyContent">
              <h6>Last Name</h6>
              <p> ${employeesDetails.LastName?employeesDetails.LastName:""}</p>
          </div>
          <div class="info bodyContent">
              <h6>Contact Number </h6>
              <p>${employeesDetails.contactNumber?employeesDetails.contactNumber:""}</p>
          </div>
          <div class="info bodyContent">
              <h6>Designation</h6>
              <p>${employeesDetails.DesignationName?employeesDetails.DesignationName.split(";#")[1]:''}</p>
          </div>
          <div class="info bodyContent">
              <h6>Department</h6>
              <p>${employeesDetails.Department?employeesDetails.Department.split(";#")[1]:''}</p>
          </div>
          <div class="info bodyContent">
              <h6>Office Extension</h6>
              <p>${employeesDetails.officeExtension?employeesDetails.officeExtension:''}</p>
          </div>
      </div>
          `
      } 
  });
}
function userOrGroupFieldRecordID(id) {
  if (id) {
    if (id && id.includes("[{")) {
      return (JSON.parse(id))[0].RecordID;
    }
    else {
      return id && id.includes(";#") ? id.split(";#")[0] : id;
    }
  }
}
function updaterequest(){
  let comment=document.getElementById('comment')
  if(comment){
    workflowComment=comment.value
  }
 let  workflwAction = {
    instanceID: InstanceID,
    WFComments: workflowComment ? workflowComment : "",
    actionPerformed: 'UPDATE',
  }
  updateWorkflowAction(workflwAction)
}
function rejectrequest(){
  let comment=document.getElementById('comment')
  if(comment){
    workflowComment=comment.value
  }
 let  workflwAction = {
    instanceID: InstanceID,
    WFComments: workflowComment ? workflowComment : "",
    actionPerformed: 'REJECT',
  }
  updateWorkflowAction(workflwAction)
}
function approverequest(){
  let comment=document.getElementById('comment')
  if(comment){
    workflowComment=comment.value
  }
 let  workflwAction = {
    instanceID: InstanceID,
    WFComments: workflowComment ? workflowComment : "",
    actionPerformed: 'APPROVE',
  }
  updateWorkflowAction(workflwAction)
}

function updateWorkflowAction(workflwAction){
  fetch(`${apURL}/api/ProcessAction`, {
    method: 'POST',
    headers: {
        'Host': hostName,
        'Employeeguid': user.EmployeeGUID,
        'Hrzemail': user.Email,
        'Content-Type':'application/json'
    },
    body:JSON.stringify(workflwAction)
})
    .then(response => redirecto())
}

function redirecto(){
  window.location.href=`${window.location.origin}/pages/qafehelpdesk`
}
function cancelrequest(){
  redirecto()
}
function toggleMenu() {
  var menu = document.getElementById('menu');
  if (menu.style.left === '-350px') {
    menu.style.left = '0';
  } else {
    menu.style.left = '-350px';
  }
}
function changePage(url){
  window.location.href=window.location.origin+url
}
function getCurrentUser() {
  let userDetails = '';
  let userKey = window.localStorage.getItem('user_key');
  if (userKey) {
      let user = JSON.parse(userKey);
      if (user.value) {
          userDetails = user.value;
      }
  }
  return userDetails;
}
function getWorkflowActions() {
  serviceList=[]
  fetch(`${apURL}/api/WFActions?instanceID=${InstanceID}`, {
      method: 'POST',
      headers: {
          'Host': hostName,
          'Employeeguid': user.EmployeeGUID,
          'Hrzemail': user.Email
      },
  })
      .then(response => response.json())
      .then(workflowAction => {
        workflowActionButtons=workflowAction
      
        getEmployees()

      })
}

function getEmployees(){
  let objectName = "Employees";
  let list = 'FirstName,LastName'
  let fieldList = list.split(",")
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = ``;
  let orderBy = "false"
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
      if (Array.isArray(employees) && employees.length > 0) {
          employeesList = employees
          getRequestDetails()

      } 
  });
}
function getQafUsers(RequestFor){
  chuserID=""
  let recordForField
  recordForField = {
      Tod: "QAF_Users",
      Ldft: "RecordID,FirstName,LastName,Email,UserType",
      Ybod: "",
      Ucwr: "RecordID='" + RequestFor + "'",
      Zps: 1000000,
      Rmgp: 1,
      Diac: "false",
  }
      window.QafService.Rfdf(recordForField).then((orrequest) => {
        if(Array.isArray(orrequest)&&orrequest.length>0){
          chuserID=orrequest[0].RecordID
        }
      })
    }

function getRequestDetails(){
  let recordForField
  recordForField = {
      Tod: "Regularization_Request",
      Ldft: "TicketID,Title,RequestFor,SelectDate,DueDate,Description,Priority,Duration,     Status,Type",
      Ybod: "",
      Ucwr: `RecordID='${recordID}'`,
      Zps: 1000000,
      Rmgp: 1,
      Diac: "false",
      isWF: "true",
      wf: "Regularization Request",
  }

      window.QafService.Rfdf(recordForField).then((orrequest) => {
        
          if (Array.isArray(orrequest) && orrequest.length > 0) {
            regularizationrequestDetails=orrequest[0]
          let  RequestFor = regularizationrequestDetails.RequestFor ? userOrGroupFieldRecordID(regularizationrequestDetails.RequestFor) : '';
           getQafUsers(RequestFor);
       document.getElementById('activity').innerHTML=     `
            <div class="accordion-body">
                    <div class="info bodyContent">
                        <h6>Ticket ID</h6>
                        <p>${regularizationrequestDetails.TicketID}</p>
                    </div>
                    <div class="info bodyContent">
                        <h6>Request For</h6>
                        <p> ${getFullName(userOrGroupFieldRecordID(regularizationrequestDetails.RequestFor))}</p>
                    </div>
                    <div class="info bodyContent">
                        <h6>Brief Of The Request</h6>
                        <p> ${regularizationrequestDetails.Title}</p>
                    </div>
                    <div class="info bodyContent">
                        <h6>Select Date</h6>
                        <p> ${convertinDate(convertUTCDateToLocalDate(new Date(regularizationrequestDetails.SelectDate)))}</p>
                    </div>
                    <div class="info bodyContent">
                        <h6>Type</h6>
                        <p> ${regularizationrequestDetails.Type}</p>
                    </div>
              
                    <div class="info bodyContent">
                        <h6>Reason</h6>
                        <p>${regularizationrequestDetails.Description?regularizationrequestDetails.Description:''}</p>
                    </div>
                    <div class="info bodyContent">
                    <h6>Due Date</h6>
                    <p>${regularizationrequestDetails.DueDate?convertinDateTime(convertUTCDateToLocalDate(new Date(regularizationrequestDetails.DueDate))):''} </p>
                </div>
                    <div class="info bodyContent">
                        <h6>Priority</h6>
                        <p>${formatLookupFieldValue(regularizationrequestDetails.Priority)}</p>
                    </div>
                    <div class="info bodyContent">
                        <h6>Opened On<h6>
                                <p>${regularizationrequestDetails.CreatedDate?convertinDateTime(convertUTCDateToLocalDate(new Date(regularizationrequestDetails.CreatedDate))):''}</p>
                    </div>
                    <div class="info bodyContent">
                        <h6>Opened By</h6>
                        <p>${getFullName(regularizationrequestDetails.
                          CreatedByGUID
                          )}</p>
                    </div>
                    <div class="info bodyContent">
                        <h6>Pending With</h6>
                        <p>${getFullName(PendingWithIDs
                          )}</p>
                    </div>
                    ${workflowActionButtons.IsCommentsVisible?getCommentBox():''}
                    <div class="action-button">
                        <div>
                            <button  class="btn-primary button" onclick="cancelrequest()">Cancel
                            </button>
                        </div>
                       ${workflowActionButtons.IsUpdateVisible?getUpdateButton():''}
                       ${workflowActionButtons.IsRejectVisible?getRejectButton():''}
                       ${workflowActionButtons.IsApproveVisible?getApproveButton():''}
                    </div>
                </div>
            `
          }
      });
}
function getCommentBox(){
  return `<div class="info bodyContent">
  <h6>Comment</h6>
  <div class="job-field">
      <textarea class="apply-input"  id="comment" name="comment"
          autocomplete="off"></textarea>
  </div>
</div>`
}
function  getUpdateButton(){
return  ` <div>
  <button  class="btn-primary button" onclick="updaterequest()">Update
  </button>
</div>`
}
function  getRejectButton(){
return  ` <div>
  <button  class="btn-primary button" onclick="rejectrequest()">Reject
  </button>
</div>`
}
function  getApproveButton(){
return  ` <div>
  <button  class="btn-primary button" onclick="approverequest()">Approve
  </button>
</div>`
}
function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);
  return newDate;
}
function formatLookupFieldValue(value) {
  let returnValue = value ? value : "";//fix change by mayur
  let updatedRetunValue = [];
  if (returnValue && returnValue.indexOf(';#') !== -1) {
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
  let guidRegexPattern = new RegExp(guidPattern)
  return guidRegexPattern.test(guidString);
}
function getFullName(id){
  let employee = employeesList && employeesList.filter(a => a.RecordID === id);
      return employee && employee[0] ? employee[0].FirstName + " " + employee[0].LastName : '';
}
function convertinDateTime(date){
  return moment(date).format('DD/MM/YYYY h:mm a')
}
function convertinDate(date){
  return moment(date).format('DD/MM/YYYY')
}