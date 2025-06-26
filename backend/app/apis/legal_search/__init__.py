from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
#from app.libs.indian_kanoon import IndianKanoonAPI
#from app.libs.gemini_analyzer import GeminiCaseAnalyzer
import asyncio

router = APIRouter()

# Initialize services
ikanoon_api = IndianKanoonAPI()
gemini_analyzer = GeminiCaseAnalyzer()

# Request/Response Models
class LegalSearchRequest(BaseModel):
    case_type: Optional[str] = None  # Criminal, Civil, Constitutional, etc.
    section: Optional[str] = None    # Section 302, Article 21, etc.
    from_year: Optional[int] = None  # 2004
    to_year: Optional[int] = None    # 2005
    case_name: Optional[str] = None  # Optional case name
    court_type: Optional[str] = None # Supreme Court, High Court, etc.
    offset: int = 0                  # For pagination

class CaseDetail(BaseModel):
    case_title: str
    summary: str
    ratio_decidendi: str
    judgment_outcome: str
    citation: str
    court_name: str
    case_year: str
    doc_id: str
    download_url: str

class SearchResponse(BaseModel):
    cases: List[CaseDetail]
    total_results: int
    offset: int
    has_more: bool
    search_params: Dict[str, Any]

@router.post("/search-cases")
async def search_legal_cases(request: LegalSearchRequest) -> SearchResponse:
    """
    Search for legal cases with multi-field parameters and AI analysis
    """
    try:
        print(f"Search request: {request.dict()}")
        
        # Search Indian Kanoon API
        search_results = ikanoon_api.search_cases(
            case_type=request.case_type,
            section=request.section,
            from_year=request.from_year,
            to_year=request.to_year,
            court_type=request.court_type,
            case_name=request.case_name,
            offset=request.offset
        )
        
        if 'error' in search_results:
            raise HTTPException(
                status_code=500, 
                detail=f"Indian Kanoon API error: {search_results['error']}"
            )
        
        # Extract cases from search results
        cases_data = search_results.get('docs', [])
        total_results = search_results.get('numFound', 0)
        
        print(f"Found {len(cases_data)} cases from Indian Kanoon")
        
        # Process and analyze cases
        analyzed_cases = []
        for case_info in cases_data[:5]:  # Limit to 5 cases
            try:
                doc_id = str(case_info.get('tid', ''))  # Convert to string
                title = case_info.get('title', 'Unknown Case')
                
                # Create basic case details from search results
                case_details = {
                    'case_title': title,
                    'summary': case_info.get('headline', 'Case summary not available'),
                    'ratio_decidendi': 'Legal principle not available in search results',
                    'judgment_outcome': 'Judgment outcome not available in search results',
                    'citation': 'Citation not available in search results',
                    'court_name': case_info.get('docsource', 'Unknown Court'),
                    'case_year': 'Year not specified',
                    'doc_id': doc_id,
                    'download_url': f"https://indiankanoon.org/doc/{doc_id}/"
                }
                
                # Try to enhance with Gemini AI if quota available
                try:
                    case_text = title + ' ' + case_info.get('headline', '')
                    if len(case_text.strip()) > 20:
                        enhanced_details = gemini_analyzer.extract_case_details(case_text, doc_id)
                        # Merge enhanced details with basic details
                        case_details.update(enhanced_details)
                except Exception as gemini_error:
                    print(f"Gemini analysis failed for case {doc_id}: {gemini_error}")
                    # Keep basic details if Gemini fails
                    pass
                
                analyzed_cases.append(CaseDetail(**case_details))
                    
            except Exception as e:
                print(f"Error processing case {case_info.get('tid', 'unknown')}: {e}")
                continue
        
        print(f"Successfully analyzed {len(analyzed_cases)} cases")
        
        return SearchResponse(
            cases=analyzed_cases,
            total_results=total_results,
            offset=request.offset,
            has_more=len(cases_data) >= 5 and (request.offset + 5) < total_results,
            search_params=request.dict()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in search_legal_cases: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/case-types")
async def get_case_types() -> List[str]:
    """
    Get available case types for dropdown
    """
    return [
        "Criminal",
        "Civil", 
        "Constitutional",
        "Tax",
        "Service",
        "Company Law",
        "Labour",
        "Family",
        "Property",
        "Contract"
    ]

@router.get("/court-types")
async def get_court_types() -> List[str]:
    """
    Get available court types for dropdown
    """
    return [
        "Supreme Court",
        "High Court", 
        "Delhi High Court",
        "Bombay High Court",
        "Calcutta High Court",
        "Madras High Court",
        "Karnataka High Court",
        "Kerala High Court",
        "Punjab and Haryana High Court",
        "Rajasthan High Court",
        "Gujarat High Court",
        "Allahabad High Court"
    ]

@router.get("/test-search")
async def test_search() -> Dict[str, Any]:
    """
    Test endpoint to verify Indian Kanoon API connection
    """
    try:
        # Test with a simple search
        test_results = ikanoon_api.search_cases(
            section="Section 302",
            case_type="Criminal",
            from_year=2020,
            to_year=2021
        )
        
        return {
            "status": "success",
            "message": "Indian Kanoon API connection working",
            "sample_results": test_results
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"API test failed: {str(e)}"
        }
