// utils/tavily-logger.ts
import fs from 'fs';
import path from 'path';

/**
 * Logger utility for saving Tavily search results to files
 */
export class TavilyLogger {
  private outputDir: string;
  
  constructor(outputDir: string = 'tavily_output') {
    // Resolve the output directory path
    this.outputDir = path.resolve(process.cwd(), outputDir);
    
    // Ensure the output directory exists
    this.ensureDirectoryExists();
  }
  
  /**
   * Ensure the output directory exists
   */
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
  
  /**
   * Log Tavily search results to a file
   * @param query The search query
   * @param results The search results
   * @param model The model used for the search (if applicable)
   */
  public logSearchResults(query: string, results: any, model?: string): void {
    try {
      // Create a timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const modelInfo = model ? `-${model.replace(/[^a-zA-Z0-9-]/g, '-')}` : '';
      const filename = `tavily-search-${timestamp}${modelInfo}.json`;
      const filePath = path.join(this.outputDir, filename);
      
      // Create the log data
      const logData = {
        timestamp: new Date().toISOString(),
        model,
        query,
        results
      };
      
      // Write the log data to a file
      fs.writeFileSync(filePath, JSON.stringify(logData, null, 2));
      
      console.log(`Tavily search results logged to ${filePath}`);
    } catch (error) {
      console.error('Error logging Tavily search results:', error);
    }
  }
  
  /**
   * Append Tavily search results to a consolidated log file
   * @param query The search query
   * @param results The search results
   * @param model The model used for the search (if applicable)
   */
  public appendToConsolidatedLog(query: string, results: any, model?: string): void {
    try {
      const logFilePath = path.join(this.outputDir, 'tavily-search-log.jsonl');
      
      // Create the log entry
      const logEntry = {
        timestamp: new Date().toISOString(),
        model,
        query,
        results
      };
      
      // Append the log entry to the file
      fs.appendFileSync(
        logFilePath, 
        JSON.stringify(logEntry) + '\n'
      );
    } catch (error) {
      console.error('Error appending to consolidated Tavily log:', error);
    }
  }
}

// Export a singleton instance with the default output directory
export const tavilyLogger = new TavilyLogger();
