import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
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


    return app.use("/", router);
}
module.exports = initWebRoutes;