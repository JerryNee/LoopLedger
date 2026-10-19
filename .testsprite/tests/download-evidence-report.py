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
            # This project currently tests one approved branch. VAR_{url} resolved
            # to the old production site despite the run's preview target metadata.
            target = "https://loopledger-s4-git-feat-season4-b35ea5-jerrys-projects-82705168.vercel.app"
            await page.goto(target)
            assert urlsplit(page.url).netloc == urlsplit(target).netloc
            pr_url = "https://github.com/TestSprite/testsprite-cli/pull/218"
            sha = "79054cff490203c7ae4b6bb3ca4f737734cabd9e"
            await page.get_by_role("textbox", name="Pull request URL").fill(pr_url)
            await page.get_by_role("button", name="Inspect PR", exact=True).click()
            await expect(page.get_by_label("Selected pull request").locator("code")).to_have_text(sha[:12])
            await page.get_by_role("tab", name="Report", exact=True).click()
            report = page.get_by_role("tabpanel", name="Report").locator("pre")
            for text in (pr_url, sha, "## Scope"):
                await expect(report).to_contain_text(text)
            expected_content = await report.inner_text()

            # Observe the browser download, not a filename rendered in the page.
            async with page.expect_download() as event:
                await page.get_by_role("link", name="Download evidence report", exact=True).click()
            download = await event.value
            assert download.suggested_filename == "PR-218-evidence.md"
            assert await download.failure() is None
            path = await download.path()
            assert path is not None
            content = Path(path).read_text(encoding="utf-8")
            assert content == expected_content
            for text in (pr_url, sha, "## Scope"):
                assert text in content
        finally:
            await context.close()
            await browser.close()


asyncio.run(run_test())
