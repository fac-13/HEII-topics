BEGIN;

-- USER table
DROP TABLE IF EXISTS user CASCADE;

CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO user
VALUES (DEFAULT, 'Helen', 'password')
VALUES (DEFAULT, 'Ivi', 'cat')
VALUES (DEFAULT, 'Isaac', 'blue')
VALUES (DEFAULT, 'Eade', 'colors')

-- TOPIC table

-- deletes the database and CASCADE deletes associated tables (references to it in other tables are deleted)
DROP TABLE IF EXISTS topic CASCADE;

CREATE TABLE topic (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

INSERT INTO topic (name, description, user_id)
VALUES ('Climbing', 'Shall we do this friday?', 1)

-- VOTING table
DROP TABLE IF EXISTS voting CASCADE;

CREATE TABLE voting (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    vote_value BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (topic_id) REFERENCES topic(id)
);

INSERT INTO voting
VALUES (DEFAULT, 2, 1, true)

COMMIT;