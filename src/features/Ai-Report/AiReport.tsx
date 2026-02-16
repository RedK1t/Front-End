import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaBug, FaLink, FaListOl, FaShieldAlt, FaUser } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { MdCategory, MdCode, MdDescription, MdSecurity } from "react-icons/md";
import InputField from "./components/InputField";
import useGenerateReport from "./hooks/useGenerateReport";
// import useExportPdf from "./hooks/useExportPdf";

type SeverityOption = "critical" | "high" | "medium" | "low" | "info" | "";

export default function AiReport() {
  const [vulnerabilityName, setVulnerabilityName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [severity, setSeverity] = useState<SeverityOption>("");
  const [cvssScore, setCvssScore] = useState("");
  const [cweId, setCweId] = useState("");
  const [owaspCategory, setOwaspCategory] = useState("");
  const [description, setDescription] = useState("");
  const [proofOfConcept, setProofOfConcept] = useState("");
  const [impact, setImpact] = useState("");
  const [remediation, setRemediation] = useState("");
  const [references, setReferences] = useState("");
  const [reporterName, setReporterName] = useState("");

  const { generateReport, isError, data } = useGenerateReport();
  // const {
  //   exportPdf,
  //   isError: isExportError,
  //   isSuccess: isExportSuccess,
  //   data: exportData,
  // } = useExportPdf();

  const cvssNumber = parseFloat(cvssScore);
  const isCvssValid =
    cvssScore.trim().length > 0 &&
    !Number.isNaN(cvssNumber) &&
    cvssNumber >= 0 &&
    cvssNumber <= 10;

  const areRequiredFieldsFilled =
    vulnerabilityName.trim().length > 0 &&
    targetUrl.trim().length > 0 &&
    severity !== "" &&
    isCvssValid &&
    cweId.trim().length > 0 &&
    owaspCategory.trim().length > 0 &&
    description.trim().length > 0 &&
    proofOfConcept.trim().length > 0 &&
    impact.trim().length > 0 &&
    remediation.trim().length > 0 &&
    references.trim().length > 0 &&
    reporterName.trim().length > 0;

  const isFormValid = areRequiredFieldsFilled;

  return (
    <div className="mx-auto flex h-full w-11/12 flex-col gap-4 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="heading-text text-light-red">Vulnerability Report</h1>
        <p className="normal-text text-dark-yellowish-white">
          Capture vulnerability details on the left and preview the HTML report
          on the right.
        </p>
      </div>

      <div className="flex h-full flex-col gap-4 lg:flex-row">
        <div className="bg-gray rounded-6px flex h-full flex-col gap-4 p-4 lg:w-1/2">
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
            <InputField
              icon={<FaBug className="text-red h-4 w-4" />}
              label="Vulnerability Name"
              placeholder="e.g. SQL Injection in login endpoint"
              value={vulnerabilityName}
              onChange={(value) => setVulnerabilityName(value)}
            />

            <div className="flex flex-col gap-1">
              <label className="normal-text text-dark-yellowish-white flex items-center gap-2">
                <IoWarningOutline className="text-orange h-4 w-4" />
                Severity
              </label>
              <Select
                value={severity}
                onValueChange={(value) => setSeverity(value as SeverityOption)}
              >
                <SelectTrigger className="small-text text-yellowish-white w-full border-0 bg-black/40">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent className="bg-gray small-text text-yellowish-white min-w-25 border-0">
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Informational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <InputField
              icon={<FaLink className="text-blue h-4 w-4" />}
              label="Target URL / Endpoint"
              placeholder="https://target-app.com/api/login"
              value={targetUrl}
              onChange={(value) => setTargetUrl(value)}
            />

            <div className="flex flex-col gap-1">
              <label className="normal-text text-dark-yellowish-white flex items-center gap-2">
                <FaListOl className="text-cyan h-4 w-4" />
                CVSS Score
              </label>
              <Input
                type="number"
                min={0}
                max={10}
                step="0.1"
                value={cvssScore}
                onChange={(event) => setCvssScore(event.target.value)}
                placeholder="0.0 - 10.0"
                className="text-yellowish-white placeholder:text-dark-yellowish-white/60 border-0 bg-black/40"
              />
            </div>

            <InputField
              icon={<MdSecurity className="text-green h-4 w-4" />}
              label="CWE ID"
              placeholder="e.g. CWE-89"
              value={cweId}
              onChange={(value) => setCweId(value)}
            />

            <div className="flex flex-col gap-1">
              <label className="normal-text text-dark-yellowish-white flex items-center gap-2">
                <MdCategory className="text-yellow h-4 w-4" />
                OWASP Category
              </label>
              <Select
                value={owaspCategory}
                onValueChange={(value) => setOwaspCategory(value)}
              >
                <SelectTrigger className="small-text text-yellowish-white w-full border-0 bg-black/40">
                  <SelectValue placeholder="Select OWASP category" />
                </SelectTrigger>
                <SelectContent className="bg-gray small-text text-yellowish-white min-w-25 border-0">
                  <SelectItem value="A01: Broken Access Control">
                    A01: Broken Access Control
                  </SelectItem>
                  <SelectItem value="A02: Cryptographic Failures">
                    A02: Cryptographic Failures
                  </SelectItem>
                  <SelectItem value="A03: Injection">A03: Injection</SelectItem>
                  <SelectItem value="A04: Insecure Design">
                    A04: Insecure Design
                  </SelectItem>
                  <SelectItem value="A05: Security Misconfiguration">
                    A05: Security Misconfiguration
                  </SelectItem>
                  <SelectItem value="A06: Vulnerable and Outdated Components">
                    A06: Vulnerable and Outdated Components
                  </SelectItem>
                  <SelectItem value="A07: Identification and Authentication Failures">
                    A07: Identification and Authentication Failures
                  </SelectItem>
                  <SelectItem value="A08: Software and Data Integrity Failures">
                    A08: Software and Data Integrity Failures
                  </SelectItem>
                  <SelectItem value="A09: Security Logging and Monitoring Failures">
                    A09: Security Logging and Monitoring Failures
                  </SelectItem>
                  <SelectItem value="A10: Server-Side Request Forgery">
                    A10: Server-Side Request Forgery
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <InputField
              icon={<FaLink className="text-blue h-4 w-4" />}
              label="References"
              placeholder="Relevant CVEs, advisories, documentation links, or internal tickets."
              value={references}
              onChange={(value) => setReferences(value)}
            />

            <InputField
              icon={<FaUser className="text-yellow h-4 w-4" />}
              label="Reporter Name"
              placeholder="Your name or team"
              value={reporterName}
              onChange={(value) => setReporterName(value)}
            />
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="normal-text text-dark-yellowish-white flex items-center gap-2">
                <MdDescription className="text-light-red h-4 w-4" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="High-level overview of the vulnerability, affected functionality, and context."
                className="normal-text text-yellowish-white rounded-6px placeholder:text-dark-yellowish-white/60 h-24 w-full resize-none border border-white/10 bg-black/80 p-3 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="normal-text text-dark-yellowish-white flex items-center gap-2">
                <MdCode className="text-cyan h-4 w-4" />
                Proof of Concept
              </label>
              <textarea
                value={proofOfConcept}
                onChange={(event) => setProofOfConcept(event.target.value)}
                placeholder="Steps, payloads, or code snippets demonstrating the vulnerability."
                className="coding-text text-yellowish-white rounded-6px placeholder:text-dark-yellowish-white/60 h-28 w-full resize-none border border-white/10 bg-black p-3 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="normal-text text-dark-yellowish-white flex items-center gap-2">
                <IoWarningOutline className="text-orange h-4 w-4" />
                Impact
              </label>
              <textarea
                value={impact}
                onChange={(event) => setImpact(event.target.value)}
                placeholder="Describe the potential business and technical impact if exploited."
                className="normal-text text-yellowish-white rounded-6px placeholder:text-dark-yellowish-white/60 h-24 w-full resize-none border border-white/10 bg-black/80 p-3 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="normal-text text-dark-yellowish-white flex items-center gap-2">
                <FaShieldAlt className="text-green h-4 w-4" />
                Remediation
              </label>
              <textarea
                value={remediation}
                onChange={(event) => setRemediation(event.target.value)}
                placeholder="Actionable recommendations and security controls to fix the issue."
                className="normal-text text-yellowish-white rounded-6px placeholder:text-dark-yellowish-white/60 h-24 w-full resize-none border border-white/10 bg-black/80 p-3 outline-none"
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 md:mt-4">
            <p className="small-text text-dark-yellowish-white">
              All fields are required to generate the report.
            </p>
            <button
              type="button"
              disabled={!isFormValid}
              className={`small-text rounded-6px px-4 py-2 transition-colors ${
                isFormValid
                  ? "bg-red hover:bg-light-red cursor-pointer text-white"
                  : "bg-red/40 text-dark-yellowish-white/60 cursor-not-allowed"
              }`}
              onClick={() => {
                generateReport({
                  name: vulnerabilityName,
                  target_url: targetUrl,
                  severity,
                  cvss_score: +cvssScore,
                  cwe_id: cweId,
                  description,
                  poc: proofOfConcept,
                  impact,
                  remediation,
                  references,
                  reporter_name: reporterName,
                  owasp_category: owaspCategory,
                });
              }}
            >
              Generate
            </button>
          </div>
          {isError && (
            <p className="small-text text-red">
              Failed to generate report. Please try again.
            </p>
          )}
        </div>

        <div className="bg-gray rounded-6px flex h-screen flex-col gap-3 p-4 lg:w-1/2">
          <iframe
            srcDoc={data?.html_content || ""}
            className="rounded-6px h-full w-full overflow-auto border border-white/10 bg-black/80 p-3"
          ></iframe>
          {/* <button
            type="button"
            disabled={!data}
            className={`small-text rounded-6px px-4 py-2 transition-colors ${
              data?.html_content
                ? "bg-red hover:bg-light-red cursor-pointer text-white"
                : "bg-red/40 text-dark-yellowish-white/60 cursor-not-allowed"
            }`}
            onClick={() => {
              exportPdf(data?.html_content);
            }}
          >
            Generate
          </button> */}
        </div>
      </div>
    </div>
  );
}
