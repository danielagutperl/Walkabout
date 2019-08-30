# General Assembly SEI Project 3: Walkabout


## Introduction
A travel site modelled after tripadvisor.com. Using a MERN stack and an external API, users can search for places of interest in places all over the world and save them to their own trips they can create.

## Using the app
Users can search Places (for example cities, countries, areas, and other types of places) or Points of Interest (a restaurant, museeum or other POI - for instance the Science Museeum) at a place to find information. They can also search other users trips. Users can register or authenticate to create trips and add Places and POIs to their profile.

Take a look here: [Walkabout](https://walkabout-project.herokuapp.com)

## Requirements

Build a MERN stack application by collaborating in a group. The app should have:

* A number of models
* You should be able to perform full CRUD actions
* Include a seeds file

## Team Members
Shane - https://github.com/shaneshibu/  
Cliff - https://github.com/Cliff-Conolly/  
Daniela - https://github.com/danielagutperl/

## Timeframe
1 week (June 2019)

## Technologies Used
- MongoDB
- Express
- React
- Node.js
- Triposo API

## Overview

![Walkabout Home Page](src/assets/screenshots/homepage.png)

From the home screen users can search for cities or places of interest around the world then go to that places webpage to see more about them. When users type in the search bar on the homepage, a GET request is made to the Triposo API using the contents of the search bar as a query parameter. The response to the search was displayed as a list beneath the search bar. 

![Walkabout Search Places](src/assets/screenshots/search.gif)

Users can save these places to their own trips or can even see other users planned trips.

![Walkabout User Trips](src/assets/screenshots/browseTrips.gif)

Users can even browse other members and see what trips they have planned.

![Walkabout Users](src/assets/screenshots/browseUsers.gif)

## Wins
The database controllers proved to be challenging in that we needed to interact with an external API as well as data on our database.

```javascript
function showPlace(req, res, next) {
  console.log('show place')
  Place
    .findOne({ triposoId: req.params.placeId })
    .then(place => {
      if (!place) throw new Error('Not Found')

      getTriposoPOIData(place.triposoId)
        .then(placeData => {
          place = { ...place._doc, ...placeData.data.results[0] }
          return res.status(200).json(place)
        })
    })
    .catch(next)
}

function getTriposoPOIData(triposoId) {
  return axios
    .get('https://www.triposo.com/api/20181213/poi.json?', {
      params: {
        'id': triposoId,
        'fields': 'name,attribution,coordinates,snippet,images,location_id',
        'account': account,
        'token': token
      }
    })
}
```
By spreading the data object return from the API request with data from our own database we were able to return a single JSON object with all the data to the front end. By having all requests to the Triposo API made from the back end, the front end would only have to make a single request to the back end rather than two separate requests to Triposo's and our own API.

## Challenges

Due to the nature of the API we were using, searching for cities and searching for places of interest were two different http GET requests. This made searching from a user experience perspective cumbersome. We eventually settled for adding a radio button on the main search bar, so users would have to choose which they wanted to search from.

```javascript
getDestinations() {

  const { searchType, inputValue } = this.state

  if (searchType === 'Place' && inputValue.Place) {

    // Capitalise first letter of location to use in API search query
    const place = inputValue.Place.charAt(0).toUpperCase() + inputValue.Place.slice(1)

    //make search query for a 'Place'
    axios.get(`${triposoAPI}location.json?annotate=trigram:${place}&trigram=>=0.3&count=10&fields=id,name,score,snippet&order_by=-score&account=${account}&token=${token}`)
      .then( res => this.setState({ destinations: res.data.results }))
      .catch(err => console.log(err))

  } else if (searchType === 'POI' && inputValue.POI) {

    //make search query for a 'Point of Interest'
    axios.get(`${triposoAPI}poi.json?annotate=trigram:${inputValue.POI}&trigram=%3E=0.3&count=10&fields=id,name,score,snippet,location_id,tag_labels&order_by=-score&account=${account}&token=${token}`)
      .then( res => this.setState({ destinations: res.data.results }))
      .catch(err => console.log(err))
  }
}
```

## Future Features
- Additional Styling. While the site is mostly functional, we didn't have enough time to style the front end so we could spend some additional time to make it look nicer.
- Currently users have to use a radio button on the front page to choose between searching cities and places of interest. Ideally we could make it so the search bar searches both without the need for a radio button.

## **API Documentation**  

### Overview  

This project, being worked on by three people with a deadline of 1 week necessitated that the front and back end were developed concurrently. The following documentation was written and updated during the project so the members working on the front end would be kept up to date when changes were made to the back end.

###  **/api/register**  
#### POST - Register
##### Example Request  
POST http://localhost:3999/api/register  

##### Parameters  
**username** - Type: String - Required  
**email** - Type: String - Required  
**password** - Type: String - Required  
**passwordConfirmation** - Type: String - Required  
**locationHome** - Type: String - Required  

##### Example Payload  
```javascript  
{
  "username": "Daniela"
  "email": "daniela@email.com"
  "password": "pass"
  "passwordConfirmation": "pass"
  "locationHome": "London"
}
```  
##### Example Response  
```javascript  
201 Created  
{
  "message": "Welcome aboard Daniela...now your journey begins."
}
```
###  **/api/login**  
#### POST - Login  
##### Example Request  
POST http://localhost:3999/api/login  

##### Parameters  
**email** - Type: String - Required  
**password** - Type: String - Required  

##### Example Payload  
```javascript  
{
  "email": "daniela@email.com",
  "password": "pass"
}
```  
##### Example Response  
```javascript  
200 OK
{
  "message": "Hey Daniela, welcome back.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDI0OGIwYjIzODVjYTQxMTYxYzFiZTciLCJpYXQiOjE1NjI2NzYwMjcsImV4cCI6MTU2MzM2NzIyN30.LxOm9sGkBHiHdWTIW9PuVy-jwjvoBq_htOPS-oixMIM"
}
```
### **/api/users**  
#### GET - Users Index  
##### Example Request  
GET http://localhost:3999/api/users/

##### Example Response  
```javascript  
200 OK
[
  {
    "_id": "5d24c42c4ec4f8557d0eb415",
    "username": "dani",
    "email": "dani@email.com",
    "locationHome": "London",
    "__v": 0
  },
  {
    "_id": "5d24c42c4ec4f8557d0eb416",
    "username": "seba",
    "email": "seba@email.com",
    "locationHome": "Paris",
    "__v": 0
  },
  {
    "_id": "5d24c42c4ec4f8557d0eb418",
    "username": "cliff",
    "email": "cliff@email.com",
    "locationHome": "Berlin",
    "__v": 0
  },
  {
    "_id": "5d24c42c4ec4f8557d0eb417",
    "username": "shane",
    "email": "shane@email.com",
    "locationHome": "Brussels",
    "__v": 0
  }
]
```

###  **/api/users/:id**
#### GET - Show User
##### Example Request  
GET http://localhost:3999/api/users/5d247d6b4202603cf1d86f2d

##### Example Response  
```javascript  
{
    "_id": "5d247d6b4202603cf1d86f2d",
    "username": "Daniela",
    "email": "daniela@email.com",
    "locationHome": "London",
    "__v": 0
  }
```
#### PUT - Edit User
##### Example Request  
PUT http://localhost:3999/api/users/5d247d6b4202603cf1d86f2d

##### Parameters  
**username** - Type: String - Optional  
**email** - Type: String - Optional  
**password** - Type: String - Optional  
**passwordConfirmation** - Type: String - Optional (Required if password is changed)   
**locationHome** - Type: String - Optional  

##### Example Payload  
```javascript  
{
  "email": "daniela.2@email.com"
}
```  
##### Example Response  
```javascript  
202 Accepted  
{
    "_id": "5d247d6b4202603cf1d86f2d",
    "username": "Daniela",
    "email": "daniela.2@email.com",
    "locationHome": "London",
    "__v": 0
  }
```
#### DELETE - Delete User
##### Example Request  
DELETE http://localhost:3999/api/users/5d247d6b4202603cf1d86f2d

##### Example Response  
```javascript  
204 No Content
```

### **/api/trips**  
#### GET - Trips Index
##### Example Request  
GET http://localhost:3999/api/trips/

##### Example Response  
```javascript  
200 OK
[
  {
    "places": [
      "5d24c42d4ec4f8557d0eb419",
      "5d24c42d4ec4f8557d0eb41d",
      "5d24c42d4ec4f8557d0eb421"
    ],
    "_id": "5d24c42d4ec4f8557d0eb449",
    "title": "Brussels trip",
    "user_id": "5d24c42c4ec4f8557d0eb415",
    "__v": 0
  },
  {
    "places": [
      "5d24c42d4ec4f8557d0eb425",
      "5d24c42d4ec4f8557d0eb429",
      "5d24c42d4ec4f8557d0eb42d"
    ],
    "_id": "5d24c42d4ec4f8557d0eb44a",
    "title": "Paris trip",
    "user_id": "5d24c42c4ec4f8557d0eb416",
    "__v": 0
  },
  {
    "places": [
      "5d24c42d4ec4f8557d0eb43d",
      "5d24c42d4ec4f8557d0eb441",
      "5d24c42d4ec4f8557d0eb445"
    ],
    "_id": "5d24c42d4ec4f8557d0eb44c",
    "title": "Tokyo trip",
    "user_id": "5d24c42c4ec4f8557d0eb418",
    "__v": 0
  }
]
```

### **/api/users/:id/trips**  
#### GET - User Trips Index
##### Example Request  
GET http://localhost:3999/api/users/5d24c42c4ec4f8557d0eb416/trips

##### Example Response  
```javascript  
200 OK
[
  {
    "places": [
      "5d24c42d4ec4f8557d0eb425",
      "5d24c42d4ec4f8557d0eb429",
      "5d24c42d4ec4f8557d0eb42d"
    ],
    "_id": "5d24c42d4ec4f8557d0eb44a",
    "title": "Paris trip",
    "user_id": "5d24c42c4ec4f8557d0eb416",
    "__v": 0
  }
]
```
#### POST - Create New Trip
##### Example Request  
POST http://localhost:3999/api/users/5d24c42c4ec4f8557d0eb416/trips

##### Parameters  
**email** - Type: String - Required  
**password** - Type: String - Required  

##### Example Payload  
```javascript  
{
  "title": "Amsterdam trip 2019",
  "user_id": "5d247d6b4202603cf1d86f2d"
}
```  
##### Example Response  
```javascript  
201 Created
{
  "places": [],
  "_id": "5d25e55178f035671fea12f4",
  "title": "Amsterdam trip 2019",
  "user_id": "5d247d6b4202603cf1d86f2d",
  "__v": 0
}
```

### **/api/trips/:tripId**  
#### GET - Show Trip
##### Example Request  
GET http://localhost:3999/api/trips/5d24c42d4ec4f8557d0eb449

##### Example Response  
```javascript  
200 OK
{
  "places": [
    "5d24c42d4ec4f8557d0eb419",
    "5d24c42d4ec4f8557d0eb41d",
    "5d24c42d4ec4f8557d0eb421"
  ],
  "_id": "5d24c42d4ec4f8557d0eb449",
  "title": "Brussels trip",
  "user_id": "5d24c42c4ec4f8557d0eb415",
  "__v": 0
}
```
#### PUT - Edit Trip
##### Example Request  
PUT http://localhost:3999/api/trips/5d24c42d4ec4f8557d0eb449

##### Parameters  
**title** - Type: String - Required  

##### Example Payload  
```javascript  
{
	"title": "Brussels trip 2019"
}
```  
##### Example Response  
```javascript  
202 Accepted  
{
  "places": [
    "5d24c42d4ec4f8557d0eb419",
    "5d24c42d4ec4f8557d0eb41d",
    "5d24c42d4ec4f8557d0eb421"
  ],
  "_id": "5d24c42d4ec4f8557d0eb449",
  "title": "Brussels trip 2019",
  "user_id": "5d24c42c4ec4f8557d0eb415",
  "__v": 0
}
```
#### POST - Add New Place To Trip
##### Example Request  
POST http://localhost:3999/api/trips/5d24c42d4ec4f8557d0eb449

##### Parameters  
**triposoId** - Type: String - Required  

##### Example Payload  
```javascript  
{
  "triposoId": "W__3517898"
}
```  
##### Example Response  
```javascript  
202 Accepted
{
  "places": [
    "5d24c42d4ec4f8557d0eb419",
    "5d24c42d4ec4f8557d0eb421",
    "5d25f43357e64f6bf95da287"
  ],
  "_id": "5d24c42d4ec4f8557d0eb449",
  "title": "Brussels trip",
  "user_id": "5d24c42c4ec4f8557d0eb415",
  "__v": 1
}
```
#### PATCH - Remove Place From Trip
##### Example Request  
PATCH http://localhost:3999/api/trips/5d24c42d4ec4f8557d0eb449

##### Parameters  
**placeId** - Type: String - Required  

##### Example Payload  
```javascript  
{
	"placeId": "5d24c42d4ec4f8557d0eb41d"
}
```  
##### Example Response  
```javascript  
202 Accepted  
{
  "places": [
    "5d24c42d4ec4f8557d0eb419",
    "5d24c42d4ec4f8557d0eb421"
  ],
  "_id": "5d24c42d4ec4f8557d0eb449",
  "title": "Brussels trip",
  "user_id": "5d24c42c4ec4f8557d0eb415",
  "__v": 0
}
```
#### DELETE - Delete Trip
##### Example Request  
DELETE http://localhost:3999/api/trips/5d24c42d4ec4f8557d0eb449

##### Example Response  
```javascript  
204 No Content
```
### **/api/places**  
#### GET - Places Index - ***(From our api)***  
**** **Testing Purposes Only - Not to be deployed** ****
##### Example Request  
GET http://localhost:3999/api/places/

##### Example Response  
```javascript  
200 OK
[
  {
    "images": [],
    "_id": "5d24c42d4ec4f8557d0eb419",
    "triposoId": "W__3517898",
    "comments": [
      {
        "_id": "5d24c42d4ec4f8557d0eb41c",
        "text": "Comment 1",
        "user": "5d24c42c4ec4f8557d0eb416",
        "createdAt": "2019-07-09T16:43:25.163Z",
        "updatedAt": "2019-07-09T16:43:25.163Z"
      },
      {
        "_id": "5d24c42d4ec4f8557d0eb41b",
        "text": "Comment 2",
        "user": "5d24c42c4ec4f8557d0eb417",
        "createdAt": "2019-07-09T16:43:25.164Z",
        "updatedAt": "2019-07-09T16:43:25.164Z"
      },
      {
        "_id": "5d24c42d4ec4f8557d0eb41a",
        "text": "Comment 3",
        "user": "5d24c42c4ec4f8557d0eb418",
        "createdAt": "2019-07-09T16:43:25.164Z",
        "updatedAt": "2019-07-09T16:43:25.164Z"
      }
    ],
    "ratings": [],
    "__v": 0
  },
  {
    "images": [],
    "_id": "5d24c42d4ec4f8557d0eb429",
    "triposoId": "N__829526180",
    "comments": [
      {
        "_id": "5d24c42d4ec4f8557d0eb42c",
        "text": "Comment 4",
        "user": "5d24c42c4ec4f8557d0eb415",
        "createdAt": "2019-07-09T16:43:25.165Z",
        "updatedAt": "2019-07-09T16:43:25.165Z"
      },
      {
        "_id": "5d24c42d4ec4f8557d0eb42b",
        "text": "Comment 5",
        "user": "5d24c42c4ec4f8557d0eb417",
        "createdAt": "2019-07-09T16:43:25.165Z",
        "updatedAt": "2019-07-09T16:43:25.165Z"
      },
      {
        "_id": "5d24c42d4ec4f8557d0eb42a",
        "text": "Comment 6",
        "user": "5d24c42c4ec4f8557d0eb418",
        "createdAt": "2019-07-09T16:43:25.165Z",
        "updatedAt": "2019-07-09T16:43:25.165Z"
      }
    ],
    "ratings": [],
    "__v": 0
  }
]
```
###  **/api/places/:id**
#### GET - Show Place
##### Example Request  
GET http://localhost:3999/api/places/W__3517898

##### Example Response  
```javascript  
{
  "images": [],
  "_id": "5d24c42d4ec4f8557d0eb419",
  "triposoId": "W__3517898",
  "comments": [
    {
      "_id": "5d24c42d4ec4f8557d0eb41c",
      "text": "Comment 1",
      "user": "5d24c42c4ec4f8557d0eb416",
      "createdAt": "2019-07-09T16:43:25.163Z",
      "updatedAt": "2019-07-09T16:43:25.163Z"
    },
    {
      "_id": "5d24c42d4ec4f8557d0eb41b",
      "text": "Comment 2",
      "user": "5d24c42c4ec4f8557d0eb417",
      "createdAt": "2019-07-09T16:43:25.164Z",
      "updatedAt": "2019-07-09T16:43:25.164Z"
    },
    {
      "_id": "5d24c42d4ec4f8557d0eb41a",
      "text": "Comment 3",
      "user": "5d24c42c4ec4f8557d0eb418",
      "createdAt": "2019-07-09T16:43:25.164Z",
      "updatedAt": "2019-07-09T16:43:25.164Z"
    }
  ],
  "ratings": [],
  "__v": 0
}
```
### **/places/:placeId**  
#### GET - Show Place
##### Example Request  
GET http://localhost:3999/api/places/W__3517898

##### Example Response  
```javascript  
200 OK
{
  "images": [],
  "_id": "5d24c42d4ec4f8557d0eb419",
  "triposoId": "W__3517898",
  "comments": [
    {
      "_id": "5d24c42d4ec4f8557d0eb41c",
      "text": "Comment 1",
      "user": "5d24c42c4ec4f8557d0eb416",
      "createdAt": "2019-07-09T16:43:25.163Z",
      "updatedAt": "2019-07-09T16:43:25.163Z"
    },
    {
      "_id": "5d24c42d4ec4f8557d0eb41b",
      "text": "Comment 2",
      "user": "5d24c42c4ec4f8557d0eb417",
      "createdAt": "2019-07-09T16:43:25.164Z",
      "updatedAt": "2019-07-09T16:43:25.164Z"
    },
    {
      "_id": "5d24c42d4ec4f8557d0eb41a",
      "text": "Comment 3",
      "user": "5d24c42c4ec4f8557d0eb418",
      "createdAt": "2019-07-09T16:43:25.164Z",
      "updatedAt": "2019-07-09T16:43:25.164Z"
    }
  ],
  "ratings": [],
  "__v": 0
}
```
