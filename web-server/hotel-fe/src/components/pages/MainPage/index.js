import React from 'react'
import styled from 'styled-components';

import mainImg from  "../../../img/Hotel/main-banner.jpg";

export default function index() {

  const SubBox = styled.img`
  border-radius: 10px;
  margin: 10px;
  margin-top: 0;
  width: 880px;
  height: 380px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const TitleText = styled.h1`
  line-height: 0;
  font-size: 90px;
  font-weight: bold;
  margin-left: 10px;
  margin-bottom: 50px;
`;

const MiniText = styled.p`
  font-size: 15px;
  margin-bottom: 10px;
  margin-left: 5px;
`;

  return (
    <div>
       <FlexWrapper>
            <TitleText>GAESIPAN</TitleText>
            <MiniText>
              Back-End : Shon Jeong Min <br /> Front-End : Hyun Bae Jeong
            </MiniText>
          </FlexWrapper>
        <SubBox src={mainImg} />
    </div>
  )
}
