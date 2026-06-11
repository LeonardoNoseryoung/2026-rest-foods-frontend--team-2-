import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function RFReservationButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="text"
      color="primary"
      onClick={() => {
        console.log("Navigating to /ReservationPage");
        navigate("/reservation");
      }}
    >
      RESERVATIONS
    </Button>
  );
}