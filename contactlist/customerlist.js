var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var recordID = urlParams.get("id");
var listName = urlParams.get("name");
var fromList = listName;
var industriesList = [];
var countryList = [];
var employeesList = [];
var updateRecordID = recordID;
var LeadSourceID = ""
var crmListNewObject ;
var EventNameID = ""
var qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        // getAppName()
        rendorTitle();
        getIndustries();
        getListData()
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getListData() {
    crmListNewObject = null
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
            options += `<option value="${valCon.RecordID}">${valCon.Country}</option>`;
        });
        selectCountryElement.innerHTML = options;
    }
    loadCity()
}


function loadCity() {
    let selectCityElement = document.getElementById('selectCity');
    let options = `<option value=''> Select City</option>`;
    if (selectCityElement) {
        countryList.forEach(city => {
            options += `<option value="${city.RecordID}">${city.City}</option>`;

        });
        selectCityElement.innerHTML = options;
    }
    getLead_Source()
    setcrmListValue();
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
        }
        loadLead_Source();
    });
}

function loadLead_Source() {
    let selectSourceElement = document.getElementById('selectSource');
    let options = `<option value=''> Select Customer Source</option>`;
    if (selectSourceElement) {
        LeadSourceList.forEach(valInd => {
            options += `<option value="${valInd.RecordID}">${valInd.LeadSource}</option>`;

        });
        selectSourceElement.innerHTML = options;
    }
    setcrmListValue()
}

function onChangeSource() {
    LeadSourceID = ""
    let projectElemet = document.getElementById("selectSource")
    if (projectElemet) {
        LeadSourceID = projectElemet.value
    }
    getMarketing_Event()
}

var Marketing_EventList = []
function getMarketing_Event() {
    Marketing_EventList = []
    let objectName = "Marketing_Event";
    let list = 'LeadSource,EventName';
    let fieldList = list.split(",");
    let orderBy = "true";
    let whereClause = `LeadSource='${LeadSourceID}'`;
    let pageSize = "100000";
    let pageNumber = "1";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((eventsname) => {
        if (Array.isArray(eventsname) && eventsname.length > 0) {
            Marketing_EventList = eventsname;
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
        Marketing_EventList.forEach(eve => {
            options += `<option value="${eve.RecordID}">${eve.EventName}</option>`;

        });
        selectEventElement.innerHTML = options;
    }
    selectEventElement.value = EventNameID
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

}


function setcrmListValue() {

    let crmListObject = parseFilterCriteria(crmListNewObject.FilterCriteria);
    if (crmListObject) {


        let fromRevenueElement = document.getElementById('fromRevenue');
        let toRevenueElement = document.getElementById('toRevenue');
        let fromDateElement = document.getElementById('FromDate');
        let ToDateElement = document.getElementById('ToDate');
        let selectSourceElement = document.getElementById('selectSource');
        let selectEventElement = document.getElementById('selectEvent');
        let selectCountryElement = document.getElementById('selectCountry');
        let selectCityElement = document.getElementById('selectCity');
        let selectIndustryElement = document.getElementById('selectIndustry');

        if (fromRevenueElement) {
            fromRevenueElement.value = crmListObject.AnnualRevenuemin ? crmListObject.AnnualRevenuemin : "";
        }
        if (toRevenueElement) {
            toRevenueElement.value = crmListObject.AnnualRevenuemax ? crmListObject.AnnualRevenuemax : "";
        }

        if (fromDateElement) {
            fromDateElement.value = getDate(crmListObject.CreatedDatestart ? crmListObject.CreatedDatestart : "")
        }

        if (ToDateElement) {
            ToDateElement.value = getDate(crmListObject.CreatedDateend ? crmListObject.CreatedDateend : "")
        }

        if (selectSourceElement) {
            selectSourceElement.value = crmListObject.Source ? crmListObject.Source : ''
        }
        if (selectCountryElement) {
            selectCountryElement.value = crmListObject.Country ? crmListObject.Country : ""
        }
        if (selectCityElement) {
            selectCityElement.value = crmListObject.BillingCity ? crmListObject.BillingCity.split(")")[0] : ''
        }
        if (selectIndustryElement) {
            selectIndustryElement.value = crmListObject.Industry ? crmListObject.Industry.split(")")[0] : ""
        }
        if (selectEventElement) {
            EventNameID = crmListObject.EventName ? crmListObject.EventName.split(")")[0] : "";
            LeadSourceID = crmListObject.Source ? crmListObject.Source : "";
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

        if (key === 'AnnualRevenue>') {

            let revenue = extractAndSetExpectedRevenue(dateCondtion)
            let revenueParts = value.split('<AND>');
            newListObject['AnnualRevenuemin'] = revenue.AnnualRevenuemin;
            newListObject['AnnualRevenuemax'] = revenue.AnnualRevenuemax;
            getTemplates
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

    const regex = /AnnualRevenue>='(\d+)'<AND>AnnualRevenue<='(\d+)'/;
    const match = str.match(regex);

    if (match) {
        const AnnualRevenueMin = match[1];
        const AnnualRevenueMax = match[2];
        const result = {
            AnnualRevenuemin: AnnualRevenueMin,
            AnnualRevenuemax: AnnualRevenueMax
        };

        return result;
    } else {

        return {
            AnnualRevenuemin: '',
            AnnualRevenuemax: ''
        };
    }
}

function getDate(date) {
    let dateValue = moment(date).format("YYYY-MM-DD")
    return dateValue.toString();
}


function SaveFilter() {

    let fromRevenueElement = document.getElementById('fromRevenue');
    let toRevenueElement = document.getElementById('toRevenue');
    let fromDateElement = document.getElementById('FromDate');
    let ToDateElement = document.getElementById('ToDate');
    let selectCityElement = document.getElementById('selectCity');
    let selectSourceElement = document.getElementById('selectSource');
    let selectEventElement = document.getElementById('selectEvent');
    let selectCountryElement = document.getElementById('selectCountry');
    let selectIndustryElement = document.getElementById('selectIndustry');
    let whereClauseArray = [];
    let fromRevenue;
    let toRevenue;
    let fromDate;
    let ToDate;
    let selectSource;
    let selectEvent;
    let selectCity;
    let selectIndustry;
    let selectCountry;

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
    if (selectCityElement) {
        selectCity = selectCityElement.value;
    }

    if (selectSourceElement) {
        selectSource = selectSourceElement.value;
    }
    if (selectEventElement) {
        selectEvent = selectEventElement.value;
    }


    if (selectCountryElement) {
        selectCountry = selectCountryElement.value;
    }

    if (selectIndustryElement) {
        selectIndustry = selectIndustryElement.value;
    }
    let customerType = 'Customer'

    if (customerType) {
        whereClauseArray.push(`(Type='${customerType}')`);
    }


    if (selectSource) {
        if(crmListNewObject){
            if(crmListNewObject.Entity.toLocaleLowerCase()==='customer'.toLocaleLowerCase()){
                whereClauseArray.push(`(LeadSource='${selectSource}')`);
            }else{
                whereClauseArray.push(`(Source='${selectSource}')`);
            }
        }else{
            whereClauseArray.push(`(Source='${selectSource}')`);
        }
    }

    if (selectEvent) {
        whereClauseArray.push(`(EventName='${selectEvent}')`);
    }

    if (selectCity) {
        whereClauseArray.push(`(BillingCity='${selectCity}')`);
    }

    if (selectCountry) {
        whereClauseArray.push(`(Country='${selectCountry}')`);
    }
    if (selectIndustry) {
        whereClauseArray.push(`(Industry='${selectIndustry}')`);
    }
    if (fromRevenue || toRevenue) {
        whereClauseArray.push(`(AnnualRevenue>='${fromRevenue}'<AND>AnnualRevenue<='${toRevenue}')`);
    }
    if (fromDate && ToDate) {
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
    setTimeout(function () {
        button.classList.remove('blink');
    }, 1000);
});