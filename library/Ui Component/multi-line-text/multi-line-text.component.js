try {
class MultiLineTextComponent extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return ['element-id'];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'element-id') {
      this.render();
    }
  }
  render() {
    const elementID = this.getAttribute('element-id') ;
    const elementname = this.getAttribute('element-label') ;

    this.innerHTML = `
    <style>
    .qaf-label {
        display: inline-block;
      
        font-size: 15px;
        color: #333;
        font-weight: 400;
        font-family: "Poppins";
    }

    .qaf-input {
        width: 100%;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        font-size: 13px;
        outline: none;
        color: #333;
    }
    .qaf-control{
    margin-top: 10px;
    }
</style>
    <div class='qaf-control'>
    <label for="${elementID}" class="qaf-label">${elementname}</label>
    <textarea  id="${elementID}" class="qaf-input" cols="40" rows="3"></textarea>
</div>

    `;
  }
}
var qafLoaderelementExists = document.querySelector("multi-line-text");
if (typeof (qafLoaderelementExists) === 'undefined' || qafLoaderelementExists === null) {
  customElements.define("multi-line-text", MultiLineTextComponent);
}
} catch (error) {
}