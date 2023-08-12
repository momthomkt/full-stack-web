import db from '../models/index';
import { Op } from 'sequelize';

let addSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrInut = ['nameVi', 'nameEn', 'image', 'contentHTML', 'contentMarkdown']
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
                const currSpecialty = await db.Specialty.findOne({
                    where: {
                        [Op.or]: [
                            { nameVi: data.nameVi },
                            { nameEn: data.nameEn }
                        ]
                    }
                })

                if (currSpecialty) {
                    resolve({
                        errCode: 2,
                        messageEn: 'Specialization already exists',
                        messageVi: 'Chuyên khoa đã tồn tại'
                    })
                }
                else {
                    await db.Specialty.create({
                        nameVi: data.nameVi,
                        nameEn: data.nameEn,
                        image: data.image,
                        desHTML: data.contentHTML,
                        //contentMarkdown: data.contentMarkdown,
                        desMarkdown: data.contentMarkdown
                    })
                    resolve({
                        errCode: 0,
                        messageEn: 'Add specialty success',
                        messageVi: 'Thêm chuyên khoa thành công'
                    })
                }
                // const [specialty, createdSpecialty] = await db.Specialty.findOrCreate({
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
                // if (!createdSpecialty) {
                //     resolve({
                //         errCode: 2,
                //         messageEn: 'Specialization already exists',
                //         messageVi: 'Chuyên khoa đã tồn tại'
                //     })
                // }
                // else {
                //     resolve({
                //         errCode: 0,
                //         messageEn: 'Add specialty success',
                //         messageVi: 'Thêm chuyên khoa thành công'
                //     })
                // }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let resultData = [];
            let allSpecialty = await db.Specialty.findAll({
                attributes: {
                    exclude: ['desHTML', 'desMarkdown']
                }
            });
            if (allSpecialty) resultData = allSpecialty;
            resolve({
                errCode: 0,
                messageVi: 'Thành công',
                messageEn: 'Success',
                allSpecialty: resultData
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getOneSpecialty = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let specialty = await db.Specialty.findOne({
            //     where: { id: id },
            //     include: { model: db.Doctor_info, as: 'DoctorInfoData' }
            //     // { model: db.Doctor_info, as: 'DoctorInfoData', attributes: ['doctorId'] }
            // })
            let specialty = await db.Specialty.findOne({
                where: { id: id },
                include: [
                    { model: db.Doctor_info, as: 'arrDoctorData', attributes: ['doctorId'] }
                ],
                raw: false,
                nest: true
            })
            if (!specialty) {
                resolve({
                    errCode: 1,
                    message: 'Invalid specialty id',
                })
            }
            else {
                specialty.image = Buffer.from(specialty.image, 'base64').toString('binary');
                resolve({
                    errCode: 0,
                    message: 'OK',
                    specialtyData: specialty
                })
            }
            //resolve({})
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    addSpecialty, getAllSpecialty, getOneSpecialty
}