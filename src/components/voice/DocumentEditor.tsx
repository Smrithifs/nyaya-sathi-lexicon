
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download, Edit } from "lucide-react";

interface DocumentEditorProps {
  formattedDocument: string;
  setFormattedDocument: (document: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  formattedDocument,
  setFormattedDocument
}) => {
  const { toast } = useToast();
  const [documentFormat, setDocumentFormat] = useState("text");
  const [isEditingDocument, setIsEditingDocument] = useState(false);

  const downloadDocument = () => {
    if (!formattedDocument) return;

    let content = formattedDocument;
    let filename = "legal-document";
    let mimeType = "text/plain";

    if (documentFormat === "pdf") {
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Legal Document</title>
          <style>
            @page { margin: 1in; }
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              margin: 0;
              font-size: 12pt;
            }
            h1, h2, h3 { 
              text-align: center; 
              margin-bottom: 20px; 
              font-weight: bold;
            }
            .content { 
              white-space: pre-wrap; 
              text-align: justify;
            }
            p { margin-bottom: 12pt; }
          </style>
        </head>
        <body>
          <div class="content">${formattedDocument.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `;
      filename = "legal-document.html";
      mimeType = "text/html";
    } else if (documentFormat === "word") {
      content = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
        \\f0\\fs24 ${formattedDocument.replace(/\n/g, '\\par ')}}`;
      filename = "legal-document.rtf";
      mimeType = "application/rtf";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Document Downloaded",
      description: `Document saved as ${filename}`
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedDocument);
    toast({
      title: "Copied!",
      description: "Document copied to clipboard."
    });
  };

  if (!formattedDocument) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Formatted Legal Document</CardTitle>
        <div className="flex gap-2">
          <Select value={documentFormat} onValueChange={setDocumentFormat}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setIsEditingDocument(!isEditingDocument)}
            variant="outline"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditingDocument ? "Save" : "Edit"}
          </Button>
          <Button onClick={downloadDocument} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md border">
          <Textarea
            value={formattedDocument}
            onChange={(e) => setFormattedDocument(e.target.value)}
            readOnly={!isEditingDocument}
            className={`min-h-96 font-serif text-sm leading-relaxed border-none bg-transparent resize-none ${
              !isEditingDocument ? 'cursor-default' : ''
            }`}
            placeholder="Your formatted legal document will appear here..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentEditor;
