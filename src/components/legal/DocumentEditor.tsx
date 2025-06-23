
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Save, Edit, Eye, FileText, File } from "lucide-react";

interface DocumentEditorProps {
  document: string;
  onDocumentChange: (document: string) => void;
  onBack: () => void;
  title: string;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onDocumentChange,
  onBack,
  title
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(document);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    onDocumentChange(editableContent);
    setIsEditing(false);
    toast({
      title: "Document Saved",
      description: "Your changes have been saved successfully."
    });
  };

  const handleCancel = () => {
    setEditableContent(document);
    setIsEditing(false);
  };

  const exportToPDF = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.5;
              max-width: 8.5in;
              margin: 1in auto;
              padding: 0;
              color: #000;
            }
            .document-header {
              text-align: center;
              margin-bottom: 30px;
              font-weight: bold;
            }
            .document-content {
              white-space: pre-wrap;
              text-align: justify;
            }
            h1, h2, h3 {
              text-align: center;
              margin: 20px 0;
            }
            .signature-section {
              margin-top: 50px;
              text-align: right;
            }
            @media print {
              body { margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          <div class="document-header">
            <h2>${title}</h2>
          </div>
          <div class="document-content">
            ${editableContent.replace(/\n/g, '<br>')}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast({
      title: "PDF Export",
      description: "Document prepared for printing. Use Ctrl+P to save as PDF."
    });
  };

  const exportToWord = () => {
    const blob = new Blob([editableContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Word Document Downloaded",
      description: "Document has been saved as a Word file."
    });
  };

  const exportToText = () => {
    const blob = new Blob([editableContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Text File Downloaded",
      description: "Document has been saved as a text file."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </Button>
              <CardTitle className="text-xl text-blue-900">{title}</CardTitle>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Document
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={exportToPDF}>
                      <FileText className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToWord}>
                      <File className="w-4 h-4 mr-1" />
                      Word
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToText}>
                      <Download className="w-4 h-4 mr-1" />
                      Text
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Document Editor/Viewer */}
      <Card>
        <CardContent className="p-0">
          <div className="legal-doc-container">
            <div className="word-interface">
              <div className="word-header">
                <span className="doc-icon">📄</span>
                {title}
              </div>
              
              <div className="word-toolbar">
                <div className="toolbar-section">
                  <select className="font-dropdown">
                    <option>Times New Roman</option>
                  </select>
                  <select className="font-dropdown">
                    <option>12</option>
                  </select>
                </div>
                <div className="toolbar-section">
                  <button className="toolbar-btn">B</button>
                  <button className="toolbar-btn">I</button>
                  <button className="toolbar-btn">U</button>
                </div>
                <div className="toolbar-section">
                  <span className="text-xs">
                    {isEditing ? (
                      <span className="text-green-600 flex items-center">
                        <Edit className="w-3 h-3 mr-1" />
                        Editing Mode
                      </span>
                    ) : (
                      <span className="text-blue-600 flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview Mode
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="ruler"></div>

              <div className="word-document">
                <div className="document-page">
                  <div className="document-header-info">
                    <h3 className="case-title">{title}</h3>
                    <p className="case-citation">Generated on {new Date().toLocaleDateString('en-IN')}</p>
                  </div>

                  {isEditing ? (
                    <textarea
                      ref={editorRef as any}
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      className="w-full min-h-[600px] border-none resize-none focus:outline-none font-serif text-sm leading-relaxed bg-transparent"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                      {editableContent}
                    </div>
                  )}

                  <div className="document-footer">
                    Document ID: {Math.random().toString(36).substr(2, 9)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentEditor;
