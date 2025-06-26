import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Scale, FileText, Zap } from 'lucide-react';

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Scale className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">LegalOps</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Intelligent Legal Research System with AI-Enhanced Case Analysis
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Multi-Field Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Search by case type, section/act, year range, court type, and case name with granular control.
              </p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                AI-Powered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get AI-extracted case titles, summaries, ratio decidendi, and judgment outcomes.
              </p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Fresh Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get new cases on each refresh with pagination to avoid duplicate results.
              </p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-orange-600" />
                Official Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Direct links to official Indian Kanoon documents for complete case details.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-semibold mb-4">Start Your Legal Research</h2>
              <p className="text-gray-600 mb-6">
                Search Indian legal cases with intelligent filters and get AI-enhanced analysis
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/legal-search')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Search className="h-5 w-5 mr-2" />
                Start Searching Cases
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Powered by Indian Kanoon API & Gemini AI</p>
        </div>
      </div>
    </div>
  );
};

export default App;
