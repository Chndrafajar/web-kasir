import React from "react";
import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../../config/auth/authConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function HeaderDash({ activeBars, setActiveBars }) {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    navigate("/");
    localStorage.removeItem("auth");
    toast.success("Logout successfully");
  };

  return (
    <HeaderWrapper>
      <DFlexJBetween>
        <BarsIcons>
          <FaBars onClick={() => setActiveBars(!activeBars)} />
        </BarsIcons>
        <Dropdown>
          <Dropdown.Toggle style={{ background: "inherit", border: "none" }} id="dropdown-basic">
            <img
              src="/images/logo.png"
              alt=""
              style={{ width: "2.438rem", height: "2.438rem", borderRadius: "50%", objectFit: "cover" }}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </DFlexJBetween>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  height: 5.625rem;
  border-bottom: 1px solid #e2e2e2;
  background-color: #fff;
  display: flex;
  align-items: center;
  transition: 0.4s ease;

  @media print {
    display: none;
  }
`;

const DFlexJBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0px 1.25rem;
`;

const BarsIcons = styled.div`
  opacity: 0;
  svg {
    display: none;
  }

  @media (max-width: 992px) {
    svg {
      display: block;
    }
    cursor: pointer;
    opacity: 1;
  }
`;
