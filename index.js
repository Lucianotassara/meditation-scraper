require('dotenv').config()
const puppeteer = require('puppeteer');
const { getFutureDate } = require('./utils.js');
const lib = require('./utils.js');

async function getMeditation() {
    console.log(`Comienzo scraping: ${new Date()}`);
    const browser = await puppeteer.launch(
        {executablePath: 'chromium-browser' }           // Uncomment this line to run on ARM like a Raspberry pi.
        //{ headless: false, defaultViewport: null }       // Uncomment this line to see the browser.
        );
    const page = await browser.newPage();
    await page.goto(process.env.MS_SCRAPE_URL);           
    await page.waitFor('.read-main-title');

    let meditation = {
        titulo: '',
        cita: '',
        cita2: '',
        texto: '',
        reflexion: '',
        // fecha: lib.getFutureDate()
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

    let esCapituloCompleto
    (paragraph[0].indexOf('.') == -1) 
        ? esCapituloCompleto = true 
        : esCapituloCompleto = false;

    paragraph.shift();  // Elimino el primer item
    paragraph.pop();    // Elimino el ultimo item
    meditation.reflexion = paragraph.join(' ');
    
    let citaDetail
    let verse
    let citasExtra
    if(hayversiculo && !esCapituloCompleto){
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

        // console.log(citasExtra);                                                            //["Hch 4–5", "Mt 5.10", "Ezequiel 32-33"]
        // verse = citasExtra[1]                                                               // "Mt 5.10"
        // citaDetail = verse.split(' ')
        // meditation.cita = verse;                                                            // 'mT 5.10"

        console.log('Muestro citas posibles: ' + citasExtra);

        let citaValida
        for (let value of citasExtra ) {                                                        // Busco cual de las citas no es capitulo completo. Me quedo con la primera.
            (value.indexOf('.') == -1)
                ? citasExtra.splice(value.indexOf())
                : citaValida = value
        }
        console.log('Muestro una cita valida: ' + citaValida);
        verse = citaValida;
        citaDetail = verse.split(' ')
        meditation.cita = verse;                                                            // 'mT 5.10"

    }

    // Muestro el HTML por el log, para que quede guardado por si algo falla al hacer scrapping
    // const html = await page.content();
    // let htmlLine = html.replace(/(\r\n|\n|\r)/gm, "");
    // console.log(htmlLine);
    
    
    
    await browser.close();   //Cierro chromium
    
    let key;
    (isNaN(parseInt(citaDetail[0])))                                                             // devuelve false cuando es numero el primer elemento del array (caso '1 Corintios 7'
       ? key = lib.bookKey(citaDetail[0].toUpperCase()) + '.' + citaDetail[1]                    //obtengo abreviatura del nombre del libro //'JHN.8.25-36
       : key = lib.bookKey(citaDetail[0]+' '+citaDetail[1].toUpperCase()) + '.' + citaDetail[2]; //Compongo el nombre del libro si comienza con numero. Luego obtengo abreviatura del nombre del libro //'1CO.7

    meditation.cita2 = key;                                                                      //esta es mi calve para buscar en mi API de versiculos biblicos!
    
    /***** GET rvc-api */
    meditation.texto = await lib.getRvcVerseAPI(key);


    // Obtengo ultima fecha disponible y le sumo uno:
    let futureDate = await lib.getLastScrapedDate();
    meditation.fecha = futureDate

    //objeto final
    console.log(meditation);
    return meditation;
}




/************** MAIN ********************************/

async function run() {
     /***** Scrape meditation */
     let meditation
     try {
        meditation = await getMeditation();

        if (meditation.titulo 
            && meditation.cita 
            && meditation.texto
            && meditation.reflexion){
        
            /***** JWT Login */
            let token;
            try {
                token = await lib.jwtLogin();
            } catch (e) {
            console.error(e)
            }

            if (token){
                /***** POST Meditation to API */
                try {
                    result = await lib.apiPostMeditation(token, meditation); 
                } catch (e) {
                    console.error(e)
                }
            } else {
                console.error(`Ocurrió un error al obtener el token! ${new Date()}`)
                // No hay token, Error al obtenerlo
            }
        } else {
            console.error(`Falta un dato obligatorio en la meditación! ${new Date()}`)
            //falta algún dato de la meditación
        }

    } catch (e) {
        console.error(e)
    }
    
    
}
  
run();