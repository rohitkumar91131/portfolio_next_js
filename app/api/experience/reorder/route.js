import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import Experience from "@/models/Experience";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

// Reorder requires the admin cookie issued by the OTP login.
const isAdmin = async () => {
    const cookieStore = await cookies();
    return Boolean(cookieStore.get("admin_token"));
};

// POST: Persist the complete experience ordering after a drag-and-drop.
// Body: { items: [{ id: "...", order: 0 }, ...] }
export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { items } = await req.json();

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, error: "items[] is required" }, { status: 400 });
        }

        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.id) || !Number.isFinite(Number(item.order))) {
                return NextResponse.json({ success: false, error: "Invalid items payload" }, { status: 400 });
            }
        }

        const operations = items.map((item) => ({
            updateOne: {
                filter: { _id: item.id },
                update: { $set: { displayOrder: Number(item.order) } },
            },
        }));

        await Experience.bulkWrite(operations);

        return NextResponse.json({ success: true, message: "Order updated" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
