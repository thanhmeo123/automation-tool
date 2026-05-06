"use client";

import { useState } from "react";
import { generateContentAction } from "../actions/studio-actions";
import { createQueueItem } from "@/features/queue/actions/queue-actions";
import { type GenerateContentInput } from "../schema/studio.schema";
import { Bot, Sparkles, Send, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function StudioPage() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] =
    useState<GenerateContentInput["platform"]>("blog");
  const [tone, setTone] =
    useState<GenerateContentInput["tone"]>("professional");
  const [length, setLength] =
    useState<GenerateContentInput["length"]>("medium");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isAddingToQueue, setIsAddingToQueue] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedText("");

    const result = await generateContentAction({
      prompt,
      platform,
      tone,
      length,
    });

    if (result.success && result.data) {
      setGeneratedText(result.data);
    } else {
      setError(result.error || "Failed to generate content");
    }

    setIsGenerating(false);
  }

  async function handleAddToQueue() {
    if (!generatedText) return;

    setIsAddingToQueue(true);
    const formData = new FormData();
    formData.append("content", generatedText);
    formData.append("platform", platform);

    try {
      await createQueueItem(formData);
      router.push("/queue");
    } catch (err) {
      console.error(err);
      setError("Failed to add to queue");
    } finally {
      setIsAddingToQueue(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-3">
            <Bot className="w-8 h-8 text-indigo-500" />
            AI Content Studio
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Generate high-quality content for your platforms using advanced AI
            models.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Prompt */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    What do you want to write about?
                  </label>
                  <textarea
                    className="w-full min-h-[120px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                    placeholder="e.g. A post about the top 5 frontend trends in 2024..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                  />
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Platform
                  </label>
                  <select
                    className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={platform}
                    onChange={(e) =>
                      setPlatform(
                        e.target.value as GenerateContentInput["platform"],
                      )
                    }
                  >
                    <option value="blog">Blog Post</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Tone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Tone
                    </label>
                    <select
                      className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={tone}
                      onChange={(e) =>
                        setTone(e.target.value as GenerateContentInput["tone"])
                      }
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="humorous">Humorous</option>
                      <option value="inspirational">Inspirational</option>
                    </select>
                  </div>

                  {/* Length */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Length
                    </label>
                    <select
                      className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={length}
                      onChange={(e) =>
                        setLength(
                          e.target.value as GenerateContentInput["length"],
                        )
                      }
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Content
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Preview Area */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="h-14 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Generated Preview
                </span>

                {generatedText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                    <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="animate-pulse">
                      AI is crafting your content...
                    </p>
                  </div>
                ) : generatedText ? (
                  <div className="prose prose-zinc dark:prose-invert max-w-none whitespace-pre-wrap">
                    {generatedText}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                    <Bot className="w-12 h-12 mb-4 opacity-20" />
                    <p>Your generated content will appear here.</p>
                  </div>
                )}
              </div>

              {generatedText && (
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
                  <button
                    onClick={handleAddToQueue}
                    disabled={isAddingToQueue}
                    className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {isAddingToQueue ? (
                      "Adding..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send to Content Queue
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
