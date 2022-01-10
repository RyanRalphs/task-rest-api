const sgMail = require('@sendgrid/mail')
require('dotenv').config()  
const sendgridApiKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridApiKey)

const sendWelcomeEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'dev@ryanralphs.co.uk',
        subject: 'Welcome to the Task App',
        text: `Thank you for joining the Task App, ${name}! Please email me if you need any help.`
    }).then(() => {
            return true
    }).catch((error) => {
            return false
    })
}

const sendCancellationEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'dev@ryanralphs.co.uk',
        subject: 'We hope you enjoyed your stay',
        text: `Thank you for using the Task App, ${name}! We hope to see you again soon`
    })
} 


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}