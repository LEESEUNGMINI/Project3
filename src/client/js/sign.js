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
  let userPhone = userPhoneInput.value;
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

  if (userPassword !== userPassword2) {
    alert("입력하신 비밀번호가 서로 일치하지 않습니다. 다시 확인해주세요.");
    return;
  }

  // '+'와 '-' 제거하고 숫자만 남김
  userPhone = userPhone.replace(/[^\d]/g, '');

  // 전화번호가 12자리 이상이면 메시지 표시
  if (userPhone.length > 11) {
    alert("전화번호를 올바르게 입력해주세요.");
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

  const data = await response.json();
  if (data.status === "success") {
    alert("회원가입 성공", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } else {
    alert("이미 존재하는 아이디입니다", "error");
  }
};

userJoinBtn.addEventListener("click", joinFetch);