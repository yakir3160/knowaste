import React from "react";
import Button from "../../Common/Button/Button";

const ConfirmDelete = ({ isOpen, onClose, onConfirm, name }) => {
    if (!isOpen) return null;

    return (
        <div className="">
            <div className="bg-base rounded-lg p-6 w-full border-2 border-errorLightRed grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  items-center space-y-3">
                <h2 className="text-2xl font-semibold text-titles ">
                    Confirm Deletion
                </h2>
                <span className=" text-titles">
                    Are you sure you want to delete  <strong>{name}</strong>?
                    This action cannot be undone.
                </span>
                <div className="flex flex-row justify-center md:justify-end space-x-2">
                    <Button
                        className=""
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-errorRed py-2 px-4 text-white rounded-lg hover:text-errorLightRed  transition duration-300"
                        onClick={onConfirm}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;
