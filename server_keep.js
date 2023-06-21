const fs = require("fs");
const http = require("http");
const host = '192.168.0.12';
const port = 8080;
const server = http.createServer();

const descriptions = [];
server.on("request", (req, res) => {
    if ( req . method === "GET" && req.url.startsWith ("/public/")) {
        const newUrl = req.url.slice(7);
    if (newUrl === '/images') {
        const images = fs.readdirSync("./public/images");
        let pageHTML = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Images</title>
            <link rel="stylesheet" href="style">
        </head>
        <body>
            <header>
                <div class=" btn_left_container ">
                <a href="index" class="btn_left"> Index </a>
                </div>
                <a href="image-description" class="btn"> Comment </a>
                <p class="under_index_text_container">Le Mur d'Images</p>
            </header>
            <main>
            <div class="imgs_container"> `;
            for (let i = 0; i < images.length; i++) {
                if (!images[i].endsWith("_small.jpg") ) { 
                    const imageNamed = images[i].slice(0, -4);
                    if (imageNamed != 'logo'){
                        pageHTML += `<div class="img_cell"> 
                        <a class="img"href="${imageNamed}_page"><img src="images/${imageNamed}_small.jpg">
                        </a> </div>`;
                    }
                }
            }
        pageHTML += `
                </div>
            </main>
        </body>
        </html>`;
        res.end(pageHTML);
    } else if (newUrl === '/style') {
        const style = fs.readFileSync("./public/style.css", "utf-8");
        res.end(style);
    } else if (req.url === '/public/image-description') {
        const style = fs.readFileSync("./public/image-description.html");
        res.end(style);
    } else if (newUrl.endsWith("_page")) {
        const imageNumber = newUrl.slice(6, -5);
        let pageHTML = `
        <!DOCTYPE html>
        <html lang="fr">
        <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Images</title>
        <link rel="stylesheet" href="style">
        </head>
        <body>
            <header>
                <div class=" btn_left_container ">
                <a href="images" class="btn_left"> Mur </a>
                </div>
            </header>
        <main>
            <div class="img_container">
                <div class="img_cell_unique">
                <img class="img" src="images/image${imageNumber}.jpg" width="450">
            </div>
            <div class="text_img">`; 
                if( descriptions[imageNumber] != null ){
                    pageHTML += `<p > ${descriptions[imageNumber].toString ()} </p> `;
                } else{
                    pageHTML += `<p > Pas de description. </p> `; 
                }
            pageHTML += `
            </div>
        </div>
        </main>
            <footer class="footer">site réalisé en janvier 2023</footer>
        </body>
        </html> `; 
        res.end(pageHTML);
    } else if (newUrl.startsWith('/images/')){
        const image_name = './public' + newUrl;
        const image = fs.readFileSync(image_name);
        res.end(image);
    }else {
        const index = fs.readFileSync("./public/index.html", "utf-8");
        res.end(index);
    }}else if ( req.method === "POST" && req.url === "/image-description") {
        let donnees ;;
        req.on("data", ( dataChunk ) => {
            donnees += dataChunk.toString () ;
        }) ;
        req.on("end", () => {
        const paramValeur = donnees . split ("&") ;
        const imageNumber = paramValeur [0]. split ("=") [1];
        const description = paramValeur [1]. split ("=") [1];
        descriptions[imageNumber] = description ;
        console.log("nombre:",imageNumber,"texte:",description.toString ());
        res.statusCode = 200;
        let pageHTML = `
        <!DOCTYPE html>
        <html lang="fr">
        <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <style> 
        body {
			background: rgb(134, 128, 128);
		}
        h1 {
			color: whitesmoke;
			text-align: center;
			margin-top: 50px;
            font-size: 1.5rem;
		}
        </style>
        <body>
        <h1>Votre commentaire a bien été ajouté. Merci pour votre contribution !</h1>
        </body>
        </html>
        `;
        res.end ( pageHTML );
        })}else {
            res . end (" erreur URL ");
    };})


server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
