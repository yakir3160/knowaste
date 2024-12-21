import {db} from '../../config/firebase-admin.js';
import {getMenuCategories} from "../controllers/menuController.js";
import { FieldValue } from 'firebase-admin/firestore';
import {validateSchema} from '../models/index.js';



class MenuService {
    async addMenuItem(data) {
        try {
            console.log('Starting add menu item process');
            // step 1: validate the menu item data
            console.log('Validating menu item data...');
            const validation = await validateSchema('menu', data);
            if (!validation.success) {
                console.error('Validation error:', validation.error);
                throw new Error(validation.error);
            }
            console.log('Menu item data is valid');
            const {userId,menuItemData} = data;
            // Step 2: Get the menu document for the user
            const menuDocRef = db.collection('menus').doc(userId);
            console.log(`Getting menu document for user: ${userId}`);

            const menuDoc = await menuDocRef.get();
            console.log('Menu document fetched:', menuDoc.exists ? 'Exists' : 'Does not exist');

            let menuData;

            // Step 3: Check if the menu document exists or create a new one
            if (!menuDoc.exists) {
                console.log('Menu document does not exist. Creating a new menu document.');
                menuData = {
                    createdAt: FieldValue.serverTimestamp(),
                    menu: {
                        categories: [],
                    },
                    updatedAt: FieldValue.serverTimestamp()
                };
                await menuDocRef.set(menuData);
                console.log('New menu document created.');
            } else {
                menuData = menuDoc.data();
                console.log('Menu document found, using existing data.');
            }

            // Step 4: Find or create the category
            console.log('Looking for category:', menuItemData.categoryId);
            let targetCategory = menuData.menu.categories.find(cat => cat.id === menuItemData.categoryId);

            if (!targetCategory) {
                console.log('Category not found. Creating a new category.');
                if (menuItemData.subcategoryId) {
                    targetCategory = {
                        id: menuItemData.categoryId,
                        name: menuItemData.categoryName,
                        subCategory: [
                            {
                                id: menuItemData.subcategoryId,
                                name: menuItemData.subcategoryName,
                                items: [],
                            },
                        ],
                    };
                } else {
                    targetCategory = {
                        id: menuItemData.categoryId,
                        name: menuItemData.categoryName,
                        items: [],
                    };
                }
                menuData.menu.categories.push(targetCategory);
                console.log('Category created and added to menu.');
            } else {
                console.log('Category found.');
            }

            const newItem = {
                id: menuItemData.id,
                name: menuItemData.name,
                price: menuItemData.price,
                availability: menuItemData.availability,
                ingredients: menuItemData.ingredients,
            };

            // Step 5: Handle subcategory if needed
            if (menuItemData.subcategoryId) {
                console.log('Looking for subcategory:', menuItemData.subcategoryId);
                let targetSubCategory = targetCategory.subCategory?.find(subCat => subCat.id === menuItemData.subcategoryId);
                if (!targetSubCategory) {
                    console.log('Subcategory not found. Creating a new subcategory.');
                    targetSubCategory = {
                        id: menuItemData.subcategoryId,
                        name: menuItemData.subcategoryName,
                        items: []
                    };
                    targetCategory.subCategory = targetCategory.subCategory || [];
                    targetCategory.subCategory.push(targetSubCategory);
                    console.log('Subcategory created and added to category.');
                }

                // Step 6: Create and add new item to subcategory

                console.log('Adding new item to subcategory:', newItem);
                targetSubCategory.items.push(newItem);
            } else {
                // Step 7: Create and add new item directly to category
                console.log('Adding new item directly to category:', newItem);
                targetCategory.items.push(newItem);
            }

            // Step 8: Update the menu document with the new item
            console.log('Updating menu document with new item.');
            await menuDocRef.update({
                menu: menuData.menu,
                updatedAt: FieldValue.serverTimestamp()
            });

            console.log('Menu item added successfully');
            return { success: true, itemId: newItem.id };
        } catch (error) {
            console.error('Error adding menu item:', error);
            return { success: false, error : error.message };
        }
    }

    async getMenuItems() {
        try {
            console.log('Starting get menu items process');

            console.log('Fetching menu items...');
            const menuDocs = await db.collection('menu').get();
            const menuItems = menuDocs.docs.map(menuDoc => menuDoc.data());
            console.log('Menu items fetched successfully');
            return menuItems;
        } catch (error) {
            console.error('Error fetching menu items:', error);
            return [];
        }
    }
    async updateMenuItem(menuItemId, newDetails) {
        try {
            console.log('Starting update menu item process');

            console.log('Fetching menu item...');
            const menuDocRef = db.collection('menu').doc(menuItemId);
            const menuDoc = await menuDocRef.get();
            console.log('Menu item fetched successfully', menuDoc.data());

            console.log('Updating menu item...');
            console.log('newDetails:', newDetails);
            if (menuDoc.exists) {
                await menuDocRef.update(newDetails);
                console.log('Menu item updated successfully');
                return true;
            }
        } catch (error) {
            console.error('Error updating menu item:', error);
            return false;
        }
    }
    async deleteMenuItem(menuItemId) {
        try {
            console.log('Starting delete menu item process');

            console.log('Deleting menu item from database...');
            await db.collection('menu').doc(menuItemId).delete();
            console.log('Menu item deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting menu item:', error);
            return false;
        }
    }
    async getMenuCategories() {
        try {
            console.log('Starting get menu categories process');

            console.log('Fetching menu categories...');
            const menuDocs = await db.collection('menu').get();
            const menuCategories = menuDocs.docs.map(menuDoc => menuDoc.data().category);
            console.log('Menu categories fetched successfully');
            return menuCategories;
        } catch (error) {
            console.error('Error fetching menu categories:', error);
            return [];
        }
    }
    async getMenuItemsByCategory(category) {
        try {
            console.log('Starting get menu items by category process');

            console.log('Fetching menu items...');
            const menuDocs = await db.collection('menu').where('category', '==', category).get();
            const menuItems = menuDocs.docs.map(menuDoc => menuDoc.data());
            console.log('Menu items fetched successfully');
            return menuItems;
        } catch (error) {
            console.error('Error fetching menu items:', error);
            return [];
        }
    }
}
export default new MenuService();