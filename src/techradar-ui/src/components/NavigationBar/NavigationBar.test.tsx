import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
  it("Renders Navigation Bar", async () => {
    const navBar = render(<NavigationBar brand="test" />);

    const item = await navBar.findByText("test");
    expect(item).toHaveClass("navbar-brand");
  });
});
