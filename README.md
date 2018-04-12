# HEII-topics

![](https://i.imgur.com/YKUeAqs.png)


```
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

### Requirements
+ [ ] Login form with 2 fields - username and password
+ [ ] Client-side _and_ server-side validation on login form, including error handling that provides feedback to users
+ [ ] Users only have to log in once (i.e. implement a cookie-based session on login)
+ [ ] Username is visible on each page of the site after logging in
+ [ ] Any user-submitted content should be labelled with the authors username
+ [ ] There should be protected routes and unprotected routes that depend on the user having a cookie or not (or what level of access they have).
+ [ ] Website content should be stored in a database

Note:
+ Client-side and server-side validation on content submission is optional
+ Whether you also allow users to delete the content that they have submitted will depend on the project you decide to create.

#### Possible stretch goals
Roles and permissions:
+ [ ] Have an "admin" level user (role) who can edit and delete all content :scream: (permissions)

More features:
+ [ ] Add comment functionality to content
+ [ ] Add like functionality to content
