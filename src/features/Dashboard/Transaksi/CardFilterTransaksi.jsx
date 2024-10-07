import React from "react";
import { Card } from "react-bootstrap";
import styled from "styled-components";
import { DFlex } from "../../../styled/styled.flex";
import { DatePicker, Input, Select } from "antd";
import SelectStatic from "../../../components/Select/SelectStatic";
import moment from "moment";
const { Option } = Select;

const { RangePicker } = DatePicker;

export default function CardFilterTransaksi({
  handleDateRangeChange,
  handleSelectedDateChange,
  handleSortChange,
  handleSearchChange,
  searchQuery,
}) {
  return (
    <>
      <CardWrapper>
        <DFlex style={{ flexWrap: "wrap" }}>
          <RangePicker style={{ padding: "10px" }} onChange={handleDateRangeChange} />
          <DatePicker style={{ padding: "10px" }} onChange={handleSelectedDateChange} />
          {/* <SelectStatic /> */}
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
        </DFlex>
      </CardWrapper>
    </>
  );
}

const CardWrapper = styled(Card)`
  border: none;
  padding: 1.25rem;
`;
