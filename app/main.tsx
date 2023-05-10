import React from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import "./i18n"
import { BrowserRouter } from "react-router-dom"

import App from "./app"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
