var ShiftConfiguration;
// let ShiftConfiguration;
var currentTab = 1;
var tabName = "activity";
var tabLable = "My Requests";
var TableData = [];
var Employee = [];
var ShiftAllocation_List = [];
var ShiftConfiguration_List = [];
var selectPolicyName;
var SearchSelectedEmployee;
var SelectedpolicyEmployer
var user;
var EmmployeeListReport;
var ShiftList;
var shiftRecordId;
var IsShiftBeforeToday;
var isOffboarded = false

var topbar = document.getElementById("header-title");
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        // document.getElementById("breadcrum").style.display = "none";
        const container = document.getElementsByClassName('container')[0];
        const activeTab1 = container.getElementsByClassName('tab-btn isActive')[0];
        const activeLine1 = activeTab1.parentNode.getElementsByClassName('line')[0];
        activeLine1.style.width = activeTab1.offsetWidth + 'px';
        activeLine1.style.left = activeTab1.offsetLeft + 'px';
        user = getCurrentUser();
        loadShiftConfig()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function showContent(tabId, tabNum, clickedButton) {
    tabLable = clickedButton.textContent;
    tabName = tabId;
    selectedTab = tabNum;
    let newTabValue = selectedTab - currentTab;
    movingTabs(newTabValue);
    currentTab = selectedTab;

    var allButtons = document.querySelectorAll(".tab-btn");
    allButtons.forEach(function (button) {
        button.classList.remove("isActive");
        button.style.fontWeight = "normal";
    });
    clickedButton.classList.add("isActive");
    clickedButton.style.fontWeight = "600";

    var tabBox = document.querySelector(".tab-box");
    var lineElement = document.querySelector(".line");
    var button = document.querySelector('[data-tab="' + tabId + '"]');

    var tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(function (content) {
        content.classList.remove("active");
    });

    var buttonRect = button.getBoundingClientRect();
    var tabBoxRect = tabBox.getBoundingClientRect();
    var offsetLeft = buttonRect.left - tabBoxRect.left;

    lineElement.style.width = button.offsetWidth + "px";
    lineElement.style.transform = "translateX(" + offsetLeft + "px)";

    var contentArea = document.getElementById(tabId);
    if (contentArea) {
        contentArea.classList.toggle("active");
    }
    
    switch (tabId) {
        case "activity":
            ;
            loadShiftConfig();
            break;
        case "other":
            clearAllocationsearch()
            loadShiftConfiguration_List();
            break;
            case "report":
            clearReportSearch()
            getEmployeeForReport();
            break;
        default:
            break;
    }
}
function clearAllocationsearch(){
    
    let allocationElement=document.getElementById('shfit-allocation-emp');
    if(allocationElement){
        allocationElement.checked=false
    }
    let searchInputSelected = document.getElementById("search-selectedEmployee");
    searchInputSelected.value = '';
    let searchCancle = document.getElementById('secondCancelSearch')
    if (searchCancle) {
        searchCancle.style.display = 'none'
    }
}
function clearReportSearch(){
    let allocationElement=document.getElementById('Offboarded');
    if(allocationElement){
        allocationElement.checked=false
    }
    let searchElement=document.getElementById('searchReport');
    if(searchElement){
        searchElement.value=""
    }
    let searchCancle = document.getElementById('cancelSearch-report')
    if (searchCancle) {
        searchCancle.style.display = 'none'
    }
}

function movingTabs(value) {
    const cards = document.querySelectorAll(".tab-content");
    cards.forEach((card, index) => {
        card.classList.remove("moving-left", "moving-right");
        if (value > 0) {
            card.classList.add("moving-right");
        } else if (value < 0) {
            card.classList.add("moving-left");
        } else {
            card.classList.remove("moving-left", "moving-right");
        }
    });
}

function loadShiftConfig() {
    ShowLoader()
    ShiftConfiguration = []
    let objectName = "Shift_Configuration";
    let list = 'LOPDays,Name,WorkingDays,Description,ForEvery4DaysLate,StartTime,EndTime,NumberofWorkingHrsforHalfDay,NumberofWorkingHrsforFullDay,WeeklyOff,CutOffTime';
    let fieldList = list.split(",");
    let pageSize = "100000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    // let whereClause="";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((shiftconfig) => {
        if (Array.isArray(shiftconfig) && shiftconfig.length > 0) {
            ShiftConfiguration = shiftconfig;
        }
        showData();
    });
}

function showData() {
    generateTable(ShiftConfiguration);
}

function isDateBeforeToday(insertedDate) {
    const currentDate = new Date();
    let TodaysDate = moment(currentDate).format('YYYY/MM/DD');
    let repoDate = moment(insertedDate).format('YYYY/MM/DD');
    return moment(repoDate).isBefore(TodaysDate, 'date')

}

function generateTable(TableData) {
    if (TableData && TableData.length > 0) {
        let tableRow = "";
        let tableHead = `
                  <th class="qaf-th action-head"></th>
                  <th class="qaf-th">Name</th>
                  <th class="qaf-th">Start Time</th>
                  <th class="qaf-th">End Time</th>
                  <th class="qaf-th">Number of Working Hrs for Half Day</th>
                  <th class="qaf-th">Number of Working Hrs for Full Day</th>
                  <th class="qaf-th">LOP Days</th>
                  <th class="qaf-th">CutOff Time</th>
                  <th class="qaf-th">Description</th>
                  <th class="qaf-th">For Every 4 Days Late</th>
                  <th class="qaf-th">Working Days</th>
                       `;
        TableData.forEach((entry, index) => {




            tableRow += `
                  <tr class="qaf-tr">
                  <td class="qaf-td action-cell">
                  <button class="action-btn" onclick="toggleActionButtons(this,'${entry.RecordID}','${entry.CreatedDate}')">
                  <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
              </td>
                  <td class="qaf-td">${entry.Name ? entry.Name : ""}</td>
                  <td class="qaf-td">${entry.StartTime ? entry.StartTime : ""}</td>
                  <td class="qaf-td">${entry.EndTime ? entry.EndTime : ""}</td>
                  <td class="qaf-td">${entry.NumberofWorkingHrsforHalfDay ? entry.NumberofWorkingHrsforHalfDay : ""}</td>
                  <td class="qaf-td">${entry.NumberofWorkingHrsforFullDay ? entry.NumberofWorkingHrsforFullDay : ""}</td>
                  <td class="qaf-td">${entry.LOPDays ? entry.LOPDays : ""}</td>
                  <td class="qaf-td">${entry.CutOffTime ? entry.CutOffTime : ""}</td>
                  <td class="qaf-td">${entry.Description ? entry.Description : ""}</td>
                  <td class="qaf-td">${entry.ForEvery4DaysLate ? entry.ForEvery4DaysLate : ""}</td>
                  <td class="qaf-td">${entry.WorkingDays ? entry.WorkingDays.split(';#').join(',') : ""}</td>
                  </tr>
                  `;

        });
        let tableValue = `
              <table class="qaf-table" id="table">
                  <thead class="qaf-thead">
                      <tr class="qaf-tr">
                          ${tableHead}
                      </tr>
                  </thead>
                  <tbody class="qaf-tbody">
                      ${tableRow}
                  </tbody>
              </table>
          `;
        document.getElementById('tablecontainer').innerHTML = tableValue;
        HideLoader()


    } else {
        filterData(TableData);
    }


}

function filterData(searchTerm) {
    if (searchTerm.length === 0) {
        const tableContainer = document.getElementById('tablecontainer');
        tableContainer.innerHTML = '';
        let tableHead = `
        <th class="qaf-th">Name</th>
        <th class="qaf-th">Start Time</th>
        <th class="qaf-th">End Time</th>
        <th class="qaf-th">Number of Working Hrs for HalfDay</th>
        <th class="qaf-th">Number of Working Hrs for FullDay</th>
        <th class="qaf-th">LOP Days</th>
        <th class="qaf-th">CutOff Time</th>
        <th class="qaf-th">Description</th>
        <th class="qaf-th">For Every 4Days Late</th>
        <th class="qaf-th">Working Days</th>  `;
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="10" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
        let tableHTML = `
              <table class="qaf-table" id="table">
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
              </table>
      `;
        tableContainer.innerHTML = tableHTML;
        HideLoader()
    }
    else {
        generateTable(searchTerm);

    }
}


function toggleActionButtons(button, recordID, shiftDate) {
    shiftRecordId = recordID;
    IsShiftBeforeToday = shiftDate
    //    console.log("IsShiftBeforeToday",IsShiftBeforeToday)
    const actionButtons = button.nextElementSibling;
    const allActionButtons = document.querySelectorAll('.action-buttons');
    allActionButtons.forEach(btn => {
        if (btn !== actionButtons) {
            btn.style.display = 'none';
        }
    });
    if (actionButtons) {
        if (actionButtons.style.display === 'block') {
            actionButtons.style.display = 'none';
        } else {
            actionButtons.style.display = 'block';
        }
    }

}

window.onclick = function (event) {
    let isShiftToday = isDateBeforeToday(IsShiftBeforeToday)
    if (!(event.target.classList.contains('fa-ellipsis-v') || event.target.classList.contains('action-btn'))) {
        document.getElementById("menuId").innerHTML = ``
    } else {
        if (!isShiftToday) {
            document.getElementById("menuId").innerHTML = `<div class="action-buttons" id="actionsButtons"  style="top: ${event.pageY - 70}px;left: ${event.pageX - 110}px;">
            <button class="view-btn" onclick="ViewRecord('${shiftRecordId}')"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</button>
             <button class="edit-btn" onclick="EditRecord('${shiftRecordId}')"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</button>
             <button class="delete-btn" onclick="DeleteRecord('${shiftRecordId}')"><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</button>
        </div>`
        }
        else {
            document.getElementById("menuId").innerHTML = `<div class="action-buttons" id="actionsButtons"  style="top: ${event.pageY - 70}px;left: ${event.pageX - 110}px;">
            <button class="view-btn" onclick="ViewRecord('${shiftRecordId}')"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</button>`
        }

    }
}

function getCurrentUser() {
    let userDetails = '';
    let userKey = window.localStorage.getItem('user_key');
    if (userKey) {
        let user = JSON.parse(userKey);
        if (user.value) {
            userDetails = user.value;
        }
    }
    return userDetails;
}

function loadShiftConfiguration_List() {
    ShowLoader();
    ShiftConfiguration_List = []
    let objectName = "Shift_Configuration";
    let list = 'Name';
    let fieldList = list.split(",");
    let pageSize = "100000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    // let whereClause="";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((shiftconfig) => {
        if (Array.isArray(shiftconfig) && shiftconfig.length > 0) {
            ShiftConfiguration_List = shiftconfig;
            selectPolicyName = shiftconfig[0]
        }

        loadPolicy()
    });
}

function loadPolicy() {
    let PolicyName = document.getElementById('selectpolicy');
    let options = `<option value=''> Select Policy</option>`;
    if (PolicyName) {
        ShiftConfiguration_List.forEach(policy => {
            options += `<option value="${policy.RecordID}">${policy.Name}</option>`;

        });
        PolicyName.innerHTML = options;
        PolicyName.value = selectPolicyName.RecordID
    }
    getEmployee()
}

function getEmployee() {
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,IsOffboarded';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `IsOffboarded!='True'<OR>IsOffboarded=''`;
    // let whereClause="";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            Employee = employees;
            Employee.sort((a, b) => {
                return a.FirstName.localeCompare(b.FirstName);
            });
            getshiftAllocation();
            ShowReport()

        }
    });

}

function getshiftAllocation() {
    ShiftAllocation_List = []
    let objectName = "Shift_Allocation";
    let list = 'Employee,ShiftName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((policy) => {
        if (Array.isArray(policy) && policy.length > 0) {
            ShiftAllocation_List = policy;
        }
        loadEmployee(Employee)
        loadSelectedEmployee();
        HideLoader();
    });

}


document.getElementById('search').addEventListener('keyup', function (event) {
    let searchCancle = document.getElementById('firstCancelSearch')
    if (searchCancle) {
        searchCancle.style.display = 'block'
    }
    if (event.key === "Enter") {
        let searchCancle = document.getElementById('firstCancelSearch')
        if (searchCancle) {
            searchCancle.style.display = 'block'
        }
        const searchTerm = event.target.value.trim();
        filterData(searchTerm);
    }
});

document.getElementById('search-selectedEmployee').addEventListener('keyup', function (event) {
    let searchCancle = document.getElementById('secondCancelSearch')
    if (searchCancle) {
        searchCancle.style.display = 'block'
    }
    if (event.key === "Enter") {
        let searchCancle = document.getElementById('secondCancelSearch')
        if (searchCancle) {
            searchCancle.style.display = 'block'
        }
        const searchTerm = event.target.value.trim();
        filterData2(searchTerm);
    }
});


function cancelSearch(SearchIdName) {

    let firstSearchBarId = "firstCancelSearch";
    let firstsearchCancle = document.getElementById('firstCancelSearch')
    let secondCancelSearch = document.getElementById('secondCancelSearch')
    if (SearchIdName.toLowerCase() === firstSearchBarId.toLowerCase()) {
        if (firstsearchCancle) {
            firstsearchCancle.style.display = 'none'
        }
        var searchInput = document.getElementById("search");
        searchInput.value = '';
        loadEmployee(Employee);
    }
    else {
        if (secondCancelSearch) {
            secondCancelSearch.style.display = 'none'
        }
        var searchselectedEmployee = document.getElementById("search-selectedEmployee");
        searchselectedEmployee.value = '';
        SearchSelectedEmployee = []
        loadSelectedEmployee();
    }

}

function filterData(searchTerm) {
    const filteredData = Employee.filter(item => {
        const firstName = item["FirstName"];
        const lastName = item["LastName"];
        if (firstName !== null && lastName !== null) {
            return (
                firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lastName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return '';
    });
    loadEmployee(filteredData);

}

function filterData2(searchTerm) {
    let SelectedPolicyRecordID = document.getElementById("selectpolicy").value
    let  SelectedpolicyEmployer = ShiftAllocation_List.filter(policy => policy.ShiftName.split(';#')[0] === SelectedPolicyRecordID);
    const filteredData = SelectedpolicyEmployer.filter(item => {
        const firstName = item["Employee"];
        if (firstName !== null) {
            return (
                firstName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return '';
    });

    if (filteredData.length > 0) {
        SearchSelectedEmployee = filteredData
        if (filteredData.length > 0) {
            let newSearchSelectedEmployee = filteredData
            let Number = document.getElementById('noofemployee');
        Number.textContent = `(${newSearchSelectedEmployee.length})`
        const myContent = document.querySelector(".selectedEmployeeNames");
        let html = "";
        let shiftEmployee=[]
        filteredData.forEach(val=>{
            shiftEmployee.push({
                RecordID:val.Employee.split(";#")[0],
                FirstName:val.Employee.split(";#")[1].split(' ')[0],
                LastName:val.Employee.split(";#")[1].split(' ')[1],
            })
        })
        if (shiftEmployee && shiftEmployee.length > 0) {
            shiftEmployee.forEach(emp => {
                html += `  
                    <div class="Employee-list second-tab-Employee">
                    <div class="name">
                        <span class="employee-name">${emp.FirstName} ${emp.LastName}</span>
                    </div>
                    <div class="add-employee-name">
                        <button class="btnAction btn btn-primary" onclick="RemoveEmployeeFromList('${emp.RecordID}')"><i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                    </div>
                </div> 
                      `
            });
            myContent.innerHTML = html;
        }
        else {
            html = `
                <div class="Employee-list">
                <div class="nodata">No Record Found</div>
              </div> 
                  `
        }
        myContent.innerHTML = html;
        }
        else {
            let Number = document.getElementById('noofemployee');
            Number.textContent = `(${filteredData.length})`
            const myContent = document.querySelector(".selectedEmployeeNames");
            let html = "";
            html = `
            <div class="Employee-list">
            <div class="nodata">No Record Found</div>
          </div> 
              `
            myContent.innerHTML = html;
        }
    }
    else {
        let Totalemployee = document.getElementById('noofemployee');
        Totalemployee.textContent = `(${filteredData.length})`

        const myContent = document.querySelector(".selectedEmployeeNames");
        let html = "";
        html = `
        <div class="Employee-list">
        <div class="nodata">No Record Found</div>
      </div> 
          `
        myContent.innerHTML = html;
    }


}

function loadEmployee(Employeedata) {
    const myContent = document.querySelector(".employeeNames");
    let html = "";

    if (Employeedata && Employeedata.length > 0) {
        Employeedata.forEach(emp => {
            html += `  
                
                <div class="Employee-list">
                <div class="name">
                    <span class="employee-name">${emp.FirstName + ` ` + emp.LastName}</span>
                </div>
                <div class="add-employee-name">
                    <button class="btnAction btn btn-primary" onclick="AddEmployeeinList('${emp.RecordID}')"><i class="fa fa-plus" aria-hidden="true"></i>
                </button>
                </div>
            </div> 
                  `
        });

        myContent.innerHTML = html;
    }
    else {
        html = `
            <div class="Employee-list">
            <div class="nodata">No Record Found</div>
          </div> 
              `
    }
    myContent.innerHTML = html;
}


document.getElementById("selectpolicy").addEventListener('change', loadNewMeeting);
function loadNewMeeting() {
    loadSelectedEmployee();
}


function loadSelectedEmployee() {
    // let SelectedShiftRecordID = document.getElementById("selectpolicy").value
    // if (SearchSelectedEmployee && SearchSelectedEmployee.length > 0) {
    //     let newSearchSelectedEmployee = SearchSelectedEmployee.filter(shift => shift.ShiftName.split(";#")[0] === SelectedShiftRecordID);
    //     SelectedpolicyEmployer = newSearchSelectedEmployee
    // }
    // else {
    //     SelectedpolicyEmployer = ShiftAllocation_List.filter(shift => shift.ShiftName.split(";#")[0] === SelectedShiftRecordID);
    // }

    // let Totalemployee = document.getElementById('noofemployee');
    // Totalemployee.textContent = `(${SelectedpolicyEmployer.length})`

    // const myContent = document.querySelector(".selectedEmployeeNames");
    // let html = "";
    // if (SelectedpolicyEmployer && SelectedpolicyEmployer.length > 0) {
    //     SelectedpolicyEmployer.forEach(emp => {
    //         html += `  
    //             <div class="Employee-list second-tab-Employee">
    //             <div class="name">
    //                 <span class="employee-name">${emp.Employee.split(';#')[1]}</span>
    //             </div>
    //             <div class="add-employee-name">
    //                 <button class="btnAction btn btn-primary" onclick="RemoveEmployeeFromList('${emp.RecordID}')"><i class="fa fa-times" aria-hidden="true"></i>
    //             </button>
    //             </div>
    //         </div> 
    //               `
    //     });
    //     myContent.innerHTML = html;
    // }
    // else {
    //     html = `
    //         <div class="Employee-list">
    //         <div class="nodata">No Record Found</div>
    //       </div> 
    //           `
    // }
    // myContent.innerHTML = html;
    filterDataOffboarded(false)
}


function checkEmployeeIsInShift(EmployeeID) {
    let selectedShifts = ShiftAllocation_List.filter(shift => shift.Employee.split(";#")[0] === EmployeeID);
    return selectedShifts;
}

function AddEmployeeinList(EmployeeId) {
    let IsShiftassigntoEmployee = checkEmployeeIsInShift(EmployeeId)

    if (IsShiftassigntoEmployee && IsShiftassigntoEmployee.length > 0) {
        let alertMessage = "Shift already present for this employee"
        openAlert(alertMessage);

    }
    else {
        let shiftName = document.getElementById('selectpolicy').value;
        const EmployeName = EmployeeId;
        const ShiftNameValue = shiftName;
        let SelectedEmployee
        let SelectedShift;
        if (EmployeName) {
            let employee = Employee.filter(emp => emp.RecordID === EmployeName);
            if (employee && employee.length > 0) {
                SelectedEmployee = employee[0].RecordID + ";#" + employee[0].FirstName + " " + employee[0].LastName;
            }
        }
        if (ShiftNameValue) {
            let getShiftName = ShiftConfiguration_List.filter(dept => dept.RecordID === ShiftNameValue);
            if (getShiftName && getShiftName.length > 0) {
                SelectedShift = getShiftName[0].RecordID + ";#" + getShiftName[0].Name;
            }
        }
        let object = {
            Employee: SelectedEmployee,
            ShiftName: SelectedShift,
        };
        save(object, 'Shift_Allocation');
        let alertMessage = `Shift allocated to ${SelectedEmployee.split(";#")[1]}`
        openAlert(alertMessage);

    }

}


function RemoveEmployeeFromList(RecordID) {
    let SelectedPolicyRecordID = document.getElementById("selectpolicy").value
    let  SelectedpolicyEmployer = ShiftAllocation_List.filter(policy => policy.ShiftName.split(';#')[0] === SelectedPolicyRecordID);
    let shiftPolicy=SelectedpolicyEmployer.find(a=>a.Employee.split(";#")[0]===RecordID)
    if(shiftPolicy&&shiftPolicy.RecordID){
    if (window.QafPageService) {
        window.QafPageService.DeleteItem(shiftPolicy.RecordID, function () {
            getshiftAllocation();
        });
    }
    }
}

function save(object, repositoryName) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        user = getCurrentUser()
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
            getshiftAllocation();
            resolve({
                response
            })
        });
    }
    )
}

function openAlert(message) {
    let qafAlertObject = {
        IsShow: true,
        Message: message,
        Type: 'ok'
    }
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}

function AddRecord() {
    if (window.QafPageService) {
        let Repository = 'Shift_Configuration';
        window.QafPageService.AddItem(Repository, function () {
            loadShiftConfig();
        });
    }
}

function ViewRecord(RecordID) {
    if (window.QafPageService) {
        let Repository = 'Shift_Configuration';
        window.QafPageService.ViewItem(Repository, RecordID, function () {
            loadShiftConfig();
        });
    }

}

function EditRecord(RecordID) {
    if (window.QafPageService) {
        let Repository = 'Shift_Configuration';
        window.QafPageService.EditItem(Repository, RecordID, function () {
            loadShiftConfig();
        });
    }
}

function DeleteRecord(RecordID) {
    if (window.QafPageService) {
        window.QafPageService.DeleteItem(RecordID, function () {
            loadShiftConfig();
        });
    }
}

function removeAllEmployeeFromList() {

    SelectedpolicyEmployer.forEach((val, index) => {
        const user = getCurrentUser();
        fetch(`https://demtis.quickappflow.com/api/DeleteRecord?recordID=${val.RecordID}`, {
            method: 'POST',
            headers: {
                'Host': 'demtis.quickappflow.com',
                'Employeeguid': user.EmployeeGUID,
                'Hrzemail': user.Email
            }
        }).then(() => {
            if (index === SelectedpolicyEmployer.length - 1) {
                SelectedpolicyEmployer = [];
                getshiftAllocation();
            }
        });
    });

}



function getEmployeeForReport() {
    ShowLoader();
    EmmployeeListReport = []
    let objectName = "Employees";
    let list = 'RecordID,EmployeeID,FirstName,LastName,IsOffboarded';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `IsOffboarded!='True'<OR>IsOffboarded=''`;
    // let whereClause="";
    let offboardElement = document.getElementById('Offboarded');
    if (offboardElement) {
        isOffboarded = offboardElement.checked;
    }
    if (isOffboarded) {
        whereClause = "";
    }

    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((emps) => {
        if (Array.isArray(emps) && emps.length > 0) {
            EmmployeeListReport = emps;
        }
        getshiftList();
    });
}

function getshiftList() {
    ShiftList = []
    let objectName = "Shift_Allocation";
    let list = 'Employee,ShiftName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((shifts) => {
        if (Array.isArray(shifts) && shifts.length > 0) {
            ShiftList = shifts;
        }
        ShowReport();
    });
}

function toggleCheckbox() {
    getEmployeeForReport();
}


function ShowReport() {
    getNewEmployee();
    TableData = sortData(EmmployeeListReport);
    GenerateReport(TableData);
}

function getNewEmployee() {
    const result = [];
    const UndefinedShifName = 'undefined';
    EmmployeeListReport.forEach(emp => {
        const matchedShift = ShiftList.find(policy => policy.Employee.split(';#')[0] === emp.RecordID);
        if (matchedShift) {
            const shiftName = matchedShift.ShiftName;
            if (shiftName) {
                let NewShiftName = shiftName.split(';#')[1];
                if (NewShiftName.toLowerCase() === UndefinedShifName.toLowerCase()) {
                    emp.ShiftName = '';
                } else {
                    emp.ShiftName = NewShiftName
                }
            } else {
                emp.ShiftName = '';
            }
        } else {
            emp.ShiftName = '';
        }
        result.push(emp);
    });
    return result;
}


function GenerateReport(TableData) {
    // console.log("Table Data",TableData)
    if (TableData && TableData.length > 0) {
        let tableHead = `
                        <th class="qaf-th">Emp ID</th>
                        <th class="qaf-th">Employee Name</th>
                        <th class="qaf-th">Shift Name</th>
                         `;
        let tableRow = "";

        TableData.forEach(entry => {
            let EmpID = entry.EmployeeID;
            let employeeName = (entry.FirstName ? entry.FirstName : "") + (entry.LastName ? " " + entry.LastName : "");
            let ShiftName = entry.ShiftName ? entry.ShiftName : "";

            // Only add the row if both employeeName and ShiftName are not empty strings
            if (employeeName.trim() !== "" || ShiftName.trim() !== "") {
                tableRow += `
                    <tr class="qaf-tr">
                        <td class="qaf-td">${EmpID}</td>
                        <td class="qaf-td">${employeeName}</td>
                        <td class="qaf-td">${ShiftName}</td>
                    </tr>
                `;
            }
        });

        let tableValue = `
            <table class="qaf-table" id="table">
                <thead class="qaf-thead">
                    <tr class="qaf-tr">
                        ${tableHead}
                    </tr>
                </thead>
                <tbody class="qaf-tbody">
                    ${tableRow}
                </tbody>
            </table>
        `;
        document.getElementById('ShiftReport').innerHTML = tableValue;
        HideLoader()
    } else {
        filterReport(TableData);
    }
}


// Event listener for the Enter Kry event on the search input
document.getElementById('searchReport').addEventListener('keyup', function (event) {
    let searchCancle = document.getElementById('cancelSearch-report')
    if (searchCancle) {
        searchCancle.style.display = 'block'
    }
    if (event.key === "Enter") {
        let searchCancle = document.getElementById('cancelSearch-report')
        if (searchCancle) {
            searchCancle.style.display = 'block'
        }
        const searchTerm = event.target.value.trim();
        filterReport(searchTerm);
    }
});


function cancelSearchReport() {
    let searchCancle = document.getElementById('cancelSearch-report')
    if (searchCancle) {
        searchCancle.style.display = 'none'
    }
    var searchInput = document.getElementById("searchReport");
    searchInput.value = '';
    GenerateReport(TableData);

}


function filterReport(searchTerm) {
    const filteredData = TableData.filter(item => {
        const firstName = item["FirstName"];
        const lastName = item["LastName"];
        if (firstName !== null && lastName !== null) {
            return (
                firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lastName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return '';
    });
    if (filteredData.length === 0) {
        const tableContainer = document.getElementById('ShiftReport');
        tableContainer.innerHTML = '';
        let tableHead = `
                        <th class="qaf-th">Employee Name</th>
                        <th class="qaf-th">Shift Name</th>    `;
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="2" class="qaf-td" ><div class='no-data'>No Record Found</div></td>`;
        let tableHTML = `
                <table class="qaf-table" id="table">
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
                </table>
        `;
        tableContainer.innerHTML = tableHTML;
        HideLoader()
    }
    else {
        GenerateReport(filteredData);

    }

}

function sortData(data) {
    return data.slice().sort((a, b) => {
        if (a.FirstName && b.FirstName) {
            const firstNameA = a.FirstName.toLowerCase();
            const firstNameB = b.FirstName.toLowerCase();

            if (firstNameA < firstNameB) {
                return -1;
            }
            if (firstNameA > firstNameB) {
                return 1;
            }
            return 0;
        } else if (!a.FirstName && b.FirstName) {

            return 1;
        } else if (a.FirstName && !b.FirstName) {

            return -1;
        } else {

            return 0;
        }
    });
}

function download_csv() {
    let data = TableData;
    let csvData = [];
    data.forEach(val => {
        let EmpID = val["EmployeeID"] ? val["EmployeeID"] : "";
        let employeeName = (val["FirstName"] ? val["FirstName"] : "") + " " + (val["LastName"] ? val["LastName"] : "");
        let shiftName = val["ShiftName"] ? val["ShiftName"] : "";
        csvData.push([EmpID, employeeName, shiftName].join(","));
    });

    let csvBody = csvData.join('\n');
    let csvHeader = ["EmpID", "Employee Name", "Shift Name"].join(',') + '\n';
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Shift Allocation Report' + '.csv';
    hiddenElement.click();
}


function ShowLoader() {
    let secondTab = document.getElementById('secondTab')
    if (secondTab) {
        secondTab.style.display = 'none'
    }
    let ShiftReportTableElement = document.getElementById('ShiftReport')
    if (ShiftReportTableElement) {
        ShiftReportTableElement.style.display = 'none'
    }
    let pageDisabledElement = document.getElementById('pageDisabled');
    if (pageDisabledElement) {
        pageDisabledElement.classList.add('page-disabled')
    }
    let isloadingElement = document.getElementById('isloading');
    if (isloadingElement) {
        isloadingElement.style.display = 'block'
    }
}

function HideLoader() {
    let pageDisabledElement = document.getElementById('pageDisabled');
    let isloadingElement = document.getElementById('isloading');
    if (pageDisabledElement) {
        pageDisabledElement.classList.remove('page-disabled')
    }
    if (isloadingElement) {
        let secondTab = document.getElementById('secondTab')
        if (secondTab) {
            secondTab.style.display = 'block'
        }
        let ShiftReportTableElement = document.getElementById('ShiftReport')
        if (ShiftReportTableElement) {
            ShiftReportTableElement.style.display = 'flex'
        }
        isloadingElement.style.display = 'none'
    }
}
function toggleoffboardingEmployeeShift(){
    let isOffboardingEmployee=false
    let offboardElement = document.getElementById('shfit-allocation-emp');
    if (offboardElement) {
        isOffboardingEmployee = offboardElement.checked;
    }
    filterDataOffboarded(isOffboardingEmployee);
}
function filterDataOffboarded(isOffboardingEmployee) {
    
    let filteredData=[];
    let SelectedPolicyRecordID = document.getElementById("selectpolicy").value
    let  SelectedpolicyEmployer = ShiftAllocation_List.filter(policy => policy.ShiftName.split(';#')[0] === SelectedPolicyRecordID);
if(isOffboardingEmployee){
    let geofenceEmployee=[]
    SelectedpolicyEmployer.forEach(val=>{
        geofenceEmployee.push({
            RecordID:val.Employee.split(";#")[0],
            FirstName:val.Employee.split(";#")[1].split(' ')[0],
            LastName:val.Employee.split(";#")[1].split(' ')[1],
        })
    })
     filteredData = geofenceEmployee
 
}else{
  
    filteredData = Employee.filter((objOne) => {
        return SelectedpolicyEmployer.some((objTwo) => {
            return objOne.RecordID === objTwo.Employee.split(";#")[0];
        });
    });
}
    

    if (filteredData.length > 0) {
        let newSearchSelectedEmployee = filteredData
        let Number = document.getElementById('noofemployee');
    Number.textContent = `(${newSearchSelectedEmployee.length})`
    const myContent = document.querySelector(".selectedEmployeeNames");
    let html = "";
    if (newSearchSelectedEmployee && newSearchSelectedEmployee.length > 0) {
        newSearchSelectedEmployee.forEach(emp => {
            html += `  
                <div class="Employee-list second-tab-Employee">
                <div class="name">
                    <span class="employee-name">${emp.FirstName} ${emp.LastName}</span>
                </div>
                <div class="add-employee-name">
                    <button class="btnAction btn btn-primary" onclick="RemoveEmployeeFromList('${emp.RecordID}')"><i class="fa fa-times" aria-hidden="true"></i>
                </button>
                </div>
            </div> 
                  `
        });
        myContent.innerHTML = html;
    }
    else {
        html = `
            <div class="Employee-list">
            <div class="nodata">No Record Found</div>
          </div> 
              `
    }
    myContent.innerHTML = html;
    }
    else {
        let Number = document.getElementById('noofemployee');
        Number.textContent = `(${filteredData.length})`
        const myContent = document.querySelector(".selectedEmployeeNames");
        let html = "";
        html = `
        <div class="Employee-list">
        <div class="nodata">No Record Found</div>
      </div> 
          `
        myContent.innerHTML = html;
    }


}