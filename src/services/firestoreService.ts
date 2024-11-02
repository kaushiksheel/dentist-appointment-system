import { Appointment } from "@/interfaces";
import { db } from "@/lib/firebase";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export const fetchDentists = async () => {
  const querySnapshot = await getDocs(collection(db, "dentists"));
  const itemsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return itemsData;
};
export const fetchDentistServices = async () => {
  const querySnapshot = await getDocs(collection(db, "services"));
  const itemsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return itemsData;
};

export const addAppointment = async (appointment: Appointment) => {
  try {
    await addDoc(collection(db, "appointments"), appointment);
  } catch (error) {
    console.log(error);
  }
};

export const fetchAppointmentsByUserId = async (userUID: string) => {
  const appointmentsRef = collection(db, "appointments");
  const userAppointmentsQuery = query(
    appointmentsRef,
    where("userUID", "==", userUID),
  );

  try {
    const querySnapshot = await getDocs(userAppointmentsQuery);
    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
export const fetchAppointmentsByDoctorId = async (userUID: string) => {
  const appointmentsRef = collection(db, "appointments");
  const userAppointmentsQuery = query(
    appointmentsRef,
    where("doctorId", "==", userUID),
  );

  try {
    const querySnapshot = await getDocs(userAppointmentsQuery);
    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const fetchUsersById = async (userUID: string) => {
  const usersRef = collection(db, "customers");
  const useUsersQuery = query(usersRef, where("userUID", "==", userUID));

  try {
    const querySnapshot = await getDocs(useUsersQuery);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching Users:", error);
    throw error;
  }
};

export const fetchAllAppointments = async () => {
  const querySnapshot = await getDocs(collection(db, "appointments"));
  const itemsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return itemsData;
};
