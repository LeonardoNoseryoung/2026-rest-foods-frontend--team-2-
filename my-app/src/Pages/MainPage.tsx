import { Box, Container } from "@mui/material";
import RFButtonStack from "../components/Molecules/RFButtonStack";

export default function MainPage() {
  const buttonStack = RFButtonStack("Menu", "Reservations");
  return (
    <Box >
      <h1>
        <img
          src="https://logonoid.com/images/roger-federer-logo.png"
          style={{ width: "200px", height: "auto" }}
        />
        
        <p>Welcome to Rest Foods!</p>
      </h1>
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {buttonStack}
        </Container>
        </Box>
  );
}
