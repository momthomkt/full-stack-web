import db from '../models/index';
//const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

let sendEmailForPatient = async (dataSend) => {
    const info = await transporter.sendMail({
        from: `"Booking Care" <${process.env.EMAIL_APP}>`, // sender address
        to: dataSend.receivedEmail, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `
        <h3>Xin chào ${dataSend.patientName},</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang web Booking Care.<p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.timeExamVi}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu anh/chị đồng ý với các thông tin trên, vui lòng click vào đường dẫn dưới đây để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
        <a href=${dataSend.linkConfirm} targer="_blank">Xác nhận</a>
        </div>
        <div>Xin chân thành cảm ơn</div>
        <div>-----------------------------------------------------------------------------------------------------------------------------------</div>
        <h3>Dear ${dataSend.patientName},</h3>
        <p>You received this email because of your medical appointment on our Bookingcare website.<p>
        <p>Information about a medical appointment:</p>
        <div><b>Time: ${dataSend.timeExamEn}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If you agree about the above information, please click on the link below to confirm and complete the procedure to book an appointment.</p>
        <div>
        <a href=${dataSend.linkConfirm} targer="_blank">Confirm</a>
        </div>
        <div>Sincerely thank</div>
        `, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("check Info: %s", info);
}

module.exports = {
    sendEmailForPatient
}