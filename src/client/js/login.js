const userIdInput = document.getElementById("userId");

const userPasswordInput = document.getElementById("userPassword");
const joinBtn = document.querySelector(".join");
const loginBtn = document.getElementById("login")



const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const loginFetch = async () => {
  const userId = userIdInput.value;
  const userPassword = userPasswordInput.value;

  console.log(userId)

  if (!userId || !userPassword) {
    alert("모든 필드를 입력해주세요", "error");
    return;
  }

  // 서버로 보내는 요청
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      userId,
      userPassword,
    }),
  });

  const result = await response.json();
  console.log(result)
  if (result.status === "success") {
    localStorage.setItem("accessToken", result.data.accessToken);
    alert("로그인 성공", "success");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  } else {
    alert("로그인에 실패하셨습니다.", "error");
  }
};

loginBtn.addEventListener("click", loginFetch);
joinBtn.addEventListener("click", () => (window.location.href = "/sign"));

const checkError = () => {
  const notFoundAccessTokenError = getParameterByName("error");
  if (notFoundAccessTokenError == "not_found_access_token") {
    alert("인증에 실패하였습니다.", "error");
  } else if (notFoundAccessTokenError == "need_login") {
    alert("로그인이 필요합니다.", "error");
  }
  const cleanUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
};
checkError();
