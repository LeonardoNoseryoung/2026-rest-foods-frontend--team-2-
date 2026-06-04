import Stack from "@mui/material/Stack";
import RFButton from "../Atoms/RFButton";

export default function RFButtonStack(LeftLabel: string, RightLabel: string) {
  return (
    <Stack 
    direction="row" 
    justifyContent="center"
    width="100%"
    >
      {RFButton(LeftLabel)}
      {RFButton(RightLabel)}
    </Stack>
  );
}
