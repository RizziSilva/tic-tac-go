import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { firebaseService } from "./firebase";

export function userService() {
  const { db } = firebaseService();

  async function saveUserIfNotExists(user) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const isUserAlreadyCreated = snap.exists();
    const data = snap.data();
    const hasDisplayName = data?.displayName;

    if (!isUserAlreadyCreated || !hasDisplayName) {
      await setDoc(ref, {
        email: user.email,
        displayName: user.displayName,
        image: user.photoURL,
        createdAt: new Date(),
        games: 0,
        wins: 0,
        defeats: 0,
      });
    }
  }

  async function getUserInfo(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    const data = snap.data();

    return data;
  }

  async function updateGameResult(uid, hasWon) {
    const ref = doc(db, "users", uid);

    await updateDoc(ref, {
      games: increment(1),
      wins: increment(hasWon ? 1 : 0),
      defeats: increment(hasWon ? 0 : 1),
    });
  }

  return { saveUserIfNotExists, getUserInfo, updateGameResult };
}
