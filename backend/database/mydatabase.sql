CREATE TABLE utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commercants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(255),
    telephone VARCHAR(20),
    logo VARCHAR(255)
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT,
    commercant_id INT,
    numero_ticket VARCHAR(100) NOT NULL,
    date_achat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    montant_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (commercant_id) REFERENCES commercants(id)
);

CREATE TABLE details_produits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT,
    categorie_id INT,
    article VARCHAR(255) NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

CREATE TABLE historique_scans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT,
    utilisateur_id INT,
    date_scan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mode_scan VARCHAR(100),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

CREATE TABLE cartes_fidelite (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT,
    commercant_id INT,
    numero_carte VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_expiration DATE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (commercant_id) REFERENCES commercants(id)
);

CREATE TABLE offres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    reduction FLOAT,
    image_produit TEXT,
    date_debut DATE,
    date_fin DATE,
    active BOOLEAN DEFAULT TRUE,
    categorie_id INT,
    commercant_id INT,
    FOREIGN KEY (categorie_id) REFERENCES categories(id),
    FOREIGN KEY (commercant_id) REFERENCES commercants(id)
);
