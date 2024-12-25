export const REQUIRED_MSG = "Field is required";
export const ingredientStorageTypes = [
    'Dry Storage',
    'Refrigerator',
    'Freezer',
    'Room Temperature',
    'Cool and Dark',
    'Vacuum Sealed'
];

export const measurementUnits = [
    'kg',
    'g',
    'l',
    'ml',
    'unit',
];
export const allergenTypes = [
    'MILK',
    'EGGS',
    'FISH',
    'SHELLFISH',
    'TREE_NUTS',
    'PEANUTS',
    'WHEAT',
    'SOYBEANS',
    'SESAME'
];
export const menuCategories = [
    { id: "starters", name: "Starters" }, // מנות פתיחה, כמו סלטים קלים, מרקים, פריכיות
    { id: "salads", name: "Salads" }, // סלטים טריים ומגוון תוספות
    { id: "soups", name: "Soups" }, // מרקים חמים, קרמיים או צחיים
    { id: "main_courses", name: "Main Courses" }, // מנות עיקריות כמו סטייקים, דגים, עוף
    { id: "grill", name: "Grill" }, // מנות בגריל, בשר על הגריל, שיפודים, קבבים
    { id: "fish", name: "Fish" }, // דגים טריים או קפואים, צלויים, מטוגנים או אפויים
    { id: "pasta", name: "Pasta" }, // פסטה במגוון רטבים, פסטה עם בשר, פסטה צמחונית
    { id: "pizza", name: "Pizza" }, // פיצות עם תוספות שונות, מבצק דק או עבה
    { id: "sandwiches", name: "Sandwiches" }, // סנדוויצ'ים, כריכים עם מגוון ממרחים
    { id: "kids_menu", name: "Kids Menu" }, // מנות לילדים, אוכל פשוט ומגוון
    { id: "sides", name: "Sides" }, // תוספות למנות עיקריות, כמו צ'יפס, אורז, ירקות
    { id: "desserts", name: "Desserts" }, // קינוחים, עוגות, גלידות, פירות
    { id: "hot_drinks", name: "Hot Drinks" }, // שתייה חמה כמו קפה, תה, שוקו חם
    { id: "cold_drinks", name: "Cold Drinks" }, // שתייה קרה כמו מים, מיצים, סודה
    { id: "cocktails", name: "Cocktails" }, // קוקטיילים אלכוהוליים ובלי אלכוהול
    { id: "wine", name: "Wine" }, // יינות אדומים, לבנים ורוזה
    { id: "beer", name: "Beer" }, // בירות, בירות מהחבית או בקבוקים
    { id: "appetizers", name: "Appetizers" }, // מנות פתיחה קלות, כמו חטיפים קטנים, מטבלים
    { id: "vegetarian", name: "Vegetarian" }, // מנות צמחוניות או טבעוניות
    { id: "vegan", name: "Vegan" }, // מנות טבעוניות ללא רכיבים מן החי
    { id: "gluten_free", name: "Gluten Free" }, // מנות ללא גלוטן
    { id: "low_calorie", name: "Low Calorie" }, // מנות דלות קלוריות
    { id: "signature_dishes", name: "Signature Dishes" }, // מנות מיוחדות של השף
    { id: "house_specials", name: "House Specials" }, // מנות מומלצות של המסעדה
    { id: "general", name: "General" } // קטגוריה כללית לכל מנות נוספות או מנות שונות
];

export const ingredientCategories = [
    { id: "proteins", name: "Proteins" }, // בשר, עוף, דגים
    { id: "dairy", name: "Dairy" }, // גבינות, חלב
    { id: "produce", name: "Produce" }, // ירקות ופירות
    { id: "grains", name: "Grains" }, // אורז, קמח
    { id: "pantry", name: "Pantry" }, // מוצרי מדף כמו שימורים ותבלינים
    { id: "baking", name: "Baking" }, // קמח, שמרים, שוקולד לאפייה
    { id: "sauces", name: "Sauces" }, // רטבים כמו סויה, קטשופ
    { id: "spices", name: "Spices" }, // מלח, פלפל, תערובות תיבול
    { id: "beverages", name: "Beverages" }, // שתייה קלה, שתייה חריפה
    { id: "frozen", name: "Frozen" }, // ירקות קפואים, בצקים
    { id: "oils", name: "Oils" }, // שמן זית, שמן קנולה
    { id: "condiments", name: "Condiments" }, // חרדל, מיונז
    { id: "dried_goods", name: "Dried Goods" }, // קטניות, אגוזים
    { id: "canned_goods", name: "Canned Goods" }, // שימורי עגבניות, טונה
    { id: "herbs", name: "Herbs" }, // בזיליקום, פטרוזיליה
    { id: "seafood", name: "Seafood" }, // דגים ופירות ים
    { id: "meat", name: "Meat" }, // בשרים טריים או קפואים
    { id: "cheese", name: "Cheese" }, // גבינות מיוחדות, פריזר
    { id: "bread", name: "Bread" }, // לחם, לחמניות, בגטים
    { id: "snacks", name: "Snacks" }, // חטיפים, פיצוחים
    { id: "sweets", name: "Sweets" }, // ממתקים, קינוחים
    { id: "fats", name: "Fats" }, // חמאה, מרגרינה, שמנת
    { id: "alcohol", name: "Alcohol" }, // אלכוהול, יינות
    { id: "general", name: "General" }
];

