const fetch = require('node-fetch');
var moment = require('moment'); // require
moment().format();

let evidaApiUrl = `https://apiv2.encuentrovida.com.ar:443`


async function getPlanLecturas(dayNumber, planId) {
    try {
        const response = await fetch(`${evidaApiUrl}/plan/${planId}/${dayNumber}`);
        const json = await response.json();
        // console.log(`Haciendo fetch a evida-api para obtener las lecturas diarias del plan: ${evidaApiUrl}`)
        // console.log(`evida-api responde estas lectuas: ${JSON.stringify( json )}`);
        return json;

    } catch (error) {
        console.error(error);
    }
}

async function buildPlanLecturesHTML(futureDate) {
    let now = new Date(futureDate);

    let momentDay;
    // console.log('************************************************************************************');
    momentDay = moment(now).add(1, 'days').dayOfYear();

    // console.log(`Day of year for next meditation using moment.js: ${momentDay}`);
    // console.log('************************************************************************************');


    //search for the date of the year within the const of bible plan
    //Foreach searching within the const for the verse of the calculated date
    // let data = await getPlanLecturas(momentDay, 1); // Biblia en un año (Plan 1)
    let data = await getPlanLecturas(momentDay, 2); // Biblia en un año (Plan 1) NT en un año (Plan 2)

    let verseList = '';
    for (let value of data) {
        // console.log(value);
        verseList += `<li><a href='${value.url}'>${value.displayVerse}</a></li>`;
        // dayOfYear = value.dayNumber;
    }
    let htmlBiblePlan = `<div><br><h3>Nuevo testamento en un año:</h3><span><i>Día ${momentDay} </i></span><ul>${verseList}</ul></div>`;
    
    if (typeof data[0].podcastLink === "string" && data[0].podcastLink != '') 
        htmlBiblePlan += `<br><div class='podcast'><h4>Podcast de hoy: <a href='${data[0].podcastLink}'>Escuchar</a></h4></div>`
    
    if (typeof data[0].videoLink === "string" && data[0].videoLink != '') 
        htmlBiblePlan += `<br><div class='video'><h4>Video de hoy: <a href='${data[0].videoLink}'>Mirar</a></h4></div>`

    //create HTML string to concatenate to the meditation.
    console.log(htmlBiblePlan);

    return htmlBiblePlan;
}


async function run() {
    // // Febrero 2023
    // // // await buildPlanLecturesHTML("2023-03-01")
    // // // await buildPlanLecturesHTML("2023-03-02")
    // // // await buildPlanLecturesHTML("2023-03-03")
    // // await buildPlanLecturesHTML("2023-03-04")
    // // // await buildPlanLecturesHTML("2023-03-05")
    // // await buildPlanLecturesHTML("2023-03-06")
    // // await buildPlanLecturesHTML("2023-03-07")
    // await buildPlanLecturesHTML("2023-03-08")
    // await buildPlanLecturesHTML("2023-03-09")
    // await buildPlanLecturesHTML("2023-03-10")
    // await buildPlanLecturesHTML("2023-03-11")
    // await buildPlanLecturesHTML("2023-03-12")
    // await buildPlanLecturesHTML("2023-03-13")
    // await buildPlanLecturesHTML("2023-03-14")
    // await buildPlanLecturesHTML("2023-03-15")
    // await buildPlanLecturesHTML("2023-03-16")
    // await buildPlanLecturesHTML("2023-03-17")
    // await buildPlanLecturesHTML("2023-03-18")
    // await buildPlanLecturesHTML("2023-03-19")
    // await buildPlanLecturesHTML("2023-03-20")
    // await buildPlanLecturesHTML("2023-03-21")
    // await buildPlanLecturesHTML("2023-03-22")
    // await buildPlanLecturesHTML("2023-03-23")
    // await buildPlanLecturesHTML("2023-03-24")
    // await buildPlanLecturesHTML("2023-03-25")
    // await buildPlanLecturesHTML("2023-03-26")
    // await buildPlanLecturesHTML("2023-03-27")
    // // await buildPlanLecturesHTML("2023-03-28")
    // // // await buildPlanLecturesHTML("2023-03-29")
    // // // await buildPlanLecturesHTML("2023-03-30")
    // // // await buildPlanLecturesHTML("2023-03-31")
    await buildPlanLecturesHTML('2023-05-17');
await buildPlanLecturesHTML('2023-05-18');
await buildPlanLecturesHTML('2023-05-19');
await buildPlanLecturesHTML('2023-05-20');
await buildPlanLecturesHTML('2023-05-21');
await buildPlanLecturesHTML('2023-05-22');
await buildPlanLecturesHTML('2023-05-23');
await buildPlanLecturesHTML('2023-05-24');
await buildPlanLecturesHTML('2023-05-25');
await buildPlanLecturesHTML('2023-05-26');
await buildPlanLecturesHTML('2023-05-27');
await buildPlanLecturesHTML('2023-05-28');
await buildPlanLecturesHTML('2023-05-29');
await buildPlanLecturesHTML('2023-05-30');
await buildPlanLecturesHTML('2023-05-31');
await buildPlanLecturesHTML('2023-06-01');
await buildPlanLecturesHTML('2023-06-02');
await buildPlanLecturesHTML('2023-06-03');
await buildPlanLecturesHTML('2023-06-04');
await buildPlanLecturesHTML('2023-06-05');
await buildPlanLecturesHTML('2023-06-06');
await buildPlanLecturesHTML('2023-06-07');
await buildPlanLecturesHTML('2023-06-08');
await buildPlanLecturesHTML('2023-06-09');
await buildPlanLecturesHTML('2023-06-10');
await buildPlanLecturesHTML('2023-06-11');
await buildPlanLecturesHTML('2023-06-12');
await buildPlanLecturesHTML('2023-06-13');
await buildPlanLecturesHTML('2023-06-14');
await buildPlanLecturesHTML('2023-06-15');
await buildPlanLecturesHTML('2023-06-16');
await buildPlanLecturesHTML('2023-06-17');
await buildPlanLecturesHTML('2023-06-18');
await buildPlanLecturesHTML('2023-06-19');
await buildPlanLecturesHTML('2023-06-20');
await buildPlanLecturesHTML('2023-06-21');
await buildPlanLecturesHTML('2023-06-22');
await buildPlanLecturesHTML('2023-06-23');
await buildPlanLecturesHTML('2023-06-24');
await buildPlanLecturesHTML('2023-06-25');
await buildPlanLecturesHTML('2023-06-26');
await buildPlanLecturesHTML('2023-06-27');
await buildPlanLecturesHTML('2023-06-28');
await buildPlanLecturesHTML('2023-06-29');
await buildPlanLecturesHTML('2023-06-30');
await buildPlanLecturesHTML('2023-07-01');
await buildPlanLecturesHTML('2023-07-02');
await buildPlanLecturesHTML('2023-07-03');
await buildPlanLecturesHTML('2023-07-04');
await buildPlanLecturesHTML('2023-07-05');
await buildPlanLecturesHTML('2023-07-06');
await buildPlanLecturesHTML('2023-07-07');
await buildPlanLecturesHTML('2023-07-08');
await buildPlanLecturesHTML('2023-07-09');
await buildPlanLecturesHTML('2023-07-10');
await buildPlanLecturesHTML('2023-07-11');
await buildPlanLecturesHTML('2023-07-12');
await buildPlanLecturesHTML('2023-07-13');
await buildPlanLecturesHTML('2023-07-14');
await buildPlanLecturesHTML('2023-07-15');
await buildPlanLecturesHTML('2023-07-16');
await buildPlanLecturesHTML('2023-07-17');
await buildPlanLecturesHTML('2023-07-18');
await buildPlanLecturesHTML('2023-07-19');
await buildPlanLecturesHTML('2023-07-20');
await buildPlanLecturesHTML('2023-07-21');
await buildPlanLecturesHTML('2023-07-22');
await buildPlanLecturesHTML('2023-07-23');
await buildPlanLecturesHTML('2023-07-24');
await buildPlanLecturesHTML('2023-07-25');
await buildPlanLecturesHTML('2023-07-26');
await buildPlanLecturesHTML('2023-07-27');
await buildPlanLecturesHTML('2023-07-28');
await buildPlanLecturesHTML('2023-07-29');
await buildPlanLecturesHTML('2023-07-30');
await buildPlanLecturesHTML('2023-07-31');
await buildPlanLecturesHTML('2023-08-01');
await buildPlanLecturesHTML('2023-08-02');
await buildPlanLecturesHTML('2023-08-03');
await buildPlanLecturesHTML('2023-08-04');
await buildPlanLecturesHTML('2023-08-05');
await buildPlanLecturesHTML('2023-08-06');
await buildPlanLecturesHTML('2023-08-07');
await buildPlanLecturesHTML('2023-08-08');
await buildPlanLecturesHTML('2023-08-09');
await buildPlanLecturesHTML('2023-08-10');
await buildPlanLecturesHTML('2023-08-11');
await buildPlanLecturesHTML('2023-08-12');
await buildPlanLecturesHTML('2023-08-13');
await buildPlanLecturesHTML('2023-08-14');
await buildPlanLecturesHTML('2023-08-15');
await buildPlanLecturesHTML('2023-08-16');
await buildPlanLecturesHTML('2023-08-17');
await buildPlanLecturesHTML('2023-08-18');
await buildPlanLecturesHTML('2023-08-19');
await buildPlanLecturesHTML('2023-08-20');
await buildPlanLecturesHTML('2023-08-21');
await buildPlanLecturesHTML('2023-08-22');
await buildPlanLecturesHTML('2023-08-23');
await buildPlanLecturesHTML('2023-08-24');
await buildPlanLecturesHTML('2023-08-25');
await buildPlanLecturesHTML('2023-08-26');
await buildPlanLecturesHTML('2023-08-27');
await buildPlanLecturesHTML('2023-08-28');
await buildPlanLecturesHTML('2023-08-29');
await buildPlanLecturesHTML('2023-08-30');
await buildPlanLecturesHTML('2023-08-31');
await buildPlanLecturesHTML('2023-09-01');
await buildPlanLecturesHTML('2023-09-02');
await buildPlanLecturesHTML('2023-09-03');
await buildPlanLecturesHTML('2023-09-04');
await buildPlanLecturesHTML('2023-09-05');
await buildPlanLecturesHTML('2023-09-06');
await buildPlanLecturesHTML('2023-09-07');
await buildPlanLecturesHTML('2023-09-08');
await buildPlanLecturesHTML('2023-09-09');
await buildPlanLecturesHTML('2023-09-10');
await buildPlanLecturesHTML('2023-09-11');
await buildPlanLecturesHTML('2023-09-12');
await buildPlanLecturesHTML('2023-09-13');
await buildPlanLecturesHTML('2023-09-14');
await buildPlanLecturesHTML('2023-09-15');
await buildPlanLecturesHTML('2023-09-16');
await buildPlanLecturesHTML('2023-09-17');
await buildPlanLecturesHTML('2023-09-18');
await buildPlanLecturesHTML('2023-09-19');
await buildPlanLecturesHTML('2023-09-20');
await buildPlanLecturesHTML('2023-09-21');
await buildPlanLecturesHTML('2023-09-22');
await buildPlanLecturesHTML('2023-09-23');
}

run()























