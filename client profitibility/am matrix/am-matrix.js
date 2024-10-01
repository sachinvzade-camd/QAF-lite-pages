var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;
var Employee = [];
var clientAllocationMatrixList=[]
var expenseClaim_Data;
var currentDate = new Date();
var FirstDay;
var LastDay;
var amMatrix={
    ClientName:'',
    NoofHours:0,
    ReportingTL:'',
}
var clientProfibilityList=[]
var teamProductID;
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        let mainGridElement = document.getElementById('main-grid');
        let noGridElement = document.getElementById('no-grid');
        if (mainGridElement) {
            mainGridElement.style.display = 'block'
        }
        if (noGridElement) {
            noGridElement.style.display = "none"
        }
        getproductTeamLead()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getEmployee() {
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,IsOffboarded,DirectManager';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;
        }
        getAccountManager();
    });

}
function getproductTeamLead() {
    let objectName = "Product";
    let list = 'ProductName'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `ProductName='Team Lead'`;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((products) => {
        if (Array.isArray(products) && products.length > 0) {
           teamProductID=products[0].RecordID
        getEmployee();
        }


    });
}
function getAccountManager() {
    let objectName = "Role";
    let list = 'EmployeeLevel'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `EmployeeLevel='Account Manager'`;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((roles) => {
        if (Array.isArray(roles) && roles.length > 0) {
            let accountmanagerID = roles[0].RecordID
            let objectName = "Employees";
            let list = 'EmployeeLevel,FirstName,LastName'
            let fieldList = list.split(",")
            let pageSize = "20000";
            let pageNumber = "1";
            let whereClause = `EmployeeLevel='${accountmanagerID}'`;
            let orderBy = "true";
            window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
                if (Array.isArray(employees) && employees.length > 0) {
                    let employeeDropdownElement = document.getElementById('employees');
                    let options = `<option value=''>Select Manager</option>`
                    if (employeeDropdownElement) {
                        employees.forEach(emp => {
                            options += `<option value=${emp.RecordID}>${emp.FirstName} ${emp.LastName}</option>`
                        })
                        employeeDropdownElement.innerHTML = options;
                        employeeDropdownElement.value=employees[0].RecordID
                    }
                    getClientAllocation();
                }
            })
        }


    });
}

var expenseGrid = {
    repository: 'Client_Allocation_Matrix',
    columns: [
        { field: 'ClientName', displayName: 'Client Name', sorting: false },
        { field: 'NoofHours', displayName: 'No of Hours', sorting: false },
        { field: 'ReportingTL', displayName: 'Reporting TL', sorting: false },
    ],
    viewFields: ["ClientName", "NoofHours", "ReportingTL"],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: ""
}

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var gridExpenseColumns =  [
    { field: 'ClientName', displayName: 'Client Name', sorting: false },
    { field: 'NoofHours', displayName: 'No of Hours', sorting: false },
    { field: 'ReportingTL', displayName: 'Reporting TL', sorting: false },
];



function getClientAllocation() {
    let employeeDropdownElement = document.getElementById('employees');
    let employeeValue;
    if(employeeDropdownElement){
        employeeValue=employeeDropdownElement.value;
    }
    clientAllocationMatrixList = []
    let objectName = "Client_Allocation_Matrix";
    let list = 'RecordID,Customer,ProductOffering,Employee,NumberofHours,BillingAmount,BillingAmount,HourlyRate';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `Employee='${employeeValue}'`;
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((revenues) => {
        if (Array.isArray(revenues) && revenues.length > 0) {
            clientAllocationMatrixList = revenues;
            getCommonCustomer()
        }
    });

}
function getCommonCustomer(){
    
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
    expenseGridElement.show = true;
    resetObject()
        let commonCustomer=clientAllocationMatrixList.filter((v,i,a)=>a.findIndex(t=>t.Customer===v.Customer)===i);
        if(commonCustomer&&commonCustomer.length>0){
            commonCustomer.forEach(val=>{
    resetObject()
                let customers = commonCustomer.filter(a => (a.Customer) === (val.Customer));
                let totalHours=customers.reduce((acc, value) => acc + Number(value.NumberofHours), 0);
                amMatrix.ClientName=val.Customer;
                amMatrix.NoofHours=totalHours;
                amMatrix.ReportingTL=val.Employee;
                clientProfibilityList.push(amMatrix)
            })
        }


        expenseGridElement.Data = clientProfibilityList;
        expenseGridElement.show = false;
    }
}

function resetObject(){
    amMatrix={
        ClientName:'',
        NoofHours:0,
        ReportingTL:'',
    }
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
    loadCustomerRevenue();
}



function GetWhereClause() {
    let userId = getCurrentUserGuid();
    let whereClause = ``;
    return whereClause;
}

function loadCustomerRevenue() {
    let mainGridElement = document.getElementById('main-grid');
    let noGridElement = document.getElementById('no-grid');
    if (mainGridElement) {
        mainGridElement.style.display = 'block'
    }
    if (noGridElement) {
        noGridElement.style.display = "none"
    }

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
            else {
                let mainGridElement = document.getElementById('main-grid');
                let noGridElement = document.getElementById('no-grid');
                if (mainGridElement) {
                    mainGridElement.style.display = 'none'
                }
                if (noGridElement) {
                    noGridElement.style.display = "block"
                }
            }
        }, (error) => {
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
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function nextPageEvent(page) {
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
        });
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function prevPageEvent(page) {
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
        });
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function sortEvent(page) {
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
        });
    }
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
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
            let whereClause = GetWhereClause();
            recordForField = {
                Tod: expenseGrid.repository,
                Ldft: expenseGrid.viewFields.join(','),
                Ybod: expenseGrid.orderBy,
                Ucwr: whereClause,
                Zps: expenseGrid.pageSize,
                Rmgp: expenseGrid.page,
                Diac: "false",
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
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function prevMonth(e) {
    //Get grid by id
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
        if (window.QafService) {
            expenseGrid.currentSelectedDate.setMonth(expenseGrid.currentSelectedDate.getMonth() - 1);
            expenseGridElement.show = true;
            updateMonthElement();

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
    expenseGridElement.Data = ''
    expenseGridElement.show = false;
}

function expgrid_onItemRender(cname, cvalue, row) {
    
    if (cname === 'ReportingTL'||cname === 'ProductOffering') {
        if (cvalue) {
            let reportingManagerRecordId = userOrGroupFieldRecordID(cvalue)
            cvalue = getFullNameByRecordID(reportingManagerRecordId)
            return `${cvalue}
                       <style>                      
                            .qaf-grid__row:hover {
                            background-color: #fff !important;
                            }
.qaf-grid__row-item_action{
                        display:none
                    }
                            .qaf-grid__footer {
                            border-top: 1px solid rgba(0, 0, 0, 0.12);
                            background-color: #ffffff;
                            }
                            .qaf-grid {
                            border: none;
                            box-shadow: 1px 2px 5px;
                            }
                            .qaf-grid__header {
                            background-color: #f2f2f2;
                            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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
                            font-size: 13px;
                            }

                            .qaf-grid-page-size label {
                            font-weight: 500;
                            }
                            .qaf-grid-page-size select {
                            background-color: #fff;
                            color: #333;
                            }
                            .qaf-grid__footer > button {
                            background-color: #fff;
                            }
                            .qaf-grid__footer > button > svg {
                            fill: #333;
                            }
                            .qaf-grid__row-item a {
                            color: #009ce7;
                            text-decoration: none;
                            }
                            .qaf-loader-container{
                          display:none !important;
                          }
                          .qaf-loader{
                                border: 5px solid transparent !important;
                              }
                                .qaf-grid__row-item > a {
                            color: #009ce7;
                            text-decoration: none;
                            cursor:pointer;
                        }
                              .pg-content{
                      padding-top: 40px !important;
                        }

 
                      </style>`;
        }
        else {
            return `    <style>
        
                    .qaf-grid__row:hover {
                    background-color: #fff !important;
                    }

                    .qaf-grid__footer {
                    border-top: 1px solid rgba(0, 0, 0, 0.12);
                    background-color: #ffffff;
                    }
                    .qaf-grid {
                    border: none;
                    box-shadow: 1px 2px 5px;
                    }
                    .qaf-grid__header {
                    background-color: #f2f2f2;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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
                    font-size: 13px;
                    }

                    .qaf-grid-page-size label {
                    font-weight: 500;
                    }
                    .qaf-grid-page-size select {
                    background-color: #fff;
                    color: #333;
                    }
                    .qaf-grid__footer > button {
                    background-color: #fff;
                    }
                    .qaf-grid__footer > button > svg {
                    fill: #333;
                    }
                    .qaf-grid__row-item a {
                            color: #009ce7;
                            text-decoration: none;
                            }
                            .qaf-loader-container{
                          display:none !important;
                          }
                          .qaf-loader{
                                border: 5px solid transparent !important;
                              }
                                .qaf-grid__row-item > a {
                            color: #009ce7;
                            text-decoration: none;
                            cursor:pointer;
                        }
                        .pg-content{
                      padding-top: 40px !important;
                        }
                      .btn-revenue{
                      font-size: 12px!important;
    padding: 5px 10px 5px 10px!important;
                      }
    

                </style>`
        }
    }
    if(cname === 'EngagementStartDate'||cname === 'EngagementEndDate'){
        if(cvalue ){
          let date = new Date(cvalue);
          let formatedDate=convertUTCDateToLocalDate( new Date(cvalue) )
           formatedDate=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear() } ${date.getHours() }:${date.getMinutes() } `
          return formatedDate;
        }else{
        return  ''
        }
      }
    if (cname === "NameOfTeamLead") {
        if (cvalue) {
            let reportingManagerRecordId = userOrGroupFieldRecordID(cvalue)
            cvalue = getFullNameByRecordID(reportingManagerRecordId)
            return cvalue;
        } else {
            return "";
        }
    }
    if (cname === "ClientName") {
        if (cvalue) {
            return cvalue.split(";#")[1];
        } else {
            return "";
        }
    }
    if (cname === "clientProfibility") {
        if (cvalue) {
            return cvalue.toFixed(2);
        } else {
            return "";
        }
    }
    if(cname==='Action'){
        return `<button class="btn btn-primary btn-revenue" 
                                onclick="allocateRevenue('${row.RecordID}')">Allocate</button>`
    }

    if (cvalue||cvalue===0) {
        return cvalue;
    } else {
        return '';
    }
}
function allocateRevenue(recordID){
let revenue=expenseClaim_Data.find(a=>a.RecordID===recordID);
if(revenue&&revenue.RecordID){
    let fields=["Customer","Employee","StartDate","EndDate","NumberofHours","BillingAmount","HourlyRate"]
    let fieldsValue = [];
    fields.forEach(val => {
        if (val === 'Customer') {
          fieldsValue.push({ fieldName: val, fieldValue: revenue.Name })
        }  else if (val === 'StartDate') {
            fieldsValue.push({ fieldName: val, fieldValue:convertUTCDateToLocalDate( new Date(revenue.EngagementStartDate) )})
          } else if (val === 'EndDate') {
            fieldsValue.push({ fieldName: val, fieldValue:convertUTCDateToLocalDate( new Date(revenue.EngagementEndDate) )})
          }else if (val === 'NumberofHours') {
            fieldsValue.push({ fieldName: val, fieldValue:revenue.NumberofHours/revenue.NumberofSeats})
          }else if (val === 'BillingAmount') {
            fieldsValue.push({ fieldName: val, fieldValue:revenue.BillingAmount/revenue.NumberofSeats})
          }
        else {
          fieldsValue.push({ fieldName: val, fieldValue: null })
        }
      })
      let fieldsDoNotdiaply = ['Customer'];//check
      let excludeFieldFromForm = [];//check
     let displayFieldlist = fields.filter((objOne) => {
        return !fieldsDoNotdiaply.some((objTwo) => {
          return objOne === objTwo;
        });
      });
      window.QafPageService.AddItem("Client_Allocation_Matrix",{},displayFieldlist,fieldsValue,null,null,fieldsDoNotdiaply,excludeFieldFromForm,null,null,null,true,null,null,null)
}

}
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
  
    newDate.setHours(hours - offset);
    return newDate;
  }
function expgrid_onRowActionEvent(eventName, row) {
    if (window.QafPageService) {
        if (eventName === 'VIEW') {
            window.QafPageService.ViewItem(expenseGrid.repository, row.RecordID, function () {
                loadCustomerRevenue();
            });

        } else if (eventName === 'EDIT') {
            window.QafPageService.EditItem(expenseGrid.repository, row.RecordID, function () {
                loadCustomerRevenue();
            }, null, null, null, null, ["Approvedamount"], ["Approvedamount"]);

        } else if (eventName === 'DELETE') {
            window.QafPageService.DeleteItem(row.RecordID, function () {
                loadCustomerRevenue();
            });
        }
    }
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


function getFullNameByRecordID(targetRecordID) {

    const Employee_Data = Employee;
    const targetRecord = Employee_Data.find(record => record.RecordID === targetRecordID);
    if (targetRecord) {
        const fullName = `${targetRecord.FirstName} ${targetRecord.LastName}`;
        return fullName;
    } else {
        return '';
    }
}