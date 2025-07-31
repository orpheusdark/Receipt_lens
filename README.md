
# Receipt Lens 🧾✨ – An AI-Powered Expense Tracker

Welcome to **Receipt Lens**!  
This project is a powerful, AI-driven web application that lets you scan receipts with your camera, automatically extract all the details, and save them into a structured **Google Sheet**. It's a fully-featured expense tracker built to be modern, easy to use, and completely free to run.

<!-- Replace with a real screenshot URL -->

---

## My Journey 🚀

This project has been a fantastic learning experience, full of twists, turns, and pivots.

### The Initial Dream: A Serverless AI Agent ☁️

My original ambition was to build an AI agent in the cloud. A mobile app would upload receipt images to **Google Cloud Storage**, triggering a **Cloud Function** or **Cloud Run** service. This backend would process the image using **Gemini AI**, extract data, and save it to **Google Sheets**. A perfect server-side architecture.

### The "Billing Wall" 🧱

Despite completing the architecture and code, I hit a major hurdle — **Google Cloud required billing to be enabled**, even within the free tier. My goal was zero-cost deployment without sharing payment details, so I had to rethink everything.

### The Pivot: Thinking Inside the Browser 💡

Instead of giving up, I pivoted.  
**"What if I eliminate the backend entirely?"**  
This led me to a 100% client-side solution. The browser itself would handle everything — image capture, AI communication, and data storage — directly via JavaScript.

### The Final Product: Receipt Lens 📱

After rounds of coding, debugging, and UI tuning, **Receipt Lens** was born — a **single HTML file** app you can host for free (e.g., GitHub Pages). It’s a testament to the power of modern web browsers.

---

## How It Works ⚙️

This app combines several cutting-edge web technologies:

### 🖼️ Frontend Magic (HTML + Tailwind CSS)

Built entirely with HTML and styled using **Tailwind CSS** for a sleek, responsive UI — no separate CSS files needed.

### 📸 Camera Access

Using `navigator.mediaDevices.getUserMedia` API to securely access your device's camera to scan receipts.

### 🧠 The AI Brain (Gemini AI)

Captured images are converted into **Base64 strings** and sent to the **Gemini 1.5 Flash model** via REST API. A well-engineered prompt returns structured **JSON** data from the receipt.

### 📊 Data Storage (Google Sheets)

The structured data is appended directly to a Google Sheet via the **Sheets API**, enabling real-time expense logging.

### 🤖 Automation (Google Apps Script)

A small **Apps Script** runs on every update. It merges related cells (vendor, date, totals) into a clean, readable format.

---

## Setup Guide: Get It Running in 15 Minutes 🛠️

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Click the project dropdown → **"New Project"**.
3. Name your project (e.g., "My Receipt Scanner") → **Create**.

### Step 2: Enable Required APIs

- **[Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com)**  
- **[Generative Language API (Gemini)](https://aistudio.google.com/app/apis)**

Click **Enable** for each.

### Step 3: Create Credentials

#### 🔑 Gemini API Key

- Go to [Google AI Studio](https://makersuite.google.com/).
- Click **"Create API key in new project"**.
- Copy and save it.

#### 🪪 OAuth 2.0 Client ID

1. Visit [Google Cloud Credentials page](https://console.cloud.google.com/apis/credentials).
2. Click **+ CREATE CREDENTIALS → OAuth client ID**.
3. Select **"Web application"** and name it.
4. Under **Authorized JavaScript origins**, add:
   - `http://localhost:8000` for local use.
   - Your live site URL if deploying (e.g., `https://your-username.github.io`).
5. Click **Create**, and save the **Client ID**.

#### 🧾 OAuth Consent Screen

1. Go to **OAuth consent screen** in Cloud Console.
2. Choose **External → Create**.
3. Fill required fields (App name, support email, etc.).
4. Click **Save and Continue** through all sections.
5. Under **Test users**, add your testing Google account.

### Step 4: Set Up Google Sheet

1. Create a new Google Sheet.
2. Rename the first tab to: `Receipt`
3. Add these exact headers to Row 1:
   ```
   Photo Timestamp, Transaction ID, Vendor, Transaction Date, Transaction Time, Payment Type, Item Description, Quantity, Unit Price, Subtotal, Tax, Grand Total
   ```
4. Copy the **Spreadsheet ID** from the URL and save it.

### Step 5: Add Auto-Merging Script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete any code in `Code.gs`.
3. Paste code from the `apps-script.js` file in this repo.
4. Save the project.

### Step 6: Configure and Run the Web App

1. Download the `index.html` file from this repo.
2. Open in a text editor.
3. Inside the `<script>` tag, set:
   ```js
   const CLIENT_ID = "YOUR_CLIENT_ID";
   const GEMINI_API_KEY = "YOUR_API_KEY";
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
   ```
4. Save the file.
5. To run locally:
   ```bash
   python -m http.server 8000
   ```
6. Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## ✅ All Set!

You now have a **serverless, AI-powered, privacy-respecting expense tracker** — all in your browser, running for free.

---
