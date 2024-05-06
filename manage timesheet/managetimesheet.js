
var menuList=[
  {
      Title:'Requisition',
      Icons:"fa-user-plus",
      URL:`recruitment/Candidate-Requisition`,
      Iframe:true,
  },
  {
      Title:'Candidate Search',
      Icons:"fa-search",
      URL:`recruitment/candidate-Search`,
      Iframe:true

  },
  {
      Title:'Job Posting',
      Icons:"fa-podcast",
      URL:`pages/jobposting`
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
      URL:`crm/crm-customer-directory`,
      Iframe:true

  },
  {
      Title:'Contact',
      Icons:"fa-phone",
      URL:`crm/crm-contact-directory`,
      Iframe:true
  },
  {
      Title:'Vendor',
      Icons:"fa-id-card-o",
      URL:`pages/vendor`
  },
  {
      Title:'Manage Timesheet',
      Icons:"fa-calendar",
      URL:``,
      Html:`<div class="container-fluid"> <div class="page row"> <div class="page-nav"> <div class="expense-app-links"><qaf-repeater data-bind-item="app" data-bind-style="qaf-grid" class="expense-app-links-dt"> <style> .expense-app-links-dt { display: flex; flex-direction: column; align-items: center; justify-content: space-between } .expense-top{ transform: translate(0,15px); } .expense-app-links-dt a.dashboard-App { text-decoration: none } a.dashboard-App { text-decoration: none; display: flex; flex-direction: column; align-items: center; color: white; font-size: 14px } a.dashboard-App .fa { font-size: 28px } </style> <div><a class="dashboard-App" href="" style="text-decoration:none;display:flex;flex-direction:column;align-items:center;color:white;font-size:14px;margin-bottom:15px;text-align:center;width:85px"><i class="" aria-hidden="true" style="font-size:18px"></i><span class="text-center app-icon-text"></span></a></div> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" /> </qaf-repeater></div> </div> <div class="page-content col-md-12 "> <div class="expense-grid"> <div class="expense-top"> <h3>Manage Timesheet</h3> <div class="expense-action"> <select id="recruiter" class="filter"> </select> <button id="search" onclick="searchReport()">Search</button></div></div> <div class="expense-data-grid"><qaf-grid id="expgrid" columns="gridExpenseColumns" action="true"></qaf-grid> </div> </div> </div> </div> </div>`,
      IsFirstComponent:true
  },
  {
      Title:'Resources',
      Icons:"fa-crosshairs",
      URL:`pages/resources`,
  },
]


let expenseGrid = {
  repository: 'Daily_Timesheet',
  columns: [
    { field: 'Employee', displayName: 'Employee', sorting: true },
    { field: 'TimesheetDate', displayName: 'Date', sorting: true },
    { field: 'HoursWorked', displayName: 'Hours', sorting: true },
    { field: 'UserComments', displayName: 'Comment', sorting: true },
  ],
  viewFields: ["TimesheetDate", "HoursWorked", "UserComments", "Employee"],
  page: 1,
  pageSize: 10,
  dateFormat: 'YYYY/MM/DD',
  currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  filter: ""
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let gridExpenseColumns = [

  { field: 'Employee', displayName: 'Employee', sequence: 1, sorting: true },
  { field: 'TimesheetDate', displayName: 'Date', sequence: 1, sorting: true },
  { field: 'HoursWorked', displayName: 'Hours', sequence: 2, sorting: true },
  { field: 'UserComments', displayName: 'Comment', sequence: 3, sorting: true },

];


function updateMonthElement() {
  let currentDate = expenseGrid.currentSelectedDate;
  let currentMonthYear = `${monthNames[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
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

function loadTimesheet() {
  let userId = getCurrentUserGuid();
  let filterFormat = expenseGrid.filter;
  let filterGridCondition = getWhereClause();
  console.log("filterGridCondition", filterGridCondition);
  let expenseGridElement = document.querySelector('#expgrid');
  if (expenseGridElement) {
    expenseGridElement.Data = []
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
      if (Array.isArray(filteredExpense) && filteredExpense.length > 0) {
        expenseGridElement.Data = filteredExpense.reverse();
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
  loadTimesheet();
}

function nextPageEvent(page) {
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
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense) => {
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
}

function prevPageEvent(page) {
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
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense) => {
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
}

function sortEvent(page) {
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
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order).then((filteredExpense) => {
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
    });
  }
}

function nextMonth(e) {
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

      let filterGridCondition = getWhereClause();

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
      })
    }
  }
}

function prevMonth(e) {
  //Get grid by id
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

      let filterGridCondition = getWhereClause();

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense) => {
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
      })
    }
  }
}

function expgrid_onItemRender(cname, cvalue, row) {
  if (cname === 'Employee') {
    if (cvalue && cvalue.indexOf(';#') !== -1) {
      // Split and filter values based on the presence of ';#'
      let values = cvalue.split(';#');
      let oddArray = [];
      values.forEach((v, idx) => {
        oddArray.push(idx);
      });
      let odds = oddArray.filter(n => n % 2);
      let returnItems = [];
      odds.forEach(d => {
        returnItems.push(values[d]);
      });
      return returnItems.join(';');
    }
  }

  // Handle 'TimesheetDate' independently
  if (cname === 'TimesheetDate') {
    if (cvalue) {
      // Format date as 'DD/MM/YYYY'
      let date = new Date(cvalue);
      let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return formattedDate;
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
        loadTimesheet();
      });

    } else if (eventName === 'EDIT') {
      window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function () {
        loadTimesheet();
      });

    } else if (eventName === 'DELETE') {
      window.QafPageService.DeleteItem(row.RecordID, function () {
        loadTimesheet();
      });
    }
  }
}
function getRecruiter() {
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
      console.log(employees);
      let recruiterDropdown = document.getElementById('recruiter');
      let options = `<option value=''>Select Employee</option>`
      if (recruiterDropdown) {
        employees.forEach(emp => {


          options += `<option value=${emp.RecordID}>${emp.FirstName} ${emp.LastName}</option>`
        })
        recruiterDropdown.innerHTML = options;
      }

    }
    loadTimesheet();
  });
}

function searchReport() {
  loadTimesheet();
}

function getWhereClause() {
  const recruiterElement = document.getElementById("recruiter");
  const recruiterValue = recruiterElement ? recruiterElement.value : null;

  if (recruiterValue) {
    return `Employee='${recruiterValue}'`;
  }

  return "";
}

let qafServiceLoaded = setInterval(() => {
  if (window.QafService) {

    document.getElementById('menu').data=menuList
    getRecruiter();
    clearInterval(qafServiceLoaded);
  }
}, 10);


