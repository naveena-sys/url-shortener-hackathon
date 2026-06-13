# URL Shortener with Analytics

A full-stack URL shortening platform that allows users to create short links, manage them securely, track analytics, and generate QR codes.

## Live Demo

### Frontend (Vercel)

https://url-shortener-hackathon.vercel.app

### Backend (Render)

https://url-shortener-hackathon.onrender.com

### GitHub Repository

https://github.com/naveena-sys/url-shortener-hackathon

---

# Project Overview

This application enables authenticated users to shorten long URLs into compact shareable links. The system tracks visits, stores analytics data, supports QR code generation, and provides a clean dashboard for managing links.

The project was built using React, Node.js, Express, MongoDB Atlas, Render, and Vercel.

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Password Hashing using bcryptjs
* Protected Routes

## URL Management

* Create Short URLs
* Custom Short Aliases
* Delete URLs
* Expiry Support
* URL Validation

## Analytics

* Click Tracking
* Browser Analytics
* Device Analytics
* Operating System Analytics
* Visit History
* Daily Statistics

## QR Code Support

* Generate QR Codes for Short URLs

## Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* MongoDB Atlas Cloud Database

---

# Tech Stack

## Frontend

* React
* React Router
* Axios
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* express-validator

## Database

* MongoDB Atlas
* Mongoose

## Deployment

* Vercel
* Render

---

# AI Planning Document

## Problem Statement

Users often need a quick way to shorten lengthy URLs while also tracking engagement and usage statistics.

The objective was to build a secure URL shortening platform with authentication, analytics tracking, QR generation, and cloud deployment.

---

## Planning Process

### Phase 1 – Requirement Analysis

Identified core features:

* User Authentication
* URL Shortening
* Analytics Tracking
* QR Code Generation
* Cloud Deployment

### Phase 2 – System Design

Designed a three-tier architecture:

* Frontend
* Backend API
* Database

### Phase 3 – Database Design

Collections:

#### Users

Stores:

* Name
* Email
* Password Hash

#### URLs

Stores:

* Long URL
* Short Code
* Click Count
* User Reference
* Expiry Information

#### Visits

Stores:

* Browser
* Device
* Operating System
* Referer
* Timestamp

### Phase 4 – Deployment

Frontend:

* Vercel

Backend:

* Render

Database:

* MongoDB Atlas

---

# Architecture

The application follows a client-server architecture.

User

↓

React Frontend (Vercel)

↓

REST API

↓

Express Backend (Render)

↓

MongoDB Atlas

### Redirect Flow

Short URL → Backend → Original URL

### Analytics Flow

Visit → Backend → MongoDB

---

# Architecture Diagram

Architecture diagram available in:

```text
docs/architecture-diagram.png
```

---

# Folder Structure

```text
url-shortener-hackathon
│
├── frontend
│
├── server
│
├── docs
│   ├── architecture-diagram.png
│   └── screenshots
│
└── README.md
```

---

# Environment Variables

## Frontend

```env
VITE_API_URL=https://url-shortener-hackathon.onrender.com/api
```

## Backend

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

BASE_URL=https://url-shortener-hackathon.onrender.com

CLIENT_URL=https://url-shortener-hackathon.vercel.app

NODE_ENV=production
```

---

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/naveena-sys/url-shortener-hackathon.git
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

## Backend Setup

```bash
cd server

npm install

npm run dev
```

---

# API Features

## Authentication

* Register User
* Login User

## URLs

* Create URL
* Get URLs
* Delete URL
* Generate QR

## Analytics

* URL Analytics
* Visit Analytics

## Redirect

* Public URL Redirect

---

# Screenshots

Project screenshots are available in:

```text
docs/screenshots
```

Included:

* Dashboard
* Analytics
* QR Code
* Redirect Working
* MongoDB Collections
* Render Deployment
* Vercel Deployment

---

# Assumptions

* Users must be authenticated before creating URLs.
* Analytics are recorded only when a redirect occurs.
* Expired links should not redirect.
* MongoDB Atlas is used as the primary database.
* Render free tier may introduce cold-start delays.

---

# Demo Video

Video Demonstration Link:

https://www.loom.com/share/409672260e064a499195135352b3f6e9

---

# Sample Output

The repository includes:

* Application Screenshots
* MongoDB Records
* Deployment Screenshots
* Analytics Screenshots

---

# Future Improvements

* Custom Domains
* Team Collaboration
* Advanced Analytics Dashboard
* Export Analytics Reports
* Link Password Protection

---

# Author

Naveena

GitHub:
https://github.com/naveena-sys

---

This project is a part of a hackathon run by https://katomaran.com
