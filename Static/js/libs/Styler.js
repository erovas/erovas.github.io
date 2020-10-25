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
        Styles.all.general.setAttribute('data-id', 'all-general');

        //#region Metodos

        const addBreakpoint = function(device, name, breakpoint, cssString){
            const Dev = Styles[device];
            const Break = parseInt(breakpoint) + 1;

            if(!Dev || Dev[name] || isNaN(Break))
                return;

            const style = Dev[name] = document.createElement('style');
            style.setAttribute('data-id', device+'-'+name);
            //style.innerHTML = '@media screen and (min-width: ' + Break + 'px){';
            style.media = "screen and (min-width:"+Break+"px)";
            
            if(cssString)
                style.innerHTML += cssString;

            //style.innerHTML += '}';

            document.head.appendChild(style);
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

            if(device === 'mobile' || device === 'tablet'){
                const tag = style[name];
                if(tag)
                    tag.innerHTML += cssString;
            }
            else {
                const tag = style[name];
                if(!tag)
                    return;
                if(name === 'general')
                    tag.innerHTML += cssString;
                else 
                    tag.innerHTML = tag.innerHTML.substring(0, tag.innerHTML.length - 1) + cssString + '}';
            }
        }

        const getCss = function(device, name){
            device = device.toLowerCase();
            name = name.toLowerCase();
            const style = Styles[device];
            
            if(!style)
                return;

            const tag = style[name];
            if(!tag)
                return;
            
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
                tag.setAttribute('data-id', name+'-'+breakPoints[i]);
                style[breakPoints[i]] = tag;
            }

            //Insertado estatico
            document.head.appendChild(style['general']);

            const reference = style['general'].nextElementSibling;

            //Set inicial de insertado dinamico
            if(screen.height > screen.width)
                document.head.insertBefore(style.portrait, reference);
            else
                document.head.insertBefore(style.landscape, reference);

            //Anti rebote para el resize
            let resizeTimer = null;

            //Insertado dinamico
            const setStyle = function(e) {
                if(resizeTimer)
                    clearTimeout(resizeTimer);

                resizeTimer = setTimeout(function(){
                    if(style['portrait'].parentNode === document.head)
                        document.head.removeChild(style['portrait']);
                    else if(style['landscape'].parentNode === document.head)
                        document.head.removeChild(style['landscape']);

                    if(screen.height > screen.width)
                        document.head.insertBefore(style['portrait'], reference);
                    else
                        document.head.insertBefore(style['landscape'], reference);
                }, 150);
            }

            if(window.Events)  //Si Events.js existe
                Events.resize(setStyle);
            else
                window.addEventListener('resize', setStyle, false);
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
            Styles.desktop.general.setAttribute('data-id', 'desktop-general');
        }

        //Para liberar la memoria rapidamente o eso creo
        set_Mobile_Tablet = isMobile = isTablet = null

        return {
            addCss: addCss,
            getCss: getCss,
            addStyles: addStyles,
            importStyle: importStyle,
            addBreakpoint: addBreakpoint,
            removeBreakpoint: removeBreakpoint,
            all: {
                addCss: function(breakpoint, cssString){
                    addCss('all', breakpoint, cssString);
                },
                getCss: function(breakpoint){
                    addCss('all', breakpoint);
                },
                addStyles: function(styles){
                    addStyles({ all: styles });
                },
                importStyle: function(breakpoint, url){
                    importStyle('all', breakpoint, url);
                },
                addBreakpoint: function(name, breakpoint, cssString){
                    addBreakpoint('all', name, breakpoint, cssString);
                },
                removeBreakpoint: function(name){
                    removeBreakpoint('all', name);
                }
            },
            desktop: {
                addCss: function(breakpoint, cssString){
                    addCss('desktop', breakpoint, cssString);
                },
                getCss: function(breakpoint){
                    addCss('desktop', breakpoint);
                },
                addStyles: function(styles){
                    addStyles({ desktop: styles });
                },
                importStyle: function(breakpoint, url){
                    importStyle('desktop', breakpoint, url);
                },
                addBreakpoint: function(name, breakpoint, cssString){
                    addBreakpoint('desktop', name, breakpoint, cssString);
                },
                removeBreakpoint: function(name){
                    removeBreakpoint('desktop', name);
                }
            },
            mobile: {
                addCss: function(breakpoint, cssString){
                    addCss('mobile', breakpoint, cssString);
                },
                getCss: function(breakpoint){
                    addCss('mobile', breakpoint);
                },
                addStyles: function(styles){
                    addStyles({ mobile: styles });
                },
                importStyle: function(breakpoint, url){
                    importStyle('mobile', breakpoint, url);
                },
                addBreakpoint: function(name, breakpoint, cssString){
                    addBreakpoint('mobile', name, breakpoint, cssString);
                },
                removeBreakpoint: function(name){
                    removeBreakpoint('mobile', name);
                }
            },
            tablet: {
                addCss: function(breakpoint, cssString){
                    addCss('tablet', breakpoint, cssString);
                },
                getCss: function(breakpoint){
                    addCss('tablet', breakpoint);
                },
                getCss: function(breakpoint){
                    addCss('tablet', breakpoint);
                },
                addStyles: function(styles){
                    addStyles({ tablet: styles });
                },
                importStyle: function(breakpoint, url){
                    importStyle('tablet', breakpoint, url);
                },
                addBreakpoint: function(name, breakpoint, cssString){
                    addBreakpoint('tablet', name, breakpoint, cssString);
                },
                removeBreakpoint: function(name){
                    removeBreakpoint('tablet', name);
                }
            },
        }
    })(document),
    writable: false
})