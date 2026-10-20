import { test, expect, Page } from '@playwright/test';
import path from 'path';

async function login(page: Page, email: string, password: string) {
    await page.goto("https://locatorlab-testes.vercel.app/login");

    // Cobertura: Fill
    await page.getByTestId('login-email-input').fill(email);

    // Cobertura: Fill
    await page.getByTestId('login-password-input').fill(password);

    // Cobertura: Submit
    await page.getByTestId('login-submit-button').click();

    // Cobertura: Evidenciar execução bem-sucedida
    await expect(page).toHaveURL(/.*dashboard.*/);
}

test.describe("Login com credenciais no LocatorLab", () => {
    test("login com credenciais válidas", async ({ page }) => {
        await page.goto("https://locatorlab-testes.vercel.app/login");

        // Cobertura: Fill
        await page.getByTestId('login-email-input').fill('ajvdf@discente.ifpe.edu.br');

        // Cobertura: Fill
        await page.getByTestId('login-password-input').fill('Arthur@123');

        // Cobertura: Submit
        await page.getByTestId('login-submit-button').click();

        // Cobertura: Evidenciar execução bem-sucedida
        await expect(page).toHaveURL("https://locatorlab-testes.vercel.app/dashboard");
        await page.screenshot({ path: 'evidencias/login-sucesso.png' });
    });
});

test.describe("Tarefas", () => {
    test("criar nova tarefa", async ({ page }) => {
        await login(page, 'ajvdf@discente.ifpe.edu.br', 'Arthur@123');
        await page.goto("https://locatorlab-testes.vercel.app/tasks");

        // Cobertura: Click
        await page.getByRole('button', { name: 'Nova tarefa' }).click();

        // Cobertura: Fill
        await page.getByTestId("task-title-input").fill("tarefaTeste");

        // Cobertura: Fill
        await page.getByTestId("task-description-input").fill("descricao da tarefa");

        // Cobertura: Fill
        await page.getByTestId("task-due-date-input").fill("2025-12-07");

        // Cobertura: Submit
        await page.getByRole('button', { name: 'Criar tarefa' }).click();

        // Cobertura: Evidenciar execução bem-sucedida
        await expect(page.getByText("tarefaTeste").first()).toBeVisible();
        await page.screenshot({ path: 'evidencias/tarefa-criada-sucesso.png' });
    });
});

test.describe("Upload de arquivo", () => {
    test("fazer upload de arquivo com sucesso", async ({ page }) => {
        await login(page, 'ajvdf@discente.ifpe.edu.br', 'Arthur@123');
        await page.goto("https://locatorlab-testes.vercel.app/challenges/locators/file-upload");
        const caminhoArquivo = path.join(__dirname, '../arquivo_teste.txt');

        // Cobertura: Upload
        await page.locator('input[type="file"]').first().setInputFiles(caminhoArquivo);

        // Cobertura: Click
        await page.getByRole('button', { name: 'Enviar' }).click();

        // Cobertura: Evidenciar execução bem-sucedida
        await expect(page.getByText('arquivo_teste.txt').first()).toBeVisible();
        await page.screenshot({ path: 'evidencias/upload-arquivo-sucesso.png' });
    });
});

