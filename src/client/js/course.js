const locationMap = document.getElementById("location-map");
let map; // 카카오 지도
let userLatitude;
let userLongitude;
let isMapDrawn = false;
let courseData = []; // 마커를 위한 데이터 담을 공간
let markers = [];
let clickCourse = 0; // 0 : 내 자신, 나머지는 id (현재 선택한 코스)

// 클릭 시 맵 움직이는 함수
const panTo = (lat, lng) => {
  const position = new kakao.maps.LatLng(lat, lng);
  map.panTo(position);
};

const clickCourseList = async (e, courseNo) => {
  if(clickCourse !== courseNo) { // 같은 코스 메뉴를 클릭했을 때 동작하지 않게 하기위해
    const courseWrap = document.querySelectorAll(".course");
    for(let i = 0; i < courseWrap.length; i++) {
      courseWrap[i].classList.remove("on");
    }
    // 클릭한 메뉴 색칠
    e.currentTarget.classList.add("on");
  
    let courseLatitude; 
    let courseLongitude;

    if(courseNo === 0) {
      courseLatitude = userLatitude;
      courseLongitude = userLongitude;
    }else {
      const matchCourse = courseData.find(c => c.course_no === courseNo);
      courseLatitude = matchCourse.course_latitude;
      courseLongitude = matchCourse.course_longitude;
    }
    panTo(courseLatitude, courseLongitude);
    // 클릭한 지역 코스 프로그램 확인
    clickCourse = courseNo;
    // 디테일 컨테이너
    const courseProgramContainer = document.querySelector(".course-program-container");
    if(courseNo !== 0) {
      const response = await fetch(`/api/course/${courseNo}`);
      const result = await response.json();
      const data = result.data;
      console.log(data);
      courseProgramContainer.style.bottom = "0";

      // 클릭 시 내용 초기화 후 X버튼을 제외한 데이터 재랜더링을 위해 엘리먼트 삭제
      const elementsRemove = courseProgramContainer.querySelectorAll(":not(.program-close-btn)");
      elementsRemove.forEach(element => element.remove());

      // 데이터 엘리먼트 추가
      data?.map((item, index) => {
        const courseWrap = document.createElement("div");
        courseWrap.classList.add("course-wrap");
        courseProgramContainer.appendChild(courseWrap);

        const courseImageWrap = document.createElement("div");
        courseImageWrap.classList.add("course-image-wrap");
        courseWrap.appendChild(courseImageWrap);

        const courseContentWrap = document.createElement("div");
        courseContentWrap.classList.add("course-content-wrap");
        courseWrap.appendChild(courseContentWrap);
        
        // 이미지
        const images = data[0].course_img.split(", ").map(item => [item]);
        const imageIndex = index < images.length ? index : 0;
        const courseImage = document.createElement("img");
        courseImage.src = `${images[imageIndex]}.jpg`;
        courseImage.classList.add("course-image");
        courseImageWrap.appendChild(courseImage);
        // 코스명
        const courseName = document.createElement("p");
        courseName.textContent = `코스명 : ${item.course_name}`;
        courseContentWrap.appendChild(courseName);
        courseName.classList.add("course-name");
        // 코스 프로그렘 이름
        const courseProgramName = document.createElement("p");
        courseProgramName.textContent = `프로그램명 : ${item.course_program}`;
        courseContentWrap.appendChild(courseProgramName);
        courseProgramName.classList.add("course-program-name");
        // 코스 주소
        const courseAddress = document.createElement("p");
        courseAddress.textContent = `주소 : ${item.course_address}`;
        courseContentWrap.appendChild(courseAddress);
        courseAddress.classList.add("course-address")
        // 자세히보기 버튼
        const courseDetailBtn = document.createElement("button");
        courseDetailBtn.textContent = "자세히 보기";
        courseDetailBtn.classList.add("course-detail-btn");
        courseContentWrap.appendChild(courseDetailBtn);
      })
    } else {
      courseProgramContainer.style.bottom = `-100%`;
    }
    // 코스프로그램 닫기 버튼
    const programCloseBtn = document.querySelector(".program-close-btn");
    programCloseBtn.addEventListener("click", () => {
      courseProgramContainer.style.bottom = `-100%`;
    });
  }
};


// 마커를 그리는 함수
const addMarker = (position) => {
  let marker = new kakao.maps.Marker({
    position: position,
  });
  marker.setMap(map);
  markers.push(marker);
};
// 마커를 지우는 함수
const delMarker = () => {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  };
  markers = [];
};

const addCourseMarker = (course) => {
  // 방문했으면 A이미지, 안했으면 B이미지
  let markerImageUrl = "/file/map_not_done.png";
  let markerImageSize = new kakao.maps.Size(25, 35);
  if(course.user_courses_no) {
    markerImageUrl = "/file/map_complete.jpg";
    markerImageSize = new kakao.maps.Size(25, 35);
  }
  const kakaoMarkerImage = new kakao.maps.MarkerImage(markerImageUrl, markerImageSize);
  const latlng = new kakao.maps.LatLng(course.course_latitude, course.course_longitude);

  new kakao.maps.Marker({
    map: map,
    position: latlng,
    title: course.course_name,
    image: kakaoMarkerImage
  });
}

// 마커 찍기
const setCourseMarker = () => {
  const uniqueNames = {};
  const uniqueData = [];

  for (let i = 0; i < courseData.length; i++) {
    const courseName = courseData[i].course_name;
    if (!uniqueNames[courseName] && courseName !== '공통이미지') {
      uniqueNames[courseName] = true;
      uniqueData.push(courseData[i]);
    }
  }
  for (let i = 0; i < uniqueData.length; i++) {
    // console.log(uniqueData[i]);
    addCourseMarker(uniqueData[i]);
  }
};

// 지도 그리기
const drawMap = (lat, lng) => {
  // 첫번째 인자: 지도 그릴 dom(html)
  map = new kakao.maps.Map(locationMap, {
    center: new kakao.maps.LatLng(lat, lng),
    level: 13
  });
  map.setZoomable(false);
};

const configLocation = () => {
  if(navigator.geolocation) { // 위치 허용 받으면
    // navigator web api 위치정보 접근 , watchPosition : 감시
    navigator.geolocation.watchPosition((pos) => {
      // console.log(pos);
      delMarker();
      // 위치 갱신
      userLatitude = pos.coords.latitude;
      userLongitude = pos.coords.longitude;
      // 전역변수 선언 이유 > 다른 위치에 있어도 값을 받기위해
      if(!isMapDrawn) {
        // 1.지도 그리기 2.마커 그리기 3.변수값 변경
        drawMap(userLatitude, userLongitude);
        // 목적지 마커
        setCourseMarker();
        isMapDrawn = true;
      };
      addMarker(new kakao.maps.LatLng(userLatitude, userLongitude));
      // 자기자신일때만 맵이 움직이게 하기
      if(clickCourse === 0) {
        panTo(userLatitude, userLongitude);
      }
    });
  }
};

// 네비게이션 바
const makeCourseNaviHTML = (data) => {
  const courseWrap = document.getElementById("courseWrap");
  // 중복 제거
  const uniqueNames = {};
  const uniqueData = [];

  for (let i = 0; i < data.length; i++) {
    const courseName = data[i].course_name;
    if (!uniqueNames[courseName] && courseName !== '공통이미지') {
      uniqueNames[courseName] = true;
      uniqueData.push(data[i]);
    }
  }
  // console.log(uniqueData);

  let html = "";
  for (let i = 0; i < uniqueData.length; i++) {
    html += `<li class="course" onclick="clickCourseList(event, ${uniqueData[i].course_no})">`;
    if(uniqueData[i].user_courses_no) {
      html += `<div class="mark-wrap"><img src="/file/complete.svg" /></div>`;
    }
    html += `<p>${uniqueData[i].course_name}</p>`;
    html += `</li>`
  }
  html += `<li id="myPosition" class="course on" onclick="clickCourseList(event, 0)">나의 위치</li>`
  courseWrap.innerHTML = html;
}

// 코스 데이터를 불러오는 fetch 함수
const getCourseList = async () => {
  // accessToken 불러오기
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch("/api/course", {
    headers: { Authorization: `Bearer ${accessToken}`}
  });
  const result = await response.json();
  const data = result.data;
  // console.log(data);
  courseData = data;
  // 결과가 나오면 함수 실행
  makeCourseNaviHTML(data);
  configLocation();
};
getCourseList();