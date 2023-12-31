import bcrypt from 'bcryptjs';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);

class CrudService {
    createNewUser = async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let hashPasswordFromBcypt = await this.hashUserPassord(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender == '1' ? true : false,
                    roleId: data.roleId
                })
                resolve('ok create a new user successfully');
            } catch (error) {
                reject(error)
            }
        })
    }

    hashUserPassord = (password) => {
        return new Promise(async (resolve, reject) => {
            try {
                let hashPassword = await bcrypt.hashSync(password, salt);
                resolve(hashPassword);
            } catch (error) {
                reject(error);
            }
        })
    }

    getAllUsers = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let dataUser = await db.User.findAll();
                resolve(dataUser);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = new CrudService

