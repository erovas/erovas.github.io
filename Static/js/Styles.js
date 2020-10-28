(function(){

    Styler.all.addStyles({
        general:
        `
        a {
            text-decoration: none;
            text-decoration: none;
            color: inherit;
            transition: 0.3s color;
        }
    
        a:hover {
            color: #088de6;
        }
    
        #content {
            font-size: 2rem;
            max-width: 154.64rem;
            background-color: #293340;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            margin: auto;
        }
    
        footer {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #2A3442;
            height: 7rem;
            flex-direction: column;
        }
    
        section {
            padding-top: 20rem;
            max-width: 92.78rem;
            margin: auto;
            text-align: justify;
        }
    
        section span {
            color: #088de6;
        }
    
        .introduction {
            max-width: 103.09rem;
        }
    
        #about > div {
            display: flex;
            flex-direction: column;
        }
    
        #about > div div[data-name=text] {
            width: 100%;
        }
    
        #about > div div[data-name=picture] {
            width: 100%;
            margin-top: 4rem;
            display: flex;
            justify-content: center
        }
    
        #about > div div[data-name=picture] img{
            width: 50%;
            height: 50%;
        }
        `,
        '3-10':
        `
        #about > div {
            flex-direction: row;
        }
    
        #about > div div[data-name=text] {
            width: 70%;
        }
    
        #about > div div[data-name=picture] {
            width: 30%;
            margin-left: 4rem;
            margin-top: 0;
            display: block;
        }
    
        #about > div div[data-name=picture] img{
            /*width: 80%;*/
            width: 21.3rem;
            /*height: 80%;*/
            height: 25.6rem;
        }
        `,
        '5-10':
        `
        #content {
            padding: 0;
        }
    
        footer {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #2A3442;
            height: 7rem;
            flex-direction: column;
        }
    
        section {
            max-width: 92.78rem;
            margin: auto;
        }
    
        .introduction {
            max-width: 103.09rem;
        }
        `

    });
})(document);