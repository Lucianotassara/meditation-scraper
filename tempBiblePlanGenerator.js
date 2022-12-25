const fetch = require('node-fetch');
var moment = require('moment'); // require
moment().format();

let evidaApiUrl = `https://apiv2.encuentrovida.com.ar:443`


async function getPlanLectures(dayNumber) {
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

async function buildPlanLecturesHTML(futureDate) {
    let now = new Date(futureDate);

    let momentDay;
    console.log('************************************************************************************');
    momentDay = moment(now).add(1, 'days').dayOfYear(); // Number

    // console.log(`Day of year for next meditation using moment.js: ${momentDay}`);
    // console.log('************************************************************************************');


    //search for the date of the year within the const of bible plan
    //Foreach searching within the const for the verse of the calculated date
    let data = await getPlanLectures(momentDay);

    let verseList = '';
    for (let value of data) {
        // console.log(value);
        verseList += `<li><a href='${value.url}'>${value.displayVerse}</a></li>`;
        // dayOfYear = value.dayNumber;
    }

    //create HTML string to concatenate to the meditation.
    let htmlBiblePlan = `<div><br><h3>Biblia en un año:</h3><span><i>Día ${momentDay} </i></span><ul>${verseList}</ul></div>`;
    console.log(htmlBiblePlan);

    return htmlBiblePlan;
}

async function run() {

    await buildPlanLecturesHTML("2023-12-24")
    await buildPlanLecturesHTML("2023-12-25")
    await buildPlanLecturesHTML("2023-12-26")
    await buildPlanLecturesHTML("2023-12-27")
    await buildPlanLecturesHTML("2023-12-28")
    await buildPlanLecturesHTML("2023-12-29")
    await buildPlanLecturesHTML("2023-12-30")
    await buildPlanLecturesHTML("2023-12-31")

}

run()























