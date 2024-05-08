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


// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});