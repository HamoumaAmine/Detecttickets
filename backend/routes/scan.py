from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from services.detectimage import process_image
import os
import shutil

router = APIRouter(prefix="/scan", tags=["Scan"])

@router.post("/")
async def scan_ticket(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    temp_path = f"temp/{file.filename}"

    try:
        # ✅ On sauvegarde l'image reçue
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ✅ Appel de ton script Veryfi + Mistral
        result = process_image(temp_path)

        # ✅ Nettoyage fichier temporaire
        os.remove(temp_path)

        # ✅ Gestion des erreurs de process_image
        if isinstance(result, dict) and "error" in result:
            return JSONResponse(content={"error": result["error"]}, status_code=500)

        # ✅ Renvoi du résultat OCR sous forme de JSON
        return JSONResponse(content={"message": "Scan réussi", "result": result})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
