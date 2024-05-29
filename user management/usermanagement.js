
var Employee = [];
var LocationList = [];
var departmentList = [];
var applist = [];
var selectedApps = []
var EmployeeRecordId;
var employeeSaveObject = {}
var saveUser = ""
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = SITapiURL;
var employeeListForResetPassword = [];
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {

        getDepartment()
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getDepartment() {
    departmentList = []
    let objectName = "Department";
    let list = 'Name';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((departments) => {
        if (Array.isArray(departments) && departments.length > 0) {
            departmentList = departments;
            getLocation()
        }
    });
}

function getLocation() {
    LocationList = []
    let objectName = "Location";
    let list = 'Name';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((locations) => {
        if (Array.isArray(locations) && locations.length > 0) {
            LocationList = locations;
            getEmployee()
        }
    });
}

function getEmployee() {
    ShowLoader()
    Employee = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,Department,Email,OfficeLocation';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((emplist) => {
        if (Array.isArray(emplist) && emplist.length > 0) {
            Employee = emplist.reverse();
        }
        generateReport();
    });
}

function generateReport() {
    TableData = Employee;
    let reportContainerElement = document.getElementById('reportContainer')
    reportContainerElement.innerHTML = ""
    if (TableData && TableData.length > 0) {

        let tableHead = `
        <th class="qaf-th action-head"></th>
        <th class="qaf-th">First Name </th>
        <th class="qaf-th">Last Name</th>
        <th class="qaf-th">Email</th>
        <th class="qaf-th">Department</th>
        <th class="qaf-th">Ofiice Location</th>
        `;
        let tableRow = "";

        TableData.forEach(entry => {
            const FirstName = entry.FirstName ? entry.FirstName : "";
            const LastName = entry.LastName ? entry.LastName : "";
            const Email = entry.Email ? entry.Email : "";
            const Department = entry.Department ? entry.Department.split(";#")[1] : "";
            const OfficeLocation = entry.OfficeLocation ? entry.OfficeLocation.split(";#")[1] : "";
            tableRow += `
                <tr class="qaf-tr">
                    <td class="qaf-td action-cell">
                        <button class="action-btn" onclick="toggleActionButtons(this,'${entry.RecordID}')">
                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </button>
                    </td>
                    <td class="qaf-td">${FirstName}</a></td>
                    <td class="qaf-td">${LastName}</td>
                    <td class="qaf-td">${Email}</td>
                    <td class="qaf-td">${Department}</td>
                    <td class="qaf-td">${OfficeLocation}</td>
        
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

        reportContainerElement.innerHTML = tableValue;
        HideLoader();
    }
    else {

        let tableHead = `
        <th class="qaf-th">First Name </th>
        <th class="qaf-th">Last Name</th>
        <th class="qaf-th">Email</th>
        <th class="qaf-th">Department</th>
        <th class="qaf-th">Ofiice Location</th>  
        `;

        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="5" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
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
        reportContainerElement.innerHTML = tableHTML;
        HideLoader();
    }
}



function toggleActionButtons(button, recordID) {
    EmployeeRecordId = recordID;

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
    if (!(event.target.classList.contains('fa-ellipsis-v') || event.target.classList.contains('action-btn'))) {
        document.getElementById("menuId").innerHTML = ``
    } else {
        document.getElementById("menuId").innerHTML = `<div class="action-buttons" id="actionsButtons"  style="top: ${event.pageY - 70}px;left: ${event.pageX - 0}px;">
        <button class="view-btn" onclick="ViewRecord('${EmployeeRecordId}')"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</button>
         <button class="edit-btn" onclick="EditRecord('${EmployeeRecordId}')"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</button>
         <button class="delete-btn" onclick="DeleteRecord('${EmployeeRecordId}')"><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</button>
    </div>`
    }
}

function ShowLoader() {

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
        isloadingElement.style.display = 'none'
    }
}

function addCssforscroll() {
    var element = document.querySelector("body");
    element.classList.add("hide-y-scroll");
}
function removeCss() {
    var element = document.querySelector("body");
    element.classList.remove("hide-y-scroll");
}

function AddForm() {
    // loadTable()
    let popUp = document.getElementById("userForm");
    if (popUp) {
        popUp.style.display = 'block';
        setDepartmentinDropdown()

        addCssforscroll()

    }
}

function CloseForm() {
    let popUp = document.getElementById("userForm");
    let secondsection = document.getElementById("second-section");
    let thirdsection = document.getElementById("third-section");
    if (popUp) {
        popUp.style.display = 'none';
        secondsection.style.display = 'none';
        thirdsection.style.display = 'none';
        removeCss()
    }
    let blurdivElement = document.getElementById('blurdiv');
    if (blurdivElement) {
        blurdivElement.classList.remove('page-blur')
    }
    resetFrom()
}

function resetFrom() {
    let officeLocationElement = document.getElementById('officeLocation');
    if (officeLocationElement) {
        officeLocationElement.value = "";
    }

    let departmentElement = document.getElementById('Department');
    if (departmentElement) {
        departmentElement.value = "";
    }

    let emailElement = document.getElementById('Email');
    if (emailElement) {
        emailElement.value = ""
    }
    let lastNameElement = document.getElementById('lastName');
    if (lastNameElement) {
        lastNameElement.value = ""
    }
    let firstNameElement = document.getElementById('firstName');
    if (firstNameElement) {
        firstNameElement.value = ""
    }
}

function setDepartmentinDropdown() {
    let departmentElement = document.getElementById('Department');
    let options = `<option value=''>Select Department</option>`;
    if (departmentElement) {
        departmentList.forEach(dept => {

            options += `<option value="${dept.RecordID}">${dept.Name}</option>`;
        });
        departmentElement.innerHTML = options;
    }
    SetOfficeloacationdropdown()
}


function SetOfficeloacationdropdown() {
    let officeLocationElement = document.getElementById('officeLocation');
    let options = `<option value=''> Select Office Location</option>`;
    if (officeLocationElement) {
        LocationList.forEach(loc => {
            options += `<option value="${loc.RecordID}">${loc.Name}</option>`;
        });
        officeLocationElement.innerHTML = options;
    }

}

function nextFormFirst() {

    let isloadingElement = document.getElementById('isloadingpopup');
    if (isloadingElement) {
        isloadingElement.style.display = 'block'
    }
    getSaveObject();

}
function getSaveObject() {

    let officeLocationElement = document.getElementById('officeLocation');
    let officelocation = ""
    if (officeLocationElement) {
        let officevalue = officeLocationElement.value;
        if (officevalue) {
            let singleofficelocation = LocationList.filter(lc => lc.RecordID === officevalue);
            if (singleofficelocation && singleofficelocation.length > 0) {
                officelocation = singleofficelocation[0].RecordID + ";#" + singleofficelocation[0].Name
            }
        }
    }

    let departmentElement = document.getElementById('Department');
    let department = ""
    if (departmentElement) {
        let departmentvalue = departmentElement.value;
        if (departmentvalue) {
            let singleofficeDepartment = departmentList.filter(lc => lc.RecordID === departmentvalue);
            if (singleofficeDepartment && singleofficeDepartment.length > 0) {
                department = singleofficeDepartment[0].RecordID + ";#" + singleofficeDepartment[0].Name
            }
        }
    }

    let firstNameElement = document.getElementById('firstName');
    let firstName = ""
    if (firstNameElement) {
        firstName = firstNameElement.value.trim().replace(/\s+/g, ' ');
    }
    let lastNameElement = document.getElementById('lastName');
    let lastname = ""
    if (lastNameElement) {
        lastname = lastNameElement.value.trim().replace(/\s+/g, ' ');
    }
    
    let emailElement = document.getElementById('Email');
    let email = ""
    if (emailElement) {
        email = emailElement.value
    }


    employeeSaveObject = {
        FirstName: firstName,
        LastName: lastname,
        Email: email,
        Department: department,
        OfficeLocation: officelocation,
    }

    if (!employeeSaveObject.FirstName) {
        openAlert("First Name is required")
    }
    else if (!employeeSaveObject.LastName) {
        openAlert("Last Name is required")
    }
    else if (!employeeSaveObject.Email) {
        openAlert("Email is required")
    }
    else if (!validateEmail(employeeSaveObject.Email)) {
        openAlert("Please enter Valid email address")
    }
    else if (!employeeSaveObject.Department) {
        openAlert("Department is required")
    } else if (!employeeSaveObject.OfficeLocation) {
        openAlert("Office Location is required")
    }
    else {
        let secondSection = document.getElementById('second-section');
        if (secondSection) {
            secondSection.style.display = 'block';
        }
        let popUp = document.getElementById("userForm");
        if (popUp) {
            popUp.style.display = 'none';
        }
        getApplist()
    }

}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getApplist() {
    applist = []
    let objectName = "App_Configuration";
    let list = 'AppName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((apps) => {
        if (Array.isArray(apps) && apps.length > 0) {
            applist = apps;
            let appoption = ''
            applist.forEach(val => {
                appoption += ` <li><div class="es-form-group"> <input class="es-input" type="checkbox"  name="${val.AppName}" id='${val.RecordID}' value="" onclick="onAppchange('${val.RecordID}')"> <label 
                class="es-label">${val.AppName}</label> <br> </div></li>`
            })

            document.getElementById('applistid').innerHTML = appoption

        }
    });
    let isloadingElement = document.getElementById('isloadingpopup');
    if (isloadingElement) {
        isloadingElement.style.display = 'none'
    }
}

function onAppchange(apprecordID) {
    let appElement = document.getElementById(apprecordID);
    if (appElement) {
        let isChecked = appElement.checked;
        if (isChecked) {
            let app = applist.filter(ap => ap.RecordID === apprecordID);
            selectedApps.push(...app)
        } else {
            selectedApps = selectedApps.filter(ap => ap.RecordID != apprecordID)
        }
    }

}

function nextFormSecond() {
    console.log(selectedApps);

    let secondSection = document.getElementById('second-section');
    if (secondSection) {
        secondSection.style.display = 'none';
    }
    let thirdSection = document.getElementById("third-section");
    if (thirdSection) {
        thirdSection.style.display = 'block';
    }
}

function saveDetails() {
    let sendemailElement = document.getElementById('sendEmail');
    let blurdivElement = document.getElementById('blurdiv');
    if (blurdivElement) {
        blurdivElement.classList.add('page-blur')
    }
    let sendEmail = false
    if (sendemailElement) {
        sendEmail = sendEmail.checked
    }
    employeeSaveObject['SWMail'] = sendEmail
    save(employeeSaveObject, 'Employees', getDetails)
    getEmployee();
}

function getDetails(RecordID) {
    saveUser = RecordID + ";#" + employeeSaveObject.FirstName + " " + employeeSaveObject.LastName;
    saveAppUserMapping()
    let superadminElement = document.getElementById('superadmin');
    // if (superadminElement.checked) {
        saveUserPermission()
    // }
    CloseForm();
}


function saveAppUserMapping() {
    let mapping = []
    selectedApps.forEach(app => {

        let users = [];
        users.push({
            UserType: '1',
            RecordID: saveUser.split(";#")[0]
        })
        let appUserMapping = {
            AppStore: app.AppName,
            AppName: app.RecordID + ";#" + app.AppName,
            AllowUsers: JSON.stringify(users),
            TargetPlatform:'Web'
        }
        mapping.push(appUserMapping)
    })
    bulkadd(mapping, 'App_User_Mapping')
}


function saveUserPermission() {
    let mapping = []
    selectedApps.forEach(app => {
        let superadmin = document.getElementById('superadmin')
        let users = [];
        users.push({
            UserType: '1',
            RecordID: saveUser.split(";#")[0]
        })
        let appUserMapping = {
            AppName: app.RecordID + ";#" + app.AppName,
            ProfileorTeam: JSON.stringify(users),
            SuperAdmin: superadmin.checked
        }
        mapping.push(appUserMapping)
    })
    bulkadd(mapping, 'User_Permission')

}

// function sample(record) {
//     selectedApps = []
// }

function save(object, repositoryName, callback) {
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
        callback(response)
    }
    )

}

function bulkadd(objectArray, repositoryName) {
    let records = [];
    objectArray.forEach(object => {
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
        records.push(intermidiateRecord);
    })
    window.QafService.AddItems(records).then(response => {
    }
    )

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

function openAlert(message) {
    let qafAlertObject = {
        IsShow: true,
        Message: message,
        Type: 'ok'
    }
    const body = document.body;
    let alertElement = document.createElement('qaf-alert')
    body.appendChild(alertElement);
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}


function OpenResetForm() {
    let popUp = document.getElementById("resetPassword");
    if (popUp) {
        popUp.style.display = 'block';
        getEmployeeforPassword();
        addCssforscroll();
    }
}

function getEmployeeforPassword() {
    employeeListForResetPassword = []
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,IsOffboarded';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `IsOffboarded!='True'<OR>IsOffboarded=''`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((emplist) => {
        if (Array.isArray(emplist) && emplist.length > 0) {
            employeeListForResetPassword = emplist;
        }
        LoadEmployees()

    });
}

function LoadEmployees() {
    let employeeElement = document.getElementById('EmployeeName');
    let options = `<option value=''>Select Employee</option>`;
    if (employeeElement) {
        employeeListForResetPassword.sort((a, b) => (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0));
        employeeListForResetPassword.forEach(emp => {
            options += `<option value="${emp.RecordID}">${emp.FirstName} ${emp.LastName}</option>`;
        });
        employeeElement.innerHTML = options;
    }
}

function validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,10}$/;
    return regex.test(password);
}

function SaveRecord() {

    let employeeName = document.getElementById('EmployeeName').value;
    let password = document.getElementById('Password').value;
    if (employeeName == "") {
        let alertMessage = "Employee field is required";
        openAlert(alertMessage);
    } else if (password == "") {
        let alertMessage = "Password field is required";
        openAlert(alertMessage);
    } else {
        let isPassword = validatePassword(password);
        if (!isPassword) {
            let alertMessage = "Minimum 8 characters and Maximum 10, at least one Capital letter, one number, and one special character";
            openAlert(alertMessage);
        } else {
            
            let pageDisabledElement = document.getElementById('pageDisabled');
            if (pageDisabledElement) {
                pageDisabledElement.classList.add('page-disabled')
            }
            let isloadingElement = document.getElementById('loaderforform');
            if (isloadingElement) {
                isloadingElement.style.display = 'block'
            }
            let object = {
                EmployeeGUID: employeeName,
                NewPasswordKey: password,
            };
            savePassword(object);
            CloseResetForm();
        }
    }
}

function savePassword(Object) {
    let user = getCurrentUser();
    fetch(`${apURL}/api/Upranc?`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.EmployeeGUID,
            'Hrzemail': user.Email,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object)
    })
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => console.error(error));

}

function CloseResetForm() {
    clearResetPasswordFormField()
    
    let pageDisabledElement = document.getElementById('pageDisabled');
    if (pageDisabledElement) {
        pageDisabledElement.classList.remove('page-disabled')
    }
    let isloadingElement = document.getElementById('loaderforform');
    if (isloadingElement) {
        isloadingElement.style.display = 'none'
    }
    let popUp = document.getElementById("resetPassword");
    if (popUp) {
        popUp.style.display = 'none';
        removeCss()
       
    }
}

function clearResetPasswordFormField() {
    let salesemployeeElement = document.getElementById('EmployeeName');
    let productElement = document.getElementById('Password');
    salesemployeeElement.value = "";
    productElement.value = "";

}