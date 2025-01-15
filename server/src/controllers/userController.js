import userServices from "../services/userServices.js";


export const updateUserDetails = async (req, res) => {
    try {
        const { userId ,newDetails} = req.body;
        console.log('userId:', userId);
        const result = await userServices.updateUserDetails(userId, newDetails);
        res.status(200).json({
            success: true,
            data: result,
            error: "User details updated successfully"
        });
    } catch (error) {
        console.error("Update user details error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error updating user details"
        });
    }
}