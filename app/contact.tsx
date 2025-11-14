import { ContactFormData, contactFormSchema } from "@/schemas/contact.schema";
import {
  Button,
  Form,
  Host,
  Section,
  Text,
  TextField,
} from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import { Alert } from "react-native";
import { ZodError } from "zod";

export default function Tab() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Real-time validation function
  const validateField = (field: keyof ContactFormData, value: string) => {
    try {
      // Validate just this field
      contactFormSchema.shape[field].parse(value);
      // Clear error if validation passes
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.issues[0]?.message || "Invalid input",
        }));
      }
    }
  };

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Mark field as touched on first change
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }

    // Validate immediately if already touched
    if (touched[field] || value.length > 0) {
      validateField(field, value);
    }
  };
  const handleSubmit = async () => {
    try {
      setErrors({});
      setIsSubmitting(true);

      // Check if form is empty
      if (!formData.name && !formData.email && !formData.message) {
        Alert.alert(
          "Please Check Your Form",
          "Please check the form again before submitting.",
          [{ text: "OK" }]
        );
        return;
      }

      // Validate form data
      contactFormSchema.parse(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form first
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
      setTouched({});
      setFormKey((prev) => prev + 1);

      // Show success alert after state update
      setTimeout(() => {
        Alert.alert(
          "Message Sent!",
          "Thank you for reaching out! I'll get back to you soon.",
          [{ text: "OK" }]
        );
      }, 100);
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        Alert.alert(
          "Please Check Your Form",
          "Please check the form again before submitting.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Host style={{ flex: 1 }} key={formKey}>
      <Form>
        <Section title="Get in Touch">
          <Text>
            Have a project in mind or just want to chat? I&apos;d love to hear
            from you.
          </Text>
        </Section>

        <Section title="Contact Information">
          <TextField
            onChangeText={(text) => handleFieldChange("name", text)}
            autocorrection={false}
            placeholder="Your Name"
          />
          {errors.name && touched.name && (
            <Text
              size={13}
              modifiers={[foregroundStyle({ type: "color", color: "#FF3B30" })]}
            >
              {errors.name}
            </Text>
          )}

          <TextField
            onChangeText={(text) => handleFieldChange("email", text)}
            keyboardType="email-address"
            autocorrection={false}
            placeholder="Email Address"
          />
          {errors.email && touched.email && (
            <Text
              size={13}
              modifiers={[foregroundStyle({ type: "color", color: "#FF3B30" })]}
            >
              {errors.email}
            </Text>
          )}

          <TextField
            onChangeText={(text) => handleFieldChange("phone", text)}
            keyboardType="phone-pad"
            placeholder="Phone Number (Optional)"
          />
          {errors.phone && touched.phone && (
            <Text
              size={13}
              modifiers={[foregroundStyle({ type: "color", color: "#FF3B30" })]}
            >
              {errors.phone}
            </Text>
          )}
        </Section>

        <Section title="Your Message">
          <TextField
            onChangeText={(text) => handleFieldChange("message", text)}
            multiline={true}
            placeholder="Tell me about your project or question..."
          />
          {errors.message && touched.message && (
            <Text
              size={13}
              modifiers={[foregroundStyle({ type: "color", color: "#FF3B30" })]}
            >
              {errors.message}
            </Text>
          )}
        </Section>

        <Section title="">
          <Button
            variant="glassProminent"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
          <Text>I typically respond within 24-48 hours</Text>
        </Section>
      </Form>
    </Host>
  );
}
