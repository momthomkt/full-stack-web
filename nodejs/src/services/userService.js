import db from '../models/index';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

class UserService {
    handleUserLogin = (email, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                let userData = {};
                let isExist = await this.checkUserEmail(email);
                if (isExist) {

                    let user = await db.User.findOne({
                        where: { email: email },
                        attributes: ['email', 'roleId', 'password'],
                        raw: true
                    });
                    if (user) {
                        // compare password
                        // bcrypt.compareSync("B4c0/\/", hash);
                        let check = await bcrypt.compareSync(password, user.password);
                        if (check) {
                            userData.errCode = 0;
                            userData.errMessage = 'OK';
                            delete user.password;
                            userData.user = user;
                        }
                        else {
                            userData.errCode = 3;
                            userData.errMessage = "Wrong password";
                        }
                    }
                    else {
                        userData.errCode = 1;
                        userData.errMessage = "User isn't exist in the system.";
                    }
                }
                else {
                    userData.errCode = 1;
                    userData.errMessage = "Your email isn't exist in the system. Please try another email.";
                }
                resolve(userData);
            } catch (error) {
                reject(error);
            }
        })
    }

    checkUserEmail = (userEmail) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { email: userEmail }
                })
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getAllUsers = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let users = '';
                if (userId === 'All') {
                    users = await db.User.findAll({
                        attributes: {
                            exclude: ['password']
                        }
                    })
                }
                else if (userId) {
                    users = await db.User.findOne({
                        where: { id: userId },
                        attributes: {
                            exclude: ['password']
                        }
                    })
                }

                resolve(users);
            } catch (error) {
                reject(error);
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

    createNewUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                //check email
                let check = await this.checkUserEmail(data.email);
                if (check === true) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Your email is ready in used, Please try another email',
                    });
                }
                else {
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
                    resolve({
                        errCode: 0,
                        message: 'OK',
                    });
                }

            } catch (error) {
                reject(error)
            }
        })
    }

    deleteUser = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (userId === 'All') {
                    await db.User.truncate();
                }
                else {
                    let user = await db.User.findOne({
                        where: { id: userId }
                    })
                    if (!user) {
                        resolve({
                            errCode: 2,
                            errMessage: "The user isn't exist"
                        })
                    }
                    await db.User.destroy({
                        where: { id: userId }
                    });
                    resolve({
                        errCode: 0,
                        message: "The user was deleted"
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    updateUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { id: data.id }
                })
                if (!user) {
                    resolve({
                        errCode: 1,
                        errMessage: 'User is not found!'
                    })
                }
                else {
                    await db.User.update({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                    }, {
                        where: {
                            id: data.id
                        }
                    })
                    resolve({
                        errCode: 0,
                        message: 'Update info successfully'
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = new UserService;