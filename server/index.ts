// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { USERS_TOKENS, removeUserTokens } from "./utils/auth-middleware";
// // import { rateLimitMiddleware } from "./utils/rate-limit";
// import authMiddleware from "./utils/auth-middleware";
// import * as dotenv from "dotenv";
// import router from "./routes";

// dotenv.config();

// const uri = process.env.MONGOOSE;
// const PORT = process.env.PORT;
// const expirationTime = `${
//   Number(process.env.EXPIRATION_TIME_IN_MS) || 30000
// }ms`;

// if (uri) {
//   mongoose
//     .connect(uri)
//     .then(() => console.log("DB connected"))
//     .catch((err) => console.log("DB error :", err));
// } else {
//   console.log("No URI");
// }

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.use(express.static("./client"));
// app.use("/images", express.static("./Images"));
// app.get("/favicon.ico", (req, res) => res.status(204));

// // app.use(rateLimitMiddleware, router);

// app.post("/logout", authMiddleware, async (req, res) => {
//   try {
//     const userPayload = req.user;
//     const { refreshToken } = req.body;
//     const authorizationHeader = req.headers.authorization;
//     const accessToken: any = authorizationHeader?.split(" ")[1];

//     removeUserTokens(userPayload.email, accessToken, refreshToken);
//     res.send("OK");
//   } catch (err) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/token", async (req, res) => {
//   try {
//     const { oldAccessToken } = req.body;
//     const authorizationHeader = req.headers.authorization;
//     const refreshToken = authorizationHeader?.split(" ")[1];

//     if (!refreshToken) {
//       res.status(400).send("Bad Request - missing refresh token");
//       return;
//     }

//     try {
//       let userPayload = jwt.verify(
//         refreshToken || "",
//         process.env.REFRESH_TOKEN_SECRET || ""
//       );

//       if (
//         userPayload &&
//         USERS_TOKENS[
//           (userPayload as JwtPayload).email
//         ]?.refreshTokens?.includes(refreshToken)
//       ) {
//         (userPayload as JwtPayload).iat = Math.floor(Date.now() / 1000);
//         const accessToken = jwt.sign(
//           userPayload,
//           process.env.ACCESS_TOKEN_SECRET || "",
//           { expiresIn: expirationTime }
//         );

//         removeUserTokens((userPayload as JwtPayload).email, oldAccessToken);

//         res.json({ accessToken });
//         return;
//       }

//       res.status(410).send("gone refresh token");
//       return;
//     } catch (err) {
//       res.status(401).send("unauthorized refresh token");
//       return;
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(PORT, function () {
//   console.log(`App listening on port ${PORT}!`);
// });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { USERS_TOKENS, removeUserTokens } from "./utils/auth-middleware";
import authMiddleware from "./utils/auth-middleware";
import router from "./routes";
import * as dotenv from "dotenv";

dotenv.config();

const uri: string | undefined = process.env.MONGOOSE;
const PORT = process.env.PORT;
const expirationTime = `${
  Number(process.env.EXPIRATION_TIME_IN_MS) || 30000
}ms`;

if (uri) {
  mongoose
    .connect(uri)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB error :", err));
} else {
  console.log("No URI");
}

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static("./client"));
app.use("/images", express.static("./Images"));
app.get("/favicon.ico", (req, res) => res.status(204));

app.post("/", router);
app.post("/signup", router);
app.post("/login", router);

app.get("/get-songs", router);
app.get("/discover", router);
app.get("/genre-code", router);
app.get("/around-you", router);
app.get("/artist-details", router);
app.get("/search", router);
app.get("/country", router);

app.get("/getPlaylists", router);
app.get("/playlist/:playlistId", router);
app.post("/newPlaylist", router);
app.post("/addSongToPlaylist", router);
app.delete("/deletePlaylist/:playlistId", router);
app.delete("/playlist/:playlistId/song/:songId", router);

app.post("/logout", authMiddleware, async (req, res) => {
  try {
    const userPayload = req.user;
    const { refreshToken } = req.body;
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader?.split(" ")[1] as string;

    removeUserTokens(userPayload.email, accessToken, refreshToken);
    res.send("OK");
  } catch (err) {
    res.status(500).render("internal-error");
  }
});

app.post("/token", async (req, res) => {
  try {
    const { oldAccessToken } = req.body;
    const authorizationHeader = req.headers.authorization;
    const refreshToken = authorizationHeader?.split(" ")[1];

    if (!refreshToken) {
      res.status(400).send("Bad Request - missing refresh token");
      return;
    }

    try {
      let userPayload = jwt.verify(
        refreshToken || "",
        process.env.REFRESH_TOKEN_SECRET || ""
      );

      if (
        userPayload &&
        USERS_TOKENS[
          (userPayload as JwtPayload).email
        ]?.refreshTokens?.includes(refreshToken)
      ) {
        (userPayload as JwtPayload).iat = Math.floor(Date.now() / 1000);
        const accessToken = jwt.sign(
          userPayload,
          process.env.ACCESS_TOKEN_SECRET || "",
          { expiresIn: expirationTime }
        );

        removeUserTokens((userPayload as JwtPayload).email, oldAccessToken);

        res.json({ accessToken });
        return;
      }

      res.status(410).send("gone refresh token");
      return;
    } catch (err) {
      res.status(401).send("unauthorized refresh token");
      return;
    }
  } catch (err) {
    res.status(500).render("internal-error");
  }
});

app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}!`);
});
