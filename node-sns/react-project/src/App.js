import logo from './logo.svg';
import './App.css';

import kakaoImg from "./img/kakao.png";
import googleImg from "./img/google.png";
import naverImg from "./img/naver.png";

function App() {  
  return (
    <div className="App">
    <div className="left"></div>
    <div className="right">
    <h2><span>스터디 호텔</span> <br/> STUDY AND REST</h2>
     <div className="form">
     

      <form>
          <input type="text" placeholder="아이디"/>
          <input type="text" placeholder="비밀번호"/>
          <div className='snsLogin'>
            <img src={kakaoImg}/>
            <img src={googleImg}/>
            <img src={naverImg}/>
          </div>
          <button >회원가입</button> <button >로그인</button>
      </form>
      </div>
    </div>
    </div>
  );
}

export default App;
