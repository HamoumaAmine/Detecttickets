from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database.db_connection import get_db
from models.utilisateur import Utilisateur  # ✅ Correction de l'import selon l’arborescence

# ✅ Clé secrète et algorithme (doivent correspondre à ceux de auth_service.py)
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

# ✅ URL de connexion pour récupérer un token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(Utilisateur).filter(Utilisateur.email == email).first()
    if user is None:
        raise credentials_exception

    # ✅ Tu peux retourner l’objet complet ou un dictionnaire comme ici :
    return {
        "id": user.id,
        "email": user.email,
        "nom": user.nom,
        "points": user.points,
    }
