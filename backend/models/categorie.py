from database.db_connection import Base

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Categorie(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)

    details_produits = relationship("DetailsProduit", back_populates="categorie")  # modifié
    offres = relationship("Offre", back_populates="categorie")
    coupons = relationship("Coupon", back_populates="categorie")