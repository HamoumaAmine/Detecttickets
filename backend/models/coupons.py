# ✅ coupons.py
from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from database.db_connection import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    reduction = Column(Float, nullable=True)
    image_produit = Column(String(255), nullable=True)
    date_debut = Column(String(255), nullable=True)
    date_fin = Column(String(255), nullable=True)
    titre = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    categorie_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=True)
    active = Column(Integer, default=1)



    offre_id = Column(Integer, ForeignKey("offres.id"))
    
    commercant_id = Column(Integer, ForeignKey("commercants.id"))

    offre = relationship("Offre", back_populates="coupon")
    utilisateur = relationship("Utilisateur", back_populates="coupons")
    commercant = relationship("Commercant", back_populates="coupons")
    categorie = relationship("Categorie", back_populates="coupons")



