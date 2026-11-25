/**
 * O que este arquivo faz: formata datas locais (YYYY-MM-DD) e traduz o número do nível para o título exibido ao aprendiz.
 * Quem usa: App.tsx, Header.tsx, HomeScreen.tsx, logic/gamification.ts e utils/auth.ts.
 */
// Por quê: usamos getFullYear/getMonth/getDate em vez de toISOString() para respeitar o fuso horário local do aluno
// e evitar que a virada do dia aconteça às 21h (horário de Brasília = 00h UTC).
export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayDateString = (): string => {
  return getLocalDateString(new Date());
};

export const getLevelTitle = (level: number): string => {
  if (level <= 1) return 'Lumi Aprendiz';
  if (level === 2) return 'Explorador de Sinais';
  if (level === 3) return 'Lumi Explorer';
  if (level === 4) return 'Mestre dos Cumprimentos';
  if (level === 5) return 'Guardião das Mãos';
  return 'Campeão de Libras';
};
