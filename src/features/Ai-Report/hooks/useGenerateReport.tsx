import { useMutation } from "@tanstack/react-query";

interface ReportData {
  name: string;
  target_url: string;
  severity: string;
  cvss_score: number;
  cwe_id: string;
  description: string;
  poc: string;
  impact: string;
  remediation: string;
  references: string;
  reporter_name: string;
  owasp_category: string;
}

export default function useGenerateReport() {
  const {
    mutate: generateReport,
    data,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async (reportData: ReportData) => {
      const response = await fetch(
        import.meta.env.VITE_generateReport_REST_url + "/generate-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData),
        },
      );
      return response.json();
    },
  });

  return {
    generateReport,
    data,
    isError,
    isSuccess,
  };
}
