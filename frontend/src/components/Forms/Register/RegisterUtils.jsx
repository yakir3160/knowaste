

export const fetchCities = async (setCities) => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/royts/israel-cities/master/israel-cities.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const cityNames = data.map(city => city.english_name)
            .filter(name => name && name.trim() !== "")
            .map(name => name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            )
            .sort();

        // הוספת האפשרות לבחירת ברירת מחדל
        setCities(['Select a city', ...cityNames]);

    } catch (err) {
        console.error('Error fetching cities:', err);
        setCities(['Error fetching cities']); // הוספת אופציה להציג הודעת שגיאה ברשימה
    }
};


export const validatePassword = (value, setPasswordStatus) => {
    const lengthValid = value.length >= 8;
    const uppercaseValid = /[A-Z]/.test(value);
    const lowercaseValid = /[a-z]/.test(value);
    const numberValid = /[0-9]/.test(value);
    const specialCharValid = /[@$!%*?&]/.test(value);

    setPasswordStatus({
        length: lengthValid,
        uppercase: uppercaseValid,
        lowercase: lowercaseValid,
        number: numberValid,
        specialChar: specialCharValid,
    });

    return value;
};