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
        posts: 0
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



// Following posts & comments
export const addFollower = functions.https.onCall(async ({ doc, newId, oldId }) => {
    if (!doc || !newId) throw new Error('invalid follow');
    if (oldId) {
        const arrayRemove = admin.firestore.FieldValue.arrayRemove(oldId);
        await db.doc(doc).update({ followerIds: arrayRemove });
    }
    const arrayUnion = admin.firestore.FieldValue.arrayUnion(newId);
    await db.doc(doc).update({ followerIds: arrayUnion });
});



export const removeFollower = functions.https.onCall(({ doc, id }) => {
    if (!doc || !id) throw new Error('invalid follow');
    const arrayRemove = admin.firestore.FieldValue.arrayRemove(id);
    return db.doc(doc).update({ followerIds: arrayRemove });
});



// Like posts, comments, replies -> automatically follow
export const like = functions.https.onCall(async ({ doc, userId, likedIds, followerIds }) => {
    if (!doc || !userId || !likedIds) throw new Error('invalid like');

    if (likedIds && likedIds.length > 100) {
        const arrayRemove = admin.firestore.FieldValue.arrayRemove(likedIds[0]);
        await db.doc(doc).update({ likedIds: arrayRemove });
    }

    if (followerIds && followerIds.length > 100) {
        const arrayRemove = admin.firestore.FieldValue.arrayRemove(followerIds[0]);
        await db.doc(doc).update({ followerIds: arrayRemove });
    }

    const increment = admin.firestore.FieldValue.increment(1);
    const likedUnion = admin.firestore.FieldValue.arrayUnion(userId);
    const followerUnion = admin.firestore.FieldValue.arrayUnion(userId);

    await db.doc(doc).update({ likes: increment, likedIds: likedUnion, followerIds: followerUnion });
});



// Unlike posts, comments, replies - stay following
export const unlike = functions.https.onCall(async ({ doc, userId }) => {
    if (!doc || !userId) throw new Error('invalid unlike');

    const decrement = admin.firestore.FieldValue.increment(-1);
    const likedRemove = admin.firestore.FieldValue.arrayRemove(userId);

    await db.doc(doc).update({ likes: decrement, likedIds: likedRemove });
});



// Notifications
export const notify = functions.https.onCall(async ({ followerIds, notification }) => {
    if (!followerIds || !notification) throw new Error('invalid notification');
    for (const id of followerIds) {
        await db.collection(`users/${id}/notifications`).add(notification);
    }
});


