/*
 * check-Burger.js v1.0.0
 * Ver Component, boton simple de tipo "Hamburger button", que solo es visible en resoluciones
 * pequeñas (resoluciones del viewport de dispositivos moviles)
 * (c) 2020 Emanuel Rojas Vásquez
 * MIT License
 * https://github.com/Imanol91/check-Burger.js
 */
Ver.registerComponent(
    
    'check-burger', //Nombre del tag que contendra todo el Componente
    
    (function(Ver) {  //Constructor del Componente

        const checked = 'checked';
        const onchange = 'onchange';
        const input = Symbol('input');

        const CheckBurger = function(element){

            const html =
            `
            <label>
                <input type="checkbox" style="display: none;">
                <erv-container>
                    <erv-bar></erv-bar>
                    <erv-bar></erv-bar>
                    <erv-bar></erv-bar>
                    <erv-bar></erv-bar>
                </erv-container>
            </label>   
            `;

            //Llamada al super();
            Ver.Component.call(this, { element: element, html: html });

            //configuración adicional propio de este componente
            const burger = this.HTMLElement;
            this[input] = burger.getElementsByTagName('input')[0];

            if(burger.hasAttribute(checked)){
                burger.removeAttribute(checked);
                this[input][checked] = !0;
            }

            if(burger.hasAttribute(onchange)){
                const tempFn = burger[onchange];
                burger.removeAttribute(onchange);
                this[input][onchange] = () => {
                    tempFn({ type: 'change', target: this, currentTarget: this });
                }
            }
        }

        //Herencia de los prototipos y constructor de la classe padre
        CheckBurger.prototype = Object.create(Ver.Component.prototype);
        CheckBurger.prototype.constructor = Ver.Component;

        //Definición prototipos propios de este Componente
        Object.defineProperties(CheckBurger.prototype, {
            checked: {
                get: function(){
                    return this[input][checked];
                },
                set: function(value){
                    this[input][checked] = value;
                }
            },
            'color': {
                get: function(){
                    return this.HTMLElement.getAttribute('data-color');
                },
                set: function(value){
                    this.HTMLElement.setAttribute('data-color', value+"".toLowerCase());
                }
            },
            onchange: {
                get: function(){
                    return this[input][onchange];
                },
                set: function(value){
                    this[input][onchange] = function() {
                        value({ type: 'change', target: this, currentTarget: this });
                    }
                }
            }
        });

        return CheckBurger;

    })(Ver),

    //Estilos del Component (opcional)
    
        `
        check-burger {
            display: inline-block;
            height: 6rem;
            width: 6rem;
            border-radius: 0.25rem;
            margin: 0.5rem;
            vertical-align: top;
        }

        check-burger:hover erv-bar{ 
            background-color: #3b3b3b; 
        }

        check-burger[data-color=green] erv-bar{
            background-color: #4CAF50;
        }
        check-burger[data-color=green]:hover erv-bar{
            background-color: #46a049;
        }

        check-burger[data-color=blue] erv-bar{
            background-color: #00ADEF;
        }
        check-burger[data-color=blue]:hover erv-bar{
            background-color: #0b7dda;
        }

        check-burger[data-color=orange] erv-bar{
            background-color: #ff9800;
        }
        check-burger[data-color=orange]:hover erv-bar{
            background-color: #e68a00;
        }

        check-burger[data-color=red] erv-bar{
            background-color: #f44336;
        }
        check-burger[data-color=red]:hover erv-bar{
            background-color: #da190b;
        }

        check-burger[data-color=black] erv-bar{
            background-color: black;
        }
        check-burger[data-color=black]:hover erv-bar{
            background-color: rgb(31, 30, 30);
        }

        check-burger[data-color=white] erv-bar{
            background-color: white;
        }
        check-burger[data-color=white]:hover erv-bar{
            background-color: rgb(220, 220, 220);
        }

        check-burger label erv-container{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            cursor: pointer;
        }

        check-burger erv-bar {
            display: block;
            width: 80%;
            height: 12%;
            background-color: #555555;
            border-radius: 0.25rem;
            transition: 0.3s;
        }

        check-burger input[type=checkbox]:checked ~ erv-container erv-bar:nth-child(1){
            transform: rotate(-45deg) translate(-32%, 220%);
        }

        check-burger label input[type=checkbox]:checked ~ erv-container erv-bar:nth-child(2) { 
            opacity: 0; 
        }

        check-burger label input[type=checkbox]:checked ~ erv-container erv-bar:nth-child(3) { 
            opacity: 0; 
        }

        check-burger label input[type="checkbox"]:checked ~ erv-container erv-bar:nth-child(4) {
            transform: rotate(45deg) translate(-32%, -220%);
        }
        `
);