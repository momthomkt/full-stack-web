import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
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

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctor);
    router.post('/api/add-doctor-info', doctorController.addDoctorInfo);
    router.get('/api/get-detail-doctor', doctorController.getDetailDoctor);
    router.get('/api/detail-manage-doctor', doctorController.getDetailManageDoctor);
    router.put('/api/update-doctor-info', doctorController.updateDoctorInfo);
    router.get('/api/get-doctor-markdown', doctorController.getDoctorMarkdown);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);

    return app.use("/", router);
}
module.exports = initWebRoutes;