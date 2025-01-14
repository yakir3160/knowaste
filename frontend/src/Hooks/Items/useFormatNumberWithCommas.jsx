import { useCallback } from 'react';

const useFormatNumberWithCommas = () => {
    const formatNumberWithCommas = useCallback((number) => {
        return number?.toLocaleString('en-US');
    }, []);

    return formatNumberWithCommas;
};

export default useFormatNumberWithCommas