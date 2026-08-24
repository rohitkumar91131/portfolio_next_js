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

// Validates and normalizes partial updates.
const validatePayload = (body) => {
    const data = {};

    if (body.title !== undefined) {
        const title = String(body.title).trim();
        if (!title) return { error: "Title is required" };
        data.title = title;
    }
    if (body.resumeUrl !== undefined) {
        const resumeUrl = String(body.resumeUrl).trim();
        if (!resumeUrl) return { error: "Resume URL is required" };
        if (!URL_PATTERN.test(resumeUrl)) {
            return { error: "Resume URL must be a valid http(s) URL" };
        }
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

// GET: Fetch single resume by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Resume ID" }, { status: 400 });
        }

        const resume = await Resume.findById(id);

        if (!resume) {
            return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: resume });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT: Update resume (admin only). Setting isPrimary=true demotes all others.
export async function PUT(req, { params }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Resume ID" }, { status: 400 });
        }

        const result = validatePayload(body);
        if (result.error) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        if (result.data.isPrimary) {
            await Resume.updateMany({ _id: { $ne: id } }, { isPrimary: false });
        }

        const resume = await Resume.findByIdAndUpdate(
            id,
            { $set: result.data },
            { new: true, runValidators: true }
        );

        if (!resume) {
            return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: resume });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE: Remove resume (admin only)
export async function DELETE(req, { params }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Resume ID" }, { status: 400 });
        }

        const deleted = await Resume.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Resume deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
