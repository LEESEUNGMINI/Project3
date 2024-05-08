/* 이미지 경로 확인 테스트 */
const getCourseList = async () => {
  const response = await fetch("/api/list");
  const result = await response.json();
  const data = result.data;
  console.log(data);

  const detailPageImg = document.querySelector("#detailPage_img");
  detailPageImg.innerHTML = `<img src=${data[0]}.png alt="image" />`
};
getCourseList();

