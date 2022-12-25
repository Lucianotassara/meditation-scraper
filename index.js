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
    argv.verse ? versParam = argv.verse.trim() : "";
    (overwriteVerse) ? console.log("Sin parametro verse.. debo tomar del scraping") : console.log("Recibo texto por parametro, debo sobreescribir el texto")
    console.log('muestro variable ingresada por paramentro: ' + versParam);

    argv.date ? (overwriteDate = true) : (overwriteDate = false);
    argv.date ? dateParam = argv.date.trim() : "";
    (overwriteDate) ? console.log("Sin parametro date... debo tomar del scraping") : console.log("Recibo date por parametro, debo sobreescribir el texto")
    console.log('muestro variable ingresada por paramentro: ' + dateParam);

    console.log(argv);
}

async function scrapeInfo() {
    let browser;

    if (process.env.ENV === 'raspi') {
        browser = await puppeteer.launch(
            // Uncomment this line to run on ARM like a Raspberry pi.
            { executablePath: 'chromium-browser' }             
            
            // Uncomment this line to see the browser.
            ,{ headless: true, defaultViewport: null }       
            );
    }
    if (process.env.ENV === 'desa') {

        browser = await puppeteer.launch(
            // Uncomment this line to run on ARM like a Raspberry pi.
            // {executablePath: 'chromium-browser' }         
            
            // Uncomment this line to see the browser.
            { headless: false, defaultViewport: null }       
        );

    }
    if (process.env.ENV === 'prod') {
        browser = await puppeteer.launch(
            // Uncomment this line to run on ARM like a Raspberry pi.
            { executablePath: 'chromium-browser' },
            
            // Uncomment this line to see the browser.
            { headless: true, defaultViewport: null }       
            );
    }

    const page = await browser.newPage();
    await page.goto(process.env.MS_SCRAPE_URL);


    // Cargo el HTML para mostratr por el log, para que quede guardado por si algo falla al hacer scrapping
    this.body = await page.content();
    this.body = this.body.replace(/(\r\n|\n|\r)/gm, "");

    /****************************************  Titulo*/
    //// TEXT
    const title = await page.evaluate(() =>
        Array.from(document.querySelectorAll('body > main > section > div > div > div > div > h1'),
            e => e.textContent));


    /****************************************  Reflexión HTML*/
    //// HTML ARRAY
    const paragraph = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[@id="js--widget-content"]/div/div/div/div[1]/article/p'),
            e => e.outerHTML)); // me quedo con el html y sus tags de parrafo (outerHTML)

    /****************************************  Verse*/

    let allVerseReferences = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#js--font-sizing > article > p > a'),
            e => e.textContent));

    await browser.close();   //Cierro chromium

    console.log(title,paragraph,allVerseReferences)

    return {
        title,
        paragraph,
        allVerseReferences
    }
}

async function handleVerse(paragraph, allVerseReferences, overwriteVerse) {
    /**
     * 
     * @param1 paragraph Array
     * @param2 allVerseReferences Array
     * @param3 overwriteVerse Boolean
     * 
     *  */
    let completeVerse = { cita: '', cita2: '', scripture: ''}
    let hayversiculo

    (paragraph[0] == '<p><em>Para sacarle el máximo provecho a este devocional, lea los pasajes a los que se hacen referencia.</em></p>')
        ? hayversiculo = false
        : hayversiculo = true;

    let esCapituloCompleto
    (paragraph[0].indexOf('.') == -1)
        ? esCapituloCompleto = true
        : esCapituloCompleto = false;

    // Ask here if any verse came from args...
    let citaDetail
    let key
    let citasCortas = []


    if (hayversiculo && !esCapituloCompleto) {
        //// PRIMARY VERSE REFERENCE (String)
        completeVerse.cita = allVerseReferences[0];                          // 'Juan 8.25-36'        //1 Corintios 7            //"Génesis 1.26, 27"
        citaDetailA = allVerseReferences[0].replace(', ', '-');                                                                  //"Génesis 1.26-27"
        citaDetail = citaDetailA.split(' ');                                 // ['Juan','8.25-26']   //['1', 'Corintios', '7']  //['Génesis', '1.26,', '27']

        let key;
        // devuelve false cuando es numero el primer elemento del array (caso '1 Corintios 7'
        (isNaN(parseInt(citaDetail[0])))
            //obtengo abreviatura del nombre del libro //'JHN.8.25-36
            ? key = lib.bookKey(citaDetail[0].toUpperCase()) + '.' + citaDetail[1]
            //Compongo el nombre del libro si comienza con numero. Luego obtengo abreviatura del nombre del libro //'1CO.7
            : key = lib.bookKey(citaDetail[0] + ' ' + citaDetail[1].toUpperCase()) + '.' + citaDetail[2];

        //esta es mi calve para buscar en mi API de versiculos biblicos!
        completeVerse.cita2 = key;

        /***** GET rvc-api */
        let texto = await lib.getRvcVerseAPI(key);
        completeVerse.scripture = texto.scripture;

    } else {
        //// ALTERNATIVE VERSES ARRAY
        // allVerseReferences.shift(); // Remove first element
        console.log('Muestro citas posibles: ' + allVerseReferences);

        let citasValidas = []
        // Busco cual de las citas no es capitulo completo. Me quedo con la primera.
        for (let value of allVerseReferences) {
            (value.indexOf('.') == -1)
                //Elimino las citas capitulo completo
                ? allVerseReferences.splice(value.indexOf())
                //Me quedo con citas mas cortas
                : citasValidas.push(value)
        }

        console.log('Muestro TODAS mis citas validas: ');
        for (let value of citasValidas) {
            //"Génesis 1.26-27"
            value = value.replace('. ', '.');
            // ['Juan','8.25-26']   //['1', 'Corintios', '7']  //['Génesis', '1.26,', '27']
            value = value.replace(', ', '-');
            console.log(value);
            value = value.split(' ');

            // devuelve false cuando es numero el primer elemento del array (caso '1 Corintios 7')
            (isNaN(parseInt(value[0])))
                //obtengo abreviatura del nombre del libro //'JHN.8.25-36
                ? key = lib.bookKey(value[0].toUpperCase()) + '.' + value[1]
                //Compongo el nombre del libro si comienza con numero. Luego obtengo abreviatura del nombre del libro //'1CO.7
                : key = lib.bookKey(value[0] + ' ' + value[1].toUpperCase()) + '.' + value[2];

            citasCortas.push(key);

        }

        console.log(`muestro mis citas cortas convertidas: ${citasCortas}`);

        //Recorrer todas las keys buscando en rvc-api, me quedo con la primera que responda OK.
        for (let key of citasCortas) {
            try {
                let versiculo
                console.log('busco versiculo en rvc-api')
                versiculo = await lib.getRvcVerseAPI(key);
                // Si RVC-API me responde ok, hago break y no busco el próximo versiculo
                if (!versiculo.error) {
                    completeVerse.cita = versiculo.cita;
                    completeVerse.cita2 = key;
                    completeVerse.scripture = versiculo.scripture;
                    break;
                } else {
                    console.error(`Hubo un error al querer buscar el texto: ${versiculo.error}`);
                }
            } catch (error) {
                console.error(error)
            }
        }

    }
    return completeVerse;
}

async function getMeditation() {
    
    const {
        paragraph,
        allVerseReferences,
        title
    } = await scrapeInfo();

    const {
        futureDate,
        lastTitle
    } = await lib.getLastScrapedOne()
    
    
    if( title != lastTitle) {
        let meditation = {
            titulo: '',
            cita: '',
            cita2: '',
            texto: '',
            reflexion: ''
        }
    
        meditation.titulo = title[0];
    
        paragraph.shift();  // Elimino el primer item
        paragraph.pop();    // Elimino el ultimo item
        meditation.reflexion = paragraph.join(' ');
    
        let verseObject;
        (overwriteVerse)
            ? verseObject = await lib.getRvcVerseAPI(versParam)
            : verseObject = await handleVerse(paragraph, allVerseReferences, overwriteVerse);
    
        meditation.texto = verseObject.scripture;
        meditation.cita = verseObject.cita;
        meditation.cita2 = verseObject.cita2;
    
        // Obtengo ultima fecha disponible y le sumo uno:
        // let futureDate
        (!overwriteDate)
           ? meditationDate = futureDate
           : meditationDate = new Date(dateParam)
    
        meditation.fecha = meditationDate
        let planAnualLectura = await lib.buildPlanLecturesHTML(meditationDate);
        meditation.reflexion += planAnualLectura;
    
        //objeto final
        console.log(meditation);
        return meditation;
    } else {
        
        let meditation = {
            error: 'Trying to insert duplicated stuff...'
        }
        
        return meditation
    }

}

async function run() {
    /***** Scrape meditation */
    console.log(`Comienzo scraping: ${new Date()}`);
    console.log(`AMBIENTE -----> ${process.env.ENV}`);

    parseArguments();

    let meditation
    try {
        meditation = await getMeditation();

        if(!meditation.error){

            if (meditation.titulo
                && meditation.cita
                && meditation.fecha
                && meditation.texto
                && meditation.reflexion) {
    
                /***** JWT Login */
                let token;
                let errorMessage;
                try {
                    
                } catch (e) {
                    console.error(e)
                    utils.raiseError(1, meditation, this.body, e);
                }
    
                if (token) {
                    /***** POST Meditation to API */
                    try {
                        if (process.env.ENV === 'raspi') {
                            result = await lib.apiPostMeditation(token, meditation);
                        }
                        if (process.env.ENV === 'desa') {
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
                errorMessage = `Falta un dato obligatorio en la meditación! ${new Date()}. - ${meditation.error}`;
                console.error(errorMessage)
                
    
            }
        } else {
            errorMessage = `${meditation.error}`;
            console.error(errorMessage)
            utils.raiseError(4, meditation, this.body, errorMessage);

        }


    } catch (e) {
        console.error(e)
        utils.raiseError(5, meditation, this.body, e);

    }

}

run();
