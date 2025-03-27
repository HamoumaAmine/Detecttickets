from .auth import router as auth_router
from .home import router as home_router
from .mesoffres import router as offres_router
from .categorie import router as categories_router
from .ticket import router as tickets_router

__all__ = [
    "auth_router",
    "home_router",
    "offres_router",
    "categories_router",
    "tickets_router"
]
