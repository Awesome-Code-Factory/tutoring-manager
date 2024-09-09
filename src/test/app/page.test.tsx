import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Home from "../../app/page";

test("live test", () => {
  render(<Home />);

  const header = screen.getByRole("heading", { name: /Welcome to the page!/ });

  expect(header).toBeInTheDocument();
});
