# Hunter Hub REST API 



## Installing
```
npm install
```

## Run local dev server

```
npm run dev
```

## web endpoint

```
https://hunter-app-api.herokuapp.com/
```

## Routes 
    /user 
    /class
    /usercourse
    /post
    /comment
    /friendship
    /messages

### Built With

* [Node.js](https://nodejs.org/en/docs/) - Nodejs
* [Express.js](https://nodejs.org/en/docs/) - web framework for Nodejs
* [axios](https://www.npmjs.com/package/axios) -  Axios for fetching calls
* [sequelize](http://docs.sequelizejs.com/) -  Promise-based Node.js ORM for Postgres
* [Socket.io](https://socket.io/) -  real-time bidirectional event-based communication


## Author

* **Salvador Muñoz Castillo** 

## Errors
Desktop session, Chrome and Firefox work fine with express-session. The set-cookie header does not work in safari, or mobile browsers. Cookie headers seems to work fine in Chrome and Firefox desktop browser but are not being sent out in mobile browsers or safari.

Possible ways to fix is to use JWT instead of session cookies. Maybe for next project. 


There is an open issue in github/express/session regarding the problem this app currently has. 
* [There is an open issue in github/express/session regarding the problem this app currently has](https://github.com/expressjs/session/issues/600) 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
