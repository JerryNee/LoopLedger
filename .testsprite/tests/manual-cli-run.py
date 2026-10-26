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
            await page.get_by_role("button", name="CLI runs").click()
            form = page.locator("form").filter(has=page.get_by_role("heading", name="CLI run", exact=True))
            await form.get_by_role("textbox", name="Label", exact=True).fill("S4 QA local run")
            await form.get_by_role("textbox", name="Command", exact=True).fill("echo s4-test-only")
            await form.get_by_role("combobox", name="Status", exact=True).select_option("queued")
            await form.get_by_role("spinbutton", name="Credits", exact=True).fill("0")
            note = "Test-only local record, not an actual TestSprite run"
            await form.get_by_role("textbox", name="Notes", exact=True).fill(note)
            await form.get_by_role("button", name="Add run", exact=True).click()
            row = page.get_by_label("Recorded CLI runs").locator("article").filter(has_text="S4 QA local run")
            await expect(row).to_have_count(1)
            for text in ("S4 QA local run", "echo s4-test-only", "queued"):
                await expect(row).to_contain_text(text)
            await page.get_by_role("button", name=re.compile(r"^LOOP\.md")).click()
            report = page.get_by_label("LOOP.md preview").locator("pre")
            for text in ("S4 QA local run", "echo s4-test-only", "- Status: queued", "- Credits: 0", note):
                await expect(report).to_contain_text(text)
        finally:
            await context.close()
            await browser.close()


asyncio.run(run_test())
