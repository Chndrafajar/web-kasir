import React, { useState } from "react";
import ButtonV1 from "../../components/Button/ButtonV1";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../config/auth/authConfig";
import axiosInstance from "../../config/axios/axiosInstance";
import { toast } from "react-toastify";
import styled from "styled-components";

export default function AuthLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // react-hook-form hooks
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      password: data.password,
    };
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/v1/user/login", payload);
      toast.success(response?.data?.message);
      setAuth({
        ...auth,
        user: response.data.user,
        token: response.data.token,
      });

      localStorage.setItem("auth", JSON.stringify(response.data));
      navigate("/dashboard");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
      setLoading(false);

      // Tambahkan logika penanganan kesalahan
    }
  };

  return (
    <AuthLoginStyled>
      <CardWrapper>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              {...register("username", { required: "Username is required" })} // Register input with validation
              isInvalid={errors.username}
            />
            {errors.username && <Form.Control.Feedback type="invalid">{errors.username.message}</Form.Control.Feedback>}
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })} // Register input with validation
              isInvalid={errors.password}
            />
            {errors.password && <Form.Control.Feedback type="invalid">{errors.password.message}</Form.Control.Feedback>}
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>
        </Form>
      </CardWrapper>
    </AuthLoginStyled>
  );
}

const AuthLoginStyled = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fd;
  padding: 1.5rem;
`;

const CardWrapper = styled(Card)`
  padding: 1.75rem;
  border: none;
  width: 400px;
`;
