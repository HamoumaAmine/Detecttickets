from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database.db_connection import get_db
from services.auth_service import get_current_user
from models.utilisateur import Utilisateur
from models.ticket import Ticket
from models.details_produit import DetailsProduit
from models.categorie import Categorie
from models.offre import Offre
from models.commercant import Commercant

router = APIRouter()

@router.get("/")
def home(current_user: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    utilisateur_id = current_user.id
    premier_jour_mois = datetime(datetime.today().year, datetime.today().month, 1)

    # 🎯 Total des dépenses du mois
    tickets_mois = db.query(Ticket).filter(
        Ticket.utilisateur_id == utilisateur_id,
        Ticket.date_achat >= premier_jour_mois
    ).all()
    total_depenses = sum(float(t.montant_total) for t in tickets_mois)

    # 📊 Dépenses par catégorie
    depenses_par_categorie = {}
    for ticket in tickets_mois:
        for produit in ticket.details_produits:
            categorie = produit.categorie.nom if produit.categorie else "Autre"
            depenses_par_categorie[categorie] = depenses_par_categorie.get(categorie, 0) + float(produit.prix_total)

    # 🧾 Derniers tickets (limite à 5)
    derniers_tickets = db.query(Ticket).filter(
        Ticket.utilisateur_id == utilisateur_id
    ).order_by(Ticket.date_achat.desc()).limit(5).all()

    tickets_data = []
    for ticket in derniers_tickets:
        produits = []
        for p in ticket.details_produits:
            produits.append({
                "article": p.article,
                "prix_total": float(p.prix_total),
                "categorie": p.categorie.nom if p.categorie else None
            })

        tickets_data.append({
            "date_achat": ticket.date_achat.isoformat(),
            "montant_total": float(ticket.montant_total),
            "commercant": ticket.commercant.nom if ticket.commercant else None,
            "produits": produits
        })

        # 🎁 Offres actives (filtrées par validité et enrichies avec logo et image produit)
    try:
        offres = db.query(Offre).filter(Offre.date_fin >= datetime.today()).limit(3).all()
    except Exception as e:
        print("⚠️ Erreur lors de la récupération des offres :", e)
        offres = []

    offres_data = [
        {
            "titre": o.titre,
            "categorie": o.categorie.nom if o.categorie else None,
            "description": o.description,
            "date_fin": o.date_fin.strftime("%d/%m/%Y") if o.date_fin else None,
            "commercant": o.commercant.nom if o.commercant else None,
            "logo": o.commercant.logo if o.commercant and o.commercant.logo else None,
            "image_produit": o.image_produit,
            "reduction": o.reduction,
            "date_debut": o.date_debut.strftime("%d/%m/%Y") if o.date_debut else None

            
        }
        for o in offres
    ]

    return {
        "message": f"Bienvenue {current_user.nom} !",
        "total_depenses_mois": total_depenses,
        "depenses_par_categorie": depenses_par_categorie,
        "derniers_tickets": tickets_data,
        "offres_actives": offres_data
    }
