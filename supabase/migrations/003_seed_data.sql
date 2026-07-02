-- Seed: 12 categories, ~100 products, product images

-- Categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  ('cat-001', 'Electronics', 'electronics', 'Cutting-edge gadgets and devices', 1),
  ('cat-002', 'Fashion', 'fashion', 'Trendsetting apparel and accessories', 2),
  ('cat-003', 'Home & Living', 'home-living', 'Beautiful furnishings for every space', 3),
  ('cat-004', 'Beauty', 'beauty', 'Premium skincare and cosmetics', 4),
  ('cat-005', 'Sports & Outdoors', 'sports-outdoors', 'Gear for an active lifestyle', 5),
  ('cat-006', 'Books', 'books', 'Curated reads and bestsellers', 6),
  ('cat-007', 'Food & Drinks', 'food-drinks', 'Gourmet treats and artisanal beverages', 7),
  ('cat-008', 'Toys & Games', 'toys-games', 'Fun for all ages', 8),
  ('cat-009', 'Jewelry', 'jewelry', 'Handcrafted adornments', 9),
  ('cat-010', 'Office Supplies', 'office-supplies', 'Essentials for work and creativity', 10),
  ('cat-011', 'Pet Supplies', 'pet-supplies', 'Everything your furry friends need', 11),
  ('cat-012', 'Automotive', 'automotive', 'Car care and accessories', 12)
ON CONFLICT (id) DO NOTHING;

-- Products (Electronics)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-001', 'Wireless Noise-Canceling Headphones', 'wireless-noise-canceling-headphones', 'Premium over-ear headphones with active noise cancellation, 30-hour battery, and rich spatial audio.', 'cat-001', 349.99, 299.99, 'ELEC-001', 45, 'active', '{electronics,audio,headphones,wireless}'),
  ('prod-002', 'Ultra-Thin Laptop Stand', 'ultra-thin-laptop-stand', 'Anodized aluminum laptop stand with adjustable height and ergonomic tilt.', 'cat-001', 79.99, NULL, 'ELEC-002', 120, 'active', '{electronics,accessories,laptop}'),
  ('prod-003', '4K Webcam with Auto-Focus', '4k-webcam-auto-focus', 'Professional-grade 4K webcam with auto-focus, built-in ring light, and noise-canceling mic.', 'cat-001', 199.99, 169.99, 'ELEC-003', 67, 'active', '{electronics,camera,webcam}'),
  ('prod-004', 'Portable Bluetooth Speaker', 'portable-bluetooth-speaker', 'Waterproof portable speaker with 360-degree sound and 20-hour battery.', 'cat-001', 129.99, NULL, 'ELEC-004', 89, 'active', '{electronics,audio,speaker}'),
  ('prod-005', 'Mechanical Keyboard RGB', 'mechanical-keyboard-rgb', 'Hot-swappable mechanical keyboard with per-key RGB, PBT keycaps, and gasket mount.', 'cat-001', 169.99, 149.99, 'ELEC-005', 34, 'active', '{electronics,keyboard,gaming}'),
  ('prod-006', 'USB-C Hub 7-in-1', 'usb-c-hub-7-in-1', 'Compact USB-C hub with HDMI, SD card, USB-A, and 100W PD charging.', 'cat-001', 49.99, NULL, 'ELEC-006', 200, 'active', '{electronics,accessories,usb}'),
  ('prod-007', 'Smart Home Display', 'smart-home-display', '10-inch smart display with voice assistant, video calling, and home automation hub.', 'cat-001', 249.99, 229.99, 'ELEC-007', 28, 'active', '{electronics,smart-home,display}'),
  ('prod-008', 'Wireless Charging Pad', 'wireless-charging-pad', 'Fast wireless charger compatible with all Qi devices, 15W output with cooling fan.', 'cat-001', 39.99, NULL, 'ELEC-008', 150, 'active', '{electronics,charger,wireless}'),
  ('prod-009', 'Noise-Canceling Earbuds', 'noise-canceling-earbuds', 'True wireless earbuds with ANC, IPX5 water resistance, and compact charging case.', 'cat-001', 179.99, 159.99, 'ELEC-009', 55, 'active', '{electronics,audio,earbuds}'),
  ('prod-010', 'Ergonomic Mouse', 'ergonomic-mouse', 'Vertical ergonomic mouse with adjustable DPI, silent clicks, and USB-C charging.', 'cat-001', 59.99, NULL, 'ELEC-010', 92, 'active', '{electronics,mouse,ergonomic}'),
  ('prod-011', 'Portable Power Bank 20000mAh', 'portable-power-bank-20000mah', 'High-capacity power bank with dual USB-C, fast charging, and digital display.', 'cat-001', 69.99, 59.99, 'ELEC-011', 78, 'active', '{electronics,power,battery}'),
  ('prod-012', 'Smart LED Light Strip', 'smart-led-light-strip', '16.4ft RGBIC LED strip with app control, voice assistant, and music sync.', 'cat-001', 29.99, NULL, 'ELEC-012', 180, 'active', '{electronics,lighting,smart}');

-- Products (Fashion)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-013', 'Classic Leather Jacket', 'classic-leather-jacket', 'Genuine leather jacket with quilted lining, YKK zippers, and a tailored fit.', 'cat-002', 499.99, 399.99, 'FASH-001', 20, 'active', '{fashion,outerwear,leather}'),
  ('prod-014', 'Merino Wool Sweater', 'merino-wool-sweater', 'Lightweight merino wool crew neck sweater, machine washable and odor resistant.', 'cat-002', 189.99, NULL, 'FASH-002', 35, 'active', '{fashion,sweater,wool}'),
  ('prod-015', 'Slim Fit Chinos', 'slim-fit-chinos', 'Stretch cotton chinos with a modern slim fit and moisture-wicking finish.', 'cat-002', 89.99, 74.99, 'FASH-003', 60, 'active', '{fashion,pants,chinos}'),
  ('prod-016', 'Cashmere Blend Scarf', 'cashmere-blend-scarf', 'Luxurious cashmere blend scarf in heather gray, 70x200cm.', 'cat-002', 129.99, NULL, 'FASH-004', 40, 'active', '{fashion,accessories,scarf}'),
  ('prod-017', 'Organic Cotton T-Shirt Pack', 'organic-cotton-t-shirt-pack', 'Pack of 3 essential crew neck tees in black, white, and heather gray.', 'cat-002', 69.99, 59.99, 'FASH-005', 100, 'active', '{fashion,shirt,cotton}'),
  ('prod-018', 'Tailored Blazer', 'tailored-blazer', 'Two-button blazer in navy stretch wool, half-lined with notch lapels.', 'cat-002', 349.99, NULL, 'FASH-006', 15, 'active', '{fashion,blazer,formal}'),
  ('prod-019', 'Waterproof Rain Jacket', 'waterproof-rain-jacket', 'Breathable waterproof shell with sealed seams and adjustable hood.', 'cat-002', 229.99, 199.99, 'FASH-007', 25, 'active', '{fashion,outerwear,rain}'),
  ('prod-020', 'Denim Jacket', 'denim-jacket', 'Classic denim jacket in medium wash, 100% cotton with button closure.', 'cat-002', 149.99, NULL, 'FASH-008', 32, 'active', '{fashion,denim,jacket}'),
  ('prod-021', 'Running Sneakers', 'running-sneakers', 'Lightweight running shoes with responsive foam cushioning and breathable mesh upper.', 'cat-002', 139.99, 119.99, 'FASH-009', 48, 'active', '{fashion,sneakers,running}'),
  ('prod-022', 'Canvas Tote Bag', 'canvas-tote-bag', 'Heavy-duty canvas tote with leather handles and interior zip pocket.', 'cat-002', 79.99, NULL, 'FASH-010', 55, 'active', '{fashion,bags,tote}');

-- Products (Home & Living)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-023', 'Scented Soy Candle Set', 'scented-soy-candle-set', 'Set of 3 hand-poured soy candles: vanilla, lavender, and sandalwood.', 'cat-003', 49.99, 39.99, 'HOME-001', 75, 'active', '{home,candle,scented}'),
  ('prod-024', 'Linen Throw Blanket', 'linen-throw-blanket', 'Stonewashed linen throw in oatmeal, 130x170cm, pre-washed for softness.', 'cat-003', 89.99, NULL, 'HOME-002', 42, 'active', '{home,blanket,linen}'),
  ('prod-025', 'Ceramic Plant Pot Set', 'ceramic-plant-pot-set', 'Set of 3 matte ceramic planters with drainage holes, 4/5/6 inch.', 'cat-003', 59.99, 49.99, 'HOME-003', 60, 'active', '{home,planter,ceramic}'),
  ('prod-026', 'Marble Serving Board', 'marble-serving-board', 'Natural marble serving board with brass handles, 40x20cm.', 'cat-003', 69.99, NULL, 'HOME-004', 30, 'active', '{home,kitchen,marble}'),
  ('prod-027', 'Woven Wall Hanging', 'woven-wall-hanging', 'Hand-woven macrame wall decoration, 60x90cm, cotton rope.', 'cat-003', 44.99, NULL, 'HOME-005', 18, 'active', '{home,decor,wall}'),
  ('prod-028', 'Glass Food Storage Set', 'glass-food-storage-set', 'Set of 5 borosilicate glass containers with bamboo lids.', 'cat-003', 39.99, 34.99, 'HOME-006', 85, 'active', '{home,kitchen,storage}'),
  ('prod-029', 'Faux Fur Cushion', 'faux-fur-cushion', 'Plush faux fur cushion with removable cover, 45x45cm.', 'cat-003', 54.99, NULL, 'HOME-007', 40, 'active', '{home,cushion,fur}'),
  ('prod-030', 'Copper Mug Set', 'copper-mug-set', 'Set of 4 hammered copper mugs, perfect for Moscow mules.', 'cat-003', 64.99, 54.99, 'HOME-008', 35, 'active', '{home,kitchen,copper}');

-- Products (Beauty)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-031', 'Vitamin C Serum', 'vitamin-c-serum', '20% Vitamin C serum with hyaluronic acid and vitamin E, 30ml.', 'cat-004', 54.99, 44.99, 'BEAU-001', 90, 'active', '{beauty,skincare,serum}'),
  ('prod-032', 'Hydrating Face Moisturizer', 'hydrating-face-moisturizer', 'Lightweight gel-cream moisturizer with squalane and niacinamide, 50ml.', 'cat-004', 42.99, NULL, 'BEAU-002', 65, 'active', '{beauty,skincare,moisturizer}'),
  ('prod-033', 'Retinol Night Cream', 'retinol-night-cream', 'Anti-aging night cream with encapsulated retinol and peptides, 50ml.', 'cat-004', 64.99, 54.99, 'BEAU-003', 38, 'active', '{beauty,skincare,retinol}'),
  ('prod-034', 'Natural Lip Balm Set', 'natural-lip-balm-set', 'Set of 6 flavored lip balms with shea butter and coconut oil.', 'cat-004', 24.99, 19.99, 'BEAU-004', 110, 'active', '{beauty,lip,balm}'),
  ('prod-035', 'Hyaluronic Acid Sheet Masks', 'hyaluronic-acid-sheet-masks', 'Box of 10 sheet masks with hyaluronic acid and aloe vera.', 'cat-004', 29.99, NULL, 'BEAU-005', 75, 'active', '{beauty,skincare,masks}'),
  ('prod-036', 'Dry Brush for Skin', 'dry-brush-for-skin', 'Natural boar bristle dry brush with long handle for lymphatic drainage.', 'cat-004', 19.99, NULL, 'BEAU-006', 95, 'active', '{beauty,body,brush}'),
  ('prod-037', 'Nourishing Hair Oil', 'nourishing-hair-oil', 'Argan and jojoba hair oil for frizz control and shine, 100ml.', 'cat-004', 34.99, 29.99, 'BEAU-007', 50, 'active', '{beauty,hair,oil}'),
  ('prod-038', 'Mineral Sunscreen SPF 50', 'mineral-sunscreen-spf-50', 'Zinc-based mineral sunscreen, reef-safe and non-whitening, 60ml.', 'cat-004', 36.99, NULL, 'BEAU-008', 70, 'active', '{beauty,sunscreen,spf}');

-- Products (Sports & Outdoors)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-039', 'Yoga Mat Premium', 'yoga-mat-premium', 'Extra thick 6mm natural rubber yoga mat with alignment markings.', 'cat-005', 89.99, 74.99, 'SPRT-001', 45, 'active', '{sports,yoga,mat}'),
  ('prod-040', 'Insulated Water Bottle', 'insulated-water-bottle', 'Double-wall vacuum insulated bottle, 750ml, keeps cold 24h or hot 12h.', 'cat-005', 34.99, NULL, 'SPRT-002', 120, 'active', '{sports,bottle,insulated}'),
  ('prod-041', 'Resistance Bands Set', 'resistance-bands-set', 'Set of 5 fabric resistance bands with different tension levels and carrying bag.', 'cat-005', 29.99, 24.99, 'SPRT-003', 80, 'active', '{sports,fitness,bands}'),
  ('prod-042', 'Camping Hammock', 'camping-hammock', 'Double camping hammock with tree straps, holds 500lbs, includes stuff sack.', 'cat-005', 59.99, 49.99, 'SPRT-004', 35, 'active', '{sports,camping,hammock}'),
  ('prod-043', 'Adjustable Dumbbell Set', 'adjustable-dumbbell-set', 'Space-saving adjustable dumbbells, 5-52.5lbs per hand.', 'cat-005', 349.99, 299.99, 'SPRT-005', 12, 'active', '{sports,fitness,dumbbells}'),
  ('prod-044', 'Hiking Backpack 40L', 'hiking-backpack-40l', 'Lightweight hiking backpack with hydration sleeve and rain cover.', 'cat-005', 119.99, NULL, 'SPRT-006', 28, 'active', '{sports,hiking,backpack}'),
  ('prod-045', 'Foam Roller', 'foam-roller', 'High-density foam roller for muscle recovery, 33x14cm.', 'cat-005', 24.99, NULL, 'SPRT-007', 65, 'active', '{sports,fitness,recovery}'),
  ('prod-046', 'Cycling Gloves', 'cycling-gloves', 'Padded cycling gloves with gel inserts and touchscreen fingertips.', 'cat-005', 29.99, 24.99, 'SPRT-008', 50, 'active', '{sports,cycling,gloves}');

-- Products (Books)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-047', 'The Art of Mindfulness', 'the-art-of-mindfulness', 'A practical guide to finding peace in a busy world.', 'cat-006', 24.99, 19.99, 'BOOK-001', 100, 'active', '{books,mindfulness,wellness}'),
  ('prod-048', 'Modern JavaScript Mastery', 'modern-javascript-mastery', 'Comprehensive guide to modern JavaScript, ES2024 edition.', 'cat-006', 44.99, 39.99, 'BOOK-002', 55, 'active', '{books,technology,javascript}'),
  ('prod-049', 'The Great Novel', 'the-great-novel', 'A sweeping family saga spanning three generations across continents.', 'cat-006', 28.99, NULL, 'BOOK-003', 72, 'active', '{books,fiction,novel}'),
  ('prod-050', 'Cookbook: World Flavors', 'cookbook-world-flavors', '200 recipes from around the globe, with stunning food photography.', 'cat-006', 34.99, 29.99, 'BOOK-004', 40, 'active', '{books,cooking,recipes}'),
  ('prod-051', 'Design Thinking Handbook', 'design-thinking-handbook', 'A practical framework for creative problem-solving.', 'cat-006', 32.99, NULL, 'BOOK-005', 38, 'active', '{books,design,business}'),
  ('prod-052', 'Children Illustrated Encyclopedia', 'children-illustrated-encyclopedia', 'Beautifully illustrated reference book for curious minds ages 8-14.', 'cat-006', 39.99, 34.99, 'BOOK-006', 25, 'active', '{books,children,education}');

-- Products (Food & Drinks)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-053', 'Artisan Coffee Beans', 'artisan-coffee-beans', 'Single-origin Ethiopian Yirgacheffe, medium roast, 340g.', 'cat-007', 22.99, 19.99, 'FOOD-001', 90, 'active', '{food,coffee,artisan}'),
  ('prod-054', 'Organic Matcha Powder', 'organic-matcha-powder', 'Ceremonial grade Japanese matcha, stone-ground, 100g tin.', 'cat-007', 34.99, 29.99, 'FOOD-002', 60, 'active', '{food,matcha,tea}'),
  ('prod-055', 'Dark Chocolate Collection', 'dark-chocolate-collection', 'Gift box of 12 single-origin dark chocolates from 6 countries.', 'cat-007', 44.99, 39.99, 'FOOD-003', 45, 'active', '{food,chocolate,gourmet}'),
  ('prod-056', 'Cold Pressed Olive Oil', 'cold-pressed-olive-oil', 'Extra virgin olive oil from Tuscany, first cold press, 500ml.', 'cat-007', 28.99, NULL, 'FOOD-004', 35, 'active', '{food,olive-oil,gourmet}'),
  ('prod-057', 'Spice Sampler Set', 'spice-sampler-set', 'Set of 8 premium spice blends in glass jars with wooden rack.', 'cat-007', 39.99, 34.99, 'FOOD-005', 50, 'active', '{food,spices,cooking}'),
  ('prod-058', 'Craft Soda Variety Pack', 'craft-soda-variety-pack', '12-pack of small-batch craft sodas, 4 unique flavors.', 'cat-007', 29.99, NULL, 'FOOD-006', 70, 'active', '{food,soda,beverage}'),
  ('prod-059', 'Organic Honey Set', 'organic-honey-set', 'Set of 3 raw honeys: wildflower, manuka, and acacia, 250g each.', 'cat-007', 36.99, 31.99, 'FOOD-007', 55, 'active', '{food,honey,organic}'),
  ('prod-060', 'Premium Tea Collection', 'premium-tea-collection', 'Collection of 15 loose-leaf teas including green, black, and herbal.', 'cat-007', 42.99, NULL, 'FOOD-008', 40, 'active', '{food,tea,premium}');

-- Products (Toys & Games)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-061', 'Wooden Building Blocks', 'wooden-building-blocks', 'Set of 100 natural wood blocks in various shapes, safe water-based paint.', 'cat-008', 39.99, 34.99, 'TOYS-001', 50, 'active', '{toys,blocks,wooden}'),
  ('prod-062', 'Strategy Board Game', 'strategy-board-game', 'Award-winning Euro-style strategy game for 2-4 players, 45min playtime.', 'cat-008', 49.99, 44.99, 'TOYS-002', 35, 'active', '{toys,boardgame,strategy}'),
  ('prod-063', 'Remote Control Car', 'remote-control-car', 'Electric RC buggy with 30mph top speed, rechargeable battery, 2.4GHz.', 'cat-008', 79.99, 69.99, 'TOYS-003', 25, 'active', '{toys,rc,car}'),
  ('prod-064', 'Science Experiment Kit', 'science-experiment-kit', '50+ STEM experiments for ages 8+, includes lab equipment and guide.', 'cat-008', 44.99, 39.99, 'TOYS-004', 40, 'active', '{toys,stem,science}'),
  ('prod-065', 'Puzzle 1000 Pieces', 'puzzle-1000-pieces', 'Panoramic city skyline puzzle, 1000 premium pieces with poster.', 'cat-008', 24.99, NULL, 'TOYS-005', 60, 'active', '{toys,puzzle,panorama}'),
  ('prod-066', 'Plush Teddy Bear', 'plush-teddy-bear', 'Extra-large 36-inch plush teddy bear, ultra-soft, hypoallergenic filling.', 'cat-008', 59.99, 49.99, 'TOYS-006', 30, 'active', '{toys,plush,bear}'),
  ('prod-067', 'Card Game for Families', 'card-game-for-families', 'Fast-paced party card game for 3-8 players, ages 8+.', 'cat-008', 19.99, NULL, 'TOYS-007', 85, 'active', '{toys,cardgame,family}'),
  ('prod-068', 'Magnetic Building Tiles', 'magnetic-building-tiles', 'Set of 60 magnetic tiles with wheels and figures, educational STEM toy.', 'cat-008', 69.99, 59.99, 'TOYS-008', 45, 'active', '{toys,magnetic,stem}');

-- Products (Jewelry)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-069', 'Gold Chain Necklace', 'gold-chain-necklace', '14K gold filled cable chain necklace, 18-inch, lobster clasp.', 'cat-009', 189.99, 169.99, 'JEWL-001', 25, 'active', '{jewelry,necklace,gold}'),
  ('prod-070', 'Pearl Stud Earrings', 'pearl-stud-earrings', 'Freshwater pearl studs with 14K gold post, 8mm pearls.', 'cat-009', 79.99, NULL, 'JEWL-002', 35, 'active', '{jewelry,earrings,pearl}'),
  ('prod-071', 'Leather Bracelet', 'leather-bracelet', 'Braided leather bracelet with sterling silver clasp, adjustable.', 'cat-009', 44.99, 39.99, 'JEWL-003', 50, 'active', '{jewelry,bracelet,leather}'),
  ('prod-072', 'Silver Ring Stack', 'silver-ring-stack', 'Set of 3 sterling silver bands, hammered and polished finishes.', 'cat-009', 89.99, 79.99, 'JEWL-004', 40, 'active', '{jewelry,ring,silver}'),
  ('prod-073', 'Gemstone Pendant', 'gemstone-pendant', 'Amethyst gemstone pendant on sterling silver chain, 16-18 inch adjustable.', 'cat-009', 129.99, NULL, 'JEWL-005', 20, 'active', '{jewelry,pendant,gemstone}'),
  ('prod-074', 'Minimalist Watch', 'minimalist-watch', 'Ultra-thin quartz watch with mesh strap, rose gold case, 36mm.', 'cat-009', 199.99, 179.99, 'JEWL-006', 30, 'active', '{jewelry,watch,minimalist}');

-- Products (Office Supplies)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-075', 'Leather Desk Pad', 'leather-desk-pad', 'Full-grain leather desk pad, 90x40cm, stitched edges.', 'cat-010', 79.99, 69.99, 'OFFC-001', 40, 'active', '{office,desk,leather}'),
  ('prod-076', 'Fountain Pen Set', 'fountain-pen-set', 'Gold-trimmed fountain pen with ink converter, includes 3 ink cartridges.', 'cat-010', 89.99, NULL, 'OFFC-002', 55, 'active', '{office,pen,fountain}'),
  ('prod-077', 'Standing Desk Converter', 'standing-desk-converter', 'Adjustable standing desk riser with gas spring, holds 2 monitors.', 'cat-010', 249.99, 219.99, 'OFFC-003', 18, 'active', '{office,standing,desk}'),
  ('prod-078', 'Noise-Canceling Office Headset', 'noise-canceling-office-headset', 'Professional headset with mic, active noise cancellation, USB/3.5mm.', 'cat-010', 159.99, 139.99, 'OFFC-004', 32, 'active', '{office,headset,audio}'),
  ('prod-079', 'Bullet Journal', 'bullet-journal', 'Dotted A5 notebook, 160gsm paper, ribbon bookmark, lay-flat binding.', 'cat-010', 19.99, NULL, 'OFFC-005', 110, 'active', '{office,journal,notebook}'),
  ('prod-080', 'Monitor Light Bar', 'monitor-light-bar', 'Clip-on LED monitor light with auto-dimming and adjustable color temperature.', 'cat-010', 69.99, 59.99, 'OFFC-006', 48, 'active', '{office,lighting,monitor}'),
  ('prod-081', 'Cable Management Kit', 'cable-management-kit', 'Complete cable management solution with clips, sleeves, and ties.', 'cat-010', 24.99, NULL, 'OFFC-007', 95, 'active', '{office,cables,organization}'),
  ('prod-082', 'Desk Organizer', 'desk-organizer', 'Bamboo desk organizer with 8 compartments and phone stand.', 'cat-010', 34.99, 29.99, 'OFFC-008', 65, 'active', '{office,organizer,bamboo}');

-- Products (Pet Supplies)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-083', 'Memory Foam Dog Bed', 'memory-foam-dog-bed', 'Orthopedic memory foam dog bed with removable washable cover, 90x60cm.', 'cat-011', 129.99, 109.99, 'PETS-001', 30, 'active', '{pets,dog,bed}'),
  ('prod-084', 'Cat Tree Tower', 'cat-tree-tower', 'Multi-level cat tree with scratching posts, hammock, and hanging toy.', 'cat-011', 149.99, 129.99, 'PETS-002', 18, 'active', '{pets,cat,tree}'),
  ('prod-085', 'Interactive Pet Feeder', 'interactive-pet-feeder', 'Automatic pet feeder with timer, portion control, and voice recording.', 'cat-011', 89.99, 79.99, 'PETS-003', 25, 'active', '{pets,feeder,automatic}'),
  ('prod-086', 'Dog Leash and Harness Set', 'dog-leash-harness-set', 'Reflective no-pull harness with matching leash, adjustable, sizes S-L.', 'cat-011', 44.99, 39.99, 'PETS-004', 55, 'active', '{pets,dog,harness}'),
  ('prod-087', 'Pet Grooming Kit', 'pet-grooming-kit', 'Professional grooming kit with brushes, nail clippers, and comb.', 'cat-011', 34.99, NULL, 'PETS-005', 40, 'active', '{pets,grooming,kit}'),
  ('prod-088', 'Cat Toy Variety Pack', 'cat-toy-variety-pack', '15-piece cat toy set with wand, mice, balls, and crinkle toys.', 'cat-011', 19.99, 16.99, 'PETS-006', 80, 'active', '{pets,cat,toys}'),
  ('prod-089', 'Pet Travel Carrier', 'pet-travel-carrier', 'Airline-approved soft-sided pet carrier with ventilation and comfort pad.', 'cat-011', 59.99, 49.99, 'PETS-007', 22, 'active', '{pets,travel,carrier}'),
  ('prod-090', 'Aquarium Starter Kit', 'aquarium-starter-kit', '10-gallon aquarium kit with filter, heater, LED light, and accessories.', 'cat-011', 119.99, 99.99, 'PETS-008', 15, 'active', '{pets,aquarium,fish}');

-- Products (Automotive)
INSERT INTO products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
  ('prod-091', 'Dashboard Camera', 'dashboard-camera', '4K dash cam with wide angle, night vision, parking mode, and GPS.', 'cat-012', 149.99, 129.99, 'AUTO-001', 35, 'active', '{auto,dashcam,camera}'),
  ('prod-092', 'Car Phone Mount', 'car-phone-mount', 'Magnetic car phone mount with 360 rotation and one-hand operation.', 'cat-012', 24.99, 19.99, 'AUTO-002', 100, 'active', '{auto,mount,phone}'),
  ('prod-093', 'Portable Jump Starter', 'portable-jump-starter', '2000A peak jump starter with USB power bank, LED light, and case.', 'cat-012', 89.99, 79.99, 'AUTO-003', 28, 'active', '{auto,jump-starter,battery}'),
  ('prod-094', 'Car Seat Organizer', 'car-seat-organizer', 'Backseat organizer with tablet holder, multiple pockets, and insulated cupholders.', 'cat-012', 34.99, NULL, 'AUTO-004', 65, 'active', '{auto,organizer,travel}'),
  ('prod-095', 'Microfiber Cleaning Cloth Set', 'microfiber-cleaning-cloth-set', 'Set of 12 premium microfiber cloths for car detailing, 40x40cm.', 'cat-012', 19.99, 16.99, 'AUTO-005', 120, 'active', '{auto,cleaning,cloth}'),
  ('prod-096', 'Tire Inflator Portable', 'tire-inflator-portable', 'Digital tire inflator with auto shut-off, 150PSI, LED light.', 'cat-012', 59.99, 49.99, 'AUTO-006', 42, 'active', '{auto,tire,inflator}'),
  ('prod-097', 'Car Air Freshener Set', 'car-air-freshener-set', 'Set of 6 natural essential oil car diffusers, assorted scents.', 'cat-012', 16.99, NULL, 'AUTO-007', 80, 'active', '{auto,freshener,essential-oil}'),
  ('prod-098', 'LED Interior Light Kit', 'led-interior-light-kit', 'RGB LED interior car lights with app control, 4 strips, music sync.', 'cat-012', 29.99, 24.99, 'AUTO-008', 55, 'active', '{auto,lighting,led}');

-- Product images for a selection of products
INSERT INTO product_images (id, product_id, image_url, sort_order) VALUES
  ('img-001', 'prod-001', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 1),
  ('img-002', 'prod-002', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop', 1),
  ('img-003', 'prod-003', 'https://images.unsplash.com/photo-1629968417850-3505f78ce8b4?w=600&h=600&fit=crop', 1),
  ('img-004', 'prod-004', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 1),
  ('img-005', 'prod-005', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop', 1),
  ('img-006', 'prod-013', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop', 1),
  ('img-007', 'prod-014', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop', 1),
  ('img-008', 'prod-015', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop', 1),
  ('img-009', 'prod-021', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 1),
  ('img-010', 'prod-023', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop', 1),
  ('img-011', 'prod-031', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop', 1),
  ('img-012', 'prod-039', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop', 1),
  ('img-013', 'prod-047', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 1),
  ('img-014', 'prod-053', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop', 1),
  ('img-015', 'prod-061', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop', 1),
  ('img-016', 'prod-069', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop', 1),
  ('img-017', 'prod-075', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop', 1),
  ('img-018', 'prod-083', 'https://images.unsplash.com/photo-1548600939-7a9696b9b3d1?w=600&h=600&fit=crop', 1),
  ('img-019', 'prod-091', 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=600&fit=crop', 1),
  ('img-020', 'prod-001', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop', 2);
