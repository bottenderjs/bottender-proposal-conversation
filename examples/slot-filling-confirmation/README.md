# Slot Filling Confirmation

## Install and Run

Download this example or clone [bottender-proposal-conversation](https://github.com/Yoctol/bottender-proposal-conversation).

```sh
curl https://codeload.github.com/Yoctol/bottender-proposal-conversation/tar.gz/master | tar -xz --strip=2 bottender-proposal-conversation-master/examples/slot-filling-confirmation
cd slot-filling-confirmation
npm install
npm run dev -- --console
```

## Conversation

```
You > Hi
Bot > Please type your name:
You > Leo
Bot > Please type your phone number (10 digits):
You > 0912345678
Bot > Leo, your phone number is 0912345678, right? If not, which part you want to refill? (yes|name|phone|both)
You > name
Bot > Please retype your name:
You > John
Bot > John, your phone number is 0912345678, right? If not, which part you want to refill? (yes|name|phone|both)
You > phone
Bot > Please retype your phone again (10 digits):
You > 0987654321
Bot > John, your phone number is 0987654321, right? If not, which part you want to refill? (yes|name|phone|both)
You > both
Bot > Please type your name:
You > abcdefghijklmnopqrstuvwxyz0123456789
Bot > Name can't be more than 30 characters. Set your name to abcdefghijklmnopqrstuvwxyz0...
Bot > Please type your phone number (10 digits):
You > 000
Bot > Your input 000 is invalid. Please retype your phone again (10 digits):
You > 0987654321
Bot > abcdefghijklmnopqrstuvwxyz0..., your phone number is 0987654321, right? If not, which part you want to refill? (yes|name|phone|both)
You > yes
Bot > Thank you for your help, your personal data was stored correctly.
```
