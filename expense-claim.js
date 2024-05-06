// Expense app
let expenseNavLinks = [
    {name: 'Expense',link:'/pages/expense-claim-page', icon:'fa fa-shopping-cart'}
 ]

let expenseGrid = {
    repository: 'Expense_claims',
    columns: [
          {field:'Requesttitle', displayName:'Request title', sorting: true},
          {field:'Approvedamount', displayName:'Approved amount', sorting: true},
          {field:'Project', displayName:'Project', sorting: true},
          {field:'TotalAmount', displayName:'Total amount', sorting: true},
          {field:'Description', displayName:'Description', sorting: true},
    ],
    viewFields: ['Requesttitle','Approvedamount','Project','TotalAmount','Description'],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: "CreatedByGUID='{{CURRENTUSERID}}'<<NG>>(CreatedDate>='{{STARTOFMONTH}}'<AND>CreatedDate<='{{ENDOFMONTH}}')"
  }

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

let gridExpenseColumns = [
    {field:'Requesttitle', displayName:'Request title',sequence:1, sorting: true},
    {field:'Approvedamount', displayName:'Approved amount',sequence:3, sorting: true},
    {field:'Project', displayName:'Project',sequence:2, sorting: true},
    {field:'TotalAmount', displayName:'Total amount',sequence:4, sorting: true},
    {field:'Description', displayName:'Description',sequence:5, sorting: true},
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
        loadExpenseGrid();
        clearInterval(qafServiceLoaded);
    }
 }, 10);



