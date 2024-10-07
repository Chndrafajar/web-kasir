import React from "react";
import { Button, Card } from "react-bootstrap";
import styled from "styled-components";
import { DFlex } from "../../../styled/styled.flex";
import { DatePicker, Input, Select } from "antd";
import moment from "moment";
import { useQuery } from "react-query";
import axiosInstance from "../../../config/axios/axiosInstance";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function CardFilterLaporan({
  handleDateRangeChange,
  handleSelectedDateChange,
  handleUserIdChange,
  selectedDate,
  dateRange,
  handleSearchChange,
  searchQuery,
  handleSortChange,
  downloadExcel,
}) {
  const fetchUsers = async () => {
    const res = await axiosInstance.get(`/api/v1/user/get-all`);
    return res.data;
  };

  const {
    data: users,
    isLoading,
    error,
  } = useQuery(["users"], () => fetchUsers(), {
    keepPreviousData: true,
  });

  console.log(users);

  return (
    <>
      <CardWrapper>
        <DFlex style={{ flexWrap: "wrap" }}>
          <RangePicker
            style={{ padding: "10px" }}
            onChange={handleDateRangeChange}
            value={dateRange?.length === 2 ? dateRange : null}
          />
          <DatePicker
            style={{ padding: "10px" }}
            onChange={handleSelectedDateChange}
            value={selectedDate ? moment(selectedDate) : null}
          />
          <SelectAntd
            style={{ width: 200 }}
            placeholder="Select Berdasarka User"
            onChange={handleUserIdChange}
            allowClear
          >
            {users?.user?.map((user) => (
              <Select.Option value={user?._id} key={user?._id}>
                {user?.username}
              </Select.Option>
            ))}
          </SelectAntd>
          <Select defaultValue="desc" style={{ width: 120, height: "45px" }} onChange={handleSortChange}>
            <Option value="desc">Terbaru</Option>
            <Option value="asc">Terlama</Option>
          </Select>
          <Input
            placeholder="Search by no transaksi"
            onChange={handleSearchChange}
            value={searchQuery}
            style={{ width: 200, height: "45px" }}
          />
          <Button onClick={downloadExcel}>Cetak Laporan</Button>

          {/* <SelectStatic /> */}
        </DFlex>
      </CardWrapper>
    </>
  );
}

const CardWrapper = styled(Card)`
  border: none;
  padding: 1.25rem;
`;

const SelectAntd = styled(Select)`
  height: 45px;
`;
