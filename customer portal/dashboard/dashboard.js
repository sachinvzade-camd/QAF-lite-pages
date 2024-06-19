
var apURL = localStorage.getItem('env');
var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;
var reportTypeMasterList = [
    { displayname: "Pending Tickets", internalName: 'pendingticket' },
    { displayname: "My Tickets", internalName: 'myticket' },
    { displayname: "Completed Tickets", internalName: 'completedticket' }
];
var selectReport = 'pendingticket'
var reportType = "PS";
var user;
var workflowCategoriesList = []
var getServiceRequestList = []
var itemsList = []
var servicePermissionAppList = []
var teamList = []
var categorymasterList = []
var serviceAppList = []
var teamServiceAppList = [];
var selectedCategory = [];
var allServiceappList = [];
var serviceList=[]
var qafUserCondition
var customerName;
var casePattern = new RegExp("^([A-Z])([a-z]+)");
var helpdeskStatusKey;
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        user = getCurrentUser()
        getServices()
        helpdeskStatusKey = getQCValue('HELPDESK_OPEN_STATUS_KEY')
        setValueInHelpdeskDropdown()
        getTeamList()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getQCValue(key) {
    let responses = JSON.parse(window.localStorage.getItem('QAF_CONFIG'));
    if (responses && responses.length > 0) {
        let keyValues = responses.filter(res => res.Key === key)
        if (keyValues && keyValues.length > 0) {
            return (keyValues[0].Value)
        }
        return ""
    }
    return ""
}
function setValueInHelpdeskDropdown() {
    let statusDropdown = document.getElementById('helpdeskstatus');
    let options = ``
    if (statusDropdown) {
        reportTypeMasterList.forEach(report => {
            options += `<option value=${report.internalName}>${report.displayname}</option>`
        })
        statusDropdown.innerHTML = options;
    }
}

function statusChangeevent() {
    let statusDropdown = document.getElementById('helpdeskstatus');
    if (statusDropdown) {
        selectReport = statusDropdown.value
    }
    if (selectReport === 'pendingticket') {
        reportType = "PS"
    }
    if (selectReport === 'myticket') {
        reportType = "MS"
    }
    if (selectReport === 'completedticket') {
        reportType = "CA"
    }
    getServices()
}

function getServices() {
    serviceList = []
    fetch(`${apURL}/api/MyServices?option=${reportType}&app=helpdesk&templateType=helpdesk`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.EmployeeGUID,
            'Hrzemail': user.Email
        },
    })
        .then(response => response.json())
        .then(services => {
            if (Array.isArray(services) && services.length > 0) {
                let servicesText = "";
                serviceList = services;
                services.forEach(val => {
                    servicesText += ` 
                    <div class="ticket-card" onclick='requestclick("${val.RecordID}")'>
                        <div class="ticket-detail">
                            <p>${val.RequestTitle}</p>
                            <p>${topheader(val)} | ${getRequestStatus(val)}</p>
                        </div>
                        <div class="ticket-button">
                            <button>view</button> 
                        </div>
                     </div>`
                })

                document.getElementById('ticketlist').innerHTML = servicesText
            } else {
                document.getElementById('ticketlist').innerHTML = '<div class="noRecordFound">No Record Found</div>'
            }
        })
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

function topheader(services) {
    let request = [];
    if (services.TicketID) {
        request.push((services.TicketID))
    }
    if (services.Priority) {
        request.push(formatLookupFieldValue(services.Priority))
    }
    return request.join(" | ")
}

function formatLookupFieldValue(value) {
    let returnValue = value ? value : "";//fix change by mayur
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

function convertTimeFormat(dates) {
    if (dates) {
        const dateformat = "hh:mm A";
        const localTime = moment.utc(dates).toDate();
        return moment(localTime).format(dateformat);
    } else {
        return ""
    }
}

function getRequestStatus(services) {
    let request = [];
    if (services.RequestStatus) {
        request.push(formatLookupFieldValue(services.RequestStatus))
    }
    if (services.RequestType) {
        request.push((services.RequestType))
    }
    return request.join(" | ")
}


function getTeamList() {
    let objectName = "Teams";
    let fieldList = "TeamName,TeamMembers,RecordID".split(",");
    let orderBy = "";
    let whereClause = "TeamMembers='" + user.EmployeeGUID + "'";
    let pageSize = "100000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((teams) => {
        if (Array.isArray(teams) && teams.length > 0) {
            teamList = teams;
            getWorkFlowCategories();
        }else{
          getWorkFlowCategories();
        }
    })
}


function getWorkFlowCategories() {
    workflowCategoriesList = [];
    let objectName = "Workflow_Category";
    let fieldList = "RecordID,CategoryName,Sequence".split(",");
    let orderBy = "";
    let whereClause = "";
    let pageSize = "1000000";
    let pageNumber = "1";
    // let whereClause="";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((workflow) => {
        if (Array.isArray(workflow) && workflow.length > 0) {
            workflowCategoriesList = workflow;
            getDetailsListrequest();

        }
    })


}

function getDetailsListrequest() {
    let type = ""
    if (window.location.href.includes("e-helpdesk")) {
        type = "ehelpdesk"
    }
    else {
        type = "helpdesk"
    }


    fetch(`${apURL}/api/WorkflowConfigList?templateType=${type}`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.EmployeeGUID,
            'Hrzemail': user.Email
        },
    })
        .then(response => response.json())
        .then(responses => {


            if (Array.isArray(responses) && responses.length > 0) {
                responses && responses.forEach((value) => {
                    value.WFName = value && value.WFName && value.WFName.length > 23 ? value.WFName.substring(0, 22) + "" + "..." : value.WFName;
                })
                getServiceRequestList = responses.reverse();
                getServiceRequestList = getServiceRequestList.filter(field => !(field.IsDisabled));
                itemsList = getServiceRequestList;
                getUserPermission();
            } else {
                itemsList = [];
            }


        })


}

function getUserPermission() {
    let lp = window.localStorage.NewLP;
    let isFullcontrolAdmin = false;
    if (lp) {
        let lpArray = lp.split(",");
        if (lpArray.indexOf("11") !== -1 || lpArray.indexOf("25-3") !== -1 || lpArray.indexOf("46-3") !== -1) {
            isFullcontrolAdmin = true;
        }
    }
    servicePermissionAppList = [];
    getServiceRequestList.forEach((request, i) => {
        if (request.AppPermissions) {
            if (JSON.parse(request.AppPermissions).length > 0) {
                JSON.parse(request.AppPermissions).forEach(val => {
                    if (isFullcontrolAdmin) {
                        let wfApp = servicePermissionAppList.filter(app => app.WFID === request.WFID);
                        if (!(wfApp && wfApp.length > 0)) {
                            servicePermissionAppList.push(request);
                        }
                    } else {
                        if (val.UserType === 0) {
                            if (val.UserID === 'ALL') {
                                servicePermissionAppList.push(request);
                            }
                        }
                        if (val.UserType === 1) {
                            if (user.EmployeeGUID === val.UserID) {
                                let wfApp = servicePermissionAppList.filter(app => app.WFID === request.WFID);
                                if (!(wfApp && wfApp.length > 0)) {
                                    servicePermissionAppList.push(request);
                                }
                            }
                        }
                        if (val.UserType === 2) {
                            teamList && teamList.forEach(team => {
                                if (team.RecordID === val.UserID) {
                                    let wfApp = servicePermissionAppList.filter(app => app.WFID === request.WFID);
                                    if (!(wfApp && wfApp.length > 0)) {
                                        servicePermissionAppList.push(request);
                                    }
                                }
                            })
                        }
                    }
                })
            }
        } else {
            if (!request.AppPermissions && !request.AppCategory) {
                servicePermissionAppList.push(request);
            }
        }
    })
    if (servicePermissionAppList.length > 0) {
        getWorkflowCategoriesList();
    }
    else {
        serviceAppList = [];
        servicePermissionAppList = [];
    }
}

function getWorkflowCategoriesList() {
    loadingMessageReport = "";
    let commonCategories = [];
    let getList = [];
    let sequence = 0;
    commonCategories = servicePermissionAppList.filter((v, i, a) => a.findIndex(t => t.AppCategory === v.AppCategory) === i);
    commonCategories && commonCategories.forEach(val => {
        workflowCategoriesList.forEach(seq => {
            if (val.AppCategory === seq.RecordID) {
                getList.push({ recordId: seq.RecordID, catgoriesName: seq.CategoryName, sequence: seq.Sequence })
            }
        })
        if (!val.AppCategory) {
            getList.push({ recordId: null, catgoriesName: "", sequence: 1000 })
        }
    })
    categorymasterList = getList;
    if (getList.length > 0) {
        categorymasterList && categorymasterList.sort((a, b) => a.sequence - b.sequence);
        getServiceAppList(getList);
    }
    else {
        getList = [];
    }
}

function getServiceAppList(getList) {
    serviceAppList = [];
    getList && getList.forEach((val, i) => {
        serviceAppList.push({ CategoryName: val.catgoriesName, Sequence: val.sequence, data: [] })
        servicePermissionAppList && servicePermissionAppList.forEach(list => {
            if (val.recordId === list.AppCategory) {
                if (serviceAppList[i].Sequence === val.sequence) {
                    if (list.AppAdmins) {
                        if (JSON.parse(list.AppAdmins).length > 0) {
                            JSON.parse(list.AppAdmins).forEach(appPermission => {
                                if (appPermission.UserType === 0) {
                                    if (appPermission.UserID === 'ALL') {
                                        list.permission = true
                                    }
                                }
                                if (appPermission.UserType === 1) {
                                    if (user.EmployeeGUID === appPermission.UserID) {
                                        list.permission = true
                                    }
                                }
                                if (appPermission.UserType === 2) {
                                    let team = teamList.filter(team => team.RecordID === appPermission.UserID)
                                    if (Array.isArray(team) && team.length > 0) {
                                        if (team[0].TeamMembers.includes(user.EmployeeGUID)) {
                                            list.permission = true
                                        }
                                    }
                                }
                            })
                        }
                    }
                    else {
                        list.permission = false;
                    }
                    serviceAppList[i].data.push(list);
                }
                else {
                    serviceAppList.push({ CategoryName: val.catgoriesName, Sequence: val.sequence })
                    if (list.AppAdmins) {
                        if (JSON.parse(list.AppAdmins).length > 0) {
                            JSON.parse(list.AppAdmins).forEach(appPermission => {
                                if (appPermission.UserType === 0) {
                                    if (appPermission.UserID === 'ALL') {
                                        list.permission = true
                                    }
                                }
                                if (appPermission.UserType === 1) {
                                    if (user.EmployeeGUID === appPermission.UserID) {
                                        list.permission = true
                                    }
                                }
                                if (appPermission.UserType === 2) {
                                    let team = teamList.filter(team => team.RecordID === appPermission.UserID)
                                    if (Array.isArray(team) && team.length > 0) {
                                        if (team[0].TeamMembers.includes(user.EmployeeGUID)) {
                                            list.permission = true
                                        }
                                    }
                                }
                            })
                        }
                    }
                    else {
                        list.permission = false;
                    }
                    serviceAppList[i].data.push(list);
                }
            }
        })
    })
    if (serviceAppList.length > 0) {
        serviceAppList && serviceAppList.sort((a, b) => a.Sequence - b.Sequence);
        teamServiceAppList = [...serviceAppList];
        if (selectedCategory && selectedCategory.catgoriesName) {
            serviceAppList = teamServiceAppList.filter(a => a.CategoryName === selectedCategory.catgoriesName)

        }
        debugger
        setTicketInHtml()
    }
    else {
        serviceAppList = [];
        loadingMessageReport = serviceAppList && serviceAppList.length > 0 ? "" : "HRS_CMP_ALL_NO_RECORD_FOUND";
    }

    function setTicketInHtml() {
        let service = ``
        serviceAppList.forEach(val => {
            if (val && val.data && val.data.length > 0) {
                val.data.forEach(dt => {
                    allServiceappList.push(dt)

                    service += ` 
                            <div class="col-md-4 job-card">
                            <div class="card"  onclick='openEdit("${dt.ObjectID}")'>
                                <div class="service-photo">
                                    <a class="avtar">
                                        <img src="https://qaffirst.quickappflow.com/SmartHR/assets/img/default_service.png">
                                    </a>

                                </div>
                                <div class="services-detail">
                                    <div class="serviceTitle"></div>
                                    <div class="service-text">${dt.AppTitle}</div>
                                </div>
                            </div>
                        </div>`
                })
            }
        })
        debugger
        let serviceticketElement = document.getElementById('serviceticket');
        if (serviceticketElement) {
            serviceticketElement.innerHTML = service
        }
    }




}
async function onRequest(item) {
    if (item.CustomerList && window.location.pathname != "/c-helpdesk/helpdesk-my-tickets") {
        if (item.CustomerList) {
            let contact = await getContactOfCustomerListOfQAF(item.CustomerList)
            if (Array.isArray(contact) && contact.length > 0) {
                let contactDetails = contact;
                qafUserCondition = contactDetails.map(a => a.Email).join("'<OR>Email='");
                getCustomerDetail(item)
            }
            else {
                qafUserCondition = "";
                getCustomerDetail(item)
            }
        }
        else {
            getObjectID(item)
        }
    }
    else {
        getObjectID(item)
    }
}
async function getCustomerDetail(item) {
    let customer = await getCustomerDetailsFromList(item.CustomerList)
    if (Array.isArray(customer) && customer.length > 0) {
        customerName = customer[0].RecordID + ";#" + customer[0].Name;
        getObjectID(item)
    }

}



function getCustomerDetailsFromList(id) {
    let customerID = id.split(";").join("'<OR>RecordID='");
    let objectName = "Customers";
    let fieldList = "RecordID,Name";
    let orderBy = "";
    let whereClause = `RecordID='${customerID}'`;
    let pageSize = "1000000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((Customers) => {
        if (Array.isArray(Customers) && Customers.length > 0) {
            resolve(Customers)

        }
    })
}

function getContactOfCustomerListOfQAF(id) {
    return new Promise((resolve) => {
        let customerID = id.split(";").join("'<OR>CustomerName='");
        let objectName = "CH_User";
        let fieldList = "RecordID,Email,CustomerName,ParentReferenceID,FirstName,Offboarded";
        let orderBy = "";
        let whereClause = `(CustomerName='${customerID}')<<NG>>(Offboarded!='True'<OR>Offboarded='')`;
        let pageSize = "1000000";
        let pageNumber = "1";
        window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((users) => {
            if (Array.isArray(users) && users.length > 0) {
                resolve(users)

            }
        })
    })
}



function pascalCaseToCamelCase(propname) {
    if (this.casePattern.test(propname)) {
        return propname.charAt(0).toLowerCase() + propname.slice(1);
    }
    else {
        return propname;
    }
}

function convertPropertyNamesToCase(obj) {
    var r, value, t = Object.prototype.toString.apply(obj);
    if (t == "[object Object]") {
        r = {};
        for (var propname in obj) {
            value = obj[propname];
            r[pascalCaseToCamelCase(propname)] = convertPropertyNamesToCase(value);
        }
        return r;
    }
    else if (t == "[object Array]") {
        r = [];
        for (var i = 0, L = obj.length; i < L; ++i) {
            value = obj[i];
            r[i] = convertPropertyNamesToCase(value);
        }
        return r;
    }
    return obj;
}
async function getObjectID(item) {
    let response = await window.QafService.GetObjectById(item.ObjectID)
    let responses = response[0]
    let fields = [];
    let fieldsString = responses.firstList ? JSON.parse(responses.firstList) : "";
    let firstListFields = convertPropertyNamesToCase(fieldsString);
    if (firstListFields && firstListFields.length > 0) {
        firstListFields && firstListFields.forEach(val => {
            fields.push(val.InternalName)
        })
        responses.Fields.forEach((ele) => {
            if (ele.internalName === "Status") {
                fields.push(ele.InternalName)
            }
        })
    }
    else {
        responses.Fields.forEach((ele) => {
            fields.push(ele.InternalName)
        })
    }
    let fieldFilterConditions = [];
    let currentLocationPath = window.location.pathname;
    let fieldsValue = [];
    fields.forEach(val => {

        if (val === "Status") {
            fieldsValue.push({ fieldName: "Status", fieldValue: helpdeskStatusKey })
        }
        else if (val === "Customer" && currentLocationPath === "/c-helpdesk/helpdesk-my-tickets") {
            fieldsValue.push({ fieldName: "Customer", fieldValue: customerName })
        }
        // else if (val === "Customer" && currentLocationPath != "/c-helpdesk/helpdesk-my-tickets" && item.CustomerList) {
        //   fieldsValue.push({ fieldName: "Customer", fieldValue: customerName })
        // }
        else if (val === "RequestFor") {
            if (user.UserType === "Employee") {
                if (responses.manageFor === "Customer") {
                    fieldsValue.push({ fieldName: "RequestFor", fieldValue: '' })
                }
                else if (responses.manageFor === "Employee") {
                    fieldsValue.push({ fieldName: "RequestFor", fieldValue: user && user.EmployeeGUID ? user.EmployeeGUID + ";#" + user.FirstName + " " + user.LastName : '' })
                }
                else {
                    fieldsValue.push({ fieldName: "RequestFor", fieldValue: user && user.EmployeeGUID ? user.EmployeeGUID + ";#" + user.FirstName + " " + user.LastName : '' })
                }

            }
            else {
                fieldsValue.push({ fieldName: "RequestFor", fieldValue: user && user.EmployeeGUID ? user.EmployeeGUID + ";#" + user.FirstName + " " + user.LastName : '' })
            }
        }
        else {
            fieldsValue.push({ fieldName: val, fieldValue: "" })
        }
    })
    let fieldsDoNotdiaply = ["Status", "TicketID"];//check
    if (currentLocationPath === "/c-helpdesk/helpdesk-my-tickets") {
        // fieldsDoNotdiaply.push("Customer")
    }
    else if (currentLocationPath != "/c-helpdesk/helpdesk-my-tickets" && item.CustomerList) {
        // fieldsDoNotdiaply.push("Customer")
    }
    fields = fields.filter((objOne) => {
        return !fieldsDoNotdiaply.some((objTwo) => {
            return objOne === objTwo;
        });
    });
    if (user.UserType === "Employee") {
        if (responses.manageFor === "Customer") {
            if (item.CustomerList) {
                let customerID = item.CustomerList.split(";").join("'<OR>RecordID='");
                fieldFilterConditions = [{ fieldName: "RequestFor", fieldList: "Email", filterCondition: `Email='${qafUserCondition}'` }
                    , { fieldName: "Customer", fieldList: "RecordID", filterCondition: `RecordID='${customerID}'` }
                ]
            }
            else {
                fieldFilterConditions = [{
                    fieldName: "RequestFor", fieldList: "UserType", filterCondition: `UserType='Customer_User'`
                }]
            }

        }
        else if (responses.manageFor === "Employee") {
            fieldFilterConditions = [{
                fieldName: "RequestFor", fieldList: "UserType", filterCondition: `UserType='Employee'`
            }]
            fieldsDoNotdiaply.push("Customer")
        }
    }
    else {
        if (responses.manageFor === "Customer") {
            if (item.CustomerList) {
                fieldFilterConditions = [{ fieldName: "RequestFor", fieldList: "Email", filterCondition: `Email='${qafUserCondition}'` }]
            }
            else {
                fieldFilterConditions = [{
                    fieldName: "RequestFor", fieldList: "Email", filterCondition: `Email='${user.Email}'`
                }]
            }

        }
        else if (responses.manageFor === "Employee") {
            fieldFilterConditions = [{
                fieldName: "RequestFor", fieldList: "UserType", filterCondition: `UserType='No'`
            }]
        }
    }
    if (item.CustomerList && currentLocationPath != "/c-helpdesk/helpdesk-my-tickets") {
        fieldFilterConditions.push({ fieldName: "Customer", fieldList: "RecordID", filterCondition: `RecordID='${item.CustomerList}'` })
    }
    if (currentLocationPath === "/c-helpdesk/helpdesk-my-tickets") {
        fieldFilterConditions.push({ fieldName: "Customer", fieldList: "RecordID", filterCondition: `RecordID='${customerName.split(";#")[0]}'` })
    }

    window.QafPageService.AddItem(item.ObjectName, function () {
    }, null, fieldsValue, fieldFilterConditions, null, fieldsDoNotdiaply);

}

function openEdit(object) {
    let item = allServiceappList.filter(a => a.ObjectID === object)[0];
    onRequest(item)
}


document.getElementById('search').addEventListener('keyup', function (event) {
    let searchCancel = document.getElementById('cancelSearch-report');
    if (searchCancel) {
        searchCancel.style.display = 'block';
    }
    if (event.key === "Enter") {
        const searchTerm = event.target.value.trim();
        if (searchTerm) {
            const url = `https://qaffirst.quickappflow.com/c-helpdesk/helpdesk-Services?search=${encodeURIComponent(searchTerm)}`;
            window.location.href = url;
        }
    }
});



function cancelSearch() {
    let searchCancle = document.getElementById('cancelSearch-report')
    if (searchCancle) {
        searchCancle.style.display = 'none'
    }
    var searchInput = document.getElementById("search");
    searchInput.value = '';
}