import axios from "axios"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { ADD_DOCS_API_ENDPOINT } from "~utils/constants"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const response = await axios.post(ADD_DOCS_API_ENDPOINT, req.body)
    res.send({ success: true, data: response.data })
  } catch (error) {
    console.error("Upload error:", error)
    res.send({ success: false, error: error.message })
  }
}

export default handler
