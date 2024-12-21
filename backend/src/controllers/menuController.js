import MenuService from "../services/menuService.js";

export const addMenuItem = async (req, res) => {
    try {
        const {userId} = req.user;
        const { menuItemData } = req.body;
        const result = await MenuService.addMenuItem(userId,menuItemData);
        res.status(200).json({
            success: true,
            data: result,
            error: "Menu item added successfully"
        });
    } catch (error) {
        console.error("Add menu item error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding menu item"
        });
    }
}
export const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuService.getMenuItems();
        res.status(200).json({
            success: true,
            data: menuItems,
            error: "Menu items fetched successfully"
        });
    } catch (error) {
        console.error("Get menu items error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching menu items"
        });
    }
}
export const updateMenuItem = async (req, res) => {
    try {
        const { menuItemId, newDetails } = req.body;
        const result = await MenuService.updateMenuItem(menuItemId, newDetails);
        res.status(200).json({
            success: true,
            data: result,
            error: "Menu item updated successfully"
        });
    } catch (error) {
        console.error("Update menu item error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error updating menu item"
        });
    }
}
export const deleteMenuItem = async (req, res) => {
    try {
        const { menuItemId } = req.body;
        const result = await MenuService.deleteMenuItem(menuItemId);
        res.status(200).json({
            success: true,
            data: result,
            error: "Menu item deleted successfully"
        });
    } catch (error) {
        console.error("Delete menu item error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error deleting menu item"
        });
    }
}
export const getMenuItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const menuItems = await MenuService.getMenuItemsByCategory(category);
        res.status(200).json({
            success: true,
            data: menuItems,
            error: "Menu items fetched successfully"
        });
    } catch (error) {
        console.error("Get menu items by category error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching menu items"
        });
    }
}
export const getMenuCategories = async (req, res) => {
    try {
        const menuCategories = await MenuService.getMenuCategories();
        res.status(200).json({
            success: true,
            data: menuCategories,
            error: "Menu categories fetched successfully"
        });
    } catch (error) {
        console.error("Get menu categories error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching menu categories"
        });
    }
}