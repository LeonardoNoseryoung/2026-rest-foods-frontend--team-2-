import { Box, Container } from "@mui/material";
import RFMainButtonStack from "../components/Molecules/RFMainButtonStack";


export default function MainPage() {
  const buttonStack = RFMainButtonStack();
  return (
    <Box className="main-page">
      <header className="brand-header">
        <img
          className="brand-icon"
          src="https://logonoid.com/images/roger-federer-logo.png"
          alt="Rest Foods icon"
        />
        <h1>Welcome to Rest Foods!</h1>
      </header>
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {buttonStack}
      </Container>
    </Box>
  );
}
