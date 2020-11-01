const fetch = require('node-fetch');
let evidaApiUrl = `${process.env.MS_EVIDA_API_PROTOCOL}://${process.env.MS_EVIDA_API_HOST}:${process.env.MS_EVIDA_API_PORT}`
let rvcApiUrl = `${process.env.MS_RVC_API_PROTOCOL}://${process.env.MS_RVC_API_HOST}:${process.env.MS_RVC_API_PORT}/RVC/`;

async function getRvcVerseAPI(key){
    rvcApiUrl += `${key}`;
    try {
        const response = await fetch(rvcApiUrl);
        const json = await response.json();
        console.log(`Haciendo fetch a rvc-api: ${rvcApiUrl}`)
        console.log(`rvc-api responde: ${JSON.stringify( json )}`);
        return json.scripture;
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

function getFutureDate(){
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    futureDate.setHours(0,0,0,0);
    return futureDate;
}

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
        case '1° Cr'.toUpperCase() : return '1CH';
        case '1 Cr'.toUpperCase() : return '1CH';
        case '1° Crónicas'.toUpperCase() : return '1CH';
        case '1 Crónicas'.toUpperCase() : return '1CH';
        case '2° Crónicas'.toUpperCase() : return '2CH';
        case '2 Crónicas'.toUpperCase() : return '2CH';
        case '2 Cr'.toUpperCase() : return '1CH';
        case '2 Cr'.toUpperCase() : return '1CH';
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
        case 'Jn'.toUpperCase() : return 'JHN';
        case 'San Juan'.toUpperCase() : return 'JHN';
        case 'Hechos'.toUpperCase() : return 'ACT';
        case 'Hch'.toUpperCase() : return 'ACT';
        case 'Romanos'.toUpperCase() : return 'ROM';
        case '1° Corintios'.toUpperCase() : return '1CO';
        case '1 Corintios'.toUpperCase() : return '1CO';
        case '1 Co'.toUpperCase() : return '1CO';
        case '2° Corintios'.toUpperCase() : return '2CO';
        case '2 Corintios'.toUpperCase() : return '2CO';
        case '2 Co'.toUpperCase() : return '2CO';
        case 'Gálatas'.toUpperCase() : return 'GAL';
        case 'Galatas'.toUpperCase() : return 'GAL';
        case 'Efesios'.toUpperCase() : return 'EPH';
        case 'Filipenses'.toUpperCase() : return 'PHP';
        case 'Fil'.toUpperCase() : return 'PHP';
        case 'Colosenses'.toUpperCase() : return 'COL';
        case '1° Tesalonicenses'.toUpperCase() : return '1TH';
        case '1 Tesalonicenses'.toUpperCase() : return '1TH';
        case '2° Tesalonicenses'.toUpperCase() : return '2TH';
        case '2 Tesalonicenses'.toUpperCase() : return '2TH';
        case '1° Timoteo'.toUpperCase() : return '1TI';
        case '1 Timoteo'.toUpperCase() : return '1TI';
        case '2° Timoteo'.toUpperCase() : return '2TI';
        case '2 Timoteo'.toUpperCase() : return '2TI';
        case '1° Ti'.toUpperCase() : return '1TI';
        case '1 Ti'.toUpperCase() : return '1TI';
        case '2° Ti'.toUpperCase() : return '2TI';
        case '2 Ti'.toUpperCase() : return '2TI';
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
        case '1 Jn'.toUpperCase() : return '1JN';
        case '1° Jn'.toUpperCase() : return '1JN';
        case '1 Juan'.toUpperCase() : return '1JN';
        case '2° Juan'.toUpperCase() : return '2JN';
        case '2 Juan'.toUpperCase() : return '2JN';
        case '2 Jn'.toUpperCase() : return '2JN';
        case '2° Jn'.toUpperCase() : return '2JN';
        case '3° Juan'.toUpperCase() : return '3JN';
        case '3 Juan'.toUpperCase() : return '3JN';
        case '3 Jn'.toUpperCase() : return '3JN';
        case '3° Jn'.toUpperCase() : return '3JN';
        case 'Júdas'.toUpperCase() : return 'JUD';
        case 'Judas'.toUpperCase() : return 'JUD';
        case 'Apocalipsis'.toUpperCase() : return 'REV';
        default: return longName;
    }
}

module.exports = { 
    bookKey, 
    jwtLogin, 
    apiPostMeditation, 
    getRvcVerseAPI,
    getFutureDate
 }



