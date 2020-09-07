require('dotenv').config()
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

function bookKey(longName) {
    switch (longName) {
        case 'Génesis'.toUpperCase() : return 'GEN';
        case 'Genesis'.toUpperCase() : return 'GEN';
        case 'Éxodo'.toUpperCase() : return 'EXO';
        case 'Exodo'.toUpperCase() : return 'EXO';
        case 'Levítico'.toUpperCase() : return 'LEV';
        case 'Levitico'.toUpperCase() : return 'LEV';
        case 'Números'.toUpperCase() : return 'NUM';
        case 'Numeros'.toUpperCase() : return 'NUM';
        case 'Deuteronomio'.toUpperCase() : return 'DEU';
        case 'Josué'.toUpperCase() : return 'JOS';
        case 'Josue'.toUpperCase() : return 'JOS';
        case 'Jueces'.toUpperCase() : return 'JDG';
        case 'Rut'.toUpperCase() : return 'RUT';
        case '1° Samuel'.toUpperCase() : return '1SA';
        case '1 Samuel'.toUpperCase() : return '1SA';
        case '2° Samuel'.toUpperCase() : return '2SA';
        case '2 Samuel'.toUpperCase() : return '2SA';
        case '1° Reyes'.toUpperCase() : return '1KI';
        case '1 Reyes'.toUpperCase() : return '1KI';
        case '2° Reyes'.toUpperCase() : return '2KI';
        case '2 Reyes'.toUpperCase() : return '2KI';
        case '1° Crónicas'.toUpperCase() : return '1CH';
        case '1 Crónicas'.toUpperCase() : return '1CH';
        case '2° Crónicas'.toUpperCase() : return '2CH';
        case '2 Crónicas'.toUpperCase() : return '2CH';
        case '1° Cronicas'.toUpperCase() : return '1CH';
        case '1 Cronicas'.toUpperCase() : return '1CH';
        case '2° Cronicas'.toUpperCase() : return '2CH';
        case '2 Cronicas'.toUpperCase() : return '2CH';
        case 'Esdras'.toUpperCase() : return 'EZR';
        case 'Nehemías'.toUpperCase() : return 'NEH';
        case 'Nehemias'.toUpperCase() : return 'NEH';
        case 'Ester'.toUpperCase() : return 'EST';
        case 'Job'.toUpperCase() : return 'JOB';
        case 'Salmos'.toUpperCase() : return 'PSA';
        case 'Salmo'.toUpperCase() : return 'PSA';
        case 'Proverbios'.toUpperCase() : return 'PRO';
        case 'Eclesiastés'.toUpperCase() : return 'ECC';
        case 'Eclesiastes'.toUpperCase() : return 'ECC';
        case 'Cantares'.toUpperCase() : return 'SNG';
        case 'Isaías'.toUpperCase() : return 'ISA';
        case 'Isaias'.toUpperCase() : return 'ISA';
        case 'Jeremías'.toUpperCase() : return 'JER';
        case 'Jeremias'.toUpperCase() : return 'JER';
        case 'Lamentaciones'.toUpperCase() : return 'LAM';
        case 'Ezequiel'.toUpperCase() : return 'EZK';
        case 'Daniel'.toUpperCase() : return 'DAN';
        case 'Oseas'.toUpperCase() : return 'HOS';
        case 'Joel'.toUpperCase() : return 'JOL';
        case 'Amós'.toUpperCase() : return 'AMO';
        case 'Amos'.toUpperCase() : return 'AMO';
        case 'Abdías'.toUpperCase() : return 'OBA';
        case 'Abdias'.toUpperCase() : return 'OBA';
        case 'Jonás'.toUpperCase() : return 'JON';
        case 'Jonas'.toUpperCase() : return 'JON';
        case 'Miqueas'.toUpperCase() : return 'MIC';
        case 'Nahúm'.toUpperCase() : return 'NAM';
        case 'Nahum'.toUpperCase() : return 'NAM';
        case 'Habacuc'.toUpperCase() : return 'HAB';
        case 'Sofonías'.toUpperCase() : return 'ZEP';
        case 'Sofonias'.toUpperCase() : return 'ZEP';
        case 'Hageo'.toUpperCase() : return 'HAG';
        case 'Zacarías'.toUpperCase() : return 'ZEC';
        case 'Zacarias'.toUpperCase() : return 'ZEC';
        case 'Malaquías'.toUpperCase() : return 'MAL';
        case 'Malaquias'.toUpperCase() : return 'MAL';
        case 'Mateo'.toUpperCase() : return 'MAT';
        case 'Mt'.toUpperCase() : return 'MAT';
        case 'S. Mateo'.toUpperCase() : return 'MAT';
        case 'San Mateo'.toUpperCase() : return 'MAT';
        case 'Marcos'.toUpperCase() : return 'MRK';
        case 'S. Marcos'.toUpperCase() : return 'MRK';
        case 'San Marcos'.toUpperCase() : return 'MRK';
        case 'Lucas'.toUpperCase() : return 'LUK';
        case 'S. Lucas'.toUpperCase() : return 'LUK';
        case 'San Lucas'.toUpperCase() : return 'LUK';
        case 'Juan'.toUpperCase() : return 'JHN';
        case 'S. Juan'.toUpperCase() : return 'JHN';
        case 'San Juan'.toUpperCase() : return 'JHN';
        case 'Hechos'.toUpperCase() : return 'ACT';
        case 'Hch'.toUpperCase() : return 'ACT';
        case 'Romanos'.toUpperCase() : return 'ROM';
        case '1° Corintios'.toUpperCase() : return '1CO';
        case '1 Corintios'.toUpperCase() : return '1CO';
        case '2° Corintios'.toUpperCase() : return '2CO';
        case '2 Corintios'.toUpperCase() : return '2CO';
        case 'Gálatas'.toUpperCase() : return 'GAL';
        case 'Galatas'.toUpperCase() : return 'GAL';
        case 'Efesios'.toUpperCase() : return 'EPH';
        case 'Filipenses'.toUpperCase() : return 'PHP';
        case 'Colosenses'.toUpperCase() : return 'COL';
        case '1° Tesalonicenses'.toUpperCase() : return '1TH';
        case '1 Tesalonicenses'.toUpperCase() : return '1TH';
        case '2° Tesalonicenses'.toUpperCase() : return '2TH';
        case '2 Tesalonicenses'.toUpperCase() : return '2TH';
        case '1° Timoteo'.toUpperCase() : return '1TI';
        case '1 Timoteo'.toUpperCase() : return '1TI';
        case '2° Timoteo'.toUpperCase() : return '2TI';
        case '2 Timoteo'.toUpperCase() : return '2TI';
        case 'Tito'.toUpperCase() : return 'TIT';
        case 'Filemón'.toUpperCase() : return 'PHM';
        case 'Filemon'.toUpperCase() : return 'PHM';
        case 'Hebreos'.toUpperCase() : return 'HEB';
        case 'Santiago'.toUpperCase() : return 'JAS';
        case '1° Pedro'.toUpperCase() : return '1PE';
        case '1 Pedro'.toUpperCase() : return '1PE';
        case '2° Pedro'.toUpperCase() : return '2PE';
        case '2 Pedro'.toUpperCase() : return '2PE';
        case '1° Juan'.toUpperCase() : return '1JN';
        case '1 Juan'.toUpperCase() : return '1JN';
        case '2° Juan'.toUpperCase() : return '2JN';
        case '2 Juan'.toUpperCase() : return '2JN';
        case '3° Juan'.toUpperCase() : return '3JN';
        case '3 Juan'.toUpperCase() : return '3JN';
        case 'Júdas'.toUpperCase() : return 'JUD';
        case 'Judas'.toUpperCase() : return 'JUD';
        case 'Apocalipsis'.toUpperCase() : return 'REV';
        default: return longName;
    }
}

async function getMeditation() {
    const browser = await puppeteer.launch(
        // { headless: false, defaultViewport: null }       // Uncomment this line to see the browser doing your magic
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
        e => e.outerHTML)); // me quedo con el html y sus tags de parrafo. // opterHMLT

    // Verse
    let hayversiculo
    (paragraph[0] == '<p><em>Para sacarle el máximo provecho a este devocional, lea los pasajes a los que se hacen referencia.</em></p>') ? hayversiculo = false : hayversiculo = true;

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

    const html = await page.content();
    console.log(html);

    // Cierro chromium
    await browser.close();
    
    let key;
    if(isNaN(parseInt(citaDetail[0]))){                                                     // devuelve false cuando es numero el primer elemento del array (caso '1 Corintios 7')
        key = bookKey(citaDetail[0].toUpperCase()) + '.' + citaDetail[1];                   //obtengo abreviatura del nombre del libro //'JHN.8.25-36
    } else {
        key = bookKey(citaDetail[0]+' '+citaDetail[1].toUpperCase()) + '.' + citaDetail[2]; //Compongo el nombre del libro si comienza con numero. Luego obtengo abreviatura del nombre del libro //'1CO.7
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

    /******** JWT GET TOKEN */
    let token;
    
    let credentials = {
        email: process.env.EVIDA_API_EMAIL,
        password: process.env.EVIDA_API_PASSWD
    }

    let apiUrl = `${process.env.EVIDA_API_PROTOCOL}://${process.env.EVIDA_API_HOST}:${process.env.EVIDA_API_PORT}`

    const getToken = async credentials => {
        try {
            const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            console.log(json);
            return json.token;
        } catch (error) {
            console.error(error);
        }
    };
        
    token = await getToken(credentials);
    console.log('token: ' + token);
    
    /******** POST meditation */
    fetch(`${apiUrl}/versiculos`,
    {
        method: "POST",
        body: JSON.stringify(meditation),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ console.log(JSON.stringify( data ) ) })

    return meditation;
}



getMeditation();
