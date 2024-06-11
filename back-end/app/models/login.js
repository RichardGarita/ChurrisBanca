const pool = require('../../config/dbConfig');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'securechurris@gmail.com',
        pass: 'rjgp buqe gbvd jzca'
    }
});

function getRandToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 8; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

async function generate2FA(userId) {
    try {
        const token = getRandToken();
        // Update the token in the database
        const result = await pool.query('UPDATE USER SET TOKEN = ? WHERE USERNAME = ?', [token, userId]);
        if (result.affectedRows > 0) {
            return token;
        } else {
            console.log("fallow en el generate");
            return false;
        }
    } catch (error) {
        console.error('Error generating 2FA token:', error);
        throw error;
    }
}

async function sendMail(mail, token) {
    try {
        const mailOptions = {
            from: 'securechurris@gmail.com',
            to: mail,
            subject: 'Token <3',
            text: `--->   ${token}   <---`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}


async function checkLogin(userId, password) {
    try {
        if (!userId)
            return null;

        const userData = await pool.query(`SELECT * FROM USER WHERE USERNAME = ?;`, userId);
        if (userData.length === 0 || userData[0].PASSWORD !== password) {
            return false;
        }
        const token = await generate2FA(userId);
        await sendMail(userData[0].MAIL, token);
        return userData[0].ID;
    } catch (error) {
        throw error;
    }
}

async function realcheckLogin(token, userId, password) {
    try {
        if (!userId)
            return null;
        const userData = await pool.query(`SELECT * FROM USER WHERE USERNAME = ?;`, userId);

        if (userData[0].PASSWORD == password && userData[0].TOKEN == token) {
            return userData[0].ID;
        } else{
            return false;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkLogin,
    realcheckLogin
}