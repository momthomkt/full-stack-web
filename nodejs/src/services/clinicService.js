import db from '../models/index';
import { Op } from 'sequelize';

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                attributes: {
                    exclude: ['desHTML', 'desMarkdown']
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
                where: { id: id }
            })
            if (!clinic) {
                resolve({
                    errCode: 1,
                    message: 'Invalid clinic id',
                })
            }
            else {
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
    getAllClinic, getOneClinic
}