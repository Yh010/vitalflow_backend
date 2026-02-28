import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { uploadUserDocumentToS3 } from "../utils/s3Upload.js";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, email, password, document_urls, appointments_callsummary } = req.body;
    console.log("Creating user with data:", { id, email, password, document_urls, appointments_callsummary });
    const user = await User.create({
      id,
      email,
      password,
      document_urls,
      appointments_callsummary,
    });
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await User.findOneAndUpdate({ id: Number(id) }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await User.findOneAndDelete({ id: Number(id) });
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getUserDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user.document_urls);
  } catch (error) {
    next(error);
  }
};

export const addUserDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, type, description } = req.body;

    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No document file uploaded" });
    }

    const s3Url = await uploadUserDocumentToS3(req.file, Number(id));

    if (!type) {
      return res.status(400).json({ message: "Document type is required" });
    }

    const documentName = name || req.file.originalname;

    user.document_urls.push({ url: s3Url, name: documentName, type, description });
    await user.save();

    const createdDocument = user.document_urls[user.document_urls.length - 1];
    return res.status(201).json(createdDocument);
  } catch (error) {
    next(error);
  }
};

export const getUserDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, documentId } = req.params;
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const document = (user.document_urls as any).id(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};

export const updateUserDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, documentId } = req.params;
    const { url, name, type, description } = req.body;

    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const document = (user.document_urls as any).id(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (url !== undefined) document.url = url;
    if (name !== undefined) document.name = name;
    if (type !== undefined) document.type = type;
    if (description !== undefined) document.description = description;

    await user.save();

    return res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};

export const deleteUserDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, documentId } = req.params;
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const document = (user.document_urls as any).id(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.deleteOne();
    await user.save();

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getUserAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user.appointments_callsummary);
  } catch (error) {
    next(error);
  }
};

export const addUserAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { date, doctorOrClinic, location, call_summary } = req.body;

    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.appointments_callsummary.push({
      date,
      doctorOrClinic,
      location,
      call_summary,
    });
    await user.save();

    const createdAppointment =
      user.appointments_callsummary[user.appointments_callsummary.length - 1];
    return res.status(201).json(createdAppointment);
  } catch (error) {
    next(error);
  }
};

export const getUserAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, appointmentId } = req.params;
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const appointment = (user.appointments_callsummary as any).id(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const updateUserAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, appointmentId } = req.params;
    const { date, doctorOrClinic, location, call_summary } = req.body;

    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const appointment = (user.appointments_callsummary as any).id(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (date !== undefined) appointment.date = date;
    if (doctorOrClinic !== undefined) appointment.doctorOrClinic = doctorOrClinic;
    if (location !== undefined) appointment.location = location;
    if (call_summary !== undefined) appointment.call_summary = call_summary;

    await user.save();

    return res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const deleteUserAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, appointmentId } = req.params;
    const user = await User.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const appointment = (user.appointments_callsummary as any).id(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.deleteOne();
    await user.save();

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

