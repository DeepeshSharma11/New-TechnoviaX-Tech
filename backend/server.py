from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import firebase_admin
from firebase_admin import auth, credentials
import json
from datetime import datetime

app = FastAPI(title="TechnoviaX Profile API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin (optional, for token verification)
# cred = credentials.Certificate("path/to/serviceAccountKey.json")
# firebase_admin.initialize_app(cred)

# In-memory storage (replace with database in production)
user_profiles = {}
user_activities = {}

# Models
class Profile(BaseModel):
    uid: str
    name: str
    email: str
    photoURL: Optional[str] = ""
    phone: Optional[str] = ""
    altEmail: Optional[str] = ""
    address: Optional[str] = ""
    contactMethod: Optional[str] = "email"
    preferences: Optional[Dict[str, Any]] = None
    createdAt: Optional[str] = None
    lastLogin: Optional[str] = None
    totalLogins: Optional[int] = 1

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    altEmail: Optional[str] = None
    address: Optional[str] = None
    contactMethod: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

# Dependency to verify Firebase token
async def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    try:
        # In production, verify the Firebase token
        # token = authorization.split("Bearer ")[1]
        # decoded_token = auth.verify_id_token(token)
        # return decoded_token
        
        # For development, just extract user ID from header
        return {"uid": authorization.replace("Bearer ", "")}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.get("/api/profile/{user_id}")
async def get_profile(user_id: str, user_data: dict = Depends(verify_token)):
    if user_id not in user_profiles:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {"profile": user_profiles[user_id]}

@app.post("/api/profile")
async def create_profile(profile: Profile, user_data: dict = Depends(verify_token)):
    if profile.uid in user_profiles:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    # Set timestamps
    now = datetime.now().isoformat()
    profile.createdAt = now
    profile.lastLogin = now
    
    # Set default preferences
    if profile.preferences is None:
        profile.preferences = {
            "emailPayments": True,
            "emailUpdates": True,
            "emailPromotional": False,
            "privacyProfile": True,
            "privacyActivity": False
        }
    
    user_profiles[profile.uid] = profile.dict()
    return {"profile": user_profiles[profile.uid]}

@app.put("/api/profile/{user_id}")
async def update_profile(user_id: str, updates: ProfileUpdate, user_data: dict = Depends(verify_token)):
    if user_id not in user_profiles:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Update only provided fields
    for field, value in updates.dict(exclude_unset=True).items():
        if value is not None:
            user_profiles[user_id][field] = value
    
    return {"profile": user_profiles[user_id]}

@app.get("/api/payments/{user_id}")
async def get_payment_count(user_id: str, user_data: dict = Depends(verify_token)):
    # This would query your payments database
    # For now, return a dummy count
    return {"count": 0}

@app.get("/api/activity/{user_id}")
async def get_activity(user_id: str, user_data: dict = Depends(verify_token)):
    if user_id not in user_activities:
        # Return empty activities for new users
        return {"activities": []}
    
    return {"activities": user_activities[user_id]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)