from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    authUid: str
    accessToken: str
    fullName: str
    email: str
    role: str
    department: Optional[str] = ""
    rollNumber: Optional[str] = ""
    semester: Optional[str] = ""
    subject: Optional[str] = ""
    designation: Optional[str] = ""
    assignedBatch: Optional[str] = ""

class LoginRequest(BaseModel):
    accessToken: str

class UserResponse(BaseModel):
    id: str
    authUid: str
    fullName: str
    email: str
    role: str
    department: str
    isApproved: bool
    rollNumber: str
    semester: str
    collegeName: str
    createdAt: datetime
    updatedAt: datetime

class UpdateProfileRequest(BaseModel):
    accessToken: str
    semester: Optional[str] = None
    department: Optional[str] = None

class AuthResponse(BaseModel):
    token: str
    user: UserResponse
