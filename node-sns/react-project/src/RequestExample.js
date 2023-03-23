import React,{useEffect,useState} from "react";
import "./RequestExample.css";

import axios from 'axios';

function RequestExample() {

  async function getUser() { // async, await을 사용하는 경우
    try {
      // GET 요청은 params에 실어 보냄
      const response = await axios.get('/user', { params: { ID: 12345 }});
      console.log(response);
    } catch (e) {
      // 실패 시 처리
      console.error(e);
    }
  }
  // POST
  async function postUser() {
    try {
      console.log('start!');
      // POST 요청은 body에 실어 보냄
      await axios.post('/user', {
          firstName: 'Fred',
          lastName: 'Flintstone'
      });
      console.log('end!');
    } catch (e) {
      console.error(e);
    }
  }

  return(
/* <input> 태그의 'type' 속성을 'submit'이라고 지정해 주면,
1. 자동으로 데이터를 전송할 수 있는 버튼이 생성되고,
2. 클릭시 URL로 <form>태그 안에 입력된 값들이 'action' 속성으로 지정된 서버 페이지로 전송됩니다.
*/
    <div className="container">
        <h2>get test</h2>
        <form id="login-form2" action="/auth/login" method="get">
          <div class="input-group">
            <label for="email">이메일</label>
            <input id="email-id" type="email-tp" name="emailName" required autofocus/>
          </div>
          <div class="input-group">
            <label for="password">비밀번호</label>
            <input id="password-id" type="password-tp" name="passwordName" required/>
          </div>
          <button id="login" type="submit" class="btn">GET</button>
        </form>
        <h2>post test </h2>
        <form id="login-form1" action="/auth/login" method="post">
          <div class="input-group">
            <label for="email">이메일</label>
            <input id="email-id" type="email-tp" name="emailName" required autofocus/>
          </div>
          <div class="input-group">
            <label for="password">비밀번호</label>
            <input id="password-id" type="password-tp" name="passwordName" required/>
          </div>
          <button id="login" type="submit" class="btn">POST</button>
        </form>
        
        <div>
        <button id="axiosGet" class="btn" onClick={()=>getUser()}>axiosGet</button>
        </div>
        <div>
        <button id="axiosPost" class="btn" onClick={()=>postUser()}>axiosPost</button>
        </div>

    </div>
)}

export default RequestExample;
