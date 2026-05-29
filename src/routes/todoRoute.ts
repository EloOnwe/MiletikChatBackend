import { Router } from "express";
import protect from "../middlewares/authware.js";
import {createTodo, deleteTodo, getAllTodos, getAllTodosById, getSingleTodoById, updateTodoCompleted, updateTodoTitle} from "../controllers/todoControllers.js";

const router = Router();
router.post("/todo", protect, createTodo)
router.get("/todos", getAllTodos)
router.get("/usertodos/:id", getAllTodosById)
router.put("/usertodos/update/:id",protect, updateTodoTitle)
router.put("/usertodos/updatecompleted/:id",protect, updateTodoCompleted)
router.delete("/usertodos/delete/:id",protect, deleteTodo)
router.get("/todo/:id",protect, getSingleTodoById)

export default router;