import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../img/miniLogo-W.png";

export default function NavBar() {
  return (
    <NavBack>
      <Logo src={logo} />
      <ButtonWrapper>
        <Link to={"/SignUp"}>
          <NavButton>회원가입</NavButton>
        </Link>
        <Link to={"/SignIn"}>
          <NavButton>로그인</NavButton>
        </Link>
      </ButtonWrapper>
    </NavBack>
  );
}

const NavButton = styled.button`
  height: 25px;
  width: 60px;
  border-radius: 4px;
  border: 1px;
  background-color: #dcd7c9;
  font-size: 10px;
  font-weight: 700;
  margin: 2px;
`;

const ButtonWrapper = styled.div`
  margin-right: 3px;
`;

const NavBack = styled.div`
  background-color: #a27b5c;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  padding-left: 10px;
  padding-top: 3px;
`;
