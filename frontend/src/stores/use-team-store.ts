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

const DEFAULT_MEMBERS: Member[] = [
  { id: crypto.randomUUID(), name: "정보승", isDeveloper: true },
  { id: crypto.randomUUID(), name: "김지빈", isDeveloper: true },
  { id: crypto.randomUUID(), name: "홍채운", isDeveloper: true },
  { id: crypto.randomUUID(), name: "박은호", isDeveloper: true },
  { id: crypto.randomUUID(), name: "서종호", isDeveloper: true },
  { id: crypto.randomUUID(), name: "이찬규", isDeveloper: true },
  { id: crypto.randomUUID(), name: "황지찬", isDeveloper: true },
  { id: crypto.randomUUID(), name: "백금빈", isDeveloper: false },
];

export const useTeamStore = create<TeamState>((set, get) => ({
  members: DEFAULT_MEMBERS,
  result: null,

  addMember: (name, isDeveloper) =>
    set((state) => {
      const count = state.members.filter(
        (m) => m.name === name || new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\(\\d+\\)$`).test(m.name)
      ).length;
      const displayName = count === 0 ? name : `${name} (${count + 1})`;
      return {
        members: [...state.members, { id: crypto.randomUUID(), name: displayName, isDeveloper }],
      };
    }),

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
