from fastapi import APIRouter, HTTPException
from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
from database import fetch_one, insert
from schemas import RegisterRequest, LoginRequest, UpdateProfileRequest, AuthResponse
from supabase import create_client

router = APIRouter(prefix="/auth", tags=["auth"])

_supabase = None

def get_supabase():
    global _supabase
    if _supabase is None:
        _supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _supabase

def verify_token(access_token: str) -> dict:
    supabase = get_supabase()
    try:
        response = supabase.auth.get_user(access_token)
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {
            "uid": response.user.id,
            "email": response.user.email or "",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")

@router.post("/register", response_model=AuthResponse)
async def register(body: RegisterRequest):
    supabase = get_supabase()
    try:
        user_response = supabase.auth.admin.get_user_by_id(body.authUid)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid user")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"User verification failed: {e}")

    existing = fetch_one("User", {"authUid": body.authUid})
    if not existing:
        existing = fetch_one("User", {"email": body.email})
    if existing:
        raise HTTPException(status_code=409, detail="User already exists")

    import uuid
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).isoformat()
    user = insert("User", {
        "id": str(uuid.uuid4()),
        "authUid": body.authUid,
        "fullName": body.fullName,
        "email": body.email,
        "role": body.role,
        "department": body.department or "",
        "rollNumber": body.rollNumber or "",
        "semester": body.semester or "",
        "subject": body.subject or "",
        "designation": body.designation or "",
        "assignedBatch": body.assignedBatch or "",
        "isApproved": body.role in ("student", "admin"),
        "collegeName": "Providence College of Engineering",
        "createdAt": now,
        "updatedAt": now,
    })

    if not user:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return AuthResponse(token=body.accessToken, user=user)

@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    decoded = verify_token(body.accessToken)
    uid = decoded.get("uid")
    email = decoded.get("email", "")

    user = fetch_one("User", {"authUid": uid})
    if not user:
        user = fetch_one("User", {"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return AuthResponse(token=body.accessToken, user=user)

@router.get("/me", response_model=AuthResponse)
async def me(accessToken: str):
    decoded = verify_token(accessToken)
    uid = decoded.get("uid")

    user = fetch_one("User", {"authUid": uid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return AuthResponse(token=accessToken, user=user)

@router.patch("/me", response_model=AuthResponse)
async def update_me(body: UpdateProfileRequest):
    decoded = verify_token(body.accessToken)
    uid = decoded.get("uid")

    user = fetch_one("User", {"authUid": uid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    from database import update as db_update
    from datetime import datetime, timezone
    updates = {k: v for k, v in body.model_dump().items() if v is not None and k != "accessToken"}
    if not updates:
        return AuthResponse(token=body.accessToken, user=user)
    updates["updatedAt"] = datetime.now(timezone.utc).isoformat()
    updated = db_update("User", {"authUid": uid}, updates)
    return AuthResponse(token=body.accessToken, user=updated if updated else user)
