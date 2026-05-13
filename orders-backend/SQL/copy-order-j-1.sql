-- On insère 4 nouvelles entêtes basées sur des commandes existantes
INSERT INTO order_header (code, customerId, date, status)
SELECT 
    CONCAT('TEST-J1-', id, '-', FLOOR(RAND()*1000)), 
    customerId, 
    DATE_SUB(CURDATE(), INTERVAL 1 DAY), -- Force à hier
    'SHIPPED'
FROM order_header
ORDER BY RAND()
LIMIT 4;

-- On récupère les IDs des entêtes qu'on vient de créer pour leur ajouter des lignes
-- Cette requête duplique les lignes de produits des commandes sources vers les nouvelles
INSERT INTO order_line (orderHeaderId, productId, quantity, price)
SELECT 
    (SELECT h.id FROM order_header h WHERE h.code LIKE 'TEST-J1-%' ORDER BY h.id DESC LIMIT 1 OFFSET 0), -- Lien vers nouvelle commande
    l.productId, 
    l.quantity, 
    l.price
FROM order_line l
WHERE l.orderHeaderId IN (SELECT id FROM (SELECT id FROM order_header WHERE code NOT LIKE 'TEST-J1-%' ORDER BY RAND() LIMIT 4) tmp)
LIMIT 10; 
