import {describe,it,expect} from 'vitest'
import {apply,meets,newGame,validateStory,sceneSchema,stats,npcs} from './engine'
import {scenes,sceneMap,endings} from './story'

describe('Bộ máy truyện',()=>{
  it('tạo nhân vật theo xuất thân và giữ tên',()=>{const g=newGame('  Minh Châu ',1,2,0,2);expect(g.name).toBe('Minh Châu');expect(g.stats['ngân lượng']).toBe(150);expect(g.scene).toBe('c1_open')})
  it('kiểm tra dữ liệu của toàn bộ cảnh và các nhánh',()=>{expect(validateStory(scenes)).toEqual([]);for(const scene of scenes)expect(sceneSchema.safeParse(scene).success).toBe(true)})
  it('phát hiện cảnh thiếu, vòng lặp, cảnh không tiếp cận',()=>{expect(validateStory([{...scenes[0],next:'missing'}])).toContain('Cảnh không tồn tại: c1_open → missing');expect(validateStory([{...scenes[0],next:'c1_open'}])).toContain('Vòng lặp: c1_open')})
  it('điều kiện AND OR NOT và khóa lựa chọn',()=>{const g=newGame('Lan',0,0,0,0);expect(meets({type:'stat',key:'mưu lược',min:40},g)).toBe(true);expect(meets({type:'not',item:{type:'flag',key:'found',value:true}},g)).toBe(true);expect(meets({type:'or',items:[{type:'flag',key:'found',value:true},{type:'stat',key:'lễ nghi',min:40}]},g)).toBe(true);expect(meets({type:'and',items:[{type:'flag',key:'found',value:true},{type:'stat',key:'lễ nghi',min:40}]},g)).toBe(false)})
  it('cập nhật chỉ số, quan hệ và giới hạn giá trị',()=>{let g=newGame('Lan',0,0,0,0);g=apply(g,[{type:'stat',key:'ân sủng',amount:999},{type:'relation',npc:'lien',amount:-99},{type:'flag',key:'saved_lien'}]);expect(g.stats['ân sủng']).toBe(100);expect(g.relations.lien.affection).toBe(0);expect(g.flags.saved_lien).toBe(true)})
  it('kích hoạt thất bại khi sức khỏe về không',()=>{const g=apply(newGame('Lan',0,0,0,0),[{type:'stat',key:'sức khỏe',amount:-100}]);expect(g.ending).toBe('tragic')})
  it('mọi kết thúc có cảnh và hiệu ứng kích hoạt',()=>{for(const id of Object.keys(endings))expect(apply(newGame('Lan',0,0,0,0),sceneMap.get('e_'+id)!.effects).ending).toBe(id)})
  it('chuyển chương và lựa chọn có ảnh hưởng',()=>{expect(sceneMap.get('c2_open')!.chapter).toBe(2);expect(sceneMap.get('c5_decision')!.chapter).toBe(5);expect(scenes.filter(s=>s.choices).length).toBeGreaterThan(9);expect(stats).toHaveLength(8)})
  it('không còn ký tự chữ Hán trong dữ liệu hiển thị',()=>{for(const npc of Object.values(npcs))expect(npc.symbol).not.toMatch(/\p{Script=Han}/u);for(const ending of Object.values(endings))expect(ending.symbol).not.toMatch(/\p{Script=Han}/u)})
})
