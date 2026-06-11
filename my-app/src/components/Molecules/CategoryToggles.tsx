import { Stack } from "@mui/material";
import Category1Toggle from "../Atoms/Category1Toggle";
import Category2Toggle from "../Atoms/Category2Toggle";
import AllCategoryToggle from "../Atoms/AllCategoryToggle";

export default function CategoryToggles({
  selectCategory1,
  setSelectCategory1,
}) {
  return (
    <div>
      <Stack direction="row" justifyContent="center" width="100%">
        <AllCategoryToggle />
        {Category1Toggle(selectCategory1, setSelectCategory1)}
        <Category2Toggle />
      </Stack>
    </div>
  );
}
