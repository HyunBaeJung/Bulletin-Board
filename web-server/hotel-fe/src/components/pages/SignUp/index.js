import {React,useState} from "react";
import CommonInput from "../../basic/CommonInput";
import ImgInput from "../../basic/ImgInput";
import BirthYearInput from "../../basic/BirthYearInput";
import ComboBox from "../../basic/ComboBox";

import logo from "../../../img/logo.png"
import pwImg from "../../../img/SignUp/pencil.png";
import pwCheckImg from "../../../img/SignUp/check.png";
import InputButtonCombo from "../../combination/InputButtonCombo";
import InputBox from "../../basic/InputBox";
import ButtonBox from "../../basic/ButtonBox";
import Footer from "../../Footer";


export default function SignUp() {

  const [id, setid] = useState("");
  

  return (
    <div className="h-screen bg-T1-beige font-naver">
      <div className="flex justify-center items-center h-36">
        <img style={ {width:"230px"}} alt="" src={logo}/>
      </div>
      <form className="flex flex-col items-center">
        <CommonInput
          title="아이디"
          type="text"
          id="id"
          backPH="@studyH.com"
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
         inputBox={ <InputBox type="number" id="phoneNumber" /> } 
         buttonBox={<ButtonBox title="인증번호" width="w-16" bgColor="bg-T1-Brown"/>} />
        <InputBox type="number" id="phoneNumber" width="w-52" readOnly={true} />
        <ButtonBox width="w-52 mt-4" title="가입하기" bgColor="bg-T1-dark-green" />
      </form>
      
      <Footer/>
    </div>
  );
}
