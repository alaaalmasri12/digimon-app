DROP TABLE IF EXISTS pokmon;

CREATE TABLE pokmon
(
    id SERIAL PRIMARY KEY,
    name varchar(225),
    image varchar(225),
    level varchar(225)
);