import React, { useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FormInput from "../../../components/Form/FormInput";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import { useQuery } from "react-query";

export default function UpdateUserModal({ show, handleClose, setShowUpdated, fetchUsers, selectedUsersId }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(); // react-hook-form hooks

  //get data by id
  const fetchUserById = async (id) => {
    const res = await axiosInstance.get(`/api/v1/user/get/${id}`); // Ganti dengan endpoint yang sesuai
    return res.data;
  };

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery(["user", selectedUsersId], () => fetchUserById(selectedUsersId), {
    enabled: !!selectedUsersId, // Hanya jalankan query jika userId ada
  });

  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      password: data.password,
      role: data.role,
    };

    try {
      const response = await axiosInstance.put(`/api/v1/user/edit/${selectedUsersId}`, payload);
      fetchUsers();
      toast.success(response?.data?.message);
      setShowUpdated(false);
      // Reset form setelah sukses
      reset();
    } catch (error) {
      console.error("Error:", error);
      // toast.error(error.message);
      // Tambahkan logika penanganan kesalahan
    }
  };

  useEffect(() => {
    if (userData) {
      reset({
        username: userData.user.username,
        password: "", // Atur password ke string kosong
        role: userData.user.role,
      });
    }
  }, [userData, reset]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User : {userData?.user?.username}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col>
              <FormInput register={register("username")} labelName="Username" placeholder="Username" />
              {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
            </Col>
          </Row>
          <Row>
            <Col>
              <FormInput register={register("password")} labelName="Password" placeholder="Password" type="password" />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Role</Form.Label>
              <Form.Select aria-label="Default select example" {...register("role")}>
                <option>Pilih Role</option>
                <option value="superadmin">Superadmin</option>
                <option value="kasir">Kasir</option>
              </Form.Select>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
