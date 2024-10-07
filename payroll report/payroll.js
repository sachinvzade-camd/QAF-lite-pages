var employeeName;
var entity;
var state;
var accountNumber;
var pfNumber;
var accountTitle;
var esiNumber;
var bankName;
var bankAccountNumber;
var ifsc;
var TableColumns = [];
var TableData = []
var EmployeesList = []
var EmployeesSalriesList = []
var employeeListAll = []
var totalctcCalculation = 0;
var totalDeductionCalculation = 0;
var salaryHeadList = []
var salaryHeadDeductionList = []
var Salary;
var employeeStatutory = [];
var employeeid;
var openmenuindex;
var isDeduction = false
var funFirstapiURL = "https://inskferda.azurewebsites.net"
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = SITapiURL
var failArrayList=[]
var sitHostURL='qaffirst.quickappflow.com'
var funFirstHostURL='funfirst.quickappflow.com'
var maHostName=window.location.host
var deleteemployeeID;
// var originalData;
// var tableValue;
function getSalaryDetails() {
    let isExpenseDataloadingElement=document.getElementById('isExpenseDataloading');
    if(isExpenseDataloadingElement){
        isExpenseDataloadingElement.style.display='block'
    }

    let importresponseElement=document.getElementById('importresponse');
    if(importresponseElement){
        importresponseElement.style.display='none'
    }
    let isloadingElement=document.getElementById('isloading');
    if(isloadingElement){
        isloadingElement.style.display='none'
    }
    let backdrop=document.getElementById('backdrop');
    if(backdrop){
        backdrop.style.display='none'
    }
    let empcount=document.getElementById('empcount');
        if(empcount){
            empcount.innerHTML=``
        }
    Salary = null
    TableColumns = []
    EmployeesList = []
    EmployeesSalriesList = []
    TableData = []
    document.getElementById('table').innerHTML = ""
    addMenu()

    let user = getCurrentUser();
    fetch(`${apURL}/api/SalDets?`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.value.EmployeeGUID,
            'Hrzemail': user.value.Email
        },
    })
        .then(response => response.json())
        .then(data => {
            let isExpenseDataloadingElement=document.getElementById('isExpenseDataloading');
    if(isExpenseDataloadingElement){
        isExpenseDataloadingElement.style.display='none'
    }
            if (data && data.Employees && data.Employees.length > 0) {
                Salary = data
                generateTable(TableData)
            }else{
                document.getElementById('table').innerHTML = `<p class='no-record'>No Record Found</p>`; 
            }
        })
        .catch(error => console.error(error));

}
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        window.localStorage.setItem('ma', maHostName)
        let backdrop=document.getElementById('backdrop');
        if(backdrop){
            backdrop.style.display='none'
        }
        let isloadingElement=document.getElementById('isloading');
        if(isloadingElement){
            isloadingElement.style.display='none'
        }
        getSalaryDetails()
        getEmployee()
        getEmployeeListTemp()
        clearInterval(qafServiceLoaded);
    }
  }, 10);



function generateTable(TableData) {

    if (TableData && TableData.length === 0) {
        TableColumns = Salary.TableCols;
        EmployeesList = Salary.Employees;
        EmployeesSalriesList = [...Salary.SalaryHeads];
        TableColumns = TableColumns.sort((a, b) => a.Sequence - b.Sequence);
        EmployeesList.forEach(emp => {
            let obj = {}
            TableColumns.forEach(val => {
                let empvalue = emp[val.INN];
                if (empvalue) {
                    obj[val.INN] = empvalue
                } else {
                    let salary = EmployeesSalriesList.filter(salary => getRecordIDFromJson(salary.Employee) === emp.RecordID);
                    if (salary && salary.length > 0) {
                        salary.forEach(sal => {
                            if(sal.SalaryHead){
                            if (sal.SalaryHead.toLowerCase() === val.DN.toLowerCase()) {
                                obj[val.INN] = sal.MonthlyAmount ? sal.MonthlyAmount : "0"
                            }}
                        })
                    }
                }
            })
            TableData.push(obj)
        })
        let empcount=document.getElementById('empcount');
        if(empcount){
            empcount.innerHTML=`For ${EmployeesList.length} employees`
        }
    }
    if (TableData && TableData.length >0) {
        let tableHead = "";
        let tableRow = "";
        let startRow = '<tr class="qaf-tr">'
        let endRow = '</tr>'
        TableColumns.forEach(column => {
            tableHead += ` <th class="qaf-th">${column.DN}</th>`
        })
        TableData.forEach(data => {
            tableRow += startRow
            TableColumns.forEach(column => {
                tableRow += `<td class="qaf-td">${data[column.INN] ? data[column.INN] : "0"}</td>`
            })
            tableRow += endRow;
        })

        let tableValue = `
                <thead class="qaf-thead">
                    <tr class="qaf-tr">
                      ${tableHead}
                    </tr>
                </thead>
                <tbody class="qaf-tbody">
                   ${tableRow}
                </tbody>
    `
        document.getElementById('table').innerHTML = tableValue
    }
    if (TableData && TableData.length >0) {
        let tableHead = "";
        let tableRow = "";
        let startRow = '<tr class="qaf-tr ">';
        let endRow = '</tr>';

        // Add the actions column header
        tableHead += '<th class="action-head qaf-th qaf-tr-head" ></th>';
        // tableHead += '<th class="action-head qaf-th qaf-tr-head" >Actions</th>';

        TableColumns.forEach(column => {
            tableHead += `<th class="qaf-th qaf-tr-head">${column.DN}</th>`;
        });

        TableData.forEach((data, index) => {
            
            tableRow += startRow;

            // Add the actions cell for each row
            tableRow += `
            <td class="action-cell">
            <div class="action-btn-menu">
                <button class="action-btn" onclick="openFormCtCstructreForm('${data.EmployeeID}')">
                    <i class="fa fa-pencil"></i>
                </button>
                <button class="action-btn"  onclick="onDeletePayrollStructure('${data.EmployeeID}')">
                <i class="fa fa-trash-o"></i>
            </button>
            </div>
            </td>
        `;
    //     <div class="action-buttons" id="actionsButtons${index}">
    //     <button class="delete-btn"onclick="openFormCtCstructreForm('${data.EmployeeID}')">Edit Salary Earning</button>
    //     <button class="delete-btn" onclick="openFormCtCDeductionForm('${data.EmployeeID}')">Edit Salary Deduction</button>
    // </div>
            TableColumns.forEach(column => {
                tableRow += `<td class="qaf-td">${data[column.INN] ? data[column.INN] : "0"}</td>`;
            });

            tableRow += endRow;
        });

        let tableValue = `
        <thead class="qaf-thead">
            <tr class="qaf-tr">
                ${tableHead}
            </tr>
        </thead>
        <tbody class="qaf-tbody">
            ${tableRow}
        </tbody>
    `;

        document.getElementById('table').innerHTML = tableValue;
    }else{
        document.getElementById('table').innerHTML = `<p class='no-record'>No Record Found</p>`;
    }
}

function onDeletePayrollStructure(employeeID){
    // alert("You want do perform delete action?")
    deleteemployeeID=employeeID
    openAlert()
    
  

}
document.addEventListener('alertclose', (event) => {
    let actionType=event.detail
        if(actionType==='yes'){
            let user = getCurrentUser();
    let employee = EmployeesList.filter(a => a.EmployeeID === deleteemployeeID)
    if(employee&&employee.length>0){
    fetch(`${apURL}/api/DSlaS?employeeID=${employee[0].RecordID}`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.value.EmployeeGUID,
            'Hrzemail': user.value.Email
        },
    })
        .then(response => response.json())
        .then(data => {
            getSalaryDetails()
        })
        .catch(error => console.error(error));
    }
        }
  });
function openAlert(){
    let qafAlertObject={
        IsShow:true,
        Message:"Are you sure you want to delete this record?"
    }
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}

function filterData(searchTerm) {
    const filteredData = TableData.filter(item =>
        item["EmployeeName"].toLowerCase().includes(searchTerm.toLowerCase())
    );
{/* <i class="fa fa-sort sorted-button" aria-hidden="true" onclick="sortTable('${column.INN}')"></i> */}
    if (filteredData.length === 0) {
        const tableElement = document.getElementById('table');
        tableElement.innerHTML = '';
        let tableHead = '';
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';

        tableHead += '<th class="action-head qaf-th">Actions</th>';
        TableColumns.forEach(column => {
            tableHead += `<th class="qaf-th">${column.DN}</th>`;
        });
        let tableRow = `<td colspan="${TableColumns.length + 1}" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
        let tableHTML = `
                    <thead class="qaf-thead">
                        <tr class="qaf-tr">
                            ${tableHead}
                        </tr>
                     </thead>
                     <tbody class="qaf-tbody">
                        ${startRow}
                            ${tableRow}
                         ${endRow}
                    </tbody>
        `;
        tableElement.innerHTML = tableHTML;
    }
    else {
        generateTable(filteredData);

    }

}

document.getElementById('search').addEventListener('keyup', function (event) {
       let searchCancle = document.getElementById('cancelSearch')
    if (searchCancle) {
        searchCancle.style.display = 'block'
    }
    if (event.key === "Enter") {
    let searchCancle = document.getElementById('cancelSearch')
    if (searchCancle) {
        searchCancle.style.display = 'block'
    }
    const searchTerm = event.target.value.trim();
    filterData(searchTerm);
}
});

function cancelSearch() {
    let searchCancle = document.getElementById('cancelSearch')
    if (searchCancle) {
        searchCancle.style.display = 'none'
    }
    var searchInput = document.getElementById("search");
    searchInput.value = '';
    generateTable(TableData);

}

function addCssforscroll() {
    var element = document.querySelector("body");
    element.classList.add("hide-y-scroll");
}
function removeCss() {
    var element = document.querySelector("body");
    element.classList.remove("hide-y-scroll");
}



window.onclick = function (event) {
    if (!(event.target.classList.contains('fa-ellipsis-v') || event.target.classList.contains('action-btn'))) {
        var dropdowns = document.getElementsByClassName("action-buttons");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = document.getElementById(dropdowns[i].id);
            if (openDropdown.style.display === 'block') {
                openDropdown.style.display = 'none'
            }
        }


    } else {
        var dropdowns = document.getElementsByClassName("action-buttons");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = document.getElementById(dropdowns[i].id);
            if ((`actionsButtons${openmenuindex}`).toLowerCase() != dropdowns[i].id.toLowerCase()) {
                if (openDropdown.style.display === 'block') {
                    openDropdown.style.display = 'none'
                }
            }
        }
    }


    if (!event.target.matches('.morebtn')) {
        var dropdowns = document.getElementsByClassName("moredropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}



function toggleActionButtons(index) {
    openmenuindex = index;
    let actionsButtons = document.getElementById(`actionsButtons${index}`);
    if (actionsButtons) {
        let actionsButtons = document.getElementById(`actionsButtons${index}`);
        actionsButtons.style.display = 'block'
    }
}

function getAllData() {
    employeeName = document.getElementById("employeeName");
    entity = document.getElementById("entity");
    state = document.getElementById("state");
    accountNumber = document.getElementById("accountNumber");
    pfNumber = document.getElementById("pfNumber");
    accountTitle = document.getElementById("accountTitle");
    esiNumber = document.getElementById("esiNumber");
    bankName = document.getElementById("bankName");
    bankAccountNumber = document.getElementById("bankAccountNumber");
    ifsc = document.getElementById("ifsc");

}

function openForm() {
    let popUp = document.getElementById("popupContainer");
    if (popUp) {
        popUp.style.display = 'block';
        let actionsButtons = document.getElementById("actionsButtons");
        actionsButtons.style.display = 'none'
    }

}

function closeForm(popUpID) {
    removeCss();
    let popUp = document.getElementById(popUpID);
    if (popUp) {
        popUp.style.display = 'none'
    }
    salaryHeadList=[]
    salaryHeadDeductionList=[]
    removeAllValues(popUpID)
}

function removeAllValues(popUpform) {
    let popFormName = popUpform.toLowerCase();
    let salary_component = 'ctcCalculation';
    if (popFormName === salary_component.toLocaleLowerCase()) {
        const inputs = document.querySelectorAll('.sc-input');
        inputs.forEach((input) => {
            input.value = "";
        });
    }
    if (employeeName) {
        employeeName.value = "";
    }
    if (entity) {
        entity.value = "";
    }
    if (state) {
        state.value = "";
    }
    if (accountNumber) {
        accountNumber.value = "";
    }
    if (pfNumber) {
        pfNumber.value = "";
    }
    if (accountTitle) {
        accountTitle.value = "";
    }
    if (esiNumber) {
        esiNumber.value = "";
    }
    if (bankName) {
        bankName.value = "";
    }
    if (bankAccountNumber) {
        bankAccountNumber.value = "";
    }
    if (ifsc) {
        ifsc.value = "";
    }
}

function openAddForm() {
    totalctcCalculation=0
    totalDeductionCalculation=0
    salaryHeadList=[]
    salaryHeadDeductionList=[]
    let displaytotal = document.getElementById('totalctcCalculation');
    if (displaytotal) {
        displaytotal.innerHTML = 0
    }
    addCssforscroll()
    const NextButton = document.getElementById('NextButton');
    if (NextButton) {
        NextButton.disabled = true;
        NextButton.classList.add('disabled');
    }
    let ctcstructure = document.getElementById("ctcstructure");
    if (ctcstructure) {
        ctcstructure.style.display = 'block'
    }
    resetValue()
    employeeStatutory = []
    employeeid = ""
    document.getElementById('empname-main').style.display = 'none';
    document.getElementById('empname').style.display = 'none';
    document.getElementById('employee').style.display = 'block';
    document.getElementById('employee-main').style.display = 'block';
    getEmployee()
}
function getEmployeeListTemp() {
    tempEmpList = []
    let objectName = "Employees";
    let list = 'FirstName,LastName,IsOffboarded,EmployeeID'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            tempEmpList = employees
        }
    });
}


function getEmployee() {
    employeeListAll = []
    let objectName = "Employees";
    let list = 'FirstName,LastName,IsOffboarded,EmployeeID'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `IsOffboarded!='True'`;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            debugger
            employeeListAll = employees
            let employeeDropdown = document.getElementById('employee');
            let options = `<option value=''>Select Employee</option>`
            if (employeeDropdown) {
                employees.forEach(emp => {
                    options += `<option value=${emp.RecordID}>${emp.FirstName} ${emp.LastName}</option>`
                })
                employeeDropdown.innerHTML = options;
            }

            let employeeSearchDropdown = document.getElementById('employee-search');
            let optionsSearch = `<option value=''>Select Employee</option>`
            if (employeeSearchDropdown) {
                employees.forEach(emp => {
                    optionsSearch += `<option value=${emp.RecordID}>${emp.FirstName} ${emp.LastName}</option>`
                })
                employeeSearchDropdown.innerHTML = optionsSearch;
            }

        }
    });
}
function nextForm() {
    let employeeFullName = ""
    let employeeRecordID = ""
    let employeeID = ""
    let employeeElement = document.getElementById("employee");
    let employeevalue = employeeElement.value;
    if (employeevalue || employeeid) {
        let pfelement = document.getElementById("PF");
        let EPSelement = document.getElementById("EPS");
        let ESIelement = document.getElementById("ESI");
        let LWFelement = document.getElementById("LWF");
        let PTelement = document.getElementById("PT");
        let pfvalue = pfelement.checked;
        let EPSvalue = EPSelement.checked;
        let ESIvalue = ESIelement.checked;
        let LWFvalue = LWFelement.checked;
        let PTvalue = PTelement.checked;
        if (employeevalue) {
            let employee = tempEmpList.filter(emp => emp.RecordID === employeevalue);
            if (employee && employee.length > 0) {
                employeeFullName = employee[0].RecordID + ";#" + employee[0].FirstName + " " + employee[0].LastName;
                employeeRecordID = employee[0].RecordID
                employeeID = employee[0].EmployeeID
                document.getElementById('empnamecomponet').innerHTML=employee[0].FirstName + " " + employee[0].LastName;
            }
        }
        if (employeeid) {
            let employee = tempEmpList.filter(emp => emp.RecordID === employeeid);
            if (employee && employee.length > 0) {
                employeeFullName = employee[0].RecordID + ";#" + employee[0].FirstName + " " + employee[0].LastName;
                employeeRecordID= employee[0].RecordID
                employeeID = employee[0].EmployeeID
                document.getElementById('empnamecomponet').innerHTML=employee[0].FirstName + " " + employee[0].LastName;
            }
        }

        let statutary = {
            Employee: employee = JSON.stringify([{ UserType: 1, RecordID: employeeRecordID }]),
            EmployeeID:employeeID,
            PF: pfvalue ? true : false,
            EPS: EPSvalue ? true : false,
            ESI: ESIvalue ? true : false,
            LWF: LWFvalue ? true : false,
            PT: PTvalue ? true : false,
        }
        const NextButton = document.getElementById('NextButton');
        if (NextButton) {
            NextButton.disabled = true;
            NextButton.classList.add('disabled');
        }
        if (employeeStatutory && employeeStatutory.RecordID) {
            updateRecord(statutary, 'Employee_Statutory', employeeStatutory.RecordID)
            let ctcstructure = document.getElementById("ctcstructure");
            if (ctcstructure) {
                ctcstructure.style.display = 'none'
            }
            let ctcCalculation = document.getElementById("ctcCalculation");
            if (ctcCalculation) {
                ctcCalculation.style.display = 'block'
            }
            totalDeductionCalculation=0
            let displaytotal = document.getElementById('totaldeducation');
    if (displaytotal) {
        displaytotal.innerHTML = totalDeductionCalculation
    }
            getSalaryHead()

        } else {
            save(statutary, 'Employee_Statutory')

        }
    } else {
        alert("Please select employee!")
    }
}
function save(object, repositoryName) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        var user = getCurrentUser()
        Object.keys(object).forEach((key, value) => {
            recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: object[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = repositoryName;
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.CreateItem(intermidiateRecord).then(response => {
            resetValue()
            let ctcstructure = document.getElementById("ctcstructure");
            if (ctcstructure) {
                ctcstructure.style.display = 'none'
            }
            let ctcCalculation = document.getElementById("ctcCalculation");
            if (ctcCalculation) {
                ctcCalculation.style.display = 'block'
            }
            getSalaryHead()
            resolve({
                response
            })
        });
    }
    )

}
function openFormCtCstructreForm(id) {
    const NextButton = document.getElementById('NextButton');
    if (NextButton.classList.contains('disabled')) {
        NextButton.disabled = false;
        NextButton.classList.remove('disabled');
    }
    isDeduction = false
    document.getElementById('empname-main').style.display = 'block';
    document.getElementById('empname').style.display = 'block';
    addCssforscroll()
    let employee = EmployeesList.filter(a => a.EmployeeID === id)
    if (employee && employee.length > 0) {
        let fullname = employee[0].FirstName + " " + employee[0].LastName;
        employeeid = employee[0].RecordID;
        document.getElementById('empname').innerHTML = fullname;
        document.getElementById('employee').style.display = 'none';
        document.getElementById('employee-main').style.display = 'none';

        getEmployeeStatury()
    }
    let ctcstructure = document.getElementById("ctcstructure");
    if (ctcstructure) {
        ctcstructure.style.display = 'block'
    }
    let componentname = document.getElementById("componentname");
    componentname.innerHTML = 'Salary Component'
    let costocompany = document.getElementById("costocompany");
    costocompany.innerHTML = 'Cost to company'
}



function openFormCtCDeductionForm(id) {
    isDeduction = true
    document.getElementById('empname-main').style.display = 'block';
    document.getElementById('empname').style.display = 'block';
    addCssforscroll()
    let employee = EmployeesList.filter(a => a.EmployeeID === id)
    if (employee && employee.length > 0) {
        let fullname = employee[0].FirstName + " " + employee[0].LastName;
        employeeid = employee[0].RecordID;
        document.getElementById('empname').innerHTML = fullname;
        document.getElementById('employee').style.display = 'none';
        document.getElementById('employee-main').style.display = 'none';

    }
    let ctcstructure = document.getElementById("ctcstructure");
    if (ctcstructure) {
        ctcstructure.style.display = 'none'
    }
    let ctcCalculation = document.getElementById("ctcCalculation");
    if (ctcCalculation) {
        ctcCalculation.style.display = 'block'
    }
    let componentname = document.getElementById("componentname");
    componentname.innerHTML = 'Deduction Component'
    let costocompany = document.getElementById("costocompany");
    costocompany.innerHTML = 'Total Deduction'
    getSalaryHead()
}


function calculateAllAmount() {
    totalctcCalculation = 0
    salaryHeadList.forEach(head => {
        let headElement = document.getElementById(`${head.RecordID}`);
        let basicvalue = 0
        if (headElement) {
            basicvalue = headElement.value ? parseInt(headElement.value) : 0
        }
        totalctcCalculation += basicvalue;
    })
    let displaytotal = document.getElementById('totalctcCalculation');
    if (displaytotal) {
        displaytotal.innerHTML = totalctcCalculation
    }
}
function  calculateAllDeducationAmount()
{
    totalDeductionCalculation = 0
    salaryHeadDeductionList.forEach(head => {
        if(head.InternalName.toLowerCase()==='Income Tax'.toLowerCase()||head.InternalName.toLowerCase()==='TDS'.toLowerCase()){

        }else{
            let headElement = document.getElementById(`${head.RecordID}`);
            let basicvalue = 0
            if (headElement) {
                basicvalue = headElement.value ? parseInt(headElement.value) : 0
            }
            totalDeductionCalculation += basicvalue;
        }
        
    })
    let displaytotal = document.getElementById('totaldeducation');
    if (displaytotal) {
        displaytotal.innerHTML = totalDeductionCalculation
    }
}


function getSalaryHead() {
    let salaryHeadeForm= document.getElementById('salaryHeadeForm')
    if(salaryHeadeForm){
        salaryHeadeForm.innerHTML=""
    }
    let salaryHeadeDeductionForm= document.getElementById('salaryHeadeDeductionForm')
    if(salaryHeadeDeductionForm){
        salaryHeadeDeductionForm.innerHTML=""
    }
    salaryHeadList = []
    let user = getCurrentUser();
    let selectedEmployee = ""
    let employeeElement = document.getElementById("employee");
    if (employeeid) {
        selectedEmployee = employeeid
    } else {
        selectedEmployee = employeeElement.value

    }
    const data = new URLSearchParams();
    fetch(`${apURL}/api/SalaryHeads?employeeID=${selectedEmployee}&ctc=0`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.value.EmployeeGUID,
            'Hrzemail': user.value.Email
        },
    })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
             earning = data.filter(a => a.Category.toLowerCase()==="Earning".toLowerCase()||a.Category.toLowerCase()==="Reimbursement".toLowerCase())
              
                     deduction= data.filter(a =>  a.Category.toLowerCase()==="Deduction".toLowerCase())
               
                    if(earning&&earning.length>0){
                    earning.forEach(val => {
                    salaryHeadList.push(
                        {
                            Title: val.Title,
                            RecordID: val.RecordID,
                            InternalName: val.Name,
                            Sequence: val.Sequence
                        }
                    )
                    salaryHeadList = salaryHeadList.sort((a, b) => a.Sequence - b.Sequence);

                    })}
                deduction.forEach(val => {
                    salaryHeadDeductionList.push(
                        {
                            Title: val.Title,
                            RecordID: val.RecordID,
                            InternalName: val.Name,
                            Sequence: val.Sequence
                        }
                    )
                    salaryHeadDeductionList = salaryHeadDeductionList.sort((a, b) => a.Sequence - b.Sequence);

                })
                setSalaryHeadeForm()
                setSalaryHeadDeducationForm()
            }
        })
        .catch(error => console.error(error));

}
function onsalaryInput(recordID){
    let employeeElement = document.getElementById("employee");
    let empRecordID=employeeid;
    if(employeeElement){
        if(!empRecordID){
            empRecordID=employeeElement.value
        }
    }
    salaryHeadList.forEach(head=>{
        if (head.RecordID === recordID) {
            let salary = EmployeesSalriesList.filter(salary => getRecordIDFromJson(salary.Employee) === empRecordID);
            let salaryComponent = salary.filter(a => a.SalaryComponentID === head.RecordID)
          

            let salaryhead = document.getElementById(head.RecordID);
            if (salaryhead) {
                if (salaryComponent && salaryComponent.length > 0) {
                    salaryComponent[0].MonthlyAmount = salaryhead.value
                }
                else {
                    EmployeesSalriesList.push({
                        Employee: `[{\"usertype\":1,\"RecordID\":\"${empRecordID}\"}]`,
                        MonthlyAmount: salaryhead.value,
                        SalaryComponentID: head.RecordID,
                        SalaryHead: head.Title
                    })
                }
            }
            let newEmpSal = [...EmployeesSalriesList]
            newEmo.forEach(salarylist => {
                if (getRecordIDFromJson(salarylist.Employee) === empRecordID) {
                    if (salarylist.SalaryComponentID === head.RecordID) {
                        salarylist.MonthlyAmount = Number(salaryhead.value)
                    }
                }

            })
            EmployeesSalriesList = [...newEmpSal]
        }
    })
}
function setSalaryHeadeForm() {
    
    let form = "";
    let salarycomponentcontentid=document.getElementById('salary-component-content-id')
    if(salarycomponentcontentid){
        salarycomponentcontentid.scroll({
            top: 0,
            behavior: 'smooth'
          });}
        salaryHeadList.forEach((head,index) => {
        form += `
        <div class='salaryhead-control'>
            <div class="form-column">
                    <label class="sc-label" for="basic">${head.Title}</label>
                  </div>
                  <div class="form-column control-delete-icon">
                    <input class="sc-input" type="text" id="${head.RecordID}" name="${head.RecordID}" autocomplete="off" oninput="onsalaryInput('${head.RecordID}')" onblur="calculateAllAmount()">
                    <i class="fa fa-trash-o" aria-hidden="true" onclick="deleteHeade('${head.RecordID}')"></i>

                  </div>
                  </div>
            `
    })
    document.getElementById('salaryHeadeForm').innerHTML = form
    let employeeElement = document.getElementById("employee");
    
    if (employeeid) {
        let salary = EmployeesSalriesList.filter(salary => getRecordIDFromJson(salary.Employee) === employeeid);
        salaryHeadList.forEach(val => {
            let salaryComponent = salary.filter(a => a.SalaryComponentID === val.RecordID)
            let salaryhead = document.getElementById(val.RecordID);
            if(salaryhead){
            if (salaryComponent && salaryComponent.length > 0) {
                salaryhead.value = salaryComponent[0].MonthlyAmount
            }}
        })
        calculateAllAmount()
    }
   
}
function deleteHeade(recordID){
    salaryHeadList=salaryHeadList.filter(a=>a.RecordID!=recordID)
    setSalaryHeadeForm()
}
function deleteHeadeDeducation(recordID){
    salaryHeadDeductionList=salaryHeadDeductionList.filter(a=>a.RecordID!=recordID)
    setSalaryHeadDeducationForm()
}
function setSalaryHeadDeducationForm() {
    let form = "";
    salaryHeadDeductionList.forEach(head => {
        if(head.InternalName.toLowerCase()==='Income Tax'.toLowerCase()||head.InternalName.toLowerCase()==='TDS'.toLowerCase()){
            form += `
        <div class='salaryhead-control'>
            <div class="form-column">
                    <label class="sc-label" for="basic">${head.Title}</label>
                  </div>
                  <div class="form-column control-delete-icon asapplicable">
                    <div class='text-applicable'id="${head.RecordID}">As applicable</div>
                    <i class="fa fa-trash-o" aria-hidden="true" onclick="deleteHeadeDeducation('${head.RecordID}')"></i>
                  </div>
                  </div>
            `
        }else{
            form += `
            <div class='salaryhead-control'>
                <div class="form-column">
                        <label class="sc-label" for="basic">${head.Title}</label>
                      </div>
                      <div class="form-column control-delete-icon">
                        <input class="sc-input" type="text" id="${head.RecordID}" name="${head.RecordID}" autocomplete="off"  oninput="onsalaryDeductionInput('${head.RecordID}')" onblur="calculateAllDeducationAmount()">
                        <i class="fa fa-trash-o" aria-hidden="true" onclick="deleteHeadeDeducation('${head.RecordID}')"></i>
    
                      </div>
                      </div>
                `
        }
       
    })
    document.getElementById('salaryHeadeDeductionForm').innerHTML = form
    if (employeeid) {
        let salary = EmployeesSalriesList.filter(salary => getRecordIDFromJson(salary.Employee) === employeeid);
        salaryHeadDeductionList.forEach(val => {
            let salaryComponent = salary.filter(a => a.SalaryComponentID === val.RecordID)
            let salaryhead = document.getElementById(val.RecordID);
            if(salaryhead){
            if (salaryComponent && salaryComponent.length > 0) {
                salaryhead.value = salaryComponent[0].MonthlyAmount
            }}
        })
        calculateAllDeducationAmount()
    }
    calculateAllDeducationAmount()  

}
function onsalaryDeductionInput(recordID){
    let employeeElement = document.getElementById("employee");
    let empRecordID=employeeid;
    if(employeeElement){
        if(!empRecordID){
            empRecordID=employeeElement.value
        }
    }
    salaryHeadDeductionList.forEach(head => {
        if (head.RecordID === recordID) {
            let salary = EmployeesSalriesList.filter(salary => getRecordIDFromJson(salary.Employee) === empRecordID);
            let salaryComponent = salary.filter(a => a.SalaryComponentID === head.RecordID)
            let salaryhead = document.getElementById(head.RecordID);
            if (salaryhead) {
                if (salaryComponent && salaryComponent.length > 0) {
                    salaryComponent[0].MonthlyAmount = salaryhead.value
                }
                else {
                    EmployeesSalriesList.push({
                        Employee: `[{\"usertype\":1,\"RecordID\":\"${empRecordID}\"}]`,
                        MonthlyAmount: salaryhead.value,
                        SalaryComponentID: head.RecordID,
                        SalaryHead: head.Title
                    })
                }
            }
            let newEmpSal = [...EmployeesSalriesList]
            newEmo.forEach(salarylist => {
                if (getRecordIDFromJson(salarylist.Employee) === empRecordID) {
                    if (salarylist.SalaryComponentID === head.RecordID) {
                        salarylist.MonthlyAmount = Number(salaryhead.value)
                    }
                }

            })
            EmployeesSalriesList = [...newEmpSal]
        }
    })
}
function getCurrentUser() {
    let userKey = window.localStorage.getItem('user_key');
    return JSON.parse(userKey);
}
function SaveCTCForm() {
    let salaryCalculationArray = []
    salaryHeadList.forEach(val => {
        let salaryhead = document.getElementById(val.RecordID);
        if(salaryhead){
        salaryCalculationArray.push(
            {
                Calculateon: "false",
                IsSalarySlip: true,
                Percent: 0,
                PayType: "Monthly",
                RecordID: val.RecordID,
                Title: val.Title,
                FlatAmount: salaryhead.value ? parseInt(salaryhead.value) : 0
            }
        )}
    })
    if(salaryHeadDeductionList&&salaryHeadDeductionList.length>0){
    salaryHeadDeductionList.forEach(val => {
        let salaryhead = document.getElementById(val.RecordID);
        if(salaryhead){
        salaryCalculationArray.push(
            {
                Calculateon: "false",
                IsSalarySlip: true,
                Percent: 0,
                PayType: "Monthly",
                RecordID: val.RecordID,
                Title: val.Title,
                FlatAmount: salaryhead.value ? parseInt(salaryhead.value) : 0
            }
        )}
    })}
    SaveSalaryHead(salaryCalculationArray)
}

function SaveSalaryHead(salaryCalculationArray) {
    let user = getCurrentUser();
    let selectedEmployee = ""
    let employeeElement = document.getElementById("employee");
    if (employeeid) {
        selectedEmployee = employeeid
    } else {
        selectedEmployee = employeeElement.value

    }
    fetch(`${apURL}/api/Ssbpa?employeeID=${selectedEmployee}&ctc=${totalctcCalculation}&isearning=${isDeduction ? false : true}`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.value.EmployeeGUID,
            'Hrzemail': user.value.Email,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(salaryCalculationArray)
    })
        .then(response => response.json())
        .then(data => {
            salaryHeadList=[]
            salaryHeadDeductionList=[]
            let ctcCalculation = document.getElementById("ctcCalculation");
            if (ctcCalculation) {
                ctcCalculation.style.display = 'none'
            }

            let employeeObject = {
                RecordID: employeeElement.value,
                CostToCompany: totalctcCalculation
            }
            if (!isDeduction) {
                update(employeeObject, 'Employees')
            } else {
                getSalaryDetails()

            }
        })
        .catch(error => console.error(error));

}

function update(object, repositoryName) {
    let employeeElement = document.getElementById("employee");

    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        var user = getCurrentUser()
        Object.keys(object).forEach((key, value) => {
            recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: object[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = repositoryName;
        intermidiateRecord.RecordID = employeeElement.value;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem
            (intermidiateRecord).then(response => {
                getSalaryDetails()

                resolve({
                    response
                })
            });
    }
    )



}


function resetValue() {
    let pfelement = document.getElementById("PF");
    let EPSelement = document.getElementById("EPS");
    let ESIelement = document.getElementById("ESI");
    let LWFelement = document.getElementById("LWF");
    let PTelement = document.getElementById("PT");
    pfelement.checked = false
    EPSelement.checked = false
    ESIelement.checked = false
    LWFelement.checked = false
    PTelement.checked = false
}

function getRecordIDFromJson(value) {
    let jsonvalue = JSON.parse(value);
    return jsonvalue[0].RecordID
}

function getEmployeeStatury() {
    let objectName = "Employee_Statutory";
    let list = 'Employee,PF,EPS,ESI,LWF,PT'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `Employee='${employeeid}'`;
    let orderBy = "true"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((details) => {

        if (Array.isArray(details) && details.length > 0) {
            employeeStatutory = details[0]

            let pfelement = document.getElementById("PF");
            let EPSelement = document.getElementById("EPS");
            let ESIelement = document.getElementById("ESI");
            let LWFelement = document.getElementById("LWF");
            let PTelement = document.getElementById("PT");
            pfelement.checked = employeeStatutory.PF
            EPSelement.checked = employeeStatutory.EPS
            ESIelement.checked = employeeStatutory.ESI
            LWFelement.checked = employeeStatutory.LWF
            PTelement.checked = employeeStatutory.PT
        }
    });
}

function updateRecord(object, repositoryName, RecordID) {

    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        var user = getCurrentUser()
        Object.keys(object).forEach((key, value) => {
            recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: object[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = repositoryName;
        intermidiateRecord.RecordID = RecordID;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem
            (intermidiateRecord).then(response => {
                resolve({
                    response
                })
            });
    }
    )



}

function download_csv() {
    let data = TableData;
    
    // let newHeader = Object.keys(data[0]); // header row
    let newHeader = []; // header row

    data.forEach(val=>{
        if(newHeader.length<Object.keys(val).length){
            newHeader=Object.keys(val);
        }
    })
    data.forEach(val=>{
    newHeader.forEach(header=>{
        if(val.hasOwnProperty(header)){

        }else{
            val[header]="0"
        }
        })
    })

    // let newHeader = Object.keys(data[0]).join(',') + '\n'; // header row
    let csvData=[]
    data.forEach(val=>{
            let newvalue=[];
            newHeader.forEach(header=>{
                let value=val[header]
                newvalue.push(value)
            })
            csvData.push(newvalue.join(","))
    })

    let csvBody=csvData.join('\n');
    // let csvBody = data.map(row =>
    //     Object.values(row).join(',')).join('\n');
    let csvHeader = [];
    newHeader.forEach(val => {
        TableColumns.forEach(column => {
            if (val.toLowerCase() === column.INN.toLowerCase()) {
                csvHeader.push(column.DN)
            }
        })
    })
    csvHeader = csvHeader.join(',') + '\n';
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Payroll' + '.csv';
    hiddenElement.click();
}


function addMenu() {
    let dropdown = document.getElementById('moreDropdown');
    let actionmenu = ''
    if (dropdown) {
        actionmenu += `<a onclick="download_csv()">Export</a><a onclick="import_csv()">Import    <form enctype="multipart/form-data" class="import-file">
        <input id="upload" type=file name="files[]" >
      </form></a>`
        dropdown.innerHTML = actionmenu
    }
}
function myMoreButton() {
    document.getElementById("moreDropdown").classList.toggle("show");
}

var EmployeeNameELEMENT = document.getElementById('employee');
EmployeeNameELEMENT.addEventListener('change', handleMakeNextButtonDisable);
function handleMakeNextButtonDisable() {
    let EmployeeNameInsideElement = document.getElementById('employee');
    const NextButton = document.getElementById('NextButton');
    if (EmployeeNameInsideElement && EmployeeNameInsideElement.value === '') {
        NextButton.disabled = true;
        NextButton.classList.add('disabled');
    } else {
        NextButton.disabled = false;
        NextButton.classList.remove('disabled');
    }
}

function import_csv(){
    let rightpanel=document.getElementById('qafrightpanel');
    let backdrop=document.getElementById('backdrop');
    if(rightpanel){
        rightpanel.classList.add('qaf-open')
    }
    if(backdrop){
        backdrop.style.display='block'
    }
  
   
}
function onFileChangeFile(){
  let fileToRead = document.getElementById("upload");
    fileToRead.click();
    fileToRead.onchange = () => {
        onFileChange( fileToRead.files)
      }
}

function onFileChange(multiplefiles)
{
    let pageDisabledElement=document.getElementById('pageDisabled');
    if(pageDisabledElement){
        pageDisabledElement.classList.add('page-disabled')
    }
    let isloadingElement=document.getElementById('isloading');
    if(isloadingElement){
        isloadingElement.style.display='block'
    }
    var result;
    var files = multiplefiles;
    var i, f;
    //Loop through files
    for (i = 0, f = files[i]; i != files.length; ++i)
    {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e)
        {
           
            const arrayBuffer = e.currentTarget.result;

            // Parse arrayBuffer to binary string
            const data = new Uint8Array(arrayBuffer);
            // const binaryString = data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      
            // Use TextDecoder to convert binary string to proper text
            const text = new TextDecoder().decode(new Uint8Array(data));
      
            // parse excel to json
            const workbook = XLSX.read(text, { type: 'binary' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
            formatExecelData(jsonData)
        };
        reader.readAsArrayBuffer(f);
    }

}

function formatExecelData(excelRows) {
    let fileupload = document.getElementById("upload");
    if(fileupload){
        fileupload.value = "";
    }
    let newExcelRows = []
let commonemployeeids=excelRows.filter((v, i, a) => a.findIndex(t => (t['Employee ID']  === v['Employee ID'])) === i);

commonemployeeids.forEach(val=>{
let object={}
    object['EmployeeID']=val['Employee ID'];
    let salImpComponentArray=[];
    let compkeys=Object.keys(val);
    compkeys.forEach(key=>{
        let salcomponentobject={}
        if(key!='Employee ID'){
            salcomponentobject['Title']=key
            salcomponentobject['Amount']=val[key]
            salImpComponentArray.push(salcomponentobject)
        }

    })
    object['Heads']=salImpComponentArray;
    newExcelRows.push(object)
})
uploadSalDetails(newExcelRows)
  }

function uploadSalDetails(newExcelRows){
    let totalCount=newExcelRows.length;

    let user = getCurrentUser();
    fetch(`${apURL}/api/ImpSlaps`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.value.EmployeeGUID,
            'Hrzemail': user.value.Email,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(newExcelRows)
    })
        .then(response => response.json())
        .then(data => {
            failArrayList=data
            
            let pageDisabledElement=document.getElementById('pageDisabled');
            if(pageDisabledElement){
                pageDisabledElement.classList.remove('page-disabled')
            }
            let isloadingElement=document.getElementById('isloading');
            if(isloadingElement){
                isloadingElement.style.display='none'
            }
            let failCount=data.length
            let successCount=totalCount-data.length
            let importresponseElement=document.getElementById('importresponse');
            if(importresponseElement){
                importresponseElement.style.display='block'
            }
            let successimportElement=document.getElementById('successimport');
            if(successimportElement){
                successimportElement.innerHTML=`Success - ${successCount}`
            }
            let failimportElement=document.getElementById('failimport');
            if(failimportElement){
                failimportElement.innerHTML=`Failed - ${failCount}`
            }

        })
        .catch(error => console.error(error));
}
function downloadImportReport(){
    let data = [];
    failArrayList.forEach(val=>{
        let object={}
        object["Employee ID"]=val.EmployeeID
        if(val.Heads&&val.Heads.length>0){
            val.Heads.forEach(hd=>{
                object[hd.Title]=hd.Amount
            })
        }
data.push(object)
    })
    // let newHeader = Object.keys(data[0]); // header row
    let newHeader = []; // header row
    data.forEach(val=>{
        if(newHeader.length<Object.keys(val).length){
            newHeader=Object.keys(val);
        }
    })
    data.forEach(val=>{
    newHeader.forEach(header=>{
        if(val.hasOwnProperty(header)){

        }else{
            val[header]="0"
        }
        })
    })
    let csvData=[]
    data.forEach(val=>{
            let newvalue=[];
            newHeader.forEach(header=>{
                let value=val[header]
                newvalue.push(value)
            })
            csvData.push(newvalue.join(","))
    })

    // exportData(data,'PayrollReport')

    let csvBody=csvData.join('\n');
    let csvHeader = newHeader;
    csvHeader = csvHeader.join(',') + '\n';
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'PayrollStatus' + '.csv';
    hiddenElement.click();
}

function exportData(json, excelFileName) {
    const worksheet = XLSX.utils.json_to_sheet(json);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const arrayBuffer= XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(arrayBuffer, excelFileName);
}

function saveAsExcelFile(arrayBuffer, fileName) {
    const data= new Blob([arrayBuffer], { type: '.xlsx' });
    FileSaver.saveAs(data, fileName + '.xlsx');
}

function closePage(){
    let rightpanel=document.getElementById('qafrightpanel');
    let backdrop=document.getElementById('backdrop');
    if(rightpanel){
        rightpanel.classList.remove('qaf-open')
    }
    if(backdrop){
        backdrop.style.display='none'
    }
    getSalaryDetails()

}

function downloadTemplate() {
    let csvBody="";
    let csvHeader = ["Employee ID","Employee Name","Basic","House Rent Allowance","City Allowance","Statutory Bonus","Professional Tax","PF - Employee Contribution","VPF Employee Contribution","ESI - Employee contribution","Income Tax","ESI - Employer contribution","PF - Employer Contribution","Gratuity","Food Coupon","Variable","Petrol Reimbursement","TDS","Medical Allowance","Conveyance Allowance","Arrears","Salary Advance","MLWF","Other Deduction"];
    csvHeader = csvHeader.join(',') + '\n';
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Payroll' + '.csv';
    hiddenElement.click();
}
function onEmployeeDropdownChange(){

}