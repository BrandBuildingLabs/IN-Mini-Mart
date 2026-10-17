import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    console.log("Provide RESEND_API in side the .env file")
}

const resend = process.env.RESEND_API ? new Resend(process.env.RESEND_API) : null;

const sendEmail = async({sendTo, subject, html })=>{
    if (!resend) { console.warn('Email provider is not configured; skipping verification email.'); return null }
    try {
        const { data, error } = await resend.emails.send({
            from: 'Binkeyit <noreply@amitprajapati.co.in>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail

