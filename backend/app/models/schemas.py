from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's query for the AI assistant.")
    history: List[Dict[str, str]] = Field(default=[], description="Chat history for context.")

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI generated response.")

class PincodeRequest(BaseModel):
    pincode: str = Field(..., min_length=6, max_length=6, description="6-digit Indian Pincode.")

class TranslationRequest(BaseModel):
    text: str = Field(..., description="Text to be translated.")
    target_lang: str = Field(..., description="Target language code (e.g., 'hi', 'te').")

class TranslationResponse(BaseModel):
    translated_text: str = Field(..., description="Translated version of the input text.")

class ProgressData(BaseModel):
    user_id: str
    score_data: Dict[str, Any]

class ConstituencyPulse(BaseModel):
    name: str
    state: str
    mp: str
    mla: str
    district: str
    booths: int
    turnout: str
    status: str

class LiveIntelligence(BaseModel):
    upcoming_elections: List[Dict[str, Any]]
    upcoming_results: List[Any]
    past_results: List[Any]
