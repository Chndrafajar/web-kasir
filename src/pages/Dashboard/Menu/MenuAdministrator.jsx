import React, { useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import { DFlex, DFlexJustifyBetween } from "../../../styled/styled.flex";
import ButtonV1 from "../../../components/Button/ButtonV1";
import { FaPlus } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import AddMenuModal from "../../../features/Dashboard/Menu/AddMenuModal";
import { CDN_LINK } from "../../../config/cdn/urlImage";
import formatRupiah from "../../../config/formatRupiah";
import EditMenuModal from "../../../features/Dashboard/Menu/EditMenuModal";
import dateFormat from "../../../config/dateFormat";

export default function MenuAdministrator() {
  const [showAdd, setShowAdd] = useState(false);

  const fetchMenu = async (page = 1) => {
    const res = await axiosInstance.get(`/api/v1/menu/get?page=${page}`);
    return res.data;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: dataMenu,
    isLoading,
    error,
  } = useQuery(["menus", currentPage], () => fetchMenu(currentPage), {
    keepPreviousData: true,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log(dataMenu);

  const queryClient = useQueryClient();

  //modal add
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  //delete
  const deleteMenus = useMutation({
    mutationFn: async (id) => {
      return await axiosInstance.delete(`/api/v1/menu/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["menus"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Apakah anda ingin menghapus menu ini?")) {
      deleteMenus.mutate(id, {
        onSuccess: () => {
          toast.success("Menu deleted successfully");
          fetchMenu();
        },
      });
    }
  };

  //update
  const [showUpdated, setShowUpdated] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const handleUpdate = (id) => {
    setSelectedMenuId(id);
    setShowUpdated(true);
  };
  const handleUpdateClose = () => {
    setShowUpdated(false);
  };

  return (
    <>
      <ButtonV1 handleClick={handleShowAdd}>
        Tambah Menu <FaPlus />{" "}
      </ButtonV1>
      <RenderListData data={dataMenu} handleDelete={handleDelete} handleUpdate={handleUpdate} />
      <DFlexJustifyBetween className="mt-2">
        <span>{dataMenu?.menu?.length} datanya</span>

        <Pagination style={{ marginBottom: "0", border: "none" }}>
          <Pagination.Prev onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
          {Array.from({ length: dataMenu?.totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => currentPage < dataMenu?.totalPages && handlePageChange(currentPage + 1)} />
        </Pagination>
      </DFlexJustifyBetween>
      <AddMenuModal handleClose={handleCloseAdd} show={showAdd} setShowAdd={setShowAdd} fetchMenu={fetchMenu} />
      <EditMenuModal
        handleClose={handleUpdateClose}
        show={showUpdated}
        setShowUpdated={setShowUpdated}
        fetchMenu={fetchMenu}
        selectedMenuId={selectedMenuId}
      />
    </>
  );
}

function RenderListData({ data, handleDelete, handleUpdate }) {
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <Table hover className="mt-4">
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.menu?.map((dataMenu, index) => (
              <tr key={dataMenu?._id}>
                <td>{index + 1}</td>
                <td>
                  <img src={`${CDN_LINK.imageUrl}${dataMenu.imgUrl}`} alt="" style={{ width: "50px" }} />
                </td>
                <td>{dataMenu?.title}</td>
                <td>{dataMenu?.category?.name}</td>
                <td>{dataMenu?.desc.slice(0, 50) + (dataMenu?.desc.length > 50 ? "..." : "")}</td>
                <td>{formatRupiah(dataMenu?.price)}</td>
                <td>{dateFormat(dataMenu?.createdAt, "DD-MM-YYYY")}</td>
                <td>{dateFormat(dataMenu?.updatedAt, "DD-MM-YYYY")}</td>
                <td>
                  <DFlex>
                    <ButtonV1 handleClick={() => handleUpdate(dataMenu?._id)}>Edit</ButtonV1>
                    <ButtonV1 variant="red" handleClick={() => handleDelete(dataMenu?._id)}>
                      Delete
                    </ButtonV1>
                  </DFlex>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
