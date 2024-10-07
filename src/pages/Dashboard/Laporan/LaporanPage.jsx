import React, { useState } from "react";
import CardInformationDashboard from "../../../features/Dashboard/CardInformationDashboard";

import { useQuery } from "react-query";
import { Pagination, Table } from "react-bootstrap";
import formatRupiah from "../../../config/formatRupiah";
import dateFormat from "../../../config/dateFormat";
import { NavLink } from "react-router-dom";
import ButtonV1 from "../../../components/Button/ButtonV1";
import { DFlexJustifyBetween } from "../../../styled/styled.flex";
import axiosInstance from "../../../config/axios/axiosInstance";
import CardFilterLaporan from "../../../features/Dashboard/Transaksi/CardFilterLaporan";

export default function LaporanPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  //download
  const downloadExcel = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("sort", sortOrder);

      // Jika range tanggal dipilih
      if (dateRange.length === 2) {
        params.append("startDate", dateRange[0].format("YYYY-MM-DD"));
        params.append("endDate", dateRange[1].format("YYYY-MM-DD"));
      }

      // Jika tanggal tunggal dipilih
      if (selectedDate) {
        params.append("selectedDate", selectedDate.format("YYYY-MM-DD"));
      }

      // Jika userId dipilih
      if (userId) {
        params.append("userId", userId);
      }

      // Jika ada query pencarian
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await axiosInstance.get(`/api/v1/order/download?${params.toString()}`, {
        responseType: "blob", // Mengatur tipe respons menjadi blob untuk file
      });

      // Membuat URL objek dari blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Membuat elemen <a> untuk mendownload file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.xlsx"); // Nama file yang akan didownload
      document.body.appendChild(link);
      link.click();

      // Membersihkan URL objek dan menghapus elemen <a>
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      alert("Failed to download Excel file");
    }
  };

  // Fungsi untuk fetch order
  const fetchOrder = async (
    page = 1,
    dateRange = [],
    selectedDate = null,
    userId = null,
    searchQuery = "",
    sortOrder = "desc"
  ) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("sort", sortOrder); // Tambahkan ini

    // Jika range tanggal dipilih
    if (dateRange.length === 2) {
      params.append("startDate", dateRange[0].format("YYYY-MM-DD"));
      params.append("endDate", dateRange[1].format("YYYY-MM-DD"));
    }

    // Jika tanggal tunggal dipilih
    if (selectedDate) {
      params.append("selectedDate", selectedDate.format("YYYY-MM-DD"));
    }

    // Jika userId dipilih
    if (userId) {
      params.append("userId", userId);
    }

    // Jika ada query pencarian
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    // Memanggil API untuk mendapatkan data order
    const res = await axiosInstance.get(`/api/v1/order/get?${params.toString()}`);
    return res.data;
  };

  // Menggunakan useQuery dari react-query untuk fetch data dengan pagination dan filter
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery(
    ["orders", currentPage, dateRange, selectedDate, userId, searchQuery, sortOrder],
    () => fetchOrder(currentPage, dateRange, selectedDate, userId, searchQuery, sortOrder),
    {
      keepPreviousData: true, // Menyimpan data lama saat loading data baru
    }
  );

  // Fungsi untuk menangani perubahan halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fungsi untuk menangani perubahan range tanggal
  const handleDateRangeChange = (dates) => {
    if (!dates) {
      // Jika pengguna mengklik ikon silang dan 'dates' menjadi null
      setDateRange([]);
    } else {
      // Jika range tanggal dipilih
      setDateRange(dates);
    }
    setSelectedDate(null); // Reset selectedDate jika range digunakan
  };

  // Fungsi untuk menangani perubahan tanggal tunggal
  const handleSelectedDateChange = (date) => {
    setSelectedDate(date);
    setDateRange([]); // Reset range date jika menggunakan single date
  };

  // Fungsi untuk menangani perubahan userId
  const handleUserIdChange = (value) => {
    setUserId(value); // Set userId yang dipilih
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  return (
    <>
      <CardInformationDashboard />
      <CardFilterLaporan
        handleDateRangeChange={handleDateRangeChange}
        handleSelectedDateChange={handleSelectedDateChange}
        handleUserIdChange={handleUserIdChange}
        dateRange={dateRange}
        selectedDate={selectedDate}
        handleSearchChange={handleSearchChange}
        handleSortChange={handleSortChange}
        searchQuery={searchQuery}
        downloadExcel={downloadExcel}
      />
      <RenderListData data={ordersData?.orders} />
      <DFlexJustifyBetween className="mt-2">
        <span>{ordersData?.orders?.length} datanya</span>

        <Pagination style={{ marginBottom: "0", border: "none" }}>
          <Pagination.Prev onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
          {Array.from({ length: ordersData?.totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => currentPage < ordersData?.totalPages && handlePageChange(currentPage + 1)} />
        </Pagination>
      </DFlexJustifyBetween>
    </>
  );
}

function RenderListData({ data }) {
  return (
    <>
      <div style={{ overflowX: "auto" }} className="table-container">
        <Table hover className="mt-4">
          <thead>
            <tr>
              <th>No</th>
              <th>No Transaksi</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Kasir</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((dataOrder, index) => (
              <tr key={dataOrder?._id}>
                <td>{index + 1}</td>
                <td>{dataOrder?.noTransaksi}</td>
                <td>{dataOrder?.totalQuantity}</td>
                <td>{formatRupiah(dataOrder?.totalPrice)}</td>
                <td>{dataOrder?.userId?.username}</td>
                <td>{dateFormat(dataOrder?.createdAt, "DD-MM-YYYY")}</td>
                <td>
                  <NavLink to={`/order/${dataOrder?._id}`}>
                    <ButtonV1>Prints</ButtonV1>
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
