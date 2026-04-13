import styled from "styled-components";

const StyledButton = styled.button`
  width: ${({ $full }) => ($full ? "100%" : "auto")};
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;
flex items-center gap-4 text-[#3B82F6] rounded-4xl px-6 py-2 bg-white cursor-pointer
  background-color: ${({ variant, disabled }) => {
    if (disabled) return "var(--gray-blue)";

    switch (variant) {
      case "primary":
        return "var(--dark-blue)";
      case "danger":
        return "var(--red)";
      case "success":
        return "var(--green)";
      default:
        return "var(--dark-blue)";
    }
  }};

  color: ${({ disabled }) => (disabled ? "var(--dark-gray)" : "white")};

  &:hover {
    background-color: ${({ variant, disabled }) => {
      if (disabled) return "var(--gray-blue)";

      switch (variant) {
        case "primary":
          return "#172554";
        case "danger":
          return "#b91c1c";
        case "success":
          return "#15803d";
        default:
          return "#172554";
      }
    }};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.98)")};
  }
`;

const Button = ({
  children,
  otherClasses = "",
  variant = "primary",
  disabled = false,
  full = false,
  ...props
}) => {
  return (
    <StyledButton
      className={otherClasses}
      variant={variant}
      disabled={disabled}
      $full={full} // use transient prop
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
