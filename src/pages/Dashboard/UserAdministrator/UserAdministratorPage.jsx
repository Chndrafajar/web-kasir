import React, { useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import { DFlex, DFlexJustifyBetween } from "../../../styled/styled.flex";
import ButtonV1 from "../../../components/Button/ButtonV1";
import { FaPlus } from "react-icons/fa";
import AddUserModal from "../../../features/Dashboard/UserAdministrator/AddUserModal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import UpdateUserModal from "../../../features/Dashboard/UserAdministrator/UpdateUserModal";
import dateFormat from "../../../config/dateFormat";
import { Select, Input } from "antd";

const { Option } = Select;

export default function UserAdministratorPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort order is descending (terbaru)
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async (page = 1, sort = "desc", search = "") => {
    const res = await axiosInstance.get(`/api/v1/user/get?page=${page}&sort=${sort}&search=${search}`);
    return res.data;
  };

  const {
    data: users,
    isLoading,
    error,
  } = useQuery(["users", currentPage, sortOrder, searchQuery], () => fetchUsers(currentPage, sortOrder, searchQuery), {
    keepPreviousData: true,
  });

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1); // Reset to the first page when changing sort order
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when changing search query
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const queryClient = useQueryClient();

  //modal add
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  //delete
  const deleteUsers = useMutation({
    mutationFn: async (id) => {
      return await axiosInstance.delete(`/api/v1/user/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Apakah anda ingin menghapus users ini?")) {
      deleteUsers.mutate(id, {
        onSuccess: () => {
          toast.success("User deleted successfully");
          fetchUsers();
        },
      });
    }
  };

  //update
  const [showUpdated, setShowUpdated] = useState(false);
  const [selectedUsersId, setSelectedUsersId] = useState(null);
  const handleUpdate = (id) => {
    setSelectedUsersId(id);
    setShowUpdated(true);
  };
  const handleUpdateClose = () => {
    setShowUpdated(false);
  };

  return (
    <>
      <ButtonV1 handleClick={handleShowAdd}>
        Tambah Pengguna <FaPlus />{" "}
      </ButtonV1>
      <DFlexJustifyBetween className="mt-4" style={{ background: "#fff", padding: "1.5rem" }}>
        <Select defaultValue="desc" style={{ width: 120, height: "45px" }} onChange={handleSortChange}>
          <Option value="desc">Terbaru</Option>
          <Option value="asc">Terlama</Option>
        </Select>
        <Input
          placeholder="Search by username"
          onChange={handleSearchChange}
          value={searchQuery}
          style={{ width: 200, height: "45px" }}
        />
      </DFlexJustifyBetween>
      <RenderListData data={users} handleDelete={handleDelete} handleUpdate={handleUpdate} />
      <DFlexJustifyBetween className="mt-2">
        <span>{users?.users?.length} datanya</span>

        <Pagination style={{ marginBottom: "0", border: "none" }}>
          <Pagination.Prev onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
          {Array.from({ length: users?.totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => currentPage < users?.totalPages && handlePageChange(currentPage + 1)} />
        </Pagination>
      </DFlexJustifyBetween>
      <AddUserModal handleClose={handleCloseAdd} show={showAdd} setShowAdd={setShowAdd} fetchUsers={fetchUsers} />
      <UpdateUserModal
        handleClose={handleUpdateClose}
        show={showUpdated}
        setShowUpdated={setShowUpdated}
        fetchUsers={fetchUsers}
        selectedUsersId={selectedUsersId}
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
              <th>Username</th>
              <th>Role</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((dataUsers, index) => (
              <tr key={dataUsers?._id}>
                <td>{index + 1}</td>
                <td>{dataUsers?.username}</td>
                <td>{dataUsers?.role}</td>
                <td>{dateFormat(dataUsers?.createdAt, "DD-MM-YYYY")}</td>
                <td>{dateFormat(dataUsers?.updatedAt, "DD-MM-YYYY")}</td>
                <td>
                  <DFlex>
                    <ButtonV1 handleClick={() => handleUpdate(dataUsers?._id)}>Edit</ButtonV1>
                    <ButtonV1 variant="red" handleClick={() => handleDelete(dataUsers?._id)}>
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
