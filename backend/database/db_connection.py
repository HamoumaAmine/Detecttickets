from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib.parse

# Encodez le mot de passe pour éviter les problèmes avec les caractères spéciaux
password = urllib.parse.quote_plus("Ahfgkij2024**")
DATABASE_URL = f"mysql+pymysql://root:{password}@localhost/mon_projet"

# Création du moteur SQLAlchemy avec plus de détails sur les erreurs
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True, connect_args={"connect_timeout": 10})

# Création de la session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()

# Fonction pour obtenir une session DB avec plus de logs
def get_db():
    print("Tentative de connexion à la base de données...")
    db = SessionLocal()
    try:
        print("Connexion à la base de données réussie")
        yield db
    except Exception as e:
        print(f"Erreur de connexion à la base de données: {str(e)}")
        raise
    finally:
        print("Fermeture de la connexion à la base de données")
        db.close()