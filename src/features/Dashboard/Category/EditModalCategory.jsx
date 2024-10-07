import React, { useState, useEffect } from "react";
import { Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import FormInput from "../../../components/Form/FormInput";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import { CDN_LINK } from "../../../config/cdn/urlImage";
import styled from "styled-components";
import { useQuery } from "react-query";

export default function EditModalCategory({
  show,
  handleClose,
  setShowUpdated,
  fetchCategories,
  selectedCategoriesId,
}) {
  const [category, setCategory] = useState({
    name: "",
    imgUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm(); // react-hook-form hooks

  //   get category by id
  const fetchCategoryById = async (id) => {
    const res = await axiosInstance.get(`/api/v1/category/get/${id}`); // Ganti dengan endpoint yang sesuai
    return res.data;
  };

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery(["categories", selectedCategoriesId], () => fetchCategoryById(selectedCategoriesId), {
    enabled: !!selectedCategoriesId, // Hanya jalankan query jika userId ada
  });

  useEffect(() => {
    if (categories?.category) {
      setCategory({
        name: categories.category.name,
        imgUrl: categories.category.imgUrl,
      });
      setValue("name", categories.category.name); // Set default value for name input
    }
  }, [categories, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setCategory({ ...category, imgUrl: file }); // Update category state with selected file
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("imgUrl", selectedFile);

    try {
      setLoading(true);
      const response = await axiosInstance.put(`/api/v1/category/edit/${selectedCategoriesId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchCategories();
      toast.success(response.data.message);
      setShowUpdated(false);
      reset();
      setSelectedFile(null); // Reset selected file
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
        <Modal.Title>Edit Category : {categories?.category?.name}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col>
              <ProfileImage>
                <Image
                  src={selectedFile ? URL.createObjectURL(selectedFile) : `${CDN_LINK.imageUrl}${category.imgUrl}`} // Display base64 image
                  roundedCircle
                  width={100}
                  height={100}
                />
              </ProfileImage>
              <ProfileButtons>
                <Form.Control type="file" onChange={handleFileChange} />
              </ProfileButtons>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormInput
                register={register("name", { required: true })}
                labelName="Name"
                placeholder="Name"
                type="text"
              />
              {errors.name && <span style={{ color: "red" }}>Name is required</span>}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Save"}
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
