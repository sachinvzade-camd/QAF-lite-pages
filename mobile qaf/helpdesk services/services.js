var user;

let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
      user = getCurrentUser();
        clearInterval(qafServiceLoaded);
    }
}, 10);

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

function openForm(repositoryName) {
  window.QafService.GetObjectById(repositoryName).then((responses) => {
    let fields = [];
    let fieldsValue= [];

    responses[0].Fields.forEach((ele) => {
      fields.push(ele.InternalName)
    })
    fields.forEach(val => {
      if (val === "RequestFor") {
        fieldsValue.push({
          fieldName:val,
          fieldValue:user.EmployeeGUID+";#"+user.FirstName+" "+user.LastName
        })
      }else{
        fieldsValue.push({ fieldName: val, fieldValue: "" })
      }
    })

    if(repositoryName){
      if (window.QafPageService) {
          window.QafPageService.AddItem(repositoryName, function () {},fields,fieldsValue);
      }
  }
  else{
      console.log("Table Is Not Present")
  }
    
  })
   
    
}
function toggleMenu() {
    var menu = document.getElementById('menu');
    if (menu.style.left === '-350px') {
      menu.style.left = '0';
    } else {
      menu.style.left = '-350px';
    }
  }
  function changePage(url){
    window.location.href=window.location.origin+url
  }