import React from "react";
import styled from "styled-components";

export default function ButtonV1({ children, variant = "blue", style, type, handleClick }) {
  return (
    <ButtonStyles onClick={handleClick} type={type} className={`${variant}`} style={style}>
      {children}
    </ButtonStyles>
  );
}

const ButtonStyles = styled.button`
  padding: 0.35rem 0.75rem;
  border: inherit;
  color: inherit;
  background-color: inherit;
  border-radius: 0.375rem;

  &.md {
    padding: 0.55rem 0.95rem;
  }

  &.lg {
    padding: 0.75rem 1.15rem;
  }

  &.blue {
    background: #3772f0;
    color: #fff;

    &:hover {
      background: #2d65de;
      transition: 0.3s ease;
    }
  }
  &.red {
    background: #f03740;
    color: #fff;

    &:hover {
      background: #de2932;
      transition: 0.3s ease;
    }
  }
  &.orange {
    background: #f08137;
    color: #fff;

    &:hover {
      background: #db722b;
      transition: 0.3s ease;
    }
  }
  &.green {
    background: #37f07e;
    color: #000;

    &:hover {
      background: #24ce65;
      transition: 0.3s ease;
    }
  }
`;
