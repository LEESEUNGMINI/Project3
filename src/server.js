import "dotenv/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./config/db.js";
import express from 'express';
import { detailPage, guide, login, mainPage, mapPage, myPage, qrPage, sign, stampPage, socialLogin } from './controller/webContorller.js';
import { joinUser, loginUser } from "./controller/authController.js";
import { getCourseDetails, getCourseList, qrCheck } from "./controller/courseController.js";
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

app.get('/guide',guide)
// 소셜로그인
app.get("/socialLogin", socialLogin);
// api
app.post("/api/join", joinUser);
app.post("/api/course", neededAuth, qrCheck);
app.get("/api/course", notNeededAuth, getCourseList);
app.get("/api/course/:course_no", getCourseDetails);
app.post("/api/login", loginUser);
app.get("/api/list", getCourseList) /* 이미지 경로 확인 테스트 */

app.get("/api/social/:location", (req, res) => {
  // console.log(req);
  const location = req.params.location;
  switch(location){
    case "kakao":
        res.send({ data: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_API}&redirect_uri=${REDIRECT_URL}&response_type=code&state=kakao&prompt=login` });
    default:
        return "";
  }
});

// app.get("/api/social/success", (req, res) => {
//   const code = req.query.code;
//   console.log(code);
// })

// 비밀번호 및 사용자 정보 업데이트 엔드포인트
app.post("/api/change-user-info", async (req, res) => {
  try {
    // 현재 사용자의 액세스 토큰 가져오기
    const accessToken = req.headers.authorization.split(" ")[1];

    // 액세스 토큰을 해독하여 사용자 식별자 가져오기
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.no;

    // 새로운 비밀번호, 이메일, 전화번호 받기
    const { newPassword, email, phone } = req.body;

    // 새로운 비밀번호를 해싱
    const encryptedPassword = await bcrypt.hash(newPassword, 8);

    // 사용자 정보를 DB에 업데이트
    const UPDATE_QUERY = "UPDATE users SET user_password = ?, user_email = ?, user_tel = ? WHERE user_no = ?";
    await db.execute(UPDATE_QUERY, [encryptedPassword, email, phone, userId]);

    // 성공 응답 전송
    res.status(200).json({ success: true, message: "비밀번호 및 사용자 정보가 성공적으로 변경되었습니다." });
  } catch (error) {
    // 오류가 발생한 경우 클라이언트로 오류 응답 전송
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to change password and user info" });
  }
});


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