import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from 'crypto';

// გავაუქმოთ ყველა მიდლვეარი ამ როუტისთვის
export const config = {
    api: {
        bodyParser: true,
        externalResolver: true,
    },
};

export async function GET() {
    try {
        console.log("Starting public admin setup process...");
        const { db } = await connectToDatabase();

        console.log("Connected to MongoDB");
        console.log("Database name:", process.env.MONGODB_DB);

        // შევამოწმოთ არსებობს თუ არა admin კოლექცია
        const collections = await db.listCollections({ name: "admin" }).toArray();
        console.log("Admin collection exists:", collections.length > 0);

        if (collections.length === 0) {
            await db.createCollection("admin");
            console.log("Admin collection created");
        }

        // შევამოწმოთ არსებობს თუ არა admin მომხმარებელი
        const existingAdmin = await db.collection("admin").findOne({ username: "admin" });
        console.log("Existing admin:", existingAdmin ? "Yes" : "No");

        if (!existingAdmin) {
            // პაროლის ჰეშირება - draftwork231
            const password = "draftwork231";
            const hashedPassword = crypto
                .createHash('sha256')
                .update(password)
                .digest('hex');

            console.log("Hashed password:", hashedPassword);

            // ადმინის დამატება
            const result = await db.collection("admin").insertOne({
                admin_id: 1,
                username: "admin",
                password: hashedPassword
            });

            console.log("Admin created:", result.acknowledged);

            return NextResponse.json({
                status: "success",
                message: "ადმინი წარმატებით შეიქმნა",
                details: {
                    username: "admin",
                    password: "draftwork231"
                }
            });
        } else {
            return NextResponse.json({
                status: "info",
                message: "ადმინი უკვე არსებობს",
                admin: {
                    username: existingAdmin.username,
                    admin_id: existingAdmin.admin_id
                }
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            status: "error",
            message: `სისტემური შეცდომა: ${error instanceof Error ? error.message : 'Unknown error'}`,
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}