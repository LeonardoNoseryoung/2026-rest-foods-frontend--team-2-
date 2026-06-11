import CategoryBox from "../Atoms/CategoryBox";

export default function CategoryBoxStack({selectCategory1, selectCategory2}) {
  return (
    <div>
      {!selectCategory1 && CategoryBox(
        "MANAGER ESQUIREEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        "WHEREVER MIGHT THOU BEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
      )}
      {CategoryBox(
        "Onwards Rocinante!",
        "Again and again, until the dream is within our grasp!!",
      )}
    </div>
  );
}
  