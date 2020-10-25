Ver.registerComponent(
    
    'erv-button', //Nombre del tag que contendra todo el Componente
    
    (function(Ver) {  //Constructor del Componente

        const button = Symbol('button');
        const attributes = {
            1: ['autofocus', 'disabled', 'formnovalidate'],
            2: ['form', 'formaction', 'formmethod', 'name', 'type', 'value'],
            3: ['color', 'shape']
        }

        const ERVButton = function(element){

            const html =
            `
            <button type="button" data-slot="default" data-noselect>
            </button> 
            `;

            //Llamada al super();
            Ver.Component.call(this, { element: element, html: html });

            //configuración adicional propio de este componente
            const mbe_button = this.HTMLElement;
            this[button] = mbe_button.getElementsByTagName('button')[0];

            //Atributos propios de <button>
            for (let i = 1; i <= Object.keys(attributes).length - 1; i++) {
                const atts = attributes[i];
                for (let j = 0; j < atts.length; j++) {
                    const att = atts[j];
                    if(mbe_button.hasAttribute(att)){
                        this[button].setAttribute(att, mbe_button.getAttribute(att) || '');
                        mbe_button.removeAttribute(att);
                        if(att === 'autofocus')
                            this[button].focus();
                    }
                }
            }
        }

        //Herencia de los prototipos y constructor de la classe padre
        ERVButton.prototype = Object.create(Ver.Component.prototype);
        ERVButton.prototype.constructor = Ver.Component;

        //Definición prototipos propios de este Componente

        //atributos propios de <button>
        for (let i = 1; i <= Object.keys(attributes).length - 1; i++) {
            const atts = attributes[i];
            for (let j = 0; j < atts.length; j++) {
                const att = atts[j];
                Object.defineProperty(ERVButton.prototype, att, {
                    get: function(){
                        return this[button][att];
                    },
                    set: function(value){
                        this[button][att] = value;
                    }
                });
            }
        }

        //atributos propios de <erv-button>
        for (let i = 0; i < attributes[3].length; i++) {
            const att = attributes[3][i];
            Object.defineProperty(ERVButton.prototype, att, {
                get: function(){
                    return this.HTMLElement.getAttribute('data-' + att);
                },
                set: function(value){
                    this.HTMLElement.setAttribute('data-' + att, value);
                }
            });
        }

        return ERVButton;

    })(Ver),
        `
        erv-button {
            display: inline-flex;
            margin: 0.5rem;
            height: 5rem;
        }

        erv-button button {
            vertical-align: top;
            font-size: 2.2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            width: 100%;
            height: 100%;

            border-style: solid;
            border-width: 1px;
            padding: 2rem
        }

        erv-button button a {
            text-decoration: none;
            color: inherit;
            width: inherit;
            height: inherit;
            display: flex;
            align-items: center;
            justify-content: center
        }

        erv-button button:hover {
            background-color: var(--defaultHover);
        }
        erv-button button:active {
            background-color: var(--defaultActive);
        }

        erv-button[data-color] button {
            color: white;
            transition: 0.3s background-color;
        }

        

        erv-button[data-shape*=rectangular] {
            height: 7rem;
            width: 30rem; 
        }

        erv-button[data-shape*=square] button{
            height: 7rem;
            width: 7rem;
        }

        

        erv-button[data-shape*=outline] button{
            border: 2px solid var(--default);
            background-color: transparent;
        }
        

        

        erv-button[data-shape*=outline][data-color=blue] button{
            border: 2px solid  #00ADEF;
            background-color: transparent;
            color:  #00ADEF;
        }
        erv-button[data-shape*=outline][data-color=blue] button:hover{
            background-color:  #0b7dda;
            color: white;
        }

        erv-button[data-shape*=outline][data-color=blue] button:hover a{
            color: white;
        }

        erv-button button[disabled]{
            cursor: not-allowed;
            background-color: rgba(239, 239, 239, 0.3);
            color: rgba(16, 16, 16, 0.3);
        }

        erv-button button[disabled]:hover{
            background-color: rgba(239, 239, 239, 0.3);
            color: rgba(16, 16, 16, 0.3);
        }
        `
    );