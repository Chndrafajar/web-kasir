import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import formatRupiah from "../../config/formatRupiah";
import axiosInstance from "../../config/axios/axiosInstance";
import { useQuery } from "react-query";
import dateFormat from "../../config/dateFormat";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    fontSize: 12,
    marginBottom: 5,
    textTransform: "capitalize",
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 14,
  },
  total: {
    fontSize: 14,
  },
  titleProfile: {
    fontSize: 21,
    textAlign: "center",
    marginBottom: 5,
  },
  titleAlamat: {
    fontSize: 14,
    textAlign: "center",
  },
  bar: {
    border: "1px dotted #000",
    height: 1,
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
  },
});

export default function TransactionPDF({ dataOrder }) {
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

  console.log(profile);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.titleProfile}>{profile?.name}</Text>
          <Text style={styles.titleAlamat}>{profile?.alamat}</Text>
          <Text style={styles.bar}></Text>
          <Text style={styles.item}>Date: {dateFormat(dataOrder?.updatedAt)}</Text>
          <Text style={styles.item}>Kasir: {dataOrder?.order?.userId?.username}</Text>
          <Text style={styles.item}>No: {dataOrder?.order?.noTransaksi}</Text>
          <Text style={styles.bar}></Text>
          {dataOrder?.order?.items.map((item) => (
            <div key={item?._id}>
              <Text style={styles.item}>{item?.menuId?.title}</Text>
              <Text style={styles.item}>
                {item?.quantity} x {formatRupiah(item?.menuId.price)} ={" "}
                {formatRupiah(item?.quantity * item?.menuId?.price)}
              </Text>
            </div>
          ))}
          <Text style={styles.bar}></Text>
          <Text style={styles.item}>Quantity: {dataOrder?.order?.totalQuantity}</Text>
          <Text style={styles.item}>Subtotal: {formatRupiah(dataOrder?.order?.totalPrice)}</Text>
          <Text style={styles.item}>Total: {formatRupiah(dataOrder?.order?.totalPrice)}</Text>
          <Text style={styles.item}>Bayar: {formatRupiah(dataOrder?.order?.bayar)}</Text>
          <Text style={styles.item}>Kembalian: {formatRupiah(dataOrder?.order?.kembalian)}</Text>
        </View>
      </Page>
    </Document>
  );
}
