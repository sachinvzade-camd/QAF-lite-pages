class MyElement extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow DOM tree to the instance
      this.attachShadow({ mode: 'open' });
    }
  
    // Observe changes to specified attributes
    static get observedAttributes() {
      return ['data-text'];
    }
  
    // Called when the element is added to the DOM
    connectedCallback() {
      this.render();
    }
  
    // Called when an observed attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        
      if (name === 'data-text') {
        this.render();
      }
    }
  
    // Render method to update the component's HTML
    render() {
      const text = this.getAttribute('data-text') || 'Default text';
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            border: 1px solid #ccc;
            padding: 10px;
            background: #f9f9f9;
          }
        </style>
        <div>${text}</div>
      `;
    }
  }
  
  // Define the new element
  customElements.define('my-element', MyElement);
  