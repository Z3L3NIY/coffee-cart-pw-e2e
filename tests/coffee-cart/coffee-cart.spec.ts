import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("Cart counter is 0 by default", async ({ page }) => {
    await expect(page.locator("a[href='/cart']")).toBeVisible();
    await expect(page.locator("a[href='/cart']")).toContainText("cart (0)");
});

test("Empty cart page has default text placeholder", async ({ page }) => {
    await page.locator("a[href='/cart']").click();
    await expect(page.locator(".list > p")).toBeVisible();
    await expect(page.locator(".list > p")).toHaveText(
        "No coffee, go add some.",
    );
});

test("Adding a drink updates the cart counter", async ({ page }) => {
    await page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup")
        .click();
    await expect(page.locator("a[href='/cart']")).toHaveText("cart (1)");
});

test("Total is calculated correctly for multiple drinks", async ({ page }) => {
    await page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup")
        .click();
    await page
        .locator("li")
        .filter({
            has: page.locator("h4", { hasText: /^Espresso Macchiato\s*\$/ }),
        })
        .locator(".cup")
        .click();
    await expect(page.locator("a[href='/cart']")).toHaveText("cart (2)");
    await expect(page.locator("button.pay")).toHaveText("Total: $22.00");
});

test("Added drinks are shown on the cart page", async ({ page }) => {
    await page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup")
        .click();
    await page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Cappuccino\s*\$/ }) })
        .locator(".cup")
        .click();
    await page.locator("a[href='/cart']").click();
    await expect(
        page.locator(".list-item > div").filter({ hasText: /^Espresso$/ }),
    ).toBeVisible();
    await expect(
        page.locator(".list-item > div").filter({ hasText: /^Cappuccino$/ }),
    ).toBeVisible();
});

test("Promo proposal is visible", async ({ page }) => {
    await page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup")
        .click();
    await page
        .locator("li")
        .filter({
            has: page.locator("h4", { hasText: /^Espresso Macchiato\s*\$/ }),
        })
        .locator(".cup")
        .click();
    await page
        .locator("li")
        .filter({
            has: page.locator("h4", { hasText: /^Cappuccino\s*\$/ }),
        })
        .locator(".cup")
        .click();
    await expect(page.locator(".promo span")).toBeVisible();
    await expect(page.locator(".promo span")).toHaveText(
        "It's your lucky day! Get an extra cup of Mocha for $4.",
    );
});

test("Payment fields are editable", async ({ page }) => {
    await page.locator("button.pay").click();
    await page.locator("#name").fill("Serhii");
    await expect(page.locator("#name")).toHaveValue("Serhii");
    await page.locator("#email").fill("test@test.com");
    await expect(page.locator("#email")).toHaveValue("test@test.com");
});

test("Successful payment message is shown", async ({ page }) => {
    await page
        .locator("li")
        .filter({ has: page.locator("h4", { hasText: /^Espresso\s*\$/ }) })
        .locator(".cup")
        .click();
    await page.locator("button.pay").click();
    await page.locator("#name").fill("Serhii");
    await page.locator("#email").fill("test@test.com");
    await page.locator("#submit-payment").click();
    await expect(page.locator(".snackbar.success")).toBeVisible();
    await expect(page.locator(".snackbar.success")).toHaveText(
        "Thanks for your purchase. Please check your email for payment.",
    );
});
