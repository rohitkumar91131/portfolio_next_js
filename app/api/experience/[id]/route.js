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

const validatePayload = (body) => {
    const updates = {};

    if (body.companyName !== undefined) {
        const companyName = String(body.companyName).trim();
        if (!companyName) return { error: "Company name is required" };
        updates.companyName = companyName;
    }
    if (body.role !== undefined) {
        const role = String(body.role).trim();
        if (!role) return { error: "Role is required" };
        updates.role = role;
    }
    if (body.employmentType !== undefined) {
        if (!EMPLOYMENT_TYPES.includes(body.employmentType)) {
            return { error: "Invalid employment type" };
        }
        updates.employmentType = body.employmentType;
    }
    if (body.location !== undefined) {
        updates.location = String(body.location).trim();
    }
    if (body.startDate !== undefined) {
        const startDate = body.startDate ? new Date(body.startDate) : null;
        if (!startDate || isNaN(startDate.getTime())) {
            return { error: "A valid start date is required" };
        }
        updates.startDate = startDate;
    }
    if (body.isCurrent !== undefined) {
        updates.isCurrent = Boolean(body.isCurrent);
    }
    if (body.endDate !== undefined || updates.isCurrent !== undefined) {
        if (updates.isCurrent === true) {
            updates.endDate = null;
        } else {
            const endDate = body.endDate ? new Date(body.endDate) : null;
            if (endDate && isNaN(endDate.getTime())) {
                return { error: "End date is invalid" };
            }
            if (body.endDate !== undefined) {
                updates.endDate = endDate;
            }
        }
    }
    if (updates.startDate && updates.endDate && updates.endDate < updates.startDate) {
        return { error: "End date cannot be earlier than start date" };
    }
    if (body.description !== undefined) {
        updates.description = String(body.description).trim();
    }
    if (body.responsibilities !== undefined) {
        updates.responsibilities = Array.isArray(body.responsibilities)
            ? body.responsibilities.map((r) => String(r).trim()).filter(Boolean)
            : [];
    }
    if (body.technologies !== undefined) {
        updates.technologies = Array.isArray(body.technologies)
            ? body.technologies.map((t) => String(t).trim()).filter(Boolean)
            : [];
    }
    if (body.companyUrl !== undefined) {
        const companyUrl = String(body.companyUrl).trim();
        if (companyUrl && !URL_PATTERN.test(companyUrl)) {
            return { error: "Company URL must be a valid http(s) URL" };
        }
        updates.companyUrl = companyUrl;
    }
    if (body.displayOrder !== undefined) {
        const displayOrder = Number(body.displayOrder);
        if (!Number.isFinite(displayOrder)) {
            return { error: "Display order must be a number" };
        }
        updates.displayOrder = displayOrder;
    }
    if (body.isVisible !== undefined) {
        updates.isVisible = Boolean(body.isVisible);
    }

    updates.updatedAt = new Date();
    return { data: updates };
};

// GET: Fetch single experience by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Experience ID" }, { status: 400 });
        }

        const experience = await Experience.findById(id);

        if (!experience) {
            return NextResponse.json({ success: false, error: "Experience entry not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: experience });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT: Update experience entry by ID (admin only)
export async function PUT(req, { params }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Experience ID" }, { status: 400 });
        }

        const result = validatePayload(body);
        if (result.error) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        const updatedExperience = await Experience.findByIdAndUpdate(
            id,
            { $set: result.data },
            { new: true, runValidators: true }
        );

        if (!updatedExperience) {
            return NextResponse.json({ success: false, error: "Experience entry not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedExperience });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE: Remove experience entry by ID (admin only)
export async function DELETE(req, { params }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Experience ID" }, { status: 400 });
        }

        const deletedExperience = await Experience.findByIdAndDelete(id);

        if (!deletedExperience) {
            return NextResponse.json({ success: false, error: "Experience entry not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Experience entry deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
