/*
 * Styler.js v1.0.0
 * Pequeña libreria de ayuda, para insertar estilos CSS segun el dispositivo (movil, tablet, escritorio o todos)
 * [Back-compatibility: IE11+]
 * (c) 2020 Emanuel Rojas Vásquez
 * MIT License
 * https://github.com/erovas/Styler.js
 */
Object.defineProperty(window, 'Styler', {
    value: (function(document){

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

        const Styles = {
            //Estilos aplicados a todos los dispositivos
            all: {
                general: document.createElement('style'),
                //name1: <style>,
                //name2: <style>
            },
            /*
            desktop: {
                general: <style>,
                name1: <style>,
                name2: <style>
            },
            mobile: {
                general: <style>,
                portrait: <style>,
                landscape: <style>,
                name1: <style>,
                name2: <style>
            },
            tablet: {
                general: <style>,
                portrait: <style>,
                landscape: <style>,
                name1: <style>,
                name2: <style>
            },
            */
        };

        //Inserción del estilo para todos los dispositivos
        document.head.appendChild(Styles.all.general);
        Styles.all.general.setAttribute('styler-id', 'all-general');

        //#region Metodos

        const addBreakpoint = function(device, name, breakpoint, cssString){
            const Dev = Styles[device];
            const Break = parseInt(breakpoint) + 1;

            if(!Dev || Dev[name] || isNaN(Break))
                return;

            const style = Dev[name] = document.createElement('style');
            style.setAttribute('styler-id', device+'-'+name);
            style.media = "screen and (min-width:"+Break+"px)";
            
            if(cssString)
                style.innerHTML += cssString;

            const stylesNodes = document.head.querySelectorAll('style[styler-id*="'+device+'"]');
            document.head.insertBefore(style, stylesNodes[stylesNodes.length - 1].nextSibling);
        }

        const removeBreakpoint = function(device, name){
            const Dev = Styles[device];

            if(!Dev || Dev[name])
                return;

            document.head.removeChild(Dev[name]);
            delete Dev[name];
        }

        const addCss = function(device, name, cssString){
            device = device.toLowerCase();
            name = name.toLowerCase();
            const style = Styles[device];

            if(!style)
                return;

            const tag = style[name];
            
            if(tag)
                tag.innerHTML += cssString;
        }

        const getCss = function(device, name){
            device = device.toLowerCase();
            name = name.toLowerCase();
            const style = Styles[device];
            
            if(!style)
                return;

            const tag = style[name];
            
            if(tag)
                return tag.innerHTML;
        }

        const addStyles = function(styles) {
            if(styles && styles.constructor === Object)
                //toca utilizar "var" por IE
                for (var device in styles)
                    if(styles[device].constructor === Object)
                        for (var breakpoint in styles[device])
                            addCss(device, breakpoint, styles[device][breakpoint]);
        }

        const importStyle = function(device, breakpoint, url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'text';

            xhr.onerror = function(e) {
                console.error('status code: ' + xhr.status + '; text: ' + xhr.statusText);
            }

            xhr.onload = function(e) {
                addCss(device, breakpoint, xhr.response);
            }

            xhr.send();
        }
        
        //#endregion

        let set_Mobile_Tablet = function(style, name){
            
            const breakPoints = ['general', 'portrait', 'landscape'];

            for (i = 0; i < breakPoints.length; i++) {
                const tag = document.createElement('style');
                tag.setAttribute('styler-id', name+'-'+breakPoints[i]);
                style[breakPoints[i]] = tag;
            }

            const reference = style[breakPoints[0]];

            //Insertado estatico
            document.head.appendChild(reference);

            //Set inicial de insertado dinamico
            if(screen.height > screen.width)
                document.head.insertBefore(style[breakPoints[1]], reference.nextSibling);
            else
                document.head.insertBefore(style[breakPoints[2]], reference.nextSibling);

            //Anti rebote para el resize
            let resizeTimer = null;

            //Insertado dinamico
            const setStyle = function(e) {
                if(resizeTimer)
                    clearTimeout(resizeTimer);

                resizeTimer = setTimeout(function(){
                    if(style[breakPoints[1]].parentNode === document.head)
                        document.head.removeChild(style[breakPoints[1]]);
                    else if(style[breakPoints[2]].parentNode === document.head)
                        document.head.removeChild(style[breakPoints[2]]);

                    if(screen.height > screen.width)
                        document.head.insertBefore(style[breakPoints[1]], reference.nextSibling);
                    else
                        document.head.insertBefore(style[breakPoints[2]], reference.nextSibling);
                }, 150);
            }

            if(window.Events)  //Si Events.js existe
                Events.resize(setStyle);
            else
                window.addEventListener('resize', setStyle, false);
        }

        let generate = function(device){
            return {
                addCss: function(breakpoint, cssString){
                    addCss(device, breakpoint, cssString);
                },
                getCss: function(breakpoint){
                    addCss(device, breakpoint);
                },
                addStyles: function(styles){
                    const obj = {};
                    obj[device] = styles
                    addStyles(obj);
                },
                importStyle: function(breakpoint, url){
                    importStyle(device, breakpoint, url);
                },
                addBreakpoint: function(name, breakpoint, cssString){
                    addBreakpoint(device, name, breakpoint, cssString);
                },
                removeBreakpoint: function(name){
                    removeBreakpoint(device, name);
                }
            }
        }

        if(isTablet){
            //Estilos aplicados a solo tablet
            Styles['tablet'] = {}
            set_Mobile_Tablet(Styles.tablet, 'tablet');
        }
        else if(isMobile){
            //Estilos aplicados a solo mobile
            Styles['mobile'] = {}
            set_Mobile_Tablet(Styles.mobile, 'mobile');
        }
        else {
            //Estilos aplicados a solo desktop
            Styles['desktop'] = {
                general: document.createElement('style')
            }
            document.head.appendChild(Styles.desktop.general);
            Styles.desktop.general.setAttribute('styler-id', 'desktop-general');
        }

        const all = generate('all');
        const desktop = generate('desktop');
        const mobile = generate('mobile');
        const tablet = generate('tablet');

        //Para liberar la memoria rapidamente o eso creo
        generate = set_Mobile_Tablet = isMobile = isTablet = null;

        return {
            addCss: addCss,
            getCss: getCss,
            addStyles: addStyles,
            importStyle: importStyle,
            addBreakpoint: addBreakpoint,
            removeBreakpoint: removeBreakpoint,
            all: all,
            desktop: desktop,
            mobile: mobile,
            tablet: tablet
        }
    })(document),
    writable: false
})