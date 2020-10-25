Ver.registerComponent(
    
    //Nombre del tag que contendra todo el Componente
    'erv-exp', 
    
    //Constructor del Componente
    (function(Ver) {

        const ERVExp = function(element){

            const html =
            `
            <h3 data-slot="title" style="color: #088de6;"></h3>
            <!--<hr>-->

            <br>
            <div data-slot="duration"></div>
            <br>
            <div data-slot="position"></div>
            <br>
            <div style="padding-left: 2rem;" data-slot="items">
            </div>
            `;

            //Llamada al super();
            Ver.Component.call(this, { element: element, html: html });
        }

        //Herencia de los prototipos y constructor de la classe padre
        ERVExp.prototype = Object.create(Ver.Component.prototype);
        ERVExp.prototype.constructor = Ver.Component;

        //Definición prototipos propios de este Componente
        

        return ERVExp;

    })(Ver),
    `
    erv-exp {
        display: block;
        padding-left: 3rem
    }
    `
);
