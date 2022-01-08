import nodemailer from 'nodemailer';
import config from 'config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import table from './ticket.helper';
import { ITicket } from '../../interfaces/event.interface';

const mailer = <string>config.get('MAILER_EMAIL') || '';
const pwd = <string>config.get('MAILER_PWD') || '';
const callbackurl = <string>config.get('CALLBACK_URL') || '';

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: mailer,
        pass: pwd
    }
});

//Account Activation Notification
const accountActivationEmail = async (firstname: string, temp_token: string, email: string, pin: string) => {
    const mailOptions = {
        from: `HB Events<${mailer}>`,
        to: `${email}`,
        subject: 'Account Activation',
        html: `<body> 
               <header> <h1>HB EVENTS</h1> </header> 
               <br> 
               <section> 
                    <p>Welcome <b>${firstname}</b>. Thank you for choosing <b>HB EVENTS & USHERING SERVICES</b>. <br /> You are just one step away to completing your account setup. <br />
                    Please click the link below to activate your account</p> 
                    <br> 
                    <a href="${callbackurl}/auth/activate-account?token=${temp_token}" target="_blank">ACTIVATE ACCOUNT</a>
                    <br> 
                    <p>You will be required to enter your PIN: <strong>${pin}</strong></p>
               </section> 
            </body>`
    };

    try {
        const resp = await transporter.sendMail(mailOptions);
        return {
            message: 'Email sent: ' + resp.response,
            status: 'ok',
            code: '200'
        };
    } catch (error: any) {
        return { message: error.message, status: 'error', code: error.name };
    }
};

//Password Reset Request Notification
const passwordResetRequestEmail = async (
    firstname: string,
    temp_token: string,
    email: string,
    temp_pin: number | string
) => {
    const mailOptions = {
        from: `HB Events<${mailer}>`,
        to: `${email}`,
        subject: 'Password Reset Request',
        html: `<body> 
                 <header> <h1>HB EVENTS</h1> </header> 
                  
                 <section> 
                      <p>Hello <b>${firstname}</b>. We received a password reset request from you. Kindly click on the link below to reset your password</p> 
                      <p><i>Ignore this message if you did not make any request.</i></p>
                      <br> 
                      <a href="${callbackurl}/reset-password?token=${temp_token}" target="_blank"> RESET PASSWORD</a>
                      
                      <p>You will be required to enter this pin during the password reset</p>
                      <p>PIN: <b>${temp_pin}</b></p> 
                 </section> 
              </body>`
    };

    transporter.sendMail(mailOptions, (error: Error | null, info: SMTPTransport.SentMessageInfo) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

//Generate random digit Code
const generatePin = (digit: number) => {
    return Math.random().toFixed(digit).split('.')[1];
};

const sendTicketEmail = async (email: string, firstname: string, items: ITicket[], purchaseId: string) => {
    const preamble = `<header>
  <h2>HB EVENTS TICKET PURCHASE</h2>
</header>
<section>
  <p>
    Hello <b>${firstname}</b>. Thank you for choosing
    <b>HB EVENTS & USHERING SERVICES</b>. <br />
  </p>
</section>
<section>
  <p>
  Please, <a href="${callbackurl}/user/qr-codes?purchaseId=${purchaseId}" target="_blank">click this link</a> to see your qr code. Do not share with anyone. You will be required to provide it for
    authentication at the gate entry during the event.
  </p>
  
</section>`;

    let tbl = table(items);
    const mailOptions = {
        from: `HB Events<${mailer}>`,
        to: `${email}`,
        subject: 'Ticket Purchase',
        html: `${preamble}${tbl}`
    };

    try {
        const resp = await transporter.sendMail(mailOptions);
        return {
            message: 'Email sent: ' + resp.response,
            status: 'ok',
            code: 200
        };
    } catch (error: any) {
        return { message: error.message, status: 'error', code: error.name };
    }
};

//Ticket verification email
const ticketVerificationEmail = async (firstname: string, email: string, pin: string) => {
    const mailOptions = {
        from: `HB Events<${mailer}>`,
        to: `${email}`,
        subject: 'Ticket Verification',
        html: `<body> 
             <header> <h1>HB EVENTS</h1> </header> 
             <br> 
             <section> 
                  <p>Dear <b>${firstname}</b>, You have authorised your ticket to be redeemed.</p> 
                  
                  <p>Your ticket verification code is: <strong>${pin}</strong></p>

                  <p>Kindly mention this to the agent at the entry booth to complete your verification</p>

                  <p><i>Please ignore this email if you did not request this.</i></p>
             </section> 
          </body>`
    };

    try {
        const resp = await transporter.sendMail(mailOptions);
        return {
            message: 'Email sent: ' + resp.response,
            status: 'ok',
            code: '200'
        };
    } catch (error: any) {
        return { message: error.message, status: 'error', code: error.name };
    }
};

export { accountActivationEmail, passwordResetRequestEmail, generatePin, sendTicketEmail, ticketVerificationEmail };
