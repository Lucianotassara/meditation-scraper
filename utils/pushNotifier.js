async function sendPushNotification(meditation, error){
    try{
        console.log(new Date()+': - Envío de notificación transmisión en vivo para video\n');
        
        var sendNotification = function(data) {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": process.env.MS_ONESIGNAL_API_KEY 
        };
        
        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };
        
        var https = require('https');
        var req = https.request(options, function(res) {  
            res.on('data', function(data) {
            console.log("Response:");
            console.log(JSON.parse(data));
            });
        });
        
        console.log(
            '+++++++ \n' +
            new Date()+':\n ENVIO NOTIFICACION PUSH ONESIGNAL:  MEDITATION SCRAPER');
            
            req.on('error', function(e) {
            console.log("ERROR:");
            console.log(e);
            });
            
            req.write(JSON.stringify(data));
            req.end();
        };
        
        // Mensaje para ambiente desarrollo
        let messageDesa
        if(error){
            messageDesa = { 
                app_id: process.env.MS_ONESIGNAL_APP_ID,
                headings: {"en": `SCRPNG ERROR!!`},
                data: {"origen": "MEDITATION_SCRAPER", "tipo": "versiculo"},
                contents: {"en": `Se enviará un email con el error -> ${error}`},
                large_icon: '',
                template_id: process.env.MS_ONESIGNAL_TEMPLATE_ID,
                include_player_ids: [process.env.MS_ONESIGNAL_INCLUDE_PLAYER_IDS] //Test user Moto G4 Lucho, si se usa esta linea, comentar la de "included_segments"
            }
        } else {
            messageDesa = { 
                app_id: process.env.MS_ONESIGNAL_APP_ID,
                headings: {"en": `SCRPD -> ${meditation.titulo}`},
                data: {"origen": "MEDITATION_SCRAPER", "tipo": "versiculo", "idVersiculo":meditation._id},
                contents: {"en": meditation.cita + ' - ' + meditation.texto.substring(0,400)+'... '},
                large_icon: meditation.avatarurl,
                template_id: process.env.MS_ONESIGNAL_TEMPLATE_ID,
                include_player_ids: [process.env.MS_ONESIGNAL_INCLUDE_PLAYER_IDS] //Test user Moto G4 Lucho, si se usa esta linea, comentar la de "included_segments"
            }
        }
        
        
        if (process.env.ENV == 'desa' || process.env.ENV == 'raspi'){
            console.log('Envío Notificación push en entorno DESAROLLO. Envío solo a algunos player-ids') ;
            sendNotification(messageDesa); 
            console.log("Notificación enviada");
            
        }
        } catch (e) {
        //   generateServerErrorCode(res, 500, e.toString(), SOME_THING_WENT_WRONG);
        }
    }



module.exports = {
    sendPushNotification  
}