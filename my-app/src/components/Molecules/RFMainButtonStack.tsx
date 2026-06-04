import Stack from "@mui/material/Stack";
import RFMenuButton from "../Atoms/RFMenuButton";
import RFReservationButton from "../Atoms/RFReservationButton";

export default function RFMainButtonStack() {
  return (
    <Stack direction="row" justifyContent="center" width="100%">
      <RFMenuButton />
      <RFReservationButton />
    </Stack>
  );
}
