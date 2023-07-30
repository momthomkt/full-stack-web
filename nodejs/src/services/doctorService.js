import db from '../models/index';
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
            let infoArr = ['contentHTML', 'contentMarkdown', 'doctorId', 'priceId', 'provinceId', 'paymentId', 'addressClinic', 'nameClinic'];
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
                    priceId: data.priceId,
                    provinceId: data.provinceId,
                    paymentId: data.paymentId,
                    addressClinic: data.addressClinic,
                    nameClinic: data.nameClinic,
                    note: data.note ? data.note : null
                })
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                    // specialtyId: data.specialtyId,
                    // clinicId: data.clinicId
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
                    exclude: ['password', 'createdAt', 'updatedAt']
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
            let infoArr = ['contentHTML', 'contentMarkdown', 'doctorId', 'priceId', 'provinceId', 'paymentId', 'addressClinic', 'nameClinic'];
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
                        message: 'Markdown is not found!'
                    })
                }
                else {
                    let objMarkdown = {
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description ? data.description : ''
                    }
                    let objInfos = {
                        priceId: data.priceId,
                        provinceId: data.provinceId,
                        paymentId: data.paymentId,
                        addressClinic: data.addressClinic,
                        nameClinic: data.nameClinic,
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
                //console.log(schedule);
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
                //console.log("check new date: ", date);
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })
                //console.log('check result data: ', data)
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

module.exports = {
    getTopDoctorHome, getAllDoctor, addDoctorInfo,
    getDetailDoctor, updateDoctorInfo, getDoctorMarkdown,
    bulkCreateSchedule, getScheduleByDate, getDetailManageDoctor
}