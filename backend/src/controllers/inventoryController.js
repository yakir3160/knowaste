import InventoryService from "../services/inventoryService.js";

export const addOrUpdateInventoryItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const  ingredientData  = req.body;
        const result = await InventoryService.addOrUpdateInventoryItem(userId,ingredientData);
        if (!result.success) {
            throw {
                status: 500,
                message: result.error
            };
        }
        res.status(200).json({
            success: true,
            data: result,
            error: "Inventory item added successfully"
        });
    } catch (error) {
        console.error("Add inventory item error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding inventory item"
        });
    }
}
export const getInventoryItems = async (req, res) => {
    try {
        const inventoryItems = await InventoryService.getInventoryItems();
        res.status(200).json({
            success: true,
            data: inventoryItems,
            error: "Inventory items fetched successfully"
        });
    } catch (error) {
        console.error("Get inventory items error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching inventory items"
        });
    }
}
export const deleteInventoryItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        const result = await InventoryService.deleteInventoryItem(itemId);
        res.status(200).json({
            success: true,
            data: result,
            error: "Inventory item deleted successfully"
        });
    } catch (error) {
        console.error("Delete inventory item error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error deleting inventory item"
        });
    }
}
export const updateInventoryItem = async (req, res) => {
    try {
        const { itemId, newDetails } = req.body;
        const result = await InventoryService.updateInventoryItem(itemId, newDetails);
        res.status(200).json({
            success: true,
            data: result,
            error: "Inventory item updated successfully"
        });
    } catch (error) {
        console.error("Update inventory item error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error updating inventory item"
        });
    }
}
