import Database from 'better-sqlite3';
import path from 'path';

// Initialize database in the db directory
const dbPath = path.join(process.cwd(), 'db', 'chat-history.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create messages table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    conversation_id TEXT NOT NULL,
    chat_type TEXT NOT NULL,
    metadata TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_conversation_timestamp 
  ON messages(conversation_id, timestamp);
  CREATE INDEX IF NOT EXISTS idx_chat_type 
  ON messages(chat_type);
`);

// Prepare statements for better performance
const stmts = {
  insertMessage: db.prepare(`
    INSERT INTO messages (id, role, content, timestamp, conversation_id, chat_type, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  
  getMessagesByConversation: db.prepare(`
    SELECT * FROM messages 
    WHERE conversation_id = ?
    ORDER BY timestamp ASC
  `),
  
  getAllConversations: db.prepare(`
    SELECT DISTINCT conversation_id, 
    MIN(timestamp) as start_time,
    COUNT(*) as message_count,
    chat_type,
    MAX(CASE WHEN metadata IS NOT NULL THEN metadata ELSE NULL END) as metadata
    FROM messages 
    GROUP BY conversation_id 
    ORDER BY start_time DESC
  `),

  getConversationsByType: db.prepare(`
    SELECT DISTINCT conversation_id, 
    MIN(timestamp) as start_time,
    COUNT(*) as message_count,
    chat_type,
    MAX(CASE WHEN metadata IS NOT NULL THEN metadata ELSE NULL END) as metadata
    FROM messages 
    WHERE chat_type = ?
    GROUP BY conversation_id 
    ORDER BY start_time DESC
  `),
};

export { db, stmts };
