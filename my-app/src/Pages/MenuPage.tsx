import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

const API_BASE_URL = "http://localhost:8080";

interface MenuItem {
  id: string;
  name: string;
  chefsChoice: boolean;
  vegetarian: boolean;
  meat: boolean;
  fish: boolean;
}

interface MenuCategory {
  id: string;
  menuItems?: MenuItem[];
}

type MenuItemDraft = Omit<MenuItem, "id">;

const emptyItemDraft: MenuItemDraft = {
  name: "",
  chefsChoice: false,
  vegetarian: false,
  meat: false,
  fish: false,
};

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

function getRequestErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return "Backend is offline or not reachable at http://localhost:8080.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed.";
}

function formatShortUuid(id: string): string {
  return id.slice(0, 8);
}

function MenuItemToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle-field">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function MenuItemFields({
  draft,
  onChange,
}: {
  draft: MenuItemDraft;
  onChange: (draft: MenuItemDraft) => void;
}) {
  return (
    <div className="menu-item-fields">
      <label className="menu-name-field">
        <span>Name</span>
        <input
          type="text"
          value={draft.name}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          placeholder="Truffle Risotto"
          required
        />
      </label>
      <MenuItemToggle
        label="Chef's Choice"
        checked={draft.chefsChoice}
        onChange={(chefsChoice) => onChange({ ...draft, chefsChoice })}
      />
      <MenuItemToggle
        label="Vegetarian"
        checked={draft.vegetarian}
        onChange={(vegetarian) => onChange({ ...draft, vegetarian })}
      />
      <MenuItemToggle
        label="Meat"
        checked={draft.meat}
        onChange={(meat) => onChange({ ...draft, meat })}
      />
      <MenuItemToggle
        label="Fish"
        checked={draft.fish}
        onChange={(fish) => onChange({ ...draft, fish })}
      />
    </div>
  );
}

function BooleanBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`boolean-badge ${active ? "active" : ""}`}>
      {label}
    </span>
  );
}

function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItemDraft, setNewItemDraft] = useState<MenuItemDraft>(emptyItemDraft);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [requestBusy, setRequestBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setErrorMessage("");

    try {
      const data = await requestJson<MenuCategory[]>("/menu_category");
      setCategories(data);

      if (data.length === 0) {
        setSelectedCategoryId("");
        setMenuItems([]);
        return;
      }

      setSelectedCategoryId((currentId) => {
        if (currentId && data.some((category) => category.id === currentId)) {
          return currentId;
        }

        return data[0].id;
      });
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const loadMenuItems = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setMenuItems([]);
      return;
    }

    setItemsLoading(true);
    setErrorMessage("");

    try {
      const data = await requestJson<MenuItem[]>(`/menu_category/${categoryId}/menu-item`);
      setMenuItems(data);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadMenuItems(selectedCategoryId);
  }, [loadMenuItems, selectedCategoryId]);

  const handleCreateCategory = async () => {
    setRequestBusy(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const createdCategory = await requestJson<MenuCategory | undefined>("/menu_category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setStatusMessage("Category created.");
      await loadCategories();
      if (createdCategory?.id) {
        setSelectedCategoryId(createdCategory.id);
      }
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setRequestBusy(false);
    }
  };

  const handleCreateMenuItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCategoryId) return;
    if (!newItemDraft.name.trim()) {
      setErrorMessage("Menu item name is required.");
      return;
    }

    setRequestBusy(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      await requestJson<MenuItem>(`/menu_category/${selectedCategoryId}/menu-item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItemDraft, name: newItemDraft.name.trim() }),
      });
      setNewItemDraft(emptyItemDraft);
      setStatusMessage("Menu item created.");
      await loadMenuItems(selectedCategoryId);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setRequestBusy(false);
    }
  };

  return (
    <main className="menu-management-page">
      <header className="page-header">
        <p className="eyebrow">Menu management</p>
        <h1>Menus</h1>
      </header>

      {errorMessage && (
        <p className="feedback-message error" role="alert">
          {errorMessage}
        </p>
      )}
      {statusMessage && (
        <p className="feedback-message" role="status">
          {statusMessage}
        </p>
      )}

      <div className="menu-management-layout">
        <aside className="category-sidebar">
          <div className="panel-heading">
            <div>
              <h2>Categories</h2>
              <p>{categories.length} total</p>
            </div>
            <button onClick={handleCreateCategory} disabled={requestBusy}>
              New Category
            </button>
          </div>

          {categoriesLoading ? (
            <p className="empty-state">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="empty-state">No categories exist yet.</p>
          ) : (
            <div className="category-list">
              {categories.map((category, index) => (
                <article
                  className={`category-list-item ${category.id === selectedCategoryId ? "selected" : ""}`}
                  key={category.id}
                >
                  <button
                    className="category-select-button"
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <strong>Menu {index + 1}</strong>
                    <code className="compact-id" title={category.id}>{category.id}</code>
                  </button>
                </article>
              ))}
            </div>
          )}
        </aside>

        <section className="menu-items-panel">
          {selectedCategory ? (
            <>
              <div className="panel-heading">
                <div>
                  <h2>
                    Menu {categories.findIndex((category) => category.id === selectedCategory.id) + 1}
                  </h2>
                  <code className="compact-id" title={selectedCategory.id}>{selectedCategory.id}</code>
                </div>
              </div>

              <form className="menu-item-form" onSubmit={handleCreateMenuItem}>
                <h3>Create menu item</h3>
                <MenuItemFields draft={newItemDraft} onChange={setNewItemDraft} />
                <button type="submit" disabled={requestBusy}>
                  Create Item
                </button>
              </form>

              <div className="menu-item-list">
                <div className="section-heading">
                  <h2>Menu items</h2>
                  <p>{menuItems.length} in selected category</p>
                </div>

                {itemsLoading ? (
                  <p className="empty-state">Loading menu items...</p>
                ) : menuItems.length === 0 ? (
                  <p className="empty-state">This category has no menu items.</p>
                ) : (
                  menuItems.map((item) => {
                    return (
                      <article className="menu-item-card" key={item.id}>
                        <div className="menu-item-header">
                          <div>
                            <span className="card-label">Menu item</span>
                            <strong>{item.name}</strong>
                            <code className="compact-id" title={item.id}>{item.id}</code>
                          </div>
                        </div>

                        <div className="boolean-badge-list">
                          <BooleanBadge active={item.chefsChoice} label="Chef's Choice" />
                          <BooleanBadge active={item.vegetarian} label="Vegetarian" />
                          <BooleanBadge active={item.meat} label="Meat" />
                          <BooleanBadge active={item.fish} label="Fish" />
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <p className="empty-state">Select or create a category to manage menu items.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default MenuPage;
