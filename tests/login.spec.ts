import { test, expect, Page } from '@playwright/test';

async function login(page: Page, username: string, password: string) {
     await page.goto("https://www.saucedemo.com/");
     await page.getByPlaceholder('Username').fill(username);
     await page.getByPlaceholder('Password').fill(password);
     await page.getByRole('button', { name: 'Login' }).click();
     

}

test("Login com credenciais válidas", async ({ page }) => {
     await page.goto("https://www.saucedemo.com/");

})

test("login com credenciais invalidas", async ({ page }) => {
     await page.goto("https://www.saucedemo.com/");
})

test.describe("login", () => {
     test("login com credenciais válidas", async ({ page }) => {
          await login(page, 'standard_user', 'secret_sauce');

     });

     test("login com credenciais invalidas", async ({ page }) => {
          await page.goto("https://www.saucedemo.com/");
     });
}); 

test.describe("products", async () => {
     test.beforeEach(async ({ page }) => {
          await login(page, 'standard_user', 'secret_sauce');
     })
     test("verificar se o usuario está logado", async ({ page }) => {
          await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
     })
})


