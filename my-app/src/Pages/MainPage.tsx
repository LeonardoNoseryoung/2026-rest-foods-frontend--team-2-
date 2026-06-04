import { Box, Container } from "@mui/material";
import RFMainButtonStack from "../components/Molecules/RFMainButtonStack";

export default function MainPage() {
  const buttonStack = RFMainButtonStack();
  return (
    <Box>
      <h1>
        <img
          src="https://logonoid.com/images/roger-federer-logo.png"
          style={{ width: "200px", height: "auto" }}
        />

        <p>Welcome to Rest Foods!</p>
      </h1>
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {buttonStack}
      </Container>
    </Box>
  );
}
