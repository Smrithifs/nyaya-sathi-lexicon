
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { marked } from "marked";
import { groqCompletion } from "@/utils/groqApi";
import { useNavigate } from "react-router-dom";

const GROQ_API_KEY = "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";

const contractTypes = [
  { label: "NDA (Non-Disclosure Agreement)", value: "nda" },
  { label: "Rental Agreement", value: "rental" },
  { label: "Employment Contract", value: "employment" },
];
const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

const ContractGenerator = () => {
  const navigate = useNavigate();
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [contractType, setContractType] = useState(contractTypes[0].value);
  const [lang, setLang] = useState("en");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    try {
      const typeStr = {
        nda: "Non-Disclosure Agreement",
        rental: "Rental Agreement",
        employment: "Employment Contract"
      }[contractType] || "Agreement";
      let details = "";
      switch (contractType) {
        case "nda":
          details = `between ${partyA} and ${partyB} on ${contractDate}, about confidentiality of shared information.`;
          break;
        case "rental":
          details = `between ${partyA} (Landlord) and ${partyB} (Tenant) on ${contractDate}, for leasing property.`;
          break;
        case "employment":
          details = `between ${partyA} (Employer) and ${partyB} (Employee) on ${contractDate}, for employment with set duties and confidentiality.`;
          break;
        default:
          details = `between parties as specified.`;
      }
      const langStr = lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Kannada";
      const prompt = `
Draft a full, professional ${typeStr} in ${langStr} that includes all standard legal clauses and formatting.
The contract is ${details}
Make sure to include: dates, parties, purpose, main legal provisions, typical formal recitals, and execution section.
If user specifies a language (hindi/kannada), translate the contract accordingly.
      `.trim();

      const doc = await groqCompletion({
        apiKey: GROQ_API_KEY,
        prompt,
        systemInstruction: "You are a legal contracts assistant for India. Draft detailed, clear, enforceable agreements for clients. Output in markdown, always include all relevant recitals, signatures, and legal structure."
      });

      setOutput(doc);
      toast({ title: "Contract generated!", description: `Document ready in ${languages.find(l => l.code === lang)?.label}` });
    } catch (err: any) {
      toast({ title: "Groq Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/features")}>
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Contract Generator</h1>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-lg border border-input">
        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Party A</label>
                <Input
                  value={partyA}
                  onChange={e => setPartyA(e.target.value)}
                  placeholder="Name of 1st party"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Party B</label>
                <Input
                  value={partyB}
                  onChange={e => setPartyB(e.target.value)}
                  placeholder="Name of 2nd party"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input
                  type="date"
                  value={contractDate}
                  onChange={e => setContractDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Type of Contract</label>
                <select
                  value={contractType}
                  onChange={e => setContractType(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  disabled={loading}
                >
                  {contractTypes.map(ct =>
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Output Language</label>
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  disabled={loading}
                >
                  {languages.map(l =>
                    <option key={l.code} value={l.code}>{l.label}</option>
                  )}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                {loading ? "Generating..." : "Generate Contract"}
              </Button>
            </div>
          </form>
          {output && (
            <div className="mt-8 border-t pt-6 prose prose-base max-w-none break-words">
              <div dangerouslySetInnerHTML={{ __html: marked(output) }} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractGenerator;
