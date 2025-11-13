import { render, screen } from "@testing-library/react";
import App from "../App";
import { MemoryRouter } from "react-router-dom";

test("renders navbar component", () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});
