# Golf Booking System (TheEden) 🏌️‍♂️
<img width="1920" height="949" alt="TheEden Main Preview" src="https://github.com/user-attachments/assets/0fda8d18-eebe-4e24-94d2-11bf5d7133ef" />

A comprehensive, high-performance web application for golf course reservations. This project features a modular frontend architecture with secure payment integration and advanced UI/UX.

[🔗 View Live Demo](https://frontend-the-eden.vercel.app/)

---

## ✨ Key Features & Technical Highlights

- **Role-Based Interfaces**: Developed dedicated modules for different user roles, including **Golfer**, **Admin**, **Caddie**, and **Starter**.
- **Secure Payments**: Integrated **Stripe API** for seamless and secure deposit processing.
- **State Management**: Leveraged **React Context** and **React Router** for efficient data flow and seamless navigation.
- **Premium UI/UX**: Crafted with **Tailwind CSS 4**, **Framer Motion**, and **Lottie** for smooth transitions and interactive micro-interactions.
- **API Integration**: Centralized services using **Axios** to handle complex data fetching and real-time updates.

---

## 🛠️ Tech Stack

### Frontend Core
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS 4, DaisyUI, Radix UI, Headless UI
- **Animation**: Framer Motion, Lottie-React

### Utilities & UI
- **HTTP Client**: Axios
- **Icons & Alerts**: Lucide React, SweetAlert2

---

## 🌿 Version Control (Git Flow)

This project follows a structured branching strategy to ensure organized development:
- `main`: Production-ready code.
- `develop`: Primary integration branch.
- `feat/`: Individual feature branches (e.g., `admin-management`, `golfer_user`, `caddie-working`).

---

## 🚀 Installation & Setup
```bash
1. Clone the repository

2. Configure Environment Variables
Create a .env file in the root directory and add the following:

ข้อมูลโค้ด
VITE_API_BASE_URL=your_api_url
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
(Reference: image_8a68b8.png)

3. Install dependencies
Bash
npm install
4. Run the development server
Bash
npm run dev
