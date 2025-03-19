// utils/ai-agents-logger.ts
import fs from 'fs';
import path from 'path';
import type { ModelConfig } from '@/lib/ai-agents/types';

/**
 * Logger utility for saving AI Agents processing results
 */
export class AIAgentsLogger {
  private outputDir: string;
  
  constructor(outputDir: string = 'ai_agents_output') {
    this.outputDir = path.resolve(process.cwd(), outputDir);
    this.ensureDirectoryExists();
  }
  
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
  
  /**
   * Log AI Agents processing results
   */
  async logProcessing(params: {
    timestamp: string;
    query: string;
    primaryModel: ModelConfig;
    secondaryModel: ModelConfig;
    primaryResults: any;
    secondaryResults: any;
  }) {
    const { timestamp, query, primaryModel, secondaryModel, primaryResults, secondaryResults } = params;
    
    // Create filename with timestamp and both model names
    const filename = `ai-agents-${timestamp}-${primaryModel.model}-${secondaryModel.model}.json`;
    const filePath = path.join(this.outputDir, filename);
    
    // Create log entry
    const logEntry = {
      timestamp,
      query,
      primary: {
        model: primaryModel,
        results: primaryResults
      },
      secondary: {
        model: secondaryModel,
        results: secondaryResults
      }
    };
    
    // Write to file
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(logEntry, null, 2)
    );
    
    // Append to log file
    const logLine = JSON.stringify({
      timestamp,
      query,
      primaryModel: primaryModel.model,
      secondaryModel: secondaryModel.model
    });
    
    await fs.promises.appendFile(
      path.join(this.outputDir, 'ai-agents-log.jsonl'),
      logLine + '\n'
    );
  }
}

// Export a singleton instance
export const aiAgentsLogger = new AIAgentsLogger();
