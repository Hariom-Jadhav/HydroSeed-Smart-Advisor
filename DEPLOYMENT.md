# HydroSeed Smart Advisor - Cloud Deployment Guide

This guide details the step-by-step instructions for deploying your web application in a production environment:
1. **Express Server (Backend)** on **Render**
2. **React/Vite Client (Frontend)** on **Vercel**

---

## Part 1: Deploying the Backend on Render

Render is an ideal cloud hosting platform for Node.js backend services.

### Step 1.1: Push Your Code to GitHub
Ensure all your local changes are committed and pushed to a remote GitHub repository.

### Step 1.2: Create a Render Web Service
1. Log into your account at [Render](https://render.com/).
2. Click **New** in the dashboard and select **Web Service**.
3. Connect your GitHub account and select your **Hydroseeding** repository.

### Step 1.3: Configure Service Details
Set the following parameters during creation:
* **Name**: `hydroseed-smart-advisor-api`
* **Environment**: `Node`
* **Region**: Select the closest region to your users.
* **Branch**: `main` (or your active development branch)
* **Root Directory**: `server`
* **Build Command**: `npm install`
* **Start Command**: `npm start`

### Step 1.4: Add Environment Variables
Under the **Environment** tab on Render, add the following variables:
* `NODE_ENV` = `production`
* `PORT` = `10000`
* `MONGO_URI` = `YOUR_MONGODB_ATLAS_CONNECTION_URI` (from Atlas console)
* `JWT_SECRET` = `YOUR_SECURE_JWT_SECRET_KEY`
* `JWT_EXPIRES_IN` = `90d`

### Step 1.5: Deploy
Click **Create Web Service**. Wait for the build logs to show success. Once finished, Render will provide you with a public URL:
> **Example**: `https://hydroseed-smart-advisor-api.onrender.com`
> **Copy this URL; you will need it in Part 2.**

---

## Part 2: Deploying the Frontend on Vercel

Vercel is the premier platform for hosting React applications built with Vite.

### Step 2.1: Create a Vercel Project
1. Log into your account at [Vercel](https://vercel.com/).
2. Click **Add New** and select **Project**.
3. Import your **Hydroseeding** repository.

### Step 2.2: Configure Project Settings
Adjust the Vercel deployment parameters as follows:
* **Project Name**: `hydroseed-smart-advisor`
* **Framework Preset**: `Vite`
* **Root Directory**: `client`
* **Build and Output Settings**:
  * **Build Command**: `npm run build`
  * **Output Directory**: `dist`
  * **Install Command**: `npm install`

### Step 2.3: Link the Backend URL (Environment Variables)
In Vercel's **Environment Variables** section, add your Render API URL:
* **Key**: `VITE_API_URL`
* **Value**: `https://hydroseed-smart-advisor-api.onrender.com` *(Paste the Render URL you copied in Part 1 - make sure there is no trailing slash!)*

### Step 2.4: Deploy
Click **Deploy**. Vercel will build the React bundle and deploy it globally.
Once complete, Vercel will provide a custom domain (e.g., `https://hydroseed-smart-advisor.vercel.app`).

---

## Key Production Features Configured
Your codebase is fully optimized for this deployment:
1. **vercel.json rewrites**: Ensures that if a user manually refreshes their browser on dynamic React routes (like `/profile` or `/dashboard`), Vercel automatically routes the request back to `index.html` instead of displaying a `404 Not Found` error.
2. **Dynamic API Configuration**: By importing `API_URL` from `config.js`, all axios requests dynamically use the Render URL in production while seamlessly falling back to `http://localhost:5000` in local development!
