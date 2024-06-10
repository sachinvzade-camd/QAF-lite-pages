
var Employee = [];
var LocationList = [];
var departmentList = [];
var designationList = []
var EmployeeResponseId;
var PermissionList = []
var teamList = []
var applist = [];
var applicationRoleList = []
var mappingIDs = []
var selectedPermission;
var currentAppName = ""
var EmployeeRecordId;
var employeeSaveObject = {}
var appRecordID = "";
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getPageUrl();
        getDepartment();
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getPageUrl() {
    localStorage.setItem('ma',window.location.host)
    currentAppName = JSON.parse(localStorage.getItem('APP_NAME'))
    getAppuserMapping();
}

function getAppuserMapping() {
    mappingIDs=[]
    ShowLoader()
    Employee = []
    let objectName = "App_User_Mapping";
    let list = "RecordID,AppStore,AllowUsers,TargetPlatform";
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `(AppStore='${currentAppName}')<<NG>>(TargetPlatform<contains>'Web')`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((usermappings) => {
        if (Array.isArray(usermappings) && usermappings.length > 0) {
            usermappings.forEach(val=>{
                let ids = userOrGroupFieldRecordIDList(val.AllowUsers);
                if(ids&&ids.length>0){
                    mappingIDs.push(...ids)
                }

            })
            getEmployee();
        }
    });

}

function getEmployee() {
    ShowLoader()
    Employee = []
    let employeeID = mappingIDs.join("'<OR>RecordID='");
    let objectName = "Employees";
    let list = 'RecordID,FirstName,LastName,Department,Email,OfficeLocation';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${employeeID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((emplist) => {
        if (Array.isArray(emplist) && emplist.length > 0) {
            Employee = emplist.reverse();
            generateReport(Employee);
        }
        else {
            generateReport(Employee);
        }

    });

}

function generateReport(Employee) {
    let TableData = "";
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
        
        document.getElementById("menuId").innerHTML = `<div class="action-buttons" id="actionsButtons"  style="top: ${event.pageY - 170}px;left: ${event.pageX - 120}px;">
        <button class="view-btn" onclick="ViewRecord('${EmployeeRecordId}')"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</button>
         <button class="edit-btn" onclick="EditRecord('${EmployeeRecordId}')"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</button>
         <button class="delete-btn" onclick="DeleteRecord('${EmployeeRecordId}')"><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</button>
    </div>`
    }
}

function ViewRecord(RecordID) {
    if (window.QafPageService) {
        let Repository = 'Employees';
        window.QafPageService.ViewItem(Repository, RecordID, function () {
            getEmployee();
        });
    }

}

function EditRecord(RecordID) {
    if (window.QafPageService) {
        let Repository = 'Employees';
        window.QafPageService.EditItem(Repository, RecordID, function () {
            getEmployee();
        });
    }
}

function DeleteRecord(RecordID) {
    if (window.QafPageService) {
        window.QafPageService.DeleteItem(RecordID, function () {
            getEmployee();
        });
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
    let popUp = document.getElementById("selectUserForm");
    if (popUp) {
        popUp.style.display = 'block';
        addCssforscroll()
    }
}
function addNewUser(){
    let topHeader = document.getElementById("topHeader");
    if (topHeader) {
        topHeader.classList.add('topHeader')
    }
    setDepartmentinDropdown();
    let popUp = document.getElementById("userForm");
    if (popUp) {
        popUp.style.display = 'block';
        addCssforscroll()

    }
}

function NextUser(){
    
    let value=document.querySelector('input[name="user"]:checked').value;
    if(value==='existing'){
        addExistingUser()
        hideUserForm()
        }else{
         hideUserForm()
        addNewUser()
    }
}
function addExistingUser() {

    let fields = ["AppName","AllowUsers","AppStore","TargetPlatform","All"];
    let fieldsValue= [];
    let fieldsDoNotdiaply = ["AppName","AppStore","TargetPlatform"];
    fields = fields.filter((objOne) => {
      return !fieldsDoNotdiaply.some((objTwo) => {
        return objOne === objTwo;
      });
    });
    fields.forEach(val => {
        const currentAppRecord = applist.find(app => app.AppName.toLowerCase().includes(currentAppName.toLowerCase()));
        if (val === 'AppName') {
            fieldsValue.push({ fieldName: val, fieldValue: currentAppRecord.RecordID+";#"+currentAppRecord.AppName})
          }
           else if (val === 'AppStore') {
            fieldsValue.push({ fieldName: val, fieldValue: currentAppName})
          }
          else if (val === 'TargetPlatform') {
            fieldsValue.push({ fieldName: val, fieldValue: "Web"})
          }
          else {
            fieldsValue.push({ fieldName: val, fieldValue: null })
          }
    })
    let employeeID=""
    if (mappingID && mappingID.length > 0) {
         employeeID = mappingIDs.join("'<OR>RecordID!='");
      }
    let fieldFilterConditions = [
        { fieldName: "AllowUsers", fieldList: "RecordID", filterCondition: `RecordID!='${employeeID}'` }
       
      ]
        if (window.QafPageService) {
            window.QafPageService.AddItem("App_User_Mapping", function () {
                getSingleCheckList('form') 
            },fields,fieldsValue, fieldFilterConditions, null, fieldsDoNotdiaply);
    }

}

function hideUserForm(){
    let popUp = document.getElementById("selectUserForm");
    if (popUp) {
        popUp.style.display = 'none';
    }
}

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
        }

    });
    getLocation()
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
        }
        ;
    });
    getDesignation()
}

function getDesignation() {
    designationList = []
    let objectName = "Designation";
    let list = 'DesignationName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((designation) => {
        if (Array.isArray(designation) && designation.length > 0) {
            designationList = designation;
        }
    });
    getApp_Configuration();

}

function getTeams() {
    teamList = []
    
    const currentAppRecord = applist.find(app => app.AppName.toLowerCase().includes(currentAppName.toLowerCase()));
    let app_RecordID = currentAppRecord ? currentAppRecord.RecordID : "";
    let objectName = "Teams";
    let list = 'TeamName,TeamMembers,AppName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `AppName='${app_RecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((teams) => {
        if (Array.isArray(teams) && teams.length > 0) {
            teamList = teams.reverse();
        }
    });
}

function getApp_Configuration() {
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
            getApplicationRole();
            getTeams();

        }

    });

}

function getApplicationRole() {
    applicationRoleList = [];
    let objectName = "Application_Role";
    let list = 'RecordID,RoleName,AppName';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    const currentAppRecord = applist.find(app => app.AppName.toLowerCase().includes(currentAppName.toLowerCase()));
    let app_RecordID = currentAppRecord ? currentAppRecord.RecordID : "";
    appRecordID = app_RecordID
    let whereClause = `AppName='${app_RecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((roles) => {
        if (Array.isArray(roles) && roles.length > 0) {

            applicationRoleList = roles;
            let html = '';
            applicationRoleList.forEach(val => {
                html += ` 
                    <div class="checkbox-form-group">
                        <input type="checkbox" class="es-input" id='${val.RecordID}' name="permissionGroup">
                        <label for="${val.RecordID}" class="es-label">${val.RoleName}</label>
                        <br>
                    </div>`;
            });

            document.getElementById('Permission-group').innerHTML = html;

            document.querySelectorAll('input[name="permissionGroup"]').forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    if (this.checked) {
                        document.querySelectorAll('input[name="permissionGroup"]').forEach(box => {
                            if (box !== this) {
                                box.checked = false;
                            }
                        });
                        updateCheckedId();
                    }
                });
            });
        }
    });
}


function updateCheckedId() {
    selectedPermission = ""
    const checkedBox = document.querySelector('input[name="permissionGroup"]:checked');
    if (checkedBox) {
        selectedPermission = checkedBox.id;
    } else {
        selectedPermission = ""
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
    SetDesignationdropdown()
}

function SetDesignationdropdown() {
    let DesignationNameElement = document.getElementById('Designation');
    let options = `<option value=''> Select Designation</option>`;
    if (DesignationNameElement) {
        designationList.forEach(desg => {
            options += `<option value="${desg.RecordID}">${desg.DesignationName}</option>`;
        });
        DesignationNameElement.innerHTML = options;
    }
    SetTeamsdropdown()
}

function SetTeamsdropdown() {
    let teamsElement = document.getElementById('teams');
    let options = `<option value=''> Select Team</option>`;
    if (teamsElement) {
        teamList.forEach(team => {
            options += `<option value="${team.RecordID}">${team.TeamName}</option>`;
        });
        teamsElement.innerHTML = options;
    }

}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function saveDetails() {
    let designationElement = document.getElementById('Designation');
    let designation = ""
    if (designationElement) {
        let designationvalue = designationElement.value;
        if (designationvalue) {
            let singledesignation = designationList.filter(dsgn => dsgn.RecordID === designationvalue);
            if (singledesignation && singledesignation.length > 0) {
                designation = singledesignation[0].RecordID + ";#" + singledesignation[0].DesignationName
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

    let teamMembersElement = document.getElementById('teams');
    let teamMembers = ""
    if (teamMembersElement) {
        teamMembers = teamMembersElement.value
    }
    employeeSaveObject = {
        FirstName: firstName,
        LastName: lastname,
        Email: email,
        Department: department,
        OfficeLocation: officelocation,
        EmployeeLevel: designation,
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
    else if (!employeeSaveObject.EmployeeLevel) {
        openAlert("Designation is required")
    }
    else if (!employeeSaveObject.Department) {
        openAlert("Department is required")
    } else if (!employeeSaveObject.OfficeLocation) {
        openAlert("Office Location is required")
    } else if (!teamMembers) {
        openAlert("Team is required")
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

        saveObjectsData();

    }
  
}

function saveObjectsData() {
    AddBlurInPage();
    save(employeeSaveObject, 'Employees').then(result => {
        EmployeeResponseId = result.response;
        console.log("EmployeeResponseId", EmployeeResponseId);
        saveUserPermisson(EmployeeResponseId)
        resetForm();
      
    });

}

function save(object, repositoryName) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {};
        user = getCurrentUser();
        Object.keys(object).forEach((key) => {
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
            resolve({ response });
        });
    });
}

function saveUserPermisson(RecordID) {

    let userRecordID = RecordID;
    let UserName = JSON.stringify([{ UserType: 1, RecordID: userRecordID }]);
    let roleName = "";
    let appName = "";
    let roleNameList = applicationRoleList.filter(val => val.RecordID === selectedPermission);
    if (roleNameList && roleNameList.length > 0) {
        roleName = roleNameList[0].RecordID + ";#" + roleNameList[0].RoleName;
    }
    let appNameList = applist.filter(val => val.RecordID === appRecordID);
    if (appNameList && appNameList.length > 0) {

        appName = appNameList[0].RecordID + ";#" + appNameList[0].AppName;
    }

    UserpermissonObject = {
        ProfileorTeam: UserName,
        Role: roleName,
        AppName: appName,
    }
    let appUserMapping = {
        AppStore: appNameList[0].AppName,
        AppName: appName,
        AllowUsers: (UserName),
        TargetPlatform:'Web'
    }

    save(appUserMapping, 'App_User_Mapping')
    save(UserpermissonObject, 'User_Permission')
    setTimeout(() => {
        
        saveTeams(userRecordID)
    },2000)
}

function saveTeams(userRecordID) {

    let updatedTeamMembers = "";
    let saveUser = userRecordID + ";#" + employeeSaveObject.FirstName + " " + employeeSaveObject.LastName;
    let selectedTeamID = document.getElementById('teams').value;
    let teamMembers = "";
    let teamsList = teamList.filter(val => val.RecordID === selectedTeamID);
    if (teamsList && teamsList.length > 0) {
        teamMembers = teamsList[0].TeamMembers;
    }
    if (teamMembers) {
        updatedTeamMembers = teamMembers + ";#" + saveUser
        // updatedTeamMembers = saveUser
    }
    else {
        updatedTeamMembers = saveUser
    }
    if (selectedTeamID) {
        let TeamsObject = {
            TeamMembers: updatedTeamMembers,
        }
        update(TeamsObject, 'Teams', selectedTeamID)
    }
    getAppuserMapping();
}


function update(object, repositoryName, updateRecordID) {
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
        intermidiateRecord.RecordID = updateRecordID;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem(intermidiateRecord).then(response => {
            let teamsElement = document.getElementById('teams');
    if (teamsElement) {
        teamsElement.value = "";
    }
            updateRecordID = "";
            resolve({
                response
            })
        });
    }
    )
}

function CloseForm() {
    resetForm()
    let popUp = document.getElementById("userForm");
    if (popUp) {
        popUp.style.display = 'none';
        removeCss()
    }
    let topHeader = document.getElementById("topHeader");
    if (topHeader) {
        topHeader.classList.remove('topHeader')
    }
}


function resetForm() {
    RemoveBlurInPage();
    let firstNameElement = document.getElementById('firstName');
    if (firstNameElement) {
        firstNameElement.value = ""
    }
    let lastNameElement = document.getElementById('lastName');
    if (lastNameElement) {
        lastNameElement.value = ""
    }
    let emailElement = document.getElementById('Email');
    if (emailElement) {
        emailElement.value = ""
    }
    let designationElement = document.getElementById('Designation');
    if (designationElement) {
        designationElement.value = ""
    }
    let departmentElement = document.getElementById('Department');
    if (departmentElement) {
        departmentElement.value = "";
    }
    let officeLocationElement = document.getElementById('officeLocation');
    if (officeLocationElement) {
        officeLocationElement.value = "";
    }
    

    document.querySelectorAll('input[name="permissionGroup"]').forEach(checkbox => {
        checkbox.checked = false;
    });

}

function AddBlurInPage() {
    let blurdivElement = document.getElementById('blurdiv');
    if (blurdivElement) {
        blurdivElement.classList.add('page-blur')
    }
}

function RemoveBlurInPage() {
    let blurdivElement = document.getElementById('blurdiv');
    if (blurdivElement) {
        blurdivElement.classList.remove('page-blur')
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
function userOrGroupFieldRecordIDList(id) {
    if (id) {
      if (id && id.includes("[{")) {
        let jsonArray = (JSON.parse(id));
        if (jsonArray.length > 0) {
          return jsonArray.map(a => a.RecordID)
        }
      }
      else {
        return id && id.includes(";#") ? id.split(";#")[0] : id;
      }
    }
}