import { useEffect, useState } from "react";
import { BirthProfileService } from "@/lib/vedic-api";

// Loads the signed-in user's saved birth profile (their kundli + birth details)
// from local storage so every AI surface can use it without the user re-entering details.
export default function useBirthProfile() {
    const [profile, setProfileState] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = BirthProfileService.get();
        if (saved) {
            setProfileState(saved);
        }
        setLoading(false);
    }, []);

    const setProfile = (newProfile) => {
        BirthProfileService.save(newProfile);
        setProfileState(newProfile);
    };

    return { profile, setProfile, loading };
}