import {db} from '../../config/firebase-admin.js';
import {validateSchema} from '../models/index.js';

class InventoryService {
    async addOrUpdateInventoryItem(userId, ingredientData) {
        try {
            console.log('Starting add or update inventory process');
            console.log('validating inventory item data');
            const validation = await validateSchema('ingredient', ingredientData);
            if (!validation.success) {
                throw new Error(validation.error);
            }
            console.log('Adding or updating inventory item in database...');
            const inventoryDocRef = db.collection('inventory')
                .doc(userId)
                .collection('inventoryItems')
                .doc(ingredientData.id.toString());
            const inventoryDoc = await inventoryDocRef.get();
            if (inventoryDoc.exists) {
                await inventoryDocRef.update(ingredientData);
                console.log('Inventory item updated successfully');
                return {success: true, message: 'Inventory item updated successfully'};
            } else {
                await inventoryDocRef.set(ingredientData);
                console.log('Inventory item added successfully');
                return {success: true, message: 'Inventory item added successfully'};
            }
        } catch (error) {
            console.error('Error adding or updating inventory item:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getInventoryItems(userId) {
        try {
            console.log('Starting get inventory items process');

            console.log('Fetching inventory items...');
            const inventoryDocs = await db.collection('inventory').doc(userId).collection('inventoryItems').get();
            const inventoryItems = inventoryDocs.docs.map(doc => doc.data());
            console.log('Inventory items fetched successfully');
            return {success: true, data: inventoryItems};
        } catch (error) {
            console.error('Error fetching inventory items:', error);
            return [];
        }
    }

    async deleteInventoryItem(userId, inventoryItemId) {
        try {
            console.log('Starting delete inventory item process');

            console.log('Deleting inventory item from database...');
            console.log('Inventory item ID:', inventoryItemId);
            console.log('User ID:', userId);
            await db.collection('inventory').doc(userId).collection('inventoryItems').doc(inventoryItemId).delete();
            console.log('Inventory item deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            return false;
        }
    }
}
export default new InventoryService();