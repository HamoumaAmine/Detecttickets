from sqlalchemy.orm import Session
from models import Ticket, Commercant, DetailsProduit, Categorie, Utilisateur
from datetime import datetime

from sqlalchemy.orm import Session
from models import Ticket, Commercant, DetailsProduit, Categorie, Utilisateur
from datetime import datetime
from decimal import Decimal

def enregistrer_ticket(result, utilisateur_id: int, db: Session):
    # 1. Vérifie si le ticket existe déjà
    numero_ticket = result.get("ticket_number")
    if not numero_ticket:
        raise ValueError("Numéro de ticket manquant.")
    
    ticket_existant = db.query(Ticket).filter(Ticket.numero_ticket == numero_ticket).first()
    if ticket_existant:
        raise ValueError("Ce ticket a déjà été scanné.")

    # 2. Cherche ou crée le commerçant
    commerçant_nom = result.get("store_name", "Commerçant inconnu")
    commerçant = db.query(Commercant).filter(Commercant.nom == commerçant_nom).first()
    if not commerçant:
        commerçant = Commercant(nom=commerçant_nom)
        db.add(commerçant)
        db.commit()
        db.refresh(commerçant)

    # 3. Crée le ticket
    try:
        date_achat = datetime.strptime(result.get("date_time"), "%d-%m-%Y %H:%M:%S")
    except Exception:
        date_achat = datetime.utcnow()

    ticket = Ticket(
        utilisateur_id=utilisateur_id,
        commercant_id=commerçant.id,
        numero_ticket=numero_ticket,
        montant_total=result.get("total_amount", 0),
        date_achat=date_achat
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    # 4. Enregistre les produits et récupère leurs détails complets
    produits_avec_details = []  # Liste pour stocker les détails des produits
    for item in result.get("items", []):
        # Vérifie si la catégorie existe, sinon la crée
        nom_categorie = item.get("category", "Inconnu")
        categorie = db.query(Categorie).filter(Categorie.nom == nom_categorie).first()
        if not categorie:
            categorie = Categorie(nom=nom_categorie)
            db.add(categorie)
            db.commit()
            db.refresh(categorie)

        # Crée le produit
        produit = DetailsProduit(
            ticket_id=ticket.id,
            categorie_id=categorie.id,
            article=item.get("description", "Article"),
            quantite=item.get("quantity", 1),
            prix_unitaire=item.get("price", 0) or 0,
            prix_total=item.get("total", 0) or 0
        )
        db.add(produit)
        db.commit()
        db.refresh(produit)

        # Ajouter le produit avec ses détails à la liste
        produits_avec_details.append({
            "id": produit.id,
            "article": produit.article,
            "quantite": produit.quantite,
            "prix_unitaire": float(produit.prix_unitaire),  # Convertir Decimal en float
            "prix_total": float(produit.prix_total)  # Convertir Decimal en float
        })

    # 5. Ajoute 15 points à l'utilisateur
    utilisateur = db.query(Utilisateur).filter(Utilisateur.id == utilisateur_id).first()
    if utilisateur:
        utilisateur.points += 15

    # 6. Commit final
    db.commit()
    
    # Retourne l'ID du ticket et les produits avec tous leurs détails
    return ticket.id, produits_avec_details  # Retourne l'ID du ticket et la liste des produits avec leurs détails


def ticket_existe(db: Session, numero_ticket: str, commercant_nom: str, utilisateur_id: int) -> bool:
    commerçant = db.query(Commercant).filter(Commercant.nom == commercant_nom).first()
    if not commerçant:
        return False

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.numero_ticket == numero_ticket,
            Ticket.commercant_id == commerçant.id,
            Ticket.utilisateur_id == utilisateur_id
        )
        .first()
    )
    return ticket is not None

def ajouter_points_utilisateur(db: Session, utilisateur_id: int, points: int = 15):
    utilisateur = db.query(Utilisateur).filter(Utilisateur.id == utilisateur_id).first()
    if utilisateur:
        utilisateur.points += points
        db.commit()
