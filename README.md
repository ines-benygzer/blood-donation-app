# Blood Donation Management App

## Overview

This Laravel + React application helps blood banks manage donors, donations, blood stock, donation sessions, and urgent hospital requests. It provides a dashboard with real‑time statistics and a simple UI for administrators and staff.

## Key Features

- **Donor Registry** – List, create, edit and delete donors. The table now displays the **Total Donations** for each donor.
- **Donation Sessions** – Schedule donation events with a location. Each session can be opened directly on **Google Maps**.
- **Blood Stock Monitoring** – Shows the quantity of each blood type with visual status indicators (`Critical`, `Low`, `Good`).
- **Hospital Requests** – Hospitals can request blood units. Admins can fulfil requests, which automatically deducts the stock.
- **Dashboard** – Overview of total donors, monthly donations, stock levels and recent donations.

## Backend Mechanics

### Total Donations per Donor

- Implemented in `DonorController@index` using `withCount('donations')` so each donor object includes `donations_count`.

### Hospital Requests (`HospitalRequestController`)

- **Create**: `store` validates `hospital_name`, `blood_type`, `quantity` and `is_urgent`.
- **Fulfil**: Only admins may fulfil a request (`fulfill`). The method runs inside a `DB::transaction`:
    1. Verify sufficient `BloodStock` for the requested type.
    2. Decrement the stock quantity.
    3. Mark the request status as `fulfilled`.
    4. Return the updated request and remaining stock.

### Critical Stock

- In the **frontend** (`BloodStock/Index.jsx`) stock status is computed:
    ```js
    if (quantity < 5)  → Critical (red)
    else if (quantity < 15) → Low (yellow)
    else → Good (green)
    ```
- The same logic is used in `DashboardController` to flag critical stock on the dashboard.

## Frontend UI Details

- **View on Map** – Sessions list includes a link generated as:
    ```js
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(session.location)}`;
    ```
    This opens Google Maps (or the app on mobile) with the session location.
- **Total Donations Column** – Added to `Donors/Index.jsx` table header and rows, displaying `donor.donations_count`.
- **Stock Status Badges** – Colored badges (red, yellow, green) show the stock state.

## Development

```bash
# Install dependencies
composer install
npm install

# Build assets
npm run dev   # or npm run prod for production

# Run the development server
php artisan serve
```

## Environment Variables

Copy `.env.example` to `.env` and configure database credentials, mail settings, etc.

## License

This project is open source under the MIT License.

---
