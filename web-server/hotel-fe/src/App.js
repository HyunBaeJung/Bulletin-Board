import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./components/pages/MainPage";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";

import React, {useState} from "react";
import styled, { keyframes } from "styled-components";


import petal from "./img/animate/leaf.png";
import NavBar from "./components/NavBar";


function App() {

  const [windowWidth, setWindowWidth] = useState("900px");
  const [windowHeight, setWindowHeight] = useState("550px");

  const [isMain, setIsMain] = useState(true);

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


  
  /**
   
        <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />
      </Routes>
   */

  return (
    <div className="app">
        <MainFrame>
        {
          Array.from({ length: randomInt(100)+40}, () => [randomInt(100),randomInt(100)]).map((num)=>(
            createFallingImage(num[0],num[1])))
        }
        <MainBox width={windowWidth} height={windowHeight}>
          <NavBar bgColor={bgColor} sideColor={sideColor} setWindowHeight={setWindowHeight}/>
          <MainPage/>
        </MainBox>
      </MainFrame>
    </div>
  );
}

export default App;







