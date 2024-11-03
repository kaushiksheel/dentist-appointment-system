import { Dentist } from "@/interfaces";
import { fetchDentists } from "@/services/firestoreService";
import { useState, useEffect } from "react";

export function useDentists() {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDentists() {
      try {
        const data = await fetchDentists();
        setDentists(data as Dentist[]);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch dentists"),
        );
      } finally {
        setLoading(false);
      }
    }

    loadDentists();
  }, []);

  return { dentists, loading, error };
}
