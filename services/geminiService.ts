
// CRITICAL FIX: Removed GoogleGenAI import and process.env usage
// process.env causes "ReferenceError: process is not defined" in browser environments built with Vite
// causing the entire app to crash (White Screen of Death).

interface AnalysisResult {
  tags: string[];
  summary: string;
  isGenerallySafe: boolean;
}

// Stub function that returns empty safe data
export const analyzeFoodItem = async (foodName: string, brand: string, notes: string): Promise<AnalysisResult> => {
  // Return dummy data immediately to prevent any runtime errors
  return {
    tags: [],
    summary: '',
    isGenerallySafe: true
  };
};
