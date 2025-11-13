import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";

test("renders login form fields", () => {
  render(<Login />);
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});
