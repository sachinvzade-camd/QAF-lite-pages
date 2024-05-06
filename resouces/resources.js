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
      URL:`pages/managetimesheet`
  },
  {
      Title:'Resources',
      Icons:"fa-crosshairs",
      URL:``,
      Html:`<div class="container-fluid"> <div class="page row"> <div class="page-nav"> <div class="expense-app-links"><qaf-repeater data-bind-item="app" data-bind-style="qaf-grid" class="expense-app-links-dt"> <style> .expense-app-links-dt { display: flex; flex-direction: column; align-items: center; justify-content: space-between } .expense-top{ transform: translate(0,15px); } .expense-app-links-dt a.dashboard-App { text-decoration: none } a.dashboard-App { text-decoration: none; display: flex; flex-direction: column; align-items: center; color: white; font-size: 14px } a.dashboard-App .fa { font-size: 28px } </style>  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" /> </qaf-repeater></div> </div> <div class="page-content col-md-12 "> <div class="expense-grid"> <div class="expense-top"> <h3>Resources</h3> <div class="expense-action"> <button class="qaf-btn-primary" type="button" onclick="addResources()"><i class="fa fa-plus"></i> Resources</button> </div> </div> <div class="expense-data-grid"><qaf-grid id="expgrid" columns="gridExpenseColumns" action="true"></qaf-grid> </div> </div> </div> </div> </div>`,
      IsFirstComponent:true
  },
]

let expenseGrid = {
  repository: 'Recruitment_Resources',
  columns: [
        {field:'FirstName', displayName:'First Name', sorting: true},
        {field:'LastName', displayName:'Last Name', sorting: true},
        {field:'ContactNumber', displayName: 'Contact Number', sorting: true },
        {field:'Email', displayName:'Email', sorting: true},
        {field:'Address', displayName:'Address', sorting: true},
  ],
  viewFields: ["FirstName","LastName","ContactNumber","Email","Address"],
  page: 1,
  pageSize: 10,
  dateFormat: 'YYYY/MM/DD',
  currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  filter: ""
}

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

let gridExpenseColumns = [
  { field: 'FirstName', displayName: 'First Name', sequence: 1, sorting: true },
  { field: 'LastName', displayName: 'Last Name', sequence: 2, sorting: true },
  { field: 'ContactNumber', displayName: 'Contact Number', sequence: 3, sorting: true },
  { field: 'Email', displayName: 'Email', sequence: 4, sorting: true },
  { field: 'Address', displayName: 'Address', sequence: 5, sorting: true },
];


function updateMonthElement(){
let currentDate = expenseGrid.currentSelectedDate;
let currentMonthYear = `${monthNames[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
if(currentMonthYear){
  let ele = document.querySelector('.expense-current-month');
  if(ele){
    document.querySelector('.expense-current-month').innerText = currentMonthYear;
  }
}
}

function getCurrentUserGuid(){

let guid = '';
let userKey = window.localStorage.getItem('user_key');
if(userKey){
  let user = JSON.parse(userKey);
  if(user.value){
    guid = user.value.EmployeeGUID;
  }
}
return guid;
}

function startDate(){
var currentDate = expenseGrid.currentSelectedDate;
var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
return firstDay;
}

function endDate(){
var currentDate = expenseGrid.currentSelectedDate;
var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
return lastDay;
}

function loadResourceGrid(){
let userId = getCurrentUserGuid();
let firstDay = startDate();
let lastDay = endDate();
let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
let filterFormat = expenseGrid.filter;
filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

let filterGridCondition = filterFormat;
let expenseGridElement = document.querySelector('#expgrid'); 
if(expenseGridElement){
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense)=>{
    expenseGridElement.Data = filteredExpense;
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

function pageSizeEvent(page){
expenseGrid.pageSize = page.detail.pageSize;
loadResourceGrid();
}

function nextPageEvent(page){
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid'); 
  if(expenseGridElement){
      expenseGridElement.show = true;
      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
      });
  }
}

function prevPageEvent(page){
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid'); 
  if(expenseGridElement){
      expenseGridElement.show = true;
      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
      });
  }
}

function sortEvent(page){
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
  let filterFormat = expenseGrid.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgrid'); 
  if(expenseGridElement){
      expenseGridElement.show = true;
      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
      });
  }
}

function addResources(){
  if(window.QafPageService){
    window.QafPageService.AddItem(expenseGrid.repository, function(){
      loadResourceGrid();
    });
  }
}

function nextMonth(e){
//Get grid by id
let expenseGridElement = document.querySelector('#expgrid');
if(expenseGridElement){
  if(window.QafService){
    expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() + 1);
    expenseGridElement.show = true;
    updateMonthElement();

    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

    let filterGridCondition = filterFormat;

    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
    })
  }
}
}

function prevMonth(e){
//Get grid by id
let expenseGridElement = document.querySelector('#expgrid');
if(expenseGridElement){
  if(window.QafService){
    expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() - 1);
    expenseGridElement.show = true;
    updateMonthElement();

    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

    let filterGridCondition = filterFormat;

    window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
    })
  }
}
}

function expgrid_onItemRender(cname, cvalue, row){
  if(cname === 'Project'){
    if(cvalue && cvalue.indexOf(';#') !== -1){
      let values = cvalue.split(';#');
      let oddArray = [];
      values.forEach((v, idx)=>{
        oddArray.push(idx);
      })
      let odds = oddArray.filter(n => n%2);
      let returnItems = [];
      odds.forEach((d)=>{
        returnItems.push(values[d]);
      })
      return returnItems.join(';');
    }
  }
  if(cvalue){
    return cvalue;
  }else{
    return '';
  }
}

function expgrid_onRowActionEvent(eventName, row){
if(window.QafPageService){
  if(eventName === 'VIEW'){
      window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function(){
        loadResourceGrid();
      });

  }else if(eventName === 'EDIT'){
      window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function(){
        loadResourceGrid();
      });

  }else if(eventName === 'DELETE'){
      window.QafPageService.DeleteItem(row.RecordID, function(){
        loadResourceGrid();
      });
  }
}
}

let qafServiceLoaded = setInterval(() => {
  if(window.QafService){
    document.getElementById('menu').data=menuList
      loadResourceGrid();
      clearInterval(qafServiceLoaded);
  }
}, 10);


