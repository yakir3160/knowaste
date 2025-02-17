import { useCallback } from 'react';

const useFormatNumberWithCommas = () => {
    const formatNumberWithCommas = useCallback((number) => {
            return number?.toLocaleString('he-IL');
    }, []);

    return formatNumberWithCommas;
};

export default useFormatNumberWithCommas