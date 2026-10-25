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
            await page.goto(target)
            assert urlsplit(page.url).netloc == urlsplit(target).netloc
            pr_url = "https://github.com/TestSprite/testsprite-cli/pull/218"
            sha = "79054cff490203c7ae4b6bb3ca4f737734cabd9e"
            field = page.get_by_role("textbox", name="Pull request URL")
            await field.fill(pr_url)
            await page.get_by_role("button", name="Inspect PR", exact=True).click()
            overview = page.get_by_label("Selected pull request")
            await expect(overview.locator("code")).to_have_text(sha[:12])
            await expect(page.get_by_role("tab", name="History (1)", exact=True)).to_be_visible()
            await page.get_by_role("button", name="Refresh evidence", exact=True).click()
            history = page.get_by_role("tab", name="History (2)", exact=True)
            await expect(history).to_be_visible()
            saved_overview = await overview.inner_text()
            await history.click()
            await expect(page.get_by_role("tabpanel").get_by_role("listitem")).to_have_count(2)
            saved_history = await page.get_by_role("tabpanel").inner_text()
            await page.get_by_role("tab", name="Report", exact=True).click()
            report = page.get_by_role("tabpanel").locator("pre")
            for text in (pr_url, sha, "## Checks on this commit", "## Scope"):
                await expect(report).to_contain_text(text)
            saved_report = await report.inner_text()

            await page.reload()
            await expect(field).to_have_value(pr_url)
            await expect(overview).to_have_text(saved_overview, use_inner_text=True)
            await expect(history).to_be_visible()
            await history.click()
            await expect(page.get_by_role("tabpanel").get_by_role("listitem")).to_have_count(2)
            await expect(page.get_by_role("tabpanel")).to_have_text(saved_history, use_inner_text=True)
            await page.get_by_role("tab", name="Report", exact=True).click()
            await expect(report).to_have_text(saved_report, use_inner_text=True)
        finally:
            await context.close()
            await browser.close()


asyncio.run(run_test())
