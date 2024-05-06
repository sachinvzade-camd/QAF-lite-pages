// Expense app
var expenseNavLinks = [
  {name: 'Expense',link:'/pages/dynamic-expense-page', icon:'fa fa-money'},
  {name: 'Advance For Expense',link:'/pages/Advance-For-Expense', icon:'fa fa-shopping-cart'},
  {name: 'Employee Loan',link:'/pages/Employee-Loan', icon:'fa fa-shopping-cart'},
  {name: 'Advances',link:'/pages/Advances', icon:'fa fa-shopping-cart'},
]
let expenseGrid = {
    repository: 'Advance_For_Expense',
    columns: [
          {field:'Category', displayName:'Category', sorting: true},
          {field:'SelectEmployee', displayName:'Request For', sorting: true},
          {field:'CurrentLedgerBalance', displayName:'Current Ledger Balance', sorting: true},
          {field:'RequestTitle', displayName:'Request Title', sorting: true},
          {field:'Department', displayName:'Department', sorting: true},
          {field:'RequestedAmount', displayName:'Requested Amount', sorting: true},
          {field:'Description', displayName:'Description', sorting: true},
    ],
    viewFields: ['Category','SelectEmployee','CurrentLedgerBalance','RequestTitle','Department','RequestedAmount','Description'],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: "CreatedByGUID='{{CURRENTUSERID}}'<<NG>>(CreatedDate>='{{STARTOFMONTH}}'<AND>CreatedDate<='{{ENDOFMONTH}}')"
  }

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

let gridExpenseColumns = [
    {field:'Category', displayName:'Category',sequence:1, sorting: true},
    {field:'SelectEmployee', displayName:'Request For',sequence:2, sorting: true},
    {field:'CurrentLedgerBalance', displayName:'Current Ledger Balance',sequence:3, sorting: true},
    {field:'RequestTitle', displayName:'Request Title',sequence:4, sorting: true},
    {field:'Department', displayName:'Department',sequence:5, sorting: true},
    {field:'RequestedAmount', displayName:'Requested Amount',sequence:6, sorting: true},
    {field:'Description', displayName:'Description',sequence:7, sorting: true},
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

function loadExpenseGrid(){
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
let orderBy="false"

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
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
  loadExpenseGrid();
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
let orderBy="false"

        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition,'',orderBy).then((filteredExpense)=>{
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
let orderBy="false"

        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, page.detail.currentPage, filterGridCondition,'',orderBy).then((filteredExpense)=>{
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
let orderBy="false"

        window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order,'',orderBy).then((filteredExpense)=>{
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
        updateMonthElement();
        });
    }
}

function addExpense(){
    if(window.QafPageService){
      window.QafPageService.AddItem(expenseGrid.repository, function(){
        loadExpenseGrid();
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
      let orderBy="false"

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
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
      let orderBy="false"

      window.QafService.GetItems(expenseGrid.repository, expenseGrid.viewFields, expenseGrid.pageSize, expenseGrid.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
      })
    }
  }
}

function expgrid_onItemRender(cname, cvalue, row){
  if(cname === 'SelectEmployee'||cname === 'Department'){
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
          loadExpenseGrid();
        });

    }else if(eventName === 'EDIT'){
        window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function(){
          loadExpenseGrid();
        });

    }else if(eventName === 'DELETE'){
        window.QafPageService.DeleteItem(row.RecordID, function(){
          loadExpenseGrid();
        });
    }
  }
}

 let qafServiceLoaded = setInterval(() => {
    if(window.QafService){
      isEmployeePresentInTeam();
        clearInterval(qafServiceLoaded);
    }
 }, 10);
 function isEmployeePresentInTeam(){
  let userId = getCurrentUserGuid();
  let objectName = "Teams";
  let fieldList = ["TeamName","TeamMembers"];
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = `(TeamName='HOD')<<NG>>(TeamMembers='${userId}')`;
let orderBy="false"

      window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause,'',orderBy).then((filteredExpense)=>{
        if (Array.isArray(filteredExpense) && filteredExpense.length > 0) {
          loadExpenseGrid();
        }else{
          let sideNavBar=document.getElementsByClassName('expense-app-links-dt')[0].shadowRoot;
          let sideBarElementList=sideNavBar.querySelectorAll('div');
          sideBarElementList.forEach((val,index)=>{
            if(index===(sideBarElementList.length-1)){
              val.style.display = 'none';
            }
          })
          loadExpenseGrid();
        }
      });
}


