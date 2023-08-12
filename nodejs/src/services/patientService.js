import db from '../models/index';
import { Op } from 'sequelize';
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildLinkEmail = (token, doctorId) => {
    let result = `${process.env.URL_FE_VERIFY_EMAIL}?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrInut = ['firstName', 'lastName', 'email', 'address', 'phoneNumber', 'gender',
                'reason', 'doctorId', 'date', 'timeType', 'timeExamVi', 'timeExamEn', 'doctorName', 'linkConfirm']
            let isValid = true;
            for (let ele of arrInut) {
                if (!data[ele]) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                const [patient, createdUser] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        gender: data.gender,
                        roleId: 'R3'
                    }
                });

                let token = uuidv4();

                const [booking, createdBooking] = await db.Booking.findOrCreate({
                    where: {
                        doctorId: data.doctorId, patientId: patient.id,
                        statusId: {
                            [Op.or]: ['S1', 'S2']
                        }
                    },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: patient.id,
                        date: data.date,
                        timeType: data.timeType,
                        reason: data.reason,
                        token: token
                    }
                });
                if (createdBooking) {
                    await emailService.sendEmailForPatient({
                        receivedEmail: data.email,
                        patientName: data.firstName + ' ' + data.lastName,
                        timeExamVi: data.timeExamVi,
                        timeExamEn: data.timeExamEn,
                        doctorName: data.doctorName,
                        linkConfirm: buildLinkEmail(token, data.doctorId)
                    });
                    resolve({
                        errCode: 0,
                        message: 'Make an appointment succeed',
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessageEn: "You can't make an appointment because you already have an appointment with this doctor",
                        errMessageVi: "Bạn không thể đặt lịch hẹn vì bạn đã có lịch hẹn với bác sĩ này rồi",
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrInput = ['token', 'doctorId'];
            let isValid = true;
            for (let ele of arrInput) {
                if (!data[ele]) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                })
            }
            else {
                let booking = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (booking) {
                    booking.statusId = 'S2'
                    await booking.save();
                    resolve({
                        errCode: 0,
                        message: "Confirm appointment succeed"
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        message: "Appointment confirmed or non-existent"
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    postBookAppointment, postVerifyBookAppointment
}