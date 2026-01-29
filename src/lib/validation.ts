import { z } from "zod";

// WhatsApp phone number validation (E.164 format)
// Allows optional + prefix, followed by country code and number
// Minimum 7 digits, maximum 15 digits
export const whatsappSchema = z
  .string()
  .min(1, "WhatsApp number is required")
  .regex(
    /^\+?[1-9]\d{6,14}$/,
    "Please enter a valid phone number (e.g., +1234567890)"
  );

// Full name validation
// Allows letters, spaces, hyphens, and apostrophes
// Minimum 2 characters, maximum 100 characters
export const fullNameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(
    /^[a-zA-Z\u00C0-\u017F\s'-]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

// Membership lead form schema
export const membershipLeadSchema = z.object({
  fullName: fullNameSchema,
  whatsapp: whatsappSchema,
});

// Type for the validated lead form data
export type MembershipLeadFormData = z.infer<typeof membershipLeadSchema>;

// Generic error message mapper for database errors
export function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred";
  
  const err = error as { code?: string; message?: string };
  
  // Map common PostgreSQL error codes to user-friendly messages
  switch (err.code) {
    case "23505":
      return "This record already exists";
    case "23503":
      return "Invalid reference. Please try again";
    case "23514":
      // Check constraint violation
      if (err.message?.includes("whatsapp")) {
        return "Please enter a valid phone number (e.g., +1234567890)";
      }
      if (err.message?.includes("fullname")) {
        return "Please enter a valid name (2-100 characters)";
      }
      return "Invalid data format. Please check your input";
    case "42501":
      return "You don't have permission to perform this action";
    case "PGRST301":
      return "Session expired. Please refresh and try again";
    default:
      // Don't expose internal error messages
      return "An error occurred. Please try again";
  }
}

// Sanitize string input by trimming and removing control characters
export function sanitizeString(input: string): string {
  return input
    .trim()
    // Remove control characters except spaces
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}
