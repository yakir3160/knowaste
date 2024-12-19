import {db} from '../../config/firebase-admin.js';

class MenuService {
    async addMenuItem(menuItemData) {
        try {
            console.log('Starting add menu item process');

            console.log('Adding menu item to database...');
            await db.collection('menu').add(menuItemData);
            console.log('Menu item added successfully');
            return true;
        } catch (error) {
            console.error('Error adding menu item:', error);
            return false;
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
}
export default new MenuService();