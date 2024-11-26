import { RiLoader5Line } from "react-icons/ri";

const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
            <RiLoader5Line
                className={`size-20 md:size-[100px] animate-spin text-titles border-4 border-lime rounded-[20px] md:rounded-[30px] bg-white shadow-outer-custom p-2`}
            />
            <p className="mt-4 text-xl md:text-3xl font-semibold text-titles p-5 animate-pulse">Loading...</p>
        </div>
    );
};

export default Loading;
