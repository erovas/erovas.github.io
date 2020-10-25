/*
 * Events.js v1.0.0
 * Pequeña libreria para delegación de eventos
 * (c) 2020 Emanuel Rojas Vásquez
 * MIT License
 * [Compatibility IE11+]
 * https://github.com/erovas/Events.js
 */
Object.defineProperty(window, 'Events', {
    value: ( function(document) {

        //Polyfill de "closest"

        if (!Element.prototype.matches)
            Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

        if (!Element.prototype.closest) {
            Element.prototype.closest = function(s) {
                var el = this;

                do {
                    if (el.matches(s)) 
                        return el;
                    
                    el = el.parentElement || el.parentNode;
                } 
                while (el !== null && el.nodeType === 1);
            
                return null;
            };
        }

        const collection = {
            click: {},
            mousedown: {},
            mouseup: {},

            touchstart: {},
            touchmove: {},
            touchend: {},

            mousedown: {},
            mousemove: {},
            mouseup: {},

            resize: {},
            ready: [],
            load: []
        }

        const addEvent = function(event, eventName, selector, callback) {

            if(!selector || !callback || callback.constructor !== Function)
                return null;

            //"selector" NO es valido para los siguiente casos
            if (['*', 'window', 'document', 'document.documentElement', window, document, document.documentElement].indexOf(selector) > -1) 
                return null;

            //si "selector" es un HTMLElement o se convierte en un string
            let element = selector instanceof HTMLElement? selector: selector+'';
            
            // Si "Ver.js" existe
            if(window.Ver)
                element = selector instanceof Ver.Component? selector.HTMLElement: element;

            if(Object.keys(event).length === 0){
                document.addEventListener(eventName, function(e){
                    
                    const target = e.target;

                    for (var key in event){
                        const selector = event[key].selector;
                        
                        // objeto/valor original del parametro "selector"
                        e.Selector = event[key].origin;
                        
                        if(typeof selector === 'string') {
                            const tagTarget = target.closest(selector);
                            e.tagTarget = tagTarget;
                            
                            if(tagTarget)
                                event[key].callback(e, this);

                            continue;
                        }

                        //El elemento que tiene el evento
                        e.tagTarget = selector;

                        if(selector === target || selector.contains(target))
                            event[key].callback(e, this);
                    }
                }, { passive: false });
                //}, false);
            }

            const index = Object.keys(event).length;
            event[index] = {
                selector: element,
                origin: selector,
                callback: callback
            }
            
            return {
                callback: callback,
                index: index
            }
        }

        const removeEvent = function(index, event) {
            if(event[index]){
                delete event[index];
                return true;
            }
            return false;
        }

        // document.onclick
        const click = function(selector, callback) {
            return addEvent(collection.click, 'click', selector, callback);
        }

        const removeClick = function(index) {
            return removeEvent(index, collection.click);
        }

        // document.onmousedown
        const mousedown = function(selector, callback) {
            return addEvent(collection.mousedown, 'mousedown', selector, callback);
        }

        const removeMousedown = function(index) {
            return removeEvent(index, collection.mousedown);
        }

        // document.onmousemove
        const mousemove = function(selector, callback) {
            return addEvent(collection.mousemove, 'mousemove', selector, callback);
        }

        const removeMousemove = function(index) {
            return removeEvent(index, collection.mousedown);
        }

        // document.onmouseup
        const mouseup = function(selector, callback) {
            return addEvent(collection.mouseup, 'mouseup', selector, callback);
        }

        const removeMouseup = function(index) {
            return removeEvent(index, collection.mouseup);
        }

        // document.ontouchstart
        const touchstart = function(selector, callback) {
            return addEvent(collection.touchstart, 'touchstart', selector, callback);
        }

        const removeTouchstart = function(index) {
            return removeEvent(index, collection.touchstart);
        }

        // document.ontouchmove
        const touchmove = function(selector, callback) {
            return addEvent(collection.touchmove, 'touchmove', selector, callback);
        }

        const removeTouchmove = function(index) {
            return removeEvent(index, collection.touchmove);
        }

        // window.ontouchend
        const touchend = function(selector, callback) {
            return addEvent(collection.touchend, 'touchend', selector, callback);
        }

        const removeTouchend = function(index) {
            return removeEvent(index, collection.touchend);
        }

        // window.onresize
        const resize = function(callback) {
            if(callback.constructor !== Function)
                return null;
            
            if(Object.keys(collection.resize).length === 0){
                window.addEventListener('resize', function(e){
                    for (var key in collection.resize)
                        collection.resize[key](e, this);
                }, false);
            }

            const index = Object.keys(collection.resize).length;
            collection.resize[index] = callback;
            
            return {
                callback: callback,
                index: index
            }
        }

        const removeResize = function(index) {
            return removeEvent(index, collection.resize);
        }

        // DOM ready
        const ready = function(callback) {
            if(callback.constructor !== Function)
                return null;

            if(collection.ready.length === 0){
                document.addEventListener('DOMContentLoaded', function(e) {
                    for (let i = 0; i < collection.ready.length; i++)
                        collection.ready[i](e, this);
                    
                    delete collection.ready;
                }, { once: true });
            }

            collection.ready.push(callback);
            return callback;
        }

        // window ready
        const load = function(callback) {
            if(callback.constructor !== Function)
                return null;

            if(collection.load.length === 0){
                window.addEventListener('load', function(e) {
                    for (let i = 0; i < collection.load.length; i++)
                        collection.load[i](e, this);
                    
                    delete collection.load;
                }, { once: true });
            }

            collection.load.push(callback);
            return callback;
        }

        return {
            click: click,
            removeClick: removeClick,
            mousedown: mousedown,
            removeMousedown: removeMousedown,
            mousemove: mousemove,
            removeMousemove: removeMousemove,
            mouseup: mouseup,
            removeMouseup: removeMouseup,
            touchstart: touchstart,
            removeTouchstart: removeTouchstart,
            touchmove: touchmove,
            removeTouchmove: removeTouchmove,
            touchend: touchend,
            removeTouchend: removeTouchend,
            resize: resize,
            removeResize: removeResize,
            ready: ready,
            load: load
        }

    })(document),

    writable: false
});