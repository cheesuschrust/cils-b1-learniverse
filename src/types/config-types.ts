
import { AppConfig } from "@/config/appConfig";

export type { AppConfig };

export type AppLevel = AppConfig["levels"][number];
export type AppFeature = keyof AppConfig["features"];
export type AppColor = keyof AppConfig["branding"]["colors"];
export type AppTestimonial = AppConfig["marketing"]["testimonials"][number];
export type AppMarketingFeature = AppConfig["marketing"]["features"][number];

/**
 * Helper type for accessing the app configuration
 */
export type ConfigKey<T extends keyof AppConfig> = AppConfig[T];
