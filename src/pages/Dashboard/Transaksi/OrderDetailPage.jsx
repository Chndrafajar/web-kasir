import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/axios/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import dateFormat from "../../../config/dateFormat";
import { DFlex, DFlexJustifyBetween } from "../../../styled/styled.flex";
import formatRupiah from "../../../config/formatRupiah";
import { Button } from "react-bootstrap";

const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const params = useParams(); // Dapatkan orderId dari URL
  const navigate = useNavigate();

  // profile toko
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/profile/toko/get"); // Ganti dengan endpoint get profile yang sesuai
        setProfile(response.data.data); // Mengisi state dengan data dari backend
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    // Ambil data order berdasarkan orderId
    axiosInstance
      .get(`/api/v1/order/get/${params.orderId}`)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  }, [params.orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const handlePrint = (orderId) => {
    window.print();
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="prints-body">
      <TextTitleProfile>{profile?.name}</TextTitleProfile>
      <TextTitleAlamat>{profile?.alamat}</TextTitleAlamat>
      <Bars />
      <DFlexJustifyBetween>
        <TextTransaksi>{dateFormat(order?.updatedAt)}</TextTransaksi>
        <TextTransaksi style={{ textTransform: "capitalize" }}>{order?.order?.userId?.username}</TextTransaksi>
      </DFlexJustifyBetween>
      <DFlexJustifyBetween>
        <TextTransaksi style={{ marginBottom: "0px" }}>No.{order?.order?.noTransaksi}</TextTransaksi>
      </DFlexJustifyBetween>
      <Bars />
      {order?.order?.items?.map((item) => (
        <div key={item?._id}>
          <TextTransaksi style={{ textTransform: "capitalize" }}>{item?.menuId?.title}</TextTransaksi>
          <DFlexJustifyBetween>
            <TextTransaksi style={{ textTransform: "capitalize" }}>
              {item?.quantity} x {formatRupiah(item?.menuId?.price)}
            </TextTransaksi>
            <TextTransaksi style={{ textTransform: "capitalize" }}>
              {formatRupiah(item?.quantity * item?.menuId?.price)}
            </TextTransaksi>
          </DFlexJustifyBetween>
        </div>
      ))}
      <Bars />
      <DFlexJustifyBetween>
        <TextTransaksi>Subtotal: </TextTransaksi>
        <TextTransaksi style={{ textTransform: "capitalize" }}>{formatRupiah(order?.order?.totalPrice)}</TextTransaksi>
      </DFlexJustifyBetween>
      <DFlexJustifyBetween>
        <TextTransaksi style={{ fontWeight: "600" }}>Total: </TextTransaksi>
        <TextTransaksi style={{ fontWeight: "600" }}>{formatRupiah(order?.order?.totalPrice)}</TextTransaksi>
      </DFlexJustifyBetween>
      <DFlexJustifyBetween>
        <TextTransaksi>Bayar: </TextTransaksi>
        <TextTransaksi style={{ textTransform: "capitalize" }}>{formatRupiah(order?.order?.bayar)}</TextTransaksi>
      </DFlexJustifyBetween>
      <DFlexJustifyBetween>
        <TextTransaksi>Kembali: </TextTransaksi>
        <TextTransaksi style={{ textTransform: "capitalize" }}>{formatRupiah(order?.order?.kembalian)}</TextTransaksi>
      </DFlexJustifyBetween>
      <DFlex>
        <ButtonPrints onClick={() => handlePrint(order._id)} className="mt-5 no-print">
          Prints
        </ButtonPrints>
        <ButtonPrints variant="danger" className="mt-5 no-print" onClick={handleBack}>
          Kembali
        </ButtonPrints>
      </DFlex>
    </div>
  );
};

export default OrderDetailPage;

const TextTransaksi = styled.span`
  font-size: 14px;
`;

const TextTitleProfile = styled.h3`
  text-align: center;
`;

const TextTitleAlamat = styled.h5`
  text-align: center;
  margin-bottom: 0px;
`;

const Bars = styled.div`
  border: 1px dashed grey;
  margin: 10px 0px;
  height: 1px;
`;

const ButtonPrints = styled(Button)`
  @media print {
    display: none;
  }
`;
