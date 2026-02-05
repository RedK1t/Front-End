import ToolCard from "./components/ToolCard";

export default function Tools() {
  return (
    <div className="hide-scrollbar mx-auto flex h-full w-11/12 flex-col gap-8 overflow-y-auto bg-black p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="heading-text text-white">Tools</h1>
        <p className="normal-text text-dark-yellowish-white max-w-2xl">
          A suite of developer utilities designed for quick data manipulation,
          encoding, and formatting tasks.
        </p>
      </div>

      {/* Encoding Utilities Section */}
      <section className="flex flex-col gap-4">
        <div className="border-gray mb-2 flex items-center gap-3 border-b pb-2">
          <h2 className="large-text text-white">Encoding Utilities</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Base64 Tool */}
          <ToolCard
            title="Base64 Encoder"
            description="Universal encoding for data filtration, payload obfuscation, and handling binary data in text-based protocols."
            from="UTF-8"
            to="Base64"
            CryptoJSFrom="Utf8"
            CryptoJSTo="Base64"
          />
          <ToolCard
            title="URL Encoder"
            description="Encodes special characters for safe transmission in web requests. Essential for SQLi, XSS, and Path Traversal payloads."
            urlEncoding={true}
          />
          <ToolCard
            title="PowerShell Encoder"
            description="Generates UTF-16LE Base64 commands. Required for Windows PowerShell -EncodedCommand execution and stagers."
            from="UTF-16LE"
            to="Base64"
            CryptoJSFrom="Utf16LE"
            CryptoJSTo="Base64"
          />
          <ToolCard
            title="Double URL Encoder"
            description="Encodes the percent sign itself to bypass WAFs and security filters that only perform a single decode pass."
            doubleUrlEncoding={true}
          />
          <ToolCard
            title="Base64url Encoder"
            description="URL-safe Base64 variant (+/- and /_). Used in JWTs, OAuth tokens, and modern web API authentication."
            from="UTF-8"
            to="Base64url"
            CryptoJSFrom="Utf8"
            CryptoJSTo="Base64url"
          />
          <ToolCard
            title="Unicode Encoder"
            description="Converts text to \uXXXX escape sequences. Used to hide malicious keywords from static analysis and keyword scanners."
            unicode={true}
          />
          <ToolCard
            title="Hex Encoder"
            description="Converts text to raw hexadecimal bytes. Used for analyzing binary data and formatting shell code for exploit scripts."
            from="UTF-8"
            to="Hex"
            CryptoJSFrom="Utf8"
            CryptoJSTo="Hex"
          />
          <ToolCard
            title="HTML Encoder"
            description="Converts symbols to HTML entities. Used for testing XSS filters and bypasses involving character entity references."
            htmlEncoding={true}
          />
        </div>
      </section>

      {/* Additional   Placeholder */}
      {/* <section className="mt-4 flex flex-col gap-4">
          <div className="border-gray mb-2 flex items-center gap-3 border-b pb-2">
            <h2 className="large-text text-white">More Utilities</h2>
            <span className="small-text text-dark-yellowish-white/40">
              Coming Soon
            </span>
          </div> */}

      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> */}
      {/* Hash Generator Placeholder */}
      {/* <div className="bg-gray/30 hover:bg-gray/50 group rounded-6px flex h-48 cursor-not-allowed flex-col items-center justify-center gap-4 border border-dashed border-white/10 p-6 transition-all hover:border-white/20">
            <div className="bg-orange-transparent text-orange flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="9" y2="9" />
                <line x1="4" x2="20" y1="15" y2="15" />
                <line x1="10" x2="8" y1="3" y2="21" />
                <line x1="16" x2="14" y1="3" y2="21" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="mid-text text-dark-yellowish-white transition-colors group-hover:text-white">
                Hash Generator
              </h3>
              <p className="small-text text-dark-yellowish-white/50 mt-1">
                MD5, SHA-1, SHA-256
              </p>
            </div>
          </div> */}

      {/* URL Encoder Placeholder */}
      {/* <div className="bg-gray/30 hover:bg-gray/50 group rounded-6px flex h-48 cursor-not-allowed flex-col items-center justify-center gap-4 border border-dashed border-white/10 p-6 transition-all hover:border-white/20">
            <div className="bg-cyan-transparent text-cyan flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="mid-text text-dark-yellowish-white transition-colors group-hover:text-white">
                URL Encoder
              </h3>
              <p className="small-text text-dark-yellowish-white/50 mt-1">
                Escape/Unescape URLs
              </p>
            </div>
          </div> */}

      {/* JSON Formatter Placeholder */}
      {/* <div className="bg-gray/30 hover:bg-gray/50 group rounded-6px flex h-48 cursor-not-allowed flex-col items-center justify-center gap-4 border border-dashed border-white/10 p-6 transition-all hover:border-white/20">
            <div className="bg-green-transparent text-green flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="mid-text text-dark-yellowish-white transition-colors group-hover:text-white">
                JSON Formatter
              </h3>
              <p className="small-text text-dark-yellowish-white/50 mt-1">
                Prettify & Validate
              </p>
            </div>
          </div> */}

      {/* JWT Decoder Placeholder */}
      {/* <div className="bg-gray/30 hover:bg-gray/50 group rounded-6px flex h-48 cursor-not-allowed flex-col items-center justify-center gap-4 border border-dashed border-white/10 p-6 transition-all hover:border-white/20">
            <div className="bg-red-transparent text-red flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="mid-text text-dark-yellowish-white transition-colors group-hover:text-white">
                JWT Decoder
              </h3>
              <p className="small-text text-dark-yellowish-white/50 mt-1">
                Parse JWT Tokens
              </p>
            </div>
          </div> */}
      {/* </div> */}
      {/* </section> */}
    </div>
  );
}
