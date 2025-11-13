import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { MemoryRouter } from "react-router-dom";

test("renders navigation links", () => {
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Add Expense")).toBeInTheDocument();
});
