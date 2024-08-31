import nodemailer from 'nodemailer';
import { config } from "./config.js";

const transporter = nodemailer.createTransport({
    host: config.mailer.host,
    port: config.mailer.port,
    secure: false,
    auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass
    }
});

export const sendPurchaseEmail = async (user, ticket) => {
    const mailoptions = {
        from: config.mailer.auth.user,
        to: user.email,
        subject: 'Compra realizada con éxito',
        html: `<h1>Detalles de la compra</h1>
               <p><strong>Código:</strong> ${ticket.code}</p>
               <p><strong>Fecha:</strong> ${ticket.purchase_datetime}</p>
               <p><strong>Total:</strong> $${ticket.amount}</p>
               <p><strong>Comprador:</strong> ${user.first_name} ${user.last_name}</p>
               <p>Gracias por tu compra!</p>`
    };

    try {
        await transporter.sendMail(mailoptions);
        console.log('Email enviado');
    } catch (error) {
        console.error('Error al enviar el email', error);
        throw new Error('Error al enviar el email');
    }
}

export default transporter;