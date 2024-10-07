import React, { useEffect, useState } from "react";
import { Button, Modal, Row } from "react-bootstrap";
import styled from "styled-components";
import { DFlexJustifyBetween } from "../../styled/styled.flex";
import dateFormat from "../../config/dateFormat";
import formatRupiah from "../../config/formatRupiah";
import axiosInstance from "../../config/axios/axiosInstance";

export default function ModalCetakFaktur({ showFaktur, handleClose, selectedOrderId }) {
  const [order, setOrder] = useState(null);

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
      .get(`/api/v1/order/get/${selectedOrderId}`)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  }, [selectedOrderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const handlePrint = (orderId) => {
    const printSection = document.getElementById("print-section");

    if (printSection) {
      const printContent = printSection.innerHTML;
      const originalContent = document.body.innerHTML;

      // Set the body content to the print section only
      document.body.innerHTML = printContent;

      window.print();

      // Kembalikan body ke konten aslinya setelah print
      document.body.innerHTML = originalContent;
    } else {
      console.error("Element with ID 'print-section' not found.");
    }
  };

  return (
    <Modal show={showFaktur} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>No Transaksi : {order?.order?.noTransaksi} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="print-section">
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
            <TextTransaksi style={{ textTransform: "capitalize" }}>
              {formatRupiah(order?.order?.totalPrice)}
            </TextTransaksi>
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
            <TextTransaksi style={{ textTransform: "capitalize" }}>
              {formatRupiah(order?.order?.kembalian)}
            </TextTransaksi>
          </DFlexJustifyBetween>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: "none" }}>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
        <ButtonPrints variant="primary" onClick={() => handlePrint(order._id)}>
          Prints
        </ButtonPrints>
      </Modal.Footer>
    </Modal>
  );
}

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
