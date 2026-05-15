-- ============================================================
-- ShareBear Dummy Data Seed
-- Password for all users: Password123!
-- ============================================================

-- ─── Users ────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `User` (username, email, passwordHash, accountType, privacySettings, verificationStatus, isActive, isDeleted, createdAt, updatedAt) VALUES
('alex_rivera',    'alex.rivera@mail.com',    '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PUBLIC',  1, 1, 0, NOW(), NOW()),
('bella_santos',   'bella.santos@mail.com',   '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'CREATOR',  'PUBLIC',  1, 1, 0, NOW(), NOW()),
('carlos_wu',      'carlos.wu@mail.com',      '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PUBLIC',  0, 1, 0, NOW(), NOW()),
('diana_lee',      'diana.lee@mail.com',      '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'BUSINESS', 'PUBLIC',  1, 1, 0, NOW(), NOW()),
('evan_cross',     'evan.cross@mail.com',     '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PRIVATE', 0, 1, 0, NOW(), NOW()),
('fiona_garcia',   'fiona.garcia@mail.com',   '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'CREATOR',  'PUBLIC',  1, 1, 0, NOW(), NOW()),
('george_kim',     'george.kim@mail.com',     '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PUBLIC',  0, 1, 0, NOW(), NOW()),
('hannah_park',    'hannah.park@mail.com',    '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'FRIENDS', 0, 1, 0, NOW(), NOW()),
('ivan_morales',   'ivan.morales@mail.com',   '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PUBLIC',  0, 1, 0, NOW(), NOW()),
('julia_chen',     'julia.chen@mail.com',     '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'CREATOR',  'PUBLIC',  1, 1, 0, NOW(), NOW()),
('kevin_brown',    'kevin.brown@mail.com',    '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PUBLIC',  0, 1, 0, NOW(), NOW()),
('luna_torres',    'luna.torres@mail.com',    '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'BUSINESS', 'PUBLIC',  1, 1, 0, NOW(), NOW()),
('marco_nguyen',   'marco.nguyen@mail.com',   '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PUBLIC',  0, 1, 0, NOW(), NOW()),
('nina_patel',     'nina.patel@mail.com',     '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'CREATOR',  'PUBLIC',  1, 1, 0, NOW(), NOW()),
('oscar_white',    'oscar.white@mail.com',    '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PRIVATE', 0, 1, 0, NOW(), NOW()),
('priya_singh',    'priya.singh@mail.com',    '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PUBLIC',  0, 1, 0, NOW(), NOW()),
('quinn_adams',    'quinn.adams@mail.com',    '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'CREATOR',  'PUBLIC',  1, 1, 0, NOW(), NOW()),
('rosa_diaz',      'rosa.diaz@mail.com',      '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'PUBLIC',  0, 1, 0, NOW(), NOW()),
('sam_johnson',    'sam.johnson@mail.com',    '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'PERSONAL', 'FRIENDS', 0, 1, 0, NOW(), NOW()),
('tina_yamamoto',  'tina.yamamoto@mail.com',  '$2b$10$fJZKP8XFdTtcgqG.jDa9TeU3gWhOO07cAxwHSt3K4g3S1KkcKQ4/e', 'CREATOR',  'PUBLIC',  1, 1, 0, NOW(), NOW());

-- ─── User Info ────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `UserInfo` (userId, firstName, lastName, displayName, bio, gender, location) VALUES
(1,  'Alex',   'Rivera',   'Alex Rivera',    'Adventure seeker | Coffee lover',                    'MALE',   'New York, USA'),
(2,  'Bella',  'Santos',   'Bella Santos',   'Lifestyle creator | Sharing daily vibes',             'FEMALE', 'Los Angeles, USA'),
(3,  'Carlos', 'Wu',       'Carlos Wu',      'Tech enthusiast | Building things',                   'MALE',   'San Francisco, USA'),
(4,  'Diana',  'Lee',      'Diana Lee',      'Founder @ DL Studio | Design & Branding',             'FEMALE', 'Seoul, Korea'),
(5,  'Evan',   'Cross',    'Evan Cross',     'Just living life',                                    'MALE',   'Austin, Texas'),
(6,  'Fiona',  'Garcia',   'Fiona Garcia',   'Fitness & wellness | Spreading good vibes',            'FEMALE', 'Miami, Florida'),
(7,  'George', 'Kim',      'George Kim',     'Photographer | Capturing moments',                    'MALE',   'Chicago, USA'),
(8,  'Hannah', 'Park',     'Hannah Park',    'Book worm | Tea enthusiast',                          'FEMALE', 'Boston, USA'),
(9,  'Ivan',   'Morales',  'Ivan Morales',   'Soccer fan | Weekend chef',                           'MALE',   'Mexico City, Mexico'),
(10, 'Julia',  'Chen',     'Julia Chen',     'Art & illustration | Commissions open!',               'FEMALE', 'Toronto, Canada'),
(11, 'Kevin',  'Brown',    'Kevin Brown',    'Music producer | Beats & vibes',                      'MALE',   'Atlanta, USA'),
(12, 'Luna',   'Torres',   'Luna Torres',    'CEO @ Luna Eats | Food & restaurant reviews',          'FEMALE', 'Barcelona, Spain'),
(13, 'Marco',  'Nguyen',   'Marco Nguyen',   'Backpacker | Currently: Southeast Asia',               'MALE',   'Ho Chi Minh, Vietnam'),
(14, 'Nina',   'Patel',    'Nina Patel',     'Fashion & beauty creator | PR welcome',                'FEMALE', 'London, UK'),
(15, 'Oscar',  'White',    'Oscar White',    'Introvert with good taste',                           'MALE',   'Seattle, USA'),
(16, 'Priya',  'Singh',    'Priya Singh',    'Data scientist | Cat mom',                            'FEMALE', 'Bangalore, India'),
(17, 'Quinn',  'Adams',    'Quinn Adams',    'Non-binary creator | Advocacy & art',                  'OTHER',  'Portland, Oregon'),
(18, 'Rosa',   'Diaz',     'Rosa Diaz',      'Nurse | Salsa dancer',                                'FEMALE', 'Buenos Aires, Argentina'),
(19, 'Sam',    'Johnson',  'Sam Johnson',    'Dad jokes champion | BBQ enthusiast',                  'MALE',   'Nashville, Tennessee'),
(20, 'Tina',   'Yamamoto', 'Tina Yamamoto', 'Travel & food vlogger | Tokyo based',                  'FEMALE', 'Tokyo, Japan');

-- ─── Cleanup old bad-ID seed posts (if any) ────────────────────────────────
DELETE FROM `Comment` WHERE postId LIKE 'post0%';
DELETE FROM `Like`    WHERE postId LIKE 'post0%';
DELETE FROM `Post`    WHERE id     LIKE 'post0%';

-- ─── Posts (TEXT) ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO `Post` (id, userId, contentType, caption, privacyLevel, allowsComments, allowsShares, createdAt, updatedAt) VALUES
('cmbseed01aaaaaaaaaaaaaaaa', 1,  'TEXT', 'Just finished a 10-mile hike up the Catskills. My legs are destroyed but the view was absolutely worth it. #hiking #adventure',    'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed02bbbbbbbbbbbbbbbb', 2,  'TEXT', 'Morning routine vlog is up! Sharing my 5am skincare ritual and why I swear by SPF every single day. Let me know your routine below!',      'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed03cccccccccccccccc', 3,  'TEXT', 'Hot take: TypeScript is not optional anymore. If you''re still writing raw JS for production apps in 2026 I need you to explain yourself.',    'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed04dddddddddddddddd', 6,  'TEXT', 'Rest day does not mean lazy day. Stretching, hydration, and meal prep. Your body grows when it rests. #fitness #wellness',                   'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed05eeeeeeeeeeeeeeee', 10, 'TEXT', 'Commission piece finally done! 48 hours of work and I am honestly proud of this one. The client wanted a dreamlike forest scene.',            'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed06ffffffffffffffff', 14, 'TEXT', 'Thrifted this entire outfit for under $20. Sustainable fashion does not have to be expensive, it just takes patience. #thrift',               'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed07gggggggggggggggg', 12, 'TEXT', 'Reviewed 3 new ramen spots in Barcelona this week. Ranking: 1) Noodle Haus 2) Umami Bowl 3) Ramen Bros. Full review on my blog.',             'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed08hhhhhhhhhhhhhhhh', 13, 'TEXT', 'Motorbike from Da Nang to Hoi An. 30km, no GPS, one wrong turn - ended up at a secret beach. Life is good.',                                  'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed09iiiiiiiiiiiiiiii', 20, 'TEXT', 'Cherry blossom season in Tokyo is unreal. Ueno Park was absolutely packed but I managed to grab this shot at 6am before the crowds.',         'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed10jjjjjjjjjjjjjjjj', 17, 'TEXT', 'Reminder that allyship is a verb, not a label. Showing up consistently is what matters. Love to this community always.',                      'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed11kkkkkkkkkkkkkkkk', 7,  'TEXT', 'Golden hour at Navy Pier. Shot on my old Fuji X-T4 - still cannot believe this camera. Film simulation mode is just different.',               'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed12llllllllllllllll', 11, 'TEXT', 'New beat pack just dropped on my page. Lo-fi + trap hybrid. Free for non-commercial use. Tag me if you use it. #producer #beats',             'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed13mmmmmmmmmmmmmmmm', 16, 'TEXT', 'Spent the weekend building a movie recommendation model using collaborative filtering. Accuracy is at 87% - not bad for a side project!',      'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed14nnnnnnnnnnnnnnnn', 9,  'TEXT', 'Made pozole rojo from scratch for the first time and I''m never buying canned again. Recipe in the comments.',                                 'PUBLIC', 1, 1, NOW(), NOW()),
('cmbseed15oooooooooooooooo', 18, 'TEXT', '12 hour shift done. Feet are killing me. But a patient told me today I was their favorite nurse and honestly that is why I do this.',           'PUBLIC', 1, 1, NOW(), NOW());

-- ─── Follows ─────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `Follow` (followerId, followingId, status, createdAt) VALUES
(1,  2,  'accepted', NOW()),
(1,  6,  'accepted', NOW()),
(1,  10, 'accepted', NOW()),
(2,  1,  'accepted', NOW()),
(2,  14, 'accepted', NOW()),
(3,  1,  'accepted', NOW()),
(3,  16, 'accepted', NOW()),
(4,  2,  'accepted', NOW()),
(4,  14, 'accepted', NOW()),
(5,  1,  'accepted', NOW()),
(6,  2,  'accepted', NOW()),
(7,  11, 'accepted', NOW()),
(8,  10, 'accepted', NOW()),
(9,  12, 'accepted', NOW()),
(10, 2,  'accepted', NOW()),
(11, 7,  'accepted', NOW()),
(12, 9,  'accepted', NOW()),
(13, 20, 'accepted', NOW()),
(14, 2,  'accepted', NOW()),
(15, 11, 'accepted', NOW()),
(16, 3,  'accepted', NOW()),
(17, 10, 'accepted', NOW()),
(18, 6,  'accepted', NOW()),
(19, 9,  'accepted', NOW()),
(20, 13, 'accepted', NOW());

-- ─── Likes ───────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `Like` (userId, postId, createdAt) VALUES
(2,  'cmbseed01aaaaaaaaaaaaaaaa', NOW()),
(3,  'cmbseed01aaaaaaaaaaaaaaaa', NOW()),
(6,  'cmbseed01aaaaaaaaaaaaaaaa', NOW()),
(1,  'cmbseed02bbbbbbbbbbbbbbbb', NOW()),
(4,  'cmbseed02bbbbbbbbbbbbbbbb', NOW()),
(14, 'cmbseed02bbbbbbbbbbbbbbbb', NOW()),
(1,  'cmbseed03cccccccccccccccc', NOW()),
(16, 'cmbseed03cccccccccccccccc', NOW()),
(3,  'cmbseed05eeeeeeeeeeeeeeee', NOW()),
(8,  'cmbseed05eeeeeeeeeeeeeeee', NOW()),
(17, 'cmbseed05eeeeeeeeeeeeeeee', NOW()),
(1,  'cmbseed09iiiiiiiiiiiiiiii', NOW()),
(13, 'cmbseed09iiiiiiiiiiiiiiii', NOW()),
(20, 'cmbseed08hhhhhhhhhhhhhhhh', NOW()),
(5,  'cmbseed10jjjjjjjjjjjjjjjj', NOW()),
(18, 'cmbseed10jjjjjjjjjjjjjjjj', NOW()),
(7,  'cmbseed11kkkkkkkkkkkkkkkk', NOW()),
(15, 'cmbseed11kkkkkkkkkkkkkkkk', NOW()),
(11, 'cmbseed12llllllllllllllll', NOW()),
(19, 'cmbseed14nnnnnnnnnnnnnnnn', NOW());

-- ─── Comments ────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `Comment` (postId, userId, content, createdAt, updatedAt) VALUES
('cmbseed01aaaaaaaaaaaaaaaa', 6,  'This is my dream hike!! Which trail did you take?',                                    NOW(), NOW()),
('cmbseed01aaaaaaaaaaaaaaaa', 2,  'Your dedication is everything, I could never',                                          NOW(), NOW()),
('cmbseed02bbbbbbbbbbbbbbbb', 1,  'The SPF recommendation was so helpful, I ordered the one you mentioned!',              NOW(), NOW()),
('cmbseed02bbbbbbbbbbbbbbbb', 14, 'Your morning content is always so calming to watch',                                    NOW(), NOW()),
('cmbseed03cccccccccccccccc', 16, 'Fully agree. Migrated our whole codebase to TS last year and never looked back.',      NOW(), NOW()),
('cmbseed03cccccccccccccccc', 9,  'Okay but the learning curve almost killed me, worth it though',                        NOW(), NOW()),
('cmbseed05eeeeeeeeeeeeeeee', 17, 'This is absolutely stunning. The lighting is so soft.',                                NOW(), NOW()),
('cmbseed05eeeeeeeeeeeeeeee', 4,  'Do you take commissions internationally? This is incredible work.',                   NOW(), NOW()),
('cmbseed08hhhhhhhhhhhhhhhh', 20, 'A secret beach sounds like a dream, I need more Vietnam content please!',              NOW(), NOW()),
('cmbseed09iiiiiiiiiiiiiiii', 13, 'The 6am hustle pays off. Stunning shot Tina.',                                         NOW(), NOW()),
('cmbseed11kkkkkkkkkkkkkkkk', 15, 'Film sim mode really does hit different. Great eye George.',                           NOW(), NOW()),
('cmbseed12llllllllllllllll', 5,  'Used the lo-fi kit on my latest track, it is fire, dropping it next week',             NOW(), NOW()),
('cmbseed13mmmmmmmmmmmmmmmm', 3,  'How did you handle the cold start problem? That''s usually where CF models struggle.', NOW(), NOW()),
('cmbseed14nnnnnnnnnnnnnnnn', 18, 'Please share the recipe!! My abuela used to make this.',                               NOW(), NOW()),
('cmbseed15oooooooooooooooo', 6,  'Thank you for everything you do. Healthcare workers are real superheroes.',             NOW(), NOW());

-- ─── Hashtags ────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `Hashtag` (name, usageCount, isActive, createdAt) VALUES
('hiking',      1, 1, NOW()),
('adventure',   1, 1, NOW()),
('fitness',     1, 1, NOW()),
('wellness',    1, 1, NOW()),
('typescript',  1, 1, NOW()),
('photography', 1, 1, NOW()),
('travel',      1, 1, NOW()),
('food',        1, 1, NOW()),
('art',         1, 1, NOW()),
('fashion',     1, 1, NOW());
