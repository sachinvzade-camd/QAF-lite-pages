var TalentBankDataforExport;
var startTime = "";
var endTime = "";

gridExpenseColumns = [
  { field: 'JobPost', displayName: 'Job Post', sequence: 1, sorting: false },
  { field: 'Candidate', displayName: 'Candidate Name', sequence: 2, sorting: false },
  { field: 'MovedDate', displayName: 'Moved Date', sequence: 3, sorting: false },
  { field: 'Status', displayName: 'Status', sequence: 4, sorting: true },
  { field: 'Reason', displayName: 'Reason', sequence: 5, sorting: false },
]

expenseGrid = {
  repository: 'Talent_Bank',
  columns: [
    { field: 'JobPost', displayName: 'Job Post', sorting: false },
    { field: 'Candidate', displayName: 'Candidate Name', sorting: false },
    { field: 'MovedDate', displayName: 'Moved Date', sorting: false },
    { field: 'Status', displayName: 'Status', sorting: true },
    { field: 'Reason', displayName: 'Reason', sorting: false },

  ],
  viewFields: ['JobPost', "Candidate", "MovedDate", "Status", "Reason"],
  page: 1,
  pageSize: 10,
  dateFormat: 'YYYY/MM/DD',
  currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  filter: "",
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
}

function updateMonthElement() {
  let currentDate = expenseGrid.currentSelectedDate;
  let currentMonthYear = `${expenseGrid.monthNames[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
  if (currentMonthYear) {
    let ele = document.querySelector('.expense-current-month');
    if (ele) {
      document.querySelector('.expense-current-month').innerText = currentMonthYear;
    }
  }
}

function getCurrentUserGuid() {

  let guid = '';
  let userKey = window.localStorage.getItem('user_key');
  if (userKey) {
    let user = JSON.parse(userKey);
    if (user.value) {
      guid = user.value.EmployeeGUID;
    }
  }
  return guid;
}

function startDate() {
  var currentDate = expenseGrid.currentSelectedDate;
  var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  return firstDay;
}

function endDate() {
  var currentDate = expenseGrid.currentSelectedDate;
  var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  return lastDay;
}

function loadTalentBank() {
  let mainGridElement = document.getElementById('main-grid');
  let noGridElement = document.getElementById('no-grid');
  if (mainGridElement) {
    mainGridElement.style.display = 'block'
  }
  if (noGridElement) {
    noGridElement.style.display = "none"
  }

  let exportBtnElement = document.getElementById("ExportButton")
  if (exportBtnElement) {
    exportBtnElement.disabled = false;
  }
  TalentBankDataforExport = [];
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

  let filterGridCondition = getWhereClause();
  
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition, null, false).then((filteredExpense) => {
      if (Array.isArray(filteredExpense) && filteredExpense.length > 0) {
        let propertiesToSplit = ["JobPost", "Candidate"];
        let talentBankData = splitIdentifiers(filteredExpense, propertiesToSplit);
        TalentBankDataforExport = talentBankData
        expenseGridElement.Data = talentBankData;
      }
      else {
        let exportBtnElement = document.getElementById("export")
        if (exportBtnElement) {
          exportBtnElement.disabled = true;
        }
          TalentBankDataforExport = [];
          let mainGridElement = document.getElementById('main-grid');
              let noGridElement = document.getElementById('no-grid');
              if (mainGridElement) {
                  mainGridElement.style.display = 'none'
              }
              if (noGridElement) {
                  noGridElement.style.display = "block"
              }
      }

      expenseGridElement.show = false;
      updateMonthElement();
    });

    // Add event handlers
    expenseGridElement.addEventListener('onNextPageEvent', nextPageEvent);
    expenseGridElement.addEventListener('onPrevPageEvent', prevPageEvent);
    expenseGridElement.addEventListener('onGridSortEvent', sortEvent);
    expenseGridElement.addEventListener('onPageSizeEvent', pageSizeEvent);
  }
}

function pageSizeEvent(page) {
  expenseGrid.pageSize = page.detail.pageSize;
  loadTalentBank();
}

function nextPageEvent(page) {
  TalentBankDataforExport = [];
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

  let filterGridCondition = getWhereClause();
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition, null, false).then((filteredExpense) => {
      let propertiesToSplit = ["JobPost", "Candidate"];
      let talentBankData = splitIdentifiers(filteredExpense, propertiesToSplit);
      TalentBankDataforExport = talentBankData
      expenseGridElement.Data = talentBankData;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
}

function prevPageEvent(page) {
  TalentBankDataforExport = [];
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

  let filterGridCondition = getWhereClause();
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition, null, false).then((filteredExpense) => {
      let propertiesToSplit = ["JobPost", "Candidate"];
      let talentBankData = splitIdentifiers(filteredExpense, propertiesToSplit);
      TalentBankDataforExport = talentBankData
      expenseGridElement.Data = talentBankData;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
}

function sortEvent(page) {
  TalentBankDataforExport = [];
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

  let filterGridCondition = getWhereClause();;
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order).then((filteredExpense) => {
      let propertiesToSplit = ["JobPost", "Candidate"];
      let talentBankData = splitIdentifiers(filteredExpense, propertiesToSplit);
      TalentBankDataforExport = talentBankData
      expenseGridElement.Data = talentBankData;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
}

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

function nextMonth(e) {
  TalentBankDataforExport = [];
  //Get grid by id
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    if (window.QafService) {
      expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() + 1);
      expenseGridElement.show = true;
      updateMonthElement();
      let userId = getCurrentUserGuid();
      let firstDay = startDate();
      let lastDay = endDate();
      let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
      let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
      let filterFormat = expenseGrid.filter;
      filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
      filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
      filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

      let filterGridCondition = getWhereClause();;

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
        let propertiesToSplit = ["JobPost", "Candidate"];
        let talentBankData = splitIdentifiers(filteredExpense, propertiesToSplit);
        TalentBankDataforExport = talentBankData
        expenseGridElement.Data = talentBankData;
        expenseGridElement.show = false;
      })
    }
  }
}

function prevMonth(e) {
  //Get grid by id
  TalentBankDataforExport = [];
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    if (window.QafService) {
      expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() - 1);
      expenseGridElement.show = true;
      updateMonthElement();

      let userId = getCurrentUserGuid();
      let firstDay = startDate();
      let lastDay = endDate();
      let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
      let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
      let filterFormat = expenseGrid.filter;
      filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
      filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
      filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

      let filterGridCondition = getWhereClause();;

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
        let propertiesToSplit = ["JobPost", "Candidate"];
        let talentBankData = splitIdentifiers(filteredExpense, propertiesToSplit);
        TalentBankDataforExport = talentBankData
        expenseGridElement.Data = talentBankData;
        expenseGridElement.show = false;
      })
    }
  }
}

function expgrid_onItemRender(cname, cvalue, row) {
  if (cname === 'Project') {
    if (cvalue && cvalue.indexOf(';#') !== -1) {
      let values = cvalue.split(';#');
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
  // Handle 'Moved' independently
  if (cname === 'MovedDate') {
    if (cvalue) {
      // Format date as 'DD/MM/YYYY'
      let date = new Date(cvalue);
      let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return `${formattedDate}<style>.row-menu{display:none}
    
    .qaf-grid__footer {
      border-top: 1px solid rgba(0,0,0,.12);
      background-color: #ffffff;
  }
  .qaf-grid{
    border:none;
    box-shadow: 1px 2px 5px;
  }
  .qaf-grid__header
  {
    background-color: #f2f2f2;
    border-bottom: 1px solid rgba(0,0,0,.12);
    font-size: 13px;
    font-weight: 500 !important;
    
  }
  .qaf-grid__row {
      font-size: 12px;
      font-weight: 500;
      background-color: #fff;
  }

.qaf-grid__header-item {
  font-weight: 500 !important;
  font-size:13px;
  
}
.qaf-grid-page-size label {
      font-weight: 500;
  }
  .qaf-grid-page-size select {
      background-color: #fff;
      color: #333;
  }
  .qaf-grid__footer > button{
    background-color: #fff;
  }
  .qaf-grid__footer > button > svg {
      
      fill: #333;
  }

  .qaf-grid__row-item>a{
    color: #009ce7;
    text-decoration: none;
  }
    </style>`;
    } else {
      return '';
    }
  }
  if (cvalue) {
    return cvalue;
  } else {
    return '';
  }
}

function expgrid_onRowActionEvent(eventName, row) {
  if (window.QafPageService) {
    if (eventName === 'VIEW') {
      window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function () {
        loadTalentBank();
      });

    } else if (eventName === 'EDIT') {
      window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function () {
        loadTalentBank();
      });

    } else if (eventName === 'DELETE') {
      window.QafPageService.DeleteItem(row.RecordID, function () {
        loadTalentBank();
      });
    }
  }
}
qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
    document.getElementById('endTime').valueAsDate = new Date();
    var date = new Date();
    var day = date.getTime() - (14 * 24 * 60 * 60 * 1000);
         date.setTime(day);
    document.getElementById('startTime').valueAsDate = date
    startTime = date;
    endTime = new Date()
    loadTalentBank();
    getjobposting()
    clearInterval(qafServiceLoaded);
  }
}, 10);
function searchReport() {
  
  const date1 = new Date(startTime);
const date2 = new Date(endTime);
const diffTime = Math.abs(date2 - date1);
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
if(diffDays>14){
  openAlert("Date range not more than 14 days")
}else{
  loadTalentBank();
}

}
function getWhereClause() {
  let whereclause = [];
  let jobpost = document.getElementById("jobpost");
  if (jobpost) {
      jobpostValue = jobpost.value;
  }
  if (jobpostValue) {
      whereclause.push(`(JobPost='${jobpostValue}')`);
  }
  if (startTime && endTime) {

      let startDate = moment(startTime).format('YYYY/MM/DD');
      let endDate = moment(endTime).format('YYYY/MM/DD');
      whereclause.push(
          `(MovedDate>='${startDate}'<AND>MovedDate<='${endDate}')`
      );
  }
  if (whereclause && whereclause.length > 0) {
      if (whereclause.length === 1) {
          return whereclause[0]
              .substring(0, whereclause[0].length - 1)
              .substring(1);
      }
      return whereclause.join("<<NG>>");
  }
  return "";
}
function openAlert(message) {
  let qafAlertObject = {
      IsShow: true,
      Message: message,
      Type: 'ok'
  }
  const body = document.body;
  let alertElement = document.createElement('qaf-alert')
  body.appendChild(alertElement);
  const qafAlertComponent = document.querySelector('qaf-alert');
  qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
  qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}
function ExportReport() {
  let data = TalentBankDataforExport;
  console.log("TalentBankDataforExport", TalentBankDataforExport)
  let csvData = [];
  let csvHeader = ["JobPost", "Candidate Name", "MovedDate", "Status", "Reason"].join(',');
  csvData.push(csvHeader);

  data.forEach(val => {
    let JobPost = val["JobPost"] ? val["JobPost"] : "";
    let Candidate = val["Candidate"] ? val["Candidate"] : "";
    let MovedDate = val["MovedDate"] ? formatedDate(val["MovedDate"]) : "";
    let Status = val["Status"] ? val["Status"] : "";
    let Reason = val["Reason"] ? val["Reason"] : "";
    csvData.push([JobPost, Candidate, MovedDate, Status, Reason].join(","));
  });
  let csvBody = csvData.join('\n');
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvBody);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'Talent Bank.csv';
  hiddenElement.click();
}

function formatedDate(Datevalue) {
  let date = new Date(Datevalue);
  let formatedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  if (formatedDate) {
    return formatedDate;
  }
  else {
    return ''
  }
}
document.getElementById("startTime").addEventListener("change", function () {
  startTime = new Date(this.value);
});


document.getElementById("endTime").addEventListener("change", function () {
  endTime = new Date(this.value);
});
function getjobposting() {
  let objectName = "Job_Posting";
  let list = "JobTitle";
  let fieldList = list.split(",");
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = ``;
  let orderBy = "true";
  window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobpostings) => {
      if (Array.isArray(jobpostings) && jobpostings.length > 0) {
          jobpostings = jobpostings.reverse();
          let jobpostDropdown = document.getElementById("jobpost");
          let options = `<option value=''>Select Job Post</option>`;
          if (jobpostDropdown) {
              jobpostings.forEach((job) => {
                  options += `<option value=${job.RecordID}>${job.JobTitle}</option>`;
              });
              jobpostDropdown.innerHTML = options;
          }
      }
  });
}