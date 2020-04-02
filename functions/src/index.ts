// https://firebase.google.com/docs/functions/typescript

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const createUser = functions.auth.user().onCreate((user: any) => {
    if (!user || !user.uid) throw new Error('invalid user');

    const createdAt = admin.firestore.FieldValue.serverTimestamp();

    const username = 'user' + Math.random().toString().slice(3, 10);

    const newUser = {
        uid: user.uid,
        createdAt,
        username,
        lowerCaseUsername: username.toLowerCase(),
        posts: 0,
        likes: 0
    };

    return db.doc(`users/${user.uid}`).set(newUser);
});




export const createPost = functions.firestore
    .document('posts/{postId}')
    .onCreate((snap, context) => {
        const post = snap.data();
        if (!post || !post.userId) throw new Error('invalid post');
        const increment = admin.firestore.FieldValue.increment(1);
        return db.doc(`users/${post.userId}`).update({ posts: increment });
    });




export const deletePost = functions.firestore
    .document('posts/{postId}')
    .onDelete((snap, context) => {
        const post = snap.data();
        if (!post || !post.userId) throw new Error('invalid post');
        const decrement = admin.firestore.FieldValue.increment(-1);
        return db.doc(`users/${post.userId}`).update({ posts: decrement });
    });



export const likePost = functions.https.onCall(({ postId, userId }) => {
    if (!postId || !userId) throw new Error('invalid like');
    console.log(`Post: ${postId} liked by: ${userId}`);
    const increment = admin.firestore.FieldValue.increment(1);
    return db.doc(`posts/${postId}`).update({ likes: increment });
});

export const unlikePost = functions.https.onCall(({ postId, userId }) => {
    if (!postId || !userId) throw new Error('invalid unlike');
    console.log(`Post: ${postId} unliked by: ${userId}`);
    const decrement = admin.firestore.FieldValue.increment(-1);
    return db.doc(`posts/${postId}`).update({ likes: decrement });
});

// export const createComment = functions.firestore
//     .document('posts/{postId}/comments/{commentId}')
//     .onCreate((snap, context) => {
//         const comment = snap.data();
//         if (!comment) throw new Error('invalid comment');

//         // add notification to followers
//     });
