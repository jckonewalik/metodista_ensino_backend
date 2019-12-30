const firebase = require('firebase/app');
require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyB2XmHfHIlBJu65uF3n46mOiIAvrFMlKkE",
    authDomain: "metodista-ensino.firebaseapp.com",
    databaseURL: "https://metodista-ensino.firebaseio.com",
    projectId: "metodista-ensino",
    storageBucket: "metodista-ensino.appspot.com",
    messagingSenderId: "465940847958",
    appId: "1:465940847958:web:0f5883d8c72fd2dd208af7",
    measurementId: "G-1J349MC0NV"
}

firebase.initializeApp(firebaseConfig);

module.exports = firebase.auth();

