import clinicService from '../services/clinicService';
class clinicController {
    addClinic = async (req, res) => {
        try {
            let result = await clinicService.addClinic(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            });
        }
    }
    getAllClinic = async (req, res) => {
        try {
            let result = await clinicService.getAllClinic();
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            });
        }
    }
    getOneClinic = async (req, res) => {
        try {
            let result = await clinicService.getOneClinic(req.query.id);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            });
        }
    }
}
module.exports = new clinicController;

