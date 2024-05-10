export function getToken(code,state) {
  //apikey 초기화
  let restApiKey = "";
  //returnUrl 초기화
  let returnUrl = "";
  //loginUrl 초기화
  let loginUrl = "";
  //client키 초기화
  let client_secret = "";
  //공통 callbackurl
  const callbackUrl = process.env.REDIRECT_URL;
  //소셜로그인이 카카오라면
  if(state == 'kakao'){
    //kakao apikey 입력
    restApiKey = process.env.KAKAO_API;
    //token 받는 url
    loginUrl = "https://kauth.kakao.com/oauth";

  } else if(state == 'naver'){
    //naver apikey 입력
    restApiKey = process.env.NAVER_API;
    client_secret = process.env.NAVER_CLIENT_SECRET;
    loginUrl = "https://nid.naver.com/oauth2.0";
  } else{
    //google
    restApiKey = process.env.GOOGLE_API;
    client_secret = process.env.GOOGLE_CLIENT_SECRET;
    loginUrl = "https://oauth2.googleapis.com";
  }
  returnUrl = `loginUrl/token?grant_type=authorization_code&client_id=${restApiKey}&redirect_uri=${callbackUrl}&code=${code}${client_secret != '' ? "&client_secret=".client_secret : ''}`

  // try {
  // //php에서 제공하는 데이터 전송툴(CURL)
  // // curl 초기화
  // ch = curl_init();

  // //전송할 데이터 객체화
  // body_data = array(
  //   "code"=>this->code,
  //   "client_id" => restApiKey,
  //   "client_secret" =>client_secret,
  //   "redirect_uri"=>callbackUrl,
  //   "grant_type" =>"authorization_code"
  // );
  // body = json_encode(body_data);



  // //url 지정
  // curl_setopt(ch,CURLOPT_URL,returnUrl);
  // //post로 전송
  // curl_setopt(ch,CURLOPT_POST,true); 
  // // 전송할 body값 입력
  // curl_setopt(ch, CURLOPT_POSTFIELDS, body);
  // //문자열로 변환
  // curl_setopt(ch,CURLOPT_RETURNTRANSFER,1);

  // //curl 실행
  // response = curl_exec(ch);
  // // CommonMethod::alert(response);
  // //응답받은 json 디코딩
  // data = json_decode(response,true);

  // //tokenModel 인스턴스 생성
  // tokenModel = new TokenModel(data);
  // this->tokenModel = tokenModel;
      
  //   }catch(Exception e){
  //       echo e->getMessage();
  //   }
  
}