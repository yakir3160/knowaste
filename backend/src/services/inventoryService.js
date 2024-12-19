import {db} from '../../config/firebase-admin.js';

class InventoryService {
    async addInventoryItem(inventoryData) {
        try {
            console.log('Starting add inventory process');

            console.log('Adding inventory item to database...');
            await db.collection('inventory').add(inventoryData);
            console.log('Inventory item added successfully');
            return true;
        } catch (error) {
            console.error('Error adding inventory item:', error);
            return false;
        }
    }
    async getInventoryItems() {
        try {
            console.log('Starting get inventory items process');

            console.log('Fetching inventory items...');
            const inventoryDocs = await db.collection('inventory').get();
            const inventoryItems = inventoryDocs.docs.map(inventoryDoc => inventoryDoc.data());
            console.log('Inventory items fetched successfully');
            return inventoryItems;
        } catch (error) {
            console.error('Error fetching inventory items:', error);
            return [];
        }
    }
    async deleteInventoryItem(inventoryItemId) {
        try {
            console.log('Starting delete inventory item process');

            console.log('Deleting inventory item from database...');
            await db.collection('inventory').doc(inventoryItemId).delete();
            console.log('Inventory item deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            return false;
        }
    }
    async updateInventoryItem(inventoryItemId, newDetails) {
        try {
            console.log('Starting update inventory item process');

            console.log('Fetching inventory item...');
            const inventoryDocRef = db.collection('inventory').doc(inventoryItemId);
            const inventoryDoc = await inventoryDocRef.get();
            console.log('Inventory item fetched successfully', inventoryDoc.data());

            console.log('Updating inventory item...');
            console.log('newDetails:', newDetails);
            if (inventoryDoc.exists) {
                await inventoryDocRef.update(newDetails);
                console.log('Inventory item updated successfully');
                return true;
            }
        } catch (error) {
            console.error('Error updating inventory item:', error);
            return false;
        }
    }
}
export default new InventoryService();