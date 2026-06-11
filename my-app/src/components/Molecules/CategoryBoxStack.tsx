import Category1Box from "../Atoms/Category1Box";
import Category2Box from "../Atoms/Category2Box";

export default function CategoryBoxStack({ selectCategory1, selectCategory2 }) {
  return (
    <div>
      {!selectCategory1 && (
        <Category1Box
          Category="MANAGER ESQUIREEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
          Item="WHEREVER MIGHT THOU BEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
        />
      )}
      {!selectCategory2 && (
        <Category2Box
          Category="Onwards Rocinante!"
          Item="Again and again, until the dream is within our grasp!!"
        />
      )}
    </div>
  );
}
