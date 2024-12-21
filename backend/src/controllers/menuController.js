import MenuService from "../services/menuService.js";

export const addMenuItem = async (req, res) => {
    try {
        const result = await MenuService.addMenuItem(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error,
                message: "Failed to add menu item"
            });
        }

        return res.status(201).json({
            success: true,
            data: result,
            message: "Menu item added successfully"
        });
    } catch (error) {
        console.error("Add menu item error in controller:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Internal server error",
            message: "Error adding menu item"
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