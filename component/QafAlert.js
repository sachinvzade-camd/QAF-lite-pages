var eventName;
class QafAlert extends HTMLElement {
    static observedAttributes = ["qaf-alert-show",'qaf-event'];
    constructor() {
      super();
    }
  
    connectedCallback() {
    
    }
  
    disconnectedCallback() {
      console.log("Custom element removed from page.");
    }
  
    adoptedCallback() {
      console.log("Custom element moved to new page.");
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'qaf-alert-show') {
        if (typeof (newValue) === 'string') {
          if (newValue.toLowerCase() === 'true'.toLowerCase()) {
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
            padding: 1rem 1.5rem;
            width: 24rem;
            border-radius: 0.5rem;
        }
      
        .show-modal {
            opacity: 1;
            visibility: visible;
            transform: scale(1.0);
            transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
        }
        
.button-container {
  display: flex;
  justify-content: center;
}

.btn{
    margin: 5px;
    padding: 6px 12px;
}
.cancel {
  background-color: #f6f4f4;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

}
.submit{
  background-color:  #ff7a59;
  color:#fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

}
.heading{
    font-size: 16px;
    color: #333;
    text-align: center;
    font-weight: 500;
}
            </style>
            <div class="qaf-modal show-modal">
            <div class="qaf-modal-content">
                <h1 class="heading">Are you sure you want to delete this record?</h1>
                <div class="button-container">
                    <button class="submit btn btn-primary" onclick="oncloseModal('yes')">Yes</button>
                    <button class="cancel btn btn-primary" onclick="oncloseModal('no')">No</button>
                </div>
    
            </div>
        </div>
            `;
          } else {
            this.innerHTML = ''
          }
        }

      } else if (name === 'qaf-event') {
        eventName = newValue
      }
    }
  }

  function oncloseModal(actionType){
    const myComponent = document.querySelector('qaf-alert');
    myComponent.setAttribute('qaf-alert-show', false);
    var event = new CustomEvent(eventName, {detail:actionType })
    window.parent.document.dispatchEvent(event)

  }
  
  customElements.define("qaf-alert", QafAlert);
  