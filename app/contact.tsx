import { ContactFormData, contactFormSchema } from "@/schemas/contact.schema";
import { Button, Host, TextField } from "@expo/ui/swift-ui";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
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

      // Validate form data
      contactFormSchema.parse(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success
      Alert.alert(
        "Message Sent!",
        "Thank you for reaching out! I'll get back to you soon.",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setFormData({
                name: "",
                email: "",
                phone: "",
                message: "",
              });
              setErrors({});
              setTouched({});
              setFormKey((prev) => prev + 1);
            },
          },
        ]
      );
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
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-950"
        contentContainerClassName="p-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Send me message
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
            Do you have a challenging project in mind, or do you have a
            question? Let&apos;s talk!
          </Text>
        </View>

        <View
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-6"
          key={formKey}
        >
          {/* Name Field */}
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Name
            </Text>
            <Host matchContents>
              <TextField
                defaultValue={formData.name}
                onChangeText={(text) => handleFieldChange("name", text)}
                autocorrection={false}
                placeholder="John Doe"
              />
            </Host>
            {errors.name && touched.name && (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </Text>
            )}
          </View>

          {/* Email Field */}
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Text>
            <Host matchContents>
              <TextField
                defaultValue={formData.email}
                onChangeText={(text) => handleFieldChange("email", text)}
                keyboardType="email-address"
                autocorrection={false}
                placeholder="john@example.com"
              />
            </Host>
            {errors.email && touched.email && (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Phone Field */}
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number{" "}
              <Text className="text-gray-500 dark:text-gray-500 font-normal">
                (Optional)
              </Text>
            </Text>
            <Host matchContents>
              <TextField
                defaultValue={formData.phone}
                onChangeText={(text) => handleFieldChange("phone", text)}
                keyboardType="phone-pad"
                placeholder="+1 (555) 000-0000"
              />
            </Host>
            {errors.phone && touched.phone && (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.phone}
              </Text>
            )}
          </View>

          {/* Message Field */}
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </Text>
            <Host matchContents>
              <TextField
                defaultValue={formData.message}
                onChangeText={(text) => handleFieldChange("message", text)}
                multiline
                placeholder="Tell me about your project or question..."
              />
            </Host>
            {errors.message && touched.message && (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.message}
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <View className="pt-4">
            <Host matchContents>
              <Button
                variant="default"
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </Host>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
