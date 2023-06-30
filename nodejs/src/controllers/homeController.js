import db from '../models/index';
import CRUDService from '../services/CRUDServices';
class homeController {
    getHomePage = async (req, res) => {
        res.render('homepage');
    }
    getCrudPage = (req, res) => {
        res.render('crud');
    }
    handleSubmitForm = async (req, res) => {
        let message = await CRUDService.createNewUser(req.body);
        console.log(message);
        let data = req.body;
        res.send(data);
    }
    displayCrud = async (req, res) => {
        try {
            let dataUser = await CRUDService.getAllUsers();
            res.render('displayCRUD', { dataUser });
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new homeController;
// let getHomePage = (req, res) => {
//     res.render('homepage.ejs');
// }
// module.exports = {
//     getHomePage
// }
