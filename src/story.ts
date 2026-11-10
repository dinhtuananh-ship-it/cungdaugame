import type {Scene,Effect,Condition} from './engine'
const stat=(key:Extract<Effect,{type:'stat'}>['key'],amount:number):Effect=>({type:'stat',key,amount})
const rel=(npc:Extract<Effect,{type:'relation'}>['npc'],amount:number):Effect=>({type:'relation',npc,amount})
const flag=(key:string):Effect=>({type:'flag',key})
const needs=(key:Extract<Effect,{type:'stat'}>['key'],min:number):Condition=>({type:'stat',key,min})
const has=(key:string):Condition=>({type:'flag',key,value:true})
export const endings:Record<string,{title:string;subtitle:string;description:string;symbol:string}>={
  empress:{title:'Phượng Nghi Thiên Hạ',subtitle:'Thiên hạ cúi đầu, lòng người vẫn sáng',description:'Nàng nhận phượng ấn trước bá quan, nhưng giữ lời hứa không để quyền lực biến mình thành kẻ từng muốn lật đổ.',symbol:'Phượng'},
  beloved:{title:'Sủng Phi Một Đời',subtitle:'Một đời tri kỷ giữa chốn thâm cung',description:'Nàng chọn tin vào trái tim thay vì ngai vị. Bên cạnh đế vương, nàng có được thứ mà mọi chiếu thư đều không thể ban: sự thấu hiểu.',symbol:'Tình'},
  power:{title:'Quyền Khuynh Lục Cung',subtitle:'Người cầm cờ sau bức rèm son',description:'Không cần phượng ấn, nàng nắm chìa khóa của lục cung. Những lời thì thầm từ nay đều phải đi qua tay nàng.',symbol:'Quyền'},
  freedom:{title:'Xuất Cung Tự Do',subtitle:'Trời rộng hơn bốn bức tường son',description:'Nàng bỏ lại áo gấm và những cuộc tranh đoạt. Ngoài cổng cung, lần đầu tiên gió thổi mà không mang theo mệnh lệnh.',symbol:'Tự do'},
  lonely:{title:'Lãnh Cung Cô Độc',subtitle:'Khi niềm tin hóa thành tro tàn',description:'Không một ai đứng ra làm chứng. Cửa lãnh cung khép lại, để nàng học cách sống cùng cái giá của những lựa chọn đã qua.',symbol:'Cô độc'},
  tragic:{title:'Hồng Nhan Bạc Mệnh',subtitle:'Một cánh hoa rơi giữa bão cung đình',description:'Bí mật chưa kịp phơi bày thì ngọn đèn đã tắt. Tên nàng còn trong cuốn sổ cũ, và trong lòng những ai từng được nàng cứu.',symbol:'Bạc mệnh'},
}
const s=(id:string,chapter:number,place:string,background:string,speaker:string,text:string,other:Partial<Scene>={}):Scene=>({id,chapter,place,background,speaker,text,...other})
export const scenes:Scene[]=[
  s('c1_open',1,'Cổng Tuyên Đức','gate','Dẫn truyện','Ba năm một lần, cổng son lại mở. Từ hôm nay, tên của nàng sẽ được ghi vào sổ tuyển tú — hoặc chìm giữa muôn ngàn cái tên không ai nhớ.',{next:'c1_test'}),
  s('c1_test',1,'Đại điện tuyển tú','hall','Thái hậu','Ngẩng đầu lên. Giữa lễ nghi và lòng can đảm, ngươi muốn trẫm nhìn thấy điều gì?',{npc:'thaihau',choices:[
    {text:'Hành lễ đúng phép, không sai một phân.',next:'c1_queen',effects:[stat('lễ nghi',12),rel('thaihau',8),flag('first_grace')]},
    {text:'Nhìn thẳng, nói về ước nguyện của mình.',next:'c1_queen',effects:[stat('uy tín',10),rel('hoangde',8),flag('first_courage')]},
    {text:'Dẫn một câu cổ thư để đáp lời.',next:'c1_queen',condition:needs('mưu lược',40),locked:'Cần Mưu lược từ 40',effects:[stat('danh vọng',12),rel('hoanghau',10),flag('first_wit')]},
  ]}),
  s('c1_queen',1,'Hành lang phượng điện','corridor','Hoàng hậu','Một bước sai trong cung, không phải chỉ mình ngươi chịu tội. Hãy nhớ điều đó.',{npc:'hoanghau',next:'c1_rival'}),
  s('c1_rival',1,'Hành lang phượng điện','corridor','Quý phi','Một tú nữ mới mà cũng dám đứng chắn đường bổn cung? Ngươi nghĩ mình có chỗ dựa sao?',{npc:'quyphi',choices:[
    {text:'Cúi người nhường lối, giữ thể diện cho cả hai.',next:'c1_close',effects:[stat('lễ nghi',6),rel('quyphi',6),flag('rival_peace')]},
    {text:'Bình tĩnh đáp: “Đường rộng, lòng người nên rộng.”',next:'c1_close',effects:[stat('uy tín',10),rel('quyphi',-15),flag('rival_enemy')]},
    {text:'Xin Hoàng hậu phân xử ngay tại chỗ.',next:'c1_close',condition:{type:'relation',npc:'hoanghau',min:40},locked:'Cần thiện cảm Hoàng hậu từ 40',effects:[rel('hoanghau',8),rel('quyphi',-10)]},
  ]}),
  s('c1_close',1,'Tẩm phòng tân tú','room','Dẫn truyện','Một chiếc giường gỗ, một ô cửa nhỏ. Đêm đầu tiên trong cung yên tĩnh đến mức nàng nghe rõ tiếng khóa cửa ngoài hành lang.',{next:'c2_open',effects:[{type:'rank',level:1}]}),
  s('c2_open',2,'Tẩm phòng tân tú','room','A Liên','Tiểu chủ, nô tỳ là A Liên. Hôm qua có người bảo đừng tới hầu người... nhưng nô tỳ nghĩ một người mới không nên ở đây một mình.',{npc:'lien',choices:[
    {text:'Mời A Liên ngồi, hỏi về gia đình cô ấy.',next:'c2_missing',effects:[rel('lien',20),flag('saved_lien'),stat('uy tín',5)]},
    {text:'Giữ khoảng cách, chỉ giao việc cần làm.',next:'c2_missing',effects:[rel('lien',-8),stat('mưu lược',5)]},
  ]}),
  s('c2_missing',2,'Kho trang sức','garden','Phúc An','Trâm ngọc của Quý phi biến mất. Có người thấy tiểu chủ gần kho vào giờ tý. Xin người cho lão nô một lời giải thích.',{npc:'tongquan',choices:[
    {text:'Nhờ A Liên nhớ lại người ra vào kho.',next:'c2_witness',condition:has('saved_lien'),locked:'A Liên chưa đủ tin tưởng nàng',effects:[rel('lien',8),flag('witness')]},
    {text:'Tìm dấu sáp niêm phong còn sót trên cửa.',next:'c2_clue',condition:needs('mưu lược',40),locked:'Cần Mưu lược từ 40',effects:[flag('evidence'),stat('mưu lược',7)]},
    {text:'Dùng ngân lượng để mua thêm thời gian.',next:'c2_delay',condition:needs('ngân lượng',60),locked:'Cần Ngân lượng từ 60',effects:[stat('ngân lượng',-50),rel('tongquan',8)]},
    {text:'Nhận lỗi vì đã đi ngang qua kho.',next:'c2_accused',effects:[stat('uy tín',-15),stat('sức khỏe',-8),flag('accused')]},
  ]}),
  s('c2_witness',2,'Kho trang sức','garden','A Liên','Nô tỳ đã thấy bóng người mặc áo xanh của Hiền phi. Nhưng tiểu chủ... xin đừng đưa nô tỳ ra trước điện.',{npc:'lien',next:'c2_truth'}),
  s('c2_clue',2,'Kho trang sức','garden','Dẫn truyện','Dưới bản lề còn một dấu sáp xanh. Người niêm phong kho không hề dùng loại sáp này. Có ai đó đã mở cửa sau khi trâm bị cất đi.',{next:'c2_truth'}),
  s('c2_delay',2,'Hành lang cung cấm','corridor','Phúc An','Lão nô cho người một canh giờ. Hỏi nhỏ thôi: đêm qua có người từ Trường Xuân cung đến kho.',{npc:'tongquan',next:'c2_truth',effects:[flag('evidence')]}),
  s('c2_accused',2,'Điện nghị sự','hall','Quý phi','Chỉ một lời thú nhận nửa vời mà muốn được tha? Bổn cung sẽ nhớ mặt ngươi.',{npc:'quyphi',next:'c2_result'}),
  s('c2_truth',2,'Điện nghị sự','hall','Hiền phi','Trâm được tìm thấy trong rương vải của cung nữ. Không phải của nàng ta. Ta chỉ mong người đừng đào sâu nữa.',{npc:'hienphi',choices:[
    {text:'Giữ kín tên A Liên, trình chứng cứ lên Hoàng hậu.',next:'c2_result',effects:[rel('hoanghau',14),rel('lien',12),flag('queen_ally'),stat('uy tín',10)]},
    {text:'Đổi sự im lặng lấy lời hứa của Hiền phi.',next:'c2_result',effects:[rel('hienphi',18),flag('hien_deal'),stat('thế lực',12)]},
    {text:'Công khai tất cả, kể cả lời của A Liên.',next:'c2_result',effects:[stat('danh vọng',15),rel('lien',-22),flag('betrayed_lien')]},
  ]}),
  s('c2_result',2,'Ngự hoa viên','garden','Dẫn truyện','Vụ trâm ngọc khép lại trên giấy, nhưng ánh mắt người trong cung đã đổi khác. Bằng lòng tin vừa giành được, nàng được ghi tên vào hàng Thường tại.',{next:'c3_open',effects:[{type:'rank',level:2}]}),
  s('c3_open',3,'Tẩm phòng tân tú','room','Đức phi','Đêm nay có dạ yến. Áo đẹp không che được ánh mắt, nhưng có thể khiến người ta chịu nhìn vào mắt nàng.',{npc:'ducphi',choices:[
    {text:'Chọn áo lụa đỏ rực, bước ra giữa yến tiệc.',next:'c3_banquet',effects:[stat('ân sủng',13),rel('quyphi',-12),flag('red_dress')]},
    {text:'Chọn áo xanh ngọc nhã nhặn, ngồi cạnh Hoàng hậu.',next:'c3_banquet',effects:[rel('hoanghau',12),stat('lễ nghi',8),flag('jade_dress')]},
    {text:'Mặc áo cũ, dành bạc giúp cung nữ bệnh.',next:'c3_banquet',effects:[stat('uy tín',12),rel('lien',12),flag('kind_dress')]},
  ]}),
  s('c3_banquet',3,'Dạ yến điện','banquet','Hoàng đế','Trẫm nghe nói nàng đã tự giải được vụ trâm ngọc. Nếu hôm nay trẫm hỏi nàng muốn gì, nàng sẽ nói thật chứ?',{npc:'hoangde',choices:[
    {text:'“Thần thiếp chỉ mong bệ hạ được bình an.”',next:'c3_rival',effects:[rel('hoangde',18),stat('ân sủng',17),flag('emperor_close')]},
    {text:'“Thần thiếp muốn công đạo cho người vô tội.”',next:'c3_rival',effects:[rel('hoangde',10),stat('uy tín',12),flag('justice')]},
    {text:'“Một ngày, thần thiếp muốn tự quyết số phận mình.”',next:'c3_rival',effects:[stat('mưu lược',12),rel('ducphi',10),flag('freedom_seed')]},
  ]}),
  s('c3_rival',3,'Dạ yến điện','banquet','Quý phi','Lời hay lắm. Nhưng trước điện rồng, lời nói cũng cần người bảo chứng. Ngươi dám đặt cược sao?',{npc:'quyphi',choices:[
    {text:'Nâng chén hòa giải, không để nàng mất mặt.',next:'c3_promotion',effects:[rel('quyphi',15),stat('uy tín',7),flag('rival_truce')]},
    {text:'Đáp lại bằng một bài thơ về ngọc vỡ.',next:'c3_promotion',condition:needs('lễ nghi',40),locked:'Cần Lễ nghi từ 40',effects:[stat('danh vọng',15),rel('hoangde',8)]},
    {text:'Im lặng, để ánh mắt nói thay.',next:'c3_promotion',effects:[stat('mưu lược',7),rel('quyphi',-8)]},
  ]}),
  s('c3_promotion',3,'Dạ yến điện','banquet','Phúc An','Có chỉ của bệ hạ: người được sắc phong Quý nhân. Trong điện vang tiếng chúc tụng, ngoài hiên một bóng người lặng lẽ quay đi.',{npc:'tongquan',next:'c4_open',effects:[{type:'rank',level:3},stat('ân sủng',10)]}),
  s('c4_open',4,'Ngự hoa viên','garden','A Liên','Tiểu chủ, nô tỳ nhặt được trang tấu rách dưới gốc mai. Có tên một vị quan bị xử oan — lại trùng với người nhà Hiền phi.',{npc:'lien',next:'c4_secret'}),
  s('c4_secret',4,'Thư khố dưới trăng','archive','Dẫn truyện','Dưới ánh trăng, nét mực trên tờ tấu hiện ra: có người đã sửa chiếu chỉ. Nếu lật lại án cũ, cả Lục gia lẫn hoàng thất đều không thể đứng ngoài.',{choices:[
    {text:'Tin Hoàng hậu, trao bản tấu cho nàng.',next:'c4_queen',condition:{type:'relation',npc:'hoanghau',min:35},locked:'Cần thiện cảm Hoàng hậu từ 35',effects:[flag('queen_evidence'),rel('hoanghau',15)]},
    {text:'Nhờ Phúc An mở kho hồ sơ để tự đối chứng.',next:'c4_archive',condition:needs('mưu lược',45),locked:'Cần Mưu lược từ 45',effects:[flag('solid_evidence'),stat('mưu lược',8)]},
    {text:'Báo trước cho Quý phi, đổi lấy một thỏa thuận.',next:'c4_rival',effects:[flag('rival_deal'),rel('quyphi',18),stat('thế lực',15)]},
    {text:'Giấu bản tấu, chuẩn bị đường rời cung.',next:'c4_hide',effects:[flag('escape_plan'),stat('ngân lượng',20)]},
  ]}),
  s('c4_queen',4,'Phượng điện','hall','Hoàng hậu','Ta đã giữ nửa còn lại suốt bảy năm. Không phải vì sợ chết, mà vì sợ người vô tội lại phải chết thay.',{npc:'hoanghau',next:'c4_aftermath',effects:[flag('solid_evidence'),stat('uy tín',10)]}),
  s('c4_archive',4,'Thư khố dưới trăng','archive','Phúc An','Lão nô mở cửa này vì tin người sẽ đọc hết hồ sơ, cả những trang có thể khiến người đổi ý.',{npc:'tongquan',next:'c4_aftermath',effects:[rel('tongquan',15),stat('thế lực',10)]}),
  s('c4_rival',4,'Trường Xuân cung','corridor','Quý phi','Lục gia có tội, nhưng không phải tất cả người họ Lục đều đáng chết. Ta giúp nàng — miễn nàng nhớ lời.',{npc:'quyphi',next:'c4_aftermath',effects:[flag('solid_evidence'),rel('quyphi',8)]}),
  s('c4_hide',4,'Tẩm phòng','room','Dẫn truyện','Nàng giấu trang tấu trong đường may áo. Có những sự thật không cần được công bố ngay mới có thể cứu người.',{next:'c4_aftermath'}),
  s('c4_aftermath',4,'Hành lang trăng','corridor','Hiền phi','Đêm nay sẽ có người hỏi nàng về lá tấu. Đừng tin mọi gương mặt dịu dàng, kể cả ta.',{npc:'hienphi',effects:[{type:'rank',level:4}],choices:[
    {text:'Giúp Hiền phi cứu người thân trước khi đối chất.',next:'c5_open',effects:[rel('hienphi',20),flag('hien_saved'),stat('uy tín',8)]},
    {text:'Buộc nàng khai tên người sửa chiếu chỉ.',next:'c5_open',effects:[flag('confession'),rel('hienphi',-15),stat('mưu lược',8)]},
    {text:'Lặng lẽ rời đi, giữ bí mật cho riêng mình.',next:'c5_open',effects:[stat('thế lực',8),flag('kept_secret')]},
  ]}),
  s('c5_open',5,'Đại điện','hall','Thái hậu','Hôm nay trước mặt bá quan, chuyện cũ phải có hồi kết. Ngươi đã đi xa hơn bất kỳ tú nữ nào năm ấy. Nói đi.',{npc:'thaihau',next:'c5_decision',effects:[{type:'rank',level:5}]}),
  s('c5_decision',5,'Đại điện','hall','Dẫn truyện','Trong tay nàng là vận mệnh của những người từng yêu thương, nghi kỵ và phản bội mình. Lần này, không ai có thể chọn thay nàng.',{choices:[
    {text:'Công bố chứng cứ, cùng Hoàng hậu sửa lại án cũ.',next:'e_empress',condition:{type:'and',items:[has('solid_evidence'),{type:'relation',npc:'hoanghau',min:50},needs('uy tín',45)]},locked:'Cần chứng cứ, Uy tín 45 và thiện cảm Hoàng hậu 50',effects:[stat('danh vọng',20)]},
    {text:'Trao chứng cứ cho Hoàng đế, chọn ở lại bên người.',next:'e_beloved',condition:{type:'and',items:[has('solid_evidence'),{type:'relation',npc:'hoangde',min:45}]},locked:'Cần chứng cứ và thiện cảm Hoàng đế 45',effects:[stat('ân sủng',20)]},
    {text:'Giữ bí mật để bảo vệ các phe, tự nắm quyền điều đình.',next:'e_power',condition:{type:'and',items:[has('solid_evidence'),needs('thế lực',35)]},locked:'Cần chứng cứ và Thế lực 35',effects:[stat('thế lực',20)]},
    {text:'Đổi bản tấu lấy chiếu chỉ xuất cung.',next:'e_freedom',condition:{type:'or',items:[has('escape_plan'),has('freedom_seed'),has('solid_evidence')]},locked:'Cần chuẩn bị đường lui hoặc nắm giữ bí mật',effects:[flag('left_palace')]},
    {text:'Thú nhận đã che giấu sự thật để bảo vệ người mình quý.',next:'e_lonely',effects:[stat('ân sủng',-30),stat('uy tín',-20)]},
    {text:'Một mình xông vào điện, tố cáo tất cả khi chưa có hậu thuẫn.',next:'e_tragic',effects:[stat('sức khỏe',-100)]},
  ]}),
  ...Object.entries(endings).map(([id,ending])=>s(`e_${id}`,5,'Hồi kết','ending','Dẫn truyện',ending.description,{effects:[...(id==='empress'?[{type:'rank' as const,level:8}]:id==='beloved'?[{type:'rank' as const,level:7}]:id==='power'?[{type:'rank' as const,level:6}]:[]),{type:'ending',id}]})),
]
export const sceneMap=new Map(scenes.map(scene=>[scene.id,scene]))
