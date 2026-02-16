import { useMutation } from "@tanstack/react-query";

export default function useExportPdf() {
  const {
    mutate: exportPdf,
    data,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async (html: string) => {
      const response = await fetch(
        import.meta.env.VITE_generateReport_REST_url +
          "//export-pdf?report_html=" +
          html,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.json();
    },
  });

  return {
    exportPdf,
    data,
    isError,
    isSuccess,
  };
}
