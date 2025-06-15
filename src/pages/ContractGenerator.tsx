
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

function generateContract({ partyA, partyB, date, type, lang }:
  { partyA: string, partyB: string, date: string, type: string, lang: string }) {
  
  let title = "";
  let content = "";

  switch (type) {
    case "nda":
      title = "Non-Disclosure Agreement";
      content = `
This Non-Disclosure Agreement (the "Agreement") is entered into as of ${date} by and between ${partyA} ("Disclosing Party") and ${partyB} ("Receiving Party").

1.  **Confidential Information.** "Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary," or some similar designation.

2.  **Obligations.** The Receiving Party agrees to hold the Confidential Information in strict confidence and not to disclose such Confidential Information to any third party without the prior written consent of the Disclosing Party.

3.  **Term.** The obligations of this Agreement shall survive for a period of five (5) years from the date of disclosure of the Confidential Information.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

DISCLOSING PARTY:
____________________
${partyA}

RECEIVING PARTY:
____________________
${partyB}
      `;
      break;
    case "rental":
      title = "Rental Agreement";
      content = `
This Rental Agreement (the "Agreement") is made and entered into on ${date}, by and between ${partyA} (the "Landlord") and ${partyB} (the "Tenant").

1.  **Property.** Landlord, in consideration of the rent to be paid by Tenant, leases to Tenant the property located at [PROPERTY ADDRESS TO BE INSERTED].

2.  **Term.** The term of this lease is for a period of 12 months, beginning on ${date} and ending on the corresponding date of the next year.

3.  **Rent.** Tenant agrees to pay Landlord as rent for the Property the sum of [RENT AMOUNT] per month, due on the first day of each month.

4.  **Security Deposit.** Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of [DEPOSIT AMOUNT] as security for the performance of Tenant's obligations hereunder.

IN WITNESS WHEREOF, the parties have executed this Agreement.

LANDLORD:
____________________
${partyA}

TENANT:
____________________
${partyB}
      `;
      break;
    case "employment":
      title = "Employment Contract";
      content = `
This Employment Agreement (the "Agreement") is made effective as of ${date}, by and between ${partyA} ("Employer") and ${partyB} ("Employee").

1.  **Position.** Employer hereby employs Employee in the capacity of [JOB TITLE TO BE INSERTED]. Employee shall perform such duties as are customarily performed by an employee in such capacity.

2.  **Term.** The employment under this Agreement shall be "at-will," meaning that either Employer or Employee may terminate the employment relationship at any time, with or without cause or notice.

3.  **Compensation.** As compensation for the services provided by Employee under this Agreement, Employer shall pay Employee an annual salary of [SALARY AMOUNT TO BE INSERTED].

4.  **Confidentiality.** Employee acknowledges that they will have access to confidential information of the Employer and agrees to maintain the confidentiality of such information during and after the term of employment.

IN WITNESS WHEREOF, the parties have executed this Agreement.

EMPLOYER:
____________________
${partyA}

EMPLOYEE:
____________________
${partyB}
      `;
      break;
    default:
      content = "Invalid contract type selected.";
  }

  if (lang === "hi") {
    return `शीर्षक: ${title}\n\nयह एक अनुबंध है जो ${partyA} और ${partyB} के बीच ${date} को हुआ है।\n\n(यह एक सरलीकृत हिंदी अनुवाद है। पूर्ण कानूनी पाठ के लिए, कृपया मूल अंग्रेजी संस्करण देखें।)\n\n${content}`;
  }
  if (lang === "kn") {
    return `ಶೀರ್ಷಿಕೆ: ${title}\n\nಇದು ${partyA} ಮತ್ತು ${partyB} ನಡುವೆ ${date} ರಂದು ಮಾಡಲಾದ ಒಪ್ಪಂದವಾಗಿದೆ.\n\n(ಇದು ಸರಳೀಕೃತ ಕನ್ನಡ ಅನುವಾದವಾಗಿದೆ। ಸಂಪೂರ್ಣ ಕಾನೂನು ಪಠ್ಯಕ್ಕಾಗಿ, ದಯವಿಟ್ಟು ಮೂಲ ಇಂಗ್ಲಿಷ್ ಆವೃತ್ತಿಯನ್ನು ನೋಡಿ.)\n\n${content}`;
  }
  
  return `Title: ${title}\n\n${content}`;
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
      setOutput(generateContract({
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
            <Button type="submit" className="w-full md:w-auto" disabled={loading}>
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
