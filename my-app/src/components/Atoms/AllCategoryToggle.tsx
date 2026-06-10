import * as React from "react";
import Placeholder from "../../assets/4thPlaceholder.jpg";
import ToggleButton from "@mui/material/ToggleButton";
import { Category2Toggle } from "./Category2Toggle";


export default function StandaloneToggleButton() {
  const [selected, setSelected] = React.useState(false);

  return (
    <ToggleButton
      value="check"
      selected={selected}
      onChange={() => setSelected((prevSelected) => !prevSelected) && Category2Toggle()}
        
      
      sx={{
        "&.Mui-selected img": {
          filter: "brightness(60%)",
        },
        "& img": {
          transition: "filter 0.2s ease",
        },
      }}
    >
      <img
        src={Placeholder}
        alt="All Categories"
        width="55"
        height="55"
      />
    </ToggleButton>
  );
}