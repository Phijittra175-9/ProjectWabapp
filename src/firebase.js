import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions"
import { connectStorageEmulator, getStorage } from "firebase/storage"

//------------------------//
const firebaseConfig = {
  apiKey: "AIzaSyAvNOxU123qJQ9S3kN5JWDSQbUQnCn9Rno",
  authDomain: "projectwabapp-paula.firebaseapp.com",
  databaseURL: "https://projectwabapp-paula-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "projectwabapp-paula",
  storageBucket: "projectwabapp-paula.firebasestorage.app",
  messagingSenderId: "824352948509",
  appId: "1:824352948509:web:ca56c18981b086922ea1f4"
};
//------------------------//

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()
const storage = getStorage(app)

//const functions = getFunctions(app,"asia-southeast1")

const functions = getFunctions(app)

if (true) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
  connectFirestoreEmulator(db, 'localhost', 8085)  // เปลี่ยนจาก 8080 เป็น 8085
  connectFunctionsEmulator(functions, "localhost", 5001)
  connectStorageEmulator(storage, "localhost", 9199)
}

const call = async(functionName, params) => {
  try {
    let callableFunctions = httpsCallable(functions, functionName)
    let res = await callableFunctions(params)
    if (res.data.success) {
      return res.data
    } else if(res.data.success === false) {
      console.log(res.data.reason)
    }
    
  } catch (err) {
    console.log(err)
  }
}

export { app, auth, call, db, functions, storage }

