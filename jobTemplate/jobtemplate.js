var templateName;
var selectedRole;
var roleList;
var skillsList;
var jobpostingjson=[]
var tempjobpostingjson=[]

var careerjson=[]
var tempCareerjson=[]

var candidatejson=[]
var trackerjson=[]

var skillljson=[]
var skillcareerJson=[]
var skillTrackerJson=[]
var tempskilljson=[]

var tempcandidatejson=[]
var temptrackerjson=[]
// var jobpostingjson=[
//     {
//         InternalName:"JobTitle",
//         DisplayName:"Job Title",
//         IsShow:false,
//         Sequence:1
//     },
//     {
//         InternalName:"EmployeeType",
//         DisplayName:"Employee Type",
//         IsShow:false,
//         Sequence:2
//     }
// ]


function openForm() {
    let popUp = document.getElementById("popupContainer");
    if (popUp) {
        popUp.style.display = 'block';
    }
}

function nextFormFirst(){
    let templateElement=document.getElementById('template')
    if(templateElement){
        templateName=templateElement.value;
    }
    let roleElement=document.getElementById('role')
    if(roleElement){
        selectedRole=roleElement.value;
    }
    let popUp = document.getElementById("popupContainer");
    if (popUp) {
        popUp.style.display = 'none';
    }
    let jobpostcommonelement = document.getElementById("jobpostcommon");
    if (jobpostcommonelement) {
        jobpostcommonelement.style.display = 'block';
    }
    displayJobPostingCommonField()
}

 qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        window.localStorage.setItem('ma',"qaffirst.quickappflow.com")
        getrole();
        getQafJobCommonFields();
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getQafJobCommonFields() {
    let objectName = "QAF_Configuration";
    let list = "RecordID,Key,Value";
    let orderBy = "";
    let whereClause = "Key='JobPost_Common_Fields'<OR>Key='Candidate_Common_Fields'";
    let pageSize = "100000";
    let pageNumber = "1";
    let isAscending = "true";
    let fieldList = list.split(",")

    window.QafService.GetItems(objectName, fieldList, pageSize, pageNumber, whereClause, '', orderBy).then((jobfields) => {
        if (Array.isArray(jobfields) && jobfields.length > 0) {
            jobfields.forEach(val => {
                if (val.Key === 'JobPost_Common_Fields') {
                    jobpostingjson = JSON.parse(val.Value)
                    tempjobpostingjson = JSON.parse(val.Value)

                    careerjson = JSON.parse(val.Value)
                    tempCareerjson = JSON.parse(val.Value)
                } else if (val.Key === 'Candidate_Common_Fields') {
                    candidatejson = JSON.parse(val.Value)
                    tempcandidatejson = JSON.parse(val.Value)

                    trackerjson = JSON.parse(val.Value)
                    temptrackerjson = JSON.parse(val.Value)
                }
            })

        }
    })
}

function getrole() {
    let objectName = "Role";
    let list = "EmployeeLevel";
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = ``;
    let orderBy = "true";
    window.QafService.GetItems(
        objectName,
        fieldList,
        pageSize,
        pageNumber,
        whereClause,
        "",
        orderBy
    ).then((roles) => {
        if (Array.isArray(roles) && roles.length > 0) {
            roles = roles.reverse();
            roleList=role
            let rolesDropdown = document.getElementById("role");
            let options = `<option value=''>Select Job Post</option>`;
            if (rolesDropdown) {
                roles.forEach((job) => {
                    options += `<option value=${job.RecordID}>${job.EmployeeLevel}</option>`;
                });
                rolesDropdown.innerHTML = options;
            }
        }
    });
}
function onchangeJobPostvisible(internalName){
   let ishowelement=document.getElementById(+internalName);
   if(ishowelement){
    jobpostingjson.forEach(val=>{
        if(val.InternalName===internalName){
            val.IsShow=ishowelement.checked
        }
    })
   }
}

function onchangeSequenceJobPost(internalName){
    let sequenceElement=document.getElementById(`sequence-${internalName}`);
    if(sequenceElement){
     jobpostingjson.forEach(val=>{
         if(val.InternalName===internalName){
             val.Sequence=sequenceElement.value
         }
     })
    }
}


function onDeleteJobPost(internalName){
    jobpostingjson=jobpostingjson.filter(a=>a.InternalName!=internalName)
    displayJobPostingCommonField()
    JobPostFieldsRemaining()
}
function onaddJobPost(){
    let remainJobPostElement=document.getElementById('remainJobPost');
    if(remainJobPostElement){
        let jobPostvalue=remainJobPostElement.value;
        let selectedJobPost=tempjobpostingjson.find(a=>a.InternalName===jobPostvalue)
        jobpostingjson.push(selectedJobPost)
        JobPostFieldsRemaining()
        displayJobPostingCommonField()

    }
}
function displayJobPostingCommonField(){
    let jobfieldElement=document.getElementById('jobfield')
    let jobData=""
    jobpostingjson.forEach((val,index)=>{
        jobData+=`<div class="field-list">
        <div class="boolean-fields">${val.DisplayName}</div>
        <div class="boolean-fields"><i class="fa fa-trash-o" aria-hidden="true" onclick="onDeleteJobPost('${val.InternalName}')"></i></div>
    </div>`
    })
    if(jobfieldElement){
        jobfieldElement.innerHTML=jobData
    }
    setTimeout(() => {
        jobpostingjson.forEach((job,i)=>{
            // sequence dropdown
        let sequenceDropdown = document.getElementById(`sequence-${job.InternalName}`);
            let options = `<option value=''>Select Sequence</option>`;
            if (sequenceDropdown) {
                jobpostingjson.forEach((post,index) => {
                    options += `<option value=${index+1}>${index+1}</option>`;
                });
                sequenceDropdown.innerHTML = options;
                sequenceDropdown.value=job.Sequence
            }

                // checkbox isShow
        let isshowElement = document.getElementById(`${job.InternalName}`);
            if(isshowElement){
                isshowElement.checked=job.IsShow
            }
        })
    }, 200);
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






function nextFormSecond(){
    let skillcommonelement = document.getElementById("skilldetails");
    if (skillcommonelement) {
        skillcommonelement.style.display = 'block';
    }
    let jobpostcommonelement = document.getElementById("jobpostcommon");
    if (jobpostcommonelement) {
        jobpostcommonelement.style.display = 'none';
    }
    getCandidateSkills()
}
function closeFormSecond(){
    let candidatecommonelement = document.getElementById("jobpostcommon");
    if (candidatecommonelement) {
        candidatecommonelement.style.display = 'none';
    }
    let jobpostcommonelement = document.getElementById("popupContainer");
    if (jobpostcommonelement) {
        jobpostcommonelement.style.display = 'block';
    }
}


// candidate Common Fields
function displayCandidateCommonField() {
    let candidateElement = document.getElementById('candidatefield')
    let candidateData = ""
    candidatejson.forEach((val, index) => {
        candidateData += `<div class="field-list">
        <div class="boolean-fields">${val.DisplayName}</div>
        <div class="boolean-fields"><i class="fa fa-trash-o" aria-hidden="true" onclick="onDeletecandidateCommonField('${val.InternalName}')"></i></div>
    </div>`
    })
    if (candidateElement) {
        candidateElement.innerHTML = candidateData
    }
    setTimeout(() => {
        candidatejson.forEach((job, i) => {
            // sequence dropdown
            let sequenceDropdown = document.getElementById(`sequencecd-${job.InternalName}`);
            let options = `<option value=''>Select Sequence</option>`;
            if (sequenceDropdown) {
                candidatejson.forEach((post, index) => {
                    options += `<option value=${index + 1}>${index + 1}</option>`;
                });
                sequenceDropdown.innerHTML = options;
                sequenceDropdown.value = job.Sequence
            }
            // checkbox isShow
            let isshowElement = document.getElementById(`${job.InternalName}`);
            if (isshowElement) {
                isshowElement.checked = job.IsShow
            }
        })
    }, 200);
}
function onDeletecandidateCommonField(internalName){
    candidatejson=candidatejson.filter(a=>a.InternalName!=internalName)
    displayCandidateCommonField()
    CandidateFieldsRemaining()
}
function onchangeSequenceCandidate(internalName){
    let sequenceElement=document.getElementById(`sequencecd-${internalName}`);
    if(sequenceElement){
     candidatejson.forEach(val=>{
         if(val.InternalName===internalName){
             val.Sequence=sequenceElement.value
         }
     })
    }
}
function onchangeCandidatevisible(internalName){
    let ishowelement=document.getElementById('cd-'+internalName);
    if(ishowelement){
     candidatejson.forEach(val=>{
         if(val.InternalName===internalName){
             val.IsShow=ishowelement.checked
         }
     })
    }
 }
 function onaddCandidateFields(){
    let remainCandidateElement=document.getElementById('remainCommonField');
    if(remainCandidateElement){
        let candidatevalue=remainCandidateElement.value;
        let selectedCandidate=tempcandidatejson.find(a=>a.InternalName===candidatevalue)
        candidatejson.push(selectedCandidate)
        CandidateFieldsRemaining()
        displayCandidateCommonField()

    }
}
function CandidateFieldsRemaining(){
    let remainCandidateElement = document.getElementById("remainCommonField");
    let fieldsRemain = tempcandidatejson.filter((objOne) => {
        return !candidatejson.some((objTwo) => {
          return objOne.InternalName === objTwo.InternalName;
        });
      });
      if(fieldsRemain&&fieldsRemain.length>0){
        let options = `<option value=''>Select Fields</option>`;
        if (remainCandidateElement) {
            fieldsRemain.forEach((field) => {
                options += `<option value=${field.InternalName}>${field.DisplayName}</option>`;
            });
            remainCandidateElement.innerHTML = options;
        }
      }else{
        if (remainCandidateElement) {
            let options = `<option value=''>Select Fields</option>`;
            remainCandidateElement.innerHTML = options;
        }
      }
           
}
// candidate Common Fields end








function nextFormthird(){
    let candidatecommonelement = document.getElementById("candidatecommon");
    if (candidatecommonelement) {
        candidatecommonelement.style.display = 'none';
    }
    let skillcommonelement = document.getElementById("trackercommon");
    if (skillcommonelement) {
        skillcommonelement.style.display = 'block';
    }
    trackerjson=candidatejson.filter(fd=>fd.IsShow||fd.InternalName==='FirstName'||fd.InternalName==='LastName'||fd.InternalName==='Email'||fd.InternalName==='Mobile')
    displayTrackerCommonField()
    skillTrackerJson=skillljson
    remainSkilltracker()
}

function closeFormCandiate(){
    let candidatecommonelement = document.getElementById("candidatecommon");
    if (candidatecommonelement) {
        candidatecommonelement.style.display = 'none';
    }
    let careercommonelement = document.getElementById("careerportalcommon");
    if (careercommonelement) {
        careercommonelement.style.display = 'block';
    }
    displayCareerCommonField()
}
function closeFormTracker(){
    let trackercommonelement = document.getElementById("trackercommon");
    if (trackercommonelement) {
        trackercommonelement.style.display = 'none';
    }
    let candidatecommonelement = document.getElementById("candidatecommon");
    if (candidatecommonelement) {
        candidatecommonelement.style.display = 'block';
    }
    displayCandidateCommonField()
}
function nextFormFourth(){
    let careercommonelement = document.getElementById("careerportalcommon");
    if (careercommonelement) {
        careercommonelement.style.display = 'block';
    }
    let skillcommonelement = document.getElementById("skilldetails");
    if (skillcommonelement) {
        skillcommonelement.style.display = 'none';
    }
    careerjson=jobpostingjson.filter(fd=>fd.IsShow||fd.InternalName==='JobTitle'||fd.InternalName==='JobID')
    displayCareerCommonField()
}
function nextFormCareer(){
    let candidatecommonelement = document.getElementById("candidatecommon");
    if (candidatecommonelement) {
        candidatecommonelement.style.display = 'block';
    }
    let skillcommonelement = document.getElementById("careerportalcommon");
    if (skillcommonelement) {
        skillcommonelement.style.display = 'none';
    }
    displayCandidateCommonField()
}
function closeFormCareer(){
    let skillcommonelement = document.getElementById("skilldetails");
    if (skillcommonelement) {
        skillcommonelement.style.display = 'block';
    }
    let careercommonelement = document.getElementById("careerportalcommon");
    if (careercommonelement) {
        careercommonelement.style.display = 'none';
    }
    getCandidateSkills()
}
function closeFormFourth(){
    let jobcommonelement = document.getElementById("jobpostcommon");
    if (jobcommonelement) {
        jobcommonelement.style.display = 'block';
    }
    let skillcommonelement = document.getElementById("skilldetails");
    if (skillcommonelement) {
        skillcommonelement.style.display = 'none';
    }
    displayJobPostingCommonField()
}

function nextFormFifth(){
    let trackercommonelement = document.getElementById("trackercommon");
    if (trackercommonelement) {
        trackercommonelement.style.display = 'none';
    }
    let careercommonelement = document.getElementById("careerportalcommon");
    if (careercommonelement) {
        careercommonelement.style.display = 'block';
    }
    displayCareerCommonField()
}


// tracker fields
function displayTrackerCommonField() {
    let candidateElement = document.getElementById('trackerfieldID')

    let candidateData = ""
    trackerjson.forEach((val, index) => {
        candidateData += `<div class="field-list">
        <div class="boolean-fields">${val.DisplayName}</div>
        <div class="boolean-fields"><i class="fa fa-trash-o" aria-hidden="true" onclick="onDeleteTrackerFields('${val.InternalName}')"></i></div>
    </div>`
    })
    if (candidateElement) {
        candidateElement.innerHTML = candidateData
    }
    setTimeout(() => {
        trackerjson.forEach((job, i) => {
            // sequence dropdown
            let sequenceDropdown = document.getElementById(`sequencetr-${job.InternalName}`);
            let options = `<option value=''>Select Sequence</option>`;
            if (sequenceDropdown) {
                trackerjson.forEach((post, index) => {
                    options += `<option value=${index + 1}>${index + 1}</option>`;
                });
                sequenceDropdown.innerHTML = options;
                sequenceDropdown.value = job.Sequence
            }
            // checkbox isShow
            let isshowElement = document.getElementById(`tr-${job.InternalName}`);
            if (isshowElement) {
                isshowElement.checked = job.IsShow
            }
        })
    }, 200);
    trackerFieldsRemaining()

}
function onDeleteTrackerFields(internalName){
    trackerjson=trackerjson.filter(a=>a.InternalName!=internalName)
    displayTrackerCommonField()
    trackerFieldsRemaining()
}

function onchangeTrackervisible(internalName){
    let ishowelement=document.getElementById('tr-'+internalName);
    if(ishowelement){
     trackerjson.forEach(val=>{
         if(val.InternalName===internalName){
             val.IsShow=ishowelement.checked
         }
     })
    }
 }
 function onchangeSequenceTracker(internalName){
    let sequenceElement=document.getElementById(`sequence-${internalName}`);
    if(sequenceElement){
        trackerjson.forEach(val=>{
         if(val.InternalName===internalName){
             val.Sequence=sequenceElement.value
         }
     })
    }
}
function onaddTrackerFields(){
    let remainTrackerElement=document.getElementById('remainTrackerField');
    if(remainTrackerElement){
        let trackervalue=remainTrackerElement.value;
        let selectedTracker=temptrackerjson.find(a=>a.InternalName===trackervalue)
        trackerjson.push(selectedTracker)
        trackerFieldsRemaining()
        displayTrackerCommonField()
    }
}
function trackerFieldsRemaining(){
    let remainTrackerElement = document.getElementById("remainTrackerField");
    let fieldsRemain = candidatejson.filter((objOne) => {
        return !trackerjson.some((objTwo) => {
          return objOne.InternalName === objTwo.InternalName;
        });
      });
      if(fieldsRemain&&fieldsRemain.length>0){
        let options = `<option value=''>Select Fields</option>`;
        if (remainTrackerElement) {
            fieldsRemain.forEach((field) => {
                options += `<option value=${field.InternalName}>${field.DisplayName}</option>`;
            });
            remainTrackerElement.innerHTML = options;
        }
      }else{
        if (remainTrackerElement) {
            let options = `<option value=''>Select Fields</option>`;
            remainTrackerElement.innerHTML = options;
        }
      }
           
}
// tracker fields ends




// candidate Skills
function getCandidateSkills() {
    skillsList=[]
    skillljson=[]
    tempskilljson=[]
    let objectName = "Candidate_Skills";
    let list = "SkillName,ApplicableforRole,YearofExperience";
    let fieldList = list.split(",");
    let pageSize = "20000";
    let pageNumber = "1";
    let whereClause = `ApplicableforRole='${selectedRole}'`;
    let orderBy = "true";
    window.QafService.GetItems(
        objectName,
        fieldList,
        pageSize,
        pageNumber,
        whereClause,
        "",
        orderBy
    ).then((skills) => {
        if (Array.isArray(skills) && skills.length > 0) {
            skills = skills.reverse();
            skillsList=skills
            skillsList.forEach(sk=>{
            skillljson.push(
                {
                    SkillName:sk.SkillName,
                    YearofExperience:sk.YearofExperience
                }
            )
            tempskilljson.push(
                {
                    SkillName:sk.SkillName,
                    YearofExperience:sk.YearofExperience
                }
            )
            })
            displaySkillCommonField()
        }
    });
}
function displaySkillCommonField(){
    let skillElement = document.getElementById("skillid");
    if(skillElement){
        let skillData=""
        skillljson.forEach((val, index) => {
            skillData += `<div class="field-list">
            <div class="boolean-fields">${val.SkillName}</div>
            <div class="boolean-fields"><input type="number" name="sk-${index}" id="sk-${index}" oninput="onInputSkill('${index}')"></div>
            <div class="boolean-fields"><i class="fa fa-trash-o" aria-hidden="true" onclick="onDeleteSkill('${index}')"></i></div>
        </div>`
        })
        if (skillElement) {
            skillElement.innerHTML = skillData
        }
        setTimeout(() => {
            skillljson.forEach((sk, index) => {
                // checkbox isShow
                let skillInputElement = document.getElementById(`sk-${index}`);
                if (skillInputElement) {
                    skillInputElement.value = sk.YearofExperience
                }
            })
        }, 200);
    }
}
function onInputSkill(indexInput) {
    let skillElement = document.getElementById(`sk-${indexInput}`);
    if (skillElement) {
        skillljson.forEach((val, index) => {
            if (index === parseInt(indexInput)) {
                val.YearofExperience = Number(skillElement.value)
            }
        })
    }
}
function onDeleteSkill(indexInput){
    skillljson=skillljson.filter((val,index)=>index!=parseInt(indexInput))
    displaySkillCommonField()
}
// candidate Skills end










// career field start

function displayCareerCommonField() {
    let candidateElement = document.getElementById('careerfieldID')
    
    let candidateData = ""
    careerjson.forEach((val, index) => {
        candidateData += `<div class="field-list">
        <div class="boolean-fields">${val.DisplayName}</div>
        <div class="boolean-fields"><i class="fa fa-trash-o" aria-hidden="true" onclick="onDeletecandidateCommon('${val.InternalName}')"></i></div>
    </div>`
    })
    if (candidateElement) {
        candidateElement.innerHTML = candidateData
    }
    setTimeout(() => {
        careerjson.forEach((job, i) => {
            // sequence dropdown
            let sequenceDropdown = document.getElementById(`sequencecr-${job.InternalName}`);
            let options = `<option value=''>Select Sequence</option>`;
            if (sequenceDropdown) {
                careerjson.forEach((post, index) => {
                    options += `<option value=${index + 1}>${index + 1}</option>`;
                });
                sequenceDropdown.innerHTML = options;
                sequenceDropdown.value = job.Sequence
            }
            // checkbox isShow
            let isshowElement = document.getElementById(`cr-${job.InternalName}`);
            if (isshowElement) {
                isshowElement.checked = job.IsShow
            }
        })
    }, 200);
    skillcareerJson=skillljson
    skillTrackerJson=skillljson
    CareerFieldsRemaining()
    remainSkillCareer()

}
function remainSkillCareer(){
    let SkillCareerElement = document.getElementById('skillcareerfieldID')
    let remainSkillCareer = ""
    skillcareerJson.forEach((val, index) => {
        remainSkillCareer += `<div class="field-list">
        <div class="boolean-fields">${val.SkillName}</div>
        <div class="boolean-fields"><i class="fa fa-trash-o" aria-hidden="true" onclick="onDeleteCareerSkill('${index}')"></i></div>
    </div>`
    })
    if (SkillCareerElement) {
        SkillCareerElement.innerHTML = remainSkillCareer
    }
    SkillCareerFieldsRemaining()
}

function onDeleteCareerSkill(indexInput){
    skillcareerJson=skillcareerJson.filter((val,index)=>index!=parseInt(indexInput))
    remainSkillCareer()
    SkillCareerFieldsRemaining()
}
function onaddCareerSkillFields(){
    
        let remainCareerSkillElement=document.getElementById('remainskillCareerField');
        if(remainCareerSkillElement){
            let careervalue=remainCareerSkillElement.value;
            let selectedCareer=skillljson.find((val,index)=>val.SkillName===addSpaces(careervalue))
            skillcareerJson.push(selectedCareer)
            remainSkillCareer()
            SkillCareerFieldsRemaining()
        }
}
function replaceSpaces(value){
    if(value){
        return value.replaceAll(" ","_");
    }
    return ""
    
}
function addSpaces(value){
    if(value){
        return value.replaceAll("_"," ");
    }
    return ""
}
function SkillCareerFieldsRemaining(){
    let remainCareerElement = document.getElementById("remainskillCareerField");
    let fieldsRemain = skillljson.filter((objOne) => {
        return !skillcareerJson.some((objTwo) => {
          return objOne.SkillName === objTwo.SkillName;
        });
      });
      if(fieldsRemain&&fieldsRemain.length>0){
        let options = `<option value=''>Select Fields</option>`;
        if (remainCareerElement) {
            fieldsRemain.forEach((field,index) => {
                options += `<option value=${replaceSpaces(field.SkillName)}>${field.SkillName}</option>`;
            });
            remainCareerElement.innerHTML = options;
        }
      }else{
        if (remainCareerElement) {
            let options = `<option value=''>Select Fields</option>`;
            remainCareerElement.innerHTML = options;
        }
      }
           
}

function onDeletecandidateCommon(internalName){
    careerjson=careerjson.filter(a=>a.InternalName!=internalName)
    displayCareerCommonField()
    CareerFieldsRemaining()
}

function onchangeCareervisible(internalName){
    let ishowelement=document.getElementById('cr-'+internalName);
    if(ishowelement){
        careerjson.forEach(val=>{
         if(val.InternalName===internalName){
             val.IsShow=ishowelement.checked
         }
     })
    }
 }
 function onchangeSequenceCareer(internalName){
    let sequenceElement=document.getElementById(`sequencecr-${internalName}`);
    if(sequenceElement){
        careerjson.forEach(val=>{
         if(val.InternalName===internalName){
             val.Sequence=sequenceElement.value
         }
     })
    }
}

function onaddCareerFields(){
    let remainCareerElement=document.getElementById('remainCareerField');
    if(remainCareerElement){
        let careervalue=remainCareerElement.value;
        let selectedCareer=tempCareerjson.find(a=>a.InternalName===careervalue)
        careerjson.push(selectedCareer)
        CareerFieldsRemaining()
        displayCareerCommonField()
    }
}
function CareerFieldsRemaining(){
    let remainCareerElement = document.getElementById("remainCareerField");
    let fieldsRemain = jobpostingjson.filter((objOne) => {
        return !careerjson.some((objTwo) => {
          return objOne.InternalName === objTwo.InternalName;
        });
      });
      if(fieldsRemain&&fieldsRemain.length>0){
        let options = `<option value=''>Select Fields</option>`;
        if (remainCareerElement) {
            fieldsRemain.forEach((field) => {
                options += `<option value=${field.InternalName}>${field.DisplayName}</option>`;
            });
            remainCareerElement.innerHTML = options;
        }
      }else{
        if (remainCareerElement) {
            let options = `<option value=''>Select Fields</option>`;
            remainCareerElement.innerHTML = options;
        }
      }
           
}

// career field end




// remain skill tracker

function remainSkilltracker(){
    let SkillTrackerElement = document.getElementById('trackercareerfieldID')
    let remainSkillTracker = ""
    skillTrackerJson.forEach((val, index) => {
        remainSkillTracker += `<div class="field-list">
        <div class="boolean-fields">${val.SkillName}</div>
        <div class="boolean-fields"><i class="fa fa-trash-o" aria-hidden="true" onclick="onDeletetrackerSkill('${index}')"></i></div>
    </div>`
    })
    if (SkillTrackerElement) {
        SkillTrackerElement.innerHTML = remainSkillTracker
    }
    SkillTrackerFieldsRemaining()
}

function onDeletetrackerSkill(indexInput){
    skillTrackerJson=skillTrackerJson.filter((val,index)=>index!=parseInt(indexInput))
    remainSkilltracker()
    SkillTrackerFieldsRemaining()
}
function onaddTrackerSkillFields(){
        let remaintrackerSkillElement=document.getElementById('remainskillTrackerField');
        if(remaintrackerSkillElement){
            let careervalue=remaintrackerSkillElement.value;
            let selectedCareer=skillljson.find((val,index)=>val.SkillName===addSpaces(careervalue))
            skillTrackerJson.push(selectedCareer)
            remainSkilltracker()
            SkillTrackerFieldsRemaining()
        }
}
function SkillTrackerFieldsRemaining(){
    let remainTrackerElement = document.getElementById("remainskillTrackerField");
    let fieldsRemain = skillljson.filter((objOne) => {
        return !skillTrackerJson.some((objTwo) => {
          return objOne.SkillName === objTwo.SkillName;
        });
      });
      if(fieldsRemain&&fieldsRemain.length>0){
        let options = `<option value=''>Select Fields</option>`;
        if (remainTrackerElement) {
            fieldsRemain.forEach((field,index) => {
                options += `<option value=${replaceSpaces(field.SkillName)}>${field.SkillName}</option>`;
            });
            remainTrackerElement.innerHTML = options;
        }
      }else{
        if (remainTrackerElement) {
            let options = `<option value=''>Select Fields</option>`;
            remainTrackerElement.innerHTML = options;
        }
      }
           
}
// remain skill tracker


function JobPostFieldsRemaining(){
    let remainJobPostElement = document.getElementById("remainJobPost");
    let fieldsRemain = tempjobpostingjson.filter((objOne) => {
        return !jobpostingjson.some((objTwo) => {
          return objOne.InternalName === objTwo.InternalName;
        });
      });
      if(fieldsRemain&&fieldsRemain.length>0){
        let options = `<option value=''>Select Fields</option>`;
        if (remainJobPostElement) {
            fieldsRemain.forEach((field) => {
                options += `<option value=${field.InternalName}>${field.DisplayName}</option>`;
            });
            remainJobPostElement.innerHTML = options;
        }
      }else{
        if (remainJobPostElement) {
            let options = `<option value=''>Select Fields</option>`;
            remainJobPostElement.innerHTML = options;
        }
      }
           
}






function closeFormTracker(){
    let trackercommonElement=document.getElementById('trackercommon');
    if(trackercommonElement){
        trackercommonElement.style.display='none'
    }
}



function SaveAll(){
    let trackerCombineObject={
        Candidate:trackerjson,
        Skills:skillTrackerJson
    }
    let CareerCombineObject={
        Candidate:trackerjson,
        Skills:skillcareerJson
    }
    let object={
        TemplateName:templateName,
        JobPostingField:JSON.stringify(jobpostingjson),
        CandidateField:JSON.stringify(candidatejson),
        SkillField:JSON.stringify(skillljson),
        TrackerField:JSON.stringify(trackerCombineObject),
        CareerPortalField:JSON.stringify(CareerCombineObject)
    }
    save(object,'Job_Profile_Template')
}
function save(object, repositoryName) {
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
      intermidiateRecord.RecordID = null;
      intermidiateRecord.RecordFieldValues = recordFieldValueList;
      window.QafService.CreateItem(intermidiateRecord).then(response => {
      alert("Template added in tracker")
      closeFormTracker()
        resolve({
          response
        })
      });
    }
    )
  
  }