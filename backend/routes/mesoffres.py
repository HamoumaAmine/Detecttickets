from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db_connection import get_db
from services.auth_service import get_current_user
from models.utilisateur import Utilisateur
from models.offre import Offre
from models.coupons import Coupon

router = APIRouter()

# 🔶 Route 1 - Offres classiques
@router.get("/mesoffres/")
def mes_offres(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter_by(id=current_user.id).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    offres = db.query(Offre).filter_by(active=True).all()

    return {
        "utilisateur": {
            "nom": utilisateur.nom,
            "photo": utilisateur.photo,
            "niveau": utilisateur.niveau,
            "points": utilisateur.points,
        },
        "offres": [
            {
                "id": o.id,
                "titre": o.titre,
                "description": o.description,
                "date_fin": o.date_fin.strftime("%d/%m/%Y") if o.date_fin else None,
                "image_produit": o.image_produit,
                "logo": o.commercant.logo if o.commercant else None
            }
            for o in offres
        ]
    }

# 🔶 Route 2 - Offres Coupons
@router.get("/mesoffres/coupons")
def mes_offres_coupons(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter_by(id=current_user.id).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    coupons = db.query(Coupon).filter_by(active=True).all()

    return {
        "utilisateur": {
            "nom": utilisateur.nom,
            "photo": utilisateur.photo,
            "niveau": utilisateur.niveau,
            "points": utilisateur.points,
        },
        "offres": [
            {
                "id": c.id,
                "titre": c.titre,
                "description": c.description,
                "reduction": c.reduction,
                "date_fin": c.date_fin,
                "image_produit": c.image_produit,
                "logo": c.commercant.logo if c.commercant else None
            }
            for c in coupons
        ]
    }

# 🔶 Route 3 - Obtenir un coupon
@router.post("/obtenir-coupon/{coupon_id}")
def obtenir_coupon(coupon_id: int, db: Session = Depends(get_db), current_user: Utilisateur = Depends(get_current_user)):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id, Coupon.active == 1).first()

    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon introuvable ou déjà désactivé")

    if current_user.points < int(coupon.reduction):
        raise HTTPException(status_code=400, detail="Points insuffisants pour obtenir ce coupon")

    # Vérifie si le coupon appartient déjà à l'utilisateur
    if coupon.utilisateur_id == current_user.id:
        raise HTTPException(status_code=400, detail="Ce coupon vous appartient déjà")

    # Décrémenter les points de l'utilisateur
    current_user.points -= int(coupon.reduction)

    # Attribuer le coupon à l'utilisateur
    coupon.utilisateur_id = current_user.id
    coupon.active = 0  # désactivation après obtention

    db.commit()

    return {
        "message": "Coupon obtenu avec succès",
        "points_restants": current_user.points,
        "coupon_id": coupon.id,
        "coupon_titre": coupon.titre
    }
