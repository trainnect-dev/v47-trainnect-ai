import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

/**
 * Hook to check if a PostHog feature flag is enabled
 * @param flagKey The key of the feature flag to check
 * @param defaultValue The default value to return if PostHog is not initialized
 * @returns Whether the feature flag is enabled
 */
export function usePostHogFeatureFlag(flagKey: string, defaultValue: boolean = false): boolean {
  const [enabled, setEnabled] = useState<boolean>(defaultValue);

  useEffect(() => {
    try {
      // Check if PostHog is initialized
      if (typeof window !== 'undefined' && posthog && posthog.isFeatureEnabled) {
        const isEnabled = posthog.isFeatureEnabled(flagKey);
        setEnabled(isEnabled ?? defaultValue);
      } else {
        setEnabled(defaultValue);
      }
    } catch (error) {
      // PostHog might not be initialized yet
      console.warn(`Error checking PostHog feature flag ${flagKey}:`, error);
      setEnabled(defaultValue);
    }
  }, [flagKey, defaultValue]);

  return enabled;
}

/**
 * List of feature flags used in the application
 */
export const FEATURE_FLAGS = {
  REASONING_MODE: 'reasoning-mode',
  MULTIMODAL_INPUT: 'vercel-ai-sdk-multi-modal-input',
  SEARCH_TOOLS: 'search-tools',
  TOOL_CALLING: 'tool-calling',
  MEMORY: 'memory',
  CHAT_HISTORY: 'chat-history',
  BRAINTRUST: 'braintrust',
};

/**
 * Capture a PostHog event
 * @param eventName The name of the event to capture
 * @param properties Optional properties to include with the event
 */
export function captureEvent(eventName: string, properties?: Record<string, any>): void {
  try {
    // Check if PostHog is initialized
    if (typeof window !== 'undefined' && posthog && posthog.capture) {
      posthog.capture(eventName, properties);
    } else {
      console.warn('PostHog not initialized, event not captured:', eventName);
    }
  } catch (error) {
    console.warn(`Error capturing PostHog event ${eventName}:`, error);
  }
} 