const urlParams = new URLSearchParams(window.location.search);
const customerID = urlParams.get('cid');
const jobID = urlParams.get('jid');
const round = urlParams.get('round');
var interviewDetails;
var singlecasDetails;
var casObjectField = [
    {
        SectionName: 'Client Satisfaction',
        Fields: [
            { internalName: 'USAPExecutiveR4Skill1', displayName: 'Responsiveness' },
            { internalName: 'AccManagerDomesticR4Skill2', displayName: 'Ability to set the priorities' },
            { internalName: 'AccManagerDomesticR4Ski', displayName: 'Handling escalation professionally' }
        ]
    }
]
var casArrayFormobject = [
    {
        internalName: 'TLDomesticAccR1Skill2',
        displayName: 'Managing Escalations – Conflict Management, Solution driven',
        values: [
            "1-Poor",
            "2-Weak",
            "3-Workable",
            "4-Good",
            "5-Strength",
        ]
    }
]

var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;


let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        getCasDetails();
        clearInterval(qafServiceLoaded);
    }
}, 10);
function formatting(value) {
    let returnValue = value ? value : "";//fix change by mayur
    let updatedRetunValue = [];
    if (returnValue.indexOf(';#') !== -1) {
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
    return returnValue
}
function isValidGuid(guidString) {
    guidString = guidString ? guidString.trim() : '';
    let guidRegexPattern = new RegExp(guidPattern)
    return guidRegexPattern.test(guidString);
}

function getCasDetails() {
    casArray = []
    let objectName = "CAS";
    let list = 'Candidate,Comment,AccManagerDomesticR1Skill1,TLDomesticAccR1Skill2,USAPExecutiveR2Skill1,USAPExecutiveR3Skill1,USAPExecutiveR4Skill1,TLDomesticAccR2Skill1,TLDomesticAccR3Skill1,TLDomesticAccR4Skill1,USAPExecutiveR5Skill1,AccManagerDomesticR2Ski,AccManagerDomesticR3Skill1,AccManagerDomesticR3Skill2,AccManagerDomesticR2Skill2,USAPExecutiveR5Skill2,TLDomesticAccR4Skill2,TLUSAccR2Skill1,TLDomesticAccR2Skill2,USAccManagerR4Skill1,USAPExecutiveR3Skill2,USAPExecutiveR2Skill2,TLDomesticAccR1Skill3,AccManagerDomesticR1Skill2,JobPost,JobRole,AccManagerDomesticR1Ski,TLDomesticAccR1Skill4,USAccManagerR1Skill1,USAPExecutiveR3Skill3,AccManagerDomesticR4Ski,TLDomesticAccR2Skill3,TLUSAccR2Skill2,TLUSAccR4Skill1,USAPExecutiveR5Skill3,AccManagerDomesticR2Skill3,USAPExecutiveR5Skill4,TLUSAccR4Skill2,TLUSAccR2Skill3,TLDomesticAccR2Skill4,AccManagerDomesticR4Skill2,TLUSAccR1Skill1,USAPExecutiveR1Skill1,Interviwer,InterviewRound,DeputyTL6,TLUSAccR1Skill2,DeputyTL4,USAPExecutiveR1Skill2,TLUSAccR1Skill3,IsApproved,DeputyTL7,DeputyTL5,DeputyTL1,DeputyTL2,DeputyTL3'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(JobPost='${jobID}')<<NG>>(IsApproved='True')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((casDetails) => {
        if (Array.isArray(casDetails) && casDetails.length > 0) {
            this.casObjectField.forEach(val => {
                if (val.SectionName != 'Personal Information') {
                    let fields = val.Fields
                    fields.forEach(field => {
                        let firstRound = casDetails.filter(a => a.InterviewRound === "1");
                        let secondRound = casDetails.filter(a => a.InterviewRound === "2");
                        let thirdRound = casDetails.filter(a => a.InterviewRound === "3");
                        let screeningRound = casDetails.filter(a => a.InterviewRound === "Screening Round");
                        let firstRoundValue = firstRound && firstRound.length > 0 ? formatting(firstRound[0][field.internalName]) : ''
                        let secondRoundValue = secondRound && secondRound.length > 0 ? formatting(secondRound[0][field.internalName]) : ''
                        let thirdRoundValue = thirdRound && thirdRound.length > 0 ? formatting(thirdRound[0][field.internalName]) : ''
                        let screeningRoundValue = screeningRound && screeningRound.length > 0 ? formatting(screeningRound[0][field.internalName]) : ''
                        casArray.push({
                            Responsibilities: val.SectionName,
                            skillrequired: field.displayName,
                            firstInterview: firstRoundValue,
                            secondInterview: secondRoundValue,
                            thirdInterview: thirdRoundValue,
                            screeningRound: screeningRoundValue
                        })
                    })
                }
            })
            createTable(casArray)
        }
    });
}
function createTable(objectArray) {
    let body = document.getElementById('casid');
    let tbl = document.createElement('table');
    let thead = document.createElement('thead');
    let thr = document.createElement('tr');
    let tableHeads = ["Responsibilities", "Skill Required", "Round 1", "Round 2", "Round 3"]
    for (let i = 0; i <= tableHeads.length - 1; i++) {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(tableHeads[i]));
        thr.appendChild(th);
    }
    thead.appendChild(thr);
    tbl.appendChild(thead);
    let tbdy = document.createElement('tbody');
    let tempresponsibilities = ""
    objectArray.forEach((object, index) => {
        let responsibilities = object['Responsibilities']
        if ((tempresponsibilities != responsibilities) && index != 0) {
            tempresponsibilities = object['Responsibilities']
        }
        let n = 0;
        let tr = document.createElement('tr');
        let objectNames = ["Responsibilities", "skillrequired", "firstInterview", "secondInterview", "thirdInterview"]
        for (let obj = 0; obj <= objectNames.length - 1; obj++) {
            if (objectNames[obj] === 'Responsibilities') {
                let elemRowSpan = objectArray.filter(a => a.Responsibilities === object[objectNames[obj]])
                if (index === 0) {
                    let td = document.createElement('td');
                    td.setAttribute('rowSpan', elemRowSpan.length);
                    td.appendChild(document.createTextNode(object[objectNames[obj]]));
                    tr.appendChild(td);
                } else if ((tempresponsibilities != responsibilities)) {
                    let td = document.createElement('td');
                    td.setAttribute('rowSpan', elemRowSpan.length);
                    td.appendChild(document.createTextNode(object[objectNames[obj]]));
                    tr.appendChild(td);
                }
            } else {
                let td = document.createElement('td');
                td.appendChild(document.createTextNode(object[objectNames[obj]]));
                tr.appendChild(td);
            }
            n++;
        };
        tbdy.appendChild(tr);
    });
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}
function openTab(evt, id) {
    
    var i, tabcontent, tablinks;
    document.getElementById('table').style.display = "block";
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(id).style.display = "block";
    evt.currentTarget.className += " active";
    if(id==='form'){

        getInterviewDetails()
        getSingleCasDetails()
    }
}

function createForm() {
    var down = document.getElementById("formID");
    var br = document.createElement("br");
    // Create a form dynamically
    var formCreate = document.createElement("form");
    formCreate.setAttribute("method", "post");
    formCreate.setAttribute("id", "casForm");
    form = document.getElementById('casForm');

    for (var i = 0; i < casArrayFormobject.length; i++) {
        itemName = casArrayFormobject[i];
        var newLabel = document.createElement('label');
        var t = document.createTextNode(itemName.displayName);
        newLabel.setAttribute("for", itemName.internalName);
        formCreate.appendChild(t)
        formCreate.appendChild(document.createElement('br'));

        for (var options = 0; options < (itemName.values.length); options++) {
            var newRadio = document.createElement('input');
            newRadio.type = 'radio';
            newRadio.id = itemName.internalName;
            newRadio.name = itemName.internalName;
            newRadio.value = itemName.values[options];
            var newLabel2 = document.createElement('label');
            var t1 = document.createTextNode(itemName.values[options]);
            newLabel2.setAttribute("for", itemName.values[options]);
            formCreate.appendChild(newRadio);
            formCreate.appendChild(t1)
            formCreate.appendChild(document.createElement('br'));

        }
        formCreate.appendChild(document.createElement('br'));
    }
    // create a submit button
    var s = document.createElement("input");
    s.setAttribute("type", "submit");
    s.setAttribute("value", "Submit");
    formCreate.appendChild(br.cloneNode());

    // Append the submit button to the form
    formCreate.appendChild(s);
    down.appendChild(formCreate);
}
var form = document.getElementById('casForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let submitFormObject = {}
        if (singlecasDetails && singlecasDetails.RecordID) {
            submitFormObject['Candidate'] = singlecasDetails['Candidate']
            submitFormObject['JobPost'] = singlecasDetails['JobPost']
            submitFormObject['JobRole'] = singlecasDetails['JobRole']
            submitFormObject['Interviwer'] = singlecasDetails['Interviwer']
            submitFormObject['InterviewRound'] = singlecasDetails['InterviewRound']
            submitFormObject['RecordID'] = singlecasDetails['RecordID']
        } else {
            submitFormObject['Candidate'] = interviewDetails['Candidate']
            submitFormObject['JobPost'] = interviewDetails['AppliedForJob']
            submitFormObject['JobRole'] = interviewDetails['JobRole']
            submitFormObject['Interviwer'] = interviewDetails['Interviewer']
            submitFormObject['InterviewRound'] = interviewDetails['InterviewRound']
        }
        casArrayFormobject.forEach(val => {
            submitFormObject[val.internalName] = form.elements[val.internalName].value
        })
        saveForm(submitFormObject)
    });
function saveForm(submitFormObject) {
    return new Promise((resolve) => {
        var recordFieldValueList = [];
        var intermidiateRecord = {}
        var user = getCurrentUser()
        Object.keys(submitFormObject).forEach((key, value) => {
           recordFieldValueList.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: submitFormObject[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = "CAS";
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.CreateItem(intermidiateRecord).then(response => {
            form.reset();
            resolve({
                response
            })
        });
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
function getSingleCasDetails() {
    let objectName = "CAS";
    let list = 'Candidate,Comment,AccManagerDomesticR1Skill1,TLDomesticAccR1Skill2,USAPExecutiveR2Skill1,USAPExecutiveR3Skill1,USAPExecutiveR4Skill1,TLDomesticAccR2Skill1,TLDomesticAccR3Skill1,TLDomesticAccR4Skill1,USAPExecutiveR5Skill1,AccManagerDomesticR2Ski,AccManagerDomesticR3Skill1,AccManagerDomesticR3Skill2,AccManagerDomesticR2Skill2,USAPExecutiveR5Skill2,TLDomesticAccR4Skill2,TLUSAccR2Skill1,TLDomesticAccR2Skill2,USAccManagerR4Skill1,USAPExecutiveR3Skill2,USAPExecutiveR2Skill2,TLDomesticAccR1Skill3,AccManagerDomesticR1Skill2,JobPost,JobRole,AccManagerDomesticR1Ski,TLDomesticAccR1Skill4,USAccManagerR1Skill1,USAPExecutiveR3Skill3,AccManagerDomesticR4Ski,TLDomesticAccR2Skill3,TLUSAccR2Skill2,TLUSAccR4Skill1,USAPExecutiveR5Skill3,AccManagerDomesticR2Skill3,USAPExecutiveR5Skill4,TLUSAccR4Skill2,TLUSAccR2Skill3,TLDomesticAccR2Skill4,AccManagerDomesticR4Skill2,TLUSAccR1Skill1,USAPExecutiveR1Skill1,Interviwer,InterviewRound,DeputyTL6,TLUSAccR1Skill2,DeputyTL4,USAPExecutiveR1Skill2,TLUSAccR1Skill3,IsApproved,DeputyTL7,DeputyTL5,DeputyTL1,DeputyTL2,DeputyTL3'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(JobPost='${jobID}')<<NG>>(IsApproved='True')<<NG>>(InterviewRound='${round}')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((details) => {
        if (Array.isArray(details) && details.length > 0) {
            singlecasDetails=details[0]
            createForm()
        }else{
            createForm()
        }
    });
}
function getInterviewDetails() {
    interviewDetails=null
    let objectName = "Interview_Detail";
    let list = 'Candidate,AppliedForJob,Interviewer,JobRole,InterviewRound'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(AppliedForJob='${jobID}')<<NG>>(InterviewRound='${round}')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((details) => {
        if (Array.isArray(details) && details.length > 0) {
            interviewDetails=details[0];
        }
    });
}