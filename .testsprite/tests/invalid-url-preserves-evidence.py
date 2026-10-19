import asyncio
from playwright.async_api import async_playwright, expect


async def run_test():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=True,
            args=["--window-size=1280,720", "--disable-dev-shm-usage", "--ipc=host", "--single-process"],
        )
        context = await browser.new_context()
        context.set_default_timeout(35000)
        try:
            page = await context.new_page()
            await page.goto("VAR_{url}")
            field = page.get_by_role("textbox", name="Pull request URL")
            await field.fill("https://github.com/TestSprite/testsprite-cli/pull/218")
            await page.get_by_role("button", name="Inspect PR", exact=True).click()

            overview = page.get_by_label("Selected pull request")
            await expect(overview.get_by_role("heading")).to_have_text(
                "fix(dry-run): include failed run-scoped step sample"
            )
            await expect(overview.locator("code")).to_have_text("79054cff4902")
            before = await overview.inner_text()
            assert "Snapshot:" in before
            await expect(page.get_by_role("tab", name="History (1)", exact=True)).to_be_visible()

            await field.fill("https://example.com/nope")
            await page.get_by_role("button", name="Inspect PR", exact=True).click()
            await expect(page.get_by_role("alert")).to_have_text(
                "Use https://github.com/owner/repository/pull/123."
            )
            # All selected-PR content, including its timestamp, must be unchanged.
            await expect(overview).to_have_text(before, use_inner_text=True)
            await expect(page.get_by_role("tab", name="History (1)", exact=True)).to_be_visible()
        finally:
            await context.close()
            await browser.close()


asyncio.run(run_test())
