import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import FormInput from "../../../components/Form/FormInput";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import { CDN_LINK } from "../../../config/cdn/urlImage";
import styled from "styled-components";
import { useQuery } from "react-query";

export default function EditMenuModal({ show, handleClose, setShowUpdated, fetchMenu, selectedMenuId }) {
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
    setValue,
    formState: { errors },
  } = useForm(); // react-hook-form hooks

  //fetch menu
  const fetchMenuById = async (id) => {
    const res = await axiosInstance.get(`/api/v1/menu/get/${id}`);
    return res.data;
  };

  const { data: dataMenuId } = useQuery(["menus", selectedMenuId], () => fetchMenuById(selectedMenuId), {
    enabled: !!selectedMenuId,
  });

  useEffect(() => {
    if (dataMenuId?.menu) {
      setMenu({
        title: dataMenuId?.menu?.title,
        desc: dataMenuId?.menu?.desc,
        price: dataMenuId?.menu?.price,
        category: dataMenuId?.menu?.category?._id, // Perbaikan: Gunakan _id untuk kategori
        imgUrl: dataMenuId?.menu?.imgUrl,
      });
      setValue("title", dataMenuId?.menu?.title);
      setValue("desc", dataMenuId?.menu?.desc);
      setValue("price", dataMenuId?.menu?.price);
      setValue("imgUrl", dataMenuId?.menu?.imgUrl);
      setValue("category", dataMenuId?.menu?.category?._id); // Perbaikan: Gunakan _id untuk kategori
    }
  }, [dataMenuId, setValue]);

  //fetch category
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
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("imgUrl", selectedFile);

    try {
      setLoading(true);
      const response = await axiosInstance.put(`/api/v1/menu/edit/${selectedMenuId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchMenu();
      toast.success(response?.data?.message);
      setShowUpdated(false);
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
                <Form.Control type="file" onChange={handleFileChange} />
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
                <option value="">Pilih Category</option>
                {dataCategory?.category?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
              {errors.category && <span style={{ color: "red" }}>Category is required</span>}
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
