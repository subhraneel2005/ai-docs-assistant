import { useState } from "react"

import "~style.css"

function IndexPopup() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const handleCapture = async () => {
    setStatus("loading")

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })

      if (!tab.id) {
        console.error("No active tab found")
        setStatus("error")
        return
      }

      console.log("Sending message to tab:", tab.id)

      chrome.tabs.sendMessage(tab.id, { type: "SCRAPE_PAGE" }, (res) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError.message)
          setStatus("error")
          return
        }

        console.log("Scraper returned:", res)
        setStatus("success")
      })
    } catch (error) {
      console.error("Capture error:", error)
      setStatus("error")
    }
  }

  return (
    <div className="w-[350px] h-[480px] bg-slate-50 flex flex-col text-slate-900">
      {/* --- Header --- */}
      <header className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="M8 15l4 4 4-4" />
            </svg>
          </div>
          <h1 className="font-bold text-base tracking-[-1.2px] text-slate-800">
            AI Docs Assistant
          </h1>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 p-5 flex flex-col justify-center items-center text-center">
        {status === "success" ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Success!</h2>
            <p className="text-slate-500 text-sm mt-1">
              Page captured and sent to your dashboard.
            </p>
          </div>
        ) : (
          <>
            <div className="relative mb-6">
              {/* Visual Illustration */}
              <div className="w-20 h-24 border-2 border-slate-200 bg-white rounded-lg shadow-sm flex flex-col p-2">
                <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
                <div className="w-2/3 h-2 bg-slate-200 rounded mb-2"></div>
                <div className="w-full h-2 bg-slate-100 rounded mb-1"></div>
                <div className="w-full h-2 bg-slate-100 rounded mb-1"></div>
                <div className="w-full h-2 bg-slate-100 rounded"></div>
              </div>
              {/* Arrow Badge */}
              <div className="absolute -right-3 top-8 bg-indigo-100 text-indigo-600 rounded-full p-1 border-2 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M7 7l5 5 5-5" />
                  <path d="M12 12v12" />
                </svg>
              </div>
            </div>

            <h2 className="text-lg tracking-[-1.3px] font-semibold text-slate-800">
              Ready to Capture
            </h2>
            <p className="text-slate-500 text-sm mt-2 px-2">
              Convert this documentation page into clean Markdown and sync it to
              your AI assistant.
            </p>
          </>
        )}
      </main>

      {/* --- Actions --- */}
      <div className="p-5 bg-white border-t border-slate-200">
        {status === "success" ? (
          <a
            href="https://your-dashboard-url.com"
            target="_blank"
            className="flex items-center justify-center w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all border border-slate-200"
            rel="noreferrer">
            Open Dashboard
            <svg
              className="ml-2"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : (
          <button
            onClick={handleCapture}
            disabled={status === "loading"}
            className={`
              flex items-center justify-center w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition-all
              ${
                status === "loading"
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
              }
            `}>
            {status === "loading" ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Capture Page"
            )}
          </button>
        )}

        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <span>v1.0.0</span>
          <a href="#" className="hover:text-indigo-600">
            Help & Support
          </a>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
