import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export const SpinnerLoading = ({ path = "/" }) => {
  const [count, setCount] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="d-flex align-items-center justify-content-center flex-column" style={{ height: "100vh" }}>
      {/* <h1 className="text-center">redirecting to you in {count} second </h1> */}
      <Spinner />
    </div>
  );
};
