import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FormInput from "../../../components/Form/FormInput";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";

export default function AddUserModal({ show, handleClose, setShowAdd, fetchUsers }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(); // react-hook-form hooks

  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      password: data.password,
      role: data.role,
    };

    try {
      const response = await axiosInstance.post("/api/v1/user/register", payload);
      fetchUsers();
      toast.success(response?.data?.message);
      setShowAdd(false);
      // Reset form setelah sukses
      reset();
    } catch (error) {
      console.error("Error:", error);
      // toast.error(error.message);
      // Tambahkan logika penanganan kesalahan
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add User Pengguna</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col>
              <FormInput register={register("username")} required={true} labelName="Username" placeholder="Username" />
              {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
            </Col>
          </Row>
          <Row>
            <Col>
              <FormInput
                register={register("password")}
                required={true}
                labelName="Password"
                placeholder="Password"
                type="password"
              />
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
