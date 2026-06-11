import * as React from "react";
import Placeholder from "../../assets/3rdPlaceholder.jpg";
import ToggleButton from "@mui/material/ToggleButton";

export default function StandaloneToggleButton({
  selectCategory2, 
  setSelectCategory2
}) {
    return (
        <ToggleButton
        value="check"
        selected={selectCategory2}
        onChange={() => {
            setSelectCategory2((prevSelected) => !prevSelected);
        }}
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
        alt="Category 2"
        width="55"
        height="55"
        />

    </ToggleButton>
  );
}
