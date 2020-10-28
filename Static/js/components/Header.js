(function(Ver){

    //Nombre del tag que contendra todo el Componente
    let tagName = 'header';

    //Constructor del Componente
    const Header = function(element){

        const html =
        `
        <div class="background"></div>

        <div class="content">
            <div class="logo">
                <a href="https://erovas.github.io">
                    <img src="Static/img/logo.png">
                </a>

                <check-burger data-color="blue"></check-burger>
            </div>
            
            <nav class="hide" data-slot="default">
                <div class="background"></div>
            </nav>
        </div>
        `;

        //Llamada al super();
        Ver.Component.call(this, { element: element, html: html });

        //configuración adicional propio de este componente
        this.HTMLElement.classList.add('shadow');
        const nav = this.HTMLElement.querySelector('nav');
        const check = Ver.querySelector('header check-burger');

        check.onchange = function(e) {
            if(e.target.checked)
                nav.classList.remove('hide');
            else
                nav.classList.add('hide');
        }

        Events.click('header nav a', function() {
            nav.classList.add('hide');
            check.checked = false;
        });
    }

    //Herencia de los prototipos y constructor de la classe padre
    Header.prototype = Object.create(Ver.Component.prototype);
    Header.prototype.constructor = Ver.Component;

    //Definición prototipos propios de este Componente
    //Sin prototipos

    //Estilos del Componente
    let cssString =
    `
    header {
        height: 8rem;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }

    header.shadow {
        box-shadow: 0 10px 30px -10px rgba(2,12,27,0.7);
    }

    header .background {
        position: absolute;
        background-color: #293B4C;
        height: 100%;
        width: 100%;
        opacity: 0.95;
        z-index: -1;
    }

    header .content {
        height: 100%;
        margin: auto;
        max-width: 154.64rem;
        font-size: 2rem;
        color: white;

        display: flex;
        justify-content: flex-end;
    }

    header .content .logo {
        flex-grow: 1; 
        display: flex; 
        align-items: center;
        justify-content: space-between;
    }

    header .content .logo a {
        height: 50%;
    }

    header .content .logo img {
        /*height: 100%;*/
        /*width: 55%;*/
        height: 4rem;
        width: 9.562rem;
        padding-left: 0.7rem;
    }

    header .content .logo img:hover {
        filter: blur(2px);
    }

    header .content nav a {
        text-decoration: none;
        color: inherit;
        margin-left: 0.7rem;
        margin-right: 0.7rem;
        transition: 0.3s color;
    }

    header .content a:hover {
        color: #088de6;
    }

    header .content a span {
        color: #088de6;
    }

    header nav {
        position: fixed;
        top: 8rem;
        width: 100%;
        height: 92rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        font-size: 4rem;
        margin: auto;
    }

    header nav p {
        display: none;
    }

    header nav {
        transition-duration: 0.3s;
        transition-property: transform;
    }

    header nav.hide {
        transform: translateX(100%);
    }
    `

    //Registro del Componente
    Ver.registerComponent(tagName, Header, cssString);

    //Liberación de memoria forzada o eso creo
    tagName = cssString = null;

    //Estilos adicionales responsive del Componente utilizando Styler.js (para evitar over-queries)
    Styler.all.addStyles({
        '4-10': 
                `
                header check-burger {
                    display: none;
                }

                header nav.hide {
                    transform: translateX(0%);
                }

                header nav {
                    position: unset;
                    top: 0;
                    height: 92%;
                    font-size: 1.8rem;

                    height: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    flex-direction: row;
                    margin-right: 1.5rem
                }

                header nav p {
                    display: block;
                    font-size: 1rem;
                }

                header nav a, header nav p {
                    margin-top: 0.7rem;
                }

                header nav .background {
                    display: none;
                }
                `
    });

})(Ver);