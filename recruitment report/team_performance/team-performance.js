let expenseGridReport = {
    repository: 'Candidate',
    columns: [
      {field:'SelectEmployee', displayName:'Request For', sorting: true},
      {field:'CurrentLedgerBalance', displayName:'Current Ledger Balance', sorting: true},
      {field:'RequestTitle', displayName:'Request Title', sorting: true},
      {field:'Department', displayName:'Department', sorting: true},
      {field:'TotalAmount', displayName:'Total Amount', sorting: true},
      {field:'Description', displayName:'Description', sorting: true},
  ],
  viewFields: ['FirstName'],
      page: 1,
      pageSize: 10,
      dateFormat: 'YYYY/MM/DD',
      currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      filter: "CreatedDate>='{{STARTOFMONTH}}'<AND>CreatedDate<='{{ENDOFMONTH}}'"
    }
var tabledata = [
    {id:1, name:"Billy Bob", age:12, gender:"male", height:95},
    {id:2, name:"Jenny Jane", age:42, gender:"female", height:142},
    {id:3, name:"Steve McAlistaire", age:35, gender:"male", height:176},
];
const monthNamesReport = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

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
  function showData(filteredExpense){
    var table = new Tabulator("#example-table", {
        data: filteredExpense,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 5,
        tooltips: true,
        
        columns: [
            {
                title: "Recruiter Name",
                field: "Recruiter",
            },
            {
                title: "No. of Candidates Uploaded",
                field: "NoofCandidate",
            },
        ],
    });
  }

  function filterData(candidateData){
    if(candidateData&&candidateData.length>0){
        let teamEmployee=[];
        let removeBlankCreatedBy=candidateData.filter(a=>a.CreatedByName)
        let commonCreatedBy=removeBlankCreatedBy.filter((v, i, a) => a.findIndex(t => t.CreatedByGUID == v.CreatedByGUID) == i);
        commonCreatedBy.forEach(val=>{
            let totalEmployees=removeBlankCreatedBy.filter(a=>a.CreatedByGUID===val.CreatedByGUID);

            teamEmployee.push({
                Recruiter:val.CreatedByName,
                NoofCandidate:totalEmployees.length
            })

        })
        showData(teamEmployee)

    }else{
        showData([])
    }
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
    let firstDay = startDateReport();
    let lastDay = endDateReport();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
    let filterFormat = expenseGridReport.filter;
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
    // if(employeeList&&employeeList.length>0){
    //   let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
    //    filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
    // }else{
    //   filterFormat=filterFormat;
    // }
    let filterGridCondition = filterFormat;
    
  let orderBy="false"
  
        window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, expenseGridReport.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
          if(filteredExpense&&filteredExpense.length>0){
            filterData(filteredExpense)
         }else{
            filterData(filteredExpense)
          }
        updateMonthElementReport();
      });
  
      // Add event handlers
     
  }
  qafServiceLoadedReport = setInterval(() => {
    if (window.QafService) {
        loadExpenseGridReport()
      clearInterval(qafServiceLoadedReport);
    }
  }, 10);
  function nextMonthReport(e){
    //Get grid by id
   
      if(window.QafService){
        expenseGridReport.currentSelectedDate.setMonth(expenseGridReport.currentSelectedDate.getMonth() + 1);
        updateMonthElementReport();
  
        let firstDay = startDateReport();
        let lastDay = endDateReport();
        let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
        let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
        let filterFormat = expenseGridReport.filter;
        filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
    // if(employeeList&&employeeList.length>0){
    //   let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
    //    filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
    // }else{
    //   filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${userId}')`;
    // }
    let filterGridCondition = filterFormat;
    let orderBy="false"
  
        window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, expenseGridReport.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
          if(filteredExpense&&filteredExpense.length>0){
            filterData(filteredExpense)
      }else{
        filterData(filteredExpense)
      }
    
        })
      }
  }
  
  function prevMonthReport(e){
    //Get grid by id
   
      if(window.QafService){
        expenseGridReport.currentSelectedDate.setMonth(expenseGridReport.currentSelectedDate.getMonth() - 1);
        updateMonthElementReport();
  
        let firstDay = startDateReport();
        let lastDay = endDateReport();
        let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth()+1}/${firstDay.getDate()}`;
        let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth()+1}/${lastDay.getDate()}`;
        let filterFormat = expenseGridReport.filter;
        filterFormat = filterFormat.replace('{{STARTOFMONTH}}',startMonth);
        filterFormat = filterFormat.replace('{{ENDOFMONTH}}',endMonth);
        // if(employeeList&&employeeList.length>0){
        //   let employeeID = employeeList.map(emp=>emp.RecordID).join("'<OR>CreatedByGUID='");
        //    filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${employeeID}')`;
        // }else{
        //   filterFormat=filterFormat+"<<NG>>"+`(CreatedByGUID='${userId}')`;
        // }
        let filterGridCondition = filterFormat;
        let orderBy="false"
  
        window.QafService.GetItems(expenseGridReport.repository, expenseGridReport.viewFields, expenseGridReport.pageSize, expenseGridReport.page, filterGridCondition,'',orderBy).then((filteredExpense)=>{
          if(filteredExpense&&filteredExpense.length>0){
            filterData(filteredExpense)
      }
      else{
        filterData(filteredExpense)
      }
        })
      }
  }


  function addTable() {
    var myTableDiv = document.getElementById("myDynamicTable");
  
    var table = document.createElement('TABLE');
    table.border = '1';
  
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
  
    for (var i = 0; i < 3; i++) {
      var tr = document.createElement('TR');
      tableBody.appendChild(tr);
  
      for (var j = 0; j < 4; j++) {
        var td = document.createElement('TD');
        td.width = '75';
        td.appendChild(document.createTextNode("Cell " + i + "," + j));
        tr.appendChild(td);
      }
    }
    myTableDiv.appendChild(table);
  }
  addTable();