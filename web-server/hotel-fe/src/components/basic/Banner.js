import React from 'react'
import styled from 'styled-components'
import mainBannerImg from '../../img/Hotel/main-banner.jpg'

export default function Banner() {
  return (
    <ImageContainer>
        <MainBanner src={mainBannerImg}/>
    </ImageContainer>
  )
}

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
`;

const MainBanner = styled.img`
`;