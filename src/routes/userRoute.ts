import { Router } from "express";
import protect from "../middlewares/authware.js"
import { createUser, getUsers , deleteUser, getUser, updateUser, loginUser} from "../controllers/userControllers.js";
 
const router = Router();

router.post("/createuser", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", protect, updateUser);
router.delete("/delete/:id",protect, deleteUser);
router.post("/login", loginUser);

export default router;