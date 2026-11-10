import {create} from 'zustand'
import {openDB} from 'idb'
import {apply,meets,newGame,type Game} from './engine'
import {sceneMap} from './story'

type Slot='auto'|'1'|'2'|'3'
export interface Save {game:Game;date:number}
const db=()=>openDB('phuong-menh',1,{upgrade(database){database.createObjectStore('saves');database.createObjectStore('endings')}})
export async function saveSlot(slot:Slot,game:Game){const database=await db();await database.put('saves',{game:structuredClone(game),date:Date.now()},slot)}
export async function loadSlot(slot:Slot):Promise<Save|undefined>{return (await db()).get('saves',slot)}
export async function allSlots(){const database=await db();return Object.fromEntries(await Promise.all((['auto','1','2','3'] as Slot[]).map(async slot=>[slot,await database.get('saves',slot)]))) as Record<Slot,Save|undefined>}
export async function unlockedEndings():Promise<string[]>{return (await db()).getAllKeys('endings') as Promise<string[]>}
interface State {game:Game|null;ready:boolean;library:string[];start:(name:string,portrait:number,hair:number,outfit:number,origin:number)=>Promise<void>;restore:(slot:Slot)=>Promise<boolean>;init:()=>Promise<void>;advance:(choice?:number)=>Promise<void>;manualSave:(slot:Slot)=>Promise<void>}
export const useGame=create<State>((set,get)=>({game:null,ready:false,library:[],
  init:async()=>{try{const [save,library]=await Promise.all([loadSlot('auto'),unlockedEndings()]);set({game:save?.game??null,library,ready:true})}catch{set({ready:true})}},
  start:async(name,portrait,hair,outfit,origin)=>{const game=newGame(name,portrait,hair,outfit,origin);set({game});await saveSlot('auto',game)},
  restore:async(slot)=>{const saved=await loadSlot(slot);if(!saved)return false;set({game:saved.game});await saveSlot('auto',saved.game);return true},
  manualSave:async(slot)=>{const {game}=get();if(game)await saveSlot(slot,game)},
  advance:async(choiceIndex)=>{const {game}=get();if(!game||game.ending)return;const scene=sceneMap.get(game.scene);if(!scene)return;
    const choice=choiceIndex===undefined?undefined:scene.choices?.[choiceIndex];if(scene.choices?.length&&(!choice||!meets(choice.condition,game)))return;
    const target=choice?.next??scene.next;if(!target||!sceneMap.has(target))return;
    let next=apply(game,[...(choice?.effects??[]),...(scene.effects??[])]);
    next.history=[...next.history,choice?`${scene.place}: ${choice.text}`:`${scene.place}: ${scene.text.slice(0,70)}…`].slice(-90)
    next.scene=target;
    const arrived=sceneMap.get(target)!;
    if(arrived.effects?.some(effect=>effect.type==='ending'))next=apply(next,arrived.effects);
    set({game:next});
    await saveSlot('auto',next);
    if(next.ending){await (await db()).put('endings',Date.now(),next.ending);set({library:await unlockedEndings()})}
  },
}))
