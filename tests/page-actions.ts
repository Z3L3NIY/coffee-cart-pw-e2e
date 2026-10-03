import { Page } from "@playwright/test";

export async function openPaymentForm(page: Page): Promise<void> {
    const checkoutBT = page.getByLabel("Proceed to checkout", { exact: true });
    await checkoutBT.click();
}

export async function submitPaymentForm(page: Page): Promise<void> {
    const submitBT = page.getByRole("button", { name: "Submit" });
    await submitBT.click();
}

export async function fillPaymentForm(
    page: Page,
    name: string,
    email: string,
): Promise<void> {
    const nameField = page.getByRole("textbox", { name: "Name" });
    const emailField = page.getByRole("textbox", { name: "Email" });

    await nameField.fill(name);
    await emailField.fill(email);
}
