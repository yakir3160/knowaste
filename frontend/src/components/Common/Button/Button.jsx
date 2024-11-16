import React, { useMemo } from 'react';
// ייבוא React ו-useMemo (פונקציה לשיפור ביצועים שמזכירה חישובים רק כשיש שינויים)
import { Link } from 'react-router-dom';
// ייבוא קומפוננטת Link לניווט בין דפים ב-React Router
import './Button.css';
// ייבוא קובץ CSS של הכפתור

// פונקציית Button שמקבלת פרופס שונים, כולל className, style, disabled ועוד
const Button = ({children, className = '', style = {}, disabled, to, state, onClick, type = 'button'}) => {

    // שימוש ב-useMemo כדי לחשב את ה-className הסופי רק אם className או style משתנים
    const combinedClassName = useMemo(() => {
        // בודקים האם קיימים צבע טקסט, צל, צבע רקע וריפוד מתוך className או style
        const hasTextColor = className.includes('text-') || style.color;
        const hasShadow = className.includes('shadow-') || style.boxShadow;
        const hasHover = className.includes('hover:') || style.hover;
        const hasBgColor = className.includes('bg-') || style.backgroundColor;
        const hasPadding = className.includes('p-') || style.Padding;
        const hasBorderRadius = className.includes('rounded-') || style.borderRadius;

        // בניית מחרוזת ה-className עם ערכים דיפולטיים במידה ואין אותם
        return `
          button

          ${className} 
         
          hover:text-buttons 
          ${!hasBgColor ? 'bg-secondary' : ''} 
          ${!hasHover ? 'hover:text-buttons hover:shadow-button-hover  transition-hover duration-500' : ''}
          ${!hasTextColor ? 'text-titles' : ''} 
          ${!hasShadow ? 'shadow-outer-custom' : ''} 
          ${!hasPadding ? 'px-[17px] py-[13px]' : ''} 
          ${!hasBorderRadius ? 'rounded-sm' : ''}
        `.trim();
        // .trim() להסרת רווחים מיותרים
    }, [className, style.color, style.boxShadow]);
    // הקשב לשינויים ב-className, צבע טקסט או צל לצורך מחשוב מחדש של ה-className המשולב

    // פרופס כלליים שמשותפים ל-<button> או ל-<Link>
    const commonProps = {
        className: combinedClassName,
        style,
        onClick: !disabled ? onClick : undefined, // מבטל onClick אם הכפתור מנוטרל (disabled)
        'aria-disabled': disabled // מאפשר תמיכה טובה יותר בנגישות עבור כפתורים מנוטרלים
    };
    // אם קיים 'to', זהו כפתור שנראה כמו קישור (<Link>)
    // אחרת, זהו כפתור רגיל (<button>)
    return (
        <>
            {to ? (
                <Link to={to} state={state} {...commonProps}>
                    {children}
                </Link>
            ) : (
                <button {...commonProps} disabled={disabled} type={type}>
                    {children}
                </button>
            )}
        </>
    );

};

export default Button;
