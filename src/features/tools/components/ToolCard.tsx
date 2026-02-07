import CryptoJS from "crypto-js";
import he from "he";
import { IoCopyOutline, IoClipboardOutline } from "react-icons/io5";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

type ToolCardProps = {
  title: string;
  from?: string;
  to?: string;
  description?: string;

  CryptoJSFrom?: keyof typeof CryptoJS.enc;
  CryptoJSTo?: keyof typeof CryptoJS.enc;

  htmlEncoding?: true;

  urlEncoding?: true;

  doubleUrlEncoding?: true;

  unicode?: true;
};
export default function ToolCard({
  title,
  from,
  to,
  description,
  CryptoJSFrom,
  CryptoJSTo,
  urlEncoding,
  htmlEncoding,
  doubleUrlEncoding,
  unicode,
}: ToolCardProps) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);

  const handleEncode = (text: string) => {
    if (urlEncoding) {
      return encodeURIComponent(text);
    }

    if (doubleUrlEncoding) {
      return encodeURIComponent(encodeURIComponent(text));
    }

    if (CryptoJSFrom && CryptoJSTo) {
      return CryptoJS.enc[CryptoJSTo].stringify(
        CryptoJS.enc[CryptoJSFrom].parse(text),
      );
    }

    if (htmlEncoding) {
      return he.encode(text);
    }

    if (unicode) {
      return text
        .split("")
        .map((char) => {
          // Get the character code and convert to Hex
          const hex = char.charCodeAt(0).toString(16).padStart(4, "0");
          return "\\u" + hex;
        })
        .join("");
    }

    return text;
  };

  const handleDecode = (text: string) => {
    if (urlEncoding) {
      return decodeURIComponent(text);
    }

    if (doubleUrlEncoding) {
      return decodeURIComponent(decodeURIComponent(text));
    }

    if (CryptoJSFrom && CryptoJSTo) {
      return CryptoJS.enc[CryptoJSFrom].stringify(
        CryptoJS.enc[CryptoJSTo].parse(text),
      );
    }

    if (htmlEncoding) {
      return he.decode(text);
    }

    if (unicode) {
      return text.replace(/\\u([\dA-F]{4})/gi, (_, group) => {
        return String.fromCharCode(parseInt(group, 16));
      });
    }

    return text;
  };
  return (
    <div className="bg-gray rounded-6px flex flex-col gap-4 border border-white/5 p-5 shadow-lg shadow-black/20 transition-colors hover:border-white/10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red h-8 w-2 rounded-full"></div>
            <h3 className="mid-text text-white">{title}</h3>
          </div>
          {from && to && (
            <span className="coding-text text-dark-yellowish-white rounded border border-white/5 bg-white/5 px-3 py-1">
              {from} &harr; {to}
            </span>
          )}
        </div>
        {description && (
          <p className="small-text text-dark-yellowish-white/75">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="relative flex flex-col gap-2">
          <label className="small-text text-dark-yellowish-white font-semibold">
            Input Text
          </label>
          <textarea
            className="coding-text focus:border-red rounded-6px h-32 w-full resize-none border border-white/10 bg-black p-4 text-white transition-colors placeholder:text-white/20 focus:outline-none"
            placeholder="Paste text here to encode or decode..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                setInputText(text);
                setPasted(true);
                setTimeout(() => setPasted(false), 2000);
              } catch (err) {
                console.error("Failed to read clipboard:", err);
              }
            }}
            className="rounded-6px absolute right-3 bottom-3 cursor-pointer bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            title="Paste from clipboard"
          >
            {pasted ? <FaCheck /> : <IoClipboardOutline />}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setOutputText(handleEncode(inputText));
              setCopied(false);
            }}
            className="bg-red hover:bg-red/75 normal-text rounded-6px flex-1 cursor-pointer py-2.5 font-bold text-white transition-all hover:shadow-[0_0_15px_var(--color-button-glow)] active:scale-[0.98]"
          >
            Encode
          </button>
          <button
            onClick={() => {
              setOutputText(handleDecode(inputText));
              setCopied(false);
            }}
            className="bg-gray normal-text rounded-6px flex-1 cursor-pointer border border-white/10 py-2.5 font-bold text-white transition-all hover:bg-white/5 active:scale-[0.98]"
          >
            Decode
          </button>
        </div>

        <div className="relative flex flex-col gap-2">
          <label className="small-text text-dark-yellowish-white font-semibold">
            Output Result
          </label>
          <textarea
            className="coding-text text-green rounded-6px h-32 w-full resize-none border border-white/10 bg-black p-4 focus:outline-none"
            readOnly
            value={outputText}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(outputText);
              setCopied(true);
            }}
            className="rounded-6px absolute right-3 bottom-3 cursor-pointer bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            title="Copy to clipboard"
          >
            {copied ? <FaCheck /> : <IoCopyOutline />}
          </button>
        </div>
      </div>
    </div>
  );
}
