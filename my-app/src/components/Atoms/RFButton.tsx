import Button from "@mui/material/Button";

export default function RFButton(Label: string, URL?: string) {
  return (
    <Button variant="text"
    color="text.primary"
    justifyContent="center" 
      onClick={() => console.log(URL)}>
      {Label}
    </Button>
  );
}
