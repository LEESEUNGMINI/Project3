import "dotenv/config.js";
import jwt from "jsonwebtoken";
import db from "./config/db.js";
import express from 'express';
import { detailPage, login, mainPage, mapPage, myPage, qrPage, sign, stampPage } from './controller/webContorller.js';
import { joinUser, loginUser } from "./controller/authController.js";
import { getCourseList, qrCheck } from "./controller/courseController.js";
import { neededAuth, notNeededAuth } from "./middleware/auth.js";


const app = express();
// JSON 형식 변환 미들웨어


// EJS 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/client/html");

app.use("/css", express.static("src/client/css"));
app.use("/js", express.static("src/client/js"));
app.use("/file", express.static("src/client/file"));

app.use(express.json());

// 라우트 설정
app.get('/', mainPage);
app.get('/detail', detailPage);
app.get('/map', mapPage);
app.get('/myPage', myPage);
app.get('/qrPage', qrPage);
app.get('/stampPage', stampPage);
app.get('/login', login);
app.get('/sign', sign);
// api
app.post("/api/join", joinUser);
app.post("/api/course", neededAuth, qrCheck);
app.get("/api/course", notNeededAuth, getCourseList);
app.post("/api/login", loginUser);
app.get("/api/list", getCourseList) /* 이미지 경로 확인 테스트 */
// 서버에서 해당 사용자 정보를 가져와 클라이언트로 전송하는 라우트 추가
app.get("/api/userinfo", async (req, res) => {
  try {
    // 현재 사용자의 액세스 토큰 가져오기
    const accessToken = req.headers.authorization.split(" ")[1];

    // 액세스 토큰을 해독하여 사용자 식별자 가져오기
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.no;

    // 사용자 식별자를 사용하여 데이터베이스에서 해당 사용자 정보 가져오기
    const QUERY = "SELECT * FROM users WHERE user_no = ?";
    const user = await db
      .execute(QUERY, [decoded.no])
      .then((result) => result[0][0]);
    // 사용자 정보를 클라이언트로 전송
    res.json(user);
  } catch (error) {
    // 오류가 발생한 경우 클라이언트로 오류 응답 전송
    res.status(500).json({ message: "Failed to fetch user information" });
  }
});



// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});