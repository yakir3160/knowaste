import {db} from '../../config/firebase-admin.js';
import { FieldValue } from 'firebase-admin/firestore';
import {validateSchema} from '../models/index.js';


class MenuService {
    async addOrUpdateMenuItem(userId, menuItemData) {
        try {
            console.log('Starting add menu item process');
            console.log('menu item data:', menuItemData);
            // Validate the menu item data
            console.log('Validating menu item data');
            const validation = await validateSchema('menu',  menuItemData );
            if (!validation.success) {
                throw new Error(validation.error);
            }
            console.log('Menu item data is valid');

            console.log('Adding/updating menu item to database...');
            for (const ingredient of menuItemData.ingredients) {
                const inventoryDocRef = db.collection('inventory')
                    .doc(userId)
                    .collection('inventoryItems')
                    .doc(ingredient.ingredientId);
                const inventoryDoc = await inventoryDocRef.get();
                if (!inventoryDoc.exists) {
                    throw new Error(`Ingredient with ID ${ingredient.ingredientId} not found in inventory`);
                }
                await inventoryDocRef.update({
                    quantityForMenu: FieldValue.increment(ingredient.quantity),
                });
            }

            // Reference to the menu items collection
            const menuItemsRef = db.collection('menus').doc(userId).collection('menuItems');

            console.log('Checking if the item already exists...');
            console.log('Item ID:', menuItemData.id);
            // Check if the item already exists
            const existingItemSnapshot = await menuItemsRef.doc(menuItemData.id).get();
            if (existingItemSnapshot.exists) {
                // Update existing item
                await menuItemsRef.doc(menuItemData.id).update(menuItemData);
                console.log('Updated existing menu item');
                return { success: true, message: 'Item updated successfully' };
            } else {
                // Add new item
                await menuItemsRef.doc(menuItemData.id).set(menuItemData);
                console.log('Added new menu item');
                return { success: true, message: 'New item added successfully' };
            }

        } catch (error) {
            console.error('Error adding/updating menu item:', error);
            return { success: false, message: error.message };
        }
    }
    async getMenuItems(userId) {
        try {
            console.log('Fetching all menu items');
            const menuItemsSnapshot = await db.collection('menus').doc(userId).collection('menuItems').get();
            const menuItems = menuItemsSnapshot.docs.map(doc => doc.data());
            const uniqueCategories = [...new Set(menuItems.map(item => item.categoryId))].map(categoryId => ({
                id: categoryId,
                name: menuItems.find(item => item.categoryId === categoryId).categoryName,
            }));

            return {
                success: true,
                data: menuItems,
                categories: uniqueCategories,
                message: 'Menu items fetched successfully'
            };
        } catch (error) {
            console.error('Error fetching menu items:', error);
            return [];
        }
    }

    async getMenuItemsByCategory(userId, categoryId) {
        try {
            console.log(`Fetching menu items for userId: ${userId} and categoryId: ${categoryId}`);

            const menuItemsSnapshot = await db
                .collection('menus')
                .doc(userId)
                .collection('menuItems')
                .where('categoryId', '==', categoryId)
                .get();
            const menuItems = menuItemsSnapshot.docs.map(doc => doc.data());

            if (menuItems.empty) {
                console.log(`No menu items found for categoryId: ${categoryId}`);
                return [];
            }


            console.log(`Menu items for category ${categoryId} fetched successfully:`, menuItems);
            return {
                success: true,
                data: menuItems,
                message: `Menu items for category ${categoryId} fetched successfully`
            };
        } catch (error) {
            console.error('Error fetching menu items by category:', error.message);
            return {
                success: false,
                error: error.message,
            };
        }
    }


    async deleteMenuItem(userId, menuItemId) {
        try {
            console.log(`Deleting menu item: ${menuItemId}`);
            await db.collection('menus').doc(userId).collection('menuItems').doc(menuItemId).delete();
            return true;
        } catch (error) {
            console.error('Error deleting menu item:', error);
            return false;
        }
    }
}

export default new MenuService();