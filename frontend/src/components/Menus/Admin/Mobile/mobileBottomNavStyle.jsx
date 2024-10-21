
export const buttonClass = (path, currentPath) => `
    flex flex-col items-center text-center font-bold bg-[transparent] shadow-none
    p-3 rounded-2xl w-full 
    ${currentPath === path ? "bg-secondary border-2 border-lime" : "border-2 border-[transparent]"}
`;
