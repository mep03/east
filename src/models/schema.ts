import mongoose, { Schema, Document } from "mongoose";

/**
 * @info Represents a URL document stored in the database.
 * @desc This interface defines the structure of a URL document, including its original URL,
 *       short URL, click count, and associated user.
 */
export interface UrlDocument extends Document {
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  user: mongoose.Types.ObjectId;
}

/**
 * @desc Defines the schema for storing URL documents in the database.
 */
const urlSchema = new Schema<UrlDocument>({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  clickCount: { type: Number, default: 0 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

/**
 * @info Represents a user document stored in the database.
 * @desc This interface defines the structure of a user document, including their email,
 *       password, session token, email verified and verification token.
 */
export interface UserDocument extends Document {
  email: string;
  password: string;
  sessionToken: string;
  emailVerified: boolean;
  verificationToken: string;
}

/**
 * @desc Defines the schema for storing user documents in the database.
 */
const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessionToken: { type: String, unique: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, unique: true },
});

/**
 * @desc Represents the Mongoose model for URL documents.
 */
const UrlModel = mongoose.model<UrlDocument>("Url", urlSchema);

/**
 * @desc Represents the Mongoose model for user documents.
 */
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export { UrlModel, UserModel };
