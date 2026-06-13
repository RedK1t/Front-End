import type { CompanyInfo } from "../hooks/useGetCompInfo";
import InfoRow from "./InfoRow";
import { motion } from "motion/react";
import type { ReactNode } from "react";

type CompanyInfoProps = {
  data: CompanyInfo | null;
};

function InfoRowAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

export default function CompanyInfoView({ data }: CompanyInfoProps) {
  if (!data) {
    return (
      <p className="text-red text-center">No company information available.</p>
    );
  }

  const sections = [
    { label: "Company Name", value: data.companyName },
    { label: "Industry", value: data.industry },
    { label: "Headquarters", value: data.headquarters },
    { label: "Year Founded", value: data.yearFounded },
    { label: "Founders", value: data.founders?.join("\n") },
    { label: "Key Executives", value: data.keyExecutives?.join("\n") },
    { label: "Website", value: data.website },
    { label: "Description", value: data.description },
    {
      label: "Services & Products",
      value: data.servicesAndProducts?.join("\n"),
    },
    { label: "Contact Email", value: data.contactEmail },
    { label: "Contact Phone", value: data.contactPhone },
    {
      label: "Social Media",
      value: data.socialMedia
        ? Object.entries(data.socialMedia)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        : null,
    },
    { label: "Employee Count", value: data.employeeCount },
    { label: "Revenue", value: data.revenue },
    { label: "Parent Company", value: data.parentCompany },
    { label: "Subsidiaries", value: data.subsidiaries?.join("\n") },
    { label: "Stock Symbol", value: data.stockSymbol },
    { label: "Certifications", value: data.certifications?.join("\n") },
    { label: "Awards", value: data.awards?.join("\n") },
  ];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-3"
    >
      {sections
        .filter((section) => section.value !== null && section.value !== "")
        .map((section) => (
          <InfoRowAnimation key={section.label}>
            <InfoRow label={section.label} value={section.value || ""} />
          </InfoRowAnimation>
        ))}
    </motion.div>
  );
}
