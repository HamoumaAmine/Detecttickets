from database.db_connection import Base

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Commercant(Base):
    __tablename__ = 'commercants'

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(255), nullable=False)
    adresse = Column(String(255))
    telephone = Column(String(20))
    logo = Column(String(255), nullable=True)



    tickets = relationship("Ticket", back_populates="commercant")  # ajouté
    offres = relationship("Offre", back_populates="commercant")
    cartes_fidelite = relationship("CarteFidelite", back_populates="commercant")
    coupons = relationship("Coupon", back_populates="commercant")

