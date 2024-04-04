import { setDoc, doc, updateDoc, getDoc, writeBatch, addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./initiate.js";

export default function addUser(userInfo) {
    const date = new Date();

    let currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const data = {
        [currentDate]: {
        },
    };

    return new Promise((resolve, reject) => {
        setDoc(doc(db, 'Users', userInfo['email']), userInfo)
            .then((snapshot) => console.log("user doc made"))
            .catch((error) => reject(error))
        if (userInfo['role'] == 'patient') {
            setDoc(doc(db, 'BloodPressure', (userInfo['id']).toString()), data)
                .then((snapshot) => console.log("bloodPressure doc made"))
                .catch((error) => reject(error))
            setDoc(doc(db, 'HeartRate', (userInfo['id']).toString()), data)
                .then((snapshot) => console.log("heartRate doc made"))
                .catch((error) => reject(error))
            setDoc(doc(db, 'Calories', (userInfo['id']).toString()), data)
                .then((snapshot) => console.log("Calories doc made"))
                .catch((error) => reject(error))
            setDoc(doc(db, 'Mood', (userInfo['id']).toString()), data)
                .then((snapshot) => console.log("Mood doc made"))
                .catch((error) => reject(error))
            setDoc(doc(db, 'Sleep', (userInfo['id']).toString()), data)
                .then((snapshot) => console.log("Sleep doc made"))
                .catch((error) => reject(error))
            setDoc(doc(db, 'Water', (userInfo['id']).toString()), data)
                .then((snapshot) => console.log("Water doc made"))
                .catch((error) => reject(error))
            setDoc(doc(db, 'Attendance-In', (userInfo['id']).toString()), data)
                .then((snapshot) => console.log("Attendance-In doc made"))
                .catch((error) => reject(error))
            setDoc(doc(db, 'Attendance-Out', (userInfo['id']).toString()), data)
                .then((snapshot) => console.log("Attendance-Out doc made"))
                .catch((error) => reject(error))
        }
        resolve("All tables created successfully");
    })
}

export function addUserDetails(id, information) {

    return new Promise(async (resolve, reject) => {

        const date = new Date();
        let currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        let time = `${date.getHours()}:${date.getMinutes()}`;

        const batch = writeBatch(db);
        let oldData;
        let DocRef;

        //Setting BloodPressure
        DocRef = doc(db, 'BloodPressure', String(id));
        oldData = (await getDoc(DocRef)).data();
        oldData[currentDate] = {
            'Systolic': information['BloodPressure']['value']['systolic'],
            'Diastolic': information['BloodPressure']['value']['diastolic'],
        };
        batch.set(DocRef, oldData);

        //Setting HeartRate
        DocRef = doc(db, 'HeartRate', String(id));
        oldData = (await getDoc(DocRef)).data();

        oldData[currentDate] = {
            // ...oldData[currentDate],
            'HeartRate': information['HeartRate']['value']
        };
        batch.set(DocRef, oldData);

        //Setting Calories
        DocRef = doc(db, 'Calories', String(id));
        oldData = (await getDoc(DocRef)).data();

        oldData[currentDate] = {
            // ...oldData[currentDate],
            'Breakfast': information['Calories']['value']['Breakfast'],
            'Lunch': information['Calories']['value']['Lunch'],
            'Dinner': information['Calories']['value']['Dinner'],
        };
        batch.set(DocRef, oldData);

        //Setting Mood :)
        DocRef = doc(db, 'Mood', String(id));
        oldData = (await getDoc(DocRef)).data();

        oldData[currentDate] = {
            // ...oldData[currentDate],
            'Happy': information['Mood']['value']['Happy'],
            'Energetic': information['Mood']['value']['Energetic'],
            'Anxiety': information['Mood']['value']['Anxiety'],
        };
        batch.set(DocRef, oldData);

        //Setting Sleep
        DocRef = doc(db, 'Sleep', String(id));
        oldData = (await getDoc(DocRef)).data();

        oldData[currentDate] = {
            // ...oldData[currentDate],
            'sleep': information['Sleep']['value'],
        };
        batch.set(DocRef, oldData);

        //Setting Water
        DocRef = doc(db, 'Water', String(id));
        oldData = (await getDoc(DocRef)).data();

        oldData[currentDate] = {
            // ...oldData[currentDate],
            'water': information['Water']['value'],
        };
        batch.set(DocRef, oldData);

        //Writing commits in the firebase
        batch.commit()
            .then(message => resolve(message))
            .catch(error => reject(error))
    })
}

export function getDetails(id, type) {
    return new Promise((resolve, reject) => {
        getDoc(doc(db, type, String(id)))
            .then((information) => resolve(information.data()))
            .catch((err) => reject(err))
    })
}

export function addAppointment(information) {
    return new Promise((resolve, reject) => {
        addDoc(collection(db, 'Appointments'), {
            'firstName ': information['firstName'],
            'lastName': information['lastName'],
            'email': information['email'],
            'mobile': information['mobile'],
            'DOB': information['DOB'],
            'gender': information['gender'],
            'appointmentDate': information['appointmentDate'],
            'problem': information['problem'],
            'status': "pending"
        })
            .then((message) => resolve(message))
            .catch((error) => reject(error));
    })
}

export function getAppointment() {
    return new Promise((resolve, reject) => {
        getDocs(query(collection(db, 'Appointments'), where('status', '==', 'pending')))
            .then((snapshot) => {
                let data = [];
                snapshot.forEach((doc) => {
                    data.push(doc.data());
                })
                resolve(data);
            })
            .catch(error => reject(error));
    })
}