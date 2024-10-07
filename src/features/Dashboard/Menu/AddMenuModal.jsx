import React, { useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import FormInput from "../../../components/Form/FormInput";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import { CDN_LINK } from "../../../config/cdn/urlImage";
import styled from "styled-components";
import { useQuery } from "react-query";

export default function AddMenuModal({ show, handleClose, setShowAdd, fetchMenu }) {
  const [menu, setMenu] = useState({
    title: "",
    desc: "",
    price: "",
    category: "",
    imgUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(); // react-hook-form hooks

  const fetchCategory = async (page = 1) => {
    const res = await axiosInstance.get(`/api/v1/category/get?page=${page}`);
    return res.data;
  };

  const { data: dataCategory } = useQuery(["categories"], () => fetchCategory(), {
    keepPreviousData: true,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMenu({ ...menu, imgUrl: file });
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("imgUrl", selectedFile);

    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/v1/menu/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchMenu();
      toast.success(response?.data?.message);
      setShowAdd(false);
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      // Add error handling logic
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col>
              <ProfileImage>
                <Image
                  src={selectedFile ? URL.createObjectURL(selectedFile) : `${CDN_LINK.imageUrl}${menu.imgUrl}`}
                  roundedCircle
                  width={100}
                  height={100}
                />
              </ProfileImage>
              <ProfileButtons>
                <Form.Control type="file" onChange={handleFileChange} required />
              </ProfileButtons>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormInput
                register={register("title", { required: true })}
                labelName="Title"
                placeholder="Title"
                type="text"
              />
              {errors.title && <span style={{ color: "red" }}>Title is required</span>}
            </Col>
          </Row>
          <Row>
            <Col>
              <FormInput
                register={register("price", { required: true })}
                labelName="Price"
                placeholder="Price"
                type="number"
              />
              {errors.price && <span style={{ color: "red" }}>Price is required</span>}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Category</Form.Label>
              <Form.Select {...register("category", { required: true })}>
                <option>Pilih Category</option>
                {dataCategory?.category.map((c) => (
                  <option value={c?._id}>{c?.name}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                {...register("desc", { required: true })}
                placeholder="Description"
                type="text"
              />
              {errors.desc && <span style={{ color: "red" }}>Description is required</span>}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

// Styled components

const ProfileImage = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ProfileButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;
