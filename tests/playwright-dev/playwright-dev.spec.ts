import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("https://playwright.dev");
});

test("Search provides relevant results", async ({ page }) => {
    await page.getByRole("button", { name: "Search (Control+k)" }).click();
    await page.getByRole("searchbox", { name: "Search" }).fill("beforeEach");
    await page
        .locator(".DocSearch-Hit-title")
        .first()
        .waitFor({ state: "visible" });
    const searchResults = await page
        .locator(".DocSearch-Hit-title")
        .allInnerTexts();
    expect(searchResults.find((el) => el.includes("beforeEach"))).toBeTruthy();
});

test("Theme toggle changes the theme", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).toHaveAttribute(
        "data-theme-choice",
        "system",
    );
    await page
        .getByRole("button", { name: "Switch between dark and light" })
        .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).toHaveAttribute(
        "data-theme-choice",
        "light",
    );
    await page
        .getByRole("button", { name: "Switch between dark and light" })
        .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).toHaveAttribute(
        "data-theme-choice",
        "dark",
    );
    await page
        .getByRole("button", { name: "Switch between dark and light" })
        .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).toHaveAttribute(
        "data-theme-choice",
        "system",
    );
});

test("Main menu traversal is successful", async ({ page }) => {
    await page.getByRole("link", { name: "Docs" }).click();
    await expect(page).toHaveTitle("Installation | Playwright");
    await page.getByRole("link", { name: "MCP" }).click();
    await expect(page).toHaveTitle("Introduction | Playwright");
    await page.getByRole("link", { name: "API" }).click();
    await expect(page).toHaveTitle("Playwright Library | Playwright");
});

test("Side menu traversal is successful", async ({ page }) => {
    await page.getByRole("link", { name: "Docs" }).click();
    await page.getByRole("link", { name: "Installation" }).click();
    await expect(page.locator("h1")).toContainText("Installation");
    await page
        .getByRole("link", { name: "Writing tests", exact: true })
        .click();
    await expect(page.locator("h1")).toContainText("Writing tests");
    await page
        .getByRole("link", { name: "Generating tests", exact: true })
        .click();
    await expect(page.locator("h1")).toContainText("Generating tests");
});
