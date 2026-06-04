import Button from "@mui/material/Button";

export default function RFButton(Label: string) {
  return (
    <Button variant="text"
      onClick={() => console.log("Button clicked!")}>
      {Label}
    </Button>
  );
}
