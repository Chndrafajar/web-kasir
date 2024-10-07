import React, { useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import styled from "styled-components";
import { DFlex, DFlexColumn, DFlexJustifyBetween } from "../../../styled/styled.flex";
import { CDN_LINK } from "../../../config/cdn/urlImage";
import formatRupiah from "../../../config/formatRupiah";
import { toast } from "react-toastify";
import ButtonV1 from "../../../components/Button/ButtonV1";

export default function CardMenu({ index, title, price, desc, image, addToCart }) {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => count > 0 && setCount(count - 1);
  const handleAddToCart = () => {
    if (count > 0) {
      addToCart(count);
      toast.success("Success add to cart");
      setCount(0); // Reset counter setelah menambahkan ke keranjang
    }
  };

  const handleCountChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setCount(Math.min(value, 100));
    }
  };

  return (
    <Col md={"6"} xl={"6"} className="mb-4">
      <Card style={{ border: "none", padding: "1.25rem" }}>
        <DFlex style={{ alignItems: "start" }}>
          <img src={`${CDN_LINK.imageUrl}${image}`} style={{ width: "6.375rem" }} />
          <DFlexColumn style={{ gap: "0px" }}>
            <TextStyle style={{ marginBottom: "0.313rem" }}>{title}</TextStyle>
            <span style={{ color: "#A3A3A3", fontWeight: "300" }}>{desc}</span>
          </DFlexColumn>
        </DFlex>
        <DFlexJustifyBetween style={{ marginTop: "1.25rem" }}>
          <TextStyle style={{ marginBottom: "0" }}> {formatRupiah(price)}</TextStyle>
          <CounterContainer>
            <StyledButton onClick={handleDecrement}>-</StyledButton>
            <CountItems type="text" value={count} onChange={handleCountChange} />
            <StyledButton onClick={handleIncrement}>+</StyledButton>
          </CounterContainer>
        </DFlexJustifyBetween>
        <ButtonV1 handleClick={handleAddToCart} style={{ marginTop: "1.5rem" }}>
          Add to Cart
        </ButtonV1>
      </Card>
    </Col>
  );
}

const TextStyle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 1.25rem;
  height: 2.25rem;
  width: 6.25rem;
`;

// Styled component for the button
const StyledButton = styled(Button)`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  color: black;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.188rem;
  width: 2.188rem;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:hover {
    background-color: #3772f0;
  }
`;

const CountItems = styled.input`
  background-color: inherit;
  border: none;
  outline: none;
  width: 35px;
  text-align: center;
`;
