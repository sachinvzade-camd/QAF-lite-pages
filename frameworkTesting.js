function externalFormValidationRule() {
    return new Promise((resolve) => {
        
        let TicketID = document.getElementById('TicketID')
        if(TicketID){
        console.log(TicketID.value);
    }
    
        let RequestFor = document.getElementById('RequestFor')
        if(RequestFor){
        console.log(RequestFor.value);
        }
        let Lookup = document.getElementById('Lookup')
        if(Lookup){
        console.log(Lookup.value);
        }

        let Title = document.getElementById('Title')
        if(Title){
        console.log(Title.value);
       }
        let Description = document.getElementById('Description')
        if(Description){
        console.log(Description.value);
        }

        let Status = document.getElementById('Status')
        if(Status){
        console.log(Status.value);
        }

        let DueDate = document.getElementById('DueDate')
        if(DueDate){
        console.log(DueDate.value);
        }

        let Number = document.getElementById('Number')
        if(Number){
        console.log(Number.value);
        }

        let Decimal = document.getElementById('Decimal')
        if(Decimal){
        console.log(Decimal.value);
        }

        let Calculate = document.getElementById('Calculate')
        if(Calculate){
        console.log(Calculate.value);
        }

        let Date = document.getElementById('Date')
        if(Date){
        console.log(Date.value);
        }

        let SelectDD = document.getElementById('SelectDD')
        if(SelectDD){
        console.log(SelectDD.value);
        }

        let SelectRadia = document.getElementById('SelectRadia')
        if(SelectRadia){
        console.log(SelectRadia.value);
        }

        let SelectCheckbox = document.getElementById('SelectCheckbox')
        if(SelectCheckbox){
        console.log(SelectCheckbox.value);
        }

        let HyperLink = document.getElementById('HyperLink')
        if(HyperLink){
        console.log(HyperLink.value);
        }

        let Email = document.getElementById('Email')
        if(Email){
        console.log(Email.value);
        }

        let Checkbox = document.getElementById('Checkbox')
        if(Checkbox){
        console.log(Checkbox.value);
        }

        let MultiSelect = document.getElementById('MultiSelect')
        if(MultiSelect){
        console.log(MultiSelect.value);
        }
      
    })

}