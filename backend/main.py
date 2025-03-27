from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from routes import mesoffres  # ✅ NE PAS écrire from backend.routes
from routes import auth, home, categorie, ticket
from routes import scan  

app = FastAPI()

# ✅ Middleware CORS bien configuré et placé AVANT les routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← Autorise TOUT pour les tests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Inclusion des routes FastAPI
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(home.router, prefix="/home", tags=["Home"])
app.include_router(mesoffres.router)
app.include_router(categorie.router, prefix="/categories", tags=["Catégories"])
app.include_router(ticket.router, prefix="/tickets", tags=["Tickets"])
app.include_router(scan.router, prefix="/scan", tags=["Scan"])


@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API"}



