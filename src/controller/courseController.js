import db from "../config/db.js";

/* 이미지 경로 확인 테스트 */
export const getCourseList = async (req, res) => {
  const QUERY = "SELECT course_img FROM course WHERE course_name='공통이미지'";
  const result = await db.execute(QUERY).then(result => result[0]);
  const images = result[0].course_img.split(", ").map(item => [item]);
  console.log(images);
  
  res.status(200).json({ status: "success", message: "성공", data: images });
};