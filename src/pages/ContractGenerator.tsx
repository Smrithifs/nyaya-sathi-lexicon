import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import OpenAIKeyInput from "../components/OpenAIKeyInput";

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

async function generateContractWithOpenAI(
  { partyA, partyB, date, type, lang }:
  { partyA: string, partyB: string, date: string, type: string, lang: string },
  openaiKey: string,
) {
  const typeStr = {
    nda: "Non-Disclosure Agreement",
    rental: "Rental Agreement",
    employment: "Employment Contract"
  }[type] || "Agreement";

  let details = "";
  switch (type) {
    case "nda":
      details = `between ${partyA} and ${partyB} on ${date}, about confidentiality of shared information.`;
      break;
    case "rental":
      details = `between ${partyA} (Landlord) and ${partyB} (Tenant) on ${date}, for leasing property.`;
      break;
    case "employment":
      details = `between ${partyA} (Employer) and ${partyB} (Employee) on ${date}, for employment with set duties and confidentiality.`;
      break;
    default:
      details = `between parties as specified.`;
  }

  const prompt = `
Draft a full, professional ${typeStr} in ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Kannada"} that includes all standard legal clauses and formatting.
The contract is ${details}
Make sure to include: dates, parties, purpose, main legal provisions, typical formal recitals, and execution section.
If user specifies a language (hindi/kannada), translate the contract accordingly.
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a legal contracts assistant for India. Draft detailed, clear, enforceable agreements for clients. Output in markdown, always include all relevant recitals, signatures, and legal structure.",
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.18,
      max_tokens: 1800,
    }),
  });

  if (!res.ok) throw new Error("Failed to generate contract from OpenAI. Please check your API key or try again.");
  const data = await res.json();
  return data.choices[0].message.content as string;
}

const ContractGenerator = () => {
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [contractType, setContractType] = useState(contractTypes[0].value);
  const [lang, setLang] = useState("en");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyModal, setKeyModal] = useState(false);
  const { toast } = useToast();

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    const openaiKey = localStorage.getItem("openaiKey") || "";
    if (!openaiKey) {
      setKeyModal(true);
      setLoading(false);
      return;
    }
    try {
      const res = await generateContractWithOpenAI(
        { partyA, partyB, date: contractDate, type: contractType, lang },
        openaiKey
      );
      setOutput(res);
      toast({ title: "Contract generated!", description: `Document ready in ${languages.find(l => l.code === lang)?.label}` });
    } catch (err: any) {
      toast({ title: "OpenAI Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <OpenAIKeyInput open={keyModal} onClose={() => setKeyModal(false)} />
      <Card className="w-full max-w-2xl mx-auto shadow-lg border border-input">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contract Generator</CardTitle>
        </CardHeader>
        <CardContent>
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
              {/* Renders markdown output from OpenAI */}
              <div dangerouslySetInnerHTML={{ __html: window.marked ? (window as any).marked(output) : output.replace(/\n/g, "<br/>") }} />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ContractGenerator;
