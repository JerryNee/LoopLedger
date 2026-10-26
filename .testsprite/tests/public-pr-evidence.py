import asyncio
from urllib.parse import urlsplit
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
            target = "https://loopledger-s4-git-feat-season4-b35ea5-jerrys-projects-82705168.vercel.app"
            fixture = "https://github.com/TestSprite/testsprite-cli/pull/218"
            await page.goto(target)
            assert urlsplit(page.url).netloc == urlsplit(target).netloc
            await page.get_by_role("textbox", name="Pull request URL").fill(fixture)
            await page.get_by_role("button", name="Inspect PR", exact=True).click()
            overview = page.get_by_label("Selected pull request", exact=True)
            await expect(overview.get_by_role("link").first).to_have_attribute("href", fixture)
            await expect(overview.get_by_role("heading")).to_have_text(
                "fix(dry-run): include failed run-scoped step sample"
            )
            await expect(overview.locator("code")).to_have_text("79054cff4902")
            checks = page.get_by_role("tabpanel").get_by_role("article")
            await expect(checks.first).to_be_visible()
            assert await checks.count() > 0
            await expect(page.get_by_text("No TestSprite check", exact=True)).to_be_visible()
            await page.get_by_role("tab", name="Report", exact=True).click()
            report = page.get_by_role("tabpanel", name="Report", exact=True)
            await expect(report).to_contain_text(fixture)
            await expect(report).to_contain_text("79054cff490203c7ae4b6bb3ca4f737734cabd9e")
        finally:
            await context.close()
            await browser.close()


asyncio.run(run_test())
