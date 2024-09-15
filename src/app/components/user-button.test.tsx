import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UserButton } from "@/components/user-button";

const mockSetTheme = vi.fn();

vi.mock("next-themes", () => {
  return {
    useTheme: vi.fn(() => ({
      setTheme: mockSetTheme,
    })),
  };
});
describe("<UserButton />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should open dropdown menu", async () => {
    const user = userEvent.setup();
    render(<UserButton />);

    const avatarButton = screen.getByRole("button", { name: /user menu/ });

    await user.click(avatarButton);
    const changeTheme = await screen.findByRole("menuitem", {
      name: /change theme/i,
    });

    await user.hover(changeTheme);
    const light = await screen.findByRole("menuitem", { name: /light/i });

    expect(light).toBeInTheDocument();
  });

  test.each(["light", "dark", "system"] as const)(
    "switch theme to %s",
    async (theme) => {
      const user = userEvent.setup();
      render(<UserButton />);

      const avatarButton = screen.getByRole("button", {
        name: /user menu/,
      });

      await user.click(avatarButton);
      const changeTheme = await screen.findByRole("menuitem", {
        name: /change theme/i,
      });

      await user.hover(changeTheme);

      const themeElement = await screen.findByRole("menuitem", {
        name: new RegExp(theme, "i"),
      });

      await user.click(themeElement);

      waitFor(() => {
        expect(mockSetTheme).toBeCalledWith(theme);
      });
    },
  );
});
