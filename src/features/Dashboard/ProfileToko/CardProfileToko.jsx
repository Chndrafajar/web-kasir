import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Form, Button, Image, Row, Col, Card, Spinner } from "react-bootstrap";
import ButtonV1 from "../../../components/Button/ButtonV1";
import axiosInstance from "../../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import { CDN_LINK } from "../../../config/cdn/urlImage";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    alamat: "",
    imgProfile: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mengambil data profile dari backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/profile/toko/get"); // Ganti dengan endpoint get profile yang sesuai
        setProfile(response.data.data); // Mengisi state dengan data dari backend
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handler untuk perubahan form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handler untuk memilih gambar baru
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("alamat", profile.alamat);

    // Jika ada file baru, tambahkan ke formData
    if (selectedFile) {
      formData.append("imgProfile", selectedFile);
    }

    try {
      await axiosInstance.put("/api/v1/profile/toko/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Pastikan menggunakan multipart form data
        },
      });
      toast.success("Profile updated successfully!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <ProfileWrapper>
      <Form onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <ProfileImage>
          <Image
            src={selectedFile ? URL.createObjectURL(selectedFile) : `${CDN_LINK.imageUrl}${profile.imgProfile}`} // Menampilkan gambar base64
            roundedCircle
            width={100}
            height={100}
          />
        </ProfileImage>
        <ProfileButtons>
          <Form.Control type="file" onChange={handleFileChange} />
        </ProfileButtons>

        {/* Profile Name */}
        <Form.Group controlId="formProfileName">
          <Form.Label>Name Toko</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Kevin Heart"
            value={profile.name}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* Alamat */}
        <Form.Group controlId="formAboutMe" className="mt-3 mb-4">
          <Form.Label>Alamat</Form.Label>
          <Form.Control
            as="textarea"
            name="alamat"
            placeholder="Alamat Toko"
            value={profile.alamat}
            onChange={handleInputChange}
          />
        </Form.Group>

        <ButtonV1 type="submit">{loading ? <Spinner animation="border" size="sm" /> : "Update Profile"}</ButtonV1>
      </Form>
    </ProfileWrapper>
  );
};

export default ProfilePage;

// Styled components
const ProfileWrapper = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: none;
`;

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

const UsernameInfo = styled.p`
  font-size: 12px;
  color: gray;
  text-align: center;
  margin-top: -10px;
`;

const AboutMeTextarea = styled(Form.Control)`
  min-height: 120px;
`;
