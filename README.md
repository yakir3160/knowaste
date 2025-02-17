# Knowaste - Smart Solution for Reducing Food Waste in Restaurants

Knowaste offers a unique solution for efficiently managing food inventory in restaurants, helping restaurant managers reduce food waste and optimize their ordering process. By analyzing sales and past food waste data, the system helps restaurants better forecast their needs and make more accurate orders.

Built with modern technologies such as **React**, **Tailwind CSS**, **Node.js** with **REST APIs**, **Firebase**, **Firebase Admin**, and **Nodemailer**, Knowaste is designed to be user-friendly, efficient, and scalable.

This project was developed as a **final project for my Software Engineering Technician diploma**, combining academic knowledge with practical experience to create a real-world solution for reducing food waste in restaurants.

---

## Key Features

- **Smart Inventory & Waste Tracking**:
    - A system for tracking food waste and offering solutions for minimizing waste.
    - Provides analytics on inventory and waste to help make informed decisions.

- **Seamless Integration with Existing Data**:
    - Integrates with existing restaurant management systems to offer actionable insights.

- **Custom Reports**:
    - Generate daily sales and waste reports.
    - Customizable reports for tracking inventory and waste.

- **User-Friendly Interface**:
    - An intuitive UI built with **React** and styled using **Tailwind CSS**.

- **Backend Built with Node.js**:
    - REST APIs powered by **Node.js** to handle all server-side logic.
    - Uses **Firebase** for real-time data management and authentication.

---

## Technology Stack

- **Frontend**:
    - **React** for building the user interface.
    - **Tailwind CSS** for responsive, utility-first styling.

- **Backend**:
    - **Node.js** for the backend server.
    - **Express** framework for handling routes and middleware.
    - **Firebase** for real-time database and authentication.
    - **Firebase Admin** for managing and securing data in the backend.

- **Email Service**:
    - **Nodemailer** for sending contact emails and notifications.

---

## API Routes

The backend includes various REST API routes, divided into multiple categories for managing authentication, users, inventory, menu, reports, and analytics:

### Authentication Routes (`/auth`)
- **POST** `/register` - Register a new user.
- **POST** `/login` - Login a user.
- **POST** `/google` - Google sign-in.
- **POST** `/reset-password` - Send a password reset email.
- **POST** `/update-password` - Update password with verification.

### User Routes (`/users`)
- **PUT** `/update-profile` - Update user profile details.

### Inventory Routes (`/inventory`)
- **GET** `/` - Get all inventory items.
- **POST** `/` - Add or update an inventory item.
- **DELETE** `/:id` - Delete an inventory item.
- **GET** `/analytics/sales/:timeRange` - Get inventory analytics for sales by time range.
- **GET** `/analytics/waste` - Get waste analytics.
- **GET** `/analytics/recommendations/order` - Get order recommendations.
- **GET** `/analytics/recommendations/item` - Get item recommendations.

### Menu Routes (`/menu`)
- **GET** `/` - Get all menu items.
- **POST** `/` - Add or update a menu item.
- **DELETE** `/:id` - Delete a menu item.

### Report Routes (`/reports`)
- **POST** `/:type/add` - Add a report.
- **GET** `/:type/list` - Get reports by type.
- **DELETE** `/:type/:id` - Delete a report.
- **PUT** `/:type/:id/status` - Update the status of a report.

### Email Routes (`/email`)
- **POST** `/contact` - Send a contact email.

### Analytics Routes (`/analytics`)
- **GET** `/sales` - Get sales by date range.
- **GET** `/top-dishes` - Get top-selling dishes.
- **GET** `/least-selling-dishes` - Get least-selling dishes.
- **GET** `/waste` - Get waste analysis.
- **GET** `/top-wasted-ingredients` - Get top wasted ingredients.
- **GET** `/low-stock-items` - Get low stock items.
- **GET** `/revenue-vs-waste` - Compare revenue vs waste over a specified time range.
- **GET** `/forecast-demand` - Forecast demand for future orders.
- **GET** `/non-profitable-items` - Get items that are non-profitable.

---

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/knowaste.git
    cd knowaste
    ```

2. Install the dependencies:

    - For **frontend** (React):
      ```bash
      cd client
      npm install
      ```

    - For **backend** (Node.js/Express):
      ```bash
      cd server
      npm install
      ```

3. Set up your environment variables:
    - Create `.env` files for both frontend and backend and configure your API keys for Firebase, Nodemailer, etc.

4. Run the development servers:

    - For frontend:
      ```bash
      cd client
      npm start
      ```

    - For backend:
      ```bash
      cd server
      npm start
      ```

---

## Contributing

If you would like to contribute to **Knowaste**, please fork the repository and submit a pull request. We welcome contributions from the community to improve the platform.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
