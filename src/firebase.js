import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCmTNLXw5HgK-ZxaNNYrffcO6dFQGXnJC8",
    authDomain: "sunlightdentaljb.firebaseapp.com",
    projectId: "sunlightdentaljb",
    storageBucket: "sunlightdentaljb.appspot.com",
    messagingSenderId: "1012622633710",
    appId: "1:1012622633710:web:bc19299874f10d6b8221ff",
    measurementId: "G-B5XB65W47G",
}

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
