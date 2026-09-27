import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("Cart counter is 0 by default", async ({ page }) => {
    const cartMenuLink = page.getByRole("link", { name: "Cart page" });

    await expect(cartMenuLink).toBeVisible();
    await expect(cartMenuLink).toContainText("cart (0)");
});

test("Empty cart page has default text placeholder", async ({ page }) => {
    const cartMenuLink = page.getByRole("link", { name: "Cart page" });
    const cartPageEmptyStateMessage = page.getByText("No coffee, go add some.");

    await cartMenuLink.click();
    await expect(cartPageEmptyStateMessage).toBeVisible();
});

test("Adding a drink updates the cart counter", async ({ page }) => {
    const espressoCup = page.getByLabel("Espresso", { exact: true });
    const cartMenuLink = page.getByRole("link", { name: "Cart page" });

    await espressoCup.click();
    await expect(cartMenuLink).toContainText("cart (1)");
});

test("Total is calculated correctly for multiple drinks", async ({ page }) => {
    const espressoCup = page.getByLabel("Espresso", { exact: true });
    const espressoMacchiatoCup = page.getByLabel("Espresso Macchiato", {
        exact: true,
    });
    const cartMenuLink = page.getByRole("link", { name: "Cart page" });
    const checkoutBT = page.getByLabel("Proceed to checkout", { exact: true });

    await espressoCup.click();
    await espressoMacchiatoCup.click();
    await expect(cartMenuLink).toContainText("cart (2)");
    await expect(checkoutBT).toContainText("Total: $22.00");
});

test("Added drinks are shown on the cart page", async ({ page }) => {
    const espressoCup = page.getByLabel("Espresso", { exact: true });
    const cappuccinoCup = page.getByLabel("Cappuccino", { exact: true });
    const cartMenuLink = page.getByRole("link", { name: "Cart page" });
    const cartPageListItem = page.getByRole("listitem");
    const espressoCartItem = cartPageListItem.filter({
        has: page.getByText("Espresso", { exact: true }),
    });
    const cappuccinoCartItem = cartPageListItem.filter({
        has: page.getByText("Cappuccino", { exact: true }),
    });

    await espressoCup.click();
    await cappuccinoCup.click();
    await cartMenuLink.click();
    await expect(espressoCartItem).toBeVisible();
    await expect(cappuccinoCartItem).toBeVisible();
});

test("Promo proposal is visible", async ({ page }) => {
    const espressoCup = page.getByLabel("Espresso", { exact: true });
    const espressoMacchiatoCup = page.getByLabel("Espresso", {
        exact: true,
    });
    const cappuccinoCup = page.getByLabel("Cappuccino", { exact: true });
    const promoTitle = page.getByText(
        "It's your lucky day! Get an extra cup of Mocha for $4.",
    );

    await espressoCup.click();
    await espressoMacchiatoCup.click();
    await cappuccinoCup.click();
    await expect(promoTitle).toBeVisible();
});

test("Payment fields are editable", async ({ page }) => {
    const checkoutBT = page.getByLabel("Proceed to checkout", { exact: true });
    const nameField = page.getByRole("textbox", { name: "Name" });
    const emailField = page.getByRole("textbox", { name: "Email" });

    await checkoutBT.click();
    await nameField.fill("Serhii");
    await expect(nameField).toHaveValue("Serhii");
    await emailField.fill("test@test.com");
    await expect(emailField).toHaveValue("test@test.com");
});

test("Successful payment message is shown", async ({ page }) => {
    const espressoCup = page.getByLabel("Espresso", { exact: true });
    const checkoutBT = page.getByLabel("Proceed to checkout", { exact: true });
    const nameField = page.getByRole("textbox", { name: "Name" });
    const emailField = page.getByRole("textbox", { name: "Email" });
    const submitBT = page.getByRole("button", { name: "Submit" });
    const snackbarSuccessMessage = page.getByText(
        "Thanks for your purchase. Please check your email for payment.",
    );

    await espressoCup.click();
    await checkoutBT.click();
    await nameField.fill("Serhii");
    await emailField.fill("test@test.com");
    await submitBT.click();
    await expect(snackbarSuccessMessage).toBeVisible();
});
