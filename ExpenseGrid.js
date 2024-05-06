function loadEmployeeData(){
    let objectName='Expense_claims';
    let fieldList=['Requesttitle', 'Project', 'Description','TotalAmount'];
    setTimeout(() => {
        if(qafClientLibrary){
            qafClientLibrary.ApiService.GetItems(objectName,fieldList).then((data)=>{
                data.forEach(element => {
                    element.Project=element.Project?element.Project.split(";#")[1]:'';
                    element.TotalAmount=element.TotalAmount?TotalAmount:'';
                    element.Description=element.Description?element.Description:'';
                });
                qafClientLibrary.Grid.Render(document.getElementById('grid'),data,fieldList);
            })
        }  
    }, 800);

}

loadEmployeeData();