import { create } from "zustand";
import { persist } from "zustand/middleware";
import { assignTeams, Member, Team } from "@/lib/assign";

export interface MemberSlot {
  teamIndex: number;
  field: "기획" | "마케팅" | "개발" | "extra";
  extraIndex?: number;
}

interface TeamState {
  members: Member[];
  result: { teams: Team[] } | null;
  topic: string;
  numTeams: number | "auto";
  lockedTeamNames: string[];
  addMember: (name: string, isDeveloper: boolean) => void;
  removeMember: (id: string) => void;
  toggleDeveloper: (id: string) => void;
  assign: () => void;
  reset: () => void;
  setTopic: (topic: string) => void;
  setNumTeams: (n: number | "auto") => void;
  toggleLockTeam: (teamName: string) => void;
  swapMembers: (slotA: MemberSlot, slotB: MemberSlot) => void;
}

const DEFAULT_MEMBERS: Member[] = [
  { id: crypto.randomUUID(), name: "정보승", isDeveloper: true },
  { id: crypto.randomUUID(), name: "김지빈", isDeveloper: true },
  { id: crypto.randomUUID(), name: "홍채운", isDeveloper: true },
  { id: crypto.randomUUID(), name: "박은호", isDeveloper: true },
  { id: crypto.randomUUID(), name: "서종호", isDeveloper: true },
  { id: crypto.randomUUID(), name: "이찬규", isDeveloper: true },
  { id: crypto.randomUUID(), name: "황지찬", isDeveloper: true },
  { id: crypto.randomUUID(), name: "김민령", isDeveloper: true },
  { id: crypto.randomUUID(), name: "백금빈", isDeveloper: false },
];

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      members: DEFAULT_MEMBERS,
      result: null,
      topic: "",
      numTeams: "auto",
      lockedTeamNames: [],

      addMember: (name, isDeveloper) =>
        set((state) => {
          const count = state.members.filter(
            (m) =>
              m.name === name ||
              new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\(\\d+\\)$`).test(m.name)
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
          lockedTeamNames: [],
        })),

      toggleDeveloper: (id) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, isDeveloper: !m.isDeveloper } : m
          ),
          result: null,
          lockedTeamNames: [],
        })),

      assign: () => {
        const state = get();

        const lockedTeams =
          state.result?.teams.filter((t) => state.lockedTeamNames.includes(t.name)) ?? [];

        const lockedMemberIds = new Set(
          lockedTeams.flatMap((t) => [
            t.기획.id,
            t.마케팅.id,
            t.개발.id,
            ...t.extra.map((e) => e.member.id),
          ])
        );

        const freeMembers = state.members.filter((m) => !lockedMemberIds.has(m.id));

        const totalTeams =
          state.numTeams === "auto"
            ? Math.floor(state.members.length / 3)
            : state.numTeams;

        const newTeamCount = totalTeams - lockedTeams.length;

        if (newTeamCount <= 0) {
          set({ result: { teams: lockedTeams } });
          return;
        }

        const excludeTeamNames = lockedTeams.map((t) => t.name);
        const newResult = assignTeams(freeMembers, { numTeams: newTeamCount, excludeTeamNames });

        let finalTeams: Team[];
        if (state.result && lockedTeams.length > 0) {
          const newTeamsQueue = [...newResult.teams];
          finalTeams = state.result.teams.map((t) => {
            if (state.lockedTeamNames.includes(t.name)) return t;
            return newTeamsQueue.shift()!;
          });
          finalTeams = [...finalTeams, ...newTeamsQueue];
        } else {
          finalTeams = newResult.teams;
        }

        set({ result: { teams: finalTeams } });
      },

      reset: () => set({ result: null, lockedTeamNames: [] }),

      setTopic: (topic) => set({ topic }),

      setNumTeams: (n) => set({ numTeams: n }),

      toggleLockTeam: (teamName) =>
        set((state) => ({
          lockedTeamNames: state.lockedTeamNames.includes(teamName)
            ? state.lockedTeamNames.filter((n) => n !== teamName)
            : [...state.lockedTeamNames, teamName],
        })),

      swapMembers: (slotA: MemberSlot, slotB: MemberSlot) =>
        set((state) => {
          if (!state.result) return state;

          const teams = state.result.teams.map((t) => ({
            ...t,
            extra: t.extra.map((e) => ({ ...e })),
          }));

          const getMember = (slot: MemberSlot): Member => {
            if (slot.field === "extra") {
              return teams[slot.teamIndex].extra[slot.extraIndex!].member;
            }
            return teams[slot.teamIndex][slot.field];
          };

          const setMember = (slot: MemberSlot, member: Member) => {
            if (slot.field === "extra") {
              teams[slot.teamIndex].extra[slot.extraIndex!].member = member;
            } else {
              teams[slot.teamIndex][slot.field] = member;
            }
          };

          const memberA = getMember(slotA);
          const memberB = getMember(slotB);
          setMember(slotA, memberB);
          setMember(slotB, memberA);

          return { result: { teams } };
        }),
    }),
    {
      name: "zerothon-team-store",
      partialize: (state) => ({
        members: state.members,
        topic: state.topic,
        numTeams: state.numTeams,
      }),
    }
  )
);
