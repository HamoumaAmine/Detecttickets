from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db_connection import get_db
from services.auth_service import get_current_user
from models.ticket import Ticket
from models.commercant import Commercant
from models.details_produit import DetailsProduit
from datetime import datetime

router = APIRouter(prefix="/ticket", tags=["Tickets"])

@router.get("/")
def list_tickets(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    results = db.query(
        Commercant.nom,
        func.sum(Ticket.montant_total).label("total_depense"),
        func.max(Ticket.date_achat).label("dernier_achat")
    ).join(Ticket).filter(
        Ticket.utilisateur_id == current_user.id
    ).group_by(
        Commercant.nom
    ).order_by(
        func.max(Ticket.date_achat).desc()
    ).all()

    return [
        {
            "commercant": r.nom,
            "total_depense": round(float(r.total_depense), 2),
            "dernier_achat": r.dernier_achat.strftime("%d/%m/%Y")
        } for r in results
    ]


# ✅ PUT : mise à jour du ticket + produits associés sans toucher à la catégorie
@router.put("/{ticket_id}/update")
def update_ticket(ticket_id: int, data: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.utilisateur_id == current_user.id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket non trouvé")

    # ✅ Mise à jour du montant total
    if "total" in data:
        try:
            ticket.montant_total = float(data["total"].replace("€", "").replace(",", "."))
        except:
            raise HTTPException(status_code=400, detail="Format de montant total invalide")

    # ✅ Mise à jour des articles (sans modifier la catégorie)
    if "items" in data:
        for item in data["items"]:
            produit = db.query(DetailsProduit).filter(
                DetailsProduit.id == item.get("id"),
                DetailsProduit.ticket_id == ticket.id
            ).first()
            if produit:
                produit.article = item.get("name", produit.article)
                try:
                    produit.quantite = int(item.get("quantity", produit.quantite))
                    produit.prix_total = float(item.get("price", "").replace("€", "").replace(",", "."))
                except:
                    continue  # ignore si problème de format

    db.commit()
    return {"message": "Ticket mis à jour avec succès"}
