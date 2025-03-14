// Mock for @/lib/posthog
const FEATURE_FLAGS = {
  MULTIMODAL_INPUT: 'vercel-ai-sdk-multi-modal-input'
};

const useFeatureFlag = jest.fn().mockImplementation((flag) => {
  if (flag === FEATURE_FLAGS.MULTIMODAL_INPUT) {
    return true;
  }
  return false;
});

module.exports = {
  FEATURE_FLAGS,
  useFeatureFlag
};
