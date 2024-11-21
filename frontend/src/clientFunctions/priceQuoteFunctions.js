import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    doc,
    deleteDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const COLLECTION_NAME = 'priceQuotes';


export const fetchUserQuotes = async (userId) => {
    if (!userId) {
        console.error('No userId provided to fetchUserQuotes');
        throw new Error('userId is required');
    }

    try {
        console.log('Fetching quotes for userId:', userId);

        const quotesRef = collection(db, COLLECTION_NAME);
        const q = query(
            quotesRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        console.log('Found quotes:', querySnapshot.size);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate().toLocaleString('en-GB', {
               day:'numeric',month:'numeric',year:'2-digit',
               hour: 'numeric', minute: 'numeric', hour12: false
            })
        }));

    } catch (error) {
        console.error('Error in fetchUserQuotes:', error);
        throw error;
    }
};

export const createQuote = async (quoteData) => {
    try {
        console.log('Attempting to create quote with data:', quoteData);

        // Format the data for Firestore
        const formattedData = {
            ...quoteData,
            createdAt: serverTimestamp(),
            // Convert any numbers to ensure they're numbers, not strings
            total: Number(quoteData.total),
            items: Number(quoteData.items),
            ingredients: quoteData.ingredients.map(ing => ({
                ...ing,
                itemId: String(ing.itemId),
                quantity: Number(ing.quantity)
            }))
        };

        console.log('Formatted data:', formattedData);

        // Add to Firestore
        const docRef = await addDoc(collection(db, COLLECTION_NAME), formattedData);
        console.log('Document created with ID:', docRef.id);

        return docRef.id;
    } catch (error) {
        console.error('Error creating quote:', error);
        throw error;
    }
};

export const updateQuote = async (quoteId, updateData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, quoteId);
        await updateDoc(docRef, updateData);
    } catch (error) {
        console.error('Error updating quote:', error);
        throw error;
    }
};

export const deleteQuote = async (quoteId) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, quoteId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting quote:', error);
        throw error;
    }
};