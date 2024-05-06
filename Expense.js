function loadGrid() {
    let objectName='Expense_claims';
    let fieldList=['Requesttitle', 'Project', 'RecordID'];
    let orderBy=''
    let whereClause=''
    let pageSize='2000000'
    let pageNumber='1'
    let isAscending='true'
    window.qafClientService.GetRecord(objectName,fieldList,orderBy,whereClause,pageSize,pageNumber,isAscending).then((items) => {

        let HeaderFields=[{displayName:'Request title',InternalName:'Requesttitle'},{displayName:'Project',InternalName:'Project'}]

        let grid = '<div style="padding: 10px;"><div><div style="display: flex;align-items: flex-end;justify-content: space-between;"><div style="font-size: 24px;line-height: 1.1;padding: 0;margin-bottom: 0;padding-bottom: 5px;"> Expense claims</div><div style="padding-bottom: 5px;"> <button style="display: inline-block;font-weight: 400;padding: 6px 12px;font-size: 14px;border-radius: 4px;border: none;cursor: pointer;" onclick="addItem()">+ Expense</button></div></div></div><div>           <table style="border-collapse: collapse;width: 100%;box-shadow: 1px 3px 2px #e7e1e1;">';
       
        grid += ' <tr style="background: white;border-bottom-color:rgba(0,0,0,.12);display: flex;border-width: 0;border-block-width: 1px;border-style: solid;align-items: center;box-sizing: border-box;min-height: 56px;border-top: none;">'
        HeaderFields.forEach((it) => {
            grid += `<th style="padding: 0 8px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;background: white;word-break: break-all;flex:1;display: flex;">${it.displayName}</th>`;
        });
        grid +'</tr>'
     
        if (Array.isArray(items)) {
            items.forEach((it) => {
                grid += '<tr style="background: white;border-bottom-color:rgba(0,0,0,.12);display: flex;border-width: 0;border-block-width: 1px;border-style: solid;align-items: center;box-sizing: border-box;min-height: 56px;border-top: none;">';
                HeaderFields.forEach((header) => {
                    grid += ` <td style="padding: 0 8px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;background: white;word-break: break-all;flex:1;display: flex;" >${formatFunction(it[header.InternalName])}</td>`;
                })
                grid += '</tr>';
            });
        }
        grid += '</table></div></div>';

        // Append to table
        document.getElementById('team-grid').innerHTML = grid;
    })
}
function formatFunction(data){
    if(data&&data.includes(";#")){
        return data.split(";#")[1]
    }
    return data;
}



function addItem(){
    window.QafService.AddItem('Expense_claims');
}

loadGrid();