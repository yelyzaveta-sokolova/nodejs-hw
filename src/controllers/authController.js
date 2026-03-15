import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import handlebars from "handlebars";
import path from "path";

import { User } from "../models/user.js";
import { sendEmail } from "../utils/sendMail.js";

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: "Password reset email sent successfully",
    });
  }

  const token = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const templatePath = path.resolve("src/templates/reset-password-email.html");
  const templateSource = await fs.readFile(templatePath, "utf8");

  const template = handlebars.compile(templateSource);

  const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

  const html = template({
    name: user.username,
    link: resetLink,
  });

  try {
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html,
    });
  } catch {
    throw createHttpError(
      500,
      "Failed to send the email, please try again later."
    );
  }

  res.json({
    message: "Password reset email sent successfully",
  });
};

// ⭐ ДОБАВЛЕНА ФУНКЦИЯ resetPassword
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, "Invalid or expired token");
    }

    const user = await User.findOne({
      _id: payload.sub,
      email: payload.email,
    });

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
