import React from "react";
import CommonInput from "./components/CommonInput";
import ImgInput from "./components/ImgInput";
import BirthYearInput from "./components/BirthYearInput";
import ComboBox from "./components/basic/ComboBox";

import logo from "./img/logo.png"
import pwImg from "./img/SignUp/pencil.png";
import pwCheckImg from "./img/SignUp/check.png";
import InputButtonCombo from "./components/combination/InputButtonCombo";
import InputBox from "./components/basic/InputBox";
import Button from "./components/basic/ButtonBox";
import ButtonBox from "./components/basic/ButtonBox";


export default function SignUp() {
  //css 선언부

  return (
    <div className="h-screen bg-neutral-100/60 font-naver">
      <div className="flex justify-center items-center h-36">
        <img style={ {width:"230px"}} alt="" src={logo}/>
      </div>
      <form className="flex flex-col items-center">
        <CommonInput
          title="아이디"
          type="text"
          id="id"
          backPH="@study-hotel.com"
        />
        <ImgInput title="비밀번호" type="password" id="password" src={pwImg} />
        <ImgInput
          title="비밀번호 재확인"
          type="password"
          id="passwordCheck"
          src={pwCheckImg}
        />
        <div className="h-3"></div>
        <CommonInput title="이름" type="text" id="name" />
        <BirthYearInput />
        <ComboBox
          title="성별"
          contents={[
            { face: "남자", value: "M" },
            { face: "여자", value: "F" },
            { face: "선택안함", value: "N" },
          ]}
          width="w-52"
        />
         <InputButtonCombo title="휴대전화" 
         inputBox={ <InputBox type="number" id="phoneNumber" width="w-18" /> } 
         buttonBox={<ButtonBox/>} />

        <div>주소</div>
        <div>휴대전화</div>
        <div>가입하기</div>
        <div>가입하기</div>
        <div>가입하기</div>
      </form>
    </div>
  );
}
