![Logo](/src/assets/feature-graphic.jpg "Feature Graphic")

# Essentials Anonymous

## Ionic, Angular, Capacitor, Firebase
A hybrid app for posting anonymous snippets about essential business and pandemic related topics.

Users swipe through the intro slides to learn about the basic features and then use the Firebase Anonymous Authentication to log in and redirect to the home page.

Posts, comments, and replies are sorted by recency, popularity, and featured status. They are loaded using the Ionic Infinite Scroll component and can be liked, followed, shared, and reported (and deleted by the author).

Users following posts & comments will recieve notifications for each new comment or reply.

For scalability and complexity sake, all likes and follows have a 100 user maximum per document. When more than 100 users like or follow a single post/comment/reply, the earliest ones get "shifted" out of the array using server field values for accurately manipulating documents between requests.

A Dark Mode toggle and primary color picker are also implemented using the Ionic CSS Theme variables and function in conjunction with each other.

### Cloud Functions
Firebase Cloud Functions run on the server in response to events or http requests.
- User Create (trigger)
- Create Post (trigger)
- Delete Post (trigger)
- Add Follower (http)
- Remove Follower (http)
- Like (http)
- Unlike (http)
- Notify (http)

### Capacitor Plugins
Capacitor is the communication layer between the web app and the native device APIs.
- Share (and Clipboard as fallback)
- Storage

## Stay Tuned, there's lots more to come!
