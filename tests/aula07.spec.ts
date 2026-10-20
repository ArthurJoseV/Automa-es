import { test, expect, Page } from '@playwright/test';

test.describe("Moodle Aponti", () => {

    test("clicar no botão Acessar", async ({ page }) => {
        await page.goto("https://moodle.aponti.org.br/");
        await page.locator('.usermenu').getByRole("link", { name:"Acessar" }).click();
        await expect(page).toHaveURL(/login/);
    });
});

