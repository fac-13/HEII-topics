BEGIN;

DROP TABLE IF EXISTS users, topic, voting;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE topic (
    id SERIAL PRIMARY KEY,
    topic_title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE voting (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    vote_value BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (topic_id) REFERENCES topic(id)
);

INSERT INTO users (username, password) VALUES
('Helen', 'password'),
('Ivi', 'cat'),
('Isaac', 'blue'),
('Eade', 'colors');

INSERT INTO topic (topic_title, description, user_id)
VALUES ('Climbing', 'Shall we do this friday?', 1);

INSERT INTO voting (user_id, topic_id, vote_value)
VALUES (2, 1, true);

COMMIT;
