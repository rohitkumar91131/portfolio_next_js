import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import Version from "@/models/Version";
import { getAllVersions } from "@/lib/versions";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

// Version mutations require the admin cookie issued by the OTP login.
const isAdmin = async () => {
    const cookieStore = await cookies();
    return Boolean(cookieStore.get("admin_token"));
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const validatePayload = (body) => {
    const data = {};

    if (body.slug !== undefined) {
        const slug = String(body.slug).trim().toLowerCase();
        if (!SLUG_PATTERN.test(slug)) {
            return { error: "Slug must be lowercase letters/numbers separated by hyphens" };
        }
        data.slug = slug;
    }
    if (body.name !== undefined) {
        const name = String(body.name).trim();
        if (!name) return { error: "Name is required" };
        data.name = name;
    }
    if (body.versionNumber !== undefined) {
        data.versionNumber = String(body.versionNumber).trim();
    }
    if (body.date !== undefined) {
        data.date = String(body.date).trim();
    }
    if (body.description !== undefined) {
        data.description = String(body.description).trim();
    }
    if (body.designPhilosophy !== undefined) {
        data.designPhilosophy = String(body.designPhilosophy).trim();
    }
    if (body.technologies !== undefined) {
        data.technologies = Array.isArray(body.technologies)
            ? body.technologies.map((t) => String(t).trim()).filter(Boolean)
            : [];
    }
    if (body.skills !== undefined) {
        data.skills = Array.isArray(body.skills)
            ? body.skills.map((s) => String(s).trim()).filter(Boolean)
            : [];
    }
    if (body.thumbnail !== undefined) {
        const thumbnail = String(body.thumbnail).trim();
        if (thumbnail && !/^https?:\/\/[^\s]+$|^\/[^\s]*$/i.test(thumbnail)) {
            return { error: "Thumbnail must be a URL or an absolute path" };
        }
        data.thumbnail = thumbnail;
    }
    if (body.isCurrent !== undefined) {
        data.isCurrent = Boolean(body.isCurrent);
    }
    if (body.isPublic !== undefined) {
        data.isPublic = Boolean(body.isPublic);
    }
    if (body.displayOrder !== undefined) {
        const displayOrder = Number(body.displayOrder);
        if (!Number.isFinite(displayOrder)) {
            return { error: "Display order must be a number" };
        }
        data.displayOrder = displayOrder;
    }

    data.updatedAt = new Date();
    return { data };
};

// GET: All versions (registry defaults merged with admin metadata)
export async function GET() {
    try {
        const versions = await getAllVersions();
        return NextResponse.json({ success: true, data: versions });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create/update admin metadata for a version (admin only).
// Saving against a registry slug creates its database record.
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
        if (!result.data.slug) {
            return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
        }
        if (!result.data.name) {
            return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
        }

        // Only ONE version can be current.
        if (result.data.isCurrent) {
            await Version.updateMany({ slug: { $ne: result.data.slug } }, { isCurrent: false });
        }

        const version = await Version.findOneAndUpdate(
            { slug: result.data.slug },
            { $set: result.data },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: version }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
