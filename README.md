# school-bot
FB Messenger created with Wit.ai

## Webhook URL
https://getschoolbot.herokuapp.com/webhook/

## Test Webhook and FB connection status

```
 curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=${FB_PAGE_TOKEN}" -F 'subscribed_fields="messages"'
```

### Test call to Wit.ai

```
curl \
 -H 'Authorization: Bearer ${WIT_TOKEN}' \
 'https://api.wit.ai/message?v=20200828&q=I%20studied%20for%202%20hours%20last%20night'
 ```
