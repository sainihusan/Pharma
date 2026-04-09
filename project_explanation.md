# Pharmacy Web Application Architecture & Walkthrough

This document provides a comprehensive overview of the Pharmacy Web Application, explaining how every component, page, and context works together to create a seamless e-commerce experience. 

## 1. Core Technologies & Architecture

The application is built using a modern React stack. The architecture follows a standard Single Page Application (SPA) structure.

- **Frontend Framework**: React (via Vite or Create React App).
- **Routing**: `react-router-dom` for client-side routing.
- **State Management**: React Context API, which replaces heavier tools like Redux for a lightweight global state.
- **Styling & Theming**: Material-UI (MUI) is used for basic theming (`ThemeProvider`, `CssBaseline`) alongside utility-first CSS (TailwindCSS) for structural styling.
- **Data Persistence**: `localStorage` is used alongside backend APIs to persist user sessions, cart state, and token-based authentication.

---

## 2. Global Setup & Routing (`App.jsx`)

`App.jsx` acts as the root of the application, tying everything together.

- **Theme & Guidelines**: Uses MUI's `ThemeProvider` to establish a global color palette (Primary `#2563eb`, Secondary `#f43f5e`) and typography settings (like `Inter` font family).
- **Context Providers**: Wraps the application in four main context providers: `AuthProvider`, `MedicinesProvider`, `CartProvider`, and `OrdersProvider`. This ensures state is accessible top-down throughout the app.
- **Layout Logic**: Renders the `Navbar` and `Footer` conditionally. Pages like `/welcome` and `/forgot-password` hide these layout elements for full-screen focus.
- **Routing**: Defines the application routes. Uses a custom `<ProtectedRoute>` component to ensure that certain pages (like `/shop`, `/cart`, `/orders`, `/profile`, `/admin/dashboard`) cannot be accessed unless the user is logged in. 
- **Page Transitions**: Wraps routes in a `<PageTransition>` component to animate page mounts/unmounts nicely.

---

## 3. State Management (The `src/context/` Directory)

State is logically separated into distinct Contexts to avoid unnecessary re-renders and keep functionality modular.

### `AuthContext.jsx`
- Handles user authentication logic.
- Checks `localStorage` on initial load for a valid JWT token. It parses the base64 JWT payload to verify if the token is expired (`payload.exp * 1000 > Date.now()`).
- Exposes `login` and `logout` functions, which interact with a backend `authService`. On successful login, it saves the `token` and `user` object to localStorage.
- Exposes an `isAdmin` boolean by checking if `user?.role === 'admin'`, which is used to conditionally render the Admin Dashboard.

### `CartContext.jsx`
- Manages the user's shopping cart.
- Initializes from `localStorage` so the user doesn't lose their cart on refresh.
- Exposes methods: `addToCart` (checks if the medicine exists and increments quantity, otherwise adds functionally new), `removeFromCart`, `updateQuantity`, and `clearCart`.

### `MedicinesContext.jsx` & `OrdersContext.jsx`
- `MedicinesContext` manages the global list of products. It typically fetches data from a backend and stores it in context so it can be filtered/searched dynamically on the Shop page.
- `OrdersContext` manages user past orders. It allows the user to see order history and handles the transition from "Cart" to "Paid Order".

---

## 4. Components Directory (`src/components/`)

Components are broken into logical groupings to keep the code clean and reusable.

### Global UI Components
- **`Navbar.jsx`**: The main navigation header. Reacts to the `AuthContext` to display user/admin links and the `CartContext` to show a dynamic cart badge.
- **`Footer.jsx`**: Standard application footer with links and social icons.
- **`PageTransition.jsx`**: A wrapper that usually employs CSS or animation libraries to provide cross-fade or slide animations when moving between routes.
- **`ScrollToTop.jsx`**: A utility component that resets the window scroll position to 0 upon route changes.
- **`MedicineCard.jsx`**: The primary UI unit for rendering a product. Displays the image, price, title, and an "Add to Cart" button.
- **`MedicineForm.jsx`**: Used primarily by the admin panel to Create/Edit medicine entries in the database.

### Auth Components (`src/components/auth/`)
- **`ProtectedRoute.jsx`**: An interceptor component. If a user tries to access a wrapped route and `user` is null (from `AuthContext`), it uses React Router's `<Navigate>` to redirect them to `/welcome` or `/admin/login`.
- **`OtpModal.jsx`**: A modal component used during authentication flows (like password reset) to accept a one-time password.

### Home Components (`src/components/home/`)
Modular sections dedicated to building the `Home` page:
- **`Hero.jsx`**: Features a prominent call-to-action to drive initial engagement.
- **`FeaturedDeals.jsx` & `Brands.jsx` & `Categories.jsx`**: Visual segments to group and highlight specific products or partnerships.
- **`Stats.jsx`, `Features.jsx`, `Testimonials.jsx`**: Social proof and application value proposition segments.
- **`Newsletter.jsx`**: A quick email capture form for marketing.

---

## 5. Pages (`src/pages/`)

### Public / General Pages
- **`WelcomePage.jsx`**: A landing page primarily for unauthenticated users, outlining what the pharmacy does and featuring login/signup prompts.
- **`Home.jsx`**: The authenticated user's landing page, composed of the various home components (`Hero`, `Brands`, etc.).
- **`About.jsx` & `Contact.jsx`**: Static pages delivering company information and support forms.
- **`Shop.jsx`**: The core catalog. Maps over the list of medicines provided by `MedicinesContext`. Includes filtering (by category, price) and search functionality.

### User E-Commerce Flow
- **`Cart.jsx`**: Displays items currently in the `CartContext`. Allows users to adjust quantities and proceed to checkout. Calculates total pricing.
- **`OrderHistory.jsx`**: Displays past purchases. Retrieves data from the `OrdersContext`.
- **`Profile.jsx`**: Allows the user to view and update their personal account information.

### Authentication Pages
- **`LoginPage.jsx` & `SignupPage.jsx`**: User-facing forms to authenticate. They dispatch calls to `AuthContext`.
- **`ForgotPassword.jsx`**: Interfaces with the backend to initiate a password reset and displays the `OtpModal`.

### Admin Panel (`src/pages/admin/`)
- **`Login.jsx`**: A securely separated login interface specifically for administrator roles.
- **`Dashboard.jsx`**: The admin control center. Restricted by `<ProtectedRoute adminOnly={true}>`. Contains functionalities to view all orders across the platform, and uses `MedicineForm.jsx` to add new inventory products, modify prices, and manage stock.

---

## 6. Real-World Walkthrough (Adding to Cart Flow)

To illustrate how everything connects, here is the lifecycle when a user clicks "Add to Cart":

1. **User interaction on `Shop.jsx`**: The user is browsing the shop page and clicks the Add button on a `<MedicineCard />`.
2. **Component Function**: The `MedicineCard` calls the `addToCart(medicine)` function imported from the `useCart()` hook.
3. **Context Update**: `CartContext` intercepts this function call. It checks if the item is already in `cart` state. If so, it updates the quantity; if not, it pushes the object.
4. **Local Storage Reflection**: The `useEffect` inside `CartContext` watches the `cart` state. It immediately serializes the new cart to `localStorage` to ensure persistence across browser reloads.
5. **UI Update**: Because the `Navbar` component consumes the `useCart()` hook, the cart badge immediately re-renders to reflect the new item count. The user can then navigate to `/cart`, which also consumes the context and displays the fully updated list.

## Conclusion

This application leverages React Context instead of heavier solutions like Redux since the state (User, Cart, Product List) is relatively flat and distinct. React Router is used powerfully combined with the Context API to secure routes and direct user flow elegantly between administrative views and public shopping views.
