// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔐 SUA CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDIiCJe2kjZoVH48E-ZCNS2ziq4bMGJoOs",
  authDomain: "nails-agendamento.firebaseapp.com",
  projectId: "nails-agendamento",
  storageBucket: "nails-agendamento.firebasestorage.app",
  messagingSenderId: "864039037414",
  appId: "1:864039037414:web:cbb9045ff0ad6478da8e27"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 🔍 Buscar horários ocupados de um dia
export async function getBookedTimes(date) {
  const ref = doc(db, "appointments", date);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().times || {};
  }
  return {};
}

// 💾 Salvar novo agendamento
export async function saveAppointment(date, time, data) {
  const ref = doc(db, "appointments", date);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { times: { [time]: data } });
  } else {
    const times = snap.data().times || {};
    if (times[time]) {
      throw new Error("Horário já reservado");
    }
    await updateDoc(ref, {
      [`times.${time}`]: data
    });
  }
}
