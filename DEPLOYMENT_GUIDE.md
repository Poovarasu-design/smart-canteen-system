# 🚀 Permanent Free Internet Deployment Guide for Smart Canteen

This guide explains how to get a **permanent 24/7 working public URL** on the internet (e.g. `https://smart-canteen-system.onrender.com`) for free, so anyone (evaluators, professors, students) can open the website from anywhere on any phone or laptop!

---

## 🌟 Method 1: Deploy Free to Render.com (Recommended - 100% Free & Permanent)

Render gives you a permanent 24/7 live HTTPS URL with free hosting.

### Step 1: Push Code to your GitHub
1. Open [github.com](https://github.com) and log in.
2. Click the **`+`** icon in top right -> **New repository**.
3. Name it: `smart-canteen-system`
4. Leave it as **Public** and do NOT check "Initialize with README". Click **Create repository**.
5. Copy your repository URL (e.g. `https://github.com/your-username/smart-canteen-system.git`).
6. Open PowerShell or Command Prompt in `d:\project` and run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/smart-canteen-system.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy on Render in 2 Minutes
1. Go to [render.com](https://render.com) and sign up/log in (you can sign in with GitHub).
2. Click **"New +"** (blue button in top right) -> Select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** -> Click **Next**.
4. Select your **`smart-canteen-system`** repository.
5. Fill in these simple fields:
   - **Name**: `smart-canteen-system` (or any custom name)
   - **Region**: Singapore or Frankfurt (or closest to you)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm run install:all && npm --prefix client run build
     ```
   - **Start Command**:
     ```bash
     npm --prefix server run start
     ```
   - **Instance Type**: Select **Free ($0/month)**.
6. Click **"Deploy Web Service"** at the bottom.

Render will build both the React frontend and Express backend. Within 2-3 minutes, you will get your permanent live URL:
👉 **`https://smart-canteen-system.onrender.com`**

---

## ⚡ Method 2: Instant 10-Second Live Public URL (Localtunnel)

If you need a live internet link **right now** to show someone immediately from your computer:

1. Open PowerShell or Terminal in `d:\project`.
2. Ensure the server is running on port 5000:
   ```bash
   cd server && npm start
   ```
3. Open a second PowerShell window and run:
   ```bash
   npx localtunnel --port 5000
   ```
4. It will print a live public URL such as:
   `https://bright-canteen-demo.loca.lt`
5. Anyone on the internet can open this URL! (If prompted for a password on first visit, visit [loca.lt/mytunnelpassword](https://loca.lt/mytunnelpassword) to view your tunnel IP).

---

## 📱 Method 3: Instant Phone Access on Same College / Home Wi-Fi

Anyone connected to the same Wi-Fi network (friends, evaluators in the same room) can open the app on their phone directly without any internet deployment:

1. Make sure your server is running (`d:\project\start.bat`).
2. Open mobile browser and enter:
   👉 **`http://10.239.146.183:5000`** (or `http://10.239.146.183:5173`)
3. The full app will load instantly on the phone!

---

## 🗄️ Optional: Connect MongoDB Atlas (Cloud Database)

By default, the app runs with an embedded **High-Reliability Persistent Storage Adapter**, meaning it works 100% out of the box even without MongoDB.

If you want a dedicated cloud MongoDB database:
1. Create a free cluster on [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Get your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_canteen`.
3. In Render -> Service Settings -> Environment Variables, add:
   - Key: `MONGODB_URI`
   - Value: `your_mongodb_connection_string`
