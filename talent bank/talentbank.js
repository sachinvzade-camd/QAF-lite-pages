var TalentBankDataforExport;
var productionURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = productionURL
var gridExpenseColumns = [
  { field: 'JobPost', displayName: 'Job Post', sequence: 1, sorting: false },
  { field: 'Candidate', displayName: 'Candidate Name', sequence: 2, sorting: false },
  { field: 'MovedDate', displayName: 'Moved Date', sequence: 3, sorting: false },
  { field: 'Status', displayName: 'Status', sequence: 4, sorting: true },
  { field: 'Reason', displayName: 'Reason', sequence: 5, sorting: false },
]

var expenseGrid = {
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

// monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

// gridExpenseColumns = [
//   {field:'JobPost', displayName:'Job Post',sequence:1, sorting: false},
//   {field:'Candidate', displayName:'Candidate Name',sequence:2, sorting: false},
//   {field:'MovedDate', displayName:'Moved Date',sequence:3, sorting: false},
//   {field:'Status', displayName:'Statzus',sequence:4, sorting: true},
//   {field:'Reason', displayName:'Reason',sequence:5, sorting: false},

// ];

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

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.show = false;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition, null, false).then((filteredExpense) => {
      expenseGridElement.show = false;
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

  let filterGridCondition = filterFormat;
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

  let filterGridCondition = filterFormat;
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

  let filterGridCondition = filterFormat;
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

      let filterGridCondition = filterFormat;

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

      let filterGridCondition = filterFormat;

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
    window.QafService.SetEnvUrl(apURL)
    loadTalentBank();
    clearInterval(qafServiceLoaded);
  }
}, 10);


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





// function getFullNameByRecordID(RecordIDID) {
//   const Employee_Data = employeeList;
//   const Employee_Record = Employee_Data.find(record => record.RecordID === RecordIDID);
//   if (Employee_Record) {
//     const fullName = `${Employee_Record.FirstName} ${Employee_Record.LastName}`;
//     return fullName;
//   } else {
//     return '';
//   }
// }

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

// function getRecruiterName(val) {
//   let recruiterName = "";
//   let recruiterData = val;
//   if (recruiterData && recruiterData !== "undefined") {
//     recruiterData = JSON.parse(recruiterData);
//     if (recruiterData.length > 0) {
//       recruiterName = getFullNameByRecordID(recruiterData[0].RecordID);
//       return recruiterName;
//     }
//   } else {
//     return "";
//   }

// }