import { Router } from "express";
import {
  addUserAppointment,
  addUserDocument,
  createUser,
  deleteUser,
  deleteUserAppointment,
  deleteUserDocument,
  getUserAppointment,
  getUserAppointments,
  getUserById,
  getUserDocument,
  getUserDocuments,
  getUsers,
  updateUser,
  updateUserAppointment,
  updateUserDocument,
} from "../controllers/userController.js";

const userRouter = Router();

// CRUD for User collection
userRouter.post("/users", createUser);
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUserById);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);

// CRUD for documents embedded in each user
userRouter.get("/users/:id/documents", getUserDocuments);
userRouter.post("/users/:id/documents", addUserDocument);
userRouter.get("/users/:id/documents/:documentId", getUserDocument);
userRouter.put("/users/:id/documents/:documentId", updateUserDocument);
userRouter.delete("/users/:id/documents/:documentId", deleteUserDocument);

// CRUD for appointments_callsummary embedded in each user
userRouter.get("/users/:id/appointments", getUserAppointments);
userRouter.post("/users/:id/appointments", addUserAppointment);
userRouter.get("/users/:id/appointments/:appointmentId", getUserAppointment);
userRouter.put("/users/:id/appointments/:appointmentId", updateUserAppointment);
userRouter.delete("/users/:id/appointments/:appointmentId", deleteUserAppointment);

export default userRouter;

