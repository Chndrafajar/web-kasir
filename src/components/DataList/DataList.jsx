import React from "react";
import { Table } from "react-bootstrap";
import { DFlex } from "../../styled/styled.flex";
import ButtonV1 from "../Button/ButtonV1";

export default function DataList({}) {
  return (
    <Table hover className="mt-4">
      <thead>
        <tr>
          <th>No</th>
          <th>Menu</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>
            <DFlex>
              <img
                src="https://upload-image-be.vercel.app/api/v1/images/66e59872437491460d551eb5"
                alt=""
                width={"30px"}
              />
              Pizza Ayam Fresh
            </DFlex>
          </td>
          <td>Makanan</td>
          <td>3</td>
          <td>Rp 30.000</td>
          <td>Rp 90.000</td>
          <td>
            <DFlex>
              <ButtonV1>Edit</ButtonV1>
              <ButtonV1 variant="red">Delete</ButtonV1>
            </DFlex>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>
            <DFlex>
              <img
                src="https://upload-image-be.vercel.app/api/v1/images/66e59872437491460d551eb5"
                alt=""
                width={"30px"}
              />
              Pizza Ayam Fresh
            </DFlex>
          </td>
          <td>Makanan</td>
          <td>3</td>
          <td>Rp 30.000</td>
          <td>Rp 90.000</td>
          <td>
            <DFlex>
              <ButtonV1>Edit</ButtonV1>
              <ButtonV1 variant="red">Delete</ButtonV1>
            </DFlex>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>
            <DFlex>
              <img
                src="https://upload-image-be.vercel.app/api/v1/images/66e59872437491460d551eb5"
                alt=""
                width={"30px"}
              />
              Pizza Ayam Fresh
            </DFlex>
          </td>
          <td>Makanan</td>
          <td>3</td>
          <td>Rp 30.000</td>
          <td>Rp 90.000</td>
          <td>
            <DFlex>
              <ButtonV1>Edit</ButtonV1>
              <ButtonV1 variant="red">Delete</ButtonV1>
            </DFlex>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
