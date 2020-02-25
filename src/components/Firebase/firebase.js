import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        //app.firestore().settings();


        /* Helper */

        this.fieldValue = app.firestore.FieldValue;
        this.emailAuthProvider = app.auth.EmailAuthProvider;

        /* Firebase APIs */

        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
        this.storageRef = app.storage().ref();


        /* Social Sign In Method Provider */

        // this.googleProvider = new app.auth.GoogleAuthProvider();
        // this.facebookProvider = new app.auth.FacebookAuthProvider();
        // this.twitterProvider = new app.auth.TwitterAuthProvider();
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    // doSignInWithGoogle = () =>
    //   this.auth.signInWithPopup(this.googleProvider);
    //
    // doSignInWithFacebook = () =>
    //   this.auth.signInWithPopup(this.facebookProvider);
    //
    // doSignInWithTwitter = () =>
    //   this.auth.signInWithPopup(this.twitterProvider);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doSendEmailVerification = () =>
        this.auth.currentUser.sendEmailVerification({
            url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
        });

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    // *** Merge Auth and DB User API *** //

    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .get()
                    .then(snapshot => {
                        const dbUser = snapshot.data();

                        // // default empty roles
                        // if (!dbUser.roles) {
                        //   dbUser.roles = {};
                        // }

                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            // emailVerified: authUser.emailVerified,
                            // providerData: authUser.providerData,
                            ...dbUser,
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
        });

    // *** User API ***
    user = uid => this.db.doc(`users/${uid}`);
    users = () => this.db.collection('users');

    classroom = id => this.db.doc(`classrooms/${id}`);
    classrooms = () => this.db.collection('classrooms');

    quiz = id => this.db.doc(`quizzes/${id}`);
    quizzes = () => this.db.collection('quizzes')


    // *** Message API ***
    // message = uid => this.db.doc(`messages/${uid}`);
    // messages = () => this.db.collection('messages');
    //
    // // *** Message API ***
    // car = uid => this.db.doc(`cars/${uid}`);
    // cars = () => this.db.collection('cars');
    //
    // // *** Images Storage API ***
    // //imagesRef = this.storageRef.child('images');
    // imageRef = (id) => this.storageRef.child(`images/${id}.jpg`);

}

export default Firebase;
