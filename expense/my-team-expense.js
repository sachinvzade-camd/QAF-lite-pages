var Employee;
var expenseClaim_Data;
let expenseGrid = {
    repository: 'Expense_claims',
    columns: [
        { field: 'Requesttitle', displayName: 'Request Title', sorting: false },
        { field: 'Project', displayName: 'Project', sorting: false },
        { field: 'Description', displayName: 'Description', sorting: false },
        { field: 'TotalAmount', displayName: 'Total Amount', sorting: false },
        { field: 'Approvedamount', displayName: 'Approved Amount', sorting: false },


    ],
    viewFields: ['Requesttitle', "Project", "Description", "CreatedByGUID","TotalAmount","Approvedamount"],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: ""
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let gridExpenseColumns = [
    { field: 'Requesttitle', displayName: 'Request Title', sequence: 1, sorting: false },
    { field: 'Project', displayName: 'Project', sequence: 2, sorting: false },
    { field: 'Description', displayName: 'Description', sequence: 3, sorting: false },
    { field: 'TotalAmount', displayName: 'Total Amount', sequence: 4, sorting: false },
    { field: 'Approvedamount', displayName: 'Approved Amount',sequence: 5,  sorting: false },

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

let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getEmployee()
        clearInterval(qafServiceLoaded);
    }
}, 10);

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
        condtion_whereClause = `creaedby='${idsArray.join("'<OR>creaedby='")}'`;
    }else{
         condtion_whereClause=`creaedby=''`
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
                <a href="${window.location.origin}/workflow-engine/i-request-details?rn=expense&cbid=${result.CreatedByGUID}&oid=${result.objectid}&rid=${result.RecordID}&incid=${result.InstanceID}" target="_blank">${cvalue}</a>
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
    
    if (cname === 'Project') {
        console.log("Expense Data Fpor URL", expenseClaim_Data)
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
            return `${returnItems.join(';')} 
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



