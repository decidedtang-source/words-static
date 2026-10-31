export const STAGES=['dictionary','memory','semanticConnection','syntax','concept','contrast','languageGame','englishNeighbors','pragmaticAction','workplaceUse'];
export function loadAnalysis(cardId,contentRevision,data){
 if(data?.schema!==1||!Object.hasOwn(data.entries||{},cardId))return null;
 const entry=data.entries[cardId];
 return entry.cardId===cardId&&entry.contentRevision===contentRevision?entry:null;
}
