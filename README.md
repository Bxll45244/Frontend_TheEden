Golf Booking System (TheEden) 🏌️‍♂️
A comprehensive, high-performance web application for golf course reservations. This project features a modular frontend architecture with secure payment integration and advanced UI/UX.
<img width="1920" height="949" alt="image" src="https://github.com/user-attachments/assets/e52f0b38-fed6-49b5-b38e-eace543d51fe" />

[🔗 View Live Demo ##](https://frontend-the-eden.vercel.app/) ✨ Key Features & Technical Highlights

Role-Based Interfaces: Developed dedicated modules for different user roles, including Golfer, Admin, Caddie, and Starter.

Secure Payments: Integrated Stripe API for seamless and secure deposit processing.

State Management: Leveraged React Context and React Router for efficient data flow and seamless navigation.

Premium UI/UX: Crafted with Tailwind CSS 4, Framer Motion, and Lottie for smooth transitions and interactive micro-interactions.

API Integration: Centralized services using Axios to handle complex data fetching and real-time updates.

🛠️ Tech Stack
Core: React 19, Vite

Styling: Tailwind CSS 4, DaisyUI, Radix UI, Headless UI

Animation: Framer Motion, Lottie-React

Utilities: Axios, Lucide React, SweetAlert2

🌿 Version Control (Git Flow)
This project follows a structured branching strategy to ensure organized development:

main: Production-ready code.

develop: Primary integration branch.

feat/: Individual feature branches (e.g., admin-management, golfer_user, caddie-working).

🚀 Installation & Setup
1.Clone the repository.

2.Create a .env file based on the environment variables needed (Stripe Keys, API Base URL).
  VITE_API_BASE_URL=your_api_url
  VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
  
3.Install dependencies:
  npm install
  
4.Run the development server:
  npm run dev
