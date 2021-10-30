const fetch = require('node-fetch');
const mailer = require('./mailer.js');
const pusher = require('./pushNotifier.js');

let evidaApiUrl = `${process.env.MS_EVIDA_API_PROTOCOL}://${process.env.MS_EVIDA_API_HOST}:${process.env.MS_EVIDA_API_PORT}`
let rvcApiUrl = `${process.env.MS_RVC_API_PROTOCOL}://${process.env.MS_RVC_API_HOST}:${process.env.MS_RVC_API_PORT}/RVC/`;

var moment = require('moment'); // require
moment().format(); 

async function getRvcVerseAPI(key){
    try {
        const response = await fetch(`${rvcApiUrl}${key}`);
        const json = await response.json();
        console.log(`Haciendo fetch a rvc-api: ${rvcApiUrl}`)
        console.log(`rvc-api responde: ${JSON.stringify( json )}`);
        return json;
    } catch (error) {
        console.error(error);
    }
}

async function getLastScrapedDate(){
    try {
        const response = await fetch(evidaApiUrl + '/lastDateScraped');
        const json = await response.json();
        console.log(`Haciendo fetch a evida-api para obtener ultima fecha disponible: ${evidaApiUrl}`)
        console.log(`evida-api responde con fecha: ${JSON.stringify( json.fecha )}`);
        
        const futureDate = new Date(json.fecha);
        futureDate.setDate(futureDate.getDate() + 2);
        futureDate.setHours(-3,0,0,0);
        return futureDate;

    } catch (error) {
        console.error(error);
    }
}

async function jwtLogin(){
    let token;
    
    let credentials = {
        email: process.env.MS_EVIDA_API_EMAIL,
        password: process.env.MS_EVIDA_API_PASSWD
    }
   
    const getToken = async credentials => {
        try {
            const response = await fetch(`${evidaApiUrl}/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            console.log(`Haciendo login JWT a evida-api: ${evidaApiUrl}/login`)
            console.log(`evida-api responde: ${JSON.stringify( json )}`);
            
            console.log(json);
            return json.token;
        } catch (error) {
            console.error(error);
        }
    };
        
    token = await getToken(credentials);
    console.log('token: ' + token);
    return token;
}

async function apiPostMeditation(token, meditation){
    fetch(`${evidaApiUrl}/versiculos`,
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
    .then(function(data){ 
        console.log(`Haciendo POST a evida-api: ${evidaApiUrl}/versiculos`)
        console.log(`evida-api responde: ${JSON.stringify( data )}`);
    })
}


async function getPlanLectures(dayNumber){
    try {
        const response = await fetch(`${evidaApiUrl}/plan/1/${dayNumber}`);
        const json = await response.json();
        // console.log(`Haciendo fetch a evida-api para obtener las lecturas diarias del plan: ${evidaApiUrl}`)
        // console.log(`evida-api responde estas lectuas: ${JSON.stringify( json )}`);
        return json;

    } catch (error) {
        console.error(error);
    }
}


async function buildPlanLecturesHTML(futureDate){
    let now = new Date(futureDate);

    let momentDay;
    console.log('************************************************************************************');
    momentDay = moment(now).add(1,'days').dayOfYear(); // Number

    console.log(`Day of year for next meditation using moment.js: ${momentDay}`);
    console.log('************************************************************************************');


    //search for the date of the year within the const of bible plan
    //Foreach searching within the const for the verse of the calculated date
    let data = await getPlanLectures(momentDay);

    let verseList = '';
    for (let value of data ) {
        console.log(value);
        verseList += `<li><a href="${value.url}">${value.displayVerse}</a></li>`;
        // dayOfYear = value.dayNumber;
    }

    //create HTML string to concatenate to the meditation.
    let htmlBiblePlan = `<div><br><h3>Biblia en un año:</h3><span><i>Día ${momentDay} </i></span><ul>${verseList}</ul></div>`;
    console.log(htmlBiblePlan);

    return htmlBiblePlan;
}

async function raiseError(errorCode, meditation, htmlBody, e){
    console.error(`Error con codigo de retorno: ${errorCode}`)
    
    if(process.env.ENV==='desa'){
        console.log("DESA -----> No hago envio de mail error porque estoy en desa")
        return;
    }

    let body = {
        errorCode,
        meditation,
        htmlBody
    }
    
    try {
        let email = await mailer.armarMailError(body)
        await mailer.enviarMail(email);
    } catch (error) {
        console.log(error);        
    }
    pusher.sendPushNotification(meditation, e);

}

function bookKey(longName) {
    switch (longName) {
        case 'Génesis'.toUpperCase() : return 'GEN';
        case 'Genesis'.toUpperCase() : return 'GEN';
        case 'Gn'.toUpperCase() : return 'GEN';
        case 'Éxodo'.toUpperCase() : return 'EXO';
        case 'Exodo'.toUpperCase() : return 'EXO';
        case 'Ex'.toUpperCase() : return 'EXO';
        case 'Levítico'.toUpperCase() : return 'LEV';
        case 'Levitico'.toUpperCase() : return 'LEV';
        case 'Lv'.toUpperCase() : return 'LEV';
        case 'Números'.toUpperCase() : return 'NUM';
        case 'Numeros'.toUpperCase() : return 'NUM';
        case 'Nm'.toUpperCase() : return 'NUM';
        case 'Deuteronomio'.toUpperCase() : return 'DEU';
        case 'Dt'.toUpperCase() : return 'DEU';
        case 'Josué'.toUpperCase() : return 'JOS';
        case 'Josué'.toUpperCase() : return 'JOS';
        case 'Jos'.toUpperCase() : return 'JOS';
        case 'Jueces'.toUpperCase() : return 'JDG';
        case 'Jue'.toUpperCase() : return 'JDG';
        case 'Rut'.toUpperCase() : return 'RUT';
        case 'Rt'.toUpperCase() : return 'RUT';
        case '1° Samuel'.toUpperCase() : return '1SA';
        case '1S'.toUpperCase() : return '1SA';
        case '1 Samuel'.toUpperCase() : return '1SA';
        case '2° Samuel'.toUpperCase() : return '2SA';
        case '2S'.toUpperCase() : return '2SA';
        case '2 Samuel'.toUpperCase() : return '2SA';
        case '1° Reyes'.toUpperCase() : return '1KI';
        case '1R'.toUpperCase() : return '1KI';
        case '1 Reyes'.toUpperCase() : return '1KI';
        case '2° Reyes'.toUpperCase() : return '2KI';
        case '2R'.toUpperCase() : return '2KI';
        case '2 Reyes'.toUpperCase() : return '2KI';
        case '1° Cr'.toUpperCase() : return '1CH';
        case '1 Cr'.toUpperCase() : return '1CH';
        case '1Cr'.toUpperCase() : return '1CH';
        case '1° Crónicas'.toUpperCase() : return '1CH';
        case '1 Crónicas'.toUpperCase() : return '1CH';
        case '2° Crónicas'.toUpperCase() : return '2CH';
        case '2 Crónicas'.toUpperCase() : return '2CH';
        case '2 Cr'.toUpperCase() : return '2CH';
        case '2Cr'.toUpperCase() : return '2CH';
        case '1° Cronicas'.toUpperCase() : return '1CH';
        case '1 Cronicas'.toUpperCase() : return '1CH';
        case '2° Cronicas'.toUpperCase() : return '2CH';
        case '2 Cronicas'.toUpperCase() : return '2CH';
        case 'Esdras'.toUpperCase() : return 'EZR';
        case 'Esd'.toUpperCase() : return 'EZR';
        case 'Nehemías'.toUpperCase() : return 'NEH';
        case 'Nehemias'.toUpperCase() : return 'NEH';
        case 'Neh'.toUpperCase() : return 'NEH';
        case 'Ester'.toUpperCase() : return 'EST';
        case 'Est'.toUpperCase() : return 'EST';
        case 'Job'.toUpperCase() : return 'JOB';
        case 'Salmos'.toUpperCase() : return 'PSA';
        case 'Salmo'.toUpperCase() : return 'PSA';
        case 'Sal'.toUpperCase() : return 'PSA';
        case 'Proverbios'.toUpperCase() : return 'PRO';
        case 'Pr'.toUpperCase() : return 'PRO';
        case 'Eclesiastés'.toUpperCase() : return 'ECC';
        case 'Ec'.toUpperCase() : return 'ECC';
        case 'Eclesiastes'.toUpperCase() : return 'ECC';
        case 'Cantares'.toUpperCase() : return 'SNG';
        case 'Cnt'.toUpperCase() : return 'SNG';
        case 'Isaías'.toUpperCase() : return 'ISA';
        case 'Isaias'.toUpperCase() : return 'ISA';
        case 'Is'.toUpperCase() : return 'ISA';
        case 'Jeremías'.toUpperCase() : return 'JER';
        case 'Jer'.toUpperCase() : return 'JER';
        case 'Jeremias'.toUpperCase() : return 'JER';
        case 'Lamentaciones'.toUpperCase() : return 'LAM';
        case 'Lm'.toUpperCase() : return 'LAM';
        case 'Ezequiel'.toUpperCase() : return 'EZK';
        case 'Ez'.toUpperCase() : return 'EZK';
        case 'Daniel'.toUpperCase() : return 'DAN';
        case 'Dan'.toUpperCase() : return 'DAN';
        case 'Oseas'.toUpperCase() : return 'HOS';
        case 'Os'.toUpperCase() : return 'HOS';
        case 'Joel'.toUpperCase() : return 'JOL';
        case 'Jl'.toUpperCase() : return 'JOL';
        case 'Amós'.toUpperCase() : return 'AMO';
        case 'Amos'.toUpperCase() : return 'AMO';
        case 'Am'.toUpperCase() : return 'AMO';
        case 'Abdías'.toUpperCase() : return 'OBA';
        case 'Abdias'.toUpperCase() : return 'OBA';
        case 'Jonás'.toUpperCase() : return 'JON';
        case 'Jonas'.toUpperCase() : return 'JON';
        case 'Jon'.toUpperCase() : return 'JON';
        case 'Miqueas'.toUpperCase() : return 'MIC';
        case 'Mi'.toUpperCase() : return 'MIC';
        case 'Nahúm'.toUpperCase() : return 'NAM';
        case 'Nahum'.toUpperCase() : return 'NAM';
        case 'Nah'.toUpperCase() : return 'NAM';
        case 'Habacuc'.toUpperCase() : return 'HAB';
        case 'Hab'.toUpperCase() : return 'HAB';
        case 'Sofonías'.toUpperCase() : return 'ZEP';
        case 'Sofonías'.toUpperCase() : return 'ZEP';
        case 'Sof'.toUpperCase() : return 'ZEP';
        case 'Hageo'.toUpperCase() : return 'HAG';
        case 'Hag'.toUpperCase() : return 'HAG';
        case 'Zacarías'.toUpperCase() : return 'ZEC';
        case 'Zacarias'.toUpperCase() : return 'ZEC';
        case 'Zac'.toUpperCase() : return 'ZEC';
        case 'Malaquías'.toUpperCase() : return 'MAL';
        case 'Malaquias'.toUpperCase() : return 'MAL';
        case 'Mal'.toUpperCase() : return 'MAL';
        case 'Mateo'.toUpperCase() : return 'MAT';
        case 'Mt'.toUpperCase() : return 'MAT';
        case 'S. Mateo'.toUpperCase() : return 'MAT';
        case 'San Mateo'.toUpperCase() : return 'MAT';
        case 'Marcos'.toUpperCase() : return 'MRK';
        case 'Mr'.toUpperCase() : return 'MRK';
        case 'S. Marcos'.toUpperCase() : return 'MRK';
        case 'San Marcos'.toUpperCase() : return 'MRK';
        case 'Lucas'.toUpperCase() : return 'LUK';
        case 'S. Lucas'.toUpperCase() : return 'LUK';
        case 'Lc'.toUpperCase() : return 'LUK';
        case 'San Lucas'.toUpperCase() : return 'LUK';
        case 'Juan'.toUpperCase() : return 'JHN';
        case 'S. Juan'.toUpperCase() : return 'JHN';
        case 'Jn'.toUpperCase() : return 'JHN';
        case 'San Juan'.toUpperCase() : return 'JHN';
        case 'Hechos'.toUpperCase() : return 'ACT';
        case 'Hch'.toUpperCase() : return 'ACT';
        case 'Romanos'.toUpperCase() : return 'ROM';
        case 'Ro'.toUpperCase() : return 'ROM';
        case '1° Corintios'.toUpperCase() : return '1CO';
        case '1 Corintios'.toUpperCase() : return '1CO';
        case '1 Co'.toUpperCase() : return '1CO';
        case '1Co'.toUpperCase() : return '1CO';
        case '2° Corintios'.toUpperCase() : return '2CO';
        case '2 Corintios'.toUpperCase() : return '2CO';
        case '2 Co'.toUpperCase() : return '2CO';
        case '2Co'.toUpperCase() : return '2CO';
        case 'Gálatas'.toUpperCase() : return 'GAL';
        case 'Galatas'.toUpperCase() : return 'GAL';
        case 'Gá'.toUpperCase() : return 'GAL';
        case 'Ga'.toUpperCase() : return 'GAL';
        case 'Efesios'.toUpperCase() : return 'EPH';
        case 'Ef'.toUpperCase() : return 'EPH';
        case 'Filipenses'.toUpperCase() : return 'PHP';
        case 'Fil'.toUpperCase() : return 'PHP';
        case 'Colosenses'.toUpperCase() : return 'COL';
        case 'Col'.toUpperCase() : return 'COL';
        case '1° Tesalonicenses'.toUpperCase() : return '1TH';
        case '1 Tesalonicenses'.toUpperCase() : return '1TH';
        case '1Ts'.toUpperCase() : return '1TH';
        case '2° Tesalonicenses'.toUpperCase() : return '2TH';
        case '2 Tesalonicenses'.toUpperCase() : return '2TH';
        case '2Ts'.toUpperCase() : return '2TH';
        case '1° Timoteo'.toUpperCase() : return '1TI';
        case '1 Timoteo'.toUpperCase() : return '1TI';
        case '2° Timoteo'.toUpperCase() : return '2TI';
        case '2 Timoteo'.toUpperCase() : return '2TI';
        case '1° Ti'.toUpperCase() : return '1TI';
        case '1 Ti'.toUpperCase() : return '1TI';
        case '1Ti'.toUpperCase() : return '1TI';
        case '2° Ti'.toUpperCase() : return '2TI';
        case '2 Ti'.toUpperCase() : return '2TI';
        case '2Ti'.toUpperCase() : return '2TI';
        case 'Tito'.toUpperCase() : return 'TIT';
        case 'Tit'.toUpperCase() : return 'TIT';
        case 'Filemón'.toUpperCase() : return 'PHM';
        case 'Flm'.toUpperCase() : return 'PHM';
        case 'Filemon'.toUpperCase() : return 'PHM';
        case 'Hebreos'.toUpperCase() : return 'HEB';
        case 'He'.toUpperCase() : return 'HEB';
        case 'Santiago'.toUpperCase() : return 'JAS';
        case 'Stg'.toUpperCase() : return 'JAS';
        case '1° Pedro'.toUpperCase() : return '1PE';
        case '1 Pedro'.toUpperCase() : return '1PE';
        case '1P'.toUpperCase() : return '1PE';
        case '2° Pedro'.toUpperCase() : return '2PE';
        case '2 Pedro'.toUpperCase() : return '2PE';
        case '2P'.toUpperCase() : return '2PE';
        case '1° Juan'.toUpperCase() : return '1JN';
        case '1 Jn'.toUpperCase() : return '1JN';
        case '1Jn'.toUpperCase() : return '1JN';
        case '1° Jn'.toUpperCase() : return '1JN';
        case '1 Juan'.toUpperCase() : return '1JN';
        case '2° Juan'.toUpperCase() : return '2JN';
        case '2 Juan'.toUpperCase() : return '2JN';
        case '2 Jn'.toUpperCase() : return '2JN';
        case '2Jn'.toUpperCase() : return '2JN';
        case '2° Jn'.toUpperCase() : return '2JN';
        case '3° Juan'.toUpperCase() : return '3JN';
        case '3 Juan'.toUpperCase() : return '3JN';
        case '3 Jn'.toUpperCase() : return '3JN';
        case '3Jn'.toUpperCase() : return '3JN';
        case '3° Jn'.toUpperCase() : return '3JN';
        case 'Júdas'.toUpperCase() : return 'JUD';
        case 'Jud'.toUpperCase() : return 'JUD';
        case 'Judas'.toUpperCase() : return 'JUD';
        case 'Apocalipsis'.toUpperCase() : return 'REV';
        case 'Ap'.toUpperCase() : return 'REV';
        default: return longName;
    }
}

module.exports = { 
    bookKey, 
    jwtLogin, 
    apiPostMeditation, 
    getRvcVerseAPI,
    getLastScrapedDate,
    raiseError,
    getPlanLectures,
    buildPlanLecturesHTML
 }



