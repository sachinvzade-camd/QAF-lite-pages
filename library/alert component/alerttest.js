document.addEventListener('alertclose', (event) => {
    let actionType=event.detail
        if(actionType==='yes'){
            alert("yes click")
        }else{
            alert("no click")
        }
  });
function openAlert() {
    let qafAlertObject={
        IsShow:true,
        Message:"Krunal Kumbhare"
    }
    const qafAlertComponent = document.querySelector('qaf-alert');
    qafAlertComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
    qafAlertComponent.setAttribute('qaf-event', 'alertclose');
}
