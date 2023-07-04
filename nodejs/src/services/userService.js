import db from '../models/index';
import bcrypt from 'bcryptjs';
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
}

module.exports = new UserService;