
const sideBarTransition = "transition-all duration-200 ease-in-out";

export const sidebarClasses = {
    container: "fixed mx-6 my-5",
    aside: `flex flex-col rounded-lg h-[95vh] bg-secondary shadow-outer-custom ${sideBarTransition}`,
    logoContainer: `overflow-hidden ${sideBarTransition}`,
    button: "z-10 p-2",
    menuList: "flex-grow list-inside text-titles py-5 flex flex-col gap-5 mt-10",
    menuItem: `flex items-center gap-2 p-2 w-full shadow-none hover:bg-base`,
    logout: "text-errorRed border-2 border-[transparent] text-buttons pl-3 hover:text-errorRed hover:bg-errorLightRed hover:border-errorRed",
    itemText: `whitespace-nowrap ${sideBarTransition}`,
    footer: "flex justify-center items-center bg-baseLight h-[10vh] rounded-b-lg",
};
