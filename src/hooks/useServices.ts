import { Service } from "@/interfaces";
import { fetchDentistServices } from "@/services/firestoreService";
import { useState, useEffect } from "react";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await fetchDentistServices();
        setServices(data as Service[]);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch services"),
        );
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return { services, loading, error };
}
