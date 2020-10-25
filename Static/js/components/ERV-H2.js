Ver.registerComponent(
    
    //Nombre del tag que contendra todo el Componente
    'erv-h2', 
    
    //Constructor del Componente
    (function(Ver) {

        const ERVH2 = function(element){

            const html =
            `
            <h2 data-slot="n"></h2><h2 data-slot="default" style="padding-right: 1rem; padding-left: 1rem;"> </h2>
            <div style="height: 1px; flex-grow: 1; border-top: 1px solid;"></div>
            `;

            //Llamada al super();
            Ver.Component.call(this, { element: element, html: html });
        }

        //Herencia de los prototipos y constructor de la classe padre
        ERVH2.prototype = Object.create(Ver.Component.prototype);
        ERVH2.prototype.constructor = Ver.Component;

        //Definición prototipos propios de este Componente
        

        return ERVH2;

    })(Ver),
    `
    erv-h2 {
        display: flex; 
        width: 100%; 
        justify-content: center; 
        align-items: center;
    }
    `
);
