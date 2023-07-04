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
    return app.use("/", router);
}
module.exports = initWebRoutes;