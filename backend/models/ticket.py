from database.db_connection import Base
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, String, DECIMAL
from sqlalchemy.orm import relationship
from datetime import datetime

class Ticket(Base):
    __tablename__ = 'tickets'

    id = Column(Integer, primary_key=True, index=True)
    utilisateur_id = Column(Integer, ForeignKey('utilisateurs.id'))
    commercant_id = Column(Integer, ForeignKey('commercants.id'))
    numero_ticket = Column(String(100), nullable=False)
    date_achat = Column(TIMESTAMP, default=datetime.utcnow)
    montant_total = Column(DECIMAL(10,2), nullable=False)
    moyen_paiement = Column(String, nullable=True)  # ✅ Nouveau champ

    utilisateur = relationship("Utilisateur", back_populates="tickets")
    commercant = relationship("Commercant", back_populates="tickets")

    details_produits = relationship("DetailsProduit", back_populates="ticket")
    historique_scans = relationship("HistoriqueScan", back_populates="ticket")
