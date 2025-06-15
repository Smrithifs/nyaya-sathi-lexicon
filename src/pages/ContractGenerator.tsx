
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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

function fakeGeneratedContract({ partyA, partyB, date, type, lang }:
  { partyA: string, partyB: string, date: string, type: string, lang: string }) {
  let doc = `This is a demo ${type === "nda" ? "NDA" : type === "rental" ? "Rental Agreement" : "Employment Contract"} between ${partyA} and ${partyB}, dated ${date}. [Full legal content not shown in demo.]`;
  if (lang === "hi") doc = `यह एक डेमो ${contractTypes.find(c=>c.value===type)?.label || ""} है: ${partyA} और ${partyB}, दिनांक ${date} के बीच।`;
  if (lang === "kn") doc = `ಇದು ಡೆಮೋ ${contractTypes.find(c=>c.value===type)?.label || ""} ಆಗಿದೆ: ${partyA} ಮತ್ತು ${partyB}, ದಿನಾಂಕ ${date} ನಡುವೆ.`;
  return doc;
}

const ContractGenerator = () => {
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [contractType, setContractType] = useState(contractTypes[0].value);
  const [lang, setLang] = useState("en");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setOutput(fakeGeneratedContract({
        partyA, partyB, date: contractDate, type: contractType, lang
      }));
      setLoading(false);
      toast({ title: "Contract generated!", description: `Document ready in ${languages.find(l=>l.code===lang)?.label}` });
    }, 1400);
  };

  return (
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
            <Button type="submit" loading={loading} className="w-full md:w-auto">
              {loading ? "Generating..." : "Generate Contract"}
            </Button>
          </div>
        </form>
        {output && (
          <div className="mt-8 border-t pt-6">
            <div className="text-lg font-semibold mb-2">Generated Contract</div>
            <div className="whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractGenerator;
