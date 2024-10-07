import React, { useEffect, useState } from "react";
import { Button, Card, Row } from "react-bootstrap";
import styled from "styled-components";
import { DFlex, DFlexJustifyBetween, FlexColumn } from "../../../styled/styled.flex";
import { CDN_LINK } from "../../../config/cdn/urlImage";
import formatRupiah from "../../../config/formatRupiah";
import { IoClose } from "react-icons/io5";
import ButtonV1 from "../../../components/Button/ButtonV1";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import ShowPDF from "../../../components/PDF/ShowPDF";
import { useNavigate } from "react-router-dom";
import FormInput from "../../../components/Form/FormInput";

export default function CartMenuOrder({ cart, updateQuantity, removeFromCart, setCart }) {
  const [inputValues, setInputValues] = useState({});
  const [paymentAmount, setPaymentAmount] = useState("");
  const [shortage, setShortage] = useState(0);
  const [change, setChange] = useState(0);

  // Initialize inputValues with the current cart quantities
  useEffect(() => {
    const initialInputValues = cart.reduce((acc, item) => {
      acc[item._id] = item.quantity;
      return acc;
    }, {});
    setInputValues(initialInputValues);
  }, [cart]);

  const handleIncrement = (itemId) => {
    const item = cart.find((cartItem) => cartItem._id === itemId);
    if (item) {
      const newQuantity = item.quantity + 1;
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleDecrement = (itemId) => {
    const item = cart.find((cartItem) => cartItem._id === itemId);
    if (item && item.quantity > 0) {
      const newQuantity = item.quantity - 1;
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleInputChange = (itemId, value) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      updateQuantity(itemId, parsedValue);
    }
  };

  const handlePaymentChange = (e) => {
    const value = parseFloat(e.target.value);
    setPaymentAmount(value);

    // Calculate shortage and change
    const totalPrice = calculateTotalPrice(cart);
    if (value >= totalPrice) {
      setShortage(0);
      setChange(value - totalPrice);
    } else {
      setShortage(totalPrice - value);
      setChange(0);
    }
  };

  const calculateTotalQuantity = (cart) => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotalPrice = (cart) => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalQuantity = calculateTotalQuantity(cart);
  const totalPrice = calculateTotalPrice(cart);

  const navigate = useNavigate();

  const checkout = () => {
    // Pastikan paymentAmount dan change sudah dihitung dengan benar
    const bayar = parseFloat(paymentAmount);
    const kembalian = change;

    const orderPayload = {
      items: cart.map((item) => ({ _id: item._id, quantity: item.quantity })),
      totalQuantity: totalQuantity,
      totalPrice: totalPrice,
      bayar: bayar,
      kembalian: kembalian,
    };

    axiosInstance
      .post("/api/v1/order/create", orderPayload)
      .then((response) => {
        console.log("Order created:", response.data);
        const orderId = response.data.order._id;
        setCart([]);
        localStorage.removeItem("cart");
        toast.success("Order created successfully");
        navigate(`/order/${orderId}`); // Redirect ke halaman detail order
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        toast.error("Error creating order");
      });
  };

  return (
    <CardWrapper>
      <h5>Order</h5>
      <p style={{ color: "#787878" }}>Take Out</p>
      {cart.map((data) => (
        <CardItemOrder className="mb-4" key={data?._id}>
          <ButtonRemove onClick={() => removeFromCart(data._id)}>
            <IoClose />
          </ButtonRemove>
          <DFlex>
            <img src={`${CDN_LINK.imageUrl}${data?.imgUrl}`} alt="" width="80px" />
            <FlexColumn style={{ gap: "8px", width: "100%" }}>
              <span style={{ fontWeight: "500", fontSize: "18px" }}>{data?.title}</span>
              <DFlexJustifyBetween style={{ width: "100%" }}>
                <span style={{ color: "#3772F0", fontSize: "16px", fontWeight: "500" }}>
                  {formatRupiah(data?.quantity * data?.price)}
                </span>
                <DFlex style={{ gap: "4px" }}>
                  <StyledButton onClick={() => handleDecrement(data._id)}>-</StyledButton>
                  <CountDisplay
                    type="text"
                    value={inputValues[data._id] || data.quantity}
                    onChange={(e) => handleInputChange(data._id, e.target.value)}
                    min="0"
                    max="100"
                  />
                  <StyledButton onClick={() => handleIncrement(data._id)}>+</StyledButton>
                </DFlex>
              </DFlexJustifyBetween>
            </FlexColumn>
          </DFlex>
        </CardItemOrder>
      ))}
      <DFlexJustifyBetween>
        <h6>Quantity :</h6>
        <h6 style={{ color: "#787878" }}>{totalQuantity}</h6>
      </DFlexJustifyBetween>
      <DFlexJustifyBetween>
        <h6 style={{ marginBottom: "0" }}>Subtotal :</h6>
        <h6 style={{ color: "#787878", marginBottom: "0" }}>{formatRupiah(totalPrice)}</h6>
      </DFlexJustifyBetween>
      <hr style={{ margin: "10px 0px" }} />
      <DFlexJustifyBetween>
        <h6>Total :</h6>
        <h6 style={{ color: "#787878" }}>{formatRupiah(totalPrice)}</h6>
      </DFlexJustifyBetween>
      <DFlexJustifyBetween>
        <h6>Kekurangan :</h6>
        <h6 style={{ color: "#787878" }}>{formatRupiah(shortage)}</h6>
      </DFlexJustifyBetween>
      <DFlexJustifyBetween className="mb-3">
        <h6>Kembalian :</h6>
        <h6 style={{ color: "#787878" }}>{formatRupiah(change)}</h6>
      </DFlexJustifyBetween>
      <FormInput placeholder="Bayar" type="number" value={paymentAmount} onChange={handlePaymentChange} />

      <ButtonV1 handleClick={checkout} style={{ marginTop: "10px" }}>
        Prints Bils
      </ButtonV1>
      {/* <ShowPDF cart={cart} totalQuantity={totalQuantity} totalPrice={totalPrice} /> */}
    </CardWrapper>
  );
}

const CardWrapper = styled(Card)`
  border: none;
  border-radius: 0.625rem;
  padding: 1.25rem;
  min-height: 85vh;
`;

const CardItemOrder = styled(Card)`
  border: none;
  background-color: #fafafa;
  padding: 1.25rem;
`;

// Styled component for the button
const StyledButton = styled(Button)`
  background-color: white;
  border-radius: 5px;
  color: #3772f0;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:hover {
    background-color: #3772f0;
  }
`;

// Styled component for the count display
const CountDisplay = styled.input`
  font-size: 1.125rem;
  font-weight: 500;
  outline: none;
  background-color: inherit;
  border: none;
  width: 35px;
  text-align: center;
`;

const ButtonRemove = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f03740;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;

  svg {
    font-size: 20px;
  }
`;

const TextTitle = styled.h5`
  font-size: 14px;
  margin-bottom: 0px;
`;

const TextNumber = styled.h5`
  color: #787878;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0px;
`;
