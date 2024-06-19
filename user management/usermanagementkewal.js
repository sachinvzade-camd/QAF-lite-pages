
var Employee = [];
var applicationRoleList = [];
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
var localStorageApp = ""
var localStorageAppList 

qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        localStorageApp = getQCValue('QAF_CONFIG')
        let qafdashboardList = getQCValuenew('QAF_DASHBOARD_DESKTOP')
        localStorageAppList=qafdashboardList.filter(dash=>dash.SectionID==='6')[0].ChildSection

        getEmployee()
        getApplicationRole()
        clearInterval(qafServiceLoaded);
    }
}, 10);
function getQCValuenew(key) {
    let responses = JSON.parse(window.localStorage.getItem('QAF_CONFIG'));
    if (responses && responses.length > 0) {
      let keyValues = responses.filter(res => res.Key === key)
      if (keyValues && keyValues.length > 0) {
        return JSON.parse(keyValues[0].Value)
      }
      return ""
    }
    return ""
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
function getApplicationRole() {
    applicationRoleList = []
    let objectName = "Application_Role";
    let list = 'RecordID,RoleName,AppName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((roles) => {
        if (Array.isArray(roles) && roles.length > 0) {
            applicationRoleList = roles
        }

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
        getApplist()
        addCssforscroll()

    }
}

function CloseForm() {
    let popUp = document.getElementById("userForm");
    if (popUp) {
        popUp.style.display = 'none';
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
            let appNotDisplay = ['Repository', 'Settings', 'User Management', 'Workflow', 'Home', 'CEO Dashboard', 'Customer Portal', 'Eportal', 'Pages Library', 'QAF Users']
            applist = applist.filter((objOne) => {
                return !appNotDisplay.some((objTwo) => {
                    return objOne.AppName === objTwo;
                });
            });

            console.log(localStorageAppList);
            let sectionWiseList=[]
            let commonMainMenu=localStorageAppList.filter((v, i, a) => a.findIndex(t => t.MainMenu === v.MainMenu) === i);

            commonMainMenu.forEach(main=>{
                let object={}
                object['MainMenuName']=main.MainMenu?main.MainMenu:'Other'
                let subMenuApp=[]
                let menuApplist=localStorageAppList.filter(app=>(app['MainMenu']?app['MainMenu']:'Other')===(main.MainMenu?main.MainMenu:'Other'));
                if(menuApplist&&menuApplist.length>0){

                    menuApplist.forEach(mapp=>{
                        applist.forEach(app=>{
                            if(app.AppName===mapp.SectionName){
                                subMenuApp.push({
                                    DisplayName:mapp.DisplayName,
                                    SectionName:mapp.SectionName
                                })
                            }


                        })

                    })

                }
                object['SubmenuAppList']=subMenuApp
                sectionWiseList.push(object)
            })
            
console.log(sectionWiseList);

            let appoption = ''
            console.log("applist",applist)
            console.log("localStorageApp",localStorageApp) 


            applist.forEach((val, index) => {
                let approle = applicationRoleList.filter(role => (role.AppName ? role.AppName.split(";#")[0] : '') === val.RecordID)
                const className = index % 2 === 1 ? "right-align-li" : "";
                appoption += ` 
                <h5><5> 
                <li class='permission-list ${className}'>
                    <div class="es-form-group">  
                        <label class="es-label">${val.AppName ? getDisplayname(val.AppName) : ""}</label> 
                        <br> 
                    </div>
                    <div class='permission-dropdown'>
                         <select class="fs-input fs-select arrow" id="permission-${val.RecordID}" name="permission">${addRole(approle)}</select>
                    </div>
                </li>`
            })

            document.getElementById('applistid').innerHTML = appoption

        }
    });
    let isloadingElement = document.getElementById('isloadingpopup');
    if (isloadingElement) {
        isloadingElement.style.display = 'none'
    }
}

function getDisplayname(AppName) {
    let sectionName = AppName;
    const foundItem = localStorageApp.find(item => item.SectionName === sectionName);
    if (foundItem) {
        return foundItem.DisplayName ? foundItem.DisplayName : sectionName
    }
    else {
        return sectionName;
    }


}


// function getQCValue(key) {
//     let responses = JSON.parse(window.localStorage.getItem(key));
//     if (responses && responses.length > 0) {
//         const dashboard = responses.find(item => item.Key === "QAF_DASHBOARD_DESKTOP");
//         if (dashboard) {
//             const sections = JSON.parse(dashboard.Value);
//             const sectionArray = [];

//             sections.forEach(section => {
//                 sectionArray.push({
//                     SectionName: section.SectionName,
//                     DisplayName: section.DisplayName || null
//                 });

//                 if (section.ChildSection) {
//                     section.ChildSection.forEach(child => {
//                         sectionArray.push({
//                             SectionName: child.SectionName,
//                             DisplayName: child.DisplayName || null
//                         });
//                     });
//                 }
//             });
//             return sectionArray;
//         } else {
//             return ""
//         }
//     }

// }

function getQCValue(key) {
    let responses = JSON.parse(window.localStorage.getItem(key));
    if (responses && responses.length > 0) {
        const dashboard = responses.find(item => item.Key === "QAF_DASHBOARD_DESKTOP");
        if (dashboard) {
            const ParsedData = JSON.parse(dashboard.Value);
            let newObject = {
                "Others": []
              };
              
              ParsedData.forEach(section => {
                if (section.MainMenu) {
                  newObject[section.MainMenu] = newObject[section.MainMenu] || [];
                  newObject[section.MainMenu].push({
                    "SectionName": section.SectionName,
                    "DisplayName": section.DisplayName || section.SectionName
                  });
                } else if (section.ChildSection) {
                  section.ChildSection.forEach(child => {
                    if (child.MainMenu) {
                      newObject[child.MainMenu] = newObject[child.MainMenu] || [];
                      newObject[child.MainMenu].push({
                        "SectionName": child.SectionName,
                        "DisplayName": child.DisplayName || child.SectionName
                      });
                    } else {
                      newObject.Others.push({
                        "SectionName": child.SectionName,
                        "DisplayName": child.DisplayName || child.SectionName
                      });
                    }
                  });
                } else {
                  newObject.Others.push({
                    "SectionName": section.SectionName,
                    "DisplayName": section.DisplayName || section.SectionName
                  });
                }
              });   
              console.log(newObject);
              return newObject
        } else {
            return "";
        }
    }
}


function addRole(approle) {
    let role = `<option value=''>Select Permision</option>`
    if (approle && approle.length > 0) {
        approle.forEach(val => {
            role += `<option value='${val.RecordID}'>${val.RoleName}</option>`
        })
    }
    return role
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
    else {
        save(employeeSaveObject, 'Employees', getDetails)
        getEmployee();
    }

}

function getDetails(RecordID) {
    saveUser = RecordID + ";#" + employeeSaveObject.FirstName + " " + employeeSaveObject.LastName;
    saveAppUserMapping()
    let superadminElement = document.getElementById('superadmin');
    // if (superadminElement.checked) {

    // }
    CloseForm();
}


function saveAppUserMapping() {
    let selectedApps = []
    applist.forEach(val => {
        let permissionElmenet = document.getElementById(`permission-${val.RecordID}`)
        if (permissionElmenet) {
            if (permissionElmenet.value) {
                selectedApps.push(val)
            }
        }
    })


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
            TargetPlatform: 'Web'
        }
        mapping.push(appUserMapping)
    })
    bulkadd(mapping, 'App_User_Mapping')
    saveUserPermission()
}


function saveUserPermission() {
    let mapping = []
    let selectedApps = []
    applist.forEach(val => {
        let permissionElmenet = document.getElementById(`permission-${val.RecordID}`)
        if (permissionElmenet) {
            if (permissionElmenet.value) {
                selectedApps.push(val)
            }
        }
    })
    selectedApps.forEach(app => {
        let roleName = applicationRoleList.filter(role => (role.AppName ? role.AppName.split(";#")[0] : '') === app.RecordID);

        if (roleName && roleName.length > 0) {
            let superadmin = document.getElementById('superadmin')
            let users = [];
            users.push({
                UserType: '1',
                RecordID: saveUser.split(";#")[0]
            })
            let appUserMapping = {
                AppName: app.RecordID + ";#" + app.AppName,
                ProfileorTeam: JSON.stringify(users),
                SuperAdmin: superadmin.checked,
                Role: roleName[0].RecordID + ";#" + roleName[0].RoleName
            }
            mapping.push(appUserMapping)
        }
    })
    if (mapping && mapping.length > 0) {
        bulkadd(mapping, 'User_Permission')
    }

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
    let blurdivElement = document.getElementById('blurdiv');
    if (blurdivElement) {
        blurdivElement.classList.remove('page-blur')
    }
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


