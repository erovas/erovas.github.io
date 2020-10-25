Ver.registerComponent(
    
    //Nombre del tag que contendra todo el Componente
    'erv-proj', 
    
    //Constructor del Componente
    (function(Ver) {

        const ERVProject = function(element){

            const html =
            `
            <h3 data-slot="title" style="color: #088de6;"></h3>
            <!--<hr>-->

            <br>
            <div data-slot="description"></div>
            <br>
            <div>Implicación: <span data-slot="impli"></span></div>
            <br>
            <p>Dependencias:<p>
            <div style="padding-left: 3rem; padding-top: 1rem;" data-slot="deps">
            </div>
            <br>

            <p>Tecnologias utilizadas:</p>
            <div style="padding-left: 3rem; padding-top: 1rem;" data-slot="items">
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
        ERVProject.prototype = Object.create(Ver.Component.prototype);
        ERVProject.prototype.constructor = Ver.Component;

        //Definición prototipos propios de este Componente
        

        return ERVProject;

    })(Ver),
    `
    erv-proj {
        display: block;
        padding-left: 3rem
    }
    `
);
