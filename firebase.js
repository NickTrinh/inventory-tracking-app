// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCrVqPEq_Gs_o43NAUHSpfKcW-oOKxCywA',
	authDomain: 'inventory-tracking-app-36ed2.firebaseapp.com',
	projectId: 'inventory-tracking-app-36ed2',
	storageBucket: 'inventory-tracking-app-36ed2.appspot.com',
	messagingSenderId: '16130783620',
	appId: '1:16130783620:web:82d3cabc7655d62c4685d1',
	measurementId: 'G-J549R4QEZS',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//const analytics = getAnalytics(app)
const firestore = getFirestore(app)

export { firestore }
