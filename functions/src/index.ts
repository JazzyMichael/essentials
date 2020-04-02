// https://firebase.google.com/docs/functions/typescript

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const createUser = functions.auth.user().onCreate((user: any) => {
    if (!user || !user.uid) throw new Error('invalid user');

    const providerData = user.providerData && user.providerData[0];

    if (!providerData) throw new Error('invalid user data from sign in');

    const createdAt = admin.firestore.FieldValue.serverTimestamp();

    const username = 'user' + Math.random().toString().slice(3, 10);

    const newUser = {
        uid: user.uid,
        displayName: providerData.displayName,
        photoUrl: providerData.photoURL,
        providerId: providerData.providerId,
        createdAt,
        username,
        lowerCaseUsername: username.toLowerCase()
    };

    return db.collection('users').add(newUser);
});
