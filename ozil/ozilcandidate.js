var searchValue=""
let expenseGridCandidate = {
  repository: 'Candidate',
  columns: [
    {field:'FirstName', displayName:'First Name', sorting: true},
    {field:'LastName', displayName:'Last Name', sorting: true},
    {field:'Email', displayName:'Email', sorting: true},
    {field:'Mobile', displayName:'Mobile', sorting: true},
    {field:'Nationality', displayName:'Nationality', sorting: true},
    {field:'AlternatePhoneNumber', displayName:'Alternate Phone Number', sorting: true},
    {field:'CurrentLocation', displayName:'Current Location', sorting: true},
    {field:'DateofBirth', displayName:'Date of Birth', sorting: true},
    {field:'MaritalStatus', displayName:'Marital Status', sorting: true},
    {field:'Source', displayName:'Source', sorting: true},
  ],
  viewFields: ['FirstName',"LastName","Email","Nationality","Mobile","AlternatePhoneNumber","CurrentLocation","DateofBirth","MaritalStatus","Source"],
  page: 1,
  pageSize: 10,
  dateFormat: 'YYYY/MM/DD',
  currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  filter: ""
}

const monthNamesCandidate = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

let gridExpenseColumnsCandidate = [
  {field:'FirstName', displayName:'First Name',sequence:1, sorting: true},
  {field:'LastName', displayName:'Last Name',sequence:2, sorting: true},
  {field:'Email', displayName:'Email',sequence:3, sorting: true},
  {field:'Nationality', displayName:'Nationality',sequence:4, sorting: true},
  {field:'Mobile', displayName:'Mobile',sequence:5, sorting: true},
  {field:'AlternatePhoneNumber', displayName:'Alternate Phone Number',sequence:6, sorting: true},
  {field:'CurrentLocation', displayName:'Current Location',sequence:7, sorting: true},
  {field:'DateofBirth', displayName:'Date of Birth',sequence:8, sorting: true},
  {field:'MaritalStatus', displayName:'Marital Status',sequence:9, sorting: true},
  {field:'Source', displayName:'Source',sequence:10, sorting: true},
];

function updateMonthElement(){
let currentDate = expenseGridCandidate.currentSelectedDate;
let currentMonthYear = `${monthNamesCandidate[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
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
var currentDate = expenseGridCandidate.currentSelectedDate;
var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
return firstDay;
}

function endDate(){
var currentDate = expenseGridCandidate.currentSelectedDate;
var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
return lastDay;
}

function loadCandidateGrid(){
let userId = getCurrentUserGuid();
let firstDay = startDate();
let lastDay = endDate();
let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
let filterFormat = expenseGridCandidate.filter;
filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

let filterGridCondition = filterFormat;
if(searchValue){
  filterGridCondition = ("FirstName<contains>'" + searchValue + "'<OR>LastName<contains>'" + searchValue+ "'<OR>Email<contains>'" + searchValue+ "'<OR>Mobile<contains>'" + searchValue + "'");
}
let expenseGridElement = document.querySelector('#expenseGridCandidate'); 
if(expenseGridElement){
    expenseGridElement.show = true;
    window.QafService.GetItems(expenseGridCandidate.repository, expenseGridCandidate.viewFields, expenseGridCandidate.pageSize, expenseGridCandidate.page, filterGridCondition).then((filteredExpense)=>{
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
expenseGridCandidate.pageSize = page.detail.pageSize;
loadCandidateGrid();
}

function nextPageEvent(page){
  let userId = getCurrentUserGuid();
  let firstDay = startDate();
  let lastDay = endDate();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
  let filterFormat = expenseGridCandidate.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expenseGridCandidate'); 
  if(expenseGridElement){
      expenseGridElement.show = true;
      window.QafService.GetItems(expenseGridCandidate.repository, expenseGridCandidate.viewFields, expenseGridCandidate.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense)=>{
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
  let filterFormat = expenseGridCandidate.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expenseGridCandidate'); 
  if(expenseGridElement){
      expenseGridElement.show = true;
      window.QafService.GetItems(expenseGridCandidate.repository, expenseGridCandidate.viewFields, expenseGridCandidate.pageSize, page.detail.currentPage, filterGridCondition).then((filteredExpense)=>{
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
  let filterFormat = expenseGridCandidate.filter;
  filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expenseGridCandidate'); 
  if(expenseGridElement){
      expenseGridElement.show = true;
      window.QafService.GetItems(expenseGridCandidate.repository, expenseGridCandidate.viewFields, expenseGridCandidate.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElement();
      });
  }
}

function addCandidate(){
  if(window.QafPageService){
    window.QafPageService.AddItem(expenseGridCandidate.repository, function(){
      loadCandidateGrid();
    });
  }
}

function nextMonth(e){
//Get grid by id
let expenseGridElement = document.querySelector('#expenseGridCandidate');
if(expenseGridElement){
  if(window.QafService){
    expenseGridCandidate.currentSelectedDate.setMonth(expenseGridCandidate.currentSelectedDate.getMonth() + 1);
    expenseGridElement.show = true;
    updateMonthElement();

    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGridCandidate.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

    let filterGridCondition = filterFormat;

    window.QafService.GetItems(expenseGridCandidate.repository, expenseGridCandidate.viewFields, expenseGridCandidate.pageSize, expenseGridCandidate.page, filterGridCondition).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
    })
  }
}
}

function prevMonth(e){
//Get grid by id
let expenseGridElement = document.querySelector('#expenseGridCandidate');
if(expenseGridElement){
  if(window.QafService){
    expenseGridCandidate.currentSelectedDate.setMonth(expenseGridCandidate.currentSelectedDate.getMonth() - 1);
    expenseGridElement.show = true;
    updateMonthElement();

    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGridCandidate.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}',userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);

    let filterGridCondition = filterFormat;

    window.QafService.GetItems(expenseGridCandidate.repository, expenseGridCandidate.viewFields, expenseGridCandidate.pageSize, expenseGridCandidate.page, filterGridCondition).then((filteredExpense)=>{
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
    })
  }
}
}

function expenseGridCandidate_onItemRender(cname, cvalue, row){
  if(cname === 'Project'||cname === 'CurrentLocation'){
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
  if(cname === 'DateofBirth'){
    if(cvalue){
      let date=new Date(cvalue)
      return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    }else{
      return '';
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
      window.QafPageService.ViewItem(expenseGridCandidate.repository, row.RecordID, function(){
        loadCandidateGrid();
      });

  }else if(eventName === 'EDIT'){
      window.QafPageService.EditItem(expenseGridCandidate.repository, row.RecordID, function(){
        loadCandidateGrid();
      });

  }else if(eventName === 'DELETE'){
      window.QafPageService.DeleteItem(row.RecordID, function(){
        loadCandidateGrid();
      });
  }
}
}

let qafServiceLoadedCanidate = setInterval(() => {
  if(window.QafService){
      loadCandidateGrid();
      document.getElementById("search")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      searchValue=  document.getElementById("search").value;
      loadCandidateGrid();
    }
});
      clearInterval(qafServiceLoadedCanidate);
  }
}, 10);


