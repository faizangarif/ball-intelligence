import { test, expect } from '@playwright/test';

test.describe('Ball IQ Smoke Tests', () => {
  test('homepage loads with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=BALL')).toBeVisible();
    await expect(page.locator('text=GAIN BALL KNOWLEDGE')).toBeVisible();
  });

  test('homepage shows live games strip', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Live Now').or(page.locator('text=No Live Games'))).toBeVisible();
  });

  test('NBA page loads', async ({ page }) => {
    await page.goto('/nba');
    await expect(page.locator('h1, h2').filter({ hasText: /NBA/i })).toBeVisible();
  });

  test('NFL page loads', async ({ page }) => {
    await page.goto('/nfl');
    await expect(page.locator('h1, h2').filter({ hasText: /NFL/i })).toBeVisible();
  });

  test('Celtics page loads', async ({ page }) => {
    await page.goto('/teams/nba/boston-celtics');
    await expect(page.locator('text=Boston Celtics').first()).toBeVisible();
  });

  test('Eagles page loads', async ({ page }) => {
    await page.goto('/teams/nfl/philadelphia-eagles');
    await expect(page.locator('text=Philadelphia Eagles').first()).toBeVisible();
  });

  test('Live Game Center loads', async ({ page }) => {
    await page.goto('/live');
    await expect(page.locator('text=LIVE GAME CENTER').or(page.locator('text=Live Game Center'))).toBeVisible();
  });

  test('player page loads for Jayson Tatum', async ({ page }) => {
    await page.goto('/players/jayson-tatum');
    await expect(page.locator('text=Jayson Tatum').first()).toBeVisible();
    await expect(page.locator('text=Season Stats').or(page.locator('text=PTS'))).toBeVisible();
  });

  test('Shot IQ page renders court', async ({ page }) => {
    await page.goto('/shot-iq');
    await expect(page.locator('text=SHOT IQ').first()).toBeVisible();
    await expect(page.locator('svg')).toBeVisible();
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('text=Blog').first()).toBeVisible();
  });

  test('stats page loads', async ({ page }) => {
    await page.goto('/stats');
    await expect(page.locator('text=STATS').or(page.locator('text=Stats'))).toBeVisible();
  });

  test('discover page loads with search', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('favorites page loads', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.locator('text=FAVORITES').or(page.locator('text=Favorites'))).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('text=Ayaan Arif').first()).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    // Click NBA link in header
    await page.click('header a[href="/nba"]');
    await expect(page).toHaveURL('/nba');
  });

  test('search finds Celtics', async ({ page }) => {
    await page.goto('/discover');
    await page.fill('input[type="text"]', 'Celtics');
    await expect(page.locator('text=Boston Celtics').first()).toBeVisible({ timeout: 5000 });
  });

  test('favorites persist in guest mode', async ({ page }) => {
    await page.goto('/favorites');
    // localStorage-based favorites should show empty state initially
    await expect(
      page.locator('text=No favorite').first().or(page.locator('text=no favorites').first())
    ).toBeVisible();
  });
});
