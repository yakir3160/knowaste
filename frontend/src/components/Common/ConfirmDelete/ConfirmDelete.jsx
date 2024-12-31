import React from "react";
import Button from "../../Common/Button/Button";
import Card from "../../Common/Card/Card";

const ConfirmDelete = ({ isOpen, onClose, onConfirm, name }) => {
    if (!isOpen) return null;

    return (
        <Card className="bg-base rounded-lg p-6  w-fit border-2 border-errorLightRed grid grid-cols-1 md:grid-cols-2  items-center space-y-4">
            <div className="text-errorRed ">
                <h2 className="text-2xl font-semibold ">
                    Confirm Deletion
                </h2>
                <span className=" text-titles">
                    Are you sure you want to delete  <strong>{name}</strong>?
                    This action cannot be undone.
            </span>
            </div>
            <div className="flex flex-row gap-2 justify-end">
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
        </Card>
    );
};

export default ConfirmDelete;
