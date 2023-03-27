import React from 'react'
import InputBox from './components/basic/InputBox';
import ButtonBox from './components/basic/ButtonBox';

import miniLogo from './img/miniLogo.png';
import kakaoImg from "./img/kakao.png";
import googleImg from "./img/google.png";
import naverImg from "./img/naver.png";

export default function SignIn() {
  return (
    <div className=' flex flex-col justify-center items-center h-screen'>
        <div className=' flex justify-center items-center'>
            <img className=' h-20' src={miniLogo}/>
        </div>
        
        <div className=' flex flex-col items-center mt-5'>
                <InputBox type="text" id="id" width="w-52" placeholder="Email adress"></InputBox>
                <InputBox type="password" id="password" width="w-52" placeholder="Password"></InputBox>
                <ButtonBox title="Log In" width="w-52 mt-2" bgColor="bg-green-600 border-green-600"></ButtonBox>
            <p className='mt-1 text-sm'>아이디가 없으신가요? <a className=' font-bold text-blue-700' href='ddd'>회원가입</a> </p>
        </div>
        
        <div className=' flex flex-col justify-start items-center my-2'>
            <div className=' text-sm flex h-6'>
                <div className=' mr-2 h-3 border-solid border-b w-20 border-black'/>
                <p>OR</p>
                <div className=' ml-2 h-3 border-solid border-b w-20 border-black'/>
            </div>
            <div className='flex h-8 mt-2'>
                <img className='h-8 mx-4' src={kakaoImg}/>
                <img className='h-8 mx-4' src={googleImg}/>
                <img className='h-8 mx-4' src={naverImg}/>
            </div>
        </div>
    </div>
  )
}
