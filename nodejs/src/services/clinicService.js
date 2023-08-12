import db from '../models/index';
import { Op } from 'sequelize';

let addClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrInut = ['nameVi', 'nameEn', 'image', 'address', 'provinceId', 'contentHTML', 'contentMarkdown']
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
                    message: 'Missing input parameter',
                })
            }
            else {
                const currClinic = await db.Clinic.findOne({
                    where: {
                        [Op.or]: [
                            { nameVi: data.nameVi },
                            { nameEn: data.nameEn }
                        ]
                    }
                })

                if (currClinic) {
                    resolve({
                        errCode: 2,
                        messageEn: 'Clinic already exists',
                        messageVi: 'Phòng khám đã tồn tại'
                    })
                }
                else {
                    await db.Clinic.create({
                        nameVi: data.nameVi,
                        nameEn: data.nameEn,
                        image: data.image,
                        address: data.address,
                        provinceId: data.provinceId,
                        desHTML: data.contentHTML,
                        desMarkdown: data.contentMarkdown
                    })
                    resolve({
                        errCode: 0,
                        messageEn: 'Add clinic success',
                        messageVi: 'Thêm chuyên khoa thành công'
                    })
                }
                // const [clinic, createdClinic] = await db.Clinic.findOrCreate({
                //     where: {
                //         [Op.or]: [
                //             { nameVi: data.nameVi },
                //             { nameEn: data.nameEn }
                //         ]
                //     },
                //     defaults: {
                //         contentMarkdown: 'thang ranh con nay',
                //         nameVi: data.nameVi,
                //         nameEn: data.nameEn,
                //         image: data.image,
                //         contentHTML: data.contentHTML,
                //         //contentMarkdown: data.contentMarkdown,
                //     }
                // });
                // if (!createdClinic) {
                //     resolve({
                //         errCode: 2,
                //         messageEn: 'Specialization already exists',
                //         messageVi: 'Chuyên khoa đã tồn tại'
                //     })
                // }
                // else {
                //     resolve({
                //         errCode: 0,
                //         messageEn: 'Add clinic success',
                //         messageVi: 'Thêm chuyên khoa thành công'
                //     })
                // }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                attributes: {
                    exclude: ['address', 'provinceId', 'desHTML', 'desMarkdown']
                }
            });
            resolve({
                errCode: 0,
                messageVi: 'Thành công',
                messageEn: 'Success',
                allClinic: data ? data : []
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getOneClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: id },
                include: [
                    { model: db.Doctor_info, as: 'arrDoctorData', attributes: ['doctorId'] }
                ],
                raw: false,
                nest: true
            })
            if (!clinic) {
                resolve({
                    errCode: 1,
                    message: 'Invalid clinic id',
                })
            }
            else {
                clinic.image = Buffer.from(clinic.image, 'base64').toString('binary');
                resolve({
                    errCode: 0,
                    message: 'OK',
                    clinicData: clinic
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAllClinic, getOneClinic, addClinic
}