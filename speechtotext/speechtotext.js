var results;
qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        user = getCurrentUser()

        window.document.addEventListener('speechToTextEvent', onopenForm)
        clearInterval(qafServiceLoaded);
    }
}, 10);

function onopenForm(){
    document.getElementById('speechForm').style.display='block'
}
function speechSomething(){
    startListening()
}

function startListening() {
    if ('webkitSpeechRecognition' in window) {
        const vSearch = new webkitSpeechRecognition();
        vSearch.continuous = false;
        vSearch.interimresults = false;
        vSearch.lang = 'en-US';
        vSearch.start();
        vSearch.onresult = (e) => {
            results = e.results[0][0].transcript;
            getSpeechText()
            vSearch.stop();
        };
    } else {
        alert('Your browser does not support voice recognition!');
    }
}
function getSpeechText(){
    let speechTextareaElement=document.getElementById('speech-result');
    if(speechTextareaElement){
        speechTextareaElement.value=results;
    }
}
function saveData() {
    let object = {
        Repository: 'poc',
        json: results
    }
    saveForm(object)
}
function saveForm(object) {
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
        intermidiateRecord.ObjectID = "poc";
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValueList;
        window.QafService.CreateItem(intermidiateRecord).then(response => {
            clearData()
            close()
            openAlert('Data saved!!!')
            resolve({
                response
            })
        });
    })
}
function clearData(){
    results="";
    let speechTextareaElement=document.getElementById('speech-result');
    if(speechTextareaElement){
        speechTextareaElement.value=results;
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
function close(){
     document.getElementById('speechForm').style.display='none'
}
function textTospeech(){
    speak('A new contact has been created in the CRM')
}
function speak(text) {
    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Select a voice
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0]; // Choose a specific voice

    // Speak the text
    speechSynthesis.speak(utterance);
  }