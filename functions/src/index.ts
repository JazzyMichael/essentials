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
        likes: 0,
        likedPostIds: [],
        likedCommentIds: [],
        likedReplyIds: []
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


// Posts - like & unlike
export const likePost = functions.https.onCall(({ postId, userId }) => {
    if (!postId || !userId) throw new Error('invalid post like');
    console.log(`Post: ${postId} liked by: ${userId}`);
    const increment = admin.firestore.FieldValue.increment(1);
    return db.doc(`posts/${postId}`).update({ likes: increment });
});

export const unlikePost = functions.https.onCall(({ postId, userId }) => {
    if (!postId || !userId) throw new Error('invalid post unlike');
    console.log(`Post: ${postId} unliked by: ${userId}`);
    const decrement = admin.firestore.FieldValue.increment(-1);
    return db.doc(`posts/${postId}`).update({ likes: decrement });
});


// Comments - like & unlike
export const likeComment = functions.https.onCall(({ postId, commentId, userId }) => {
    if (!postId || !commentId || !userId) throw new Error('invalid comment like');
    console.log(`Post: ${postId}, Comment: ${commentId}, liked by User: ${userId}`);
    const increment = admin.firestore.FieldValue.increment(1);
    return db.doc(`posts/${postId}/comments/${commentId}`).update({ likes: increment });
});

export const unlikeComment = functions.https.onCall(({ postId, commentId, userId }) => {
    if (!postId || !commentId || !userId) throw new Error('invalid comment unlike');
    console.log(`Post: ${postId}, Comment: ${commentId}, unliked by User: ${userId}`);
    const decrement = admin.firestore.FieldValue.increment(-1);
    return db.doc(`posts/${postId}/comments/${commentId}`).update({ likes: decrement });
});


// Replies - like & unlike
export const likeReply = functions.https.onCall(({ postId, commentId, replyId, userId }) => {
    if (!postId || !commentId || !replyId || !userId) throw new Error('invalid reply like');
    console.log(`Post: ${postId}, Comment: ${commentId}, Reply: ${replyId}, liked by User: ${userId}`);
    const increment = admin.firestore.FieldValue.increment(1);
    return db.doc(`posts/${postId}/comments/${commentId}/replies/${replyId}`).update({ likes: increment });
});

export const unlikeReply = functions.https.onCall(({ postId, commentId, replyId, userId }) => {
    if (!postId || !commentId || !replyId || !userId) throw new Error('invalid reply unlike');
    console.log(`Post: ${postId}, Comment: ${commentId}, Reply: ${replyId}, unliked by User: ${userId}`);
    const decrement = admin.firestore.FieldValue.increment(-1);
    return db.doc(`posts/${postId}/comments/${commentId}/replies/${replyId}`).update({ likes: decrement });
});
