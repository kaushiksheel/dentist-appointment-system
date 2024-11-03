# Dentist Appointment Booking System

This project is a comprehensive Dentist Appointment Booking system consisting of three interconnected portals: Admin, Dentist, and Customer. The system is built using React, Tailwind CSS, and Firebase for persistent data storage.

## Tech Stack

- **Frontend**: React
- **Styling**: Tailwind CSS
- **Backend & Database**: Firebase

## Features

### 1. Admin Portal

- View bookings made by customers and allocated dentists
- Add various dental services along with prices
- View weekly/monthly reports of patient bookings with dentist allocation details
- Add dentists to the system and assign hourly service fees

### 2. Dentist Portal

- Login to view assigned patients
- Mark appointments as completed on the calendar for specific time slots

### 3. Customer Portal

- Register and login
- Book time slots on the calendar by selecting preferred dentists
- View past bookings on the calendar
- Book services by paying the combined price (dentist's hourly rate + service price)
- Secure payment process before dentist allocation (payment process is mocked)

## Business Rules

1. Bookings are only available from Monday to Friday, between 08:30 AM to 05:30 PM.
2. A dentist can only be booked twice a day, and each time slot is exclusive to one customer.


## Demo

[Demo Link](https://dentist-appointment-system.vercel.app/)


## Usage

### Admin Portal

1. Login with admin credentials or  with Dummy Admin
2. Navigate through the dashboard to manage services, dentists, and view reports

### Dentist Portal

1. Login with dentist credentials or  with Dummy Dentist
2. View assigned patients and mark appointments as completed

### Customer Portal

1. Register or login
2. Browse available time slots and dentists or  with Dummy Customer
3. Select a service and complete the booking process



## License

[MIT](https://choosealicense.com/licenses/mit/)