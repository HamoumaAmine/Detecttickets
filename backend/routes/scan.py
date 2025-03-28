from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import shutil
from services.detectimage import process_image
from services.scan_utils import (
    ticket_existe,
    ajouter_points_utilisateur,
    enregistrer_ticket
)
from database.db_connection import get_db
from dependencies import get_current_user  # ← Assure-toi que cette dépendance fonctionne (auth)

router = APIRouter(prefix="/scan", tags=["Scan"])

@router.post("/")
async def scan_ticket(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    os.makedirs("temp", exist_ok=True)
    temp_path = f"temp/{file.filename}"

    try:
        # ✅ Sauvegarde temporaire de l'image
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ✅ OCR + Mistral (extraction des données du ticket)
        result = process_image(temp_path)

        # ✅ Nettoyage (suppression de l'image temporaire)
        os.remove(temp_path)

        if isinstance(result, dict) and "error" in result:
            return JSONResponse(content={"error": result["error"]}, status_code=500)

        numero_ticket = result.get("ticket_number")
        commerçant_nom = result.get("store_name")

        # ✅ Vérifie si le ticket existe déjà
        if ticket_existe(db, numero_ticket, commerçant_nom, current_user["id"]):
            return JSONResponse(
                content={"error": "Ce ticket a déjà été scanné."}, status_code=400
            )

        # ✅ Enregistre le ticket, les produits et récupère leurs IDs
        ticket_id, produits_avec_ids = enregistrer_ticket(result, current_user["id"], db)

        # ✅ Ajoute 15 points à l'utilisateur
        ajouter_points_utilisateur(db, current_user["id"], points=15)

        # ✅ Retourne l'ID du ticket, et les produits avec leurs détails et IDs dans la réponse
        return JSONResponse(content={
            "message": "Scan réussi",
            "ticket_id": ticket_id,  # ID du ticket
            "produits": produits_avec_ids,  # Liste des produits avec leurs IDs et détails
            "result": result  # Détails du ticket et des produits scannés
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
