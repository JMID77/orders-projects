-- 1. Nettoyage sécurisé
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM order_line;
DELETE FROM order_header;
DELETE FROM customers;
DELETE FROM products;
ALTER TABLE order_line AUTO_INCREMENT = 1;
ALTER TABLE order_header AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. 30 Clients avec noms d'entreprises réalistes
INSERT INTO customers (code, name, address, email) VALUES
('C-ALPHA', 'Alpha Logistique SARL', '12 Rue de la Marne, Paris', 'contact@alphalog.fr'),
('C-BETA', 'Bêta Design Studio', '45 Avenue des Arts, Lyon', 'admin@betadesign.com'),
('C-GAMMA', 'Gamma Services IT', '1 Place de la Mairie, Nantes', 'achats@gammaserv.it'),
('C-DELTA', 'Delta Construct SAS', '8 bis Rue de Rennes, Bordeaux', 'p.durand@deltaconstruct.fr'),
('C-EPSIL', 'Epsilon Distribution', '102 Boulevard Haussmann, Paris', 'info@epsilondistrib.com'),
('C-ZETA', 'Zeta Énergie France', '5 Quai de la Joliette, Marseille', 'ops@zeta-energie.fr'),
('C-ETA', 'Eta Communication', '19 Rue des Arts, Toulouse', 'hello@eta-com.com'),
('C-THETA', 'Theta Pharma', '3 Rue du Pain, Strasbourg', 'labo@thetapharm.fr'),
('C-IOTA', 'Iota Consultant', 'Zone Industrielle Nord, Lille', 'conseil@iota.fr'),
('C-KAPPA', 'Kappa Hotel Group', 'La Croisette, Cannes', 'resas@kappagroup.com'),
('C-LAMB', 'Lambda Retail', '74 Rue de la Liberté, Dijon', 'achats@lambda.fr'),
('C-MU', 'Mu Ingénierie', '120 Rue Pasteur, Grenoble', 'tech@mu-ing.fr'),
('C-NU', 'Nu Media Agency', '4 Square de Versailles, Paris', 'contact@numedia.pro'),
('C-XI', 'Xi Architecture', '22 Allée des Pins, Montpellier', 'studio@xi-arch.fr'),
('C-OMIC', 'Omicron Tech', '66 Route de Brest, Rennes', 'support@omicron.tech'),
('C-PI', 'Pi Restauration', '90 Boulevard Voltaire, Paris', 'direction@piresto.fr'),
('C-RHO', 'Rho Transport', '11 Rue des Alpes, Annecy', 'logistique@rho.fr'),
('C-SIGMA', 'Sigma Manufacturing', 'ZAC de la Vallée, Metz', 'usine@sigma-mfg.com'),
('C-TAU', 'Tau Legal & Co', '15 Quai aux Fleurs, Paris', 'avocats@taulegal.com'),
('C-UPSI', 'Upsilon Event', '2 Avenue de l''Europe, Nice', 'staff@upsi-event.fr'),
('C-PHI', 'Phi Formation', '31 Rue du Midi, Tours', 'etudes@phiformation.fr'),
('C-CHI', 'Chi Paysage', '48 Route de Lyon, Saint-Étienne', 'contact@chi-paysage.fr'),
('C-PSI', 'Psi Security', '10 Rue de la Paix, Rouen', 'vigile@psi-secu.com'),
('C-OMEG', 'Omega Immobilier', '55 Avenue de la Mer, Biarritz', 'agence@omega-immo.fr'),
('C-ADRI', 'Adria Consulting', '2 bis Rue du Port, Lorient', 'info@adria.fr'),
('C-SOLA', 'Solaris Energy', '9 Quai des Belges, Marseille', 'sales@solaris.fr'),
('C-VERO', 'Vero Data', '14 Rue de l''Industrie, Limoges', 'admin@verodata.io'),
('C-LUMI', 'Lumitech Lighting', '108 Rue du Faubourg, Paris', 'bureau@lumitech.fr'),
('C-NOVA', 'Novastream', '17 Avenue Foch, Nancy', 'contact@novastream.fr'),
('C-AXIS', 'Axis Global', '1 Place d''Italie, Paris', 'hq@axisglobal.com');

-- 3. 60 Produits avec désignations précises (IT & Bureau)
INSERT INTO products (code, description, price) VALUES
('P-LAP-M3', 'MacBook Pro 14 M3 16/512Go', 1999.00),
('P-LAP-XPS', 'Dell XPS 13 Platinum i7', 1450.00),
('P-SCR-LG', 'Écran LG Ultrafine 27" 4K', 449.00),
('P-SCR-SAM', 'Samsung Odyssey G7 32"', 620.00),
('P-MOU-MX', 'Souris Logitech MX Master 3S', 99.90),
('P-KEY-KC', 'Clavier Mécanique Keychron K2V2', 120.00),
('P-CAS-SNY', 'Casque Sony WH-1000XM5 Black', 349.00),
('P-CAS-BOS', 'Bose QuietComfort Headphones', 299.00),
('P-SSD-S2T', 'Samsung T7 Shield 2To Bleu', 189.00),
('P-SSD-S1T', 'Samsung T7 Shield 1To Gris', 105.00),
('P-DOC-BEL', 'Station Belkin Thunderbolt 4', 280.00),
('P-DOC-ANK', 'Hub USB-C Anker 8-en-1', 59.00),
('P-IPA-M2', 'iPad Air 256Go M2 Gris', 789.00),
('P-IPA-PEN', 'Apple Pencil Pro', 149.00),
('P-WEB-LOG', 'Webcam Logitech C920 HD', 79.00),
('P-MIC-SHU', 'Micro Shure MV7 USB', 250.00),
('P-CAB-HDM', 'Câble HDMI 2.1 Tressé 2m', 24.50),
('P-CAB-USC', 'Câble USB-C 100W PD 3m', 19.90),
('P-PRI-HP', 'HP LaserJet Pro M404dn', 320.00),
('P-PRI-TON', 'Toner HP 59A Noir', 115.00);

-- On complète pour arriver à 60
INSERT INTO products (code, description, price)
SELECT CONCAT('P-ACC-', n), CONCAT('Fourniture de bureau Premium #', n), ROUND(15 + (RAND() * 80), 2)
FROM (SELECT @row2 := @row2 + 1 AS n FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) t1, (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) t2, (SELECT @row2 := 21) r) nums LIMIT 40;

-- 4. Procédure pour 300 commandes sur 2 ans
DELIMITER //
CREATE PROCEDURE PopulateRealisticOrders()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE current_header_id INT;
    DECLARE rand_cust_id INT;
    DECLARE rand_prod_id INT;
    DECLARE rand_date DATETIME;
    DECLARE diff_days INT;
    DECLARE rand_status VARCHAR(20);
    DECLARE j INT;
    DECLARE nb_lines INT;

    WHILE i <= 300 DO
        -- 1. Setup client et date
        SET rand_cust_id = (SELECT id FROM customers ORDER BY RAND() LIMIT 1);
        SET rand_date = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 730) DAY);
        SET diff_days = DATEDIFF(NOW(), rand_date);

        -- 2. Logique de statut réaliste
        -- Si la commande a plus de 10 jours, elle a 85% de chance d'être SHIPPED, 10% CANCELLED, 5% VALIDATED
        -- Si elle a moins de 10 jours, elle est probablement CREATED ou VALIDATED
        SET rand_status = 
            CASE 
                WHEN RAND() < 0.08 THEN 'CANCELLED' -- 8% d'annulations constantes
                WHEN diff_days > 15 THEN 'SHIPPED'  -- Vieilles commandes -> Expédiées
                WHEN diff_days > 5 THEN 
                    IF(RAND() > 0.3, 'VALIDATED', 'CREATED')
                ELSE 'CREATED'
            END;

        -- 3. Insertion OrderHeader
        INSERT INTO order_header (code, customerId, date, status) 
        VALUES (CONCAT('ORD-', YEAR(rand_date), '-', LPAD(i, 4, '0')), rand_cust_id, rand_date, rand_status);
        
        SET current_header_id = LAST_INSERT_ID();
        
        -- 4. Entre 1 et 4 lignes par commande
        SET nb_lines = FLOOR(1 + (RAND() * 4));
        SET j = 1;
        WHILE j <= nb_lines DO
            SELECT id, price INTO rand_prod_id, @p_price FROM products ORDER BY RAND() LIMIT 1;
            
            INSERT INTO order_line (orderHeaderId, productId, quantity, price)
            VALUES (current_header_id, rand_prod_id, FLOOR(1 + (RAND() * 3)), @p_price);
            
            SET j = j + 1;
        END WHILE;

        SET i = i + 1;
    END WHILE;
END //

DELIMITER ;

-- Lancement
CALL PopulateRealisticOrders();
DROP PROCEDURE PopulateRealisticOrders;

