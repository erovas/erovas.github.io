/*
 * Viewports.js v1.0.0
 * Pequeño script que genera variables CSS de la forma:
 * - Portrait  viewport height = pvh
 * - Landscape viewport height = lvh
 * - Portrait  viewport width  = pvw
 * - Landscape viewport width  = lvw
 * REQUIERE Device.js
 * UTILIZAR como "defer" o "module"
 * [Back-compatibility: IE11+]
 * (c) 2020 Emanuel Rojas Vásquez
 * MIT License
 * https://github.com/erovas/Viewports.js
 */
Object.defineProperty(window, 'Viewports', {
    value: (function(document) {

        if(!window.Device) {
            console.error('Viewports.js require Device.js');
            return;
        }
    
        let callback = null;
    
        const style = document.createElement('style');
        style.setAttribute('data-id', 'Viewports.js');
        document.head.insertBefore(style, document.head.firstChild);
    
        const setVariables = function(vars) {
    
            const pvh = vars.pvh;
            const pvw = vars.pvw;
            const lvh = pvw;
            const lvw = pvh;

            if(callback)
                callback(vars);
    
            /*let st = `html{
                --pvh:${pvh}px;
                --lvh:${lvh}px;
                --pvw:${pvw}px;
                --lvw:${lvw}px;`;*/
    
            let st = 'html{ --pvh:'+pvh+'px; --lvh:'+lvh+'px; --pvw:'+pvw+'px; --lvw:'+lvw+'px;';
    
            /*for (let i = 2; i <= 100; i++) {
                st += `
                --pvh${i}:${pvh * i}px;
                --lvh${i}:${lvh * i}px;
                --pvw${i}:${pvw * i}px;
                --lvw${i}:${lvw * i}px;`;
            }*/

            /*for (let i = 2; i <= 100; i++) {
                st += '--pvh'+i+':'+(pvh * i)+'px; --lvh'+i+':'+(lvh * i)+'px; --pvw'+i+':'+(pvw * i)+'px; --lvw'+i+':'+(lvw * i)+'px;';
            }*/
    
            style.innerHTML = st + '}';
        }
    
        const getVP = function() {
    
            let pvh = 0;
            let pvw = 0;
            
            if(Device.isFullScreen){
                if(Device.isMobile && screen.height < screen.width){
                    pvh = Device.vw;
                    pvw = Device.vh;
                }
                else if(screen.height > screen.width) { //desktop vertical
                    pvh = Device.vh;
                    pvw = Device.vw; 
                }
                else {  //desktop horizontal
                    pvh = Device.vw;
                    pvw = Device.vh;
                }
            }
            else if(Device.isMobile){
                if(screen.height > screen.width){
                    pvh = Device.vh;
                    pvw = Device.vw;

                    //Corrección para navegador en Xiaomi (parece que funciona con Firefox - mobile)
                    const ppvh = window.outerHeight / 100;
                    pvh = pvh < ppvh? ppvh : pvh;
                }
                else {
                    pvh = Device.vw;
                    pvw = Device.vh;

                    //Corrección para navegador en Xiaomi (parece que funciona con Firefox - mobile)
                    const ppvw = window.outerHeight / 100;
                    pvw = pvw < ppvw? ppvw : pvw;
                }
            }
            else { //isDesktop
                if(screen.height > screen.width){ //vertical
                    pvh = (screen.availHeight - Device.addressBarSize.height) / 100;
                    pvw = screen.availWidth / 100;
                }
                else {  // horizontal
                    pvh = screen.availWidth / 100; 
                    pvw = (screen.availHeight - Device.addressBarSize.height) / 100;
                }
            }
    
            return {
                pvh: pvh,
                pvw: pvw,
                lvh: pvw,
                lvw: pvh
            };
        }
    
        //Seteo inicial
        let fullScreen = Device.isFullScreen;  //si la pag. se recarga en modo fullscreen
        let initialVP = getVP();
        setVariables(initialVP);
    
        //Anti rebote para el resize
        let resizeTimer = null;
    
        const resizer = function() {
            if(resizeTimer)
                clearTimeout(resizeTimer);
    
            resizeTimer = setTimeout(function() {
                
                const currentVP = getVP();
    
                if(currentVP.pvh >= initialVP.pvh){
                    setVariables(currentVP);
                    fullScreen = Device.isFullScreen;
                }
                //de fullscreen a normal screen (si se a recargado pag. en fullscreen)
                else if(currentVP.pvh <= initialVP.pvh && fullScreen && !Device.isFullScreen){
                    initialVP = getVP();
                    setVariables(currentVP);
                    fullScreen = Device.isFullScreen;
                }
                //si se ponen los botones inferiores en pantalla (si se a recargado pag. sin ellos)
                else if(Device.isMobile && currentVP.pvh > 0.8 * initialVP.pvh) {
                    initialVP = getVP();
                    setVariables(currentVP);
                    fullScreen = Device.isFullScreen;
                }
    
            }, 300);
        }
    
        if(window.Events)
            Events.resize(resizer);
        else
            window.addEventListener('resize', resizer, false);

        const output = {};

        Object.defineProperties(output, {
            'Callback': {
                get: function(){
                    return callback;
                },
                set: function(value){
                    if(value.constructor === Function) {
                        callback = value;
                        callback(getVP());
                    }
                }
            }
        });

        return output;
    
    })(document),
    writable: false
});