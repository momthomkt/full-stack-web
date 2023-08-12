import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/crud", homeController.getCrudPage);
    router.post("/handle-submit-form", homeController.handleSubmitForm);
    router.get("/display-crud", homeController.displayCrud);


    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditNewUser);
    router.delete('/api/delete-user', userController.handleDeleteNewUser);

    router.get('/api/allcode', userController.getAllCode);

    /////////////////
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctor);
    router.post('/api/add-doctor-info', doctorController.addDoctorInfo);
    router.get('/api/get-detail-doctor', doctorController.getDetailDoctor);
    router.get('/api/detail-manage-doctor', doctorController.getDetailManageDoctor);
    router.put('/api/update-doctor-info', doctorController.updateDoctorInfo);
    router.get('/api/get-doctor-markdown', doctorController.getDoctorMarkdown);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-doctor-info-by-id', doctorController.getExtraDoctorInfo);
    router.get('/api/get-profile-doctor-by-id', doctorController.getDoctorIntro);
    router.get('/api/get-list-patient-for-doctor', doctorController.getPatientForDoctor);
    router.post('/api/send-prescription', doctorController.sendPrescription);
    /////////////////
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.post('/api/create-specialty', specialtyController.addSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-one-specialty', specialtyController.getOneSpecialty);
    /////////////////
    router.get('/api/get-all-clinic', clinicController.getAllClinic);

    router.post('/api/create-clinic', clinicController.addClinic);
    router.get('/api/get-one-clinic', clinicController.getOneClinic);
    return app.use("/", router);
}
module.exports = initWebRoutes;