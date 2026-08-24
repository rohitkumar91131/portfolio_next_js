import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import Version from "@/models/Version";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

// Version mutations require the admin cookie issued by the OTP login.
const isAdmin = async () => {
    const cookieStore = await cookies();
    return Boolean(cookieStore.get("admin_token"));
};

// DELETE: Remove admin metadata for a version (admin only).
// The frozen site build in versions/ is code — it is not deleted.
export async function DELETE(req, { params }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Version ID" }, { status: 400 });
        }

        const deleted = await Version.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ success: false, error: "Version not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Version metadata deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
