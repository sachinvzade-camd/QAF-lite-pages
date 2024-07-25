var Email = "";
var PasswordKey = "";
var companySetting = [];
var vendorImage = [];
var apURL = ""
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        apURL = window.localStorage.getItem('ma')
        getVendorLoginImage()
        getCompanySetting()
        // setHrefLink()
        clearInterval(qafServiceLoaded);
    }
}, 10);

// function setHrefLink() {
//     let linkElement = document.getElementById('hreflink');
//     if (linkElement) {
//         linkElement.href =`https://${apURL}/pages/public/forgetvendorkey`;
//     }
// }

function getCompanySetting() {
    companySetting = [];
    let objectName = "Company_Settings";
    let list = 'RecordID,Title,State,Country,City,Logo';
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let orderBy = "true";
    let whereClause = ``;
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((settings) => {
        if (Array.isArray(settings) && settings.length > 0) {
            companySetting = settings[0]
            setImageSrc()
        }
    });
}

function setImageSrc() {
    let imageUrl = downloadResume(companySetting.Logo)
    const imageElement = document.getElementById('company-logo');
    imageElement.src = imageUrl;
}

function getVendorLoginImage() {
    vendorImage = []
    let objectName = "Recruitment_Settings";
    let list = "SettingName,Attachment";
    let fieldList = list.split(",")
    let orderBy = "";
    let whereClause = `SettingName='vendor_portal_image'`;
    // let whereClause = `(LoginKey='${PasswordKey}') AND (Email='${Email}')`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((imgs) => {

        if (Array.isArray(imgs) && imgs.length > 0) {
            vendorImage = imgs[0];
            loadImage()
        }
    })
}

function loadImage() {
    let imaggUrl = downloadResume(vendorImage.Attachment);
    const leftSection = document.getElementById('left-section');
    leftSection.style.backgroundImage = `url('${imaggUrl}')`;
    leftSection.style.backgroundSize = 'cover';
    leftSection.style.backgroundPosition = 'center';
    leftSection.style.backgroundRepeat = 'no-repeat';

}


function downloadResume(url) {
    return window.location.origin + "/Attachment/downloadfile?fileUrl=" + encodeURIComponent(getURLFromJson((url)))
}

function getURLFromJson(values) {
    if (values) {
        if (values.includes('link')) {
            if (IsJsonString(values)) {
                let sampleval = JSON.parse(values)
                return sampleval && sampleval[0].link ? sampleval[0].link : "";
            } else {
                return values;
            }
        }
        else {
            return values;
        }
    }
    else {
        return '';
    }
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function CallVendor() {

    let objectName = "R_Vendor";
    let list = "Email,LoginKey,LastName,FirstName,CompanyName";
    let fieldList = list.split(",")
    let orderBy = "";
    let whereClause = `LoginKey='${PasswordKey}'<AND>Email='${Email}'`;
    // let whereClause = `(LoginKey='${PasswordKey}') AND (Email='${Email}')`;
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((examiner) => {
        if (Array.isArray(examiner) && examiner.length > 0) {

            let careerLogin = {
                RecordID: examiner[0].RecordID,
                LastName: examiner[0].LastName,
                FirstName: examiner[0].FirstName,
                CompanyName: examiner[0].CompanyName,
                TimeStamp: new Date()
            };

            localStorage.setItem('R_Vendor_KEY', JSON.stringify(careerLogin));
            window.location.href = `https://${apURL}/pages/public/vendorportal`;
            careerServiceProvider.isExpired()
        }
        else {
            let content = document.getElementById("login-form")
            displayErrorMessage(content, "User name and password doesn't match. Please try again");
        }
    })
}

function getLoginInfo() {

    var userNameElement = document.getElementById('username');
    var passwordElement = document.getElementById('password');
    let content = document.getElementById("login-form")
    removeErrorMessage(content);
    removeErrorMessage(userNameElement);
    removeErrorMessage(passwordElement);

    if (!validateFullName(userNameElement.value)) {
        displayErrorMessage(userNameElement, "Username or Email is required");
    } else if (!validateFullName(passwordElement.value)) {
        displayErrorMessage(passwordElement, "Password Key is required");
    } else {
        Email = userNameElement.value;
        PasswordKey = passwordElement.value
        CallVendor();
    }
}

function validateFullName(fullName) {
    return fullName.trim() !== "";
}

function displayErrorMessage(field, message) {
    removeErrorMessage(field);
    const parentElement = field.parentElement;
    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    errorSpan.textContent = message;
    parentElement.appendChild(errorSpan);

    field.addEventListener('input', function () {
        if (validateFullName(field.value)) {
            removeErrorMessage(field);
        }
    });
}

// Function to remove error message
function removeErrorMessage(field) {
    const parentElement = field.parentElement;
    const errorSpan = parentElement.querySelector(".error-message");
    if (errorSpan) {
        parentElement.removeChild(errorSpan);
    }
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

var inputElements = document.querySelectorAll('.input-alert');
// Loop through each input element and attach a click event listener
inputElements.forEach(function (inputElement) {
    inputElement.addEventListener('click', function () {
        var userNameElement = document.getElementById('username');
        var passwordElement = document.getElementById('password');
        let content = document.getElementById("login-form")
        removeErrorMessage(content);
        removeErrorMessage(userNameElement);
        removeErrorMessage(passwordElement);
    });
});



