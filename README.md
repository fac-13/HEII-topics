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
