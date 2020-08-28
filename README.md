# school-bot
FB Messenger created with Wit.ai

## Webhook URL
https://getschoolbot.herokuapp.com/webhook/

## Test Webhook and FB connection

```
 curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=EAAL7kdFDitMBAPMxZAvkB9r3GIzKTeJJ9M0Qvmu9ocytR50mQrYBiknZBpSbGvqUrEbSIHOfNvzC0NhflGDLcfDazERZCZBIAMI2IDqqO6xuDfZAaeRxD7AVGZCDnGXpJFdtY8eK1jO6RTNwZAHrZAVvWrspqj9T91R0r6cSf4ygXwZDZD" -F 'subscribed_fields="messages"'
```

### Test Wit.ai App statusCode

```
curl \
 -H 'Authorization: Bearer QVA5WW5Y7H2RDQHLURRNUQXDUMDMRAY2' \
 'https://api.wit.ai/message?v=20200828&q=I%20studied%20for%202%20hours%20last%20night'
 ```
