import React, { useState } from 'react';
import { fullMenu } from '../MockData/MenuItems';
import { useItemsContext } from '../contexts/ItemsContext';
import { v4 as generateUniqueID } from 'uuid';
import Button from './Common/Button/Button';


const BulkAddMenuItems = () => {
    const {addMenuItem} = useItemsContext();
    const [isLoading, setIsLoading] = useState(false);
    const handleBulkAdd = async () => {
        setIsLoading(true);
        fullMenu.map(item => {
            const formattedItem = {
                ...item,
                menuItemId: generateUniqueID(),

            };
            try {
                addMenuItem(formattedItem);
                console.log(`Added: ${item.name}`);
            } catch (error) {
                console.log(`Failed to add: ${item.name}`);
            }
        })
    }

    return (
        <Button
            onClick={handleBulkAdd}
            disabled={isLoading}
            className="bg-lime"
        >
            {isLoading ? 'Adding...' : 'Add All Menu Items'}
        </Button>
    );
}
export default BulkAddMenuItems;