import { test, expect, Page } from '@playwright/test';
import path from 'path';

async function login(page: Page, email: string, password: string) {
    await page.goto("https://locatorlab-testes.vercel.app/login");

    await page.getByTestId('login-email-input').fill(email);
    await page.getByTestId('login-password-input').fill(password);
    await page.getByTestId('login-submit-button').click();
    // toHaveURL confirma que o login redirecionou para o dashboard.
    await expect(page).toHaveURL(/.*dashboard.*/);
}

test.describe("Login com credenciais no LocatorLab", () => {
    test("login com credenciais válidas", async ({ page }) => {
        await page.goto("https://locatorlab-testes.vercel.app/login");

        await page.getByTestId('login-email-input').fill('ajvdf@discente.ifpe.edu.br');
        await page.getByTestId('login-password-input').fill('Arthur@123');

        await page.getByTestId('login-submit-button').click();
        // URL exata confirma que a navegacao chegou a rota esperada.
        await expect(page).toHaveURL("https://locatorlab-testes.vercel.app/dashboard");
        // Verifica que o conteúdo do dashboard foi carregado
        // O titulo confirma que a pagina carregada e o dashboard.
        await expect(page).toHaveTitle(/Dashboard/i);
        // Confirma que o formulário de login não está mais visível
        // not.toBeVisible confirma que o formulario saiu da tela apos o login.
        await expect(page.getByTestId('login-email-input')).not.toBeVisible();
        await page.screenshot({ path: 'evidencias/login-sucesso.png' });
    });
});

test.describe("Tarefas", () => {
    test("criar nova tarefa", async ({ page }) => {
        await login(page, 'ajvdf@discente.ifpe.edu.br', 'Arthur@123');
        await page.goto("https://locatorlab-testes.vercel.app/tasks");

        await page.getByRole('button', { name: 'Nova tarefa' }).click();
        await page.getByTestId("task-title-input").fill("tarefaTeste");
        await page.getByTestId("task-description-input").fill("descricao da tarefa");
        await page.getByTestId("task-due-date-input").fill("2025-12-07");
        await page.getByRole('button', { name: 'Criar tarefa' }).click();
        // toBeVisible confirma que a nova tarefa foi exibida.
        await expect(page.getByText("tarefaTeste").first()).toBeVisible();
        // Valida que a descrição da tarefa foi salva e exibida
        // Verifica a descricao exibida para confirmar que foi salva junto a tarefa.
        await expect(page.getByText("descricao da tarefa").first()).toBeVisible();
        // Confirma que a data de vencimento foi persistida corretamente
        // Confirma pela data formatada que o vencimento aparece corretamente.
        await expect(page.getByText("07/12/2025").first()).toBeVisible();
        await page.screenshot({ path: 'evidencias/tarefa-criada-sucesso.png' });
    });
});

test.describe("Upload de arquivo", () => {
    test("fazer upload de arquivo com sucesso", async ({ page }) => {
        await login(page, 'ajvdf@discente.ifpe.edu.br', 'Arthur@123');
        await page.goto("https://locatorlab-testes.vercel.app/challenges/locators/file-upload");
        const caminhoArquivo = path.join(__dirname, '../arquivo_teste.txt');

        await page.locator('input[type="file"]').first().setInputFiles(caminhoArquivo);
        await page.getByRole('button', { name: 'Enviar' }).click();
        // Verifica o nome exibido para confirmar que o arquivo foi enviado.
        await expect(page.getByText('arquivo_teste.txt').first()).toBeVisible();
        await page.screenshot({ path: 'evidencias/upload-arquivo-sucesso.png' });
    });
});

