import sys
import os

# 🔧 Ajout du chemin parent pour que les imports fonctionnent
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.db_connection import Base, engine

# ✅ Importation de tous les modèles (y compris coupons)
from models.utilisateur import Utilisateur
from models.ticket import Ticket
from models.offre import Offre
from models.coupons import Coupon
from models.categorie import Categorie
from models.carte_fidelite import CarteFidelite
from models.details_produit import DetailsProduit
from models.historique_scan import HistoriqueScan
from models.commercant import Commercant

print("🛠️ Création des tables dans la base de données...")
Base.metadata.create_all(bind=engine)
print("✅ Toutes les tables ont été créées avec succès !")
