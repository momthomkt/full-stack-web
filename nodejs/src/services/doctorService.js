import db from '../models/index';
import emailService from './emailService';
require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                limit: limit,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error);
        }
    })
}

let addDoctorInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let infoArr = ['contentHTML', 'contentMarkdown', 'doctorId', 'specialtyId', 'clinicId', 'priceId', 'paymentId'];
            let checkInput = true;
            for (let ele of infoArr) {
                if (!data[ele]) {
                    checkInput = false;
                    break;
                }
            }
            if (!checkInput) {
                resolve({
                    errCode: -1,
                    message: 'Missing parameters'
                })
            }
            else {
                await db.Doctor_info.create({
                    doctorId: data.doctorId,
                    specialtyId: data.specialtyId,
                    clinicId: data.clinicId,
                    priceId: data.priceId,
                    paymentId: data.paymentId,
                    note: data.note ? data.note : null
                })
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId
                });
                resolve({
                    errCode: 0,
                    message: 'Save info doctor succeed'
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorData = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdown, as: 'markDown', attributes: { exclude: ['createdAt', 'updatedAt'] } },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: false,
                nest: true
            })

            if (doctorData && doctorData.image) {
                // doctorData.image = new Buffer(doctorData.image, 'base64').toString('binary');
                doctorData.image = Buffer.from(doctorData.image, 'base64').toString('binary');
            }

            if (!doctorData) doctorData = {};

            resolve({
                errCode: 0,
                message: 'OK',
                doctorData: doctorData
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailManageDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorData = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['email', 'password', 'address', 'phoneNumber', 'gender', 'roleId', 'positionId', 'image', 'createdAt', 'updatedAt']
                },
                include: [
                    { model: db.Markdown, as: 'markDown', attributes: { exclude: ['createdAt', 'updatedAt'] } },
                    { model: db.Doctor_info, as: 'doctorInfos', attributes: { exclude: ['createdAt', 'updatedAt'] } }
                ],
                raw: false,
                nest: true
            })
            if (!doctorData) doctorData = {};

            resolve({
                errCode: 0,
                message: 'OK',
                doctorData: doctorData
            })
        } catch (error) {
            reject(error);
        }
    })
}

let updateDoctorInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let infoArr = ['contentHTML', 'contentMarkdown', 'doctorId', 'specialtyId', 'clinicId', 'priceId', 'paymentId'];
            let checkInput = true;
            for (let ele of infoArr) {
                if (!data[ele]) {
                    checkInput = false;
                    break;
                }
            }
            if (!checkInput) {
                resolve({
                    errCode: -1,
                    message: 'Missing parameters'
                })
            }
            else {
                let infoMarkdown = await db.Markdown.findOne({
                    where: { doctorId: data.doctorId }
                })
                let doctor_infos = await db.Doctor_info.findOne({
                    where: { doctorId: data.doctorId }
                })
                if (!infoMarkdown || !doctor_infos) {
                    resolve({
                        errCode: 1,
                        message: 'Markdown or doctorInfos is not found!'
                    })
                }
                else {
                    let objMarkdown = {
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description ? data.description : ''
                    }
                    let objInfos = {
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                        priceId: data.priceId,
                        paymentId: data.paymentId,
                        note: data.note ? data.note : null
                    }
                    await db.Markdown.update(objMarkdown, {
                        where: { doctorId: data.doctorId }
                    })
                    await db.Doctor_info.update(objInfos, {
                        where: { doctorId: data.doctorId }
                    })
                    resolve({
                        errCode: 0,
                        message: 'OK'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDoctorMarkdown = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let markDown = await db.Markdown.findOne({
                where: { doctorId: doctorId }
            })
            resolve({
                errCode: 0,
                message: 'OK',
                markDown: markDown
            })
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = async (schedule) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!schedule) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            }
            else if (schedule.length > 0) {
                schedule = schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                })

                await db.Schedule.destroy({
                    where: { doctorId: schedule[0].doctorId, date: new Date(schedule[0].date) }
                });
                await db.Schedule.bulkCreate(schedule);

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getExtraDoctorInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameter"
                })
            }
            else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: id },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        //{ model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                        { model: db.Clinic, as: 'clinicData', attributes: ['nameVi', 'nameVi', 'provinceId', 'address'] }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    message: 'OK',
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDoctorIntro = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameter"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Markdown, as: 'markDown', attributes: ['description'] },
                        // { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        // { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] }
                        {
                            model: db.Doctor_info,
                            as: 'doctorInfos',
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Clinic, as: 'clinicData', attributes: ['nameVi', 'nameEn', 'provinceId', 'address'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    message: 'OK',
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}



let getPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                console.log('alooooooooooooooooooooooooooooooooooooooooooooooooo');
                resolve({
                    errCode: 1,
                    message: "Missing input parameter"
                })
            }
            else {
                let bookingArr = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: new Date(date)
                    },
                    include: [
                        { model: db.Allcode, as: 'timeData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.User, as: 'patientData', attributes: ['email', 'firstName', 'lastName', 'address', 'phoneNumber', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    message: "Success",
                    bookingArr: bookingArr
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let sendPrescription = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const inputArr = ['email', 'doctorId', 'patientId', 'timeType', 'imgPrescription', 'firstName', 'lastName'];
            let isValid = true;
            for (let ele of inputArr) {
                if (!data[ele] || typeof data[ele] === "undefined") isValid = false;
                break;
            }
            if (!isValid) {
                resolve({
                    errCode: 1,
                    message: 'Missing input parameter'
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                });

                if (appointment) {
                    await emailService.sendAttachmentPrescription({
                        receivedEmail: data.email,
                        patientName: data.firstName + ' ' + data.lastName,
                        patientId: data.patientId,
                        imgPrescription: data.imgPrescription
                    });
                    appointment.statusId = 'S3';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        message: 'OK'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        message: 'Invalid input'
                    })
                }
            }

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getTopDoctorHome, getAllDoctor, addDoctorInfo,
    getDetailDoctor, updateDoctorInfo, getDoctorMarkdown,
    bulkCreateSchedule, getScheduleByDate, getDetailManageDoctor,
    getExtraDoctorInfo, getDoctorIntro, getPatientForDoctor,
    sendPrescription
}