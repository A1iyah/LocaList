import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { uuid } from "uuidv4";
import { UserModel } from "../models/userModel";
import { addUserTokens } from "../utils/auth-middleware";

const expirationTime = Number(process.env.EXPIRATION_TIME_IN_HOURS) || 1;

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const saltRounds = 10;
    const { name, username, email, password } = req.body;
    const userId = uuid();

    let image = "";
    if (req.file) {
      image = `${process.env.SELF_DOMAIN}:${process.env.PORT}/images/${req.file.filename}`;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await UserModel.create({
      userId,
      name,
      username,
      email,
      password: hashedPassword,
      image,
      playlists: [],
    });

    await user.save();
    res.status(200).send({ ok: true, user: user });
  } catch (err) {
    res.status(500).send("Register user server error" + err);
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Bad Request - missing email or password");
      return;
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      const isValidPassword = await bcrypt.compare(
        password,
        user.password as string
      );

      if (isValidPassword) {
        const payload = {
          email,
          name: user.name,
          userId: user.userId,
          username: user.username,
          image: user.image,
          iat: Math.floor(Date.now() / 1000),
        };

        const accessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: expirationTime }
        );

        const refreshToken = jwt.sign(
          payload,
          process.env.REFRESH_TOKEN_SECRET as string
        );

        addUserTokens(email, accessToken, refreshToken);

        res.json({ accessToken, refreshToken });
      } else {
        res.status(401).send("Bad email and password combination");
      }
    } else {
      res.status(401).send("Bad email and password combination");
    }
  } catch (err) {
    res.status(500).send("internal-error");
  }
};
