const grids = document.querySelectorAll('qaf-grid');
      grids.forEach((gridElement)=>{
        customElements.whenDefined(gridElement.localName).then((done)=>{
          const element = gridElement;
          const attr = element.getAttribute('data-bind-reposiory');
          if(attr === 'Teams'){
                      element.columns = [

                          {field:'RecordID', displayName:'ID', sorting: true},

                          {field:'TeamName', displayName:'Team Name', sorting: true},

                          {field:'TeamMembers', displayName:'Team Members', sorting: false}

                      ];
          }
          else if(attr === 'HAsset_Master'){
            element.columns = [

              {field:'Type', displayName:'Type', sorting: true},

              {field:'AssetName', displayName:'Asset Name', sorting: true},

              {field:'SerialNumber', displayName:'Serial Number', sorting: true}

          ];
          }
          else{
                    element.columns = [

                          {field:'Name', displayName:'Name', sorting: true},

                          {field:'CategoryName', displayName:'Category Name', sorting: true},

                          {field:'SerialNumber', displayName:'Serial Number', sorting: true}

                      ];
          }});
      });