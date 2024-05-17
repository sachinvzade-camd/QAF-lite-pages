var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;
var Employee;
var expenseClaim_Data;
var employeeList=[]

var expenseGrid = {
    repository: 'Expense_claims',
    columns: [
        { field: 'Requesttitle', displayName: 'Brief about Request', sorting: false },
        { field: 'SelectEmployee', displayName: 'Request For', sorting: false },
        { field: 'Project', displayName: 'Project', sorting: false },
        { field: 'Division', displayName: 'Division', sorting: false },
        { field: 'DirectManager', displayName: 'Reporting Manager', sorting: false },
        { field: 'TotalAmount', displayName: 'Total Claimed  Amount', sorting: false },
        { field: 'Approvedamount', displayName: 'Approved Amount', sorting: false },

    ],
    viewFields: [ "SelectEmployee", "Requesttitle", "SelectDepartment", "Project", "ExpenseDetails", "TotalAmount", "Description","Division","DirectManager","Approvedamount"],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: ""
}

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var gridExpenseColumns = [
    { field: 'Requesttitle', displayName: 'Brief about Request', sequence: 1, sorting: false },
    { field: 'SelectEmployee', displayName: 'Request For', sequence: 2, sorting: false  },
    { field: 'Project', displayName: 'Project', sequence: 3, sorting: false  },
    { field: 'Division', displayName: 'Division', sequence: 4, sorting: false  },
    { field: 'DirectManager', displayName: 'Reporting Manager', sequence: 5, sorting: false },
    { field: 'TotalAmount', displayName: 'Total Claimed  Amount', sequence: 6, sorting: false },
    { field: 'Approvedamount', displayName: 'Approved Amount', sequence: 7, sorting: false },
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



function pageSizeEvent(page) {
    expenseGrid.pageSize = page.detail.pageSize;
    loadExpenseClaim();
}

 qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        window.localStorage.setItem('ma',"funfirst.quickappflow.com")
        let mainGridElement = document.getElementById('main-grid'); 
        let noGridElement = document.getElementById('no-grid'); 
          if(mainGridElement){
            mainGridElement.style.display='block'
          }
          if(noGridElement){
            noGridElement.style.display="none"
          }
          getEmployeeAll()
        getEmployee()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getEmployeeAll() {
    employeeList=[]
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName';
    let whereClause = ``;
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    return window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            employeeList = employees;
        }
    });

}
function getEmployee() {
    let userId = getCurrentUserGuid();
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,DirectManager';
    let whereClause = `DirectManager='${userId}'`;
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    return window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;
        }
        loadExpenseClaim();
    });

}

function GetWhereClause() {
    let idsArray = Employee.map(item => item.RecordID);
    let condtion_whereClause = "";
    if (idsArray.length > 0) {
        condtion_whereClause = `CreatedByGUID='${idsArray.join("'<OR>CreatedByGUID='")}'`;
    }else{
         condtion_whereClause=`CreatedByGUID=''`
    }
    return condtion_whereClause;
}

function loadExpenseClaim() {
    let mainGridElement = document.getElementById('main-grid'); 
        let noGridElement = document.getElementById('no-grid'); 
          if(mainGridElement){
            mainGridElement.style.display='block'
          }
          if(noGridElement){
            noGridElement.style.display="none"
          }
    let userId = getCurrentUserGuid();
    let firstDay = startDate();
    let lastDay = endDate();
    let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
    let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
    let filterFormat = expenseGrid.filter;
    filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
    filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
    filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);
    let recordForField
    // let whereClause="";
    let whereClause = GetWhereClause();
    console.log("whereClause: ", whereClause);
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp: expenseGrid.page,
        Diac: "false",
        isWF: "true",
        wf: "Expense claims",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;

            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                expenseClaim.forEach(expense=>{
                    expense.Project=formatLookupFieldValue(expense.Project)
                    expense.SelectEmployee=formatLookupFieldValue(expense.SelectEmployee)
                    expense.Approvedamount=expense.Approvedamount?expense.Approvedamount:0;
                    if(expense.DirectManager){
                        let directManagerID=userOrGroupFieldRecordID(expense.DirectManager)
                        let emp=employeeList.find(a=>a.RecordID===directManagerID)
                        if(emp&&emp.RecordID){
                            expense.DirectManager=emp.FirstName+" "+emp.LastName 
                        }
                    }
            

                })

                expenseClaim_Data = expenseClaim
                
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
            else{
                let mainGridElement = document.getElementById('main-grid'); 
                let noGridElement = document.getElementById('no-grid'); 
                  if(mainGridElement){
                    mainGridElement.style.display='none'
                  }
                  if(noGridElement){
                    noGridElement.style.display="block"
                  }
                }
        },(error)=>{
        expenseGridElement.show = false;
        }
        
        ).catch((error) => {
            console.log(error);
          });
        expenseGridElement.addEventListener('onNextPageEvent', nextPageEvent);
        expenseGridElement.addEventListener('onPrevPageEvent', prevPageEvent);
        expenseGridElement.addEventListener('onGridSortEvent', sortEvent);
        expenseGridElement.addEventListener('onPageSizeEvent', pageSizeEvent);
    }
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
    let recordForField
    let whereClause = GetWhereClause();
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp: page.detail.currentPage,
        Diac: "false",
        isWF: "true",
        wf: "Expense claims",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;

            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                 expenseClaim_Data = expenseClaim
                expenseClaim.forEach(expense=>{
                    expense.Project=formatLookupFieldValue(expense.Project)
                    expense.SelectEmployee=formatLookupFieldValue(expense.SelectEmployee)
                    expense.Approvedamount=expense.Approvedamount?expense.Approvedamount:0;
                    if(expense.DirectManager){
                        let directManagerID=userOrGroupFieldRecordID(expense.DirectManager)
                        let emp=employeeList.find(a=>a.RecordID===directManagerID)
                        if(emp&&emp.RecordID){
                            expense.DirectManager=emp.FirstName+" "+emp.LastName 
                        }
                    }
            

                })
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
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
    let recordForField
    let whereClause = GetWhereClause();
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp:page.detail.currentPage,
        Diac: "false",
        isWF: "true",
        wf: "Expense claims",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;

            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                expenseClaim_Data = expenseClaim
                expenseClaim.forEach(expense=>{
                    expense.Project=formatLookupFieldValue(expense.Project)
                    expense.SelectEmployee=formatLookupFieldValue(expense.SelectEmployee)
                    expense.Approvedamount=expense.Approvedamount?expense.Approvedamount:0;
                    if(expense.DirectManager){
                        let directManagerID=userOrGroupFieldRecordID(expense.DirectManager)
                        let emp=employeeList.find(a=>a.RecordID===directManagerID)
                        if(emp&&emp.RecordID){
                            expense.DirectManager=emp.FirstName+" "+emp.LastName 
                        }
                    }
            

                })
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
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
    let recordForField
    let whereClause = GetWhereClause();
    recordForField = {
        Tod: expenseGrid.repository,
        Ldft: expenseGrid.viewFields.join(','),
        Ybod: expenseGrid.orderBy,
        Ucwr: whereClause,
        Zps: expenseGrid.pageSize,
        Rmgp: expenseGrid.page,
        Diac: "false",
        isWF: "true",
        wf: "Expense claims",
    }
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        expenseGridElement.show = true;
        window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;
            if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                expenseClaim_Data = expenseClaim
                expenseClaim.forEach(expense=>{
                    expense.Project=formatLookupFieldValue(expense.Project)
                    expense.SelectEmployee=formatLookupFieldValue(expense.SelectEmployee)
                    expense.Approvedamount=expense.Approvedamount?expense.Approvedamount:0;
                    if(expense.DirectManager){
                        let directManagerID=userOrGroupFieldRecordID(expense.DirectManager)
                        let emp=employeeList.find(a=>a.RecordID===directManagerID)
                        if(emp&&emp.RecordID){
                            expense.DirectManager=emp.FirstName+" "+emp.LastName 
                        }
                    }
            

                })
                expenseGridElement.Data = expenseClaim;
                expenseGridElement.show = false;
                updateMonthElement();
            }
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
            let recordForField
            let userId = getCurrentUserGuid();
            let firstDay = startDate();
            let lastDay = endDate();
            let startMonth = `${firstDay.getFullYear()}/${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
            let endMonth = `${lastDay.getFullYear()}/${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
            let filterFormat = expenseGrid.filter;
            filterFormat = filterFormat.replace('{{CURRENTUSERID}}', userId);
            filterFormat = filterFormat.replace('{{STARTOFMONTH}}', startMonth);
            filterFormat = filterFormat.replace('{{ENDOFMONTH}}', endMonth);

            let whereClause = GetWhereClause();
            recordForField = {
                Tod: expenseGrid.repository,
                Ldft: expenseGrid.viewFields.join(','),
                Ybod: expenseGrid.orderBy,
                Ucwr: whereClause,
                Zps: expenseGrid.pageSize,
                Rmgp: expenseGrid.page,
                Diac: "false",
                isWF: "true",
                wf: "Expense claims",
            }

            window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;

                if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                    expenseClaim_Data = expenseClaim
                    expenseGridElement.Data = expenseClaim;
                    expenseGridElement.show = false;
                    updateMonthElement();
                }
            });
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
            let recordForField
            let whereClause = GetWhereClause();
            recordForField = {
                Tod: expenseGrid.repository,
                Ldft: expenseGrid.viewFields.join(','),
                Ybod: expenseGrid.orderBy,
                Ucwr: whereClause,
                Zps: expenseGrid.pageSize,
                Rmgp: expenseGrid.page,
                Diac: "false",
                isWF: "true",
                wf: "Expense claims",
            }

            window.QafService.Rfdf(recordForField).then((expenseClaim) => {
            expenseGridElement.show = false;

                if (Array.isArray(expenseClaim) && expenseClaim.length > 0) {
                    expenseClaim_Data = expenseClaim
                    expenseGridElement.Data = expenseClaim;
                    expenseGridElement.show = false;
                    updateMonthElement();
                }
            });
        }
    }
}

function expgrid_onItemRender(cname, cvalue, row) {
    
    if (cname === 'Requesttitle') {
        if(cvalue){
            let result;
            let matchingObject = expenseClaim_Data.find(item => item.Requesttitle === cvalue);
            if (matchingObject) {
                result = {
                    objectid: matchingObject.objectid,
                    CreatedByGUID: matchingObject.CreatedByGUID,
                    InstanceID: matchingObject.InstanceID,
                    RecordID: matchingObject.RecordID
                };
            }
            return `
                <a href="${window.location.origin}/workflow-engine/i-request-details?rn=expense&cbid=${result.CreatedByGUID}&oid=${result.objectid}&rid=${result.RecordID}&incid=${result.InstanceID}" target="_blank">${cvalue}</a>`;
        }   
    }
    
    if (cname === 'Project') {
        if (cvalue ) {
            return `${cvalue} 
            <style>
                    .row-menu{display:none!important}
                    
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
                    .qaf-grid__row-item_action{
                        display:'none'
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
            </style>
        `;
        }
    }
    if (cname === 'SelectEmployee'||cname === 'Project') {
        return `${cvalue} 
        <style>
               
                .qaf-grid__header .qaf-grid__header-item{
                    padding: 12px 50px !important;
                }
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
                    padding: 12px 50px;
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
                .qaf-grid__row-item{
                    padding: 12px 24px;
                }
                .qaf-grid__row-item>a{
                color: #009ce7;
                text-decoration: none;
                }
        </style>
    `;
}
    // Handle 'Moved' independently
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
                loadExpenseClaim();
            });

        } else if (eventName === 'EDIT') {
            window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function () {
                loadExpenseClaim();
            });

        } else if (eventName === 'DELETE') {
            window.QafPageService.DeleteItem(row.RecordID, function () {
                loadExpenseClaim();
            });
        }
    }
}


function formatLookupFieldValue(value) {
    let returnValue = value ? value : "";
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
    let guidRegexPattern = new RegExp(guidPattern)
    return guidRegexPattern.test(guidString);
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