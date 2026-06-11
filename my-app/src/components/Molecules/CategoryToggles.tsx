import { Stack } from "@mui/material";
import Category1Toggle from "../Atoms/Category1Toggle";
import Category2Toggle from "../Atoms/Category2Toggle";
import AllCategoryToggle from "../Atoms/AllCategoryToggle";

type CategoryTogglesProps = {
  selectCategory1: boolean;
  setSelectCategory1: React.Dispatch<React.SetStateAction<boolean>>;
  selectCategory2: boolean;
  setSelectCategory2: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CategoryToggles({
  selectCategory1,
  setSelectCategory1,
  selectCategory2,
  setSelectCategory2,
}: CategoryTogglesProps) {
  return (
    <div>
      <Stack direction="row" justifyContent="center" width="100%">
        <AllCategoryToggle />
        <Category1Toggle
          selectCategory1={selectCategory1}
          setSelectCategory1={setSelectCategory1}
        />
        <Category2Toggle
          selectCategory2={selectCategory2}
          setSelectCategory2={setSelectCategory2}
        />
      </Stack>
    </div>
  );
}
