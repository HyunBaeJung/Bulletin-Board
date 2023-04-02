import React from "react";
import styled from "styled-components";

export default function NavBar(sideColor, bgColor, setWindowHeight) {

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
    width: 90px;
    height: 25px;
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

  function transWindow(event) {
    if (event.target.id === "main-button") {
      setWindowHeight("550px");
    } else if (event.target.id === "board-button") {
      setWindowHeight("600px");
    } else if (event.target.id === "sign-up-button") {
      setWindowHeight("620px");
    } else if (event.target.id === "sign-in-button") {
      setWindowHeight("500px");
    }
  }

  return (
    <div>
      <ButtonWrapper>
        <PlainButton id="main-button" onClick={transWindow}>
          메인화면
        </PlainButton>
        <PlainButton id="board-button" onClick={transWindow}>
          게시판
        </PlainButton>
        <PlainButton id="sign-up-button" onClick={transWindow}>
          회원가입
        </PlainButton>
        <PlainButton id="sign-in-button" onClick={transWindow}>
          로그인
        </PlainButton>
      </ButtonWrapper>
    </div>
  );
}
