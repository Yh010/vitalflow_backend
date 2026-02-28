import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface DocumentUrl {
  _id?: Types.ObjectId;
  url: string;
  name: string;
  type: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppointmentCallSummary {
  _id?: Types.ObjectId;
  date: Date;
  doctorOrClinic: string;
  location: string;
  call_summary: string;
}

export interface UserDocument extends Document {
  id: number;
  email: string;
  password: string;
  document_urls: DocumentUrl[];
  appointments_callsummary: AppointmentCallSummary[];
}

const DocumentUrlSchema = new Schema<DocumentUrl>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, default: "Other" },
    description: { type: String },
  },
  { timestamps: true },
);

const AppointmentCallSummarySchema = new Schema<AppointmentCallSummary>({
  date: { type: Date, required: true },
  doctorOrClinic: { type: String, required: true },
  location: { type: String, required: true },
  call_summary: { type: String, required: true },
});

const UserSchema = new Schema<UserDocument>(
  {
    id: { type: Number, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    document_urls: { type: [DocumentUrlSchema], default: [] },
    appointments_callsummary: { type: [AppointmentCallSummarySchema], default: [] },
  },
  { timestamps: true },
);

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

