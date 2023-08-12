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

    getAllDoctor = async (req, res) => {
        try {
            let doctors = await doctorService.getAllDoctor();
            return res.status(200).json(doctors);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            })
        }
    }

    addDoctorInfo = async (req, res) => {
        try {
            let data = req.body;
            let result = await doctorService.addDoctorInfo(data);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            })
        }
    }

    getDetailDoctor = async (req, res) => {
        try {
            if (!req.query.id) {
                return res.status(200).json({
                    errCode: -1,
                    message: 'Missing parameters'
                })
            }
            let data = await doctorService.getDetailDoctor(req.query.id);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            })
        }
    }

    getDetailManageDoctor = async (req, res) => {
        try {
            if (!req.query.id) {
                return res.status(200).json({
                    errCode: -1,
                    message: 'Missing parameters'
                })
            }
            let data = await doctorService.getDetailManageDoctor(req.query.id);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            })
        }
    }

    updateDoctorInfo = async (req, res) => {
        try {
            let result = await doctorService.updateDoctorInfo(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            })
        }
    }

    getDoctorMarkdown = async (req, res) => {
        try {
            if (!req.query.doctorId) {
                return res.status(200).json({
                    errCode: -1,
                    message: 'Missing input parameter'
                });
            }
            let result = await doctorService.getDoctorMarkdown(req.query.doctorId);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    }

    bulkCreateSchedule = async (req, res) => {
        try {
            // if (!req.query.doctorId) {
            //     return res.status(200).json({
            //         errCode: -1,
            //         message: 'Missing input parameter'
            //     });
            // }
            let result = await doctorService.bulkCreateSchedule(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    }

    getScheduleByDate = async (req, res) => {
        try {
            let result = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    }

    getExtraDoctorInfo = async (req, res) => {
        try {
            let result = await doctorService.getExtraDoctorInfo(req.query.id);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    }

    getDoctorIntro = async (req, res) => {
        try {
            let result = await doctorService.getDoctorIntro(req.query.id);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    }

    getPatientForDoctor = async (req, res) => {
        try {
            let result = await doctorService.getPatientForDoctor(req.query.doctorId, req.query.date);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    }

    sendPrescription = async (req, res) => {
        try {
            let result = await doctorService.sendPrescription(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    }

}
module.exports = new doctorController;

