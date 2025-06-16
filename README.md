# 🐾 VirtualPet Frontend - GymPet

![welcome_gympet](https://github.com/user-attachments/assets/bd117a68-b0a4-44e3-b15d-c03e9e9fd294)


Welcome to the **VirtualPet** frontend — the user interface for adopting, training, and caring for your virtual pet companions. Built with modern web technologies, this frontend connects seamlessly with the backend API to bring your pets to life in the browser.

---

## ⚙️ Technologies Used

- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) React
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) TypeScript
- ![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat&logo=redux&logoColor=white) Redux (or Context API)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) Vite
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) Tailwind CSS
- 🌐 Axios or Fetch API for HTTP
- 🔄 React Router DOM for client-side routing

---

## 🚀 Setup & Run Locally

1. **Clone this repo:**

   ```bash
   git clone https://github.com/Cinsara/ItAcademy_Sprint5.02_VirtualPet_Frontend.git
   cd ItAcademy_Sprint5.02_VirtualPet_Frontend

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn
    
3. **Configure environment variables:**

   Create a ```.env``` file in the root:

  ```env
   VITE_API_URL=http://localhost:8080/api
  ```
4. **Start the dev server:**

  ```bash
   npm run dev
    # or
    yarn dev
  ```
5. **Open the app:**

   Visit ```http://localhost:3000``` (or printed URL in terminal).

## 📁 Project Structure

```bash
src/
├── components/       # Reusable UI elements
├── pages/            # Page-level views (Home, Login, Pet, Shop, etc.)
├── store/            # State management (Redux slices or Context)
├── services/         # API calls (axios instances, endpoints)
├── assets/           # Images, icons, styles
├── App.tsx           # App root and routes
└── main.tsx          # Entry point
```

## 🔗 Key Features & Routes

![train_gympet](https://github.com/user-attachments/assets/2384da87-e79f-4aa1-b465-2b0a936c1a22)

- User auth: ```/login, /register ```— handle JWT tokens

- AdminDashboard: ```/admin``` — view pet stats and actions

- Pet screen: ```/pet``` — check on your pet’s health, happiness

- Training: ```/train``` — level up through mini-games

- Shop: ```/shop``` — purchase food, accessories, power-ups

