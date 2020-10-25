/*
 * Ver.js v1.0.0

 * Ver.js es un mini framework de JavaScript para la creación de componentes web personalizados.

 * MIT License

    Copyright (c) 2020 Emanuel Rojas Vásquez

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    
 * [Back-compatibility: IE11+]
 * https://github.com/erovas/Ver.js
 */
Object.defineProperty(window, "Ver", {

    value: (function(document) {

        //#region CSS

        const style = document.createElement('style');
        style.setAttribute('ver-id', 'Ver.js');
        document.head.insertBefore(style, document.head.firstChild); //Al inicio de <head>

        const addCss = function(css, component) {
            component = component || 'Ver,js';
            if(component === 'Ver.js')
                style.innerHTML += css;

            const tag = document.querySelector('style[ver-id="'+component+'"]')
            if(tag)
                tag.innerHTML += css;
        }

        const getCss = function(component){
            component = component || 'Ver.js';
            if(component === 'Ver.js')
                return style.innerHTML;

            const tag = document.querySelector('style[ver-id="'+component+'"]')
            if(tag)
                return tag.innerHTML;

            return null;
        }

        //#endregion

        //#region Component DEFINICIÓN

        const Component = function(parameters){
            
            const element = parameters.element;

            //Para un tag que está en el DOM y NO está renderizado
            if(element instanceof HTMLElement){
                
                //Si el elemento NO esta renderizado
                if(!element.hasAttribute('data-render')){
                    let content = [];  //Nodos que contiene el tag sin renderizar
                    let innerText = "";  //Si NO hay nodos, entonces el texto si es que lo hay
                    
                    //Si el elemento SI tiene nodos dentro
                    if(element.children.length > 0)
                        //content = Array.from(element.children);
                        content = [].slice.call(element.children);
                    //Si el elemento NO tiene nodos dentro
                    else
                        innerText = element.innerText;

                    //Se renderiza el Componente
                    element.innerHTML = parameters.html.trim();
                    element.setAttribute('data-render', '');

                    //si el elemento tenia nodos dentro se ejecutaria este loop
                    for (let i = 0; i < content.length; i++) {
                        //Elemento a añadir al componente
                        const item = content[i];
                        //si el elemento está destinado a un slot del Componente, se recupera el nombre del slot
                        const slotname = item.getAttribute('data-slot') || 'default';
                        //si el Componente tiene un elemento con ese slotname, se recupera
                        const slotContainer = element.querySelector('[data-slot='+ slotname + ']');

                        //Si existe el slot container, se agrega el elemento en él
                        if(slotContainer) {
                            //por si el elemento a agregar no tiene slot, se mete en el slot default
                            item.setAttribute('data-slot', slotname);
                            //Se agrega el elemento en el slot container
                            slotContainer.appendChild(item);
                        }
                    }

                    //si el element tiene solo texto se ejecutaria esta condición
                    if(innerText.trim() !== ""){
                        const slotContainer = element.querySelector('[data-slot=default]');
                        slotContainer.appendChild(document.createTextNode(innerText));
                    }

                }

                //Elemento html renderizado
                this.HTMLElement = element;
                return;
            }

            //Renderizado del Componente, porque se va a crear de cero
            const div = document.createElement('div');
            const tagName = parameters.tagName;
            //div.innerHTML = `<${element}>${parameters.html.trim()}</${element}>`;
            div.innerHTML = '<'+element+'>'+ parameters.html.trim() + '</'+element+'>';
            const renderized = div.firstChild;
            renderized.setAttribute('data-render', '');

            //Elemento html generado y renderizado vacio
            this.HTMLElement = renderized;
        }

        let attributes = {
            1: ['tagName', 'classList', 'style'],
            2: ['id', 'title'],
            3: ["innerText","innerHTML","textContent"],
            4: ['setAttribute', 'getAttribute', 'hasAttribute', 'addEventListener', 'removeEventListener', 'remove']
        }

        for (let i = 0; i < attributes[1].length; i++) {
            const att = attributes[1][i];
            Object.defineProperty(Component.prototype, att, {
                get: function(){
                    return this.HTMLElement[att];
                }
            });
        }

        for (let i = 0; i < attributes[2].length; i++) {
            const att = attributes[2][i];
            Object.defineProperty(Component.prototype, att, {
                get: function(){
                    return this.HTMLElement[att];
                },
                set: function(value){
                    this.HTMLElement[att] = value + '';
                }
            });
        }

        for (let i = 0; i < attributes[3].length; i++) {
            const att = attributes[3][i];
            Object.defineProperty(Component.prototype, att, {
                get: function(){
                    const component = this.HTMLElement;

                    //Si es un Componente compuesto (con varios elementos dentro)
                    if(component.children.length > 0){
                        const slotContainer = component.querySelector('[data-slot=default]');
                        if(slotContainer)
                            return slotContainer[att];
                        
                        return "";
                    }
                    //Si es un Componente simple (solo la etiqueta)
                    return component[att];
                },
                set: function(value){
                    const component = this.HTMLElement;

                    //Si es un Componente compuesto (con varios elementos dentro)
                    if(component.children.length > 0){
                        const slotContainer = component.querySelector('[data-slot=default]');
                        if(slotContainer)
                            return slotContainer[att] = value + '';
                        
                        return;
                    }
                    //Si es un Componente simple (solo la etiqueta)
                    return component[att] = value + '';
                }
            });
        }

        for (let i = 0; i < attributes[4].length; i++) {
            const att = attributes[4][i];
            Object.defineProperty(Component.prototype, att, {
                get: function(){
                    const tag = this.HTMLElement;
                    return function() {
                        return tag[att].apply(tag, arguments);
                    }
                }
            });
        }

        attributes = null;  //Para liberar la memoria rapidamente o eso creo

        //Retorna el Ver Component o HTMLElement encontrado con el selector
        const querySelector = function(selectors, nodeRef, slot) {

            const NodeRef = nodeRef? (nodeRef.constructor === Component? nodeRef.HTMLElement : nodeRef) : document;
            const selector = slot? '[data-slot=' + slot + ']' + selectors : selectors+"";

            const temp = NodeRef.querySelector(selector);
                
            //Si hay algun elemento que concuerde con el selector
            if(temp){
                const tagName = temp.tagName.toLowerCase();
                
                //Si es un Ver Component, lo retorna
                if(Components[tagName])
                    return new Components[tagName](temp);
            }

            //Retorna el HTMLElement o null
            return temp;
        }

        //Retorna un array que contiene Ver Component y HTMLElement que concuerdan con el selector
        const querySelectorAll = function(selectors, nodeRef, slot) {

            const NodeRef = nodeRef? (nodeRef.constructor === Component? nodeRef.HTMLElement : nodeRef) : document;
            const selector = slot? '[data-slot=' + slot + ']' + selectors : selectors+"";

            const temp = NodeRef.querySelectorAll(selector);
            const out = [];

            for (let i = 0; i < temp.length; i++) {
                const item = temp[i];
                const tagName = item.tagName.toLowerCase();

                if(Components[tagName])
                    out.push(new Components[tagName](item));
                else
                    out.push(temp);
            }

            return out;
        }

        //Retorna un Ver component que concuerde con el Id
        const getComponentById = function(elementId) {
            const temp = document.getElementById(elementId);
                
            if(!temp) 
                return temp;

            const tagName = temp.tagName.toLowerCase();
            if(Components[tagName])
                return new Components[tagName](temp);
            
            return null;
        }

        //Retorna un Array de Ver Component que concuerde con el qualifiedName
        const getComponentsByTagName = function(qualifiedName, nodeRef) {
            const NodeRef = nodeRef? (nodeRef.constructor === Component? nodeRef.HTMLElement : nodeRef) : document;

            const temp = NodeRef.getElementsByTagName(qualifiedName);
            const out = [];

            for (let i = 0; i < temp.length; i++) {
                const item = temp[i];
                const tagName = item.tagName.toLowerCase();

                if(Components[tagName])
                    out.push(new Components[tagName](item));
            }

            return out;
        }

        //Retorna un Array de Ver Component que concuerde con el classNames
        const getComponentsByClassName = function(classNames, nodeRef) {
            const NodeRef = nodeRef? (nodeRef.constructor === Component? nodeRef.HTMLElement : nodeRef) : document;

            const temp = NodeRef.getElementsByClassName(classNames);
            const out = [];

            for (let i = 0; i < temp.length; i++) {
                const item = temp[i];
                const tagName = item.tagName.toLowerCase();

                if(Components[tagName])
                    out.push(new Components[tagName](item));
            }

            return out;
        }

        //Devuelve el primer Ver Component que encuentre dentro de un Ver Component o dentro de un HTMLElement
        const getFirstComponent = function(nodeRef) {
            const NodeRef = nodeRef? (nodeRef.constructor === Component? nodeRef.HTMLElement : nodeRef) : document;

            const temp = NodeRef.getElementsByTagName('*');
            
            for (let i = 0; i < temp.length; i++) {
                const item = temp[i];
                const tagName = item.tagName.toLowerCase();

                if(Components[tagName])
                    return new Components[tagName](item);
            }

            return null;
        }

        //Devuelve un array de todos los Ver Component que estan dentro de un Ver Component o dentro de un HTMLElement
        const getAllComponents = function(nodeRef) {
            const NodeRef = nodeRef? (nodeRef.constructor === Component? nodeRef.HTMLElement : nodeRef) : document;
            
            const temp = NodeRef.getElementsByTagName('*');
            const out = [];

            for (let i = 0; i < temp.length; i++) {
                const item = temp[i];
                const tagName = item.tagName.toLowerCase();

                if(Components[tagName])
                    out.push(new Components[tagName](item));
            }

            return out;
        }

        //Devuelve el ultimo Ver Component que encuentre dentro de un Ver Component o dentro de un HTMLElement
        const getLastComponent = function(nodeRef) {
            const out = getAllComponents(nodeRef);
            return out[out.length - 1];
        } 

        Object.defineProperties(Component.prototype, {
            'appendChild': {
                value: function(newChild, slot){
                    slot = slot || 'default';
                    const elementNew = newChild.constructor === Component? newChild.HTMLElement: (newChild instanceof HTMLElement? newChild : false);
                    const element = this.HTMLElement;

                    if(!elementNew)
                        return null;

                    //Si es un Componente compuesto (con varios elementos dentro)
                    if(element.children.length > 0){
                        const slotContainer = element.querySelector('[data-slot='+slot+']');

                        if(slotContainer){
                            elementNew.setAttribute('data-slot', slot);
                            slotContainer.appendChild(elementNew);
                        }
                        else
                            return null;
                    }
                    //Si es un Componente simple (solo la etiqueta)
                    else 
                        element.appendChild(elementNew);

                    return elementNew;
                },
                writable: false
            },
            'insertChild':{
                value: function(newChild, slot){
                    slot = slot || 'default';
                    render.stop();
                    const out = this.appendChild(newChild, slot);
                    render.start();
                    return out;
                },
                writable: false
            },
            'insertBefore': {
                value: function(newChild, refChild){
                    const elementNew = newChild.constructor === Component? newChild.HTMLElement: (newChild instanceof HTMLElement? newChild : false);
                    const elementRef = refChild.constructor === Component? refChild.HTMLElement: (refChild instanceof HTMLElement? refChild : false);
                    const element = this.HTMLElement;

                    if(!elementNew || !elementRef)
                        return null;

                    slot = elementRef.getAttribute('data-slot') || 'default';

                    //Si es un Componente compuesto (con varios elementos dentro)
                    if(element.children.length > 0){
                        const slotContainer = element.querySelector('[data-slot='+slot+']');

                        if(slotContainer){
                            elementNew.setAttribute('data-slot', slot);
                            slotContainer.insertBefore(elementNew, elementRef);
                        }
                        else
                            return null;
                    }
                    //Si es un Componente simple (solo la etiqueta)
                    else 
                        element.insertBefore(elementNew, elementRef);

                    return elementNew;
                },
                writable: false
            },
            'insertChildBefore':{
                value: function(newChild, refChild){
                    render.stop();
                    const out = this.insertBefore(newChild, refChild);
                    render.start();
                    return out;
                },
                writable: false
            },
            'insertAfter': {
                value: function(newChild, refChild){
                    const elementRef = refChild.constructor === Component? refChild.HTMLElement: (refChild instanceof HTMLElement? refChild : false);

                    if(!elementRef)
                        return null;

                    return this.insertBefore(newChild, elementRef.nextElementSibling);
                },
                writable: false
            },
            'insertChildAfter': {
                value: function(newChild, refChild){
                    render.stop();
                    const out = this.insertAfter(newChild, refChild);
                    render.start();
                    return out;
                },
                writable: false
            },
            'on': {
                value: function(event, callbackfn){
                    const element = this.HTMLElement;

                    if(callbackfn.constructor !== Function)
                        return null;

                    element['on'+event] = callbackfn;
                    
                    return callbackfn;
                },
                writable: false
            },
            'querySelector': {
                get: function(){
                    const nodeRef = this.HTMLElement;
                    return function(selectors, slot) {
                        return querySelector(selectors, nodeRef, slot);
                    }
                }
            },
            'querySelectorAll': {
                get: function(){
                    const nodeRef = this.HTMLElement;
                    return function(selectors, slot) {
                        return querySelectorAll(selectors, nodeRef, slot);
                    }
                }
            },
            'getComponentsByTagName': {
                get: function(){
                    const nodeRef = this.HTMLElement;
                    return function(qualifiedName, slot) {

                        if(slot){
                            const slotContainer = nodeRef.querySelector('[data-slot='+slot+']');
                            
                            if(slotContainer)  //Si el slot existe
                                return getComponentsByTagName(qualifiedName, slotContainer);
                            
                            return [];
                        }

                        return getComponentsByTagName(qualifiedName, nodeRef);
                    }
                }
            },
            'getComponentsByClassName': {
                get: function(){
                    const nodeRef = this.HTMLElement;
                    return function(qualifiedName, slot) {

                        if(slot){

                            const slotContainer = nodeRef.querySelector('[data-slot='+slot+']');
                            
                            if(slotContainer)  //Si el slot existe
                                return getComponentsByClassName(qualifiedName, slotContainer);
                            
                            return [];
                        }

                        return getComponentsByClassName(qualifiedName, nodeRef);
                    }
                }
            },
            'getFirstComponent': {
                get: function(){
                    const nodeRef = this.HTMLElement;
                    return function() {
                        return getFirstComponent(nodeRef);
                    }
                }
            },
            'getLastComponent': {
                get: function(){
                    const nodeRef = this.HTMLElement;
                    return function() {
                        return getLastComponent(nodeRef);
                    }
                }
            },
            'getAllComponents': {
                get: function(){
                    const nodeRef = this.HTMLElement;
                    return function() {
                        return getAllComponents(nodeRef);
                    }
                }
            },
            'internalText':{
                get: function(){
                    return this.innerText;;
                },
                set: function(value){
                    render.stop();
                    this.innerText = value;
                    render.start();
                }
            },
            'internalHTML': {
                get: function(){
                    return this.innerHTML;
                },
                set: function(value){
                    render.stop();
                    this.innerHTML = value;
                    render.start();
                }
            }
        });

        const createComponent = function(tagName) {
            tagName = tagName+"".toLowerCase();
            
            if(Components[tagName])
                return new Components[tagName](tagName);
            
            return null;
        }

        //#endregion

        //#region registerComponent DEFINICIÓN

        const Components = {}; //Para guardar los componentes registrados

        const registerComponent = function(tagName, Constructor, cssString) {

            tagName = ('' + tagName.toLowerCase()).trim();

            //Se agrega el Componente a la colección
            if(Constructor.id === Component.id)
                Components[tagName] = Constructor;
            else {
                console.error("invalid Constructor");
                return;
            }

            //Estilo del componente
            const css = document.createElement('style');
            css.setAttribute('ver-id', tagName);
            document.head.insertBefore(css, style.nextSibling);

            if(cssString)
                css.innerHTML += cssString;
                
            
            renderingfn.push( ( function() {

                const elements = document.getElementsByTagName(tagName);

                return function() {

                    let rendered = true;

                    //si se ha agregado Componentes, se renderiza aquellos NO renderizados
                    for (let i = 0; i < elements.length; i++)
                        if(!elements[i].hasAttribute('data-render')){
                            new Components[tagName](elements[i]);
                            if(rendered){
                                console.log("» RENDERING: <" + tagName + ">");
                                rendered = false;
                            }
                        }
                }

            })());

            //rendering inicial, si el "body" ya está disponible
            if(document.body)
                renderingfn[renderingfn.length - 1]();
        }

        //#endregion

        //#region rendering DEFINICIÓN

        //Guarda las funciones de renderizado de los Componentes registrados
        const renderingfn = [];

        const rendering = function() {
            for (let i = 0; i < renderingfn.length; i++)
                renderingfn[i]();
        }

        //cuando se agrega/elimina un tag en el DOM que es un Componente de forma dinamica, se renderizará
        const observer = new MutationObserver( function(e) {
            render.stop();
            rendering();
            render.start();
        });

        const render = {
            stop: function() {
                observer.disconnect();
            },
            start: function() {                
                observer.observe(document.body, { childList: true, subtree: true });
            }
        };

        //Si Ver.js se ha cargado como "module || defer" o cargado después del 'DOMContentLoaded'
        if(document.body)
            render.start();
        else
            document.addEventListener('DOMContentLoaded', function(){
                rendering();
                render.start();
            } , { once: true });

        //#endregion

        //#region extensiones a HTMLElement

        HTMLElement.prototype.appendChildComponent = function(newChildComponent){
            if(!(newChildComponent instanceof Component))
                return null;

            render.stop();
            this.appendChild(newChildComponent.HTMLElement);
            render.start();

            return newChildComponent;
        }

        HTMLElement.prototype.insertChild = function(newChild){
            render.stop();
            const out = this.appendChild(newChild);
            render.start();

            return out;
        }

        HTMLElement.prototype.insertBeforeComponent = function(newChildComponent, refChild){
            if(!(newChildComponent instanceof Component))
                return null;

            render.stop();
            this.insertBefore(newChildComponent.HTMLElement, refChild.HTMLElement? refChild.HTMLElement : refChild);
            render.start();
            
            return newChildComponent;
        }

        HTMLElement.prototype.insertChildBefore = function(newChild, refChild){
            render.stop();
            const out = this.insertBefore(newChild, refChild);
            render.start();

            return out;
        }

        HTMLElement.prototype.insertAfterComponent = function(newChildComponent, refChild){
            return this.insertBeforeComponent(newChildComponent, refChild.HTMLElement? refChild.HTMLElement.nextElementSibling : refChild.nextElementSibling);
        }

        HTMLElement.prototype.insertChildAfter = function(newChild, refChild){
            render.stop();
            const out = this.insertBefore(newChild, refChild.nextElementSibling);
            render.start();

            return out;
        }

        HTMLElement.prototype.querySelectorComponent = function(selectors){
            return querySelector(selectors, this, null);
        }

        HTMLElement.prototype.querySelectorAllComponent = function(selectors){
            return querySelectorAll(selectors, null, this);
        }

        HTMLElement.prototype.getComponentsByTagName = function(qualifiedName){
            return getComponentsByTagName(qualifiedName, this);
        }

        HTMLElement.prototype.getComponentsByClassName = function(classNames){
            return getComponentsByClassName(classNames, this);
        }

        HTMLElement.prototype.getFirstComponent = function(){
            return getFirstComponent(this);
        }

        HTMLElement.prototype.getLastComponent = function(){
            return getLastComponent(this);
        }

        HTMLElement.prototype.getAllComponents = function(){
            return getAllComponents(this);
        }

        Object.defineProperty(HTMLElement.prototype, 'internalText', {
            get: function(){
                return this.innerText;
            },
            set: function(v){
                render.stop();
                this.innerText = v;
                render.start();
            }
        });

        Object.defineProperty(HTMLElement.prototype, 'internalHTML', {
            get: function(){
                return this.innerHTML;
            },
            set: function(v){
                render.stop();
                this.innerHTML = v;
                render.start();
            }
        });

        //Por si se implementa legalmente algun día y no sobre escriba
        if(!HTMLElement.prototype.insertAfter){
            HTMLElement.prototype.insertAfter = function(newChild, refChild){
                return this.insertBefore(newChild, refChild.nextElementSibling);
            }
        }

        //#endregion

        return {
            registerComponent: registerComponent,
            Component: Component,
            Components: Components,
            addCss: addCss,
            getCss: getCss,
            createComponent: createComponent,
            querySelector: querySelector,
            querySelectorAll: querySelectorAll,
            getComponentById: getComponentById,
            getFirstComponent: getFirstComponent,
            getLastComponent: getLastComponent,
            getAllComponents: getAllComponents,
            getComponentsByTagName: getComponentsByTagName,
            getComponentsByClassName: getComponentsByClassName,
            render: render
        }

    })(document),
    writable: false
});