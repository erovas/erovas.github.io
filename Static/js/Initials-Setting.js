/*Events.ready*/(function(document){

    //#region Set del REM (font-size de html)

    const html = document.getElementsByTagName('html')[0];

    window.Viewports.Callback = function(vp){
        if(Device.isMobile)
            html.style.fontSize = vp.pvh + 'px';
        else
            html.style.fontSize = vp.lvh + 'px';
    }

    //#endregion

    //#region Set de los breakpoints

    let names = [];
    let NoBreakpoints = 10;
    let NoBpfinal = Device.isTablet? 4 : (Device.isMobile? 2 : NoBreakpoints)

    let height = Math.min(screen.height, screen.width);
    let width = height * 2;
    let breakpoints = (width - 320) / NoBpfinal;

    for (let i = 1; i <= NoBreakpoints; i++)
        names.push(i+'-'+NoBreakpoints);
        
    let k = 0;

    for (let j = 320; j < (breakpoints * (NoBpfinal === 2? 3: NoBpfinal)) + 320; j += breakpoints){
        window.Styler.all.addBreakpoint(names[k], j);
        k++;
    }

    //Liberación de memoria o eso creo
    names = NoBreakpoints = NoBpfinal = height = width = breakpoints = k = null;

    //#endregion

    //#region Set de estilos generales

    //Reset basico de estilos
    Styler.all.addCss('general', '* { margin: 0; padding: 0; box-sizing: border-box; vertical-align: top; }');
    
    //Barra de scroll custom
    Styler.all.addCss('general', 'body::-webkit-scrollbar { width: auto; } body::-webkit-scrollbar-track { background: #202020; } body::-webkit-scrollbar-thumb { background-color: #4D4D4D; }');
    
    //Set html y body general
    Styler.all.addCss('general', "html { scroll-behavior: smooth; } body { background-color: #27303C; color: #CCD6F6; font-family: 'Arial'; }");

    //#endregion

})(document);

/*

    1-10        Mobile portrait
    2-10        Mobile landscape

    2-10        Tablet portrait
    3-10        Tablet landscape
*/

/*

    1º Device.js  <!-- Obtiene algunas caracteristicas del navegador segun el dispositivo -->
    2º Events.js  <!-- Controlador para delegación de eventos -->
    3º Ver.js     <!-- Mini framework para componentes web -->
    4º Styler.js  <!-- Controlador para estilizado responsive del documento -->
    
    1º defer Viewports.js  <!-- Genera variables CSS dinamicas con el valor del viewport del dispositivo -->

    2º defer erv-init.js   <!-- Inicializador basico para los estilos de los componentes (vh, css variables) *opcional -->
    
    3º defer erv-componente1.js
    4º defer erv-componente2.js
    ...
    ...
    ...

*/