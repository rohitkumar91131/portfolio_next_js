import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import Experience from "@/models/Experience";
import { EMPLOYMENT_TYPES } from "@/lib/constants";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

// Experience mutations require the admin cookie issued by the OTP login.
const isAdmin = async () => {
    const cookieStore = await cookies();
    return Boolean(cookieStore.get("admin_token"));
};

const URL_PATTERN = /^https?:\/\/[^\s]+\.[^\s]+$/i;

// Validates and normalizes the experience payload.
// Returns { data } on success or { error } on failure.
const validatePayload = (body) => {
    const companyName = String(body.companyName || "").trim();
    const role = String(body.role || "").trim();
    const startDate = body.startDate ? new Date(body.startDate) : null;

    if (!companyName) return { error: "Company name is required" };
    if (!role) return { error: "Role is required" };
    if (!startDate || isNaN(startDate.getTime())) {
        return { error: "A valid start date is required" };
    }

    const isCurrent = Boolean(body.isCurrent);
    let endDate = body.endDate ? new Date(body.endDate) : null;

    if (isCurrent) {
        endDate = null;
    } else if (endDate && isNaN(endDate.getTime())) {
        return { error: "End date is invalid" };
    } else if (endDate && endDate < startDate) {
        return { error: "End date cannot be earlier than start date" };
    }

    const employmentType = EMPLOYMENT_TYPES.includes(body.employmentType)
        ? body.employmentType
        : "Other";

    const companyUrl = String(body.companyUrl || "").trim();
    if (companyUrl && !URL_PATTERN.test(companyUrl)) {
        return { error: "Company URL must be a valid http(s) URL" };
    }

    const data = {
        companyName,
        role,
        employmentType,
        location: String(body.location || "").trim(),
        startDate,
        endDate,
        isCurrent,
        description: String(body.description || "").trim(),
        responsibilities: Array.isArray(body.responsibilities)
            ? body.responsibilities.map((r) => String(r).trim()).filter(Boolean)
            : [],
        technologies: Array.isArray(body.technologies)
            ? body.technologies.map((t) => String(t).trim()).filter(Boolean)
            : [],
        companyUrl,
        displayOrder: Number.isFinite(Number(body.displayOrder))
            ? Number(body.displayOrder)
            : 0,
        isVisible: body.isVisible === undefined ? true : Boolean(body.isVisible),
        updatedAt: new Date(),
    };

    return { data };
};

// GET: Fetch all experiences (public site filters visibility server-side)
export async function GET() {
    try {
        await connectDB();
        const experiences = await Experience.find({}).sort({
            displayOrder: 1,
            startDate: -1,
            createdAt: -1,
        });
        return NextResponse.json({ success: true, data: experiences });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create a new experience (admin only)
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

        const experience = await Experience.create(result.data);
        return NextResponse.json({ success: true, data: experience }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
