var eventNameqaf;
var qafAlertObject;
var isClassNameDefined;
try {
  class QafAlert extends HTMLElement {
    static observedAttributes = ["qaf-alert-show", 'qaf-event', 'qaf-message'];
    constructor() {
      super();
    }
    connectedCallback() {
    }
    disconnectedCallback() {
    }
    adoptedCallback() {
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'qaf-alert-show') {
        qafAlertObject = JSON.parse(newValue)
        if (typeof (qafAlertObject) === 'object') {
          if (qafAlertObject.IsShow) {
            this.innerHTML = `
              <style>
              .trigger{
                text-align: center;
              padding: 7px 13px;
              background: #3e3e3e;
              color: #fff;
              font-size: 15px;
              outline: none;
              border: none;
              border-radius: 5px;
              font-family: poppins;
          }
          
          .qaf-modal {
            font-family: poppins;
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              opacity: 0;
              visibility: hidden;
              transform: scale(1.1);
              transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
          }
          .qaf-modal-content {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: white;
              padding:26px 20px 14px 20px;
              border-radius: 0.5rem;
              min-width: 340px;
          }
        
          .qaf-show-modal {
              opacity: 1;
              visibility: visible;
              transform: scale(1.0);
              transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
              z-index:9999
          }
          
  .qaf-alert-button-container {
    display: flex;
    justify-content: center;
  }
  
  .qaf-alert-btn{
      margin: 5px;
      padding: 6px 12px;
  }
  .qaf-alert-button-cancel {
    background-color: #f6f4f4;
    color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  
  }
  .qaf-alert-button-submit{
    background-color:  #ff7a59;
    color:#fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  
  }
  .qaf-alert-qaf-alert-heading{
      font-size: 16px;
      color: #333;
      text-align: center;
      font-weight: 500;
  }
              </style>
              <div class="qaf-modal qaf-show-modal">
              <div class="qaf-modal-content">
                  <h1 class="qaf-alert-qaf-alert-heading">${qafAlertObject.Message}</h1>
                  ${qafAlertObject.Type && qafAlertObject.Type.toLowerCase() === 'ok' ? `  <div class="qaf-alert-button-container">
                    <button class="qaf-alert-button-submit btn btn-primary qaf-alert-btn" onclick="oncloseModal('yes')">OK</button>
                </div>`: `  <div class="qaf-alert-button-container">
                    <button class="qaf-alert-button-submit btn btn-primary qaf-alert-btn" onclick="oncloseModal('yes')">Yes</button>
                    <button class="qaf-alert-button-cancel btn  qaf-alert-btn" onclick="oncloseModal('no')">No</button>
                </div>`

              }
              </div>
          </div>
              `;
          } else {
            this.innerHTML = ''
          }
        }

      } else if (name === 'qaf-event') {
        eventNameqaf = newValue
      }
    }
  }
  isClassNameDefined = true;
} catch (error) {
  isClassNameDefined = false;
}
function oncloseModal(actionType) {
  const myComponent = document.querySelector('qaf-alert');
  qafAlertObject.IsShow = false
  myComponent.setAttribute('qaf-alert-show', JSON.stringify(qafAlertObject));
  var event = new CustomEvent(eventNameqaf, { detail: actionType })
  window.parent.document.dispatchEvent(event)
}
var qafAlertelementExists = document.querySelector("qaf-alert");
if (typeof (qafAlertelementExists) === 'undefined' && qafAlertelementExists === null) {
  customElements.define("qaf-alert", QafAlert);
}

