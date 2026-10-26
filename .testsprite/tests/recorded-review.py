import asyncio
from pathlib import Path
from urllib.parse import urlsplit
from playwright.async_api import async_playwright, expect


async def run_test():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=True,
            args=["--window-size=1280,720", "--disable-dev-shm-usage", "--ipc=host", "--single-process"],
        )
        context = await browser.new_context(accept_downloads=True)
        context.set_default_timeout(35000)
        try:
            page = await context.new_page()
            target = "https://loopledger-s4-git-feat-season4-b35ea5-jerrys-projects-82705168.vercel.app"
            await page.goto(target)
            assert urlsplit(page.url).netloc == urlsplit(target).netloc
            await expect(page.get_by_label("Selected pull request", exact=True)).to_have_count(0)
            await page.get_by_role("button", name="Open recorded case", exact=True).press("Enter")
            await expect(page.get_by_label("Recorded case", exact=True)).to_contain_text("Not the current PR head")
            await expect(page.get_by_label("Case findings")).to_contain_text("7 passed / 1 blocked")
            diff = page.get_by_label("Changes since baseline", exact=True)
            await expect(diff).to_contain_text("babd5af9be69")
            await expect(diff).to_contain_text("213172ab23e4")
            await expect(diff.locator("li")).to_have_count(1)
            await expect(diff.locator("li")).to_contain_text("Recovered")
            await expect(diff.locator("li")).to_contain_text("TestSprite S4 strict suite")
            await expect(diff.get_by_role("link", name="Before", exact=True)).to_have_attribute(
                "href", "https://github.com/JerryNee/LoopLedger/actions/runs/40145334008/job/121025328126")
            await expect(diff.get_by_role("link", name="After", exact=True)).to_have_attribute(
                "href", "https://github.com/JerryNee/LoopLedger/actions/runs/40145526729/job/121025907592")
            await diff.get_by_role("checkbox").check()
            await expect(diff.locator("li")).to_have_count(5)
            await diff.get_by_role("checkbox").uncheck()
            await expect(diff.locator("li")).to_have_count(1)

            await page.get_by_role("tab", name="Report", exact=True).click()
            report = await page.get_by_role("tabpanel", name="Report", exact=True).inner_text()
            async with page.expect_download() as event:
                await page.get_by_role("link", name="Download evidence report", exact=True).click()
            download = await event.value
            assert download.suggested_filename == "PR-1-evidence.md"
            assert await download.failure() is None
            path = await download.path()
            assert path is not None
            content = Path(path).read_text(encoding="utf-8")
            assert content == report
            for text in ("Not the current PR head", "## Changes since baseline",
                         "babd5af9be6984dc764b14323ff5fc14410a21ef",
                         "213172ab23e4ed85a3aeb4e1c2aa9829bc98dc59", "Recovered:"):
                assert text in content

            await page.set_viewport_size({"width": 390, "height": 844})
            await page.get_by_role("tab", name="Checks (5)", exact=True).click()
            await expect(diff.get_by_role("combobox", name="Comparison baseline")).to_be_visible()
            assert await page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
            await page.get_by_role("button", name="Back to my workspace", exact=True).click()
            await expect(page.get_by_label("Selected pull request", exact=True)).to_have_count(0)
            await expect(page.get_by_role("textbox", name="Pull request URL")).to_have_value("")
            await page.reload()
            await expect(page.get_by_role("button", name="Open recorded case", exact=True)).to_be_visible()
            await expect(page.get_by_label("Selected pull request", exact=True)).to_have_count(0)
        finally:
            await context.close()
            await browser.close()


asyncio.run(run_test())
