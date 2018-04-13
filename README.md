# HEII-topics

Welcome to HEII's topic board! Here you can post a topic (with a name and description), and vote on the topic (yes or no), but only if you are registered and log in with our site.

## User Stories
* As a user you can view the current posted topics (the username, name and description) and the number of votes for yes and the number of votes for no.
* You can register with our site, if your username has not already been taken and if the password meets the requirements (at least one number, upper case letter and lower case letter.
* You can then log in to the site. 
* You can view any error message if anything has gone wrong in any of the processes.
* As a logged in user, you can post a new topic and vote (only once) on a topic that has been posted.

## How to run the project locally
1. `git clone https://github.com/fac-13/HEII-topics.git`
2. Run `npm i` to install the required modules.
3. Set up the local database by:
    1. Connect to postgres, either by `psql` (`pgcli`) in the terminal on MAC, and `sudo -u postgres psql` on ubuntu.
    2. Create the database by typing `CREATE DATABASE [the name of the database];`. It's best not to use a hyphen (`-`) or uppercase letters in your database name.
    3. Create a superuser with a password - type in `CREATE USER [the new username] WITH SUPERUSER PASSWORD '[the password of the database]';`
    4. Change ownership of the database to the new user by typing `ALTER DATABASE [name of the database] OWNER TO [the new username];`
4. Add a .env file (with no name) in the root folder and add the database's url in this format: 
  ```js
  DB_URL = [the heroku database]
  TEST_DB_URL = postgres://[username]:[password]@localhost:5432/[databasename]

  SECRET = TAKA
  ```
5. Exit postgres and the run `npm run build` to build the database. (or Build the database by connecting to postgres and typing `\i` \+ correct path + `/ToVaHayGi/src/database/db_build.sql`)
6. You should now be able to run tests (using `npm test`) and also run `npm start` (or `npm run dev`) and access the site at localhost:4000. 
  * NB: There is currently no logout option - delete the jwt within the Cookie section of your local browser to log out).
 
## FAC Project Requirements met

### Key Project Database Requirements (week 1)

+ [x] Simple web app with a node server and a database
+ [x] DB includes schema documentation
+ [ ] DB is hosted on Heroku. 
+ [x] DB built with PostgreSQL 
+ [x] DB Security concerns appropriately considered (ie. script injections)
+ [ ] Content dynamic, but DOM manipulation kept to a minimum
+ [ ] Mobile-first design
+ [ ] Clear user journey 
+ [x] Clear software architecture planned out. 

### Key Project Authentication Requirements (week 2)
+ [x] Login form with 2 fields - username and password
+ [x] Client-side _and_ server-side validation on login form, including error handling that provides feedback to users
+ [x] Users only have to log in once (i.e. implement a cookie-based session on login)
+ [ ] Username is visible on each page of the site after logging in
+ [x] Any user-submitted content should be labelled with the authors username
+ [x] Website content should be stored in a database

### Stretch goals
+ [ ] CSS
+ [ ] Log Out and Account Deletion option
+ [ ] Have an "admin" level user (role) who can edit and delete all content (permissions)
+ [ ] Add comment functionality to content
+ [ ] Add like functionality to content

## Our journey 🛫

* We used issues to track what still needed to done:
  [Check out our Project board](https://github.com/fac-13/HEII-topics/projects/1)

* The schema for the database
![](https://i.imgur.com/YKUeAqs.png)

## What we found difficult

* Obtaining all of the data we wanted from our database (so we did not need to query the database multiple times).
  * We did manage to solve this issues. This is the `SELECT` SQL command that obtains the necessary information from the database (including the topic id, the topic title, the topic description, the username of the user who posted the topic, the associatedd topic number of votes for yes, the associated topic number of votes for no, and the number of comments.
     ```sql
    SELECT
      t.id,
      t.topic_title AS title,
      t.description,
      u.username AS author,
      COUNT(CASE WHEN v.value = 'yes' THEN 1 ELSE null END) AS yes_votes,
      COUNT(CASE WHEN v.value = 'no' THEN 1 ELSE null END) AS no_votes,
      COUNT(c.*) AS comments
    FROM topics t
    LEFT JOIN users u
    ON t.user_id = u.id
    LEFT JOIN voting v
    ON t.id = v.topic_id
    LEFT JOIN comments c
    ON t.id = c.topic_id
    GROUP BY t.id, u.username
    ORDER BY t.id;
    ```
