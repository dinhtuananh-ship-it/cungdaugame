import { z } from 'zod'

export const stats = ['ân sủng','mưu lược','uy tín','lễ nghi','sức khỏe','danh vọng','ngân lượng','thế lực'] as const
export type Stat = typeof stats[number]
export type NpcId = 'hoangde'|'hoanghau'|'quyphi'|'hienphi'|'ducphi'|'thaihau'|'lien'|'tongquan'
export const npcs: Record<NpcId, { name:string; title:string; personality:string; goal:string; secret:string; symbol:string }> = {
  hoangde:{name:'Tiêu Cảnh Hành',title:'Hoàng đế',personality:'Thâm trầm, trọng người thật lòng',goal:'Giữ vững triều cục',secret:'Đang âm thầm tra vụ án năm xưa',symbol:'Đế'},
  hoanghau:{name:'Thẩm Ngọc Nghi',title:'Hoàng hậu',personality:'Điềm tĩnh, cứng rắn',goal:'Bảo vệ lục cung',secret:'Cất giữ nửa bản tấu mật',symbol:'Hậu'},
  quyphi:{name:'Lục Vân Chi',title:'Quý phi',personality:'Kiêu hãnh, quyết liệt',goal:'Giữ lấy vị thế của Lục gia',secret:'Bị gia tộc ép che giấu một tội lỗi',symbol:'Quý'},
  hienphi:{name:'Tô Nhược Lan',title:'Hiền phi',personality:'Dịu dàng, sắc sảo',goal:'Đưa người thân ra khỏi lao ngục',secret:'Là người cuối cùng thấy tấu mật',symbol:'Hiền'},
  ducphi:{name:'Đường Tĩnh Dao',title:'Đức phi',personality:'Khéo léo, thức thời',goal:'Xây mạng lưới đồng minh',secret:'Có liên hệ với thương hội ngoài cung',symbol:'Đức'},
  thaihau:{name:'Từ Thái hậu',title:'Thái hậu',personality:'Uy nghiêm, đa nghi',goal:'Bảo vệ hoàng tộc',secret:'Biết ai đã sửa chiếu chỉ',symbol:'Thái'},
  lien:{name:'A Liên',title:'Cung nữ',personality:'Chân thành, gan dạ',goal:'Tìm lại em trai mất tích',secret:'Từng thấy người lạ vào kho đêm',symbol:'Liên'},
  tongquan:{name:'Phúc An',title:'Tổng quản thái giám',personality:'Kín kẽ, tinh tường',goal:'Sống sót qua các đời chủ',secret:'Giữ chìa khóa kho hồ sơ cũ',symbol:'Phúc'},
}
export const ranks = ['Tú nữ','Đáp ứng','Thường tại','Quý nhân','Tần','Phi','Quý phi','Hoàng quý phi','Hoàng hậu'] as const
export const origins = [
  {name:'Con gái quan văn', description:'Lớn lên giữa sách vở và lễ pháp.',bonus:{'mưu lược':10,'lễ nghi':10}},
  {name:'Con gái võ quan', description:'Được dạy phải đứng thẳng trước sóng gió.',bonus:{'sức khỏe':10,'uy tín':10}},
  {name:'Gia đình thương nhân', description:'Am hiểu lòng người và giá trị của một lời hứa.',bonus:{'ngân lượng':100,'uy tín':10}},
  {name:'Gia đình sa sút', description:'Đã biết thế nào là mất tất cả.',bonus:{'mưu lược':10,'thế lực':5}},
  {name:'Thường dân đặc cách', description:'Không có chỗ dựa, nhưng chẳng nợ ai điều gì.',bonus:{'sức khỏe':10,'danh vọng':10}},
] satisfies {name:string;description:string;bonus:Partial<Record<Stat,number>>}[]

export const conditionSchema: z.ZodType<Condition> = z.lazy(() => z.discriminatedUnion('type', [
  z.object({type:z.literal('stat'),key:z.enum(stats),min:z.number()}),
  z.object({type:z.literal('relation'),npc:z.enum(Object.keys(npcs) as [NpcId,...NpcId[]]),min:z.number()}),
  z.object({type:z.literal('flag'),key:z.string(),value:z.boolean().default(true)}),
  z.object({type:z.literal('and'),items:z.array(conditionSchema)}),
  z.object({type:z.literal('or'),items:z.array(conditionSchema)}),
  z.object({type:z.literal('not'),item:conditionSchema}),
]))
export type Condition = {type:'stat';key:Stat;min:number}|{type:'relation';npc:NpcId;min:number}|{type:'flag';key:string;value:boolean}|{type:'and'|'or';items:Condition[]}|{type:'not';item:Condition}
export type Effect = {type:'stat';key:Stat;amount:number}|{type:'relation';npc:NpcId;amount:number;trust?:number}|{type:'flag';key:string;value?:boolean}|{type:'rank';level:number}|{type:'ending';id:string}
const effectSchema = z.discriminatedUnion('type',[
  z.object({type:z.literal('stat'),key:z.enum(stats),amount:z.number()}),
  z.object({type:z.literal('relation'),npc:z.enum(Object.keys(npcs) as [NpcId,...NpcId[]]),amount:z.number(),trust:z.number().optional()}),
  z.object({type:z.literal('flag'),key:z.string(),value:z.boolean().optional()}),
  z.object({type:z.literal('rank'),level:z.number().int().min(0).max(8)}),
  z.object({type:z.literal('ending'),id:z.string()}),
])
export const sceneSchema = z.object({id:z.string(),chapter:z.number().int().min(1).max(5),place:z.string(),background:z.string(),speaker:z.string(),npc:z.enum(Object.keys(npcs) as [NpcId,...NpcId[]]).optional(),emotion:z.string().optional(),text:z.string(),next:z.string().optional(),condition:conditionSchema.optional(),effects:z.array(effectSchema).optional(),choices:z.array(z.object({text:z.string(),next:z.string(),condition:conditionSchema.optional(),locked:z.string().optional(),effects:z.array(effectSchema).optional()})).optional()})
export type Scene = z.infer<typeof sceneSchema>
export interface Game { name:string; portrait:number; hair:number; outfit:number; origin:number; scene:string; stats:Record<Stat,number>; relations:Record<NpcId,{affection:number;trust:number}>; flags:Record<string,boolean>; history:string[]; ending?:string; rank:number; created:number }
export const chapterNames = ['','Tuyển Tú Nhập Cung','Sóng Ngầm Hậu Cung','Dạ Yến Tranh Sủng','Bí Mật Dưới Ánh Trăng','Phượng Hoàng Trỗi Dậy']
export function newGame(name:string, portrait=0, hair=0, outfit=0, origin=4):Game {
  const values = Object.fromEntries(stats.map(s=>[s,s==='sức khỏe'?70:s==='ngân lượng'?50:30])) as Record<Stat,number>
  const safeOrigin=origins[origin]?origin:4
  for(const [key,value] of Object.entries(origins[safeOrigin].bonus)) values[key as Stat]+=value
  return {name:name.trim()||'Ngọc Nhi',portrait,hair,outfit,origin:safeOrigin,scene:'c1_open',stats:values,relations:Object.fromEntries(Object.keys(npcs).map(id=>[id,{affection:30,trust:25}])) as Game['relations'],flags:{},history:[],rank:0,created:Date.now()}
}
export function meets(c:Condition|undefined,g:Game):boolean {
  if(!c)return true
  switch(c.type){case 'stat':return g.stats[c.key]>=c.min;case 'relation':return g.relations[c.npc].affection>=c.min;case 'flag':return !!g.flags[c.key]===c.value;case 'and':return c.items.every(x=>meets(x,g));case 'or':return c.items.some(x=>meets(x,g));case 'not':return !meets(c.item,g)}
}
const clamp=(n:number,max=100)=>Math.max(0,Math.min(max,n))
export function apply(g:Game,effects:Effect[]=[]):Game {
  const n:Game=structuredClone(g)
  for(const e of effects){switch(e.type){case 'stat':n.stats[e.key]=clamp(n.stats[e.key]+e.amount,e.key==='ngân lượng'?999:100);break;case 'relation':n.relations[e.npc].affection=clamp(n.relations[e.npc].affection+e.amount);n.relations[e.npc].trust=clamp(n.relations[e.npc].trust+(e.trust??e.amount));break;case 'flag':n.flags[e.key]=e.value??true;break;case 'rank':n.rank=Math.max(n.rank,e.level);break;case 'ending':n.ending=e.id}}
  if(n.stats['sức khỏe']<=0)n.ending='tragic'
  return n
}
export function validateStory(scenes:Scene[],start='c1_open'):string[] {
  const errors:string[]=[],map=new Map<string,Scene>()
  for(const raw of scenes){const r=sceneSchema.safeParse(raw);if(!r.success)errors.push(`Dữ liệu cảnh không hợp lệ: ${raw.id}`);if(map.has(raw.id))errors.push(`Trùng cảnh: ${raw.id}`);map.set(raw.id,raw)}
  for(const s of scenes){if(s.npc&&!npcs[s.npc])errors.push(`Thiếu NPC: ${s.id}`);for(const target of [s.next,...(s.choices||[]).map(c=>c.next)].filter(Boolean)){if(!map.has(target!))errors.push(`Cảnh không tồn tại: ${s.id} → ${target}`)}if(!s.next&&!s.choices?.length&&!s.effects?.some(e=>e.type==='ending'))errors.push(`Ngõ cụt: ${s.id}`)}
  const visited=new Set<string>(),stack=new Set<string>()
  function walk(id:string){if(stack.has(id)){errors.push(`Vòng lặp: ${id}`);return}if(visited.has(id))return;const s=map.get(id);if(!s)return;visited.add(id);stack.add(id);for(const t of [s.next,...(s.choices||[]).map(c=>c.next)].filter(Boolean))walk(t!);stack.delete(id)}
  walk(start);for(const s of scenes)if(!visited.has(s.id))errors.push(`Không thể tiếp cận: ${s.id}`)
  return errors
}
