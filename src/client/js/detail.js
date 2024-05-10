/* 이미지 경로 확인 테스트 */
const getCourseList = async () => {
  const response = await fetch("/api/list");
  const result = await response.json();
  const data = result.data;
  console.log(data,"이건가??")
  const detailPageImg = document.querySelector("#detailPage_img");
  const detailPageInfo = document.querySelector(".detailPage_info");
  const detailName = document.getElementById("Yaungjojang_name")

  // URL에서 course 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('course').replaceAll(`"`, "");

  // 데이터에서 해당 courseParam과 일치하는 데이터 추출
  const matchingData = data.filter(item => item.course_name == courseParam);
  detailName.innerHTML = matchingData[0].course_name + `<b id="Yaungjojang_joso">(${matchingData[0].course_address})

  </b>`
  // <span id="detail_span">♥<span> 찜 하트
  if (matchingData.length > 0) {
    // 첫 번째 이미지 경로 추출
    const firstImg = matchingData[0].course_img.substring(0, matchingData[0].course_img.indexOf(','));
    console.log(matchingData)
    // 이미지 표시
    detailPageImg.innerHTML = `<img id="detail_img" src='${firstImg}.jpg' alt="image" style="width:100%" />`;

    // 정보 표시
    const detailInfoLeft = `
      <div> 
      <p><span class="detail_soja">전화번호:</span> <b id="Yaungjojang_phone">${matchingData[0].course_tel}</b></p>
      <p><span class="detail_soja">예약/상시방문:</span> <b id="Yaungjojang_check">${matchingData[0].course_a_visit}/<b id="Yaungjojang_go">${matchingData[0].course_r_visit}</b></b></p>
      </div>
    `;

    const detailInfoRight = `
      <div>
      <p><span class="detail_soja">주종:</span> <b id="Yaungjojang_jojong">${matchingData[0].course_alcohol}</b></p>
        <p><span class="detail_soja">홈페이지:</span> <b id="Yaungjojang_home"><a href="${matchingData[0].course_homepage}" target="_blank">바로가기</a></b></p>
      </div>
    `;

    // 왼쪽 정보와 오른쪽 정보를 HTML에 삽입
    detailPageInfo.innerHTML = detailInfoLeft + detailInfoRight;
// 캐러셀
const swiperContainer = document.querySelector('.mySwiperz');
for (let i = 0; i < matchingData.length; i++) {
  const course = matchingData[i];
  const imageUrl = course.course_img.split(',')[i]; // 첫 번째 이미지만 사용

  const swiperSlideHTML = `
    <div id="chehum_div">
      <img src="${imageUrl}.jpg" alt="course image">
      <div class="program-info">
        <h3>${course.course_program}</h3>
        <p>소요시간: ${course.course_time}</p>
        <p>가격: ${course.course_cost ? course.course_cost + '원' : '정보 없음'}</p>
        <p>내용: ${course.course_content}</p>
      </div>
    </div>
  `;

  swiperContainer.innerHTML += swiperSlideHTML;
 
}
  } else {
    console.error('Matching data not found.');
  }
};

getCourseList();

