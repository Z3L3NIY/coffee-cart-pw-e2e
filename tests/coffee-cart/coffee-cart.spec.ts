import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("Cart counter is 0 by default", async ({ page }) => {
    const cartMenuLink = page.locator("a[href='/cart']");

    await expect(cartMenuLink).toBeVisible();
    await expect(cartMenuLink).toContainText("cart (0)");
});

test("Empty cart page has default text placeholder", async ({ page }) => {
    const cartMenuLink = page.locator("a[href='/cart']");
    const cartPageEmptyStateMessage = page.locator(".list > p");

    await cartMenuLink.click();
    await expect(cartPageEmptyStateMessage).toBeVisible();
    await expect(cartPageEmptyStateMessage).toHaveText(
        "No coffee, go add some.",
    );
});

test("Adding a drink updates the cart counter", async ({ page }) => {
    const espressoCup = page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup");
    const cartMenuLink = page.getByRole("link", { name: "Cart page" });

    await espressoCup.click();
    await expect(cartMenuLink).toHaveText("cart (1)");
});

test("Total is calculated correctly for multiple drinks", async ({ page }) => {
    const espressoCup = page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup");
    const espressoMacchiatoCup = page
        .locator("li")
        .filter({
            has: page.locator("h4", { hasText: /^Espresso Macchiato\s*\$/ }),
        })
        .locator(".cup");
    const cartMenuLink = page.locator("a[href='/cart']");
    const checkoutBT = page.locator("button.pay");

    await espressoCup.click();
    await espressoMacchiatoCup.click();
    await expect(cartMenuLink).toHaveText("cart (2)");
    await expect(checkoutBT).toHaveText("Total: $22.00");
});

test("Added drinks are shown on the cart page", async ({ page }) => {
    const espressoCup = page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup");
    const cappuccinoCup = page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Cappuccino\s*\$/ }) })
        .locator(".cup");
    const cartMenuLink = page.locator("a[href='/cart']");
    const cartPageListItem = page.locator(".list-item > div");
    const espressoCartItem = cartPageListItem.filter({ hasText: /^Espresso$/ });
    const cappuccinoCartItem = cartPageListItem.filter({
        hasText: /^Cappuccino$/,
    });

    await espressoCup.click();
    await cappuccinoCup.click();
    await cartMenuLink.click();
    await expect(espressoCartItem).toBeVisible();
    await expect(cappuccinoCartItem).toBeVisible();
});

test("Promo proposal is visible", async ({ page }) => {
    const espressoCup = page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup");
    const espressoMacchiatoCup = page
        .locator("li")
        .filter({
            has: page.locator("h4", { hasText: /^Espresso Macchiato\s*\$/ }),
        })
        .locator(".cup");
    const cappuccinoCup = page
        .locator("li")
        .filter({
            has: page.locator("h4", { hasText: /^Cappuccino\s*\$/ }),
        })
        .locator(".cup");
    const promoTitle = page.locator(".promo span");

    await espressoCup.click();
    await espressoMacchiatoCup.click();
    await cappuccinoCup.click();
    await expect(promoTitle).toBeVisible();
    await expect(promoTitle).toHaveText(
        "It's your lucky day! Get an extra cup of Mocha for $4.",
    );
});

test("Payment fields are editable", async ({ page }) => {
    const checkoutBT = page.locator("button.pay");
    const nameField = page.locator("#name");
    const emailField = page.locator("#email");

    await checkoutBT.click();
    await nameField.fill("Serhii");
    await expect(nameField).toHaveValue("Serhii");
    await emailField.fill("test@test.com");
    await expect(emailField).toHaveValue("test@test.com");
});

test("Successful payment message is shown", async ({ page }) => {
    const espressoCup = page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup");
    const checkoutBT = page.locator("button.pay");
    const nameField = page.locator("#name");
    const emailField = page.locator("#email");
    const submitBT = page.locator("#submit-payment");
    const snackbarSuccessMessage = page.locator(".snackbar.success");

    await espressoCup.click();
    await checkoutBT.click();
    await nameField.fill("Serhii");
    await emailField.fill("test@test.com");
    await submitBT.click();
    await expect(snackbarSuccessMessage).toBeVisible();
    await expect(snackbarSuccessMessage).toHaveText(
        "Thanks for your purchase. Please check your email for payment.",
    );
});
