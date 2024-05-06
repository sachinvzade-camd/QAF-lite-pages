function openLoader() {
    let qafAlertComponent = document.getElementById('first');
    setTimeout(() => {
     qafAlertComponent.style.display='block'
    }, 2000);
    setTimeout(() => {
        qafAlertComponent.style.display='none'
       }, 10000);

}
openLoader()

