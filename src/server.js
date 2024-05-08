import "dotenv/config.js";
import express from 'express';
import { detailPage, login, mainPage, mapPage, myPage, qrPage, sign, stampPage } from './controller/webContorller.js';
import { joinUser, loginUser } from "./controller/authController.js";
import { getCourseList } from "./controller/courseController.js";


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
app.post("/api/login", loginUser);
app.get("/api/list", getCourseList) /* 이미지 경로 확인 테스트 */


// 서버에서 액세스 토큰을 검증하고 유저 정보를 반환하는 부분
app.get("/api/user", async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      // 액세스 토큰에서 유저 번호 추출
      const userId = decoded.no;
      // 유저 번호를 사용하여 데이터베이스에서 유저 정보를 조회
      const user = await User.findById(userId);
      // 클라이언트에게 유저 정보 반환
      res.json(user);
  } catch (error) {
      // 검증 실패 시 클라이언트에게 오류 응답 반환
      res.status(401).json({ message: "Invalid access token" });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});