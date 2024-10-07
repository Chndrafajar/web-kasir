import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import TransactionPDF from "./TransactionPDF";

const ShowPDF = ({ cart, totalQuantity, totalPrice }) => (
  <PDFViewer style={{ width: "100%", height: "100vh" }}>
    <TransactionPDF cart={cart} totalQuantity={totalQuantity} totalPrice={totalPrice} />
  </PDFViewer>
);

export default ShowPDF;
