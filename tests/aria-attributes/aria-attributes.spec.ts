import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("Cart counter is 0 by default", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Cart page" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cart page" })).toContainText(
        "cart (0)",
    );
});

test("Empty cart page has default text placeholder", async ({ page }) => {
    await page.getByRole("link", { name: "Cart page" }).click();
    await expect(page.getByText("No coffee, go add some.")).toBeVisible();
});

test("Adding a drink updates the cart counter", async ({ page }) => {
    await page.getByLabel("Espresso", { exact: true }).click();
    await expect(page.getByRole("link", { name: "Cart page" })).toContainText(
        "cart (1)",
    );
});

test("Total is calculated correctly for multiple drinks", async ({ page }) => {
    await page.getByLabel("Espresso", { exact: true }).click();
    await page.getByLabel("Espresso Macchiato", { exact: true }).click();
    await expect(page.getByRole("link", { name: "Cart page" })).toContainText(
        "cart (2)",
    );
    await expect(
        page.getByLabel("Proceed to checkout", { exact: true }),
    ).toContainText("Total: $22.00");
});

test("Added drinks are shown on the cart page", async ({ page }) => {
    await page.getByLabel("Espresso", { exact: true }).click();
    await page.getByLabel("Cappuccino", { exact: true }).click();
    await page.getByRole("link", { name: "Cart page" }).click();
    await expect(
        page
            .getByRole("listitem")
            .filter({ has: page.getByText("Espresso", { exact: true }) }),
    ).toBeVisible();
    await expect(
        page
            .getByRole("listitem")
            .filter({ has: page.getByText("Cappuccino", { exact: true }) }),
    ).toBeVisible();
});

test("Promo proposal is visible", async ({ page }) => {
    await page.getByLabel("Espresso", { exact: true }).click();
    await page.getByLabel("Espresso Macchiato", { exact: true }).click();
    await page.getByLabel("Cappuccino", { exact: true }).click();
    await expect(
        page.getByText(
            "It's your lucky day! Get an extra cup of Mocha for $4.",
        ),
    ).toBeVisible();
});

test("Payment fields are editable", async ({ page }) => {
    await page.getByLabel("Proceed to checkout", { exact: true }).click();
    await page.getByRole("textbox", { name: "Name" }).fill("Serhii");
    await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue(
        "Serhii",
    );
    await page.getByRole("textbox", { name: "Email" }).fill("test@test.com");
    await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(
        "test@test.com",
    );
});

test("Successful payment message is shown", async ({ page }) => {
    await page.getByLabel("Espresso", { exact: true }).click();
    await page.getByLabel("Proceed to checkout", { exact: true }).click();
    await page.getByRole("textbox", { name: "Name" }).fill("Serhii");
    await page.getByRole("textbox", { name: "Email" }).fill("test@test.com");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(
        page.getByText(
            "Thanks for your purchase. Please check your email for payment.",
        ),
    ).toBeVisible();
});
