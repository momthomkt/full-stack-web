import userService from '../services/userService';
class UserController {
    handleLogin = async (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            res.status(500).json({
                errCode: 1,
                message: 'Missing input parameters'
            })
        }

        let userData = await userService.handleUserLogin(email, password);

        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {}
        })
    }

    handleGetAllUsers = async (req, res) => {
        let id = req.query.id

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters',
                users: []
            })
        }
        let users = await userService.getAllUsers(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            users
        })
    }

    handleCreateNewUser = async (req, res) => {
        let message = await userService.createNewUser(req.body);
        // console.log(message);
        return res.status(200).json(message);
    }

    handleEditNewUser = async (req, res) => {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters!'
            });
        }
        let message = await userService.updateUser(req.body);
        return res.status(200).json(message);
    }

    handleDeleteNewUser = async (req, res) => {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters!'
            });
        }
        let message = await userService.deleteUser(req.body.id);
        return res.status(200).json(message);
    }

    getAllCode = async (req, res) => {
        try {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            })
        }
    }
}

module.exports = new UserController;