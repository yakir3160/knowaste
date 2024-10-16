import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchCities } from '../RegisterUtils';

export const useCities = () => {
    const [cities, setCities] = useState(['Select a city']);
    const [isLoading, setIsLoading] = useState(true);
    const requestInProgress = useRef(false);

    useEffect(() => {
        const loadCities = async () => {
            if (requestInProgress.current) return;
            try {
                requestInProgress.current = true;
                setIsLoading(true);
                await fetchCities(setCities);
            } catch (error) {
                toast.error('Failed to load cities. Please try again later.');
                console.error('Error loading cities:', error);
            } finally {
                setIsLoading(false);
                requestInProgress.current = false;
            }
        };
        loadCities();

        return () => {
            requestInProgress.current = false;
        };
    }, []);

    return { cities, isLoading };
};
