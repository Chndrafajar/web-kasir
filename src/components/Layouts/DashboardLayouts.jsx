import React, { useState } from "react";
import styled from "styled-components";
import SidebarDash from "../Sidebar/SidebarDash";
import HeaderDash from "../Header/HeaderDash";

export default function DashboardLayouts({ children }) {
  const [activeBars, setActiveBars] = useState(false);

  return (
    <DashboardContainer>
      <SidebarDash activeBars={activeBars} setActiveBars={setActiveBars} />
      <DashContent>
        <HeaderDash activeBars={activeBars} setActiveBars={setActiveBars} />
        <ContentWrapper>{children}</ContentWrapper>
      </DashContent>
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  display: flex;
  background-color: #f8f9fd;
  min-height: 100vh;
`;

const DashContent = styled.div`
  width: 100%;
`;

const ContentWrapper = styled.div`
  padding: 1.25rem;
`;
