/*
 * Respontative.js v1.0.0
 * Pequeña libreria de ayuda para Styler.js, para insertar estilos CSS segun el dispositivo
 * [Back-compatibility: IE11+]
 * (c) 2020 Emanuel Rojas Vásquez
 * MIT License
 * https://github.com/erovas/Respontative.js
 */
Object.defineProperty(window, 'Respontative', {
    value: (function(document){

        if(!window.Styler) {
            console.error('Respontative.js require Styler.js');
            return;
        }

        //Recuperación del tipo de estilos ("responsive" o "adaptative")
        let script = document.querySelector('script[data-type]');
        let type = 'responsive';

        if(script)
            type = script.getAttribute('data-type').toLowerCase() === 'adaptative'? 'adaptative': type;

        if(type === 'responsive')  //los estilos para mobile y tablet NO se "ejecutan"
            type = 'all';
        else if(type == 'adaptative') //los estilos para mobile y tablet SÍ se "ejecutan"
            type = 'desktop';
            
        //Seteo de los breakpoints segun el "type"
        let names = [];
        let NoBreakpoints = 10;

        let isMobile = null;
        let isTablet = null;

        if(window.Device){
            isMobile = Device.isMobile;
            isTablet = Device.isTablet;
        }
        else {
            isMobile = screen.availHeight === screen.height && screen.availWidth === screen.width && window.outerHeight - window.innerHeight === 0;
            isTablet = isMobile && Math.min(screen.width, screen.height) > 425;
        }

        //NoBreakpoints = isTablet? 4 : (isMobile? 2 : NoBreakpoints);
    
        let height = Math.min(screen.height, screen.width);
        let width = height * 2;
        let breakpoints = (width - 320) / (isTablet? 4 : (isMobile? 2 : NoBreakpoints));
    
        for (let i = 1; i <= NoBreakpoints; i++)
            names.push(i+'-'+NoBreakpoints);
        
        let k = 0;

        //for (let j = breakpoints; j < breakpoints * NoBreakpoints; j += breakpoints){
        //for (let j = 320; j < (breakpoints * NoBreakpoints) + 320; j += breakpoints){
        for (let j = 320; j < (breakpoints * (isTablet? 4 : (isMobile? 2 : NoBreakpoints))) + 320; j += breakpoints){
            window.Styler[type].addBreakpoint(names[k], j);
            k++;
        }
            
        
        //Liberación de memoria o eso creo
        script = names = NoBreakpoints = isMobile = isTablet = height = width = breakpoints = k = null;

        //Metodos para la estilizacion de los breakpoints
        const addCss = function(device, name, cssString){
            device = device === 'respontative'? type : device;
            
            if(type === 'all' && device !== 'all')
                return;

            Styler.addCss(device, name, cssString);
        }

        const addStyles = function(styles){
            if(styles && styles.constructor === Object){
                //toca utilizar "var" por IE
                for (var device in styles){
                    device = device === 'respontative'? type : device;

                    if(type === 'all' && device !== 'all')
                        return;

                    if(styles[device].constructor === Object)
                        for (var breakpoint in styles[device])
                            Styler.addCss(device, breakpoint, styles[device][breakpoint]);
                }
            }
        }

        const importStyle = function(device, breakpoint, url) {
            device = device === 'respontative'? type : device;
            
            if(type === 'all' && device !== 'all')
                return;

            Styler.importStyle(device, breakpoint, url);
        }

        return {
            addCss: addCss,
            addStyles: addStyles,
            importStyle: importStyle,
            respontative: {
                addCss: function(breakpoint, cssString){
                    addCss(type, breakpoint, cssString);
                },
                addStyles: function(styles){
                    const out = {}
                    out[type] = styles;
                    addStyles(out);
                },
                importStyle: function(breakpoint, url){
                    importStyle(type, breakpoint, url);
                },
            },
            mobile: {
                addCss: function(breakpoint, cssString){
                    addCss('mobile', breakpoint, cssString);
                },
                addStyles: function(styles){
                    addStyles({ mobile: styles });
                },
                importStyle: function(breakpoint, url){
                    importStyle('mobile', breakpoint, url);
                }
            },
            tablet: {
                addCss: function(breakpoint, cssString){
                    addCss('tablet', breakpoint, cssString);
                },
                addStyles: function(styles){
                    addStyles({ tablet: styles });
                },
                importStyle: function(breakpoint, url){
                    importStyle('tablet', breakpoint, url);
                }
            },
        }
    })(document),
    writable: false
});