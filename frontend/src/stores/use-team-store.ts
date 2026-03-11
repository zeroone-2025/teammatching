import { create } from "zustand";
import { assignTeams, Member, Team } from "@/lib/assign";

interface TeamState {
  members: Member[];
  result: { teams: Team[]; unassigned: Member[] } | null;
  addMember: (name: string, isDeveloper: boolean) => void;
  removeMember: (id: string) => void;
  assign: () => void;
  reset: () => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  result: null,

  addMember: (name, isDeveloper) =>
    set((state) => ({
      members: [
        ...state.members,
        { id: crypto.randomUUID(), name, isDeveloper },
      ],
    })),

  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
      result: null,
    })),

  assign: () => {
    const result = assignTeams(get().members);
    set({ result });
  },

  reset: () => set({ result: null }),
}));
