import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { DFlexColumn, DFlexJustifyBetween } from "../../styled/styled.flex";
import styled from "styled-components";

export default function CardInformationDashboard() {
  return (
    <Row>
      <Col xl={"4"} md={"6"} className="mb-4">
        <Card style={{ padding: "1.25rem 1.5rem 1.25rem 2.5rem", border: "none", borderRadius: "0.625rem" }}>
          <DFlexJustifyBetween>
            <DFlexColumn style={{ gap: "0" }}>
              <TitleSpan>Total Menus</TitleSpan>
              <TitleAngka>3,248</TitleAngka>
            </DFlexColumn>
            <img src="/images/icons/book-square.svg" alt="" />
          </DFlexJustifyBetween>
        </Card>
      </Col>
      <Col xl={"4"} md={"6"} className="mb-4">
        <Card style={{ padding: "1.25rem 1.5rem 1.25rem 2.5rem", border: "none", borderRadius: "0.625rem" }}>
          <DFlexJustifyBetween>
            <DFlexColumn style={{ gap: "0" }}>
              <TitleSpan>Total Transaksi</TitleSpan>
              <TitleAngka>3,248</TitleAngka>
            </DFlexColumn>
            <img src="/images/icons/coin.svg" alt="" />
          </DFlexJustifyBetween>
        </Card>
      </Col>
      <Col xl={"4"} md={"6"} className="mb-4">
        <Card style={{ padding: "1.25rem 1.5rem 1.25rem 2.5rem", border: "none", borderRadius: "0.625rem" }}>
          <DFlexJustifyBetween>
            <DFlexColumn style={{ gap: "0" }}>
              <TitleSpan>Total Revenue</TitleSpan>
              <TitleAngka>3,248</TitleAngka>
            </DFlexColumn>
            <img src="/images/icons/cards.svg" alt="" />
          </DFlexJustifyBetween>
        </Card>
      </Col>
    </Row>
  );
}

const TitleSpan = styled.span`
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const TitleAngka = styled.h2`
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 0;
`;
