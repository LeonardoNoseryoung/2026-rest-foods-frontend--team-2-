import CategoryBoxStack from "../components/Molecules/CategoryBoxStack";
import CategoryToggles from "../components/Molecules/CategoryToggles";

function MenuPage() {
  return (
    <div>
      <h1>Menu Page</h1>
      <h2>Categories</h2>
      <CategoryToggles />
      <CategoryBoxStack />
    </div>
  );
}

export default MenuPage;
