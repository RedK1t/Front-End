import { useMutation } from "@tanstack/react-query";
import type { vulnerabilities } from "@/features/AI-Scanner/types";

export interface ReportResponse {
  target_url: string;
  /** Unique id of this generated report — included in the download links. */
  report_id?: string;
  markdown_content: string;
  html_content: string;
  downloads: {
    md: string | null;
    docx: string | null;
    pdf: string | null;
  };
}

// Findings for the current user's current target are sent so the report is built
// from per-user, per-target data (never a global last-scan).
export type GenerateReportPayload = {
  target_url?: string;
  vulnerabilities?: vulnerabilities;
};

export default function useGenerateReport() {
  const {
    mutate: generateReport,
    data,
    isError,
    isPending,
    isSuccess,
    reset,
  } = useMutation<ReportResponse, Error, GenerateReportPayload | void>({
    mutationFn: async (payload) => {
      const response = await fetch(
        import.meta.env.VITE_generateReport_REST_url + "/generate-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload ?? {}),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      return response.json();
    },
  });

  return {
    generateReport,
    data,
    isError,
    isPending,
    isSuccess,
    reset,
  };
}
