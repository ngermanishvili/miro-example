import { schema } from "@/lib/schema";
import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Generate a verification token
      const verificationToken = uuidv4();

      // Create user with verification token and hashed password
      const user = await db.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          password: hashedPassword, // Store hashed password
          verificationToken,
          // Email not verified yet
          emailVerified: null,
        },
      });

      // Send verification email
      await sendVerificationEmail(user.email as string, verificationToken);
    },
    successMessage:
      "Signed up successfully. Please check your email for verification instructions.",
  });
};

export { signUp };
