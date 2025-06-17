
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import { groqCompletion } from "@/utils/groqApi";
import { useNavigate } from "react-router-dom";

const GROQ_API_KEY = "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";

const contractTypes = [
  { label: "Agency Contract", value: "agency" },
  { label: "Bailment Contract", value: "bailment" },
  { label: "Board Resolution", value: "board_resolution" },
  { label: "Construction Contract", value: "construction" },
  { label: "Consulting Agreement", value: "consulting" },
  { label: "Contract of Guarantee", value: "guarantee" },
  { label: "Contract of Indemnity", value: "indemnity" },
  { label: "Contingent Contract", value: "contingent" },
  { label: "E-commerce Terms & Conditions", value: "ecommerce_terms" },
  { label: "Employment Bond", value: "employment_bond" },
  { label: "Employment Contract", value: "employment" },
  { label: "Equity Vesting Agreement", value: "equity_vesting" },
  { label: "Express Contract (General)", value: "express_general" },
  { label: "Founder Agreement", value: "founder" },
  { label: "Franchise Agreement", value: "franchise" },
  { label: "Freelance Contract", value: "freelance" },
  { label: "Gift Deed", value: "gift_deed" },
  { label: "General Power of Attorney", value: "general_poa" },
  { label: "Loan Agreement", value: "loan" },
  { label: "Memorandum of Understanding (MoU)", value: "mou" },
  { label: "Non-Disclosure Agreement (NDA)", value: "nda" },
  { label: "Partnership Agreement", value: "partnership" },
  { label: "Pledge Contract", value: "pledge" },
  { label: "Prenuptial Agreement", value: "prenuptial" },
  { label: "Quasi-Contract", value: "quasi" },
  { label: "Real Estate Contract", value: "real_estate" },
  { label: "Rental Agreement", value: "rental" },
  { label: "Sale of Goods Agreement", value: "sale_of_goods" },
  { label: "Service Level Agreement (SLA)", value: "sla" },
  { label: "Shareholders Agreement", value: "shareholders" },
  { label: "Software Licensing Agreement", value: "software_licensing" },
  { label: "Special Power of Attorney", value: "special_poa" },
  { label: "Startup Investment Agreement", value: "startup_investment" },
  { label: "Standard Form Contract", value: "standard_form" },
  { label: "Vendor Agreement", value: "vendor" },
  { label: "Will and Testament", value: "will_testament" },
];

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी (Hindi)", code: "hi" },
  { label: "ಕನ್ನಡ (Kannada)", code: "kn" },
  { label: "தமிழ் (Tamil)", code: "ta" },
  { label: "తెలుగు (Telugu)", code: "te" },
  { label: "मराठी (Marathi)", code: "mr" },
  { label: "ગુજરાતી (Gujarati)", code: "gu" },
  { label: "বাংলা (Bengali)", code: "bn" },
  { label: "ਪੰਜਾਬੀ (Punjabi)", code: "pa" },
  { label: "മലയാളം (Malayalam)", code: "ml" },
];

const ContractGenerator = () => {
  const navigate = useNavigate();
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [contractType, setContractType] = useState("");
  const [lang, setLang] = useState("en");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const selectedContractType = contractTypes.find(ct => ct.value === contractType);

  const getContractPrompt = (type: string, partyA: string, partyB: string, date: string, language: string) => {
    const languageMap: { [key: string]: string } = {
      en: "English",
      hi: "Hindi",
      kn: "Kannada", 
      ta: "Tamil",
      te: "Telugu",
      mr: "Marathi",
      gu: "Gujarati",
      bn: "Bengali",
      pa: "Punjabi",
      ml: "Malayalam"
    };

    const langStr = languageMap[language] || "English";
    const typeLabel = contractTypes.find(ct => ct.value === type)?.label || "Agreement";

    let specificClauses = "";
    let relevantLaws = "Indian Contract Act, 1872";

    // Add specific clauses and laws based on contract type
    switch (type) {
      case "employment":
      case "employment_bond":
        specificClauses = "including salary, designation, working hours, leave policy, termination clauses, confidentiality, and notice period";
        relevantLaws = "Indian Contract Act 1872, Payment of Wages Act 1936, Employees' Provident Funds Act 1952, and relevant labor laws";
        break;
      case "rental":
        specificClauses = "including rent amount, security deposit, maintenance, utilities, renewal terms, and termination conditions";
        relevantLaws = "Indian Contract Act 1872, Transfer of Property Act 1882, and relevant rent control laws";
        break;
      case "nda":
        specificClauses = "including definition of confidential information, permitted disclosures, return of information, and breach consequences";
        relevantLaws = "Indian Contract Act 1872, Information Technology Act 2000";
        break;
      case "partnership":
        specificClauses = "including profit sharing, capital contribution, decision making, dissolution terms, and partner liabilities";
        relevantLaws = "Indian Partnership Act 1932, Indian Contract Act 1872";
        break;
      case "software_licensing":
      case "ecommerce_terms":
        specificClauses = "including license scope, usage restrictions, intellectual property rights, data protection, and liability limitations";
        relevantLaws = "Indian Contract Act 1872, Information Technology Act 2000, Copyright Act 1957";
        break;
      case "real_estate":
        specificClauses = "including property description, consideration, possession, registration, and title warranties";
        relevantLaws = "Transfer of Property Act 1882, Indian Contract Act 1872, Registration Act 1908";
        break;
      case "shareholders":
      case "startup_investment":
        specificClauses = "including shareholding, voting rights, board composition, transfer restrictions, and exit mechanisms";
        relevantLaws = "Companies Act 2013, Indian Contract Act 1872, SEBI regulations";
        break;
      case "loan":
        specificClauses = "including principal amount, interest rate, repayment schedule, security, and default provisions";
        relevantLaws = "Indian Contract Act 1872, Banking Regulation Act 1949, Limitation Act 1963";
        break;
      case "construction":
        specificClauses = "including scope of work, timeline, materials, payment schedule, quality standards, and penalties";
        relevantLaws = "Indian Contract Act 1872, Real Estate (Regulation and Development) Act 2016";
        break;
      case "franchise":
        specificClauses = "including franchise rights, territory, fees, operational standards, and termination conditions";
        relevantLaws = "Indian Contract Act 1872, Trade Marks Act 1999, Competition Act 2002";
        break;
      default:
        specificClauses = "including all standard and specific clauses relevant to this type of agreement";
    }

    return `
You are a legal contract generation assistant trained in Indian law. Draft a complete, professional ${typeLabel} in ${langStr} that is legally valid under Indian law.

Contract Details:
- Party A (First Party): ${partyA}
- Party B (Second Party): ${partyB}
- Date of Agreement: ${date}
- Contract Type: ${typeLabel}

Requirements:
1. Use proper Indian legal structure with:
   - Parties section with full details
   - Recitals (WHEREAS clauses)
   - Definitions section
   - Main operative clauses ${specificClauses}
   - General provisions (governing law, jurisdiction, amendments, etc.)
   - Execution section with signature blocks

2. Reference relevant Indian laws: ${relevantLaws}

3. Include all essential legal elements:
   - Consideration clause
   - Terms and conditions specific to ${typeLabel}
   - Dispute resolution and jurisdiction (Indian courts)
   - Governing law as Indian law
   - Force majeure clause
   - Entire agreement clause

4. Format: Use markdown with proper headings and structure
5. Language: ${langStr === "English" ? "Use clear legal English" : `Translate to ${langStr} but keep legal terms in English where necessary for precision`}
6. Make it ready for digital/physical signature and legally enforceable

Generate a complete, professional contract that covers all necessary legal aspects for a ${typeLabel} under Indian law.
    `.trim();
  };

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!contractType) {
      toast({ title: "Error", description: "Please select a contract type", variant: "destructive" });
      return;
    }

    setLoading(true);
    setOutput(null);
    try {
      const prompt = getContractPrompt(contractType, partyA, partyB, contractDate, lang);

      const doc = await groqCompletion({
        apiKey: GROQ_API_KEY,
        prompt,
        systemInstruction: "You are a legal contracts assistant specializing in Indian law. Draft detailed, legally valid, and enforceable agreements that comply with Indian legal requirements. Structure contracts professionally with proper legal formatting, include all necessary clauses, and ensure compliance with relevant Indian statutes."
      });

      setOutput(doc);
      const langLabel = languages.find(l => l.code === lang)?.label || "English";
      toast({ title: "Contract generated!", description: `${selectedContractType?.label} ready in ${langLabel}` });
    } catch (err: any) {
      toast({ title: "Generation Error", description: err.message, variant: "destructive" });
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
                <label className="text-sm font-medium mb-1 block">Party A (First Party)</label>
                <Input
                  value={partyA}
                  onChange={e => setPartyA(e.target.value)}
                  placeholder="Name of first party"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Party B (Second Party)</label>
                <Input
                  value={partyB}
                  onChange={e => setPartyB(e.target.value)}
                  placeholder="Name of second party"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date of Agreement</label>
                <Input
                  type="date"
                  value={contractDate}
                  onChange={e => setContractDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Contract Type</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={loading}
                    >
                      {selectedContractType?.label || "Search or select contract type..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search contract types..." />
                      <CommandEmpty>No contract type found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {contractTypes.map((ct) => (
                            <CommandItem
                              key={ct.value}
                              value={ct.label}
                              onSelect={() => {
                                setContractType(ct.value);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  contractType === ct.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {ct.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Output Language</label>
                <Select value={lang} onValueChange={setLang} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(l => (
                      <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                {loading ? "Generating Contract..." : "Generate Contract"}
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
