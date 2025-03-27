from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.utilisateur import Utilisateur
from services.auth_service import get_current_user

router = APIRouter()

@router.get("/home")
def get_home_data(current_user: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Non autorisé")

    # Simulation des données (à remplacer avec des vraies données de la base)
    home_data = {
        "depense_mois": 250.75,  # Exemple : Calculer la somme des dépenses de l'utilisateur
        "offres": ["10% sur Carrefour", "Promo 2+1 gratuit Monoprix"],
        "categories": ["Alimentation", "Hygiène", "Électronique"],
        "depenses_recentes": [
            {"date": "2025-03-15", "montant": 15.99, "categorie": "Alimentation"},
            {"date": "2025-03-14", "montant": 49.99, "categorie": "Électronique"},
        ]
    }
    return home_data
