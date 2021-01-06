var firebaseConfig = {
    apiKey: "AIzaSyChaJO7fI9C0JnWjW7DKszJlDVcJU6EEwQ",
    authDomain: "f1-databas.firebaseapp.com",
    projectId: "f1-databas",
    storageBucket: "f1-databas.appspot.com",
    messagingSenderId: "781422240099",
    appId: "1:781422240099:web:711143d136e040b5a97356",
    measurementId: "G-S6YYZL4B08"
};
firebase.initializeApp(firebaseConfig);

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}
