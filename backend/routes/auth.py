from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from database.db_connection import get_db
from services.auth_service import (
    authenticate_user,
    create_jwt_token,
    hash_password,
    verify_password,
    get_current_user
)
from models.utilisateur import Utilisateur

router = APIRouter()


# ✅ Route d'inscription
@router.post("/register")
def register(
    nom: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    existing_user = db.query(Utilisateur).filter(Utilisateur.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed_password = hash_password(password)
    user = Utilisateur(nom=nom, email=email, mot_de_passe=hashed_password)
    db.add(user)
    db.commit()

    return {"message": "Utilisateur créé avec succès"}


# ✅ Route de connexion
@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        user = authenticate_user(db, email, password)
        if not user:
            raise HTTPException(status_code=401, detail="Identifiants invalides")

        token_data = {
            "sub": user.email,
            "id": user.id,
            "nom": user.nom
        }
        token = create_jwt_token(token_data)
        return {"access_token": token, "token_type": "bearer"}

    except Exception as e:
        print("Erreur de connexion :", str(e))
        raise HTTPException(status_code=500, detail="Erreur interne")


# ✅ (Optionnel) Route test pour utilisateur connecté
@router.get("/me")
def get_me(current_user: Utilisateur = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nom": current_user.nom,
        "email": current_user.email
    }
