import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../utils/createClient";
import { Category } from "../types";
import { verifyToken } from "../middleware/authMiddleware";
import { Controller, handler } from "../middleware/handler";

export const runtime = "edge";

const getAllCategories: Controller = async () => {
    try {
        // Fetch categories from the database
        const { data: categories, error } = await supabase
            .from("categories")
            .select("*")
            .returns<Category[]>();

        if (error) {
            console.error("Error fetching categories:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Return the categories
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

export const GET = handler(verifyToken, getAllCategories);
