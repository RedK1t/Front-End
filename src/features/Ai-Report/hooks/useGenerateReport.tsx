import { useMutation } from "@tanstack/react-query";

export interface ReportResponse {
  target_url: string;
  markdown_content: string;
  html_content: string;
  downloads: {
    md: string | null;
    docx: string | null;
    pdf: string | null;
  };
}

export default function useGenerateReport() {
  const {
    mutate: generateReport,
    data,
    isError,
    isPending,
    isSuccess,
  } = useMutation<ReportResponse, Error, { target_url?: string } | void>({
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
  };
}
