import { db } from '../../config/firebase-admin.js';


class UserService {

    async updateUserDetails(userId, newDetails) {
        try {
            console.log('Starting update user details process');

            console.log('Fetching user details...');
            const userDocRef = db.collection('users').doc(userId);
            const userDoc = await userDocRef.get();
            console.log('User details fetched successfully', userDoc.data());

            console.log('Updating user details...');
            console.log('newDetails:', newDetails);
            if (userDoc.exists) {
                await userDocRef.update(newDetails);
                console.log('User details updated successfully');
                return true;
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            return false;
        }
    }
}
export default new UserService();