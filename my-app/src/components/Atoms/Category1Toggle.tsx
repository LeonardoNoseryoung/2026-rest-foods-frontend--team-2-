import * as React from "react";
import Placeholder from "../../assets/2ndPlaceholder.jpg";
import ToggleButton from "@mui/material/ToggleButton";

export default function StandaloneToggleButton({
  selectCategory1, 
  setSelectCategory1
}) {
  return (
    <ToggleButton
      value="check"
      selected={selectCategory1}
      onChange={() => {
        setSelectCategory1((prevSelected) => !prevSelected);
        console.log("Category 1 toggled");
      }}>
        <img
        src={Placeholder}
        alt="Category 1"
        width="55"
        height="55"
      />
    </ToggleButton>
  );
}
{/*      sx={{
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
        alt="Category 1"
        width="55"
        height="55"
      />
    </ToggleButton>
  );
  
} */}