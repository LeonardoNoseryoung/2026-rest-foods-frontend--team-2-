import Stack from "@mui/material/Stack";
import RFButton from "../Atoms/RFButton";
import { useNavigate } from "react-router-dom";

export default function RFButtonStack(LeftLabel: string, RightLabel: string, LeftURL?: string, RightURL?: string) {
  const navigate = useNavigate();
  const goToURL = (url: string) => {
    if (url){
      navigate(url);
    } else {console.log("No URL provided");
    }
  }
  return (
    <Stack 
    direction="row" 
    justifyContent="center" 
    width="100%"
    >
      {RFButton(LeftLabel, LeftURL)}
      {RFButton(RightLabel, RightURL)}
    </Stack>
  );
}
