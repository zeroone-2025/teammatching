export type Role = "기획" | "마케팅" | "개발";

export interface Member {
  id: string;
  name: string;
  isDeveloper: boolean;
}

export interface Team {
  name: string;
  기획: Member;
  마케팅: Member;
  개발: Member;
  extra: { member: Member; role: Role }[];
}

const TEAM_NAMES = ["제로", "원", "투", "쓰리", "포", "파이브", "식스", "세븐", "에잇", "나인"];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function assignTeams(members: Member[]): { teams: Team[]; unassigned: Member[] } {
  const n = members.length;
  const numTeams = Math.floor(n / 3);
  const developers = members.filter((m) => m.isDeveloper);
  const nonDevelopers = members.filter((m) => !m.isDeveloper);

  if (developers.length < numTeams) {
    throw new Error(
      `개발자 수가 부족합니다. ${numTeams}팀을 구성하려면 개발자가 ${numTeams}명 필요하지만 현재 ${developers.length}명입니다.`
    );
  }

  const shuffledDevs = shuffle(developers);
  const devGroup = shuffledDevs.slice(0, numTeams);
  const remainingDevs = shuffledDevs.slice(numTeams);

  const pool = shuffle([...remainingDevs, ...nonDevelopers]);
  const planGroup = pool.slice(0, numTeams);
  const mktGroup = pool.slice(numTeams, numTeams * 2);
  const unassigned = pool.slice(numTeams * 2);

  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    name: (TEAM_NAMES[i] ?? String(i)) + "팀",
    기획: planGroup[i],
    마케팅: mktGroup[i],
    개발: devGroup[i],
    extra: [],
  }));

  const extras = pool.slice(numTeams * 2);
  extras.forEach((m, i) => {
    const availableRoles: Role[] = m.isDeveloper
      ? ["기획", "마케팅", "개발"]
      : ["기획", "마케팅"];
    const role = availableRoles[Math.floor(Math.random() * availableRoles.length)];
    teams[i % numTeams].extra.push({ member: m, role });
  });

  return { teams, unassigned: [] };
}
