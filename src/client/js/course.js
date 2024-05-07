var container = document.getElementById('map');
var options = {
  center: new kakao.maps.LatLng(33.450701, 126.570667),
  level: 3
};

var map = new kakao.maps.Map(container, options);
// 새로운 마커가 표시될 위치입니다
var newMarkerPosition = new kakao.maps.LatLng(33.460701, 126.580667);

// 새로운 마커를 생성합니다
var newMarker = new kakao.maps.Marker({
    position: newMarkerPosition
});

// 새로운 마커가 지도 위에 표시되도록 설정합니다
// 1. 사용자의 현재 위치를 가져오는 함수
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};
newMarker.setMap(map);


// 2. 현재 위치를 받아와 지도에 표시하는 함수
const showCurrentLocation = async () => {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    // 사용자의 현재 위치를 지도의 중심으로 설정
    map.setCenter(new kakao.maps.LatLng(latitude, longitude));
    // 사용자 위치에 마커 표시
    const markerPosition = new kakao.maps.LatLng(latitude, longitude);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  } catch (error) {
    console.error("Error getting current location:", error);
  }
};

// 위에서 정의한 함수를 사용하여 사용자의 현재 위치를 보여주는 코드
showCurrentLocation();

