import db from '../models/index';
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
                errMessage: 'Save info doctor succeed'
            });
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

let updateDoctorInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let infoMarkdown = await db.Markdown.findOne({
                where: { doctorId: data.doctorId }
            })
            if (!infoMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Markdown is not found!'
                })
            }
            else {
                let objMarkdown = {
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description ? data.description : ''
                }
                await db.Markdown.update(objMarkdown, {
                    where: { doctorId: data.doctorId }
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
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

module.exports = {
    getTopDoctorHome, getAllDoctor, addDoctorInfo,
    getDetailDoctor, updateDoctorInfo, getDoctorMarkdown
}