var TableData;
var SITapiURL = "https://demtis.quickappflow.com"
var apURL = SITapiURL
var isOffboarded=false
let qafServiceLoaded = setInterval(() => {
    if (window.QafService) {
        attendanceData();
        clearInterval(qafServiceLoaded);
    }
}, 10);

function getCurrentUser() {
    let userKey = window.localStorage.getItem('user_key');
    return JSON.parse(userKey);
}

function attendanceData() {
    const currentDate = new Date();
    const Month = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed (0 for January)
    const Year = currentDate.getFullYear();
    const preMonth = 3;
    TableData = []
    let user = getCurrentUser();
    let fetch_url=`${apURL}/api/eatsum?year=${Year}&month=${Month}`
    if(isOffboarded){
     fetch_url=`${apURL}/api/eatsum?year=${Year}&month=${Month}&ioe=1`
    }

    // TableData = [
    //     {
    //         Name: 'John Doe',
    //         PDs: 20
    //     },
    //     {
    //         Name: 'Jane Smith',
    //         PDs: 18
    //     },
    //     {
    //         Name: 'Michael Johnson',
    //         PDs: 22
    //     },
    
    // ];
    // generateTable(TableData);

    fetch(fetch_url, {
        method: 'POST',
        headers: {
            'Host': 'demtis.quickappflow.com',
            'Employeeguid': user.value.EmployeeGUID,
            'Hrzemail': user.value.Email
        },
    })
    .then(response => response.json())
    .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(val => {
                    TableData.push(
                        {
                            Name: val.Name,
                            PDs: val.PDs,
                        }
                    )
                })
                generateTable(TableData);
            } else {

                generateTable(TableData);
            }
    })
    .catch(error => {
            generateTable(TableData);
    });
}




function generateTable(TableData) {
    document.getElementById('table-container').innerHTML=""

    if (TableData && TableData.length > 0) {
        let tableHead = `
            <th class="qaf-th">Employee Name</th>
            <th class="qaf-th">Present Days</th>
            <th class="qaf-th">Employee Name</th>
            <th class="qaf-th">Present Days</th>
        `;
        let tableRow = "";
        for (let i = 0; i < TableData.length; i += 2) {

            if (i + 1 < TableData.length) {
                const employee1 = TableData[i];
                const employee2 = TableData[i + 1];
                tableRow += `
                    <tr class="qaf-tr">
                        <td class="qaf-td">${employee1.Name}</td>
                        <td class="qaf-td">${employee1.PDs}</td>
                        <td class="qaf-td">${employee2.Name}</td>
                        <td class="qaf-td">${employee2.PDs}</td>
                    </tr>
                `;
            } else {
                const employee = TableData[i];
                tableRow += `
                    <tr class="qaf-tr">
                        <td class="qaf-td">${employee.Name}</td>
                        <td class="qaf-td">${employee.PDs}</td>
                        <td class="qaf-td"></td>
                        <td class="qaf-td"></td>
                    </tr>
                `;
            }
        }
        let tableValue = `
                <table class="qaf-table" id="table">
                    <thead class="qaf-thead">
                        <tr class="qaf-tr">
                            ${tableHead}
                        </tr>
                    </thead>
                    <tbody class="qaf-tbody">
                        ${tableRow}
                    </tbody>
                </table>
            `;

        document.getElementById('table-container').innerHTML = tableValue;
    }
    else {

        let tableHead = `
                            <th class="qaf-th">Employee Name</th>
                            <th class="qaf-th">Present Days</th>
                            <th class="qaf-th">Employee Name</th>
                            <th class="qaf-th">Present Days</th>  `;
        let tableBody = '';
        let startRow = '<tr class="qaf-tr">';
        let endRow = '</tr>';
        let tableRow = `<td colspan="4" class="qaf-td" ><div class='no-record'>No Record Found</div></td>`;
        let tableHTML = `
                <table class="qaf-table" id="table">
                    <thead class="qaf-thead">
                        <tr class="qaf-tr">
                            ${tableHead}
                        </tr>
                     </thead>
                     <tbody class="qaf-tbody">
                        ${startRow}
                            ${tableRow}
                         ${endRow}
                    </tbody>
                </table>
        `;
        document.getElementById('table-container').innerHTML = tableHTML;
    }
}



function download_csv() {
    let data = TableData;

    let csvData = [];
    data.forEach(val => {
        let Name = val["Name"] ? val["Name"] : "";
        let PDs = val["PDs"] ? val["PDs"] : "";
        csvData.push([Name, PDs].join(","));
    });

    let csvBody = csvData.join('\n');


    let csvHeader = ["Employee Name", "Present Days"].join(',') + '\n';

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Attendance Summary' + '.csv';
    hiddenElement.click();
}

function toggleCheckbox(){
    let offboardElement=document.getElementById('Offboarded');
    if(offboardElement){
        isOffboarded= offboardElement.checked
    }
    attendanceData()
}

// const TableData = [
//     {
//         Name: 'John Doe',
//         PDs: 20
//     },
//     {
//         Name: 'Jane Smith',
//         PDs: 18
//     },
//     {
//         Name: 'Michael Johnson',
//         PDs: 22
//     },

// ];