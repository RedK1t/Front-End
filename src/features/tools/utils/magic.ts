import CryptoJS from "crypto-js";
import he from "he";
import validator from "validator";
import { jwtDecode } from "jwt-decode";

export type MagicResult = {
  type: string;
  decoded: string;
  confidence: number; // 0 to 1
  description: string;
  steps?: MagicResult[]; // For chains
};

// Helper to check if string is printable ASCII/UTF-8
const isPrintable = (str: string): boolean => {
  // Allow some control chars like \n, \r, \t
  return /^[\t\n\r\x20-\x7E\xA0-\xFF]*$/.test(str);
};

// Detectors and Decoders

const detectBase64 = (input: string): MagicResult | null => {
  if (input.length > 4 && input.length % 4 === 0 && validator.isBase64(input)) {
    try {
      const decoded = CryptoJS.enc.Base64.parse(input).toString(
        CryptoJS.enc.Utf8,
      );
      if (decoded && isPrintable(decoded) && decoded !== input) {
        return {
          type: "Base64",
          decoded,
          confidence: 0.9,
          description: "Decoded from Base64",
        };
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const detectBase64Url = (input: string): MagicResult | null => {
  if (input.length > 4 && validator.isBase64(input, { urlSafe: true })) {
    try {
      // Convert to standard base64 to decode if needed, but CryptoJS handles it usually if we massage it
      // Actually validator.isBase64({urlSafe: true}) allows - and _
      let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
      const pad = base64.length % 4;
      if (pad) {
        if (pad === 1) return null; // Invalid padding
        base64 += new Array(5 - pad).join("=");
      }

      const decoded = CryptoJS.enc.Base64.parse(base64).toString(
        CryptoJS.enc.Utf8,
      );
      if (decoded && isPrintable(decoded) && decoded !== input) {
        return {
          type: "Base64Url",
          decoded,
          confidence: 0.85,
          description: "Decoded from URL-safe Base64",
        };
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const detectHex = (input: string): MagicResult | null => {
  // Hex usually comes in pairs.
  if (
    input.length > 2 &&
    input.length % 2 === 0 &&
    validator.isHexadecimal(input)
  ) {
    try {
      const decoded = CryptoJS.enc.Hex.parse(input).toString(CryptoJS.enc.Utf8);
      if (decoded && isPrintable(decoded) && decoded.length > 0) {
        return {
          type: "Hex",
          decoded,
          confidence: 0.8,
          description: "Decoded from Hex",
        };
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const detectUrlEncoded = (input: string): MagicResult | null => {
  // validator doesn't have explicit isUrlEncoded but we can check for %
  if (input.includes("%")) {
    try {
      const decoded = decodeURIComponent(input);
      if (decoded !== input) {
        return {
          type: "URL Encoded",
          decoded,
          confidence: 0.95,
          description: "Decoded from URL encoding",
        };
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const detectHtmlEntities = (input: string): MagicResult | null => {
  if (/&[a-z]+;|&#[0-9]+;|&#x[0-9a-f]+;/i.test(input)) {
    try {
      const decoded = he.decode(input);
      if (decoded !== input) {
        return {
          type: "HTML Entity",
          decoded,
          confidence: 0.9,
          description: "Decoded HTML Entities",
        };
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const detectJson = (input: string): MagicResult | null => {
  const trimmed = input.trim();
  if (validator.isJSON(trimmed)) {
    try {
      const parsed = JSON.parse(trimmed);
      const formatted = JSON.stringify(parsed, null, 2);
      return {
        type: "JSON",
        decoded: formatted,
        confidence: 1.0,
        description: "Formatted JSON",
      };
    } catch {
      // ignore
    }
  }
  return null;
};

const detectJwt = (input: string): MagicResult | null => {
  if (validator.isJWT(input)) {
    try {
      const decoded = jwtDecode(input);
      // We also want the header
      const header = jwtDecode(input, { header: true });

      return {
        type: "JWT",
        decoded: `Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(decoded, null, 2)}`,
        confidence: 1.0,
        description: "Parsed JWT Token",
      };
    } catch {
      // ignore
    }
  }
  return null;
};

// Main function to identify and decode
export const magicDecode = (input: string, depth = 0): MagicResult[] => {
  if (depth > 5 || !input) return [];

  const results: MagicResult[] = [];

  // Try all detectors
  const detectors = [
    detectJwt, // Check JWT first
    detectJson,
    detectBase64,
    detectBase64Url,
    detectHex,
    detectUrlEncoded,
    detectHtmlEntities,
  ];

  for (const detector of detectors) {
    const result = detector(input);
    if (result) {
      // If we found a result, try to chain it!
      const chain = magicDecode(result.decoded, depth + 1);

      if (chain.length > 0) {
        result.steps = chain;
        // If chained, we might update description or confidence
      }

      results.push(result);
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
};
