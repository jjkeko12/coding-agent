import { pgTable, text, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Conversations table - stores chat sessions
export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  title: text("title").notNull().default("New Conversation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Messages table - stores individual messages in conversations
export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  metadata: jsonb("metadata").default({}), // Store additional info like code language, file info
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Folders table - stores folder structure for exploration
export const folderStructure = pgTable("folders", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id"),
  name: text("name").notNull(),
  path: text("path").notNull(),
  parentId: text("parent_id"),
  isFile: boolean("is_file").notNull().default(false),
  fileType: text("file_type"), // For files only: 'code', 'text', 'image', etc.
  content: text("content"), // Store file content for code files
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Code snippets table - stores generated code snippets
export const codeSnippets = pgTable("code_snippets", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id"),
  messageId: text("message_id"),
  name: text("name").notNull(),
  language: text("language").notNull(), // 'typescript', 'javascript', 'python', etc.
  code: text("code").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  theme: text("theme").notNull().default("dark"), // 'light' | 'dark'
  defaultLanguage: text("default_language").notNull().default("typescript"),
  showLineNumbers: boolean("show_line_numbers").notNull().default(true),
  fontSize: integer("font_size").notNull().default(14),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Define relations
export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
  folders: many(folderStructure),
  codeSnippets: many(codeSnippets),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const folderStructureRelations = relations(folderStructure, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [folderStructure.conversationId],
    references: [conversations.id],
  }),
  parent: one(folderStructure, {
    fields: [folderStructure.parentId],
    references: [folderStructure.id],
    relationName: "folderHierarchy",
  }),
  children: many(folderStructure, { relationName: "folderHierarchy" }),
}));

export const codeSnippetsRelations = relations(codeSnippets, ({ one }) => ({
  conversation: one(conversations, {
    fields: [codeSnippets.conversationId],
    references: [conversations.id],
  }),
  message: one(messages, {
    fields: [codeSnippets.messageId],
    references: [messages.id],
  }),
}));

// Export types for TypeScript
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Folder = typeof folderStructure.$inferSelect;
export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;
