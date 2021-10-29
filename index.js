require('dotenv').config()
const puppeteer = require('puppeteer');
const utils = require('./utils/utils.js');
const lib = require('./utils/utils.js');
const pusher = require('./utils/pushNotifier.js');
const yargs = require("yargs");

let versParam;
let overwriteVerse;
let dateParam;
let overwriteDate;
let body;

function parseArguments() {
    const argv = yargs
      .option("verse", {
        alias: "v",
        description:
          "Verse in youversion notation, to replace scraped verse. \"node index.js -v JHN.3.1-17\"",
        type: "string",
      })
      .option("date", {
        alias: "d",
        description:
          "Date on which the meditation should be posted to the API \"node index.js -d 2021-10-15\"",
        type: "string",
      })
      .help()
      .alias("help", "h").argv;      
      
      argv.verse ? (overwriteVerse = true) : (overwriteVerse = false);
      argv.verse ? versParam = argv.verse.trim() : "" ;
      (overwriteVerse) ? console.log("Sin parametro verse.. debo tomar del scraping") : console.log("Recibo texto por parametro, debo sobreescribir el texto")
      console.log('muestro variable ingresada por paramentro: '+versParam);
      
      argv.date ? (overwriteDate = true) : (overwriteDate = false);
      argv.date ? dateParam = argv.date.trim() : "" ;
      (overwriteDate) ? console.log("Sin parametro date... debo tomar del scraping") : console.log("Recibo date por parametro, debo sobreescribir el texto")
      console.log('muestro variable ingresada por paramentro: '+dateParam);

      console.log(argv);
  }

async function getMeditation() {
    console.log(`Comienzo scraping: ${new Date()}`);
    
    let browser;

    console.log(`AMBIENTE -----> ${process.env.ENV}`);
    if(process.env.ENV === 'raspi'){
        browser = await puppeteer.launch(
            {executablePath: 'chromium-browser' }              // Uncomment this line to run on ARM like a Raspberry pi.
            //{ headless: false, defaultViewport: null }       // Uncomment this line to see the browser.
            );
    } 
    if(process.env.ENV==='desa'){

        browser = await puppeteer.launch(
            // {executablePath: 'chromium-browser' }              // Uncomment this line to run on ARM like a Raspberry pi.
            { headless: false, defaultViewport: null }       // Uncomment this line to see the browser.
            );

    }

    const page = await browser.newPage();
    await page.goto(process.env.MS_SCRAPE_URL);           
    // await page.waitFor('.read-main-title');

    let meditation = {
        titulo: '',
        cita: '',
        cita2: '',
        texto: '',
        reflexion: ''
    }

    /****************************************  Titulo*/
    //// MEDITATION TITLE TEXT
    const title = await page.evaluate(() => 
        Array.from(document.querySelectorAll('body > main > section > div > div > div > div > h1'), 
        e => e.textContent));

    meditation.titulo = title[0]; 

    /****************************************  Reflexión HTML*/
    //// MEDITATION OUTER HTML ARRAY
    const paragraph = await page.evaluate(() => 
        
        Array.from(document.querySelectorAll('#js--font-sizing > article > p'), 
        e => e.outerHTML)); // me quedo con el html y sus tags de parrafo (outerHTML)

    /****************************************  Verse*/
    let hayversiculo
        // TODO: CHECK WHENEVER THIS SITUATION COMES...
        (paragraph[0] == '<p><em>Para sacarle el máximo provecho a este devocional, lea los pasajes a los que se hacen referencia.</em></p>') 
            ? hayversiculo = false 
            : hayversiculo = true;

        let esCapituloCompleto
        (paragraph[0].indexOf('.') == -1) 
            ? esCapituloCompleto = true 
            : esCapituloCompleto = false;

        paragraph.shift();  // Elimino el primer item
        paragraph.pop();    // Elimino el ultimo item
        meditation.reflexion = paragraph.join(' ');
        
    // Ask here if any verse came from args...
    let citaDetail
    let key
    let verse
    let citasExtra
    let citasCortas = []

    if(overwriteVerse){
        console.log('Getting verse from params...')
        
        let texto = await lib.getRvcVerseAPI(versParam);
        meditation.texto = texto.scripture;
        meditation.cita = texto.cita;
        meditation.cita2 = versParam
        // cita2 = versParam;

    } else {
        
        if(hayversiculo && !esCapituloCompleto){
            //// PRIMARY VERSE REFERENCE (String)
            verse = await page.evaluate(() => 
                Array.from(document.querySelectorAll('#js--font-sizing > article > p > a'), 
                e => e.textContent));       

            meditation.cita = verse[0];                                           // 'Juan 8.25-36'       //1 Corintios 7            //"Génesis 1.26, 27"
            citaDetailA = verse[0].replace(', ','-');                                                                               //"Génesis 1.26-27"
            citaDetail = citaDetailA.split(' ');                                 // ['Juan','8.25-26']   //['1', 'Corintios', '7']  //['Génesis', '1.26,', '27']
            
            let key;
            (isNaN(parseInt(citaDetail[0])))                                                             // devuelve false cuando es numero el primer elemento del array (caso '1 Corintios 7'
            ? key = lib.bookKey(citaDetail[0].toUpperCase()) + '.' + citaDetail[1]                    //obtengo abreviatura del nombre del libro //'JHN.8.25-36
            : key = lib.bookKey(citaDetail[0]+' '+citaDetail[1].toUpperCase()) + '.' + citaDetail[2]; //Compongo el nombre del libro si comienza con numero. Luego obtengo abreviatura del nombre del libro //'1CO.7
        
            meditation.cita2 = key;                                                                      //esta es mi calve para buscar en mi API de versiculos biblicos!
            
            /***** GET rvc-api */
            let texto = await lib.getRvcVerseAPI(key);
            meditation.texto = texto.scripture;

        } else {
            //// ALTERNATIVE VERSES ARRAY
            citasExtra = await page.evaluate(() => 
                Array.from(document.querySelectorAll('#js--font-sizing > article > p > a'), 
                e => e.textContent));
            citasExtra.shift();
            console.log('Muestro citas posibles: ' + citasExtra);

            // let citaValida
            let citasValidas = []
            for (let value of citasExtra ) {                                                        // Busco cual de las citas no es capitulo completo. Me quedo con la primera.
                (value.indexOf('.') == -1)
                    ? citasExtra.splice(value.indexOf())                                            //Elimino las citas capitulo completo
                    // : citaValida = value
                    :citasValidas.push(value)                                                       //Me quedo con citas mas cortas
            }
            
            console.log('Muestro TODAS mis citas validas: ');// + citasValidas);
            for (let value of citasValidas){
                value = value.replace('. ','.');                                                    //"Génesis 1.26-27"
                value = value.replace(', ','-');                                                    // ['Juan','8.25-26']   //['1', 'Corintios', '7']  //['Génesis', '1.26,', '27']
                console.log(value);
                value = value.split(' ');
                (isNaN(parseInt(value[0])))                                                         // devuelve false cuando es numero el primer elemento del array (caso '1 Corintios 7'
                    ? key = lib.bookKey(value[0].toUpperCase()) + '.' + value[1]                    //obtengo abreviatura del nombre del libro //'JHN.8.25-36
                    : key = lib.bookKey(value[0]+' '+value[1].toUpperCase()) + '.' + value[2];      //Compongo el nombre del libro si comienza con numero. Luego obtengo abreviatura del nombre del libro //'1CO.7

                citasCortas.push(key);
                
            }

            console.log(`muestro mis citas cortas convertidas: ${citasCortas}`);

            //Recorrer todas las keys buscando en rvc-api, me quedo con la primera que responda OK.
            for(let key of citasCortas){
                try {
                    let versiculo
                    console.log('busco versiculo en rvc-api')
                    versiculo = await lib.getRvcVerseAPI(key);
                    if(!versiculo.error){                                                                   // Si RVC-API me responde ok, hago break y no busco el próximo versiculo
                        // Asignar cita a meditación
                        meditation.cita = versiculo.cita;
                        //Asignar cita2 (key) a meditación
                        meditation.cita2 = key;
                        // Asignar texto a meditación
                        meditation.texto = versiculo.scripture;
                        break;
                    } else {
                        console.error(`Hubo un error al querer buscar el texto: ${versiculo.error}`);
                    }
                } catch (error) {
                    console.error(error)
                }
            }

        }

    }
    /************ */

    // Muestro el HTML por el log, para que quede guardado por si algo falla al hacer scrapping
    this.body = await page.content();
    this.body = this.body.replace(/(\r\n|\n|\r)/gm, "");
    

    await browser.close();   //Cierro chromium
    
    // Obtengo ultima fecha disponible y le sumo uno:
    let futureDate 
    if(!overwriteDate){
        futureDate = await lib.getLastScrapedDate();
    } else {
        futureDate = new Date(dateParam)
        
    }
    
    meditation.fecha = futureDate
    let planAnualLectura = await lib.buildPlanLecturesHTML(futureDate);
    meditation.reflexion += planAnualLectura;

    //objeto final
    console.log(meditation);
    return meditation;
}


/************** MAIN ********************************/

async function run() {
     /***** Scrape meditation */
     parseArguments();
     
     let meditation
     try {
        meditation = await getMeditation();

        if (meditation.titulo 
            && meditation.cita 
            && meditation.fecha
            && meditation.texto
            && meditation.reflexion){
        
            /***** JWT Login */
            let token;
            let errorMessage;
            try {
                token = await lib.jwtLogin();
            } catch (e) {
                console.error(e)
                utils.raiseError(1, meditation, this.body, e);
            }

            if (token){
                /***** POST Meditation to API */
                try {
                    if(process.env.ENV === 'raspi'){
                        result = await lib.apiPostMeditation(token, meditation); 
                    } 
                    if(process.env.ENV==='desa'){
                        console.log("DESA -----> No hago post a la API porque estoy en desa")
                        // result = await lib.apiPostMeditation(token, meditation); 
                    }
                    pusher.sendPushNotification(meditation, error = false);
                } catch (e) {
                    console.error(e)
                    utils.raiseError(2, meditation, this.body, e);
                }
            } else {
                errorMessage = `Ocurrió un error al obtener el token! ${new Date()}`;
                console.error(errorMessage)
                utils.raiseError(3, meditation, this.body, errorMessage);
            }
        } else {
            errorMessage = `Falta un dato obligatorio en la meditación! ${new Date()}`;
            console.error(errorMessage)
            utils.raiseError(4, meditation, this.body, errorMessage);

        }

    } catch (e) {
        console.error(e)
        utils.raiseError(5, meditation, this.body, e);

    }
    
    
}
  
run();
