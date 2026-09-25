import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, conversations, codeSnippets } from "@/db/schema";
import { eq } from "drizzle-orm";

interface CodeSnippet {
  name: string;
  language: string;
  code: string;
  description?: string;
}

interface AIResponse {
  response: string;
  codeSnippets: CodeSnippet[];
}

function generateAIResponse(userMessage: string): AIResponse {
  const lowerMessage = userMessage.toLowerCase();
  const codeSnippets: CodeSnippet[] = [];

  // React component generation
  if (lowerMessage.includes("react") || lowerMessage.includes("component")) {
    codeSnippets.push({
      name: "SampleComponent",
      language: "typescript",
      code: `import React, { useState } from 'react';

export function SampleComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Counter</h1>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Increment
      </button>
    </div>
  );
}`,
      description: "A simple React counter component with TypeScript"
    });
    return {
      response: "I've created a React component for you. This is a simple counter component that demonstrates state management with useState. The component includes TypeScript for type safety, state management with React hooks, Tailwind CSS for styling, and clean reusable code structure. Would you like me to add more features like decrement, reset, or persistence?",
      codeSnippets
    };
  }

  // API route generation
  if (lowerMessage.includes("api") || lowerMessage.includes("endpoint") || lowerMessage.includes("route")) {
    codeSnippets.push({
      name: "apiRoute",
      language: "typescript",
      code: `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const data = { id, message: 'Hello from API' };
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}`,
      description: "A Next.js API route handler with GET and POST methods"
    });
    return {
      response: "I've created a Next.js API route for you. This follows the App Router pattern and includes GET and POST endpoints, proper error handling, TypeScript types, and search parameter handling. This is a solid foundation for building RESTful APIs in Next.js. What specific functionality would you like to add?",
      codeSnippets
    };
  }

  // Database operations
  if (lowerMessage.includes("database") || lowerMessage.includes("db") || lowerMessage.includes("sql") || lowerMessage.includes("query")) {
    codeSnippets.push({
      name: "dbOperations",
      language: "typescript",
      code: `import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0];
}

export async function createUser(data: { name: string; email: string }) {
  const result = await db
    .insert(users)
    .values({ id: crypto.randomUUID(), ...data })
    .returning();
  return result[0];
}

export async function updateUser(id: string, data: Partial<{ name: string; email: string }>) {
  const result = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id));
}`,
      description: "Common database operations using Drizzle ORM"
    });
    return {
      response: "I've created a set of database utility functions using Drizzle ORM. These cover the basic CRUD operations: getAllUsers, getUserById, createUser, updateUser, and deleteUser. These functions follow best practices with proper typing and error handling patterns. Would you like me to add more operations like soft deletes, pagination, or transactions?",
      codeSnippets
    };
  }

  // File/folder exploration
  if (lowerMessage.includes("folder") || lowerMessage.includes("file") || lowerMessage.includes("directory") || lowerMessage.includes("find") || lowerMessage.includes("explore")) {
    codeSnippets.push({
      name: "fileExplorer",
      language: "typescript",
      code: `interface FileInfo {
  name: string;
  path: string;
  isFile: boolean;
  fileType?: string;
  size?: number;
}

export function exploreDirectory(
  rootPath: string,
  options?: { maxDepth?: number; includeHidden?: boolean }
): FileInfo[] {
  const { maxDepth = 10, includeHidden = false } = options || {};
  const results: FileInfo[] = [];
  
  function traverse(path: string, depth: number = 0) {
    if (depth > maxDepth) return;
    results.push({
      name: path.split('/').pop() || path,
      path,
      isFile: path.includes('.'),
      fileType: path.split('.').pop(),
    });
  }
  
  traverse(rootPath);
  return results;
}

export function findFiles(directory: string, pattern: string): string[] {
  const files: string[] = [];
  return files;
}

export function getFileTree(rootPath: string): { name: string; children?: any[]; isFile?: boolean } {
  return {
    name: rootPath.split('/').pop() || rootPath,
    children: [],
  };
}`,
      description: "File and folder exploration utilities"
    });
    return {
      response: "I've created file and folder exploration utilities for you. These functions provide: exploreDirectory for recursive directory traversal with depth limiting, findFiles for searching files matching patterns, and getFileTree for building a hierarchical tree structure. These are conceptual examples that you can adapt for your specific environment. Would you like me to create a specific implementation for your use case?",
      codeSnippets
    };
  }

  // Type definitions
  if (lowerMessage.includes("type") || lowerMessage.includes("interface") || lowerMessage.includes("schema")) {
    codeSnippets.push({
      name: "typeDefinitions",
      language: "typescript",
      code: `export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export function isAdmin(user: User): user is User & { role: 'admin' } {
  return user.role === 'admin';
}

export type UserWithoutSensitiveData = Omit<User, 'email'>;
export type UserInput = Partial<User> & { id?: never };`,
      description: "TypeScript type definitions with examples"
    });
    return {
      response: "I've created comprehensive TypeScript type definitions for a user system. This includes interface definitions, type guards for runtime type checking, and type helpers using Omit and Partial patterns. These types provide type safety throughout your application. Would you like me to create types for a different domain or add more complex patterns like discriminated unions?",
      codeSnippets
    };
  }

  // CSS/Tailwind styling
  if (lowerMessage.includes("css") || lowerMessage.includes("style") || lowerMessage.includes("tailwind") || lowerMessage.includes("design") || lowerMessage.includes("ui")) {
    codeSnippets.push({
      name: "styledComponents",
      language: "typescript",
      code: `import React from 'react';

export function Card({ 
  title, 
  children, 
  className = '' 
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={\`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 \${className}\`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
    >
      {children}
    </button>
  );
}`,
      description: "Reusable React components with Tailwind CSS"
    });
    return {
      response: "I've created reusable React components with Tailwind CSS styling. The code includes a Card component as a flexible container and a Button component with variant and size options. Both components follow best practices with TypeScript props, composable className prop, dark mode support, and focus states for accessibility. Would you like me to create more UI components or customize these further?",
      codeSnippets
    };
  }

  // Function creation
  if (lowerMessage.includes("function") || lowerMessage.includes("create") || lowerMessage.includes("make")) {
    codeSnippets.push({
      name: "utilityFunction",
      language: "typescript",
      code: `/**
 * A utility function example
 * @param input - The input value
 * @returns Processed result
 */
export function processInput<T>(input: T): T {
  return input;
}

/**
 * Async version with error handling
 */
export async function processInputAsync<T>(
  input: T,
  options?: { timeout?: number }
): Promise<T> {
  const { timeout = 5000 } = options || {};
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return input;
  } catch (error) {
    console.error('Processing failed:', error);
    throw new Error('Failed to process input');
  }
}`,
      description: "A TypeScript utility function with async variant"
    });
    return {
      response: "I've created a TypeScript utility function for you with both sync and async variants. The code includes JSDoc documentation, generic type support, async/await pattern, error handling, and configurable options. This is a flexible template you can adapt for various use cases. What specific functionality should this function handle?",
      codeSnippets
    };
  }

  // Default response
  return {
    response: "I'm your AI coding assistant! I can help you with:\n\n**Code Generation**\n- Create functions, components, and utilities\n- Generate API routes and handlers\n- Build database schemas and queries\n\n**File & Folder Exploration**\n- Navigate directory structures\n- Find specific files\n- Organize project layouts\n\n**Best Practices**\n- TypeScript type definitions\n- Clean code patterns\n- Performance optimization\n\nWhat would you like to build today? Just describe what you need, and I'll generate the code for you with no limits!",
    codeSnippets: []
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, message, context } = body;

    if (!conversationId || !message) {
      return NextResponse.json({ error: "conversationId and message are required" }, { status: 400 });
    }

    // Generate AI response
    const { response, codeSnippets: generatedSnippets } = generateAIResponse(message);

    // Create user message
    const userMessage = await db
      .insert(messages)
      .values({
        id: crypto.randomUUID(),
        conversationId,
        role: "user",
        content: message,
      })
      .returning();

    // Create assistant message
    const assistantMessage = await db
      .insert(messages)
      .values({
        id: crypto.randomUUID(),
        conversationId,
        role: "assistant",
        content: response,
      })
      .returning();

    // Save code snippets if any were generated
    const savedSnippets = await Promise.all(
      generatedSnippets.map(async (snippet) => {
        return db
          .insert(codeSnippets)
          .values({
            id: crypto.randomUUID(),
            conversationId,
            messageId: assistantMessage[0].id,
            ...snippet,
          })
          .returning();
      })
    );

    // Update conversation's updatedAt
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({
      message: assistantMessage[0],
      codeSnippets: savedSnippets.map((s) => s[0]),
    });
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
