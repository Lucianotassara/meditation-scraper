require('dotenv').config()
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const lib = require('./utils.js');

async function getMeditation() {
    const browser = await puppeteer.launch(
        // { headless: false, defaultViewport: null }       // Uncomment this line to see the browser
        );

    const page = await browser.newPage();
    await page.goto(process.env.SCRAPE_URL);           

    await page.waitFor('.read-main-title');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(0,0,0,0);

    let meditation = {
        titulo: '',
        cita: '',
        cita2: '',
        texto: '',
        reflexion: '',
        fecha: tomorrow
    }

    // Titulo
    const title = await page.evaluate(() => 
        Array.from(document.querySelectorAll('.read-main-title'), 
        e => e.textContent));

    meditation.titulo = title[0];

    // Reflexión HTML
    const paragraph = await page.evaluate(() => 
        
        Array.from(document.querySelectorAll('.article-main-content > p,.article-main-content > ul,.article-main-content > ol'), 
        e => e.outerHTML)); // me quedo con el html y sus tags de parrafo (outerHTML)

    // Verse
    let hayversiculo
    (paragraph[0] == '<p><em>Para sacarle el máximo provecho a este devocional, lea los pasajes a los que se hacen referencia.</em></p>') 
        ? hayversiculo = false 
        : hayversiculo = true;

    paragraph.shift();  // Elimino el primer item
    paragraph.pop();    // Elimino el ultimo item
    meditation.reflexion = paragraph.join(' ');
    
    let citaDetail
    let verse
    let citasExtra
    if(hayversiculo){
        verse = await page.evaluate(() => 
            Array.from(document.querySelectorAll('.article-main-content > p > strong > a > span'), 
            e => e.textContent));       

        meditation.cita = verse[0];                                           // 'Juan 8.25-36'       //1 Corintios 7            //"Génesis 1.26, 27"
        
        citaDetailA = verse[0].replace(', ','-');                                                                               //"Génesis 1.26-27"
        citaDetail = citaDetailA.split(' ');                                 // ['Juan','8.25-26']   //['1', 'Corintios', '7']  //['Génesis', '1.26,', '27']

    } else {

        citasExtra = await page.evaluate(() => 
            Array.from(document.querySelectorAll('.article-main-content > p > a'), 
            e => e.textContent));

        console.log(citasExtra);                                                            //["Hch 4–5", "Mt 5.10", "Ezequiel 32-33"]

        verse = citasExtra[1]                                                               // "Mt 5.10"
        citaDetail = verse.split(' ')
                                                                                            // 
        meditation.cita = verse;                                                            // 'mT 5.10"
    }

    // Muestro el HTML por el log, para que quede guardado por si algo falla al hacer scrapping
    const html = await page.content();
    console.log(html);

    // Cierro chromium
    await browser.close();
    
    let key;
    if(isNaN(parseInt(citaDetail[0]))){                                                     // devuelve false cuando es numero el primer elemento del array (caso '1 Corintios 7')
        key = lib.bookKey(citaDetail[0].toUpperCase()) + '.' + citaDetail[1];                   //obtengo abreviatura del nombre del libro //'JHN.8.25-36
    } else {
        key = lib.bookKey(citaDetail[0]+' '+citaDetail[1].toUpperCase()) + '.' + citaDetail[2]; //Compongo el nombre del libro si comienza con numero. Luego obtengo abreviatura del nombre del libro //'1CO.7
    }

    meditation.cita2 = key;                                                                 //esta es mi calve para buscar en mi API de versiculos biblicos!
    
    /*********************************** GET rvc-api */
    let url = `${process.env.RVC_API_PROTOCOL}://${process.env.RVC_API_HOST}:${process.env.RVC_API_PORT}/146/${key}`;

    const getData = async url => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            // console.log(json.scripture);
            return json.scripture;
        } catch (error) {
            console.error(error);
        }
    };    
    
    meditation.texto = await getData(url);

    //objeto final
    console.log(meditation);
    return meditation;
}


/************** MAIN */

async function run() {
    
     /***** Scrape meditation */
     let meditation
     try {
         var response = await getMeditation();
         meditation = await response;
     } catch (e) {
         console.error(e)
     }
    
    /***** JWT Login */
    let token;
    try {
      var response = await lib.jwtLogin();
      token = await response;
    } catch (e) {
      console.error(e)
    }

    /***** POST Meditation to API */
    try {
        var response = await lib.apiPostMeditation(token, meditation);
        result = await response;
    } catch (e) {
        console.error(e)
    }
  }
  
  run();