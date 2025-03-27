from database.db_connection import Base

from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship

class DetailsProduit(Base):
    __tablename__ = 'details_produits'

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey('tickets.id'))
    categorie_id = Column(Integer, ForeignKey('categories.id'))  # ajouté
    article = Column(String(255), nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_unitaire = Column(DECIMAL(10,2), nullable=False)
    prix_total = Column(DECIMAL(10,2), nullable=False)

    ticket = relationship("Ticket", back_populates="details_produits")
    categorie = relationship("Categorie", back_populates="details_produits")  # ajouté
