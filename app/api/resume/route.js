import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import Resume from "@/models/Resume";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

// Resume mutations require the admin cookie issued by the OTP login.
const isAdmin = async () => {
    const cookieStore = await cookies();
    return Boolean(cookieStore.get("admin_token"));
};

const URL_PATTERN = /^https?:\/\/[^\s]+$/i;

const validatePayload = (body, { partial = false } = {}) => {
    const data = {};

    if (!partial || body.title !== undefined) {
        const title = String(body.title || "").trim();
        if (!title) return { error: "Title is required" };
        data.title = title;
    }
    if (!partial || body.resumeUrl !== undefined) {
        const resumeUrl = String(body.resumeUrl || "").trim();
        if (!resumeUrl) return { error: "Resume URL is required" };
        if (!URL_PATTERN.test(resumeUrl)) {
            return { error: "Resume URL must be a valid http(s) URL" };
        }
        // Stored exactly as provided by the admin.
        data.resumeUrl = resumeUrl;
    }
    if (body.description !== undefined) {
        data.description = String(body.description).trim();
    }
    if (body.isPrimary !== undefined) {
        data.isPrimary = Boolean(body.isPrimary);
    }

    data.updatedAt = new Date();
    return { data };
};

// GET: Fetch all resumes (primary first)
export async function GET() {
    try {
        await connectDB();
        const resumes = await Resume.find({}).sort({ isPrimary: -1, createdAt: -1 });
        return NextResponse.json({ success: true, data: resumes });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create a resume (admin only)
export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();

        const result = validatePayload(body);
        if (result.error) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        // Only ONE primary resume can exist.
        if (result.data.isPrimary) {
            await Resume.updateMany({}, { isPrimary: false });
        }

        let resume = await Resume.create(result.data);

        // Auto-promote the first resume so the public site always has one.
        const primaryCount = await Resume.countDocuments({ isPrimary: true });
        if (primaryCount === 0) {
            resume = await Resume.findByIdAndUpdate(
                resume._id,
                { isPrimary: true },
                { new: true }
            );
        }

        return NextResponse.json({ success: true, data: resume }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
