import {db} from '../../config/firebase-admin.js';
import {validateSchema} from '../models/index.js';
import * as Yup from "yup";
import {Field} from "formik";

class InventoryService {
    async addOrUpdateInventoryItem(userId, ingredientData) {
        try {

            console.log('Starting add or update inventory process');
            console.log('validating inventory item data');
            const fullData = {
                ...ingredientData ,
                quantityForMenu: 0 ,
                unitForMenu: 0,
                minStockLevel: 0 ,
                currentStock: 0,
                usageStats: {
                    averageDailyUsage: 0,
                    wastePercentage: 0
                },
                wasteHistory: [],
                orderHistory: []
            }
            const validation = await validateSchema('ingredient', fullData);
            if (!validation.success) {
                throw new Error(validation.error);
            }
            console.log('Adding or updating inventory item in database...');
            const inventoryDocRef = db.collection('users')
                .doc(userId)
                .collection('inventoryItems')
                .doc(fullData.ingredientId);
            const inventoryDoc = await inventoryDocRef.get();
            if (inventoryDoc.exists) {
                await inventoryDocRef.update(ingredientData);
                console.log('Inventory item updated successfully');
                return {success: true, message: 'Inventory item updated successfully'};
            } else {
                await inventoryDocRef.set(fullData);
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
    async addNewOrder(userId, ingredientId, orderData) {
        try {
            console.log('Starting add new order process');
            const inventoryDocRef = db.collection('users')
                .doc(userId)
                .collection('inventoryItems')
                .doc(ingredientId);

            const inventoryDoc = await inventoryDocRef.get();
            console.log('Fetching inventory item data...');

            if (!inventoryDoc.exists) {
                throw new Error('ingredient not found');
            }

            const existingData = inventoryDoc.data();
            console.log('Adding new order to database...');
            console.log('Existing data:', existingData);
            console.log('Order data:', orderData);

            const newOrder = {
                quantity: orderData.receivedQuantity,
                receivedDate: orderData.receivedDate || new Date(),
                expirationDate: orderData.expirationDate,
                price: existingData.pricePerUnit*orderData.receivedQuantity,
            };


            const orderHistory = [...(existingData.orderHistory || []), newOrder];
            console.log('Order history:', orderHistory);


            existingData.orderHistory = orderHistory;
            await inventoryDocRef.update(existingData);
            await this.updateCurrentStock(userId, ingredientId, orderData.receivedQuantity);
            return {
                success: true,
                message: 'Order added successfully',
            };

        } catch (error) {
            console.error('Error adding new order:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateCurrentStock(userId, ingredientId, quantityChange) {
        console.log('Updating current stock...');
        try {
            const inventoryDocRef = db.collection('users')
                .doc(userId)
                .collection('inventoryItems')
                .doc(ingredientId);

            const inventoryDoc = await inventoryDocRef.get();

            if (!inventoryDoc.exists) {
                throw new Error('ingredient not found');
            }

            const existingData = inventoryDoc.data();
            existingData.currentStock =(existingData.currentStock || 0) + quantityChange;
            await inventoryDocRef.set(existingData);
            console.log( 'Current stock updated successfully');

            return {
                success: true,
                message: 'Stock updated successfully',
            };

        } catch (error) {
            console.error('Error updating current stock:', error);
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
            const inventoryDocs = await db.collection('users').doc(userId).collection('inventoryItems').get();
            const inventoryItems = inventoryDocs.docs.map(doc => doc.data());
            const uniqueCategories = [...new Set(inventoryItems.map(item => item.categoryName))];
            uniqueCategories.sort();
            inventoryItems.sort((a, b) => a.name.localeCompare(b.name));
            console.log('Inventory items fetched successfully');

            return {success: true, data: inventoryItems, categories: uniqueCategories};
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
            await db.collection('users').doc(userId).collection('inventoryItems').doc(inventoryItemId).delete();
            console.log('Inventory item deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            return false;
        }
    }
}
export default new InventoryService();