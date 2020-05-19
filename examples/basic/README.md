# Basic

## Install and Run

Download this example or clone [bottender-proposal-conversation](https://github.com/Yoctol/bottender-proposal-conversation).

```sh
curl https://codeload.github.com/Yoctol/bottender-proposal-conversation/tar.gz/master | tar -xz --strip=2 bottender-proposal-conversation-master/examples/basic
cd basic
npm install
npm run dev -- --console
```

## Conversation

yes:

```
You > Hi
Bot > Do you like cheese? (yes/no)
You > yes
Bot > You said yes! How wonderful.
```

no:

```
You > Hi
Bot > Do you like cheese? (yes/no)
You > no
Bot > You said no, that is too bad.
```

unknown:

```
You > Hi
Bot > Do you like cheese? (yes/no)
You > ????
Bot > Sorry I did not understand.
```
