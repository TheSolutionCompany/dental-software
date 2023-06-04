import firebase from "firebase/compat/app"
import "firebase/compat/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCmTNLXw5HgK-ZxaNNYrffcO6dFQGXnJC8",
    authDomain: "sunlightdentaljb.firebaseapp.com",
    projectId: "sunlightdentaljb",
    storageBucket: "sunlightdentaljb.appspot.com",
    messagingSenderId: "1012622633710",
    appId: "1:1012622633710:web:bc19299874f10d6b8221ff",
    measurementId: "G-B5XB65W47G",
}

firebase.initializeApp(firebaseConfig)

export default firebase
