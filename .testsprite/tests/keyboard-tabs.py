import asyncio
import re
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
            await page.goto(target)
            assert urlsplit(page.url).netloc == urlsplit(target).netloc
            await page.get_by_role("textbox", name="Pull request URL").fill(
                "https://github.com/TestSprite/testsprite-cli/pull/218"
            )
            await page.get_by_role("button", name="Inspect PR", exact=True).click()
            await expect(page.get_by_label("Selected pull request").locator("code")).to_have_text("79054cff4902")
            tabs = page.get_by_role("tablist", name="Evidence views")
            current = tabs.get_by_role("tab", name=re.compile(r"^Checks \("))
            await current.focus()
            for key, destination in (
                ("ArrowRight", "history"),
                ("ArrowLeft", "checks"),
                ("End", "report"),
                ("Home", "checks"),
            ):
                await current.press(key)
                current = page.locator(f"#tab-{destination}")
                await expect(current).to_have_attribute("aria-selected", "true")
                await expect(current).to_have_attribute("tabindex", "0")
                await expect(current).to_be_focused()
                await expect(tabs.locator('[aria-selected="true"]')).to_have_count(1)
                await expect(page.get_by_role("tabpanel")).to_have_count(1)
                await expect(page.locator(f"#panel-{destination}")).to_be_visible()
        finally:
            await context.close()
            await browser.close()


asyncio.run(run_test())
