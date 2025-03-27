# utilisateur.py
from database.db_connection import Base

from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime

class Utilisateur(Base):
    __tablename__ = 'utilisateurs'

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    mot_de_passe = Column(String(255), nullable=False)
    date_inscription = Column(TIMESTAMP, default=datetime.utcnow)

    photo = Column(String(255), nullable=True)  # ✅ nouveau
    points = Column(Integer, default=0)         # ✅ nouveau
    niveau = Column(String(50), default="Bronze")  # ✅ nouveau

    tickets = relationship("Ticket", back_populates="utilisateur")
    cartes_fidelite = relationship("CarteFidelite", back_populates="utilisateur")
    historique_scans = relationship("HistoriqueScan", back_populates="utilisateur")
    coupons = relationship("Coupon", back_populates="utilisateur")

from models.coupons import Coupon
