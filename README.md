# Lottery Exercise

## Getting Started
This is a simple Node JS application. To get started simply clone the repo.
Next navigate to the directory.
Then run `npm install` then `node index.js` or `nodemon index.js` if you have nodemon installed.


## Using the app.

The app has two API's to interface with.
The first api is `/initiateLottery`
Here you simply set the time until the registration time and time until draw, of which the latter should be greater. The time is measured in minutes.

example api request using body:

```json {
  "drawTime":"2",
  "registerCloseTime": "1"
}
```

The second api is how to register users. This api assumes registrants are members of the company and accepts companyIDS (integer).
To interface with it simply target the `/register` route
example api request using the body:
```json
{
    "companyID":15
}
```

To use the application you must use the `/initiateLottery `route first and set a time otherwise you will get a reply stating
registration is closed.

*/