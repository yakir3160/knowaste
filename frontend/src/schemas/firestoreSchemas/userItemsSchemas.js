// Collection: users/{uid}/ingredients/{ingredientId}
const ingredientDoc = {
    uid: 'string', // מזהה משתמש לבעלות
    id: 'auto-generated', // מזהה ייחודי שנוצר אוטומטית
    name: 'string', // שם המרכיב
    category: 'string', // קטגוריה (לדוגמה: ירקות, בשרים)
    storageType: 'string', // סוג אחסון (לדוגמה: קירור, הקפאה)
    unit: 'string', // יחידת מידה (לדוגמה: ק"ג, יחידה)
    currentStock: 'number', // כמות נוכחית במלאי
    minStockLevel: 'number', // רמת מלאי מינימלית לאזעקות חידוש
    pricePerUnit: 'number', // מחיר ליחידה
    kosherStatus: 'string', // מצב כשרות (לדוגמה: כשר, לא כשר)
    allergens: ['string'], // רשימת אלרגנים פוטנציאליים
    expirationDate: 'timestamp', // תאריך תפוגה
    lastRestockDate: 'timestamp', // תאריך חידוש אחרון
    lastUpdated: 'timestamp', // תאריך עדכון אחרון של המידע
    averageStorageTime: 'number', // משך אחסון ממוצע בימים
    storageConditions: { // תנאי אחסון
        temperature: 'number', // טמפרטורה
        humidity: 'number', // לחות
        light: 'string' // אור
    }
};

// Collection: users/{uid}/userIngredientsList
const userIngredientsListDoc = {
    uid: 'string', // מזהה משתמש
    ingredients: [{ // רשימת המרכיבים למשתמש
        id: 'string', // מזהה המרכיב
        name: 'string', // שם המרכיב
        category: 'string', // קטגוריה
        unit: 'string', // יחידת מידה
        isActive: 'boolean' // האם המרכיב פעיל
    }],
    lastUpdated: 'timestamp' // תאריך עדכון אחרון
};

// Collection: users/{uid}/menu/{menuId}
const menuDoc = {
    uid: 'string', // מזהה משתמש
    id: 'auto-generated', // מזהה ייחודי של התפריט
    categories: [{ // קטגוריות בתפריט
        id: 'string', // מזהה ייחודי לקטגוריה
        name: 'string', // שם הקטגוריה
        subCategories: [{ // תתי קטגוריות
            id: 'string', // מזהה ייחודי לתת קטגוריה
            name: 'string', // שם תת הקטגוריה
            items: [{ // פריטים בתוך תת הקטגוריה
                id: 'string', // מזהה ייחודי לפריט
                name: 'string', // שם הפריט
                description: 'string', // תיאור הפריט
                price: 'number', // מחיר
                ingredients: [{ // מרכיבים בשימוש בפריט
                    ingredientId: 'string', // מזהה המרכיב
                    amount: 'number', // כמות נדרשת
                    unit: 'string' // יחידת מידה
                }],
                isActive: 'boolean', // האם הפריט פעיל
                image: 'string', // קישור לתמונה
                createdAt: 'timestamp', // תאריך יצירה
                updatedAt: 'timestamp' // תאריך עדכון אחרון
            }]
        }]
    }],
    lastUpdated: 'timestamp', // תאריך עדכון אחרון
    version: 'number' // גרסת התפריט
};
