document.addEventListener('alertclose', (event) => {
    let actionType=event.detail
        if(actionType==='yes'){
            alert("yes click")
        }else{
            alert("no click")
        }
  });
function openAlert(){
    const myComponent = document.querySelector('qaf-alert');
    myComponent.setAttribute('qaf-alert-show', true);
        myComponent.setAttribute('qaf-event', 'alertclose');
}
