import bcrypt from "bcrypt";
import db from "../config/db.js";

export const joinUser = async (req, res) => {
  const { userId, userPassword, userName,userPhone,userEmail } = req.body;
  console.log(req.body)
  // 1. userId가 중복인지 확인한다. (데이터베이스 찾아서) // CRUD R
  const QUERY1 = `SELECT user_no FROM users WHERE user_id = ?`;
  const existUser = await db
    .execute(QUERY1, [userId])
    .then((result) => result[0][0]);

  if (existUser) {
    return res
      .status(400)
      .json({ status: "fail", message: "중복된 아이디 입니다." });
  }
  const encryptPassword = await bcrypt.hash(userPassword, 8);

  // db에 데이터를 넣는다 users테이블에 (CRUD) CREATE
  // 저장
  const QUERY2 = `INSERT INTO users (user_id, user_password, user_name, user_email, user_tel) VALUES (?, ?, ?, ?, ?)`;
  await db.execute(QUERY2, [userId, encryptPassword, userName, userEmail, userPhone]);

  res.status(201).json({ status: "success", message: "회원가입 완료" });
};