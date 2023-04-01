import React from "react";
import InputBox from "../../basic/InputBox";
import ButtonBox from "../../basic/ButtonBox";
import './index.css'

import axios from "../../../api/axios";
import requests from "../../../api/requests";

import miniLogo from "../../../img/miniLogo-BR.png";
import kakaoImg from "../../../img/kakao.png";
import googleImg from "../../../img/google.png";
import naverImg from "../../../img/naver.png";

export default function SignIn() {

  
  const fetchData = async () => {
    const request = await axios.get("http://localhost:8000/set-cookie");
    console.log(request);
  };
  fetchData();
  function vibrateCheck(checkElement,vibrateElement){
    if(checkElement.value===""){
        vibrateElement.classList.add("vibrate");
        setTimeout(()=>{vibrateElement.classList.remove("vibrate");},500);
    }
  }

  async function loginReqest() {

    const idElement =document.getElementById("id");
    const passWordElement =document.getElementById("password");

    vibrateCheck(idElement,document.getElementById("id-box"));
    vibrateCheck(passWordElement,document.getElementById("password-box"));

    try {
      // POST 요청은 body에 실어 보냄
      const res = await axios.post(requests.postLogin, {
        id      : idElement.value,
        password: passWordElement.value,
      });
      console.log("---------------------");
      console.log(res);
      console.log("---------------------");
      idElement.value="";
      passWordElement.value="";

    } catch (e) {
      console.error(e);
    }
  }

  console.dir(document.getElementById("id"));

  return (
    <div className=" flex flex-col justify-center items-center h-screen bg-T1-beige">
      <div className=" flex justify-center items-center">
        <img alt="logo" className=" h-20" src={miniLogo} />
      </div>

      <div className=" flex flex-col items-center mt-5">
        <InputBox
          type="text"
          id="id"
          width="w-52"
          placeholder="Email adress"
        ></InputBox>
        <InputBox
          type="password"
          id="password"
          width="w-52"
          placeholder="Password"
        ></InputBox>
        <ButtonBox
          onClickEvent = {loginReqest}
          title="Log In"
          width="w-52 mt-2"
          bgColor="bg-T1-brown border-T1-brown "
        ></ButtonBox>
        <p className="mt-1 text-xs ">
          아이디가 없으신가요?{" "}
          <a className=" font-bold text-xs " href="ddd">
            회원가입
          </a>
        </p>
      </div>

      <div className=" flex flex-col justify-start items-center my-2">
        <div className=" text-xs flex h-6">
          <div className=" mr-2 h-3 border-solid border-b w-20 border-black" />
          <p>OR</p>
          <div className=" ml-2 h-3 border-solid border-b w-20 border-black" />
        </div>
        <div className="flex h-8 mt-2">
          <img alt="kakaoImg" className="h-6 mx-4" src={kakaoImg} />
          <img alt="googleImg" className="h-6 mx-4" src={googleImg} />
          <img alt="naverImg" className="h-6 mx-4" src={naverImg} />
        </div>
      </div>
    </div>
  );
}
