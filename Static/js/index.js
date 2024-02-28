(function(window, document){

    let header = document.querySelector('header');
    let burger = document.getElementById('burger');
    let cursor = document.getElementById('cursor');
    let on_off = false;
    let xhr = new XMLHttpRequest();
    let projects = document.getElementsByClassName('projects')[0];

    burger.onchange = function(){
        
        if(burger.checked)
            header.classList.add('header_on');
        else
            header.classList.remove('header_on');

    }

    window.onhashchange = function(){
        burger.checked = false;
        burger.onchange()
    } 

    setInterval(function(){

        if(on_off)
            cursor.textContent = ''
        else
            cursor.textContent = '_'

        on_off = !on_off;

    }, 700);

    
    xhr.onloadend = function(){
        let xhrStatus = xhr.status;
        //respuesta satisfactoria (200 a 299) ó cache (304)
        if((xhrStatus >= 200 && xhrStatus < 300) || xhrStatus == 304){
            let response = xhr.response;

            //Es un texto (IE11 y quizas EDGE Legacy)
            if(typeof response === 'string')
                response = JSON.parse(response);
            
            let str = '';

            //Lo que entrega GitHub es un array
            response.forEach(function(element){

                console.log(element);
                
                if(element.archived || element.private || element.name == 'erovas' || element.name == 'erovas.github.io' || element.stargazers_count < 1)
                    return;

                str += '<div class="projects-item">';
                str += '<h3>' + element.name + '</h3>';
                str += '<p>' + element.description + "</p>";
                str += '<div class="projects-links">';

                if(element.homepage)
                    str += '<a target="_blank" href="' + element.homepage + '">Homepage</a>'; 

                str += '<a target="_blank" href="' + element.html_url + '">Repository</a>'; 
                str += '</div>'
                str += '</div>';
            });

            projects.innerHTML = str;
        }
    }

    xhr.open('GET', 'https://api.github.com/users/erovas/repos', true);
    xhr.responseType = 'json';
    xhr.send();

})(window, document);