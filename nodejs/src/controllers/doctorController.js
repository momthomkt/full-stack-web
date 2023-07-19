import db from '../models/index';
import doctorService from '../services/doctorService';
class doctorController {
    getTopDoctorHome = async (req, res) => {
        let limit = req.body.limit;
        limit = limit ? limit : 10;
        try {
            let response = await doctorService.getTopDoctorHome(limit);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            })
        }
    }
}
module.exports = new doctorController;

