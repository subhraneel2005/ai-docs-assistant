import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import { getMetadata } from "~utils/getMetadata"
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
      window.scrollTo(0, document.body.scrollHeight)
      const newHeight = document.body.scrollHeight

      if (newHeight === lastHeight) {
        unchangedCount++
        if (unchangedCount >= 3) {
          clearInterval(checkScroll)
          setTimeout(resolve, 500)
        }
      } else {
        unchangedCount = 0
        lastHeight = newHeight
      }

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

        window.scrollTo(0, originalScrollPos)

        const metadata = getMetadata()

        const payload = {
          rawContent: bodyText,
          html: html,
          parsedMarkdown: parsedMarkdown,
          metadata: metadata
        }

        // Send to background using Plasmo messaging
        const uploadResponse = await sendToBackground({
          name: "uploadDoc",
          body: payload
        })

        console.log("✅ Upload response:", uploadResponse)

        sendResponse({
          success: true,
          uploadResult: uploadResponse
        })
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
