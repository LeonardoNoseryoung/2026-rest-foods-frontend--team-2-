import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import arrow from "../../assets/Placeholder.webp";
{
  /* arrow from "../../assets/fork.png"; */
}

export default function CategoryBox(Category: string, Item: string) {
  return (
    console.log("CategoryBox rendered with Category:", Category, "and Item:", Item),
    <div>
      <Accordion
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid black",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
        }}
      >
        {/* Text to drop down (Category) */}
        <AccordionSummary
          expandIcon={<img src={arrow} alt="Arrow" width="45" height="45" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderBottom: "1px solid black",
          }}
        >
          <Typography>{Category}</Typography>
        </AccordionSummary>
        {/* Text to show when drop down (Menu) */}
        <AccordionDetails>
          <Typography>{Item}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
