import React from "react";
import CategoryBoxStack from "../Molecules/CategoryBoxStack";
import CategoryToggles from "../Molecules/CategoryToggles";

export default function MenuButtonsAndBoxes() {
  const [selectCategory1, setSelectCategory1] = React.useState(false);
  const [selectCategory2, setSelectCategory2] = React.useState(false);

  return (
    <div>
      <CategoryToggles
        selectCategory1={selectCategory1}
        setSelectCategory1={setSelectCategory1}
        selectCategory2={selectCategory2}
        setSelectCategory2={setSelectCategory2}
      />
      <CategoryBoxStack
        selectCategory1={selectCategory1}
        selectCategory2={selectCategory2}
      />
    </div>
  );
}
