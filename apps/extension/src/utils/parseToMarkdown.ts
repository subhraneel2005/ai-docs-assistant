import TurndownService from "turndown"

function convertHtmlToMarkdown(html: string) {
  var turndownService = new TurndownService()
  var markdown = turndownService.turndown(html)

  return markdown
}

export { convertHtmlToMarkdown }
