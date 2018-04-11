BEGIN;

DROP TABLE IF EXISTS users, topics, voting, comments;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'user'
);

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    topic_title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE voting (
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    value BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, topic_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    text VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

INSERT INTO users (username, password, role)
VALUES
    ('Helen', 'password1', 'admin'),
    ('Ivi', 'password2', 'admin'),
    ('Isaac', 'password3', 'admin'),
    ('Eade', 'password4', 'admin');

INSERT INTO topics (topic_title, description, user_id)
VALUES ('Climbing', 'Shall we do this friday?', 1);

INSERT INTO voting (user_id, topic_id, value)
VALUES (2, 1, true);

INSERT INTO comments (user_id, topic_id, text)
VALUES (2, 1, 'This is great!');

COMMIT;
