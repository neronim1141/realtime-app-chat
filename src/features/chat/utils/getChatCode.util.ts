export const getChatCode = (id1: string, id2: string) =>
  [id1, id2].sort().join("--");