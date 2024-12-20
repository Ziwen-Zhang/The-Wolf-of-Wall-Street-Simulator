# **The Wolf of Wall Street Simulator**

## **Overview**

The Wolf of Wall Street Simulator is a full-stack web application that allows users to simulate stock trading in a real-time environment. Users can explore stock prices, place trades, and manage their portfolios. The backend is powered by **Flask**, while the frontend uses **React** for a dynamic user experience.

---

## **Features**

- **Real-Time Stock Prices**:
  - Simulated stock prices using a random price generator.
  - Real-time updates for saved stocks.

- **Trading System**:
  - Execute buy and sell orders.
  - Limit orders for buying stocks at specific prices.

- **Portfolio Management**:
  - View total net worth and portfolio breakdown.
  - Track trading history.

- **Notifications**:
  - Receive notifications for stock saves.

---

## **Technologies Used**

### **Backend**
- **Flask**: Backend framework for handling RESTful API requests.
- **SQLAlchemy**: ORM for database interactions.
- **SQLite3**: Relational database for storing application data.

### **Frontend**
- **React**: Framework for building user interfaces.
- **JavaScript**: Logic and interactivity for the frontend.
- **Tailwind CSS**: Styling for modern, responsive design.

### **Additional Tools**
- **WebSocket**: For real-time stock price updates.
- **Threads**: To simulate stock price changes asynchronously.

---

## **Getting Started**

### **Installation**
### Set up the backend environment:
#### Navigate to the backend directory:
        cd app
#### Install dependencies: 
        pipenv install
#### Run database migration, seed, and start the server:
        pipenv run db

### Frontend Setup:
#### Navigate to the frontend directory:
        cd ../react-app
#### Install dependencies:
        npm install
#### Start the development server:
        npm start