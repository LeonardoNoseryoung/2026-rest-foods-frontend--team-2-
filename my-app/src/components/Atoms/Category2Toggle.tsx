import * as React from "react";
import Placeholder from "../../assets/3rdPlaceholder.jpg";
import ToggleButton from "@mui/material/ToggleButton";

export default function StandaloneToggleButton() {
  const [selected, setSelected] = React.useState(false);

  return (
    <ToggleButton
      value="check"
      selected={selected}
      onChange={() => setSelected((prevSelected) => !prevSelected)}
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
export function Category2Toggle() {
    return console.log("Category 2 Toggle");
}