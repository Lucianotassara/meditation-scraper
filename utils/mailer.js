const nodemailer = require("nodemailer");


async function enviarMail(mail) {
  let transporter = nodemailer.createTransport({
    host: process.env.SENDER_EMAIL_HOST, 
    port: 587,
    secure: false,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PSSWD
    },
    tls: { rejectUnauthorized: false },
    log: true,
    debug: true
  });

  let info = await transporter.sendMail(mail);
  console.log(`Message sent: ${info.messageId}`)
  return info.messageId;

}

async function armarMailError(body){
  let mail = {
    from: `"Meditation Scraper" <${process.env.SENDER_EMAIL}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: `Ocurrió un error al intentar obtener una meditación`,
    html: 
    `<h3><b>Error al hacer scraping, codigo error: ${body.errorCode}</b><h3>
    <span>Fecha: ${new Date()}</span>  
      <h5> Meditacion: </h5> 
      <p>${JSON.stringify(body.meditation)}</p>
      <br>
      <p>Sin mas, gracias por leer este correo.</p>`,
    attachments: [
      {
        filename: 'attachment.html',
        content: new Buffer(body.htmlBody,'utf-8')
      }
    ]
  }

  return mail;
}

module.exports = {
  armarMailError,
  enviarMail  
}