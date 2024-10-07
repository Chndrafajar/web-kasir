import React from "react";
import styled from "styled-components";

export default function FormInput({
  labelName,
  type = "text",
  placeholder,
  onChange,
  value,
  variant,
  required,
  register,
}) {
  return (
    <>
      <div className="mb-3">
        <LabelStyled>{labelName}</LabelStyled>
        <InputFormStyled
          type={type}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className={`${variant}`}
          {...register}
        />
      </div>
    </>
  );
}

const LabelStyled = styled.label`
  margin-bottom: 0.5rem;
`;

const InputFormStyled = styled.input`
  padding: 0.35rem 0.75rem;
  border: 1px solid #dee2e6;
  color: inherit;
  background-color: inherit;
  border-radius: 0.375rem;
  outline: none;
  width: 100%;

  &.md {
    padding: 0.55rem 0.95rem;
  }
  &.lg {
    padding: 0.75rem 1.15rem;
  }
`;
