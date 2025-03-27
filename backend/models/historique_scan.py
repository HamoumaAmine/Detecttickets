from database.db_connection import Base

from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class HistoriqueScan(Base):
    __tablename__ = 'historique_scans'

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey('tickets.id'))
    utilisateur_id = Column(Integer, ForeignKey('utilisateurs.id'))
    date_scan = Column(TIMESTAMP, default=datetime.utcnow)
    mode_scan = Column(String(100))

    ticket = relationship("Ticket", back_populates="historique_scans")
    utilisateur = relationship("Utilisateur", back_populates="historique_scans")
