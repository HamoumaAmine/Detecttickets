from database.db_connection import engine
from sqlalchemy import text

try:
    # Essayer d'établir une connexion
    with engine.connect() as connection:
        # Exécuter une requête simple
        result = connection.execute(text("SELECT 1"))
        print("Connexion réussie !")
        print(f"Résultat: {result.fetchone()}")
except Exception as e:
    print(f"Erreur de connexion: {str(e)}")