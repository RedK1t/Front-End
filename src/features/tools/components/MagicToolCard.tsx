import { useState, useEffect } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { magicDecode, type MagicResult } from "../utils/magic";

type MagicToolCardProps = {
  title?: string;
  description?: string;
};

export default function MagicToolCard({
  title = "Magic Decode",
  description = "Automatically detects and decodes various formats like Base64, Hex, URL, and more.",
}: MagicToolCardProps) {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<MagicResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!inputText) {
      setResults([]);
      return;
    }
    const decoded = magicDecode(inputText);
    setResults(decoded);
  }, [inputText]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderChain = (result: MagicResult): string => {
    let label = result.type;
    if (result.steps && result.steps.length > 0) {
      label += " \u2192 " + renderChain(result.steps[0]);
    }
    return label;
  };

  const getFinalDecoded = (result: MagicResult): string => {
    if (result.steps && result.steps.length > 0) {
      return getFinalDecoded(result.steps[0]);
    }
    return result.decoded;
  };

  return (
    <div className="bg-gray rounded-6px flex flex-col gap-4 border border-white/5 p-5 shadow-lg shadow-black/20 transition-colors hover:border-white/10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            <h3 className="mid-text text-white">{title}</h3>
          </div>
          <span className="coding-text text-dark-yellowish-white rounded border border-white/5 bg-white/5 px-3 py-1">
            Auto-Detect
          </span>
        </div>
        {description && (
          <p className="small-text text-dark-yellowish-white/75">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <label className="small-text text-dark-yellowish-white font-semibold">
            Input Text
          </label>
          <textarea
            className="coding-text rounded-6px h-32 w-full resize-none border border-white/10 bg-black p-4 text-white transition-colors placeholder:text-white/20 focus:border-purple-500 focus:outline-none"
            placeholder="Paste text here to automatically detect and decode..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Results Section */}
        {results.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="border-b border-white/10 pb-2">
              <h4 className="normal-text font-semibold text-white">
                Detected Formats
              </h4>
            </div>

            {results.map((result, index) => {
              const finalOutput = getFinalDecoded(result);
              const chainLabel = renderChain(result);

              return (
                <div
                  key={index}
                  className="rounded-6px flex flex-col gap-2 border border-white/5 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-purple-400">
                      {chainLabel}
                    </span>
                    <span className="text-dark-yellowish-white/50 text-xs">
                      Confidence: {Math.round(result.confidence * 100)}%
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      className="coding-text text-green rounded-6px h-24 w-full resize-none border border-white/10 bg-black p-3 text-sm focus:outline-none"
                      readOnly
                      value={finalOutput}
                    />
                    <button
                      onClick={() => handleCopy(finalOutput, index)}
                      className="rounded-6px absolute right-2 bottom-2 cursor-pointer bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <FaCheck size={12} />
                      ) : (
                        <IoCopyOutline size={12} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : inputText ? (
          <div className="text-dark-yellowish-white/50 rounded-6px border border-dashed border-white/10 p-4 text-center italic">
            No familiar formats detected.
          </div>
        ) : null}
      </div>
    </div>
  );
}
