import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseService } from "./firebase";

export function UserService() {
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

  return { saveUserIfNotExists };
}
