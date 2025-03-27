from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db_connection import get_db
from services.auth_service import get_current_user
from models.ticket import Ticket
from models.commercant import Commercant

router = APIRouter()

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


