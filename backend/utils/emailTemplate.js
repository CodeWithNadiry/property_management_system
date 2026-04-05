import { formattedDate } from "../../frontend/src/utils/formattedDate.js";

export const confirmReservationEmail = (reservation) => {
  return `
    <h2>Reservation Confirmed ✅</h2>

    <p>Dear ${reservation.name},</p>

    <p>Your reservation has been successfully created. Here are your details:</p>

    <p><strong>Room ID:</strong> ${reservation.room_id}</p>
    <p><strong>Check-in:</strong> ${formattedDate(reservation.check_in)}</p>
    <p><strong>Check-out:</strong> ${formattedDate(reservation.check_out)}</p>
    <p><strong>Total Price:</strong> ${reservation.total_price}</p>

    <p>Please confirm your reservation by clicking the link below:</p>

    <p>
      <a href="http://localhost:5173/confirmations/${reservation.id}">
        Confirm Reservation
      </a>
    </p>
  `;
};

export const checkInEmail = (token) => {
  return `
    <h2>Welcome to Our Hotel 🏨</h2>

    <p>We’re pleased to have you with us.</p>

    <p>Please complete your check-in by clicking the link below:</p>

    <p>
      <a href="http://localhost:5173/check_in?token=${token}">
        Check In
      </a>
    </p>
  `;
};

export const passcodeEmail = ({ name, passcode: code }) => {
  return `
    <h2>Check-In Successful 🎉</h2>

    <p>Dear ${name},</p>

    <p>You have successfully checked in.</p>

    <p>
      Your Room Access Code: 
      <strong style="color: green;">${code}</strong>
    </p>

    <p>Please keep this code secure.</p>
  `;
};

export const checkOutEmail = (reservation) => {
  return `
    <h2>Thank You for Staying With Us 🏨</h2>

    <p>Your check-out has been completed successfully.</p>

    <p><strong>Room ID:</strong> ${reservation.room_id}</p>
    
    <p><strong>Check-out Date:</strong> ${formattedDate(reservation.check_out)}</p>

    <p>We hope you had a pleasant stay and look forward to welcoming you again.</p>
  `;
};