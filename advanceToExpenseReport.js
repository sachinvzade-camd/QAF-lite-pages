// Expense app
//  let expenseNavLinks = [
//   {name: 'Expense',link:'/pages/dynamic-expense-page', icon:'fa fa-money'},
//   {name: 'Advance For Expense',link:'/pages/Advance-For-Expense', icon:'fa fa-shopping-cart'},
//   {name: 'Employee Loan',link:'/pages/Employee-Loan', icon:'fa fa-shopping-cart'},
//   {name: 'Advances',link:'/pages/Advances', icon:'fa fa-shopping-cart'},
// ]\
var employeeList;
 let expenseGridReport = {
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
    filter: "(CreatedDate>='{{STARTOFMONTH}}'<AND>CreatedDate<='{{ENDOFMONTH}}')"
  }

const monthNamesReport = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

let gridExpenseColumnsReport = [
  {field:'Category', displayName:'Category',sequence:1, sorting: true},
  {field:'SelectEmployee', displayName:'Request For',sequence:2, sorting: true},
  {field:'CurrentLedgerBalance', displayName:'Current Ledger Balance',sequence:3, sorting: true},
  {field:'RequestTitle', displayName:'Request Title',sequence:4, sorting: true},
  {field:'Department', displayName:'Department',sequence:5, sorting: true},
  {field:'RequestedAmount', displayName:'Requested Amount',sequence:6, sorting: true},
  {field:'Description', displayName:'Description',sequence:7, sorting: true},
];

function updateMonthElementReport(){
  
  let currentDate = expenseGridReport.currentSelectedDate;
  let currentMonthYear = `${monthNamesReport[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
  if(currentMonthYear){
    let ele = document.querySelector('.expense-current-month-report');
    if(ele){
      document.querySelector('.expense-current-month-report').innerText = currentMonthYear;
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

function startDateReport(){
  var currentDate = expenseGridReport.currentSelectedDate;
  var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  return firstDay;
}

function endDateReport(){
  var currentDate = expenseGridReport.currentSelectedDate;
  var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  return lastDay;
}

function loadExpenseGridReport(){
  let userId = getCurrentUserGuid();
  let firstDay = startDateReport();
  let lastDay = endDateReport();
  let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
  let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
  let filterFormat = expenseGridReport.filter;
  filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
  if(employeeList&&employeeList.length>0){
    let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
     filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
  }else{
    filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${userId}')`;
  }
  let filterGridCondition = filterFormat;
  let expenseGridElement = document.querySelector('#expgridReport'); 
  if(expenseGridElement){
      expenseGridElement.show = true;
let orderBy="false"

      window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, expenseGridReport.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
        if(filteredExpense&&filteredExpense.length>0){
          filteredExpense.forEach(val=>{
            val.Department=formatGridValue(val.Department);
            val.SelectEmployee=formatGridValue(val.SelectEmployee);

            val.Approvedamount=val.Approvedamount?val.Approvedamount:''
            val.TotalAmount=val.TotalAmount?val.TotalAmount:''
            val.Description=val.Description?val.Description:''
          })
    }
      expenseGridElement.Data = filteredExpense;
      expenseGridElement.show = false;
      updateMonthElementReport();
    });

    // Add event handlers
    expenseGridElement.addEventListener('onNextPageEvent', nextPageEventReport);
    expenseGridElement.addEventListener('onPrevPageEvent', prevPageEventReport);
    expenseGridElement.addEventListener('onGridSortEvent', sortEventReport);
    expenseGridElement.addEventListener('onPageSizeEvent', pageSizeEventReport);
  }
}

function pageSizeEventReport(page){
  expenseGridReport.pageSize = page.detail.pageSize;
  loadExpenseGridReport();
}

function nextPageEventReport(page){
    let userId = getCurrentUserGuid();
    let firstDay = startDateReport();
    let lastDay = endDateReport();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGridReport.filter;
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
  if(employeeList&&employeeList.length>0){
    let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
     filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
  }else{
    filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${userId}')`;
  }
  let filterGridCondition = filterFormat;
    let expenseGridElement = document.querySelector('#expgridReport'); 
    if(expenseGridElement){
        expenseGridElement.show = true;
let orderBy="false"

        window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, page.detail.currentPage, filterGridCondition,'',orderBy).then((filteredExpense)=>{
          if(filteredExpense&&filteredExpense.length>0){
            filteredExpense.forEach(val=>{
              val.Department=formatGridValue(val.Department);
            val.SelectEmployee=formatGridValue(val.SelectEmployee);

              val.Approvedamount=val.Approvedamount?val.Approvedamount:''
              val.TotalAmount=val.TotalAmount?val.TotalAmount:''
              val.Description=val.Description?val.Description:''
            })
      }
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
        updateMonthElementReport();
        });
    }
}

function prevPageEventReport(page){
    let userId = getCurrentUserGuid();
    let firstDay = startDateReport();
    let lastDay = endDateReport();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGridReport.filter;
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
  if(employeeList&&employeeList.length>0){
    let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
     filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
  }else{
    filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${userId}')`;
  }
  let filterGridCondition = filterFormat;
    let expenseGridElement = document.querySelector('#expgridReport'); 
    if(expenseGridElement){
        expenseGridElement.show = true;
let orderBy="false"

        window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, page.detail.currentPage, filterGridCondition,'',orderBy).then((filteredExpense)=>{
          if(filteredExpense&&filteredExpense.length>0){
            filteredExpense.forEach(val=>{
              val.Department=formatGridValue(val.Department);
            val.SelectEmployee=formatGridValue(val.SelectEmployee);

              val.Approvedamount=val.Approvedamount?val.Approvedamount:''
              val.TotalAmount=val.TotalAmount?val.TotalAmount:''
              val.Description=val.Description?val.Description:''
            })
      }
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
        updateMonthElementReport();
        });
    }
}

function sortEventReport(page){
    let userId = getCurrentUserGuid();
    let firstDay = startDateReport();
    let lastDay = endDateReport();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGridReport.filter;
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
    if(employeeList&&employeeList.length>0){
      let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
       filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
    }else{
      filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${userId}')`;
    }
    let filterGridCondition = filterFormat;
    let expenseGridElement = document.querySelector('#expgridReport'); 
    if(expenseGridElement){
        expenseGridElement.show = true;
let orderBy="false"

        window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, 1, filterGridCondition, page.detail.field, page.detail.order).then((filteredExpense)=>{
          if(filteredExpense&&filteredExpense.length>0){
            filteredExpense.forEach(val=>{
              val.Department=formatGridValue(val.Department);
            val.SelectEmployee=formatGridValue(val.SelectEmployee);

              val.Approvedamount=val.Approvedamount?val.Approvedamount:''
              val.TotalAmount=val.TotalAmount?val.TotalAmount:''
              val.Description=val.Description?val.Description:''
            })
      }
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
        updateMonthElementReport();
        });
    }
}

// function addExpense(){
//     if(window.QafPageService){
//       window.QafPageService.AddItem(expenseGridReport.repository, function(){
//         loadExpenseGridReport();
//       });
//     }
//   }

function nextMonthReport(e){
  //Get grid by id
  let expenseGridElement = document.querySelector('#expgridReport');
  if(expenseGridElement){
    if(window.QafService){
      expenseGridReport.currentSelectedDate.setMonth(expenseGridReport.currentSelectedDate.getMonth() + 1);
      expenseGridElement.show = true;
      updateMonthElementReport();

      let userId = getCurrentUserGuid();
      let firstDay = startDateReport();
      let lastDay = endDateReport();
      let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
      let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
      let filterFormat = expenseGridReport.filter;
      filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
  filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
  if(employeeList&&employeeList.length>0){
    let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
     filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
  }else{
    filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${userId}')`;
  }
  let filterGridCondition = filterFormat;
  let orderBy="false"

      window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, expenseGridReport.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
        if(filteredExpense&&filteredExpense.length>0){
          filteredExpense.forEach(val=>{
            val.Department=formatGridValue(val.Department);
            val.SelectEmployee=formatGridValue(val.SelectEmployee);

            val.Approvedamount=val.Approvedamount?val.Approvedamount:''
            val.TotalAmount=val.TotalAmount?val.TotalAmount:''
            val.Description=val.Description?val.Description:''
          })
    }
        expenseGridElement.Data = filteredExpense;
        expenseGridElement.show = false;
      })
    }
  }
}

function prevMonthReport(e){
  //Get grid by id
  let expenseGridElement = document.querySelector('#expgridReport');
  if(expenseGridElement){
    if(window.QafService){
      expenseGridReport.currentSelectedDate.setMonth(expenseGridReport.currentSelectedDate.getMonth() - 1);
      expenseGridElement.show = true;
      updateMonthElementReport();

      let userId = getCurrentUserGuid();
      let firstDay = startDateReport();
      let lastDay = endDateReport();
      let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
      let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
      let filterFormat = expenseGridReport.filter;
      filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
      filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
      if(employeeList&&employeeList.length>0){
        let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
         filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
      }else{
        filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${userId}')`;
      }
      let filterGridCondition = filterFormat;
      let orderBy="false"

      window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, expenseGridReport.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
        if(filteredExpense&&filteredExpense.length>0){
          filteredExpense.forEach(val=>{
            val.Department=formatGridValue(val.Department);
            val.SelectEmployee=formatGridValue(val.SelectEmployee);
            val.Approvedamount=val.Approvedamount?val.Approvedamount:''
            val.TotalAmount=val.TotalAmount?val.TotalAmount:''
            val.Description=val.Description?val.Description:''
          })
    }
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
    if(cvalue||cvalue===0){
      return cvalue;
    }else{
      return '';
    }
  }

function expgrid_onRowActionEvent(eventName, row){
  if(window.QafPageService){
    if(eventName === 'VIEW'){
        window.QafPageService.ViewItem(expenseGridReport.repository, row.RecordID, function(){
          loadExpenseGridReport();
        });

    }else if(eventName === 'EDIT'){
        window.QafPageService.EditItem(expenseGridReport.repository, row.RecordID, function(){
          loadExpenseGridReport();
        });

    }else if(eventName === 'DELETE'){
        window.QafPageService.DeleteItem(row.RecordID, function(){
          loadExpenseGridReport();
        });
    }
  }
}

 qafServiceLoadedReport = setInterval(() => {
  if (window.QafService) {
    loadEmployees();
    clearInterval(qafServiceLoadedReport);
  }
}, 10);

function loadEmployees(){
  let userId = getCurrentUserGuid();
  let objectName = "Employees";
let orderBy="false"

  let fieldList = ["DirectManager"];
  let pageSize = "20000";
  let pageNumber = "1";
  let whereClause = `(DirectManager='${userId}')<<OG>>(RecordID='${userId}')`;
      window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause,'',orderBy).then((filteredExpense)=>{
        employeeList=filteredExpense;
        loadExpenseGridReport();
      });
}

function formatGridValue(cvalue){
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
    if(cvalue){
      return cvalue;
    }else{
      return '';
    }
  }



