import type { PlasmoCSConfig } from "plasmo"

import { convertHtmlToMarkdown } from "~utils/parseToMarkdown"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false
}

const scrollAndWaitForContent = async (): Promise<void> => {
  return new Promise((resolve) => {
    let lastHeight = document.body.scrollHeight
    let unchangedCount = 0

    const checkScroll = setInterval(() => {
      // Scroll to bottom
      window.scrollTo(0, document.body.scrollHeight)

      // Check if height changed
      const newHeight = document.body.scrollHeight

      if (newHeight === lastHeight) {
        unchangedCount++
        // If height hasn't changed for 3 checks, we're done
        if (unchangedCount >= 3) {
          clearInterval(checkScroll)
          setTimeout(resolve, 500) // Final wait for images/content
        }
      } else {
        unchangedCount = 0
        lastHeight = newHeight
      }

      // Safety timeout after 30 seconds
      if (unchangedCount > 100) {
        clearInterval(checkScroll)
        resolve()
      }
    }, 300)
  })
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Content script received message:", msg)

  if (msg.type === "SCRAPE_PAGE") {
    const scrape = async () => {
      try {
        console.log("🔄 Starting to scroll and load all content...")

        const originalScrollPos = window.scrollY

        await scrollAndWaitForContent()

        console.log("✅ All content loaded, collecting...")

        const html = document.documentElement.outerHTML
        const bodyText = document.body.innerText || document.body.textContent
        const parsedMarkdown = convertHtmlToMarkdown(bodyText)

        // Restore scroll position
        window.scrollTo(0, originalScrollPos)

        const response = {
          success: true,
          rawContent: bodyText,
          html: html,
          parsedMarkdown: parsedMarkdown
        }

        console.log("✅ Content collected:", {
          contentLength: response.rawContent?.length,
          htmlLength: response.html?.length
        })

        sendResponse(response)
      } catch (error) {
        console.error("❌ Scraping error:", error)
        sendResponse({
          success: false,
          error: error.message
        })
      }
    }

    scrape()
    return true
  }
})

console.log("Content script loaded!")
