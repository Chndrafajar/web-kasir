import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { useAuth } from "./authConfig";
import { Spinner } from "react-bootstrap";
import { SpinnerLoading } from "./SpinnerLoading";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/user/user-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Admin auth check failed", error);
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setOk(false);
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : <SpinnerLoading path="" />;
}
