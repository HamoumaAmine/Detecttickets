from database.db_connection import Base

from sqlalchemy import Column, Integer, String, TIMESTAMP, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class CarteFidelite(Base):
    __tablename__ = 'cartes_fidelite'

    id = Column(Integer, primary_key=True, index=True)
    utilisateur_id = Column(Integer, ForeignKey('utilisateurs.id'))
    commercant_id = Column(Integer, ForeignKey('commercants.id'))
    numero_carte = Column(String(255))
    date_creation = Column(TIMESTAMP, default=datetime.utcnow)
    date_expiration = Column(Date)

    utilisateur = relationship("Utilisateur", back_populates="cartes_fidelite")
    commercant = relationship("Commercant", back_populates="cartes_fidelite")
