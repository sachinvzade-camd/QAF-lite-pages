var sampleObjectDefination=[
    {
        InternalName:"SingleLine",
        DisplayName:"Single Line"
    },
    {
        InternalName:"Multiline",
        DisplayName:"Multiline"
    }
]
var fieldsToImport=[
    "SingleLine",
    "Multiline"
]
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
function handleFile(e)
{
    var result;
    var files = e.target.files;
    var i, f;
    //Loop through files
    for (i = 0, f = files[i]; i != files.length; ++i)
    {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e)
        {
            var data = e.target.result;

            var workbook = XLSX.read(data,
            {
                type: 'binary'
            });

            var sheet_name_list = workbook.SheetNames;
            var roa;
            sheet_name_list.forEach(function(y)
            {
                /* iterate through sheets */
                //Convert the cell value to Json
                roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                if (roa.length > 0)
                {
                    result = roa;
                }
            });
            formatExecelData(result)
        };
        reader.readAsArrayBuffer(f);
    }

}

function formatExecelData(excelRows) {
    let newExcelRows = []

    excelRows.forEach((element, index) => {
      let newObject = {}
      let keys = Object.keys(element);

      for (var x = 0; x < keys.length; x++) {
        let value = element[keys[x]]
        keys[x] = keys[x].replace("*", "").trim();
        let field = sampleObjectDefination.find(a => a.DisplayName === keys[x]);
        newObject[field.InternalName] = value
      }
      element = newObject
      fieldsToImport = fieldsToImport.filter((item,
        index) =>fieldsToImport.indexOf(item) === index);
      fieldsToImport.forEach(importField => {

        if (element[importField]) {
          element[importField] = element[importField]
        }
        else {
          element[importField] = "";
        }
      })
      newExcelRows.push(element)
    });
    bulkAdd(newExcelRows)
  }

function bulkAdd(convertedData) {
    let records = [];
    var recordFieldValues = [];
    var intermidiateRecord = {}
    var user = getCurrentUser()
    convertedData && convertedData.forEach((element) => {
        intermidiateRecord = {}
        recordFieldValues = [];
        Object.keys(element).forEach((key, value) => {
            recordFieldValues.push({
                FieldID: null,
                FieldInternalName: key,
                FieldValue: element[key]
            });
        });
        intermidiateRecord.CreatedByID = user.EmployeeID;
        intermidiateRecord.CreatedDate = new Date();
        intermidiateRecord.LastModifiedBy = null;
        intermidiateRecord.ObjectID = "CAS";
        intermidiateRecord.RecordID = null;
        intermidiateRecord.RecordFieldValues = recordFieldValues;
        records.push(intermidiateRecord);
    });
    console.log(records);
    
}


document.getElementById('upload').addEventListener('change', handleFile, false);
