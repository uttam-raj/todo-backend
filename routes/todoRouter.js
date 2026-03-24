const express = require("express");
const router = express.Router();        
const todoRouter = require('../controllers/todoController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.use(authMiddleware);

router.post("/",todoRouter.createTodo);
router.get("/",todoRouter.getTodos);
router.patch("/:id/toggle",todoRouter.toggleChecked);
router.delete("/:id",todoRouter.deleteTodo);
router.patch("/update-order",todoRouter.updateOrder);

module.exports=router;

