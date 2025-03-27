from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db_connection import get_db
from models.categorie import Categorie

router = APIRouter()

@router.get("/")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Categorie).all()
    return [{"id": c.id, "nom": c.nom} for c in categories]
