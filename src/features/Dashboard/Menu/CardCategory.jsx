import React from "react";
import { Card, Col } from "react-bootstrap";
import styled from "styled-components";
import { DFlex, DFlexColumn } from "../../../styled/styled.flex";
import { CDN_LINK } from "../../../config/cdn/urlImage";

export default function CardCategory({ categories, handleCategoryClick, selectedCategory, menuCounts }) {
  return (
    <>
      {categories?.category?.map((c, index) => (
        <Col xl={"6"} md={"6"} className="mb-4" key={c?._id}>
          <CardWrapper
            style={{ padding: "1.25rem", borderRadius: "0.625rem", border: "none" }}
            onClick={() => handleCategoryClick(c?._id)}
            className={selectedCategory === c?._id ? "active" : ""}
          >
            <DFlex>
              <CardImage>
                <img src={`${CDN_LINK.imageUrl}${c?.imgUrl}`} alt="" width="100%" />
              </CardImage>
              <DFlexColumn style={{ gap: "0" }}>
                <TitleText>{c?.name}</TitleText>
                <TitleDesc>{menuCounts?.[index] || 0} Menu in Stock</TitleDesc>
              </DFlexColumn>
            </DFlex>
          </CardWrapper>
        </Col>
      ))}
    </>
  );
}

const CardWrapper = styled(Card)`
  padding: 1.25rem;
  border-radius: 0.625rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #3772f0;
    transition: all 0.2s ease;

    h3 {
      color: #fff;
    }
    span {
      color: #fff;
    }
  }
  &.active {
    background-color: #3772f0;
    transition: all 0.2s ease;

    h3 {
      color: #fff;
    }
    span {
      color: #fff;
    }
  }
`;

const CardImage = styled(Card)`
  width: 3.687rem;
  height: 3.687rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  background-color: #fafafa;
  border: none;
`;

const TitleText = styled.h3`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 3px;
`;

const TitleDesc = styled.span`
  color: #a3a3a3;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;
