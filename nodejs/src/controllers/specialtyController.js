import specialtyService from '../services/specialtyService';
class specialtyController {
    addSpecialty = async (req, res) => {
        try {
            let result = await specialtyService.addSpecialty(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            });
        }
    }
    getAllSpecialty = async (req, res) => {
        try {
            let result = await specialtyService.getAllSpecialty();
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            });
        }
    }
    getOneSpecialty = async (req, res) => {
        try {
            let result = await specialtyService.getOneSpecialty(req.query.id);
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
module.exports = new specialtyController;

