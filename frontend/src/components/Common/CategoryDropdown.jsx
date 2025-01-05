import { ChevronDown } from 'lucide-react';
import {useState} from "react";

const CategoryDropdown = ({ selectedCategory, setSelectedCategory, inventoryCategories }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-64 text-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-secondary w-full px-6 py-3 rounded-t-sm font-semibold flex justify-center items-center"
            >
                {selectedCategory}
                <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-secondary rounded-b-sm shadow-lg z-50 max-h-60 overflow-y-auto">
                    {inventoryCategories.map(category => (
                        <button
                            key={category}
                            className={`w-full px-6 py-3 text-center hover:bg-secondary ${
                                selectedCategory === category ? 'bg-secondary font-semibold' : ''
                            }`}
                            onClick={() => {
                                setSelectedCategory(category);
                                setIsOpen(false);
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
