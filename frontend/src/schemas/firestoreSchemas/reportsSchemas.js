// Collection: users/{uid}/reports/sales
const salesReportDoc = {
    uid: "string", // מזהה משתמש
    reportId: "auto-generated", // מזהה ייחודי לדוח
    date: "timestamp", // תאריך הדוח
    createdAt: "timestamp", // תאריך יצירת הדוח
    updatedAt: "timestamp", // תאריך עדכון הדוח
    status: "string", // סטטוס הדוח ('draft', 'submitted', 'approved')
    items: [{ // פריטים בדוח המכירות
        id: "string", // מזהה פריט
        category: "string", // קטגוריה
        subCategory: "string", // תת קטגוריה
        menuItem: "string", // שם הפריט בתפריט
        quantity: "number", // כמות שנמכרה
        totalPrice: "number" // מחיר כולל לפריט
    }],
    summary: { // סיכום הדוח
        totalItems: "number", // סך הפריטים שנמכרו
        totalSales: "number", // סך כל המכירות
        totalSalesPreTax: "number", // סך המכירות לפני מס
        tax: "number" // מס
    },
};


// Collection: users/{uid}/reports/waste
const wasteReportDoc = {
    uid: "string", // מזהה משתמש
    reportId: "auto-generated", // מזהה ייחודי לדוח
    date: "timestamp", // תאריך הדוח
    createdAt: "timestamp", // תאריך יצירת הדוח
    updatedAt: "timestamp", // תאריך עדכון הדוח
    status: "string", // סטטוס הדוח ('draft', 'submitted', 'approved')
    items: [{ // פריטים בדוח הפסולת
        ingredientId: "string", // מזהה מרכיב
        ingredientName: "string", // שם המרכיב
        quantity: "number", // כמות שנזרקה
        unit: "string", // יחידת מידה
        reason: "string", // סיבה: 'expired', 'damaged', 'quality', 'overproduction', 'storage', 'other'
        cost: "number" // עלות הפסולת
    }],
    summary: { // סיכום הדוח
        totalItems: "number", // סך הפריטים שנזרקו
        totalCost: "number" // סך עלות הפסולת
    },
};



// Collection: users/{uid}/quotes
const priceQuoteDoc = {
    uid: "string", // מזהה משתמש
    quoteId: "auto-generated", // מזהה ייחודי להצעה
    date: "timestamp", // תאריך יצירת ההצעה
    createdAt: "timestamp", // תאריך יצירת ההצעה
    updatedAt: "timestamp", // תאריך עדכון ההצעה
    status: "string", // סטטוס ('draft', 'pending', 'approved', 'rejected')
    businessName: "string", // שם העסק
    items: [{ // פריטים בהצעת המחיר
        ingredientId: "string", // מזהה מרכיב
        category: "string", // קטגוריה
        quantity: "number", // כמות נדרשת
        unit: "string", // יחידת מידה
        notes: "string", // הערות
        pricePerUnit: "number", // מחיר ליחידה
        totalPrice: "number" // מחיר כולל לפריט
    }],
    summary: { // סיכום ההצעה
        totalItems: "number", // סך הפריטים בהצעה
        subtotal: "number", // סך כל הסכום לפני מס
        total: "number" // סך כולל
    },
    metadata: { // פרטי מטא
        createdBy: "string", // יוצר ההצעה
        lastUpdated: "timestamp", // תאריך עדכון אחרון
        version: "number" // גרסת ההצעה
    }
};
