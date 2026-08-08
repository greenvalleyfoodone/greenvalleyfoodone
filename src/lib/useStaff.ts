import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type StaffState = {
  loading: boolean;
  user: User | null;
  roles: string[];
  isAdmin: boolean;
  isStaff: boolean;
};

/** Session + role state for the staff billing panel. */
export function useStaff(): StaffState {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadRoles(uid: string | undefined) {
      if (!uid) {
        if (active) setRoles([]);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (active) setRoles((data ?? []).map((r) => (r as { role: string }).role));
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      void loadRoles(session?.user?.id);
    });

    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setUser(data.user ?? null);
      await loadRoles(data.user?.id);
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    loading,
    user,
    roles,
    isAdmin: roles.includes("admin"),
    isStaff: roles.length > 0,
  };
}
