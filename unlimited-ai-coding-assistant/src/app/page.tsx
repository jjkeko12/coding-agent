"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Folder,
  File,
  MessageSquare,
  Plus,
  Trash2,
  Code,
  Terminal,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Settings,
  Moon,
  Sun,
  Search,
  Hash,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface FolderItem {
  id: string;
  name: string;
  path: string;
  isFile: boolean;
  fileType?: string;
  content?: string;
  children?: FolderItem[];
  expanded?: boolean;
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [showFolders, setShowFolders] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
      loadFolders(currentConversationId);
    }
  }, [currentConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !currentConversationId) {
        setCurrentConversationId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const loadFolders = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/folders?conversationId=${conversationId}`);
      const data = await res.json();
      setFolders(data);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const createConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      const data = await res.json();
      setConversations([data, ...conversations]);
      setCurrentConversationId(data.id);
      setMessages([]);
      setFolders([]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      setConversations(conversations.filter((c) => c.id !== id));
      if (currentConversationId === id) {
        setCurrentConversationId(conversations[0]?.id || null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentConversationId || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConversationId,
          message: userMessage.content,
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, expanded: !f.expanded } : f
      )
    );
  };

  const renderFolderTree = (folderItems: FolderItem[], level = 0) => {
    return folderItems.map((folder) => (
      <div key={folder.id} style={{ paddingLeft: level * 16 }}>
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors ${
            folder.isFile ? "opacity-80" : ""
          }`}
          onClick={() => !folder.isFile && toggleFolder(folder.id)}
        >
          {folder.isFile ? (
            <File className="w-4 h-4 text-blue-400" />
          ) : (
            folder.expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )
          )}
          <span className="text-sm text-gray-300">{folder.name}</span>
        </div>
        {folder.children && folder.expanded && (
          <div>{renderFolderTree(folder.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const createFolderStructure = async () => {
    if (!currentConversationId) return;

    const rootFolder = {
      id: crypto.randomUUID(),
      name: "project-root",
      path: "/project-root",
      isFile: false,
      expanded: true,
      children: [
        {
          id: crypto.randomUUID(),
          name: "src",
          path: "/project-root/src",
          isFile: false,
          expanded: true,
          children: [
            { id: crypto.randomUUID(), name: "components", path: "/project-root/src/components", isFile: false, expanded: false },
            { id: crypto.randomUUID(), name: "app", path: "/project-root/src/app", isFile: false, expanded: false },
            { id: crypto.randomUUID(), name: "lib", path: "/project-root/src/lib", isFile: false, expanded: false },
            { id: crypto.randomUUID(), name: "types.ts", path: "/project-root/src/types.ts", isFile: true, fileType: "typescript" },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: "public",
          path: "/project-root/public",
          isFile: false,
          expanded: false,
          children: [
            { id: crypto.randomUUID(), name: "images", path: "/project-root/public/images", isFile: false, expanded: false },
            { id: crypto.randomUUID(), name: "favicon.ico", path: "/project-root/public/favicon.ico", isFile: true, fileType: "image" },
          ],
        },
        { id: crypto.randomUUID(), name: "package.json", path: "/project-root/package.json", isFile: true, fileType: "json" },
        { id: crypto.randomUUID(), name: "tsconfig.json", path: "/project-root/tsconfig.json", isFile: true, fileType: "json" },
        { id: crypto.randomUUID(), name: "README.md", path: "/project-root/README.md", isFile: true, fileType: "markdown" },
      ],
    };

    setFolders([rootFolder]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CodeCraft AI
            </h1>
            <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Unlimited AI Coding Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Conversations */}
        <aside className={`w-64 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-r flex flex-col`}>
          <div className="p-3 border-b border-gray-700/50">
            <button
              onClick={createConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setCurrentConversationId(conv.id)}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conv.id
                    ? theme === "dark"
                      ? "bg-gray-700"
                      : "bg-blue-50"
                    : theme === "dark"
                    ? "hover:bg-gray-700/50"
                    : "hover:bg-gray-100"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="flex-1 truncate text-sm">{conv.title}</span>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full mb-4">
                  <Terminal className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to CodeCraft AI</h2>
                <p className={`max-w-md ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Your unlimited AI coding assistant. I can help you generate code, explore folders, and solve any programming challenge.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6 max-w-lg">
                  {[
                    { icon: Code, text: "Create a React component" },
                    { icon: Terminal, text: "Generate an API route" },
                    { icon: Folder, text: "Explore folder structure" },
                    { icon: Hash, text: "Define TypeScript types" },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(item.text)}
                      className={`p-3 rounded-lg border ${
                        theme === "dark"
                          ? "border-gray-700 hover:bg-gray-800"
                          : "border-gray-200 hover:bg-gray-100"
                      } transition-colors text-left`}
                    >
                      <item.icon className="w-5 h-5 mb-2 text-blue-400" />
                      <span className="text-sm">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : theme === "dark"
                        ? "bg-gray-800"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"} rounded-2xl px-4 py-3`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t`}>
            <div className={`flex items-end gap-2 p-2 rounded-xl ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to generate code, explore folders, or help with anything..."
                className={`flex-1 bg-transparent resize-none outline-none text-sm max-h-32 py-2 px-2 ${
                  theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
                }`}
                rows={1}
                style={{ minHeight: "24px" }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>

        {/* Folder Explorer Panel */}
        {showFolders && (
          <aside className={`w-72 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-l flex flex-col`}>
            <div className={`p-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-sm">Explorer</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={createFolderStructure}
                  className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                  title="Create sample folder structure"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowFolders(false)}
                  className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3">
              <div className={`flex items-center gap-2 p-2 rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent outline-none text-sm ${
                    theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {folders.length === 0 ? (
                <div className="text-center py-8">
                  <Folder className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                    No folders yet
                  </p>
                  <button
                    onClick={createFolderStructure}
                    className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                  >
                    Create sample structure
                  </button>
                </div>
              ) : (
                renderFolderTree(folders)
              )}
            </div>
          </aside>
        )}

        {!showFolders && (
          <button
            onClick={() => setShowFolders(true)}
            className={`w-12 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-l flex items-center justify-center`}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}
