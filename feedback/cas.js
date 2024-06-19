const urlParams = new URLSearchParams(window.location.search);
const customerID = urlParams.get('cid');
const jobID = urlParams.get('jid');
const round = urlParams.get('round');
const Email = urlParams.get('Email');
const EmployeeGUID = urlParams.get('EmployeeGUID');
const EmployeeID = urlParams.get('EmployeeID');
var interviewDetails;
var jobRole;
var jobRolewithguid;
var singlecasDetails;
var newFormFields;
var checklistData;
var nonnegotiablelistData;
var jobpostingDetails;
var candidateDetails;
var file;
var filename;
var attachmentRepoAndFieldName;
var jobTracker;
var user;
var attachmentURL;
var attachmentAPIURL = window.location.origin
var downloadurl
var nonnegotiablelistFields=[
    { internalName: 'JobPost', displayName: 'Job Post' },
{internalName: 'Candidate', displayName: 'Candidate' },
{internalName: 'JobRole', displayName: 'Job Role' },
{internalName: 'TLQuestion1', displayName: 'Have handled the portfolio of clients – atleast 10' },
{internalName: 'TLQuestion2', displayName: 'Relationship Builder – Manage client relationship independently' },
{internalName: 'TLQuestion3', displayName: 'Have atleast handled 5 team members' },
{internalName: 'TLQuestion4', displayName: 'Accounting Domain and Degree' },
{internalName: 'TLQuestion5', displayName: 'Technical – Reviews of accounting data, MIS and statutory workings as defined, Hands on Accounting Software - Tally, Zoho, Xero + Excel + Compliances Portal + Other Apps & Tools Statutory & Accounting Knowledge updated' },
{internalName: 'APExecutiveQuestion1', displayName: 'Should have worked with USA clients' },
{internalName: 'APExecutiveQuestion2', displayName: 'Receiving/downloading vendor invoices on behalf of clients' },
{internalName: 'APExecutiveQuestion3', displayName: 'Validating the invoices against Purchase Order' },
{internalName: 'APExecutiveQuestion4', displayName: 'Sharing mismatched/ disputed invoices with vendors for correction' },
{internalName: 'APExecutiveQuestion5', displayName: 'Issuing matching invoices for approval as per Approval Matrix' },
{internalName: 'APExecutiveQuestion6', displayName: 'Following up for approvals' },
{internalName: 'APExecutiveQuestion7', displayName: 'Booking duly approved invoices in the AP System / Books of accounts' },
{internalName: 'APExecutiveQuestion8', displayName: 'Issuing AP payment list as per vendor credit period' },
{internalName: 'APExecutiveQuestion9', displayName: 'Liaising with vendors and attending to vendor queries if any' },
{internalName: 'TLBookkeepingQuestion1', displayName: 'Have handled the portfolio of clients – at least 5' },
{internalName: 'TLBookkeepingQuestion2', displayName: 'Technical – Hands-on experience in QBO Online and Desktop, Experience in Month closing, Reporting is necessary, Other app exposure like Bill.com, Dext etc,' },
{internalName: 'USAccountantQuestion1', displayName: 'To categorize bank feed transactions, To receive payments against invoices issued, To match bank receipts against open invoices ,To reconcile bank transactions for the month ,To reconcile credit card transactions for the month' },
{internalName: 'AccountantQuestion2', displayName: 'Accounting domain knowledge' },
{internalName: 'AccountantQuestion1', displayName: '3 years experience in Accounting' },
{internalName: 'AccountantQuestion3', displayName: 'Compliances portals Knowledge' },
{internalName: 'AccountantQuestion4', displayName: 'Attention to details' },
{internalName: 'AccountantQuestion5', displayName: 'knowledge of Statutory Audit, Bank Audit and Income Tax Assessment and Scrutiny' },
{internalName: 'DeputyTL1', displayName: 'Have handled the portfolio of clients – at least 2-3' },
{internalName: 'DeputyTL2', displayName: 'Have atleast handled 2 team members' },
]


var checklistFields=[
    { internalName: 'JobPost', displayName: 'Job Post' },
    { internalName: 'Candidate', displayName: 'Candidate' },
    { internalName: 'JobRole', displayName: 'Job Role' },
    { internalName: 'AccQue1', displayName: 'Work Format' },
    { internalName: 'AccQue3', displayName: 'Shift Timings and working days' },
    { internalName: 'AccQue6', displayName: 'Notice period (in months)' },
    { internalName: 'AccQue8', displayName: 'Family Background' },
    { internalName: 'AccQue10', displayName: 'Percentage in 10,12 & graduation' },
    { internalName: 'TLQue2', displayName: 'Presentable, Camera friendly – Video meeting orientation' },
    { internalName: 'AccQue2', displayName: 'Location proximity' },
    { internalName: 'AccQue4', displayName: 'Ready to stretch the shift timing' },
    { internalName: 'AccQue5', displayName: 'Ready to travel to client location' },
    { internalName: 'AccQue7', displayName: 'Communication skills' },
    { internalName: 'AccQue9', displayName: 'Reason for job change' },
    { internalName: 'TLQue1', displayName: 'Shift Timing' },
    { internalName: 'USACCQue1', displayName: 'Presentable and good email etiquette' }
]

var casObjectField = [
    {
        SectionName: 'Deliver on Client Engagement',
        Fields: [
            { internalName: 'TLDomesticAccR1Skill1', displayName: 'Domain and Tally/Zoho Expertise' },
            { internalName: 'TLDomesticAccR1Skill2', displayName: 'Managing Escalations – Conflict Management, Solution driven' },
            { internalName: 'TLDomesticAccR1Skill3', displayName: 'Organisational Skills – Multiple team and client management' },
            { internalName: 'TLDomesticAccR1Skill4', displayName: 'Attention to detail  And ability to prioritize the task(Timely delivery with desired accuracy)' },
            { internalName: 'TLUSAccR1Skill1', displayName: 'Domain Expertise - GAAP and Month Closing & Financial Reporting' },
            { internalName: 'TLUSAccR1Skill2', displayName: 'Tech Expertise - QBO, Dext, Accounting Practice Management like Financial Cents, Canopy etc.' },
            { internalName: 'TLUSAccR1Skill3', displayName: 'Managing Escalations – Problem Solving, Adaptability & Resilience' },
            { internalName: 'DeputyTL1', displayName: 'Domain and QBO Expertise ( Hands on experience on QB categorization, reconciliation and month closing is non negotiable )' },
            { internalName: 'DeputyTL2', displayName: 'Ability to manage regular / routine communications with client via video meetings' },
            { internalName: 'DeputyTL3', displayName: 'Managing Escalations – How escalation was handled / What process change was done?' }
        ]
    },
    {
        SectionName: 'Timely Deliver of MIS & Reports',
        Fields: [
            { internalName: 'AccManagerDomesticR1Skill1', displayName: 'Accounting Domain expertise' },
            { internalName: 'AccManagerDomesticR1Skill2', displayName: 'Technology and Accounting Software proficiency(Tally, Zoho & Excel)' },
            { internalName: 'AccManagerDomesticR1Ski', displayName: 'Process orientation' },
            { internalName: 'USAPExecutiveR1Skill1', displayName: 'Effective and clear Communication' },
            { internalName: 'USAPExecutiveR1Skill2', displayName: 'Proactive and accountable' },

        ]
    },
    {
        SectionName: 'Team Management  and Nurturing',
        Fields: [
            { internalName: 'TLDomesticAccR2Skill1', displayName: 'Ability to objectively review candidate Performance – Assessment Skills ?' },
            { internalName: 'TLDomesticAccR2Skill2', displayName: 'Manage Team Relationship – Communication, interpersonal skill, Nurturing' },
            { internalName: 'TLDomesticAccR2Skill3', displayName: 'Effective Delegation and Monitoring' },
            { internalName: 'TLDomesticAccR2Skill4', displayName: 'Analytical Skills (Reviews of accounting data and MIS ) Compliance expertise' },
            { internalName: 'DeputyTL4', displayName: 'Manage Team Relationship – Training new team members, query resolution etc' },
            { internalName: 'DeputyTL5', displayName: 'Review of work done by other team members ( Categorisation and reconciliation review + Month close and financial reporting Review )' },
        ]
    },
    {
        SectionName: 'Excellent Client Rapport',
        Fields: [
            { internalName: 'TLDomesticAccR3Skill1', displayName: 'Client Servicing orientation' },
            { internalName: 'TLUSAccR2Skill1', displayName: 'Relationship Builder' },
            { internalName: 'TLUSAccR2Skill2', displayName: 'Customer focus' },
            { internalName: 'TLUSAccR2Skill3', displayName: 'Commercial Sense' },

        ]
    },
    {
        SectionName: 'Contribute on Process and SOP development',
        Fields: [
            { internalName: 'TLDomesticAccR4Skill1', displayName: 'Systematic thinking and process approach' },
            { internalName: 'TLDomesticAccR4Skill2', displayName: 'Open to learn new things' },
            { internalName: 'TLUSAccR4Skill1', displayName: 'Identify need and designing of SOP that is effective' },
            { internalName: 'TLUSAccR4Skill2', displayName: 'Identify need for Training and ability to train their team' },
            { internalName: 'DeputyTL6', displayName: 'Experience of preparing SOPs' },
            { internalName: 'DeputyTL7', displayName: 'Ability to address problem with process oriented approach' },

        ]
    },
    {
        SectionName: 'Accounting Knowledge and accuracy',
        Fields: [
            { internalName: 'USAPExecutiveR2Skill1', displayName: 'Domain Expertise' },
            { internalName: 'USAPExecutiveR2Skill2', displayName: 'Attention to detail' },
            { internalName: 'USAccManagerR1Skill1', displayName: 'Domain and QBO Expertise' },

        ]
    },
    {
        SectionName: 'Organisational Skills',
        Fields: [
            { internalName: 'USAPExecutiveR3Skill1', displayName: 'Time management' },
            { internalName: 'USAPExecutiveR3Skill2', displayName: 'Multitasking' },
            { internalName: 'USAPExecutiveR3Skill3', displayName: 'Ability to set the priorities' },

        ]
    },
    {
        SectionName: 'Client Satisfaction',
        Fields: [
            { internalName: 'USAPExecutiveR4Skill1', displayName: 'Responsiveness' },
            { internalName: 'USAccManagerR4Skill1', displayName: 'Proactive and accountable' },
            { internalName: 'AccManagerDomesticR4Ski', displayName: 'Handling escalation professionally' },
            { internalName: 'AccManagerDomesticR4Skill2', displayName: 'Ability to set the priorities' },

        ]
    },
    {
        SectionName: 'Personality Assessment',
        Fields: [
            { internalName: 'USAPExecutiveR5Skill1', displayName: 'Confidence in communication' },
            { internalName: 'USAPExecutiveR5Skill2', displayName: 'Clarity in communication' },
            { internalName: 'USAPExecutiveR5Skill3', displayName: 'Good energy levels' },
            { internalName: 'USAPExecutiveR5Skill4', displayName: 'Growth mind set' },

        ]
    },
    {
        SectionName: 'On Time Compliance',
        Fields: [
            { internalName: 'AccManagerDomesticR2Ski', displayName: 'Compliances portals Knowledge (GST ,TDS, & income tax)' },
            { internalName: 'AccManagerDomesticR2Skill2', displayName: 'Effective and clear Communication' },
            { internalName: 'AccManagerDomesticR2Skill3', displayName: 'Proactive and accountable' },

        ]
    },
    {
        SectionName: 'Accuracy in Accounting and Compliances',
        Fields: [
            { internalName: 'AccManagerDomesticR3Skill1', displayName: 'Knowledge of statutory amendments' },
            { internalName: 'AccManagerDomesticR3Skill2', displayName: 'Attention to details(MIS checklist)' },
        ]
    },
    {
        SectionName: 'Please share your additional feedback',
        Fields: [
            { internalName: 'Comment', displayName: 'Comment' },

        ]
    },
]
var casArrayFormobject = casObjectField

function showRoleFields() {
    return [
        {
            Fields: ["USAPExecutiveR2Skill2", "USAccManagerR1Skill1", "AccManagerDomesticR1Ski", "USAPExecutiveR1Skill1", "USAPExecutiveR1Skill2", "USAPExecutiveR3Skill1", "USAPExecutiveR3Skill2", "USAPExecutiveR3Skill3", "USAccManagerR4Skill1", "USAPExecutiveR4Skill1", "USAPExecutiveR5Skill1", "USAPExecutiveR5Skill2", "USAPExecutiveR5Skill3", "USAPExecutiveR5Skill4", "Comment"],
            JobRole: 'US Accountant'
        },
        {
            Fields: ["USAPExecutiveR2Skill2", "USAccManagerR1Skill1", "AccManagerDomesticR1Ski", "USAPExecutiveR1Skill1", "USAPExecutiveR1Skill2", "USAPExecutiveR3Skill1", "USAPExecutiveR3Skill2", "USAPExecutiveR3Skill3", "USAccManagerR4Skill1", "USAPExecutiveR4Skill1", "USAPExecutiveR5Skill1", "USAPExecutiveR5Skill2", "USAPExecutiveR5Skill3", "USAPExecutiveR5Skill4", "Comment"],
            JobRole: 'Sr. US Accountant'
        },
        {
            Fields: ["USAPExecutiveR2Skill2", "USAccManagerR1Skill1", "AccManagerDomesticR1Ski", "USAPExecutiveR1Skill1", "USAPExecutiveR1Skill2", "USAPExecutiveR3Skill1", "USAPExecutiveR3Skill2", "USAPExecutiveR3Skill3", "USAccManagerR4Skill1", "USAPExecutiveR4Skill1", "USAPExecutiveR5Skill1", "USAPExecutiveR5Skill2", "USAPExecutiveR5Skill3", "USAPExecutiveR5Skill4", "Comment"],
            JobRole: 'US Bookkeeper'
        },
        {
            Fields: ["TLDomesticAccR1Skill1", "TLDomesticAccR1Skill2", "TLDomesticAccR1Skill3", "TLDomesticAccR1Skill4", "TLDomesticAccR2Skill1", "TLDomesticAccR2Skill2", "TLDomesticAccR2Skill3", "TLDomesticAccR2Skill4", "TLDomesticAccR3Skill1", "TLDomesticAccR4Skill1", "TLDomesticAccR4Skill2", "Comment"],
            JobRole: 'TL-Domestic Accounting'
        },
        {
            Fields: ["AccManagerDomesticR1Skill1", "AccManagerDomesticR1Skill2", "AccManagerDomesticR1Ski", "AccManagerDomesticR2Ski", "AccManagerDomesticR2Skill2", "AccManagerDomesticR2Skill3", "AccManagerDomesticR3Skill1", "AccManagerDomesticR3Skill2", "USAPExecutiveR4Skill1", "AccManagerDomesticR4Ski", "AccManagerDomesticR4Skill2", "Comment"],
            JobRole: 'Accountant'
        },
        {
            Fields: ["TLUSAccR1Skill1", "TLUSAccR1Skill2", "TLUSAccR1Skill3", "TLDomesticAccR1Skill3", "TLDomesticAccR2Skill1", "TLDomesticAccR2Skill2", "TLDomesticAccR2Skill3", "TLUSAccR2Skill1", "TLUSAccR2Skill2", "TLUSAccR2Skill3", "TLUSAccR4Skill1", "TLUSAccR4Skill2", "Comment"],
            JobRole: 'TL Bookkeeping'
        },
        {
            Fields: ["USAPExecutiveR2Skill1", "USAPExecutiveR2Skill2", "AccManagerDomesticR1Ski", "USAPExecutiveR1Skill1", "USAPExecutiveR1Skill2", "USAPExecutiveR3Skill1", "USAPExecutiveR3Skill2", "USAPExecutiveR3Skill3", "USAPExecutiveR4Skill1", "USAPExecutiveR5Skill1", "USAPExecutiveR5Skill2", "USAPExecutiveR5Skill3", "USAPExecutiveR5Skill4", "Comment"],
            JobRole: 'AP Executive'
        },
        {
            Fields: ["TLUSAccR1Skill1", "TLUSAccR1Skill2", "TLUSAccR1Skill3", "TLDomesticAccR1Skill3", "TLDomesticAccR2Skill1", "TLDomesticAccR2Skill2", "TLDomesticAccR2Skill3", "TLUSAccR2Skill1", "TLUSAccR2Skill2", "TLUSAccR2Skill3", "TLUSAccR2Skill2", "TLUSAccR4Skill1", "TLUSAccR4Skill2", "Comment"],
            JobRole: 'TL/Clients Relationship Manager'
        },
        {
            Fields: ["USAccManagerR1Skill1", "USAPExecutiveR2Skill2", "AccManagerDomesticR1Ski", "USAPExecutiveR1Skill1", "USAPExecutiveR1Skill2", "USAPExecutiveR3Skill1", "USAPExecutiveR3Skill2", "USAPExecutiveR3Skill3", "USAPExecutiveR4Skill1", "USAccManagerR4Skill1", "USAPExecutiveR5Skill1", "USAPExecutiveR5Skill2", "USAPExecutiveR5Skill3", "USAPExecutiveR5Skill4", "Comment"],
            JobRole: 'Jr. US Bookkeeper'
        },
        {
            Fields: ["AccManagerDomesticR1Skill1", "AccManagerDomesticR1Skill2", "AccManagerDomesticR1Ski", "AccManagerDomesticR2Ski", "AccManagerDomesticR2Skill2", "AccManagerDomesticR2Skill3", "AccManagerDomesticR3Skill1", "AccManagerDomesticR3Skill2", "USAPExecutiveR4Skill1", "AccManagerDomesticR4Ski", "AccManagerDomesticR4Skill2", "Comment"],
            JobRole: 'Jr. Accountant'
        },
        {
            Fields: ["DeputyTL1", "DeputyTL2", "DeputyTL3", "DeputyTL4", "DeputyTL5", "DeputyTL6", "DeputyTL7", "USAPExecutiveR5Skill1", "USAPExecutiveR5Skill2", "USAPExecutiveR5Skill3", "USAPExecutiveR5Skill4", "Comment"],
            JobRole: 'Deputy TL'
        },
        {
            Fields: ["USAPExecutiveR2Skill1", "USAPExecutiveR2Skill2", "AccManagerDomesticR1Ski", "USAPExecutiveR1Skill1", "USAPExecutiveR1Skill2", "USAPExecutiveR3Skill1", "USAPExecutiveR3Skill2", "USAPExecutiveR3Skill3", "USAPExecutiveR4Skill1", "USAPExecutiveR5Skill1", "USAPExecutiveR5Skill2", "USAPExecutiveR5Skill3", "USAPExecutiveR5Skill4", "Comment"],
            JobRole: 'AP Associate'
        },
    ]
}
var guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g;


let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        user = getCurrentUser()
        
        window.localStorage.setItem('ma',"qaffirst.quickappflow.com")
        getJobPosting()
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
    let list = 'Candidate,Comment,AccManagerDomesticR1Skill1,TLDomesticAccR1Skill2,USAPExecutiveR2Skill1,USAPExecutiveR3Skill1,USAPExecutiveR4Skill1,TLDomesticAccR2Skill1,TLDomesticAccR3Skill1,TLDomesticAccR4Skill1,USAPExecutiveR5Skill1,AccManagerDomesticR2Ski,AccManagerDomesticR3Skill1,AccManagerDomesticR3Skill2,AccManagerDomesticR2Skill2,USAPExecutiveR5Skill2,TLDomesticAccR4Skill2,TLUSAccR2Skill1,TLDomesticAccR2Skill2,USAccManagerR4Skill1,USAPExecutiveR3Skill2,USAPExecutiveR2Skill2,TLDomesticAccR1Skill3,AccManagerDomesticR1Skill2,JobPost,JobRole,AccManagerDomesticR1Ski,TLDomesticAccR1Skill4,USAccManagerR1Skill1,USAPExecutiveR3Skill3,AccManagerDomesticR4Ski,TLDomesticAccR2Skill3,TLUSAccR2Skill2,TLUSAccR4Skill1,USAPExecutiveR5Skill3,AccManagerDomesticR2Skill3,USAPExecutiveR5Skill4,TLUSAccR4Skill2,TLUSAccR2Skill3,TLDomesticAccR2Skill4,AccManagerDomesticR4Skill2,TLUSAccR1Skill1,USAPExecutiveR1Skill1,Interviwer,InterviewRound,DeputyTL6,TLUSAccR1Skill2,DeputyTL4,USAPExecutiveR1Skill2,TLUSAccR1Skill3,IsApproved,DeputyTL7,DeputyTL5,DeputyTL1,DeputyTL2,DeputyTL3,TLDomesticAccR1Skill1'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(JobPost='${jobID}')<<NG>>(IsApproved='True')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((casDetails) => {
        this.casObjectField.forEach(val => {
            if (val.SectionName != 'Personal Information') {
                let fields = val.Fields
                fields.forEach(field => {
                    if (showFieldsCAS(field.internalName, jobRole)) {
                        let firstRound = []
                        let secondRound = []
                        let thirdRound = []
                        let screeningRound = []
                        if (casDetails) {
                            firstRound = casDetails.filter(a => a.InterviewRound === "1");
                            secondRound = casDetails.filter(a => a.InterviewRound === "2");
                            thirdRound = casDetails.filter(a => a.InterviewRound === "3");
                            screeningRound = casDetails.filter(a => a.InterviewRound === "Screening Round");
                        }
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
                    }
                })
            }
        })
        createTable(casArray)
    })
}
function createTable(objectArray) {
    let body = document.getElementById('casid');
    let tbl = document.createElement('table');
    let thead = document.createElement('thead');
    let thr = document.createElement('tr');
    let tableHeads = ["Responsibilities", "Skill Required", "Round 1", "Round 2", "Round 3"]
    for (let i = 0; i <= tableHeads.length - 1; i++) {
        let th = document.createElement('th');
        if (tableHeads[i] === "Round 1" || tableHeads[i] === "Round 2" || tableHeads[i] === "Round 3") {
            th.className = "round-head"
        }
        th.appendChild(document.createTextNode(tableHeads[i]));
        thr.appendChild(th);
    }
    thead.appendChild(thr);
    tbl.appendChild(thead);
    let tbdy = document.createElement('tbody');
    let tempresponsibilities = []
    objectArray.forEach((object, index) => {
        if (tempresponsibilities.length > 0) {
            if (tempresponsibilities.indexOf(object['Responsibilities']) === -1) {
                tempresponsibilities = []
                tempresponsibilities.push(object['Responsibilities'])
            } else {
                tempresponsibilities.push(object['Responsibilities'])
            }
        } else {
            tempresponsibilities.push(object['Responsibilities'])
        }

        let n = 0;
        let tr = document.createElement('tr');
        let headerNames = ["Responsibilities", "skillrequired", "firstInterview", "secondInterview", "thirdInterview"]
        for (let obj = 0; obj <= headerNames.length - 1; obj++) {
            if (headerNames[obj] === 'Responsibilities') {
                if (tempresponsibilities.length === 1) {
                    let elemRowSpan = objectArray.filter(a => a.Responsibilities === object[headerNames[obj]])
                    let td = document.createElement('td');
                    td.setAttribute('rowSpan', elemRowSpan.length);
                    td.appendChild(document.createTextNode(object[headerNames[obj]]));
                    tr.appendChild(td);
                }
            } else {
                let td = document.createElement('td');
                td.setAttribute('title', object[headerNames[obj]]);
                if (headerNames[obj] === 'skillrequired') {
                    td.appendChild(document.createTextNode(object[headerNames[obj]]));
                    tr.appendChild(td);
                }else{
                    td.appendChild(document.createTextNode(object[headerNames[obj]]&&object[headerNames[obj]].length>30?object[headerNames[obj]].substring(0,30)+"...":object[headerNames[obj]]));
                    tr.appendChild(td);
                }
              
            }
        };
        tbdy.appendChild(tr);
    });
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}
function openTab(evt, id) {
    debugger
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
    if (id === 'form') {
        document.getElementById('section-hr').style.display='block'
        document.getElementById('section-hr').style.display='block'
        getInterviewDetails();
        getSingleCheckList(id)
        if(round==1){
            getSingleNonnegotiableList(id)
            getSingleCheckList(id)
        }else{
            document.getElementById('section-hr').style.display='none'
            document.getElementById('section-hr').style.display='none'
        }

    }
    debugger
    if (id === 'QBFeedback') {
        //     document.getElementById("UploadResume").disabled = false;
        // if(round!='1'){
            document.getElementById('deleteicon').style.display='none'
            document.getElementById("UploadResume").disabled = true;
        // }
        getJobTracker()
    }
}

function createForm(singlecasDetails) {

    var down = document.getElementById("formID");
    var br = document.createElement("br");
    // Create a form dynamically
    var presentform = document.getElementById('casForm');
    if (presentform) {
        document.body.removeChild(presentform);
    }
    var formCreate = document.createElement("form");

    formCreate.setAttribute("method", "post");
    formCreate.setAttribute("id", "casForm");
    form = document.getElementById('casForm');
    newcasObjectForm = showFieldsForm(casArrayFormobject)
    newcasObjectForm.forEach(val => {
        if (val.Fields && val.Fields.length > 0) {
            var sectionLabel = document.createElement('label');
            var sectionNode = document.createTextNode(val.SectionName);

            sectionLabel.setAttribute("for", val.SectionName);
            sectionLabel.className = "section-name"
            sectionLabel.appendChild(sectionNode)
            formCreate.appendChild(sectionLabel)
            newFormFields = val.Fields
            var sectionWrapper = document.createElement('div');
            sectionWrapper.className = "section-wrapper"
            for (var i = 0; i < newFormFields.length; i++) {

                itemName = newFormFields[i];
                var newLabel = document.createElement('label');
                var t = document.createTextNode(itemName.displayName);
                newLabel.setAttribute("for", itemName.internalName);
                sectionWrapper.appendChild(t)

                if (newFormFields[i].internalName === "Comment") {
                    var radioWrapper = document.createElement('div');
                    radioWrapper.className = "radioWrapper"
                    var input = document.createElement('textarea');
                    input.name = itemName.internalName;
                    input.maxLength = 5000;
                    input.cols = 95;
                    input.rows = 5;
                    input.className = 'myCustomTextarea';
                    if (singlecasDetails && singlecasDetails.RecordID) {
                        if (singlecasDetails[itemName.internalName]) {
                            input.value = singlecasDetails[itemName.internalName]
                        }
                    }
                    radioWrapper.append(input)
                    sectionWrapper.appendChild(radioWrapper);
                }
                else {
                    let OptionArray = [
                        "1-Poor",
                        "2-Weak",
                        "3-Workable",
                        "4-Good",
                        "5-Strength",
                    ]
                    var radioWrapper = document.createElement('div');
                    radioWrapper.className = "radioWrapper"
                    for (var options = 0; options < (OptionArray.length); options++) {
                        var divElement = document.createElement('div');
                        divElement.className = "radionElement"
                        var newRadio = document.createElement('input');
                        newRadio.type = 'radio';
                        newRadio.id = itemName.internalName;
                        newRadio.name = itemName.internalName;
                        newRadio.value = OptionArray[options];
                        if (singlecasDetails && singlecasDetails.RecordID) {
                            if (singlecasDetails[itemName.internalName] === OptionArray[options]) {
                                newRadio.checked = true
                            }
                        }
                        var newLabel2 = document.createElement('label');
                        var t1 = document.createTextNode(OptionArray[options]);
                        newLabel2.setAttribute("for", OptionArray[options]);
                        divElement.appendChild(newRadio);
                        divElement.appendChild(t1)
                        radioWrapper.append(divElement)
                        sectionWrapper.appendChild(radioWrapper);
                    }
                }
                formCreate.appendChild(sectionWrapper)

            }
        }
    })
    // create a submit button
    var s = document.createElement("input");
    s.setAttribute("type", "submit");
    s.setAttribute("value", "Submit");
    s.setAttribute("class", "qaf-btn-primary submit-button");
    // document.getElementById('button-submit').appendChild(s)

    // formCreate.appendChild(br.cloneNode());

    // Append the submit button to the form
    formCreate.appendChild(s);
    down.appendChild(formCreate);
    submitForm()
}
function submitForm() {
    var form = document.getElementById('casForm');
    form && form.addEventListener('submit', (event) => {

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
            if (interviewDetails) {
                submitFormObject['Candidate'] = interviewDetails['Candidate']
                submitFormObject['JobPost'] = interviewDetails['AppliedForJob']
                submitFormObject['JobRole'] = interviewDetails['JobRole']
                submitFormObject['Interviwer'] = interviewDetails['Interviewer']
                submitFormObject['InterviewRound'] = interviewDetails['InterviewRound']
            }
        }

        newcasObjectForm.forEach(val => {
            if (val.Fields && val.Fields.length > 0) {
                val.Fields.forEach(field => {
                    submitFormObject[field.internalName] = form.elements[field.internalName].value
                })
            }
        })
        saveForm(submitFormObject)
    });
}
function saveForm(submitFormObject) {
    var form = document.getElementById('casForm');
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
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        if (submitFormObject.RecordID) {
            intermidiateRecord.RecordID = submitFormObject.RecordID;
            window.QafService.UpdateItem(intermidiateRecord).then(response => {
                var event = new CustomEvent('closeIframe')
                window.parent.document.dispatchEvent(event)
                form.reset();
                resolve({
                    response
                })
            });
        } else {
            intermidiateRecord.RecordID = null;
            window.QafService.CreateItem(intermidiateRecord).then(response => {
                var event = new CustomEvent('closeIframe')
                window.parent.document.dispatchEvent(event)
                form.reset();
                resolve({
                    response
                })
            });
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
function getSingleCasDetails() {
    let objectName = "CAS";
    let list = 'Candidate,Comment,AccManagerDomesticR1Skill1,TLDomesticAccR1Skill2,USAPExecutiveR2Skill1,USAPExecutiveR3Skill1,USAPExecutiveR4Skill1,TLDomesticAccR2Skill1,TLDomesticAccR3Skill1,TLDomesticAccR4Skill1,USAPExecutiveR5Skill1,AccManagerDomesticR2Ski,AccManagerDomesticR3Skill1,AccManagerDomesticR3Skill2,AccManagerDomesticR2Skill2,USAPExecutiveR5Skill2,TLDomesticAccR4Skill2,TLUSAccR2Skill1,TLDomesticAccR2Skill2,USAccManagerR4Skill1,USAPExecutiveR3Skill2,USAPExecutiveR2Skill2,TLDomesticAccR1Skill3,AccManagerDomesticR1Skill2,JobPost,JobRole,AccManagerDomesticR1Ski,TLDomesticAccR1Skill4,USAccManagerR1Skill1,USAPExecutiveR3Skill3,AccManagerDomesticR4Ski,TLDomesticAccR2Skill3,TLUSAccR2Skill2,TLUSAccR4Skill1,USAPExecutiveR5Skill3,AccManagerDomesticR2Skill3,USAPExecutiveR5Skill4,TLUSAccR4Skill2,TLUSAccR2Skill3,TLDomesticAccR2Skill4,AccManagerDomesticR4Skill2,TLUSAccR1Skill1,USAPExecutiveR1Skill1,Interviwer,InterviewRound,DeputyTL6,TLUSAccR1Skill2,DeputyTL4,USAPExecutiveR1Skill2,TLUSAccR1Skill3,IsApproved,DeputyTL7,DeputyTL5,DeputyTL1,DeputyTL2,DeputyTL3,TLDomesticAccR1Skill1'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(JobPost='${jobID}')<<NG>>(InterviewRound='${round}')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((details) => {
        if (Array.isArray(details) && details.length > 0) {
            singlecasDetails = details[0]
            createForm(singlecasDetails)
        } else {
            createForm()
        }
    });
}
function getInterviewDetails() {
    interviewDetails = null
    let objectName = "Interview_Detail";
    let list = 'Candidate,AppliedForJob,Interviewer,JobRole,InterviewRound,JobRole'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(AppliedForJob='${jobID}')<<NG>>(InterviewRound='${round}')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((details) => {
        if (Array.isArray(details) && details.length > 0) {
            interviewDetails = details[0];
            getSingleCasDetails()
        } else {
            getSingleCasDetails()
        }
    });

}
function showFieldsCAS(internalName, jobRole) {

    let showFieldList = this.showRoleFields()
    let showField = showFieldList.find(a => a.JobRole.toLowerCase() === jobRole.toLowerCase());
    if (showField && showField.JobRole) {
        let isFieldPresent = showField.Fields.filter(field => field.toLowerCase() === internalName.toLowerCase());
        if (isFieldPresent && isFieldPresent.length > 0) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }

}
function getJobPosting() {
    for (const li of Object.values(document.getElementsByClassName('tablinks'))) {
        li.classList.add('displaynone')
  }
    let objectName = "Job_Posting";
    let list = 'RecordID,JobLevel,JobTitle,JobID'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `RecordID='${jobID}'`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobs) => {
        if (Array.isArray(jobs) && jobs.length > 0) {
            jobpostingDetails=jobs[0]
            jobRole = (jobs[0].JobLevel).split(";#")[1];
            jobRolewithguid = (jobs[0].JobLevel)
            let showFieldList = showRoleFields()
    let showField = showFieldList.find(a => a.JobRole.toLowerCase() === jobRole.toLowerCase());
    if(showField&&showField.Fields.length>0){
        for (const li of Object.values(document.getElementsByClassName('tablinks'))) {
            li.classList.remove('displaynone')
      }
      document.getElementById('tab1').classList.add('active')
        getCandidate();
        getCasDetails();
        getSingleCheckList()
        getSingleNonnegotiableList()
    }
     else{
        debugger
        let casTab=document.getElementById('cas-tab')
        if(casTab){
            // casTab.innerHTML=`<p class='error-role'>Feedback not configure for ${jobRole}</p>`
            document.getElementById('tab1').style.display='none'
            document.getElementById('tab2').style.display='none'
            document.getElementById('tab3').classList.add('active')
        }
        let index=0
        for (const li of Object.values(document.getElementsByClassName('tablinks'))) {
            index+=1
            if(index!=3){
                document.getElementById('table').style.display = "none";
                li.classList.add('displaynone')
            }  else{
                document.getElementById('QBFeedback').style.display = "block";

                li.classList.remove('displaynone')
                document.getElementById('deleteicon').style.display='none'
                document.getElementById("UploadResume").disabled = true;
        getJobTracker()

            } 
          }
     }
        }
    });

}
function getCandidate() {
    let objectName = "Candidate";
    let list = 'RecordID,FirstName,LastName'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `RecordID='${customerID}'`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((candidates) => {
        if (Array.isArray(candidates) && candidates.length > 0) {
            candidateDetails=candidates[0]
        }
    });

}
function showFieldsForm(casArrayFormobject) {

    let showFieldList = showRoleFields()
    let showField = showFieldList.find(a => a.JobRole.toLowerCase() === jobRole.toLowerCase());
    casArrayFormobject.forEach(val => {
        val.Fields = val.Fields.filter((objOne) => {
            return showField.Fields.some((objTwo) => {
                return objOne.internalName === objTwo;
            });
        });
    })
    return casArrayFormobject
}

function getSingleCheckList(id) {
    let hrchecklist = document.getElementById(id ? 'hrchecklist-form' : 'hrchecklist');
    if (hrchecklist) {
        hrchecklist.innerHTML = ``
    }
    let checklistfields=checklistFields.map(a=>a.internalName).join(",")
    let objectName = "HR_Checklist";
    let list = checklistfields
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(JobPost='${jobID}')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((details) => {
        if (Array.isArray(details) && details.length > 0) {
            checklistData = details[0]
            let hrchecklist = document.getElementById(id ? 'hrchecklist-form' : 'hrchecklist');
            if (hrchecklist) {
                let checklistdetails = [];
                details.forEach(val => {
                    for (const [key, value] of Object.entries(val)) {
                        let fieldsDisplay = getCheckListField(jobRole ? jobRole : '')
                        if (fieldsDisplay.indexOf(key) > -1) {
                            checklistdetails.push({ Items: key, Response: value ? formatting(value.toString()) : '' })
                        }
                    }
                })
                let removeData = ["ID", "objectid", "RecordID", "ParentRecordID", "CreatedByGUID", "CreatedDate", "LastModifiedDate", "CreatedByName", "JobPost", "Candidate", "JobRole"]
                checklistdetails = checklistdetails.filter((objOne) => {
                    return !removeData.some((objTwo) => {
                        return objOne.Items === objTwo;
                    });
                });

                let checklistbody = "";
                checklistdetails.forEach(val => {
                    checklistbody += ` <tr>
                    <td class='checklist-td'>${getDisplayName(val.Items)}</td>
                    <td class='checklist-td'>${val.Response}</td>
                </tr>`
                })
                let button = id ? checklistData.RecordID ? `  <div class="header-button">
                <div>
                    <button class="addjob button qaf-btn-primary" onclick="addHRchecklist()">
                    Update 
                    </button>
                </div>
                </div>`: `<div class="header-button">
                <div>
                    <button class="addjob button qaf-btn-primary" onclick="addHRchecklist()">
                    <i class="fa-solid fa-plus"></i>  Checklist
                    </button>
                </div>
                </div>`: ''
                hrchecklist.innerHTML = `
                <div class="">
                <header>
                <div class="title">
                <p class='common-page-title'>HR Checklist</p>
                </div>
                ${button}
            </header>
         <div class="tablecontainer">
            <table>
                <thead>
                    <tr>
                        <th class='checklist-th'>Checklist Items</th>
                        <th class='checklist-th'>Response</th>
                    </tr>
                </thead>
                <tbody>
                   ${checklistbody}
                </tbody>
            </table>
        

        </div>
        
        </div>
                `
            }
        }else{
            let hrchecklist = document.getElementById(id ? 'hrchecklist-form' : 'hrchecklist');
            if (hrchecklist) {
                let checklistbody = "";
                    checklistbody += ` <tr>
                    <td class='checklist-td no-record-found' colspan="2">No Feedback Submitted</td>
                </tr>`
                let button = id ? checklistData&&checklistData.RecordID ? `  <div class="header-button">
                <div>
                    <button class="addjob button qaf-btn-primary" onclick="addHRchecklist()">
                   Update 
                    </button>
                </div>
                </div>`: `<div class="header-button">
                <div>
                    <button class="addjob button qaf-btn-primary" onclick="addHRchecklist()">
                    <i class="fa-solid fa-plus"></i>  Checklist
                    </button>
                </div>
                </div>`: ''
                hrchecklist.innerHTML = `
                <div class="">
                <header>
                <div class="title">
                <p class='common-page-title'>HR Checklist</p>
                </div>
                ${button}
            </header>
         <div class="tablecontainer">
            <table>
                <thead>
                    <tr>
                        <th class='checklist-th'>Checklist Items</th>
                        <th class='checklist-th'>Response</th>
                    </tr>
                </thead>
                <tbody>
                   ${checklistbody}
                </tbody>
            </table>
        

        </div>
        
        </div>
                `
            }
        }
    });
}
function getCheckListField(role) {
    let showFieldList = showFieldCheckList();
    let showField = showFieldList.find(a => a.JobRole.toLowerCase() === role.toLowerCase());
    if (showField && showField.JobRole) {
        let fields = [...showField.Fields, 'Candidate', 'JobPost', 'JobRole']
        return fields
    }

}
function showFieldCheckList() {
    return [
        {
            Fields: ["AccQue1", "AccQue2", "AccQue3", "AccQue4", "AccQue5", "AccQue6", "AccQue7", "AccQue8", "AccQue9", "AccQue10"],
            JobRole: 'Accountant'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "TLQue2", "AccQue7", "AccQue8"],
            JobRole: 'TL Bookkeeping'
        },
        {
            Fields: ["AccQue1", "AccQue2", "AccQue3", "AccQue4", "AccQue5", "AccQue6", "AccQue7", "AccQue8", "AccQue9", "AccQue10"],
            JobRole: 'TL-Domestic Accounting'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "USACCQue1", "AccQue7", "AccQue8"],
            JobRole: 'US Accountant'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "USACCQue1", "AccQue7", "AccQue8"],
            JobRole: 'Sr. US Accountant'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "USACCQue1", "AccQue7", "AccQue8"],
            JobRole: 'US Bookkeeper'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "USACCQue1", "AccQue7", "AccQue8"],
            JobRole: 'AP Executive'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "USACCQue1", "AccQue7", "AccQue8"],
            JobRole: 'AP Associate'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "USACCQue1", "AccQue7", "AccQue8"],
            JobRole: 'Jr. US Bookkeeper'
        },
        {
            Fields: ["AccQue1", "AccQue2", "AccQue3", "AccQue4", "AccQue5", "AccQue6", "AccQue7", "AccQue8", "AccQue9", "AccQue10"],
            JobRole: 'Jr. Accountant'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "TLQue2", "AccQue7", "AccQue8"],
            JobRole: 'Deputy TL'
        },
        {
            Fields: ["AccQue1", "AccQue2", "TLQue1", "AccQue6", "TLQue2", "AccQue7", "AccQue8"],
            JobRole: 'TL/Clients Relationship Manager'
        },
    ]
}

function getDisplayName(internalName) {
    let checklist = checklistFields.find(a => a.internalName === internalName)
    if (checklist && checklist.internalName) {
        return checklist.displayName
    }
    return ""
}

function addHRchecklist() {

    let fields = [];
    checklistFields.forEach((ele) => {
      fields.push(ele.internalName)
    })
    let fieldsValue= [];
    let fieldsDoNotdiaply = [];
    let fieldsDisplay = getCheckListField(this.jobRole)
    fieldsDoNotdiaply = fields.filter((objOne) => {
      return !fieldsDisplay.some((objTwo) => {
        return objOne === objTwo;
      });
    });

    fields = fields.filter((objOne) => {
      return !fieldsDoNotdiaply.some((objTwo) => {
        return objOne === objTwo;
      });
    });
    fields.forEach(val => {
        if (val === 'JobPost') {
            fieldsValue.push({ fieldName: val, fieldValue: jobpostingDetails.RecordID+";#"+jobpostingDetails.JobID+" "+jobpostingDetails.JobTitle })
          } else if (val === 'Candidate') {
            fieldsValue.push({ fieldName: val, fieldValue: candidateDetails.RecordID+";#"+candidateDetails.FirstName+" "+candidateDetails.LastName })
          }
          else if (val === 'JobRole') {
            fieldsValue.push({ fieldName: val, fieldValue: jobRolewithguid })
          }
          else {
            fieldsValue.push({ fieldName: val, fieldValue: null })
          }
    })
    let excludeFieldFromForm = ["CandidateID"]
    let readonlyFromForm= [];
    let readfields = trackerActionFieldsReadonly()
    if (readfields) {
      readonlyFromForm = readfields.split(",")
    }

    if (checklistData && checklistData.RecordID) {
        if (window.QafPageService) {
            window.QafPageService.EditItem("HR_Checklist", checklistData.RecordID, function () {
                getSingleCheckList('form') 
            },fields);
        }
    } else {
        if (window.QafPageService) {
            window.QafPageService.AddItem("HR_Checklist", function () {
                getSingleCheckList('form') 
            },fields,fieldsValue, null, null, fieldsDoNotdiaply, excludeFieldFromForm, null, null, null, null, readonlyFromForm);
        }
    }

}


function getSingleNonnegotiableList(id) {
    let nonnegotiablelist = document.getElementById(id ? 'nonnegotiable-form' : 'nonnegotiable');
    if (nonnegotiablelist) {
        nonnegotiablelist.innerHTML = ``
    }
    let objectName = "Non_Negotiables";
    let list = 'JobPost,Candidate,JobRole,TLQuestion1,TLQuestion2,TLQuestion3,TLQuestion4,TLQuestion5,APExecutiveQuestion1,APExecutiveQuestion2,APExecutiveQuestion3,APExecutiveQuestion4,APExecutiveQuestion5,APExecutiveQuestion6,APExecutiveQuestion7,APExecutiveQuestion8,APExecutiveQuestion9,TLBookkeepingQuestion1,TLBookkeepingQuestion2,USAccountantQuestion1,AccountantQuestion2,AccountantQuestion1,AccountantQuestion3,AccountantQuestion4,AccountantQuestion5,DeputyTL1,DeputyTL2'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(JobPost='${jobID}')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((details) => {
        if (Array.isArray(details) && details.length > 0) {
            nonnegotiablelistData = details[0]
            let nonnegotiablelist = document.getElementById(id ? 'nonnegotiable-form' : 'nonnegotiable');
            if (nonnegotiablelist) {
                let nonlistdetails = [];
                details.forEach(val => {
                    for (const [key, value] of Object.entries(val)) {
                        let fieldsDisplay = getNonnegotiableField(jobRole ? jobRole : '')
                        if (fieldsDisplay.indexOf(key) > -1) {
                            nonlistdetails.push({ Items: key, Response: value ? formatting(value.toString()) : '' })
                        }
                    }
                })
                let removeData = ["ID", "objectid", "RecordID", "ParentRecordID", "CreatedByGUID", "CreatedDate", "LastModifiedDate", "CreatedByName", "JobPost", "Candidate", "JobRole"]
                nonlistdetails = nonlistdetails.filter((objOne) => {
                    return !removeData.some((objTwo) => {
                        return objOne.Items === objTwo;
                    });
                });

                let checklistbody = "";
                nonlistdetails.forEach(val => {
                    checklistbody += ` <tr>
                    <td class='checklist-td'>${getDisplayNameNonnegotiable(val.Items)}</td>
                    <td class='checklist-td'>${val.Response}</td>
                </tr>`
                })
                let button = id ? nonnegotiablelistData.RecordID ? `  <div class="header-button">
                <div>
                    <button class="addjob button qaf-btn-primary" onclick="nonnegotitableAction()">
                     Update 
                    </button>
                </div>
                </div>`: `<div class="header-button">
                <div>
                    <button class="addjob button qaf-btn-primary" onclick="nonnegotitableAction()">
                    <i class="fa-solid fa-plus"></i>  Negotiable
                    </button>
                </div>
                </div>`: ''
                nonnegotiablelist.innerHTML = `
                <div class="Hrchecklist">
                <header>
                <div class="title">
                <p class='common-page-title'>Non Negotiables</p>
                </div>
                ${button}
            </header>
         <div class="tablecontainer">
            <table>
                <thead>
                    <tr>
                        <th class='checklist-th'>Negotiables Items</th>
                        <th class='checklist-th'>Response</th>
                    </tr>
                </thead>
                <tbody>
                   ${checklistbody}
                </tbody>
            </table>
        

        </div>
        
        </div>
                `
            }
        }else{
            let nonnegotiablelist = document.getElementById(id ? 'nonnegotiable-form' : 'nonnegotiable');
            if (nonnegotiablelist) {
                let checklistbody = "";
                    checklistbody += ` <tr>
                    <td class='checklist-td no-record-found' colspan="2">No Feedback Submitted</td>
                </tr>`
                let button = id ? nonnegotiablelistData&&nonnegotiablelistData.RecordID ? `  <div class="header-button">
                <div>
                    <button class="addjob button qaf-btn-primary" onclick="nonnegotitableAction()">
                     Update 
                    </button>
                </div>
                </div>`: `<div class="header-button">
                <div>
                    <button class="addjob button qaf-btn-primary" onclick="nonnegotitableAction()">
                    <i class="fa-solid fa-plus"></i>  Negotiable
                    </button>
                </div>
                </div>`: ''
                nonnegotiablelist.innerHTML = `
                <div class="Hrchecklist">
                <header>
                <div class="title">
                <p class='common-page-title'>Non Negotiables</p>
                </div>
                ${button}
            </header>
         <div class="tablecontainer">
            <table>
                <thead>
                    <tr>
                        <th class='checklist-th'>Negotiables Items</th>
                        <th class='checklist-th'>Response</th>
                    </tr>
                </thead>
                <tbody>
                   ${checklistbody}
                </tbody>
            </table>
        

        </div>
        
        </div>
                `
            }
        }
    });
}

function getNonnegotiableField(role) {
    let showFieldList = showFieldNonNegotiable();
    let showField = showFieldList.find(a => a.JobRole.toLowerCase() === role.toLowerCase());
    if (showField && showField.JobRole) {
      let fields = [...showField.Fields, 'Candidate', 'JobPost', 'JobRole']
      return fields
    }
  }
 function  showFieldNonNegotiable() {
    return [
      {
        Fields: ["TLQuestion4", "APExecutiveQuestion1", "APExecutiveQuestion2", "APExecutiveQuestion3", "APExecutiveQuestion4", "APExecutiveQuestion5", "APExecutiveQuestion6", "APExecutiveQuestion7", "APExecutiveQuestion8", "APExecutiveQuestion9"],
        JobRole: 'AP Executive'
      },
      {
        Fields: ["TLQuestion4", "APExecutiveQuestion1", "TLBookkeepingQuestion2", "USAccountantQuestion1"],
        JobRole: 'US Accountant'
      },
      {
        Fields: ["TLQuestion4", "APExecutiveQuestion1", "TLBookkeepingQuestion2", "USAccountantQuestion1"],
        JobRole: 'Sr. US Accountant'
      },
      {
        Fields: ["TLQuestion4", "APExecutiveQuestion1", "TLBookkeepingQuestion2", "USAccountantQuestion1"],
        JobRole: 'US Bookkeeper'
      },
      {
        Fields: ["TLQuestion1", "TLQuestion2", "TLQuestion3", "TLQuestion4", "TLQuestion5"],
        JobRole: 'TL-Domestic Accounting'
      }, {
        Fields: ["TLBookkeepingQuestion1", "TLQuestion2", "TLQuestion3", "TLQuestion4", "APExecutiveQuestion1", "TLBookkeepingQuestion2"],
        JobRole: 'TL Bookkeeping'
      }, {
        Fields: ["AccountantQuestion1", "AccountantQuestion2", "AccountantQuestion3", "AccountantQuestion4", "AccountantQuestion5"],
        JobRole: 'Accountant'
      },
      {
        Fields: ["DeputyTL1", "TLQuestion2", "DeputyTL2", "TLQuestion4", "APExecutiveQuestion1", "TLBookkeepingQuestion2"],
        JobRole: 'Deputy TL'
      },
      {
        Fields: ["TLBookkeepingQuestion1", "TLQuestion2", "TLQuestion3", "TLQuestion4", "APExecutiveQuestion1", "TLBookkeepingQuestion2"],
        JobRole: 'TL/Clients Relationship Manager'
      },
      {
        Fields: ["AccountantQuestion1", "AccountantQuestion2", "AccountantQuestion3", "AccountantQuestion4", "AccountantQuestion5"],
        JobRole: 'Jr. Accountant'
      },
      {
        Fields: ["TLQuestion4", "APExecutiveQuestion1", "APExecutiveQuestion2", "APExecutiveQuestion3", "APExecutiveQuestion4", "APExecutiveQuestion5", "APExecutiveQuestion6", "APExecutiveQuestion7", "APExecutiveQuestion8", "APExecutiveQuestion9"],
        JobRole: 'AP Associate'
      },
      {
        Fields: ["TLQuestion4", "APExecutiveQuestion1", "USAccountantQuestion1", "TLBookkeepingQuestion2"],
        JobRole: 'Jr. US Bookkeeper'
      },
    ]
  }
  function getDisplayNameNonnegotiable(internalName) {
    let nonnegotiable = nonnegotiablelistFields.find(a => a.internalName === internalName)
    if (nonnegotiable && nonnegotiable.internalName) {
        return nonnegotiable.displayName
    }
    return ""
}
function nonnegotitableAction() {
    let fields=[]
    nonnegotiablelistFields.forEach(val=>{
        fields.push(val.internalName)
    })
    let fieldsValue = [];
    let fieldsDoNotdiaply = [];

    let fieldsDisplay = getNonnegotiableField(this.jobRole)
    fieldsDoNotdiaply = fields.filter((objOne) => {
      return !fieldsDisplay.some((objTwo) => {
        return objOne === objTwo;
      });
    });

    fields = fields.filter((objOne) => {
      return !fieldsDoNotdiaply.some((objTwo) => {
        return objOne === objTwo;
      });
    });
    fields.forEach(val => {
      if (val === 'JobPost') {
        fieldsValue.push({ fieldName: val, fieldValue: jobpostingDetails.RecordID+";#"+jobpostingDetails.JobID+" "+jobpostingDetails.JobTitle })
      } else if (val === 'Candidate') {
        fieldsValue.push({ fieldName: val, fieldValue: candidateDetails.RecordID+";#"+candidateDetails.FirstName+" "+candidateDetails.LastName })
      }
      else if (val === 'JobRole') {
        fieldsValue.push({ fieldName: val, fieldValue: jobRolewithguid })
      }
      else {
        fieldsValue.push({ fieldName: val, fieldValue: null })
      }
    })
    let excludeFieldFromForm= ["CandidateID"]
    let readfields = trackerActionFieldsReadonly()
    if (readfields) {
      readonlyFromForm = readfields.split(",")
    }

    if (nonnegotiablelistData && nonnegotiablelistData.RecordID) {
        if (window.QafPageService) {
            window.QafPageService.EditItem("Non_Negotiables", nonnegotiablelistData.RecordID, function () {
                getSingleNonnegotiableList('form') 
            },fields);
        }
    } else {
        if (window.QafPageService) {
            window.QafPageService.AddItem("Non_Negotiables", function () {
                getSingleNonnegotiableList('form') 
            },fields,fieldsValue, null, null, fieldsDoNotdiaply, excludeFieldFromForm, null, null, null, null, readonlyFromForm);
        }
    }

}
function trackerActionFieldsReadonly() {
    let fields = ['Candidate', 'JobPost', 'JobRole', 'Interviwer', 'InterviewRound']
    return fields.join(",")
  }

  function onFileChange(event){
    let selectedFiles = event.files;
    let type = selectedFiles[0] && selectedFiles[0].name.substr(selectedFiles[0].name.lastIndexOf('.'), selectedFiles[0].name.length).toLowerCase();
    if (type != ".exe") {
      let recordId = "";
      file = selectedFiles[0];
      filename = file && file.name ?file.name : '';
        attachmentRepoAndFieldName = `Job_Tracker;#QBFeedback`;
        document.getElementById('filename').innerHTML=filename
        document.getElementById('deleteicon').style.display='block'
        uploadAttachment()
    }
  }

  function   uploadAttachment() {
    
    const form = new FormData();
    form.append('file', file, file && file.name);
    form.append("file_type", attachmentRepoAndFieldName);
    form.append("recordID", '');
    fetch(`https://qaffirst.quickappflow.com/Attachment/uploadfile`, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid':EmployeeGUID,
            'Hrzemail': Email
        },
        body:form
    })
        .then(response => response.json())
        .then(fileResponse => {
            attachmentURL=fileResponse.url

            let attachment=[{
                link:fileResponse.url,
                displayName:formateFileName(jobTracker.QBFeedback)
            }]
         let object = {
            QBFeedback: JSON.stringify(attachment),
           };
            update(object, 'Job_Tracker')
        })
  }

  function update(object, repositoryName) {
    return new Promise((resolve) => {
      var recordFieldValueList = [];
      var intermidiateRecord = {}
      
      Object.keys(object).forEach((key, value) => {
        recordFieldValueList.push({
          FieldID: null,
          FieldInternalName: key,
          FieldValue: object[key]
        });
      });
      intermidiateRecord.CreatedByID = EmployeeID;
      intermidiateRecord.CreatedDate = new Date();
      intermidiateRecord.LastModifiedBy = null;
      intermidiateRecord.ObjectID = repositoryName;
      intermidiateRecord.RecordID = jobTracker.RecordID;
      intermidiateRecord.RecordFieldValues = recordFieldValueList;
      window.QafService.UpdateItem(intermidiateRecord).then(response => {
        let applyForm = document.getElementById("popupContainer");
        if (applyForm) {
            applyForm.style.display = 'none'
        }
        resolve({
          response
        })
      });
    }
    )
  
  }
  function deleteFile(index){
    
            let fetchPromise = fetch(`${attachmentAPIURL}/Attachment/deletefile?fileUrl=${attachmentURL}&recordID=${jobTracker.RecordID}`, {
                method: 'POST',
                headers: {
                    'Host': 'demtis.quickappflow.com',
                    'Employeeguid':EmployeeGUID,
                    'Hrzemail': Email
                },
            })
                .then(response => response.json())
                .then(fileResponse => {
                    attachmentURL=""
                    filename=""
                   document.getElementById('deleteicon').style.display='none'
                   document.getElementById('filename').innerHTML=filename
                })


            
      
}
  function getJobTracker() {
    
    let objectName = "Job_Tracker";
    let list = 'Candidate,JobPost,QBFeedback'
    let fieldList = list.split(",")
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `(Candidate='${customerID}')<<NG>>(JobPost='${jobID}')`;
    let orderBy = "false"
    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((details) => {
        if (Array.isArray(details) && details.length > 0) {
            jobTracker = details[0];
            attachmentURL=jobTracker.QBFeedback?JSON.parse(jobTracker.QBFeedback)[0].link:''
            filename=jobTracker.QBFeedback?JSON.parse(jobTracker.QBFeedback)[0].displayName:''
            document.getElementById('filename').innerHTML=filename?filename:''
            document.getElementById('filename').href=downloadResume()
        }
    });

}

function formateFileName(fileUrl) {
    if (!fileUrl) {
      return;
    }
    let fileName = fileUrl;
    let fileExt = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length);
    if (fileName && fileName.indexOf('/') === -1) {
      fileName = fileName && fileName.substr(0, fileName.lastIndexOf('.'));
      fileName = fileName && fileName.substr(0, fileName.lastIndexOf('_'));
      fileName = fileName && fileName.substr(fileName.lastIndexOf('\\') + 1) + "." + fileExt;
    } else {
      fileName = fileName && fileName.substr(fileName.lastIndexOf('/') + 1, fileName.length);
      fileName = fileName && fileName.replace(/;#/gi, '\n');
      fileName = fileName && fileName.substr(0, fileName.lastIndexOf('_'));
      fileName = fileName && fileName.substr(fileName.lastIndexOf('\\') + 1) + "." + fileExt;
    }
    return fileName;
  }

  function downloadResume(){
    
    console.log(window.location.origin);
    return window.location.origin+"/Attachment/downloadfile?fileUrl="+encodeURIComponent(((attachmentURL)))
   }