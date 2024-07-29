var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var recordID = urlParams.get("id");
var listName = urlParams.get("name");
var fromList = listName;
var industriesList = [];
var countryList = [];
var updateRecordID = recordID;
var LeadSourceID = ""
var crmListNewObject = [];
var EventNameID = ""
var qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getAppName()
        rendorTitle();
        getIndustries();
        getListData();
        clearInterval(qafServiceLoaded);
    }
}, 10);


function getListData() {
    crmListNewObject = []
    let objectName = "CRM_List";
    let list = 'RecordID,FilterCriteria,Entity';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = `RecordID='${updateRecordID}'`;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((crmlist) => {
        if (Array.isArray(crmlist) && crmlist.length > 0) {
            crmListNewObject = crmlist[0];

        }
    });
}

function rendorTitle() {
    let listTitleFromElement = document.getElementById("titlename")
    if (listTitleFromElement) {
        listTitleFromElement.innerHTML = fromList
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

function getIndustries() {
    industriesList = []
    let objectName = "Industries";
    let list = 'IndustryID,Industry,RecordID';
    let fieldList = list.split(",");
    let orderBy = "true";
    let whereClause = "";
    let pageSize = "100000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((indlist) => {
        if (Array.isArray(indlist) && indlist.length > 0) {
            industriesList = indlist;
            industriesList= industriesList.sort((a, b) => a.Industry.localeCompare(b.Industry));

        }
        loadIndustries();
    });
}


function loadIndustries() {
    let selectIndustryElement = document.getElementById('selectIndustry');
    let options = `<option value=''> Select Industry</option>`;
    if (selectIndustryElement) {
        industriesList.forEach(valInd => {
            options += `<option value="${valInd.RecordID}">${valInd.Industry}</option>`;

        });
        selectIndustryElement.innerHTML = options;
    }
    getCountry();
}


function getCountry() {
    countryList = []
    let objectName = "Countries_and_Cities";
    let list = 'City,RecordID,State,Country';
    let fieldList = list.split(",");
    let orderBy = "true";
    let whereClause = "";
    let pageSize = "100000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((contry) => {
        if (Array.isArray(contry) && contry.length > 0) {
            countryList = contry;
            countryList= countryList.sort((a, b) => a.State.localeCompare(b.State));
        }
        loadCountry()
    });
}

function loadCountry() {
    let selectCountryElement = document.getElementById('selectCountry');
    let options = `<option value=''>Select Country</option>`;

    let uniqueCountries = {};
    let filteredCountryList = [];

    countryList.forEach(valCon => {
        if (!uniqueCountries[valCon.Country]) {
            uniqueCountries[valCon.Country] = true;
            filteredCountryList.push(valCon);
        }
    });
    if (selectCountryElement) {
        filteredCountryList.forEach(valCon => {
            options += `<option value="${valCon.Country}">${valCon.Country}</option>`;
        });
        selectCountryElement.innerHTML = options;
    }
    loadCity()
}


function loadCity() {
    let selectCityElement = document.getElementById('selectCity');
    let options = `<option value=''> Select City</option>`;
    if (selectCityElement) {
        let cityList= countryList.sort((a, b) => a.City.localeCompare(b.City));
        cityList.forEach(city => {
              options += `<option value="${city.RecordID}">${city.City}</option>`;
  
          });
        selectCityElement.innerHTML = options;
    }
    getLead_Source()
}

var LeadSourceList = []
function getLead_Source() {
    LeadSourceList = []
    let objectName = "Lead_Source";
    let list = 'LeadSource';
    let fieldList = list.split(",");
    let orderBy = "true";
    let whereClause = "";
    let pageSize = "100000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((leads) => {
        if (Array.isArray(leads) && leads.length > 0) {
            LeadSourceList = leads;
            LeadSourceList= LeadSourceList.sort((a, b) => a.LeadSource.localeCompare(b.LeadSource));

        }
        loadLead_Source();
    });
}


function loadLead_Source() {
    let selectSourceElement = document.getElementById('selectSource');
    let options = `<option value=''> Select Lead Source</option>`;
    if (selectSourceElement) {
        LeadSourceList.forEach(valInd => {
            options += `<option value="${valInd.RecordID}">${valInd.LeadSource}</option>`;

        });
        selectSourceElement.innerHTML = options;
    }
    // getMarketing_Event()
    getObject();
}


function onChangeSource() {
    LeadSourceID = ""
    let projectElemet = document.getElementById("selectSource")
    if (projectElemet) {
        LeadSourceID = projectElemet.value
    }
    getMarketing_Event()
}


var marketing_EventList = []
function getMarketing_Event() {

    marketing_EventList = []
    let objectName = "Marketing_Event";
    let list = 'LeadSource,EventName';
    let fieldList = list.split(",");
    let orderBy = "true";
    let whereClause = `LeadSource='${LeadSourceID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((eventsname) => {
        if (Array.isArray(eventsname) && eventsname.length > 0) {
            marketing_EventList = eventsname;
            marketing_EventList= marketing_EventList.sort((a, b) => a.EventName.localeCompare(b.EventName));
            loadEventList()
        }
        else {
            loadEventList();
        }

    });
}

function loadEventList() {

    let selectEventElement = document.getElementById('selectEvent');
    let options = `<option value=''> Select Event</option>`;
    if (selectEventElement) {
        marketing_EventList.forEach(eve => {
            options += `<option value="${eve.RecordID}">${eve.EventName}</option>`;

        });
        selectEventElement.innerHTML = options;
    }
    selectEventElement.value = EventNameID

}

function getObject() {
    window.QafService.GetObjectById('Leads').then((responses) => {
        responses[0].Fields.forEach(val => {
            if (val.InternalName === 'LeadPriority') {
                let leadRatingDropdown = document.getElementById('leadRating');
                let options = `<option value=''>Select Lead Rating</option>`
                if (leadRatingDropdown) {
                    val.Choices.split(";#").forEach(choise => {
                        options += `<option value=${choise}>${choise}</option>`
                    })
                    leadRatingDropdown.innerHTML = options;
                }
            }

        })
    })
}

var appNameDetails = [];
var mappingID = []
function getAppName() {

    appNameDetails = [];
    let objectName = "App_Configuration";
    let list = "RecordID,AppName,EncryptedName,Accessible,AppID";
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let AppName = "CRM";
    // let whereClause = `AppID='${this.appID}'`;
    let whereClause = `AppName='${AppName}'`;
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, "", orderBy).then((appDetails) => {
        if (Array.isArray(appDetails) && appDetails.length > 0) {

            appNameDetails = appDetails[0];
            getAppMapping();
        }
    });
}

function getAppMapping() {
    mappingID = [];
    let objectName = "App_User_Mapping";
    let list = "RecordID,AppName,AllowUsers";
    let fieldList = list.split(",");
    let orderBy = "";
    let whereClause = `AppName='${appNameDetails.RecordID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, orderBy, isAscending).then((appDetails) => {
        if (Array.isArray(appDetails) && appDetails.length > 0) {
            appDetails.forEach(val => {
                mappingID.push(userOrGroupFieldRecordIDList(val.AllowUsers));
            });
        }
        getTeams(mappingID);
    });
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


function getTeams(mappingID) {
    let EmployeeWhereClause = []
    let objectName = "Teams";
    let list = "RecordID,AppName,TeamMembers";
    let fieldList = list.split(",");
    let orderBy = "";
    let whereClause = `AppName='${appNameDetails.RecordID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, orderBy, isAscending).then((teams) => {
        if (Array.isArray(teams) && teams.length > 0) {

            let teamList = teams;
            teamList.forEach(val => {
                mappingID.push(userOrGroupFieldRecordIDList(val.TeamMembers));

            });
            let RecordIdsArray = mappingID.flat();
            let EmployeeWhereClause = `RecordID='${RecordIdsArray.join("'<OR> RecordID='")}'`;
            getEmployees(EmployeeWhereClause);
        } else {
            getEmployees(EmployeeWhereClause);
        }
    });
}

var employeesList = [];

function getEmployees(WhereClause) {
    let objectName = "Employees";
    let list = ["RecordID,FirstName,LastName"]
    let fieldList = list.join(",");
    let pageSize = "10000000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = WhereClause
    let recordForField
    recordForField = {
        Tod: objectName,
        Ldft: fieldList,
        Ybod: orderBy,
        Ucwr: whereClause,
        Zps: pageSize,
        Rmgp: pageNumber,
        Diac: "false",
    };
    window.QafService.Rfdf(recordForField).then((employees) => {
        if (Array.isArray(employees) && employees.length > 0) {
            employeesList = employees
            employeesList= employeesList.sort((a, b) => a.FirstName.localeCompare(b.FirstName));
            setEmployeesOnDropdown()
            setCreatedByOnDropdown();
        }
    });
}

function setEmployeesOnDropdown() {
    let employeeElement = document.getElementById('AssignedTo');
    let options = `<option value=''> Select Assigned To</option>`;
    if (employeeElement) {
        employeesList.forEach(employee => {
            options += `<option value="${employee.RecordID}">${employee.FirstName} ${employee.LastName}</option>`;
        });
        employeeElement.innerHTML = options;
    }
}

function setCreatedByOnDropdown() {
    let employeeAssessToMemeberElement = document.getElementById('CreatedBy');
    let options = `<option value=''> Select CreatedBy</option>`;
    if (employeeAssessToMemeberElement) {
        employeesList.forEach(employee => {
            options += `<option value="${employee.RecordID}">${employee.FirstName} ${employee.LastName}</option>`;
        });
        employeeAssessToMemeberElement.innerHTML = options;
    }
    setcrmListValue();
}

function setcrmListValue() {
    let crmListObject = parseFilterCriteria(crmListNewObject.FilterCriteria);
    if (crmListObject) {

        let assignedToeElement = document.getElementById('AssignedTo');
        let createdByElement = document.getElementById('CreatedBy');
        let fromRevenueElement = document.getElementById('fromRevenue');
        let toRevenueElement = document.getElementById('toRevenue');
        let fromDateElement = document.getElementById('FromDate');
        let ToDateElement = document.getElementById('ToDate');
        let selectSourceElement = document.getElementById('selectSource');
        let selectEventElement = document.getElementById('selectEvent');
        let leadRatingElement = document.getElementById('leadRating');
        let selectCityElement = document.getElementById('selectCity');
        let selectIndustryElement = document.getElementById('selectIndustry');
        if (assignedToeElement) {
            assignedToeElement.value = crmListObject.LeadOwner ? crmListObject.LeadOwner : ''
        }
        if (createdByElement) {
            createdByElement.value = crmListObject.CreatedByGUID ? crmListObject.CreatedByGUID : ""
        }
        if (fromRevenueElement) {
            fromRevenueElement.value = crmListObject.ExpectedRevenuemin ? crmListObject.ExpectedRevenuemin : "";
        }
        if (toRevenueElement) {
            toRevenueElement.value = crmListObject.ExpectedRevenuemax ? crmListObject.ExpectedRevenuemax : "";
        }

        if (fromDateElement) {
            fromDateElement.value = getDate(crmListObject.CreatedDatestart ? crmListObject.CreatedDatestart : "")
        }

        if (ToDateElement) {
            ToDateElement.value = getDate(crmListObject.CreatedDateend ? crmListObject.CreatedDateend : "")
        }

        if (selectSourceElement) {
            selectSourceElement.value = crmListObject.LeadSource ? crmListObject.LeadSource : ''
        }
        if (leadRatingElement) {
            leadRatingElement.value = crmListObject.LeadPriority ? crmListObject.LeadPriority : ""
        }
        if (selectCityElement) {
            selectCityElement.value = crmListObject.City ? crmListObject.City.split(")")[0] : ''
        }
        if (selectIndustryElement) {
            selectIndustryElement.value = crmListObject.Industry ? crmListObject.Industry.split(")")[0] : ""
        }
        if (selectEventElement) {
            EventNameID = crmListObject.EventName ? crmListObject.EventName.split(")")[0] : "";
            LeadSourceID = crmListObject.LeadSource ? crmListObject.LeadSource : "";
            getMarketing_Event();
        }
    }
}

function parseFilterCriteria(filterString) {

    let newListObject = {};
    let conditions = filterString.split(")<<NG>>");
    conditions.forEach(condition => {
        let parts = condition.split("='");
        let key = parts[0].replace("(", "").trim();
        let value = parts[1].replace("'", "").trim();
        let dateCondtion = condition

        if (key === 'ExpectedRevenue>') {

            let revenue = extractAndSetExpectedRevenue(dateCondtion)
            let revenueParts = value.split('<AND>');
            newListObject['ExpectedRevenuemin'] = revenue.ExpectedRevenuemin;
            newListObject['ExpectedRevenuemax'] = revenue.ExpectedRevenuemax;

        } else if (key === 'CreatedDate>') {

            let dates = extractDatesFromCondition(dateCondtion)
            // let dateParts = value.split('<AND>');
            newListObject['CreatedDatestart'] = dates.startDate
            newListObject['CreatedDateend'] = dates.endDate
            // newListObject['CreatedDate>:'] = value.trim();
        } else {
            newListObject[key] = value;
        }
    });
    return newListObject;
}


function extractDatesFromCondition(condition) {
    let startDateRegex = /CreatedDate>='(\d{4}\/\d{2}\/\d{2})'/;
    let endDateRegex = /CreatedDate<='(\d{4}\/\d{2}\/\d{2})'/;

    let startDateMatch = condition.match(startDateRegex);
    let startDate = startDateMatch ? startDateMatch[1] : null;

    let endDateMatch = condition.match(endDateRegex);
    let endDate = endDateMatch ? endDateMatch[1] : null;
    return {
        startDate: startDate,
        endDate: endDate
    };
}

function extractAndSetExpectedRevenue(str) {
    const regex = /ExpectedRevenue>='(\d+)'<AND>ExpectedRevenue<='(\d+)'/;
    const match = str.match(regex);

    if (match) {
        const expectedRevenueMin = match[1];
        const expectedRevenueMax = match[2];
        const result = {
            ExpectedRevenuemin: expectedRevenueMin,
            ExpectedRevenuemax: expectedRevenueMax
        };

        return result;
    } else {

        return {
            ExpectedRevenuemin: '',
            ExpectedRevenuemax: ''
        };
    }
}

function getDate(date) {
    let dateValue = moment(date).format("YYYY-MM-DD")
    return dateValue.toString();
}

function SaveFilter() {

    let assignedToeElement = document.getElementById('AssignedTo');
    let createdByElement = document.getElementById('CreatedBy');

    let fromRevenueElement = document.getElementById('fromRevenue');
    let toRevenueElement = document.getElementById('toRevenue');

    let fromDateElement = document.getElementById('FromDate');
    let ToDateElement = document.getElementById('ToDate');
    let selectSourceElement = document.getElementById('selectSource');
    let selectEventElement = document.getElementById('selectEvent');
    let leadRatingElement = document.getElementById('leadRating');
    let selectCityElement = document.getElementById('selectCity');
    let selectIndustryElement = document.getElementById('selectIndustry');
    let whereClauseArray = [];

    let assignedTo;
    let createdBy;

    let fromRevenue;
    let toRevenue;

    let fromDate;
    let ToDate;

    let selectSource;
    let selectEvent;
    let leadRating;

    let selectCity;
    let selectIndustry;



    if (assignedToeElement) {
        assignedTo = assignedToeElement.value;
    }
    if (createdByElement) {
        createdBy = createdByElement.value;
    }
    if (fromRevenueElement) {
        fromRevenue = fromRevenueElement.value;
    }

    if (toRevenueElement) {
        toRevenue = toRevenueElement.value;
    }

    if (fromDateElement) {
        fromDate = fromDateElement.value;
    }
    if (ToDateElement) {
        ToDate = ToDateElement.value;
    }
    if (selectSourceElement) {
        selectSource = selectSourceElement.value;
    }
    if (selectEventElement) {
        selectEvent = selectEventElement.value;
    }

    if (leadRatingElement) {
        leadRating = leadRatingElement.value;
    }
    if (selectCityElement) {
        selectCity = selectCityElement.value;
    }
    if (selectIndustryElement) {
        selectIndustry = selectIndustryElement.value;
    }

    if (assignedTo) {
        whereClauseArray.push(`(LeadOwner='${assignedTo}')`);
    }
    if (createdBy) {
        whereClauseArray.push(`(CreatedByGUID='${createdBy}')`);
    }

    if (selectSource) {
        whereClauseArray.push(`(LeadSource='${selectSource}')`);
    }

    if (selectEvent) {
        whereClauseArray.push(`(EventName='${selectEvent}')`);
    }

    if (leadRating) {
        whereClauseArray.push(`(LeadPriority='${leadRating}')`);
    }
    if (selectCity) {
        whereClauseArray.push(`(City='${selectCity}')`);
    }

    if (selectIndustry) {
        whereClauseArray.push(`(Industry='${selectIndustry}')`);
    }

    if (fromRevenue || toRevenue) {
        whereClauseArray.push(`(ExpectedRevenue>='${fromRevenue}'<AND>ExpectedRevenue<='${toRevenue}')`);
    }
    if (fromDate || ToDate) {
        let fromDatevalue = moment(fromDate).format('YYYY/MM/DD');
        let todateValue = moment(ToDate).format('YYYY/MM/DD');
        whereClauseArray.push(`(CreatedDate>='${fromDatevalue}'<AND>CreatedDate<='${todateValue}')`);
    }
    let whereClause = "";
    if (whereClauseArray && whereClauseArray.length > 0) {
        if (whereClauseArray.length === 1) {
            whereClause = (whereClauseArray[0].substring(0, whereClauseArray[0].length - 1)).substring(1);
        }
        else {
            whereClause = whereClauseArray.join("<<NG>>")
        }

    }

    let filterObject = {
        FilterCriteria: whereClause
    }
    if ((fromDate && !ToDate) || (!fromDate && ToDate)) {
        openAlert("Both dates are mandatory if one is filled.");
    }
    else {
        update(filterObject, "CRM_List")

    }

}

function update(object, repositoryName) {
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
        intermidiateRecord.RecordID = updateRecordID;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.UpdateItem
            (intermidiateRecord).then(response => {
                resolve({
                    response
                })
            });
    })
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

function BacktoHome() {
    window.location.href = `crm/crmlist`
}


document.getElementById('blinkButton').addEventListener('click', function () {
    var button = this;
    button.classList.add('blink');

    // Remove the class after 1 second to stop the blinking
    setTimeout(function () {
        button.classList.remove('blink');
    }, 1000);
});