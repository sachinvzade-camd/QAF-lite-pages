// Declare variables
var todaysDate;
var customerName;
var ProblemType;
var Category;
var Description;
var Area;
var Resolution;
var lessionLearn;
var date;
var VisitDate = "";
var currentDateTime = new Date();
var day = currentDateTime.getDate();
var month = currentDateTime.getMonth() + 1;
var year = currentDateTime.getFullYear();
day = day < 10 ? '0' + day : day;
month = month < 10 ? '0' + month : month;
var currentDate = `${day}/${month}/${year}`;
var locationLatitude;
var locationLongitute;
var locationMessage;
var EmployeeID_Value;

 qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        var lsvalue = new CustomEvent('setlskey', { detail: { key: "user_key" } })
        window.parent.document.dispatchEvent(lsvalue)
        var callLocation = new CustomEvent('callLocation')
        window.parent.document.dispatchEvent(callLocation)

        window.document.addEventListener('getLocation', getLocation)
        window.document.addEventListener('getlsvalue', getLocalstoreageDetails)

        window.QafService.SetEnvUrl("https://demtis.quickappflow.com")
        let breadcum = document.getElementById("breadcrum");
        if (breadcum) {
            document.getElementById("breadcrum").style.display = "none";
        }

        setTimeout(() => {
            getObject()
            LoadPopUP()
            document.getElementById("VisitDate").addEventListener("change", function () {
                VisitDate = new Date(this.value);
            });
            getAllData()
            whereClausecreate = `CreatedByGUID='${getCurrentUserGuid()}'<<NG>>(VisitDate>='${year + '/' + month + '/' + day}'<AND>VisitDate<='${year + '/' + month + '/' + day}')`;
            todaysDate.innerHTML = currentDate;
        }, 500);
        clearInterval(qafServiceLoaded);
    }
}, 10);

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

function getLocationSerive() {
    var callLocation = new CustomEvent('callLocation')
    window.parent.document.dispatchEvent(callLocation)
    window.document.addEventListener('getLocation', getLocation)
}

function getObject() {
    window.QafService.GetObjectById('Field_Service').then((responses) => {
        responses[0].Fields.forEach(val => {
            if (val.InternalName === 'Category') {
                populateDropdown('Category', val.Choices);
            }
            if (val.InternalName === 'TypeofProblem') {
                populateDropdown('ProblemType', val.Choices);
            }
        });
        getComplaint();
    });
}


function populateDropdown(id, choices) {
    let dropdownID;
    if (id != "ProblemType") {
        dropdownID = id
    }
    else {
        dropdownID = "Problem Type";

    }
    const dropdown = document.getElementById(id);
    if (dropdown) {
        let options = `<option value=''>Select ${dropdownID}</option>`;
        choices.split(";#").forEach(choice => {
            let newChoice = choice.split(" ").join("_");
            options += `<option value=${newChoice}>${choice}</option>`;
        });
        dropdown.innerHTML = options;
    }
}

function getAllData() {
    todaysDate = document.getElementById("today");
    customerName = document.getElementById("CustomerName");
    ProblemType = document.getElementById("ProblemType");
    Category = document.getElementById("Category");
    Description = document.getElementById("Description");
    Area = document.getElementById("Area");
    Resolution = document.getElementById("Resolution");
    lessionLearn = document.getElementById("lessionLearn");
    date = document.getElementById("VisitDate");
}


function getLocation(event) {
    const { latitude, longitude, message } = event.detail;
    locationMessage = message
    locationLatitude = latitude;
    locationLongitute = longitude;
}

function getLocalstoreageDetails(event) {
    const { EmployeeGUID, EmployeeID } = event.detail;
    EmployeeID_Value = EmployeeID;
}

function addServiceForm() {
    // getLocationSerive()
    const popUp = document.getElementById("popupContainer");

    if (locationMessage) {
        if ((locationMessage.toLowerCase() === "Location permission not granted".toLowerCase())) {
            locationMessage = "Enable location permission";
            alert(locationMessage);
        }
        else {
            alert(locationMessage)
        }
    } else {
        if (popUp) {
            popUp.style.display = 'block';
            addCssforscroll();
            let Ismobile = isMobileDevice()
            if (Ismobile) {
                var element = document.querySelector("body");
                element.classList.remove("hide-y-scroll");
            }
        }
    }
}


// Month Nevigator
function nextDate() {
    monthNavigator('add');
}

function previousDate() {
    monthNavigator('subtract');
}

function monthNavigator(month) {
    if (month === 'subtract') {
        currentDateTime.setDate(currentDateTime.getDate() - 1);
    } else {
        currentDateTime.setDate(currentDateTime.getDate() + 1);
    }
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth() + 1; // Months in JavaScript are zero-based
    year = currentDateTime.getFullYear();
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    currentDate = `${day}/${month}/${year}`;
    todaysDate.innerHTML = currentDate;
    whereClausecreate = `CreatedByGUID='${getCurrentUserGuid()}'<<NG>>(VisitDate>='${year}/${month}/${day}'<AND>VisitDate<='${year}/${month}/${day}')`;
    getComplaint();
}


function getComplaint() {
    const myContent = document.querySelector(".fs-card-container");
    const objectName = "Field_Service";
    const list = "CustomerName,Category,TypeofProblem,Area,Resolution,LessionLearnt,VisitDate";
    const orderBy = "";
    const whereClause = whereClausecreate;
    const fieldList = list.split(";#");
    const pageSize = "20000";
    const pageNumber = "1";
    let html = "";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((fieldService_List) => {
        if (Array.isArray(fieldService_List) && fieldService_List.length > 0) {
            fieldService_List.forEach((data, index) => {
                html += `
                      <div class="fs-card">
                        <div class="main">
                            <div class="visit-details">
                                <div class="fs-date-container">
                                <div class="visit-time">
                                    <span>${getFormattedTime(data.VisitDate)}</span>
                                </div>
                                </div>
                            </div>
                            <div class="detailbody">
                                <div class="service-title">
                                <p>${data.CustomerName ? data.CustomerName : ""}</p>
                                </div>
                                <div class="service-title">
                                <p>${data.TypeofProblem ? data.TypeofProblem : ""}</p>
                                </div>
                                <div class="service-title category">
                                <p>${data.Category ? data.Category : ""}</p>
                                </div>
                                <div class="service-title Description">
                                <p>${data.LessionLearnt ? data.LessionLearnt : ""}</p>
                                <p>${data.Area ? data.Area : ""}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
            myContent.innerHTML = html;
        } else {
            myContent.innerHTML = `<div class="nodata">No Record Found</div>`;
        }
    });
}


function isMobileDevice() {
    var screenWidth = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    return screenWidth < 768 ? true : false;

}

function addCssforscroll() {
    const popUp = document.getElementById("cardBox");
    var element = document.querySelector("body");
    if (popUp) {
        popUp.style.display = 'none';
    }
    element.classList.add("hide-y-scroll");
}

function removeCss() {
    const popUp = document.getElementById("cardBox");
    var element = document.querySelector("body");
    if (popUp) {
        popUp.style.display = 'flex';
    }
    element.classList.remove("hide-y-scroll");
}


function submitScheduleForm() {
    let newChoice = "";
    if (ProblemType.value) {
        newChoice = ProblemType.value.split("_").join(" ");
    }
    const object = {
        CustomerName: customerName.value ? customerName.value : "",
        Category: Category.value ? Category.value : "",
        TypeofProblem: newChoice,
        Area: Area.value ? Area.value : "",
        VisitDate: VisitDate ? new Date(VisitDate).toISOString() : "",
        Resolution: Resolution.value ? Resolution.value : "",
        LessionLearnt: lessionLearn.value ? lessionLearn.value : "",
        Latitude: locationLatitude ? locationLatitude : "",
        Longitude: locationLongitute ? locationLongitute : "",
    };
    save(object, 'Field_Service');
    closeForm();
}


function save(object, repositoryName) {
    return new Promise((resolve) => {
        const recordFieldValueList = [];
        const intermidiateRecord = {};
        Object.keys(object).forEach((key, value) => {
            recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: object[key]
            });
        });
        intermidiateRecord.CreatedByID = EmployeeID_Value;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = repositoryName;
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.CreateItem(intermidiateRecord).then(response => {
            getComplaint();
            resolve({ response });
        });
    });
}

function closeForm() {
    removeCss()
    const customerNameInput = document.getElementById("CustomerName");
    const visitDateInput = document.getElementById("VisitDate");
    removeErrorMessage(customerNameInput);
    removeErrorMessage(visitDateInput);
    const popUp = document.getElementById("popupContainer");
    if (popUp) {
        popUp.style.display = 'none';
    }
    removeAllValues();
}

function removeAllValues() {
    customerName.value = "";
    Category.value = "";
    ProblemType.value = "";
    Area.value = "";
    VisitDate = "";
    Resolution.value = "";
    lessionLearn.value = "";
    date.value = "";
}



function saveFrom() {
    const customerNameInput = document.getElementById("CustomerName");
    const visitDateInput = document.getElementById("VisitDate");

    removeErrorMessage(customerNameInput);
    removeErrorMessage(visitDateInput);

    if (!validateFullName(customerNameInput.value)) {
        displayErrorMessage(customerNameInput, "Please enter customer name");
    }

    if (!validateDate(visitDateInput.value)) {
        displayErrorMessage(visitDateInput, "Please enter visit date");
    }

    if (validateFullName(customerNameInput.value) && validateDate(visitDateInput.value)) {
        submitScheduleForm();
    }
}

function validateFullName(customerName) {
    return customerName.trim() !== "";
}

function validateDate(visitDateValue) {

    const isValidDate = (new Date(visitDateValue) !== "Invalid Date") && !isNaN(new Date(visitDateValue));
    return isValidDate;
}

function displayErrorMessage(field, message) {
    removeErrorMessage(field);
    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    errorSpan.textContent = message;
    field.parentNode.appendChild(errorSpan);
}

function removeErrorMessage(field) {
    const errorSpan = field.parentNode.querySelector(".error-message");
    if (errorSpan) {
        errorSpan.parentNode.removeChild(errorSpan);
    }
}


function getFormattedTime(dateTimeString) {
    if (dateTimeString) {
        const dateTimeUTC = new Date(dateTimeString + "Z");
        const dateTime = new Date(dateTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        let hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        return formattedTime;
    } else {
        return "";
    }
}
function LoadPopUP() {
    const popupContainer = document.querySelector(".popup-container");
    const html = `
        <div class="popup-content">
            <div class="qaf-form-group">
                <label for="customerName" class="Customer fs-label">Customer Name</label>
                <input type="text" class="fs-input" id="CustomerName" name="customerName" autocomplete="off" required>
            </div>
            <div class="qaf-form-group">
                <label for="category" class="fs-label">Category</label>
                <select class="fs-input fs-select" id="Category" name="category"></select>
            </div>
            <div class="qaf-form-group">
                <label for="problemType" class="fs-label">Type of Problem</label>
                <select class="fs-input fs-select" id="ProblemType" name="problemType"></select>
            </div>
            <div class="qaf-form-group">
                <label for="area" class="fs-label">Area</label>
                <input class="fs-input" type="text" id="Area" name="area" autocomplete="off">
            </div>
            <div class="qaf-form-group fs-textarea-control">
                <label for="resolution" class="fs-label">Resolution</label>
                <textarea class="fs-input" id="Resolution" name="resolution" rows="2" autocomplete="off"></textarea>
            </div>
            <div class="qaf-form-group fs-textarea-control">
                <label for="lessonLearnt" class="fs-label">Lesson Learnt</label>
                <textarea class="fs-input" id="lessionLearn" name="lessonLearnt" rows="2"  autocomplete="off"></textarea>
            </div>
            <div class="qaf-form-group">
                <label for="lessonLearnt" class="fs-label">Visit Date</label>
                <input class="fs-input" type="datetime-local" id="VisitDate" name="VisitDate" autocomplete="off" required>
            </div>
            <div class="action-buttons">
                <button type="button " class="fsbtn btn-primary qaf-submit" onclick="saveFrom()">Submit</button>
                <button type="button" class="fsbtn qaf-cancel" onclick="closeForm()">Close</button>
            </div>
        </div>`;
    popupContainer.innerHTML = html;
    loadButtons();
}

function loadButtons() {
    const headerButtons = document.querySelector(".header-button");
    const html = `
        <div class="fs-preveous">
            <button id="tableButton" class="listview fs-qaf-button fsbtn btn-primary" onclick="previousDate()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
        </div>
        <div class="currentDate" id="today" style="color: black;"></div>
        <div class="next">
            <button id="cardButton" class="gridview fs-qaf-button fsbtn btn-primary" onclick="nextDate()">
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
        <div class="add">
            <button class="addplus fs-qaf-button fsbtn btn-primary" onclick="addServiceForm()"> Add
            </button>
        </div>`;
    headerButtons.innerHTML = html;
}