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
        lowerCaseUsername: username.toLowerCase()
    };

    return db.doc(`users/${user.uid}`).set(newUser);
});
