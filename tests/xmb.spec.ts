import { test, expect } from "@playwright/test";

test.describe("XMB menu", () => {
  test("loads on Home with Profile selected", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("application", { name: "Main menu" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Home", exact: true })).toBeVisible();
    await expect(page.getByText("Profile").first()).toBeVisible();
    await expect(page).toHaveURL(/c=home&i=profile/);
  });

  test("ArrowRight walks categories in order, ArrowLeft walks back", async ({ page }) => {
    await page.goto("/");
    const root = page.getByRole("application", { name: "Main menu" });
    await root.focus();

    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/c=about/);
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/c=films/);
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/c=music/);
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/c=contact/);
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/c=guestbook/);

    await page.keyboard.press("ArrowLeft");
    await expect(page).toHaveURL(/c=contact/);
  });

  test("Enter on the selected item opens the panel without leaving the page", async ({ page }) => {
    await page.goto("/");
    const root = page.getByRole("application", { name: "Main menu" });
    await root.focus();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/o=1/);
    await expect(page.getByRole("heading", { name: "Arpeet Barvalia" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page).not.toHaveURL(/o=1/);
  });

  test("external item: Enter opens the panel (not a new tab); the panel link carries the real URL", async ({ page, context }) => {
    await page.goto("/");
    const root = page.getByRole("application", { name: "Main menu" });
    await root.focus();

    // Home -> About -> Films -> Music -> Contact
    for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/c=contact/);

    // Contact's items: message (0), github (1) — move down once to select GitHub.
    await page.keyboard.press("ArrowDown");
    await expect(page).toHaveURL(/i=github/);

    const pagesBefore = context.pages().length;
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/o=1/);
    expect(context.pages().length).toBe(pagesBefore); // no auto-navigate, no new tab

    const link = page.getByRole("link", { name: /Open GitHub/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://github.com/abarvalia369");
    await expect(link).toHaveAttribute("target", "_blank");
  });
});
