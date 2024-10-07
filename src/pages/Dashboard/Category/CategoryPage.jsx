import React, { useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import { DFlex, DFlexJustifyBetween } from "../../../styled/styled.flex";
import ButtonV1 from "../../../components/Button/ButtonV1";
import { FaPlus } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import { CDN_LINK } from "../../../config/cdn/urlImage";
import AddModalCategory from "../../../features/Dashboard/Category/AddModalCategory";
import EditModalCategory from "../../../features/Dashboard/Category/EditModalCategory";
import dateFormat from "../../../config/dateFormat";

export default function CategoryPage() {
  const [showAdd, setShowAdd] = useState(false);

  const fetchCategories = async (page = 1) => {
    const res = await axiosInstance.get(`/api/v1/category/get?page=${page}`);
    return res.data;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery(["categories", currentPage], () => fetchCategories(currentPage), {
    keepPreviousData: true,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const queryClient = useQueryClient();

  //modal add
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  //delete
  const deleteCategories = useMutation({
    mutationFn: async (id) => {
      return await axiosInstance.delete(`/api/v1/category/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Apakah anda ingin menghapus category ini?")) {
      deleteCategories.mutate(id, {
        onSuccess: () => {
          toast.success("Category deleted successfully");
          fetchCategories();
        },
      });
    }
  };

  //update
  const [showUpdated, setShowUpdated] = useState(false);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState(null);
  const handleUpdate = (id) => {
    setSelectedCategoriesId(id);
    setShowUpdated(true);
  };
  const handleUpdateClose = () => {
    setShowUpdated(false);
  };

  //delete

  return (
    <>
      <ButtonV1 handleClick={handleShowAdd}>
        Tambah Category <FaPlus />{" "}
      </ButtonV1>
      <RenderListData data={categories} handleDelete={handleDelete} handleUpdate={handleUpdate} />
      <DFlexJustifyBetween className="mt-2">
        <span>{categories?.category?.length} datanya</span>

        <Pagination style={{ marginBottom: "0", border: "none" }}>
          <Pagination.Prev onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
          {Array.from({ length: categories?.totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => currentPage < categories?.totalPages && handlePageChange(currentPage + 1)} />
        </Pagination>
      </DFlexJustifyBetween>
      <AddModalCategory
        handleClose={handleCloseAdd}
        show={showAdd}
        setShowAdd={setShowAdd}
        fetchCategories={fetchCategories}
      />
      <EditModalCategory
        handleClose={handleUpdateClose}
        show={showUpdated}
        setShowUpdated={setShowUpdated}
        fetchCategories={fetchCategories}
        selectedCategoriesId={selectedCategoriesId}
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
              <th>Name</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.category?.map((dataCategories, index) => (
              <tr key={dataCategories?._id}>
                <td>{index + 1}</td>
                <td>
                  <img src={`${CDN_LINK.imageUrl}${dataCategories.imgUrl}`} alt="" style={{ width: "30px" }} />
                </td>
                <td>{dataCategories?.name}</td>
                <td>{dateFormat(dataCategories?.createdAt, "DD-MM-YYYY")}</td>
                <td>{dateFormat(dataCategories?.updatedAt, "DD-MM-YYYY")}</td>
                <td>
                  <DFlex>
                    <ButtonV1 handleClick={() => handleUpdate(dataCategories?._id)}>Edit</ButtonV1>
                    <ButtonV1 variant="red" handleClick={() => handleDelete(dataCategories?._id)}>
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
