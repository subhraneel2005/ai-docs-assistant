import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useSession
} from "@clerk/chrome-extension"
import { useState } from "react"

import "~style.css"

const PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Please add the PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file"
  )
}

function PopupContent() {
  const { session } = useSession()

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
    <div className="w-[400px] h-[500px] bg-slate-50 flex flex-col text-slate-900">
      {/* --- Header --- */}
      <header className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-8 h-8 bg-[#7f22fe] rounded-lg flex items-center justify-center text-white">
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
        <div>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* --- Main Content --- */}
      {!session ? (
        <>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Sign in to Capture Pages
            </h2>
            <p className="text-slate-500 text-sm max-w-[260px]">
              You need to be signed in to sync documents to your dashboard.
            </p>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-[#7f22fe] text-white rounded-lg shadow">
                Sign In
              </button>
            </SignInButton>
          </div>
        </>
      ) : (
        <>
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
                <h2 className="text-lg font-semibold text-slate-800">
                  Success!
                </h2>
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
                  <div className="absolute -right-3 top-8 bg-indigo-100 text-[#7f22fe] rounded-full p-1 border-2 border-white">
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
                  Convert this documentation page into clean Markdown and sync
                  it to your AI assistant.
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
                  ? "bg-[#7f22fe]/60 cursor-not-allowed"
                  : "bg-[#7f22fe] hover:bg-[#7f22fe]/90 hover:shadow-lg active:scale-[0.98]"
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
              <a href="#" className="hover:bg-[#7f22fe]">
                Help & Support
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function IndexPopup() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <PopupContent />
    </ClerkProvider>
  )
}

export default IndexPopup
