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

let genHTMLForSendEmailFoPatient = (dataSend) => {
    let result = '';
    if (dataSend) {
        result = `
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
        `;
    }
    return result;
}

let sendEmailForPatient = async (dataSend) => {
    const info = await transporter.sendMail({
        from: `"Booking Care" <${process.env.EMAIL_APP}>`, // sender address
        to: dataSend.receivedEmail, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: genHTMLForSendEmailFoPatient(dataSend) // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("check Info: %s", info);
}

let genHtmlForSendAttachment = (dataSend) => {
    let result = '';
    if (dataSend) {
        result = `
        <h3>Xin chào ${dataSend.patientName},</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang web Booking Care thành công<p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>
        
        <div>Xin chân thành cảm ơn</div>
        <div>-----------------------------------------------------------------------------------------------------------------------------------</div>
        <h3>Dear ${dataSend.patientName},</h3>
        <p>You received this email because you have successfully booked an online medical appointment on the Booking Care website.<p>
        <p>Prescription/invoice information is sent in the attached file.</p>
        
        <div>Sincerely thank</div>
        `;
    }
    return result;
}

let sendAttachmentPrescription = async (dataSend) => {
    const info = await transporter.sendMail({
        from: `"Booking Care" <${process.env.EMAIL_APP}>`, // sender address
        to: dataSend.receivedEmail, // list of receivers
        subject: "Kết quả khám bệnh-Examination results", // Subject line
        //text: "Hello world?", // plain text body
        attachments: [
            {
                filename: `prescription-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgPrescription.split("base64,")[1],
                encoding: "base64"
            }
        ],
        html: genHtmlForSendAttachment(dataSend)

    });
    console.log("Message sent: %s", info.messageId);
    console.log("check Info: %s", info);
}

module.exports = {
    sendEmailForPatient, sendAttachmentPrescription
}