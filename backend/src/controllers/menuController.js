import MenuService from "../services/menuService.js";

export const addOrUpdateMenuItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { menuItemData } = req.body;
        const result = await MenuService.addOrUpdateMenuItem(userId,menuItemData);
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
            message: result.message || "Menu item added successfully"
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
        const userId = req.user.id;
        const menuItems = await MenuService.getMenuItems(userId);
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
export const deleteMenuItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const  menuItemId  = req.params.id;
        const result = await MenuService.deleteMenuItem(userId,menuItemId);
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
        const { category } = req.query;
        const userId = req.user.id;
        !category && res.status(400).json({
            success: false,
            error: "Category is required",
            message: "Category is required"
        });
        !userId && res.status(400).json({
            success: false,
            error: "User Id is required",
            message: "User Id is required"
        });
        const result = await MenuService.getMenuItemsByCategory(userId,category);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error,
                message: "Failed to fetch menu items"
            });
        }
        res.status(200).json({
            success: true,
            data: result.data,
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
