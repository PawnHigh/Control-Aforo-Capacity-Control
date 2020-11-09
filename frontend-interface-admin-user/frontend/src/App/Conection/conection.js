import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAAwT1u5LqF-tpG3960Rr44N-FV-Br8t_0",
    authDomain: "csaforocontrol.firebaseapp.com",
    databaseURL: "https://csaforocontrol.firebaseio.com",
    projectId: "csaforocontrol",
    storageBucket: "csaforocontrol.appspot.com",
    messagingSenderId: "1079037025219",
    appId: "1:1079037025219:web:426e0ef5c8049021c73b76"
  };
const fb= firebase.initializeApp(firebaseConfig);
export const db=fb.firestore();