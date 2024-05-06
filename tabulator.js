
var tabledata = [
    {id:1, name:"Billy Bob", age:12, gender:"male", height:95},
    {id:2, name:"Jenny Jane", age:42, gender:"female", height:142},
    {id:3, name:"Steve McAlistaire", age:35, gender:"male", height:176},
];

var table = new Tabulator("#example-table", {
    data: tabledata,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 5,
    tooltips: true,
    columns: [
        {
            title: "ID",
            field: "id",
        },
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Age",
            field: "age",
        },
        {
            title: "Gender",
            field: "gender",
        },
        {
            title: "Height",
            field: "height",
        }
    ],
    
});