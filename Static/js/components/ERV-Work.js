Ver.registerComponent(
    
    //Nombre del tag que contendra todo el Componente
    'erv-work', 
    
    //Constructor del Componente
    (function(Ver) {

        const ERVWork = function(element){

            const html =
            `
            <h3 data-slot="title" style="color: #088de6;"></h3>
            <!--<hr>-->

            <br>
            <div data-slot="description"></div>
            <br>

            <p>Funcionalidades especiales:</p>
            <div style="padding-left: 3rem; padding-top: 1rem;" data-slot="func">
            </div>
            <br>
            <div>Implicación: <span data-slot="impli"></span></div>
            <br>

            <p> Tecnologias utilizadas: </p>
            <div style="padding-left: 3rem; padding-top: 1rem;" data-slot="tech">
            </div>
            <br>

            <p> Screenshots </p>
            <div data-slot="pics" style="padding-top: 1rem">
                
            </div>
            <br>
            <div data-slot="buttons"></div>
            `;

            //Llamada al super();
            Ver.Component.call(this, { element: element, html: html });
        }

        //Herencia de los prototipos y constructor de la classe padre
        ERVWork.prototype = Object.create(Ver.Component.prototype);
        ERVWork.prototype.constructor = Ver.Component;

        //Definición prototipos propios de este Componente
        

        return ERVWork;

    })(Ver),
    `
    erv-work {
        display: block;
        padding-left: 3rem
    }
    `
);
