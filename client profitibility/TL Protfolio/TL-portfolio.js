var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;
var Employee = [];
var clientAllocationMatrixList=[]
var expenseClaim_Data;
var currentDate = new Date();
var FirstDay;
var LastDay;
var TLProfibility={
    NameOfTeamLead:'',
    NoOfClient:0,
    TotalRevenue:0,
    TotalCostEmp:0,
    clientProfibility:0,
}
var clientProfibilityList=[]

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
        getEmployee();
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
        getClientAllocation();


    });

}
var expenseGrid = {
    repository: 'Client_Allocation_Matrix',
    columns: [
        { field: 'NameOfTeamLead', displayName: 'Name of Team Lead', sorting: false },
        { field: 'NoOfClient', displayName: 'No of Client', sorting: false },
        { field: 'TotalRevenue', displayName: 'Total Revenue', sorting: false },
        { field: 'TotalCostEmp', displayName: 'Total Cost', sorting: false },
        { field: 'clientProfibility', displayName: 'Client Profitability', sorting: false },

    ],
    viewFields: ["NameOfTeamLead", "NoOfClient", "TotalRevenue", "clientProfibility"],
    page: 1,
    pageSize: 10,
    dateFormat: 'YYYY/MM/DD',
    currentSelectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    filter: ""
}

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var gridExpenseColumns =  [
    { field: 'NameOfTeamLead', displayName: 'Name of Team Lead', sorting: false },
        { field: 'NoOfClient', displayName: 'No of Client', sorting: false },
        { field: 'TotalRevenue', displayName: 'Total Revenue', sorting: false },
        { field: 'TotalCostEmp', displayName: 'Total Cost', sorting: false },
        { field: 'clientProfibility', displayName: 'Client Profitability', sorting: false },
];



function getClientAllocation() {
    clientAllocationMatrixList = []
    let objectName = "Client_Allocation_Matrix";
    let list = 'RecordID,Customer,ProductOffering,Employee,NumberofHours,BillingAmount,BillingAmount,HourlyRate';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((revenues) => {
        if (Array.isArray(revenues) && revenues.length > 0) {
            clientAllocationMatrixList = revenues;
            clientAllocationMatrixList=clientAllocationMatrixList.filter(a=>a.ProductOffering.toLowerCase().includes("tl")||a.ProductOffering.toLowerCase().includes("team lead"))
            getCommonEmployee()
        }
    });

}
function getCommonEmployee(){
    
    let expenseGridElement = document.querySelector('#expgrid');
    if (expenseGridElement) {
    expenseGridElement.show = true;
    resetObject()
    let commonEmployee=clientAllocationMatrixList.filter((v,i,a)=>a.findIndex(t=>userOrGroupField(t.Employee)===userOrGroupField(v.Employee))===i);
        commonEmployee.forEach(val => {
            resetObject()
            let employees = clientAllocationMatrixList.filter(a => userOrGroupField(a.Employee) === userOrGroupField(val.Employee));
            if (employees && employees.length > 0) {
                
                TLProfibility.NameOfTeamLead = val.Employee?`${getFullName(userOrGroupField(val.Employee))}<style>                      
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

 
                      </style>`:'';
                TLProfibility.NoOfClient = employees.length;
                TLProfibility.TotalRevenue = employees.reduce((acc, value) => acc + Number(value.BillingAmount), 0);
                let totalCost = 0
                employees.forEach(emp => {
                    totalCost += emp.NumberofHours * emp.HourlyRate
                })
                TLProfibility.TotalCostEmp=totalCost
                let ctc=TLProfibility.TotalRevenue-totalCost
                TLProfibility.clientProfibility = (ctc / TLProfibility.TotalRevenue) * 100
                clientProfibilityList.push(TLProfibility)
                resetObject()
                let employeesCustomers=employees.filter(a=>a.Employee===val.Employee);;
                let commonCustomer=employeesCustomers.filter((v,i,a)=>a.findIndex(t=>(t.Customer)===(v.Customer))===i);;
                if(commonCustomer&&commonCustomer.length>0){
                    commonCustomer.forEach(val=>{
                        resetObject()
                        TLProfibility.NameOfTeamLead = "";
                        TLProfibility.NoOfClient = val.Customer;
                        let customers = commonCustomer.filter(a => (a.Customer) === (val.Customer));
                        if(customers&&customers.length>0){
                         TLProfibility.TotalRevenue = customers.reduce((acc, value) => acc + Number(value.BillingAmount), 0);
                     let totalCostCustomer = 0
                      customers.forEach(emp => {
                        totalCostCustomer += emp.NumberofHours * emp.HourlyRate
                        })
                        TLProfibility.TotalCostEmp=totalCostCustomer
                        let ctcustomer=TLProfibility.TotalRevenue-totalCostCustomer
                        TLProfibility.clientProfibility = (ctcustomer / TLProfibility.TotalRevenue) * 100
                        clientProfibilityList.push(TLProfibility)

                        }
                    })
                }
                 

            }
        })
        expenseGridElement.Data = clientProfibilityList;
        expenseGridElement.show = false;
    }
}

function resetObject(){
     TLProfibility={
        NameOfTeamLead:'',
        NoOfClient:0,
        TotalRevenue:0,
        clientProfibility:0,
        TotalCostEmp:0
    }
}
function userOrGroupField(id) {
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

    if (cname === "NoOfClient"||cname === "ClientName") {
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


function userOrGroupField(id) {
    if (id) {
        if (id && id.includes("[{")) {
            return (JSON.parse(id))[0].RecordID;
        }
        else {
            return id && id.includes(";#") ? id.split(";#")[0] : id;
        }
    }
}


function getFullName(targetRecordID) {
    debugger
    const Employee_Data_tl = Employee;
    const targetRecordTL = Employee_Data_tl.find(record => record.RecordID === targetRecordID);
    if (targetRecordTL) {
        const fullNameTL = `${targetRecordTL.FirstName} ${targetRecordTL.LastName}`;
        return fullNameTL;
    } else {
        return '';
    }
}