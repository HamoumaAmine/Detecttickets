# models/offre.py
from sqlalchemy import Column, Integer, String, Text, Float, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database.db_connection import Base

class Offre(Base):
    __tablename__ = 'offres'

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String(255), nullable=False)
    description = Column(String(255))
    reduction = Column(Float)  # ✅ Nouveau
    image_produit = Column(Text)  # ✅ Nouveau
    date_debut = Column(Date)  # ✅ Nouveau
    date_fin = Column(Date)  # ✅ Nouveau
    active = Column(Boolean, default=True)  # ✅ Nouveau

    categorie_id = Column(Integer, ForeignKey("categories.id"))
    commercant_id = Column(Integer, ForeignKey("commercants.id"))
    coupon = relationship("Coupon", back_populates="offre", uselist=False)
    categorie = relationship("Categorie", back_populates="offres")
    commercant = relationship("Commercant", back_populates="offres")

from models.coupons import Coupon  # 🔽 tout en bas pour éviter les boucles
