import patientService from '../services/patientService';
class doctorController {
    postBookAppointment = async (req, res) => {
        try {
            let result = await patientService.postBookAppointment(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            });
        }
    }

    postVerifyBookAppointment = async (req, res) => {
        try {
            let result = await patientService.postVerifyBookAppointment(req.body);
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
module.exports = new doctorController;

