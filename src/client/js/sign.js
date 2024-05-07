const userIdInput = document.getElementById('userId');
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('email');
const userPhoneInput = document.getElementById('phone');
const userPasswordInput = document.getElementById('userPassword');
const userConfirmPasswordInput = document.getElementById('confirm-password');
const userJoinBtn = document.getElementById("joinBtn");

const joinFetch = async () => {
  const userId = userIdInput.value;
  const userName = userNameInput.value;
  const userEmail = userEmailInput.value;
  const userPhone = userPhoneInput.value;
  const userPassword = userPasswordInput.value;
  const userPassword2 = userConfirmPasswordInput.value;

  if (!userId || !userName || !userEmail || !userPhone || !userPassword || !userPassword2) {
    alert("모든 필드를 입력해주세요");
    return;
  }

  // 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    alert("올바른 이메일 주소를 입력해주세요");
    return;
  }

  const response = await fetch("/api/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      userId,
      userPassword,
      userName,
      userPhone,
      userEmail,
    }),
  });
 console.log(response,"zs")
  const data = await response.json();
  if (data.status === "success") {
    alert("회원가입 성공", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } else {
    alert("회원가입에 실패하셨습니다.", "error");
  }
  console.log(response,"z")
};

userJoinBtn.addEventListener("click", joinFetch);