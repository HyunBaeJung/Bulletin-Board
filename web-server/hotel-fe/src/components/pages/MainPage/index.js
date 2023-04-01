import React, {useState} from "react";
import styled, { keyframes } from "styled-components";

import mainImg from "../../../img/Hotel/main-banner.jpg";
import petal from "../../../img/animate/leaf.png";


export default function MainPage() {

  const [windowWidth, setWindowWidth] = useState("1200px");
  const [windowHeight, setWindowHeight] = useState("720px");

  function transWindow (event) {
    if(event.target.id=="main-button"){
      setWindowHeight("720px");
    }else if(event.target.id=="board-button"){
      setWindowHeight("800px");
    }else if(event.target.id=="sign-up-button"){
      setWindowHeight("850px");
    }else if(event.target.id=="sign-in-button"){
      setWindowHeight("900px");
    }
    console.log(event);
    
  };

  return (

    <div>
      <MainFrame>
        {
          Array.from({ length: randomInt(100)+40}, () => [randomInt(100),randomInt(100)]).map((num)=>(
            createFallingImage(num[0],num[1])
          ))
        }
        <MainBox width={windowWidth} height={windowHeight}>
          <ButtonWrapper>
            <PlainButton id="main-button" onClick={transWindow}>메인화면</PlainButton>
            <PlainButton id="board-button" onClick={transWindow}>게시판</PlainButton>
            <PlainButton id="sign-up-button" onClick={transWindow}>회원가입</PlainButton>
            <PlainButton id="sign-in-button" onClick={transWindow}>로그인</PlainButton>
          </ButtonWrapper>
          <FlexWrapper>
            <TitleText>GAESIPAN</TitleText>
            <MiniText>
              Back-End : Shon Jeong Min <br /> Front-End : Hyun Bae Jeong
            </MiniText>
          </FlexWrapper>

          <SubBox src={mainImg} />
        </MainBox>
      </MainFrame>
    </div>
  );
}

const bgColor = "#dbdde9";
const sideColor = "#adacad";



/*
animation
*/
const randomInt = (num) => Math.random() * num;

function createFallingImage(xCoord,yCoord){
  
  const falling = keyframes`
    0% {
      opacity: 1;
      transform: translate(0, 0);
      animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    }
    50% {
      opacity: 0.8;
      transform: translate(${randomInt(100)}vh, 50vh) rotate(${randomInt(140)+40}deg);
      animation-timing-function: ease-in;
    }
    100% {
      opacity: 0;
      transform: translate(0, 100vh);
      animation-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
    }
  `;

  return <FallingImage duration={randomInt(5)+6} delay={randomInt(10)} animate={falling} xCoord={xCoord} yCoord={yCoord} src={petal} />
}

const FallingImage = styled.img`
  opacity: 0;
  position: absolute;
  z-index: 1;
  height: 20px;
  left: ${props => props.xCoord }%;
  top: ${props => props.yCoord }%;
  animation: ${props => props.animate} ${props => props.duration+"s"} linear infinite;
  animation-delay: ${props => props.delay+"s"};
`;





/*
Frame Part
*/
const MainFrame = styled.div`
  position: relative;
  overflow: hidden;
  background-color: ${bgColor};
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/*
Box Part
 */
const MainBox = styled.div`
  position: relative;
  z-index: 2;
  background-color: white;
  height: ${props=>props.height};
  width: ${props=>props.width};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex-shrink: 0;
  transition: width 0.5s ease, height 0.5s ease;
`;

const SubBox = styled.img`
  border-radius: 10px;
  margin: 10px;
  margin-top: 0;
  width: 1180px;
  height: 500px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const TitleText = styled.h1`
  line-height: 0;
  font-size: 130px;
  font-weight: bold;
  margin-left: 10px;
  margin-bottom: 70px;
`;

const MiniText = styled.p`
  font-size: 20px;
  margin-bottom: 10px;
  margin-left: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 100%;
  margin: 10px;
  border-bottom: 1px;
  border-color: black;
`;

const PlainButton = styled.button`
  text-align: center;
  border: 1px solid;
  border-color: black;
  width: 120px;
  height: 30px;
  font-size: 15px;
  font-weight: 500;
  color: ${sideColor};
  border-radius: 10px;
  border-color: ${sideColor};
  margin-left: 8px;

  &:hover {
    background-color: ${bgColor};
    color: #ffffff;
  }
`;
