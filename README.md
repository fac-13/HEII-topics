# HEII-topics

![](https://i.imgur.com/p8uwOPw.png)

```
SELECT t.topic_title AS title,
  t.description,
  u.username AS author,
  COUNT(CASE WHEN v.vote_value = 'yes' THEN 1 ELSE null END) AS yes_votes,
  COUNT(CASE WHEN v.vote_value = 'no' THEN 1 ELSE null END) AS no_votes
FROM voting AS v
RIGHT JOIN topic AS t
ON t.id = v.topic_id
INNER JOIN users AS u
ON t.user_id = u.id
GROUP BY t.id, u.username
ORDER BY t.id;
```
