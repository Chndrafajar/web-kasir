import React, { useState } from "react";
import CardFilterTransaksi from "../../../features/Dashboard/Transaksi/CardFilterTransaksi";
import CardInformationDashboard from "../../../features/Dashboard/CardInformationDashboard";
import { Pagination, Table } from "react-bootstrap";
import axiosInstance from "../../../config/axios/axiosInstance";
import { useQuery } from "react-query";
import dateFormat from "../../../config/dateFormat";
import formatRupiah from "../../../config/formatRupiah";
import ButtonV1 from "../../../components/Button/ButtonV1";
import { DFlexJustifyBetween } from "../../../styled/styled.flex";
import { NavLink } from "react-router-dom";

export default function TransaksiPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Default sorting order

  // Fungsi untuk fetch order
  const fetchOrder = async (page = 1, dateRange = [], selectedDate = null, searchQuery = "", sortOrder = "desc") => {
    const params = new URLSearchParams();
    params.append("page", page);
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

    // Jika ada query pencarian
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    // Memanggil API untuk mendapatkan data order
    const res = await axiosInstance.get(`/api/v1/order/get-user?${params.toString()}`);
    return res.data;
  };

  // Menggunakan useQuery dari react-query untuk fetch data dengan pagination, filter, searching, dan sorting
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery(
    ["orders", currentPage, dateRange, selectedDate, searchQuery, sortOrder],
    () => fetchOrder(currentPage, dateRange, selectedDate, searchQuery, sortOrder),
    {
      keepPreviousData: true, // Menyimpan data lama saat loading data baru
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  const handleSelectedDateChange = (date) => {
    setSelectedDate(date);
    setDateRange([]); // Reset range date jika menggunakan single date
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
      <CardFilterTransaksi
        handleDateRangeChange={handleDateRangeChange}
        handleSelectedDateChange={handleSelectedDateChange}
        handleSearchChange={handleSearchChange}
        handleSortChange={handleSortChange}
        searchQuery={searchQuery}
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
