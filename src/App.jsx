import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, HeartPulse, Sparkles, Search, 
  Fingerprint, ClipboardList, RefreshCw, 
  Calendar, Moon, Sun, User, Star, Lock, BookOpen, X, TrendingUp, DollarSign, Zap, AlertTriangle, ArrowLeft, Info, Book, ChevronRight, Shirt, Trophy, ShieldAlert, Activity, Coffee, Gavel, Stethoscope, Briefcase, Share2, Copy, Check, Target, Lightbulb
} from 'lucide-react';

// ============================================================================
// 🌟 1. 全域資料庫 (完整數據庫，不縮減)
// ============================================================================

const SUPABASE_URL = 'https://iexqzqqmiqnblribrfzz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Hhqze1k_--7-30i1Umfw6A_5rIa93Cp';

const THEME_DEFAULTS = {
  innate: { icon: Sparkles, label: "先天盤" },
  yearly: { icon: Calendar, label: "流年" },
  monthly: { icon: Moon, label: "流月" },
  daily: { icon: Sun, label: "流日" }
};

const ELEMENT_THEMES = {
  "木": { primary: "#2E7D32", accent: "#E8F5E9", bg: "linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%)", text: "#1B5E20", label: "木 (森林綠)" },
  "火": { primary: "#D84315", accent: "#FBE9E7", bg: "linear-gradient(135deg, #fff5f2 0%, #fbe9e7 100%)", text: "#BF360C", label: "火 (暖陽紅)" },
  "土": { primary: "#5D4037", accent: "#EFEBE9", bg: "linear-gradient(135deg, #f7f3f1 0%, #efebe9 100%)", text: "#3E2723", label: "土 (大地色)" },
  "金": { primary: "#455A64", accent: "#FAFAFA", bg: "linear-gradient(135deg, #f8f9f9 0%, #fafafa 100%)", text: "#263238", label: "金 (灰藍色)" },
  "水": { primary: "#1565C0", accent: "#E3F2FD", bg: "linear-gradient(135deg, #f2f8ff 0%, #e3f2fd 100%)", text: "#0D47A1", label: "水 (深海藍)" }
};

const JOINT_CODES_DB = {
  // 1-Series
  "112": { title: "外交官/中介", pos: "非常有自信地與人溝通，具備出色的表達能力，能利用溝通成就自己。", neg: "過度自我，產生猶豫不決，性格強勢，自主意識強不願聽從建議，婚姻易波折。", advice: "精神分裂、自閉、上呼吸道、便秘、痔瘡、肺病、腫瘤。建議晚婚，多讀書或進入修行突破。" },
  "123": { title: "演說家/講師", pos: "自信且直覺力強，說話直接坦白，具說服力，懂得察言觀色。", neg: "說話不經大腦，容易禍從口出，滔滔不絕卻抓不住重點，容易被小人背後中傷。", advice: "注意咽喉部保養。建議先學會做人再做事，管理好口才特長。" },
  "134": { title: "功德號/創意策劃", pos: "有創意、多才多藝，記憶力好，積極自信地規劃生活。", neg: "內心脆弱、依賴性強、愛抱怨、鑽牛角尖，做事易半途而廢。", advice: "心理上容易有受害者心態。建議讓內心強大起來，需要身邊人的讚美與鼓勵。" },
  "145": { title: "專業領導/策劃天才", pos: "性格獨立穩重，精明地精打細算，擅長製作完美計劃，有遠見。", neg: "容易半途而廢，自以為是，缺乏積極行動的勇氣，計劃永遠是計劃。", advice: "心理上容易保守。建議與人合作，尋求有行動力的人協助。" },
  "156": { title: "五湖四海/外地求財", pos: "有原則，堅持自我，有事業心，適合到外地發展，越遠越好。", neg: "固執、自傲、大男子/大女子主義，若待在原地容易沉迷不良嗜好。", advice: "情緒上剛強不認輸。建議多走出去，出國或外地發展事業會更好。" },
  "167": { title: "白手起家/貴人吸引", pos: "獨立且有智慧，直覺敏銳，能用智慧吸引貴人幫助事業。", neg: "容易為了取悅對方而不顧一切付出，愛慕虛榮，容易重頭再來。", advice: "心理上較奢侈。建議學會看清誰是真正的朋友，不要盲目揮霍。" },
  "178": { title: "領袖特質/錢權交換", pos: "有領導魅力，堅強獨立，善於洞察人心，能幫助別人拿到權利。", neg: "壓力大、愛面子，容易背黑鍋，借出的錢很難收回來，容易自尋煩惱。", advice: "建議夫妻年齡差距大一些，或者搭乘飛機轉運。" },
  "189": { title: "完美主義/親力親為", pos: "負責任、樂於助人、可靠，看見不合理的事會有正義感。", neg: "計較得失，壓力極大，不輕信他人導致凡事都要自己做。", advice: "心腦血管急病、婦科、乳腺問題。建議學會釋放壓力，不要過度挑剔。" },
  "191": { title: "天生領導者/孤獨者", pos: "做事親力親為，靠個人能力達到事業成就，充滿神秘感。", neg: "控制慾強，內心極度不安全感，容易忽冷忽熱，婚姻易失敗。", advice: "容易有多次婚姻。建議將控制慾轉化為自我探索，學會授權與合作。" },

  // 2-Series
  "213": { title: "講師號/權力號", pos: "講話有權威感與說服力，很有領導風範，懂得察言觀色。", neg: "說話帶著命令口氣，太直接容易傷人，控制慾強，不習慣說「請」。", advice: "建議多站上講台，將口才轉化為事業動力。" },
  "224": { title: "服務型/協調者", pos: "溝通協調能力強，細心沉穩，適合滔滔不絕的銷售與服務業。", neg: "說話沒重點，無法守住秘密，愛說別人壞話，容易產生口舌是非。", advice: "心理上極需安全感。建議學會講重點，避免對伴侶過度嘮叨。" },
  "235": { title: "溝通高手/應變者", pos: "有技巧、聰明，凡事都能化解，對處理突發問題有驚人天賦。", neg: "說話帶攻擊性，容易衝動說死話，甚至可能為了圓謊而變得不誠實。", advice: "脾氣不好，容易傷人。建議說話前三思，把能力發揮在銷售。" },
  "246": { title: "銷售高手/智慧型", pos: "言談舉止顯露智慧，善於邊溝通邊策劃，能達成高成交率。", neg: "想太多而猶豫不決，容易為了金錢利益而溝通，有時過於精打細算。", advice: "擁有很強的第六感。建議加強行動力（3）與認同（9），否則容易流於空談。" },
  "257": { title: "高等貴人/原則者", pos: "做事細膩、有原則，有一說一，吸引高層次的貴人幫助。", neg: "說話固執、不中聽，容易趕走貴人，每件事都要尋根問底。", advice: "若為小孩，吃軟不吃硬。建議改善說話方式，多接納他人建議。" },
  "268": { title: "財富壓力/服務業", pos: "穩定人心的力量，溫和穩重，富有責任感，能靠口才賺錢。", neg: "一提錢就有壓力，不懂得拒絕他人借錢的要求，易開空口支票。", advice: "容易產生心理負擔。建議不要隨便承諾跟錢有關的事情。" },
  "279": { title: "桃花號/貴人號", pos: "隨和、有愛心、受歡迎，有異性貴人相助，有號召力。", neg: "猶豫不決、依賴性強，在感情中容易出現小桃花或多角關係。", advice: "女性注意子宮與腎功能疾病。男性適合從事與女性相關的事業。" },
  "281": { title: "大單高手/銷售冠軍", pos: "出色溝通能力，能自信地轉變事情，能承擔重壓完成任務。", neg: "水火相衝，脾氣很大且暴躁，內心掙扎，說得多讓自己感到壓力。", advice: "內心容易孤獨。建議控制情緒，不要將壓力留給自己。" },
  "292": { title: "軍師號/資源整合", pos: "特強溝通分析能力，能啟發他人，適合投資、產業等商業談判。", neg: "光說不做，機會來臨時猶豫不決，大器晚成，屬於紙上談兵。", advice: "建議加強行動力（3），將想法付諸實行。" },

  // 3-Series
  "314": { title: "感性策劃/行動者", pos: "積極且自信地規劃生活，富有創意，工作勤奮，多才多藝。", neg: "衝動敏感，缺乏安全感，容易被激怒，依賴性強，愛抱怨。", advice: "情緒波動大，容易流淚。需要他人的鼓勵來建立安全感。" },
  "325": { title: "超級溝通/指引者", pos: "極強行動力與創意，樂觀且善於言詞，能指引他人，聰明過人。", neg: "衝動地把話說絕，讓自己陷入阻礙，聰明反被聰明誤。", advice: "心直口快易傷人。建議說話前三思。" },
  "336": { title: "行動生財/情緒控制", pos: "行動力極強，腳踏實地，只要脾氣好就能賺到大錢。", neg: "極度情緒化、衝動、沒耐性，逢賭必輸，脾氣差會使財富流失。", advice: "情緒決定財富。建議不要參與賭博，學會控制脾氣。" },
  "347": { title: "萬人迷/細節專家", pos: "敏捷積極的策劃者，思想快、反應快，細節做得非常好。", neg: "壞脾氣、性情衝動，容易猜疑，常把情緒擺在前面而趕走貴人。", advice: "適合財務或細節管理工作。建議多付出行動來吸引貴人。" },
  "358": { title: "功德號/付出型", pos: "行動積極、方向明確，能處理複雜人際關係，超強業務代表。", neg: "脾氣爆燥、易被激怒，固執地一意孤行，付出的多得到的少。", advice: "成也情緒，敗也情緒。需要修心修行，轉化脾氣為行動力。" },
  "369": { title: "遍地是財/投機家", pos: "有投資天賦、獨具慧眼，積極應用智能創造機會達到成功。", neg: "對金錢沒概念，揮金如土，理財草率，容易為了機會亂花錢。", advice: "建議學習理財，守住財富才是真正的成功。" },
  "371": { title: "藝術領導/性格奇特", pos: "積極尋找貴人完成夢想，是傑出的藝術創造者，才華橫溢。", neg: "急躁、情緒化、疑心重，容易背叛支持者，剩下孤獨的自己。", advice: "容易招致孤獨。建議戒驕戒躁，珍惜身邊的貴人。" },
  "382": { title: "應變能手/水火衝", pos: "處理事情極其積極，能使用各種方法尋求突破，說服力強。", neg: "水火相衝，脾氣暴躁且善變，內心掙扎，只對親近的人發脾氣。", advice: "心腦血管高發。女性要學會溫柔，男性注意情緒管理。" },
  "393": { title: "折騰號/一技之長", pos: "積極應用創意得到機會，喜歡快速完成一件事，心智能力強。", neg: "耐性不足，愛鑽牛角尖，閒不下來導致身體疲勞，容易焦急。", advice: "腫瘤高發。建議轉變思維，多請教有能力的人分析事情。" },

  // 4-Series
  "415": { title: "精明策劃/目標明確", pos: "精明穩重，有遠見，知道未來方向並全盤計劃去執行。", neg: "過於精打細算導致計劃受阻，容易半途而廢，做一半留一半。", advice: "如果不配合行動（3）容易一事無成。建議與人合作。" },
  "426": { title: "銷售高手/智慧口才", pos: "精明策劃，能在溝通中應用智能達成金錢利益，適合大單銷售。", neg: "計劃過多導致選擇困難，猶豫不決，外在和內在反差極大。", advice: "擁有很強的第六感。建議把握機會，不要停留在計劃階段。" },
  "437": { title: "團隊高手/精明行動", pos: "策劃加積極行動，短時間內完成任務，能吸引很多支持者。", neg: "急功近利，若把情緒擺在前面會嚇走貴人，過度精打細算。", advice: "適合財務與細節管理。建議保持好心態，才能吸引真正的貴人。" },
  "448": { title: "紙上談兵/壓力重重", pos: "聰明穩定的策劃，做事謹慎、步步為營，按部就班行事。", neg: "想得太多、計劃過頭，導致壓力山大，容易錯失良機而受困。", advice: "傷肝傷胃。建議落實責任，不要千頭萬緒只停留在腦中。" },
  "459": { title: "白手起家/企業家", pos: "精明籌劃，方向明確，具有點石成金的本領，容易從無到有。", neg: "城府深，為了達到目的可能不擇手段，容易賺快錢卻留不住。", advice: "建議走正道，財富才能長久。適合管理出色的企業。" },
  "461": { title: "智慧領導/自私糾結", pos: "精明規劃，具有領導能力，對於獲得財富很有願景。", neg: "完美主義導致孤單，吝嗇付出，常為個人利益與合夥人破裂。", advice: "情財兩傷。建議敞開心胸，多幫助他人，才有舍有得。" },
  "472": { title: "軍師才華/依賴心", pos: "精明能力強，做事細膩，是溝通高手與優秀的策劃者。", neg: "太精明計算，導致只說不做，過於依賴貴人幫忙而缺乏行動。", advice: "建議配合行動力（3），才能將計劃落實。" },
  "483": { title: "專業人士/副手命", pos: "能十年如一日地做一件事，在領域內成為專家，執行力強。", neg: "對自己要求不高，容易知足，在旋渦中徘徊，沒方向感。", advice: "女性容易婚姻波折。建議專注某一領域，適合做老二而非老大。" },
  "494": { title: "肝膽健康/多謀少成", pos: "聰明精細的策劃，具備戰略思維，能按照步驟執行。", neg: "做事過於保守，想太多而錯失機會，容易停留在過去。", advice: "傷肝、傷眼睛、胃、骨骼問題。建議少喝酒熬夜，果斷把握機會。" },

  // 5-Series
  "516": { title: "大男子主義/離家求財", pos: "自信獨立，方向明確，適合往外發展創造財富，有原則。", neg: "固執、自我中心，愛挑剔，若方向選錯很難回頭。", advice: "建議送往國外求學或遠方發展，避免在出生地固守。" },
  "527": { title: "一言九鼎/說話生硬", pos: "目標方向明確，說話處事有原則，容易吸引人脈與貴人。", neg: "說法生硬、固執，容易把貴人拒之門外，分別心過重。", advice: "容易出帥哥美女。建議注意說話方式，多包容引導他人。" },
  "538": { title: "磨難與付出/情緒火爆", pos: "多才多藝，善於處理陌生人際關係，業務能力出色。", neg: "固執衝動，脾氣暴躁易被激怒，容易為小事引起長久鬥爭。", advice: "成功與失敗皆因情緒。需要多做善事，修心養性。" },
  "549": { title: "繼承成果/周密策劃", pos: "方向明確規劃事情，有周密的計劃，想盡辦法為子女留遺產。", neg: "城府深，可能有計劃地隱瞞或誤入歧途，模仿他人易失敗。", advice: "要麼大賺要麼大賠。建議凡事求穩，走正道財富才長久。" },
  "551": { title: "億萬財富/自殺號", pos: "強悍領導力，非常有自信，能自己創造出強大的事業王國。", neg: "極度固執，想法走極端，達不到目標可能放棄生命。", advice: "一發脾氣易摔東西。建議找知心朋友傾訴，避免極端行為。" },
  "562": { title: "守財奴/旺夫旺己", pos: "理財謹慎，錢花在刀口上，花的錢都有目的性。", neg: "小氣計較，省小錢花大錢（虧空），容易迷失在瑣事中。", advice: "建議大氣方能成事，多行善積德。" },
  "573": { title: "高層人脈/眼光挑剔", pos: "吸引社會名流與高層人物，對伴侶和飲食很有品味。", neg: "固執己見，不願聽取建議，行事草率容易遭人排擠。", advice: "建議對身邊人好，不要利用貴人，否則貴人變小人。" },
  "584": { title: "活在未來/焦慮者", pos: "責任感重，對未來有清晰規劃，有創意。", neg: "顧慮太多，容易患失眠與憂鬱症，無法活在當下。", advice: "精神壓力大。建議把握現在，腳踏實地，減少無謂擔憂。" },
  "595": { title: "九五之尊/大哥大", pos: "天不怕地不怕，重情重義，堅定目標必完成。", neg: "固執古板，不把法律看在眼裡，容易招惹牢獄之災。", advice: "脾氣大。建議不要走偏道，尊重法律，發揮其領導才能預。" },

  // 6-Series
  "617": { title: "慷慨自負/自然賺錢", pos: "智慧與領導力強，做事細膩，能吸引貴人並白手起家。", neg: "非常自私，花錢抬高自己，可能藏私房錢，好心沒好報。", advice: "心理上較自負。建議真誠與人合作，不要只靠金錢吸引人。" },
  "628": { title: "提錢有壓力/溝通生財", pos: "天生穩定人心的力量，溫和負責，具有溝通天賦。", neg: "講錢就壓力大，容易食言，被他人誤會很有錢而來借錢。", advice: "不要輕易承諾金錢事務，學會量力而行。" },
  "639": { title: "大花筒/投資家", pos: "超強投資天賦，智慧創造成功，喜歡以錢生錢。", neg: "揮霍無度，有購物癖，理財草率，不喜歡待在家裡。", advice: "建議守住財富，理性投資，避免冒進。" },
  "641": { title: "情財兩傷/金融策劃", pos: "優秀的財務規劃師，喜歡追求知識，智慧型人才。", neg: "自私吝嗇，對人斤斤計較，導致孤獨及感情失敗。", advice: "建議舍得付出，敞開心胸，方能情財兩全。" },
  "652": { title: "守財奴/理財謹慎", pos: "理財非常謹慎，花錢理智且有原則，有進無出。", neg: "小錢斤斤計較，大錢容易被騙，愛挑剔且喋喋不休。", advice: "建議學會用智慧分析支出的價值，不要只進不出。" },
  "663": { title: "月光族/起伏人生", pos: "忠誠、樂天知足，懂得為他人著想，賺錢容易。", neg: "財來財去守不住，花錢太衝動，容易沉迷不良嗜好。", advice: "建議購買不動產或有價值的東西來鎖住財富。" },
  "674": { title: "金錢公關/善用人脈", pos: "懂得花錢在有影響力的人身上，利用錢達成目的。", neg: "招來的貴人多為錢而來，不真心，容易流於拍馬屁。", advice: "不能太高調。建議運用智慧真正吸引人脈而非僅靠賄賂。" },
  "685": { title: "佛家號/功功德生財", pos: "能用智慧克服阻礙，若做慈善則錢財能留住。", neg: "花錢最痛苦，壓力重重，委屈感強，錢出去有阻力。", advice: "建議多做善事，錢財自然會守住。" },
  "696": { title: "滾雪球/冒險家", pos: "有能力賺錢，懂得錢生錢，事業與生意易成功。", neg: "膽小不敢投，或者控制不住花錢，賺不到錢是因為膽子小。", advice: "切記不能賭博，適合理性且長線的投資。" },

  // 7-Series
  "718": { title: "招小人/背黑鍋", pos: "博學，精於分析事件，有領袖氣質，堅強獨立。", neg: "容易被朋友陷害、借錢不還，躺著也中槍。", advice: "切記不可做擔保人、法人。流年遇到要出外旅遊避難。" },
  "729": { title: "大貴人/高級桃花", pos: "善於交際，博愛包容，能吸引比自己大的高級貴人。", neg: "行動力弱，遇到變故易逃避，桃花過旺需防濫情。", advice: "心理上易郁郁寡歡。建議學會與異性相處，珍惜貴人。" },
  "731": { title: "背叛號/脾氣火爆", pos: "才華橫溢，原創思考型人才，吸引人脈能力強。", neg: "急躁衝動，容易惹官司，脾氣一發就會趕走貴人。", advice: "容易被背叛。建議戒驕戒躁，保持心態平和。" },
  "742": { title: "溝通籌劃/遇高人", pos: "做事細膩，有機會遇到名師給予建議，善於解決問題。", neg: "想得多、做不到，行動力差，容易引起他人嫉妒。", advice: "不要冒險，珍惜經驗豐富的人提供的協助。" },
  "753": { title: "小人號/官司風險", pos: "身邊貴人多，若心態正則能吸引強大的支持者。", neg: "愛算計、利用他人，導致身邊人變小人，易坐牢。", advice: "切記帳目要清，不要利用他人，否則會反被利用陷害。" },
  "764": { title: "幸運號/遺產財", pos: "招財且教人賺錢，能得到資本資助，有意外收穫。", neg: "對人太敏感，挑剔合作夥伴，要注意借貸關係。", advice: "容易獲得遺產或祖傳技術。建議妥善管理借貸。" },
  "775": { title: "感恩號/高級人脈", pos: "非常有緣，能克服障礙，對朋友兩肋插刀，能力強。", neg: "固執、冷淡，遇到困難容易逃避，容易捲入官司。", advice: "心態決定貴人或小人。建議保持感恩之心。" },
  "786": { title: "異性貴人/錢易賺", pos: "有比自己小的異性貴人相助，能承擔壓力並賺錢。", neg: "行動力弱，若頂不住壓力則會產生逃避現實。", advice: "建議敢於承擔，壓力過後即是財富。" },
  "797": { title: "幸運號/一呼百應", pos: "貴人帶機會合作，擁有眾多支持者，莫名好事多。", neg: "若心態不正容易借刀殺人，遭到他人嫉妒。", advice: "建議真誠待人，儘量與人合作，事業才能做大。" },

  // 8-Series
  "819": { title: "責任領袖", pos: "願意承擔所有責任，能找出解決方法，值得信賴。", neg: "壓力極大，一個人苦撐，過於挑剔、親力親為。", advice: "心腦血管問題。建議勞逸結合，接受不完美。" },
  "821": { title: "銷售冠軍/內心孤獨", pos: "極強的銷售能力，不管多大壓力都能承擔，成大單。", neg: "內心空虛、自卑，不願與人合作，猶豫不決。", advice: "建議男戴手錶，女戴戒飾改運，多與人分享壓力。" },
  "832": { title: "情緒炸彈/快速執行", pos: "應變能力強，行動快，能有效率地說服每個人。", neg: "水火相衝，情緒化、沒耐性，對話語極度敏感。", advice: "心腦血管高發。建議多做功德，學會柔情待人。" },
  "843": { title: "專業人士/老二命", pos: "精明籌劃，能在專業領域深耕多年，成為技術專家。", neg: "感情糊塗，偶爾迷糊，想不明白行動方向而焦急。", advice: "容易離婚，陰宅可能有關。建議當副手輔佐強者。" },
  "854": { title: "活在未來/悲觀者", pos: "責任感重，對未來有先見之明與規劃。", neg: "顧慮太多，無法活在當下，遇到阻礙就很悲觀。", advice: "抑鬱神情，失眠。建議把握現在，不要對未來過度擔憂。" },
  "865": { title: "討債號/研究型", pos: "應變能力強，對感興趣的事能深入研究，克服障礙。", neg: "生活不定，四處漂泊，投資回報慢，磨難多。", advice: "建議行善突破，多賺正財避偏財。" },
  "876": { title: "異性領導/壓力回報", pos: "承擔壓力後貴人出現，能得到上司欣賞，處事智慧。", neg: "處事冷漠、遲緩，壓力大時會逃避現實。", advice: "建議敢於承擔責任，風雨過後必有彩虹財富。" },
  "887": { title: "水火衝/婚姻波折", pos: "應變能力強，承擔責任後有貴人支持，博愛。", neg: "脾氣極大，火旺影響婚姻，容易憤怒嚇走貴人。", advice: "注意心臟、子宮、腎。晚年易有心臟病。建議控制情緒。" },
  "898": { title: "壓力循環/瞎忙者", pos: "應變能力強，願意轉變機會並承擔，看似事業亮麗。", neg: "內心糾結、瞎忙一場，太在意評價，壓力導致疾病。", advice: "男腎與心臟，女婦科、子宮。建議學會放下包袱。" },

  // 9-Series
  "911": { title: "孤獨領導/自力更生", pos: "自信創造機會，所有的事都靠自己奮鬥完成。", neg: "孤獨行者，不願合作，貪心想擁有所有機會。", advice: "賺錢有血有淚。建議學會授權與合作。" },
  "922": { title: "軍師號/諸葛亮", pos: "口才極佳，具備抓住商機的天賦，適合出謀劃策。", neg: "光說不做，猶豫不定導致大起大落，官司牢獄號。", advice: "女性容易做人情人。建議把握商機及時行動。" },
  "933": { title: "折騰號/短暫生意", pos: "行動積極，心靈手巧，擅長才藝或手藝。", neg: "耐性不足，盲目行動錯失財富，容易陷入內耗。", advice: "腫瘤高發，容易得惡疾。建議轉變思維，找人幫忙分析。" },
  "944": { title: "偏財號/學者型", pos: "精明詳細地策劃，一旦目標穩定後利潤豐厚。", neg: "目標不固定，想太多改來改去，容易失去機會。", advice: "肝膽問題。建議目標穩定後不要想太多，專心執行。" },
  "955": { title: "九五之尊/自私絆腳石", pos: "九五之尊，做事不顧慮，能堅持完成明確方向。", neg: "貪心固執，不按牌理出牌，自私自利易吃大虧。", advice: "不要踐踏法律，戒除自私，方能獲得巨大成就。" },
  "966": { title: "點石成金/投資家", pos: "智慧與財富兼具，能以錢生錢，運程極好。", neg: "太貪心，不重視金錢導致財來財去。", advice: "千萬不能賭博，適合長線投資，抓穩一個再做下一個。" },
  "977": { title: "號召力/貴人小人並存", pos: "魅力型領導，隨機應變能力強，能吸引眾多人脈。", neg: "貪心，意志不堅定，容易招惹小人與爛桃花。", advice: "建議真誠待人，不要利用他人，否則貴人變小人。" },
  "988": { title: "跌倒再戰/企圖心", pos: "洞察力強，懂掌握機會，能在跌倒後重新站起。", neg: "極度忙碌、壓力巨大，幫人幫不到重點。", advice: "心腦血管、腎、子宮問題。建議先了解狀況再幫忙。" },
  "999": { title: "九五之尊/專一功課", pos: "洞察力與創意極強，機會非常多，容易積累資產。", neg: "好高騖遠、做事不專一，產業容易變慘業。", advice: "容易孤獨終老。建議學會把錢投資在有價值之處，專一做事。" }
};

const TRAITS_DB = {
  1: { trait: "開創領袖", pos: "管理強、自信獨立、領袖風範。", neg: "容易流於自我中心、過度強勢。" },
  2: { trait: "溝通大師", pos: "口才優、親和力強、靈感想像豐富。", neg: "看重不快、猶豫不決、依賴心重。" },
  3: { trait: "行動火炬", pos: "爆發力強、反應神速、熱情洋溢。", neg: "容易急躁衝動、缺乏耐性。" },
  4: { trait: "邏輯策劃", pos: "思維精密、處事有條理、重視穩定。", neg: "保守死板、想多做少。" },
  5: { trait: "方向領袖", pos: "意志堅定、具幽默感、一呼百應。", neg: "固執難溝通、方向迷茫。" },
  6: { trait: "財富管理", pos: "帶財高智、負責愛家、洞察商機。", neg: "完美主義、對人苛刻。" },
  7: { trait: "人脈幸運", pos: "貴人眾多、洞察人心、運氣極佳。", neg: "反應慢拍、冷漠遲緩。" },
  8: { trait: "責任實幹", pos: "承擔力強、定海神針、使命必達。", neg: "死要面子活受罪、壓力過大。" },
  9: { trait: "圓滿智者", pos: "格局宏大、心想事成、博學多才。", neg: "貪多不專、內心委чив。" }
};

const MISSING_ENERGY_DB = {
  1: "缺乏獨立自主。決策時迷茫。需補足自我靈魂主位。",
  2: "溝通能級受阻。屬「刀子嘴豆腐心」。溫柔的話不懂溫柔說。",
  3: "行動力能級不足。對商機反應緩慢，容易在猶豫中錯失。",
  4: "自控力弱。財富去向不明，做事難持之以恆，常見學而不精。",
  5: "判斷力缺失。分不清貴人與小人，重大轉折點容易選錯方向。",
  6: "財富吸引力弱。習慣「大方別人、小氣自己」，忽略自身富足累積。",
  7: "貴人緣份薄。凡事親力親為，缺乏外界助力。",
  8: "抗壓性不足。遇重大重任容易焦慮失眠，傾向逃避決策責任。",
  9: "存在感弱。付出良多卻在收穫時刻被邊緣化。"
};

const SOURCE_DREAM_REPORT_DB = {
  1: { title: "當領導", motivation: "天生帶領團隊做大事業。", pos: "具備極強領導力與掌控力。", neg: "表現得像老闆，聽不進建議。", action: "領導者、管理職、班長、小隊長、管理職、帶領團隊。", sentence: (n) => `「我${n}就是領導人！」` },
  2: { title: "靠嘴征服世界", motivation: "言語具有磁場療癒人心。", pos: "溝通流暢，具有說服力。", neg: "碎碎念、禍從口出。", action: "老師、講師、保險業、公關、演說家、需要大量溝通與分享的平台、顧問、銷售。", sentence: (n) => `「我${n}要靠嘴征服世界！」` },
  3: { title: "成為貴族", motivation: "追求精緻與高品質生活。", pos: "氣質優雅，生活有品味。", neg: "虛榮心重，追求外在形式。", action: "服務業（具備高度自主權）、具備時間伸縮性的行業、美感與精品相關行業、奢侈品、藝術創作。", sentence: (n) => `「我${n}會擁有貴族人生！」` },
  4: { title: "規畫人生", motivation: "幫助他人建立系統。", pos: "邏輯嚴謹，能將複雜事物簡化。", neg: "過於死板教條。", action: "市場規畫 (Marketing)、保險規畫、教育規畫、人力資源、戰略策劃類工作、財務規畫、流程設計。", sentence: (n) => `「我${n}可以幫助所有人規畫人生！」` },
  5: { title: "成為領袖", motivation: "一呼百應，目標清晰。", pos: "具備強大的影響力。", neg: "獨裁、不聽勸告。", action: "美業、創業者、團隊領袖、不喜歡受束縛的自由職業、社團首領。", sentence: (n) => `「我${n}要成為領袖！」` },
  6: { title: "用錢征服世界", motivation: "財富轉化為社會大愛。", pos: "極強的理財能力。", neg: "吝嗇、視財如命。", action: "金融、投資、大型商業、高產值行業、投資家、慈善基金。", sentence: (n) => `「我${n}要用錢利益眾生！」` },
  7: { title: "掌控所有人", motivation: "內心充滿愛而關心他人。", pos: "人脈經營大師。", neg: "算計他人，控制他人。", action: "講師、中醫師、大型活動策劃、需要高度掌控場景的職位、公關、人資。", sentence: (n) => `「我${n}可以從容控制一切！」` },
  8: { title: "拿到權利", motivation: "重視尊嚴與責任實幹。", pos: "具備威懾力，處事公允。", neg: "濫用權力，死板固執。", action: "法律、管理、教育（如補習班老師）、需要專業授權的技術職、自主創業、公職、高級主管。", sentence: (n) => `「我${n}會拿到屬於自己的權利！」` },
  9: { title: "君臨天下", motivation: "格局宏大建立利他制度。", pos: "智慧圓滿，具有高度靈性。", neg: "不切實際的幻想。", action: "企業家、異地發展的商業、制度制定者、高層決策者。心靈導師。", sentence: (n) => `「我${n}願意用我的能力為眾人服務,我將用愛君臨天下！」` }
};

const YEARLY_DETAIL_DB = {
  1: { core: "開創重啟", career: "適合開創新的出路、新行業或向全世界發展；建議採取「以人合作」模式而非單打獨鬥。可投資自己或生意，為未來九年結果鋪路。", negative: "傲慢情緒大。", health: "婚姻功課年。" },
  2: { core: "溝通合作", career: "主打合作共贏，適合多參與社會活動或商會以擴展人脈。必須敢於開口溝通，透過好聽的話語吸引財富與運氣。", negative: "猶豫不決，左右搖擺，需修煉定力。", health: "會表白吸引姻緣，多對另一半說甜蜜情話。" },
  3: { core: "變動磨練", career: "低運年，嚴禁大筆投資、出大錢或擔任擔保人。應放下挑剔與意見，以實際行動解決問題而非發號施令。。", negative: "容易招小人。", health: "注意心臟。" },
  4: { core: "策劃佈局", career: "適合為未來九年進行策劃佈局。建議將財富投資在自己身上（如報名上課），提升自我價值。今年會看到前期投入的小收穫。", negative: "鑽牛角尖。", health: "容易失眠。" },
  5: { core: "轉折主動", career: "為重要的轉折年，若走得好將有13年大運。必須主動認識人、主動開口。有目標後需立即行動，否則事業將從頭再來。。", negative: "固執被動。", health: "擁抱新環境。" },
  6: { core: "財富豐收", career: "財富與運氣自動找上門的豐收年。適合進行遠瞻性投資，賺錢後應懂得回饋社會（如佈施、分享），能吸引更多財富進帳。", negative: "計較挑剔。", health: "打扮圓融。" },
  7: { core: "貴人幸運", career: "全球人脈與貴人運極旺的一年。適合拓展社交圈，貴人就在身邊，需有洞察力及時把握、留意是非。", negative: "拖延反應慢。", health: "適合結婚。" },
  8: { core: "壓力承擔", career: "壓力巨大的一年，容易「躺著也中槍」。絕對不能借錢給人、不做保人、不輕許口頭承諾。適合透過多出差、坐飛機旅行來轉運。", negative: "有無力感。", health: "注意體力。" },
  9: { core: "成功結果", career: "九年一輪的收割年，事業易見成效，貴人運比1-8號人更旺。應將成果分享給下屬或團隊，並為明年新的循環做準備。", negative: "貪心無度。", health: "容易有高血壓、睡眠不足等過勞問題。應學會讓他人分擔工作，避免親力親為導致奔波勞碌。" }
};

const DAILY_DRESSING_DB = {
  "金": { wealth: ["紅、紫"], noble: ["藍、黑"], advice: "配戴金屬飾品強化威信。" },
  "木": { wealth: ["藍、黑"], noble: ["紅、紫"], advice: "穿搭棉麻面料平衡思維。" },
  "水": { wealth: ["黃、咖"], noble: ["白、銀"], advice: "選用流動面料強化磁場。" },
  "火": { wealth: ["白、銀"], noble: ["黃、金"], advice: "選用亮色飾品啟動直覺。" },
  "土": { wealth: ["藍、黑"], noble: ["紅、紫"], advice: "選用大地色系展現穩重。" }
};

// ============================================================================
// 🌟 2. 輔助渲染組件
// ============================================================================

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-6 text-center font-black">
        <AlertTriangle size={64} className="text-rose-500 mb-4" />
        <h2 className="text-xl text-rose-800 mb-2 font-black">系統解析異常</h2>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-500 text-white rounded-full shadow-lg font-black">重新啟動</button>
      </div>
    );
    return this.props.children;
  }
}

const SvgNumNode = ({ x, y, value, label, elementColor, isCore = false, starPos = null }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-22" y="-22" width="44" height="44" rx="10" fill="white" stroke={elementColor} strokeWidth={isCore ? "4" : "2"} className="filter drop-shadow-sm" />
    {label && <text y="-32" textAnchor="middle" className="text-[9px] font-black fill-gray-400 uppercase tracking-tighter">{label}</text>}
    <text dominantBaseline="central" textAnchor="middle" className={`${isCore ? 'text-2xl' : 'text-lg'} font-black`} fill={elementColor}>{value}</text>
    {starPos === 'left-top' && <path d="M-30,-30 l2.5,6 l6,0 l-5,4 l2,7 l-5.5,-4.5 l-5.5,4.5 l2,-7 l-5,-4 l6,0 z" fill="#FFD700" className="animate-pulse" />}
    {starPos === 'right-top' && <path d="M30,-30 l2.5,6 l6,0 l-5,4 l2,7 l-5.5,-4.5 l-5.5,4.5 l2,-7 l-5,-4 l6,0 z" fill="#FFD700" className="animate-pulse" />}
    {starPos === 'top' && <path d="M0,-45 l2.5,6 l6,0 l-5,4 l2,7 l-5.5,-4.5 l-5.5,4.5 l2,-7 l-5,-4 l6,0 z" fill="#FFD700" className="animate-pulse" />}
  </g>
);

// ============================================================================
// 🌟 3. 主組件 App
// ============================================================================
export default function App() {
  const [formData, setFormData] = useState({
    name: '王小明', gender: '女', zodiac: '狗', birthDate: '1970-02-19', 
    targetYear: '2026', targetMonth: '3', targetDay: '11', isLateNight: false,
    twinType: 'none', parentBirthDate: '1945-01-01' 
  });
  const [viewMode, setViewMode] = useState('innate'); 
  const [showReport, setShowReport] = useState(false); 
  const [analysisCode, setAnalysisCode] = useState(null); 
  const [consultant, setConsultant] = useState('mata');
  const [shareLink, setShareLink] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState(null);

  const isLocked = viewMode !== 'innate';

  // 🌟 計算邏輯
  const reduce = (val) => {
    let current = String(val || '0').replace(/[^0-9]/g, '');
    if (!current || current === '0') return 0;
    while (current.length > 1) {
      current = String(current.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0));
    }
    return parseInt(current, 10);
  };

  const active = useMemo(() => {
    let [bY, bM, bD] = (formData.birthDate || "1970-01-01").split('-').map(Number);
    let birthObj = new Date(bY, bM - 1, bD);
    if (formData.isLateNight) birthObj.setDate(birthObj.getDate() + 1);
    const iY = String(birthObj.getFullYear()), iM = birthObj.getMonth() + 1, iD = birthObj.getDate();
    const curYearStr = viewMode === 'innate' ? iY : formData.targetYear;
    let D = reduce(curYearStr.substring(0, 2)), E = reduce(curYearStr.substring(2, 4));
    if (curYearStr === "2000") { D = 2; E = 5; } 
    let baseDay = iD, baseMonth = iM;
    if (formData.twinType !== 'none' && formData.parentBirthDate) {
      const [pY, pM, pD] = formData.parentBirthDate.split('-').map(Number);
      if (!isNaN(pM) && !isNaN(pD)) { baseDay = iD + pD; baseMonth = iM + pM; }
    }
    const valA = viewMode === 'daily' ? (parseInt(formData.targetDay) + reduce(baseDay)) : baseDay;
    const valB = (viewMode === 'monthly' || viewMode === 'daily') ? (parseInt(formData.targetMonth) + reduce(baseMonth)) : baseMonth;
    const A = reduce(valA), B = reduce(valB), C = reduce(A + B), F = reduce(D + E), G = reduce(C + F); 
    const I = reduce(F + G), H = reduce(C + G), J = reduce(I + H);
    const K = reduce(A + C), L = reduce(B + C), M = reduce(K + L);
    const nN = reduce(D + F), nO = reduce(E + F), nP = reduce(nN + nO);
    
    const getEl = (n) => {
      if ([1, 6].includes(n)) return '金'; if ([2, 7].includes(n)) return '水';
      if ([3, 8].includes(n)) return '火'; if ([4, 9].includes(n)) return '木';
      return '土';
    };

    const getMotherEl = (childEl) => {
      const map = { "水": "金", "木": "水", "火": "木", "土": "火", "金": "土" };
      return map[childEl] || childEl;
    };

    const mainEl = getEl(G);
    const themeEl = getMotherEl(mainEl);
    const elOrder = { '金':['金','水','木','火','土'], '水':['水','木','火','土','金'], '火':['火','土','金','水','木'], '木':['木','火','土','金','水'], '土':['土','金','水','木','火'] }[mainEl];
    const counts = elOrder.map(e => [A,B,C,D,E,F,G,H,I,J,K,L,M,nN,nO,nP].filter(num => getEl(num) === e).length);
    
    return { 
      modeLabel: THEME_DEFAULTS[viewMode]?.label || "運勢",
      nums: { A, B, C, D, E, F, G, H, I, J, K, L, M, n: nN, O: nO, P: nP }, 
      missing: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => ![A, B, C, D, E, F, G].includes(n)), 
      hidden: { H1: reduce(C + C), H2: reduce(F + F), H3: reduce(G + G) }, 
      sourceDream: reduce(A + E + G), elements: { mainEl, themeEl, elOrder, counts },
      theme: ELEMENT_THEMES[themeEl] || ELEMENT_THEMES["土"]
    };
  }, [formData, viewMode]);

  const currentTheme = active.theme;

  const indicators = useMemo(() => [
    { id: '①', n: '父基因(事業)', v: `${active.nums.A}${active.nums.B}${active.nums.C}` },
    { id: '②', n: '母基因(婚姻)', v: `${active.nums.D}${active.nums.E}${active.nums.F}` },
    { id: '③', n: '主性格組合', v: `${active.nums.C}${active.nums.F}${active.nums.G}` },
    { id: '④', n: '人生過程 1', v: `${active.nums.C}${active.nums.G}${active.nums.H}` },
    { id: '⑤', n: '人生過程 2', v: `${active.nums.F}${active.nums.G}${active.nums.I}` },
    { id: '⑥', n: '官鬼組合', v: `${active.nums.I}${active.nums.H}${active.nums.J}` },
    { id: '⑦', n: '事業過程 1', v: `${active.nums.A}${active.nums.C}${active.nums.K}` },
    { id: '⑧', n: '事業過程 2', v: `${active.nums.B}${active.nums.C}${active.nums.L}` },
    { id: '⑨', n: '朋友組合', v: `${active.nums.K}${active.nums.L}${active.nums.M}` },
    { id: '⑩', n: '婚姻過程 1', v: `${active.nums.D}${active.nums.F}${active.nums.n}` },
    { id: '⑪', n: '婚姻過程 2', v: `${active.nums.E}${active.nums.F}${active.nums.O}` },
    { id: '⑫', n: '未來財富組合', v: `${active.nums.n}${active.nums.O}${active.nums.P}` },
    { id: '⑬', n: '隱藏號', v: `${active.hidden.H1}${active.hidden.H2}${active.hidden.H3}` },
  ], [active]);

  const handleDeepReportClick = () => { setShowReport(true); };

  const handleShare = async () => {
    if (!supabaseClient) return;
    setIsSharing(true);
    try {
      const { data } = await supabaseClient.from('shares').insert([{ form_data: formData, consultant }]).select();
      if (data?.[0]?.id) {
        const baseUrl = window.location.origin + window.location.pathname;
        setShareLink(`${baseUrl}?sid=${data[0].id}&id=${consultant}`);
      }
    } catch (err) { console.error(err); } finally { setIsSharing(false); }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      if (window.supabase) {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setSupabaseClient(client);
        const urlParams = new URLSearchParams(window.location.search);
        const cId = urlParams.get('id');
        const sid = urlParams.get('sid');
        if (cId) setConsultant(cId);
        if (sid) {
          client.from('shares').select('form_data').eq('id', sid).single()
            .then(({ data }) => { if (data) setFormData(data.form_data); });
        }
      }
    };
    document.body.appendChild(script);
    return () => { if (document.body && document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  if (showReport && active) {
    const yearlyData = YEARLY_DETAIL_DB[active.nums.G] || YEARLY_DETAIL_DB[1];
    const sourceDreamInfo = SOURCE_DREAM_REPORT_DB[active.sourceDream] || SOURCE_DREAM_REPORT_DB[1];
    const traitInfo = TRAITS_DB[active.nums.G] || TRAITS_DB[1];

    return (
      <ErrorBoundary>
        <div className="min-h-screen p-4 sm:p-10 font-sans text-[#4A3A2E] overflow-y-auto font-black" style={{ background: currentTheme.bg }}>
          
          {analysisCode && (
            <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm font-black" onClick={() => setAnalysisCode(null)}>
              <div className="bg-white w-full max-w-xl rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 shadow-2xl relative animate-in zoom-in-95 duration-200 font-black" onClick={e => e.stopPropagation()}>
                <button onClick={() => setAnalysisCode(null)} className="absolute top-6 right-8 p-2 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 font-black"><X size={20}/></button>
                <div className="flex items-center gap-6 sm:gap-8 mb-8 sm:mb-12 font-black">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-white text-3xl sm:text-5xl font-black font-mono shadow-xl bg-[#2E7D32]">
                    {analysisCode}
                  </div>
                  <div className="text-left font-black">
                    <h4 className="text-2xl sm:text-4xl font-black text-gray-800">核心能量解析</h4>
                    <p className="text-[10px] sm:text-sm text-gray-400 font-bold uppercase mt-1">JOINT CODE INSIGHT</p>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6 font-black">
                  <div className="p-5 sm:p-8 bg-[#E8F5E9] rounded-[2rem] border border-[#C8E6C9] font-black"><h5 className="text-[#2E7D32] font-black mb-2 flex items-center gap-2 text-lg font-black"><Zap size={24} className="fill-current"/> 正向能量</h5><p className="text-gray-700 font-bold text-base sm:text-lg leading-relaxed">{JOINT_CODES_DB[analysisCode]?.pos || "具備核心天賦能級。"}</p></div>
                  <div className="p-5 sm:p-8 bg-[#FDF2F2] rounded-[2rem] border border-[#FDE2E2] font-black"><h5 className="text-[#E02424] font-black mb-2 flex items-center gap-2 text-lg font-black"><AlertTriangle size={24} className="fill-current"/> 負面預警</h5><p className="text-gray-700 font-bold text-base sm:text-lg leading-relaxed">{JOINT_CODES_DB[analysisCode]?.neg || "當能級低位時需注意調整。"}</p></div>
                  <div className="p-5 sm:p-8 bg-[#FFF9E6] rounded-[2rem] border border-[#FFE48A] font-black"><h5 className="text-[#B8860B] font-black mb-2 flex items-center gap-2 text-lg font-black"><TrendingUp size={24}/> [人生提醒]</h5><p className="text-gray-700 font-bold text-base sm:text-lg leading-relaxed">{JOINT_CODES_DB[analysisCode]?.advice || "建議對接高端資源。"}</p></div>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12 font-black">
            <button onClick={() => setShowReport(false)} className="flex items-center gap-2 bg-white px-6 py-2 sm:px-8 sm:py-3 rounded-full border shadow-sm font-black transition-all hover:scale-105 font-black"><ArrowLeft size={18} /> 返回知命系統</button>
            <div className="text-center font-black">
              <h1 className="text-3xl sm:text-4xl font-black text-[#4A3A2E] mb-4 font-black">{active.modeLabel}五行深度解析報告</h1>
              <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6 bg-white/50 py-3 px-6 sm:px-10 rounded-3xl sm:rounded-full border border-white font-bold backdrop-blur-md">
                <span className="text-sm sm:text-base font-black">命主：{formData.name}</span>
                <span className="text-sm sm:text-base font-black">核心數：<span className="text-xl font-black" style={{ color: ELEMENT_THEMES[active.elements.mainEl].primary }}>{active.nums.G}</span></span>
                <span className="text-sm sm:text-base font-black">補運色：<span style={{ color: currentTheme.primary }}>{currentTheme.label}</span></span>
              </div>
            </div>

            <div className="bg-white/90 rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-10 shadow-2xl border-2 flex flex-col items-center">
                <h3 className="text-xl sm:text-2xl font-black mb-8 self-start border-b pb-4 w-full flex items-center gap-2 font-black"><Activity /> {active.modeLabel}核心佈局</h3>
                <div className="relative mb-12 flex flex-col items-center w-full">
                  <div className="w-full max-w-[400px]">
                    <svg viewBox="0 0 400 450" className="w-full h-auto drop-shadow-2xl overflow-visible font-black">
                      <path d="M50 80 L200 240 L350 80 Z" fill="none" stroke={ELEMENT_THEMES[active.elements.mainEl].primary} strokeWidth="1" strokeOpacity="0.2" />
                      <SvgNumNode x={50} y={80} value={active.nums.A} label="A" elementColor="#EF4444" starPos="left-top" />
                      <SvgNumNode x={120} y={80} value={active.nums.B} label="B" elementColor="#EF4444" />
                      <SvgNumNode x={280} y={80} value={active.nums.D} label="D" elementColor="#EF4444" />
                      <SvgNumNode x={350} y={80} value={active.nums.E} label="E" elementColor="#EF4444" starPos="right-top" />
                      <SvgNumNode x={85} y={160} value={active.nums.C} label="C" elementColor="#8B5CF6" />
                      <SvgNumNode x={315} y={160} value={active.nums.F} label="F" elementColor="#8B5CF6" />
                      <SvgNumNode x={200} y={240} value={active.nums.G} label="核心" elementColor={ELEMENT_THEMES[active.elements.mainEl].primary} isCore starPos="top" />
                      <SvgNumNode x={125} y={320} value={active.nums.I} label="I" elementColor="#10B981" />
                      <SvgNumNode x={275} y={320} value={active.nums.H} label="H" elementColor="#10B981" />
                      <SvgNumNode x={200} y={400} value={active.nums.J} label="J" elementColor="#374151" />
                    </svg>
                  </div>
                  <div className="mt-16 bg-gray-100/70 px-8 py-3.5 rounded-full flex gap-10 font-black shadow-inner border border-white font-black">
                    <div className="flex items-center gap-2 font-black"><span className="text-[9px] text-gray-400 font-black -rotate-90">KLM</span><div className="flex gap-2">{[active.nums.M, active.nums.L, active.nums.K].map((n, i) => (<span key={i} className="bg-white px-3 py-1 rounded-xl shadow-sm text-xl text-blue-600 font-mono font-black">{n}</span>))}</div></div>
                    <div className="w-px bg-gray-300 h-8 self-center"></div>
                    <div className="flex items-center gap-2 font-black"><div className="flex gap-2 font-black">{[active.nums.n, active.nums.O, active.nums.P].map((n, i) => (<span key={i} className="bg-white px-3 py-1 rounded-xl shadow-sm text-xl text-orange-600 font-mono font-black font-black">{n}</span>))}</div><span className="text-[9px] text-gray-400 rotate-90 font-black">NOP</span></div>
                  </div>
                </div>
            </div>

            <div className="bg-white/90 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border-2 shadow-sm space-y-8 font-black">
              <h3 className="text-xl sm:text-2xl font-black mb-4 flex items-center gap-3 border-b pb-4 font-black"><TrendingUp /> {active.modeLabel}核心解析</h3>
              <div className="space-y-6">
                <div className="p-4 sm:p-6 rounded-3xl font-black bg-gray-50/50">
                  <p className="text-[10px] text-gray-400 mb-1 font-black">核心特質</p>
                  <p className="text-xl sm:text-2xl font-black" style={{ color: ELEMENT_THEMES[active.elements.mainEl].primary }}>{yearlyData.core}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 text-gray-700 font-black">
                  <div className="bg-emerald-50 p-5 rounded-[1.5rem] border border-emerald-100 font-black"><h4 className="text-emerald-700 font-black mb-2 uppercase text-xs font-black">專業向與財運建議</h4><p className="text-sm sm:text-base leading-relaxed font-black">{yearlyData.career}</p></div>
                  <div className="bg-rose-50 p-5 rounded-[1.5rem] border border-rose-100 font-black"><h4 className="text-rose-700 font-black mb-2 uppercase text-xs font-black">當負面能級覺察</h4><p className="text-sm sm:text-base leading-relaxed font-black">{yearlyData.negative || "注意情緒平衡。"}</p></div>
                  <div className="bg-blue-50 p-5 rounded-[1.5rem] border border-blue-100 font-black"><h4 className="text-blue-700 font-black mb-2 uppercase text-xs font-black">健康與感情提醒</h4><p className="text-sm sm:text-base leading-relaxed font-black font-black">{yearlyData.health}</p></div>
                </div>
              </div>
            </div>

            {viewMode === 'innate' && (
              <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-sm space-y-8 font-black border border-gray-100 animate-in slide-in-from-left duration-500">
                <h3 className="text-xl font-black text-blue-800 mb-6 flex items-center gap-3 font-black"><User size={24} /> 先天性格特質解析</h3>
                <div className="p-6 sm:p-8 bg-gray-50 rounded-[1.5rem] sm:rounded-[2.5rem] space-y-6 sm:space-y-8 font-black">
                  <div className="flex items-center gap-4 font-black"><span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black">角色定位</span><p className="text-lg sm:text-xl font-black">{active.nums.G} 號人 ({traitInfo.trait})</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm font-black"><h5 className="text-blue-600 font-black mb-2 flex items-center gap-2 text-xs font-black font-black"><Zap size={14}/> 正向能級潛能</h5><p className="text-sm text-gray-600 leading-relaxed font-black">{traitInfo.pos}</p></div>
                    <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm font-black"><h5 className="text-gray-400 font-black mb-2 flex items-center gap-2 text-xs font-black font-black"><AlertTriangle size={14}/> 負面能級卡點</h5><p className="text-sm text-gray-600 leading-relaxed font-black">{traitInfo.neg}</p></div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'innate' && (
              <div className="bg-[#9B89B3] rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-12 shadow-xl space-y-8 text-white relative overflow-hidden font-black">
                  <div className="absolute top-10 right-10 opacity-10 font-black"><Star size={180} /></div>
                  <div className="flex items-center gap-4 mb-8 border-b border-white/20 pb-6 relative z-10 font-black font-black font-black"><Lock size={28} /><h3 className="text-xl sm:text-3xl font-black font-black font-black">潛意識的渴望深度解析</h3></div>
                  <div className="flex items-baseline gap-6 mb-8 relative z-10 font-black font-black"><span className="text-6xl sm:text-8xl font-black opacity-40">{active.sourceDream}</span><h2 className="text-2xl sm:text-4xl font-black">{sourceDreamInfo.title}</h2></div>
                  <div className="space-y-4 relative z-10 font-black">
                    {[{ label: "核心慾望", val: sourceDreamInfo.motivation }, { label: "使命使命", val: sourceDreamInfo.pos }, { label: "負向表現", val: sourceDreamInfo.neg }, { label: "適合環境", val: sourceDreamInfo.action }].map((item, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/10 font-black font-black"><p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2 font-black">{item.label}</p><p className="text-sm sm:text-lg font-black leading-relaxed font-black">{item.val}</p></div>
                    ))}
                    <div className="bg-white/20 p-6 rounded-[1.5rem] border-2 border-dashed border-white/30 text-center mt-6 font-black font-black"><p className="text-lg sm:text-2xl font-black text-yellow-200 font-black">「{sourceDreamInfo.sentence(formData.name)}」</p></div>
                  </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black">
              <div className="bg-[#f0ece6] p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border-2 shadow-inner text-[#4A3A2E] font-black">
                <div className="flex items-center gap-4 mb-6 border-b-2 pb-4 border-[#d9c5a4] font-black"><HeartPulse size={36} className="text-[#a65a5a]" /><h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-black font-black">五行健康訊息</h3></div>
                <p className="font-bold text-base mb-6">官鬼能量組合 ⑥：<span className="text-3xl text-[#a65a5a] font-black ml-2">{active.nums.I}{active.nums.H}{active.nums.J}</span></p>
                <div className="space-y-3 font-black">
                  {(active.missing.includes(1) || active.missing.includes(6)) && <div className="p-3 bg-white/70 rounded-[1.2rem] shadow-sm font-bold text-xs sm:text-sm font-black">● 「金系」肺腸缺失：建議 Auroa 極淨纖果粉</div>}
                  {(active.missing.includes(4) || active.missing.includes(9)) && <div className="p-3 bg-white/70 rounded-[1.2rem] shadow-sm font-bold text-xs sm:text-sm font-black">● 「木系」肝膽缺失：建議 DawnBliss 昕悅活力飲</div>}
                  {active.missing.includes(5) && <div className="p-3 bg-white/70 rounded-[1.2rem] shadow-sm font-bold text-xs sm:text-sm font-black">● 「土系」脾胃缺失：建議 Spark 閃朔系列</div>}
                  {active.missing.includes(2) && <div className="p-3 bg-white/70 rounded-[1.2rem] shadow-sm font-bold text-xs sm:text-sm font-black">● 「水系」腎骨低位：建議 Flora 亮妍嬌源飲</div>}
                </div>
              </div>
              <div className="rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 shadow-xl text-white bg-[#a65a5a] border-4 border-white/20 font-black">
                <div className="flex items-center gap-4 mb-8 font-black font-black"><Search size={32} /><h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-black font-black">缺失能量詳細解析</h3></div>
                <div className="space-y-4 font-black">
                  {active.missing.map(num => (
                    <div key={num} className="flex gap-4 items-start bg-white/10 p-4 rounded-[1.5rem] border border-white/10 shadow-inner font-black"><div className="w-10 h-10 bg-white text-[#a65a5a] rounded-xl flex items-center justify-center font-black shrink-0 text-xl font-black">{num}</div><p className="text-sm sm:text-base font-bold leading-relaxed">{MISSING_ENERGY_DB[num]}</p></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-12 border-2 shadow-sm text-center font-black">
              <h3 className="text-2xl font-black mb-10 text-gray-800 font-black">13 項指標解析</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 font-black">
                {indicators.map((item, i) => {
                  const isYellow = ['①', '②', '③', '④', '⑦', '⑧', '⑨', '⑫', '⑬'].includes(item.id);
                  return (
                    <button key={i} onClick={() => setAnalysisCode(item.v)} className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border-2 flex flex-col items-center transition-all shadow-sm font-black ${isYellow ? 'bg-[#FFF9E6] border-[#FFE48A]' : 'bg-white'}`}>
                      <span className="text-[9px] uppercase text-gray-400 font-bold mb-2 font-black font-black">{item.id} {item.n}</span><span className="font-mono text-2xl sm:text-4xl text-gray-800 font-black">{item.v}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen font-sans flex flex-col font-black overflow-x-hidden bg-[#f0f4f8]" style={{ background: currentTheme.bg }}>
        {shareLink && (
          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm font-black font-black">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative text-center font-black">
              <button onClick={() => setShareLink(null)} className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-400 rounded-full font-black"><X size={20}/></button>
              <Share2 size={48} className="mx-auto text-emerald-500 mb-4 font-black" /><h3 className="text-xl mb-4 font-black font-black">分享專屬連結</h3><p className="bg-gray-100 p-4 rounded-xl break-all text-xs font-mono font-black">{shareLink}</p>
              <button onClick={() => { navigator.clipboard.writeText(shareLink); setShareLink(null); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl shadow-lg font-black mt-4 font-black">複製並關閉</button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full p-4 sm:p-10 space-y-8 font-black">
          <div className="bg-white/90 backdrop-blur-md rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-xl border-2 font-black font-black">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b font-black">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#374151] font-black">MATA五行知命系統</h1>
                <div className="flex flex-wrap items-center gap-3 mt-3 font-black">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">V3.7</span>
                  <div className="bg-[#fff1f1] px-4 py-1.5 rounded-full border border-[#ffe4e4] flex items-center gap-2 font-black"><User size={12} className="text-rose-500" /><span className="text-[11px] font-black text-rose-600 font-black">專業顧問：{consultant}</span></div>
                  <div className="bg-white px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm font-black font-black" style={{ borderColor: currentTheme.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primary }}></div>
                    <span className="text-[10px] font-black" style={{ color: currentTheme.primary }}>補運色：{currentTheme.label}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 lg:mt-0 font-black">
                {Object.keys(THEME_DEFAULTS).map((m) => {
                   const Icon = THEME_DEFAULTS[m].icon;
                   return (<button key={m} onClick={() => setViewMode(m)} className={`px-5 py-3 rounded-[1.2rem] font-black text-xs sm:text-sm transition-all flex items-center gap-2 font-black ${viewMode === m ? 'bg-[#2563eb] text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-400'}`}><Icon size={16} />{THEME_DEFAULTS[m].label}</button>);
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 text-left font-black">
              <div className="space-y-1"><label className="text-[10px] text-gray-400 ml-1 font-black">姓名</label><input value={formData.name} readOnly={isLocked} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-2 rounded-[1rem] px-4 py-3 font-bold bg-white focus:border-blue-200 outline-none font-black" /></div>
              <div className="space-y-1"><label className="text-[10px] text-gray-400 ml-1 font-black">性別</label><select value={formData.gender} disabled={isLocked} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full border-2 rounded-[1rem] px-3 py-3 font-black bg-white outline-none font-black"><option value="女">女</option><option value="男">男</option></select></div>
              <div className="space-y-1 min-w-[140px] font-black"><label className="text-[10px] text-gray-400 ml-1 font-black">生日</label><input type="date" value={formData.birthDate} readOnly={isLocked} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className="w-full border-2 rounded-[1rem] px-3 py-3 text-[13px] font-bold bg-white font-black" /></div>
              <div className="space-y-1 font-black"><label className="text-[10px] text-gray-400 ml-1 font-black">生肖</label><input value={formData.zodiac} readOnly={isLocked} onChange={(e) => setFormData({...formData, zodiac: e.target.value})} className="w-full border-2 rounded-[1rem] px-4 py-3 font-bold text-center bg-gray-50 font-black cursor-default font-black" /></div>
              <div className="flex items-center justify-center pt-5 font-black">
                <label className={`flex items-center gap-2 px-4 py-3 rounded-[1rem] border-2 cursor-pointer transition-all w-full justify-center font-black ${formData.isLateNight ? 'bg-amber-50 border-amber-300' : 'bg-gray-50'}`}>
                  <input type="checkbox" checked={formData.isLateNight} disabled={isLocked} onChange={(e) => setFormData({...formData, isLateNight: e.target.checked})} className="w-4 h-4 accent-blue-600 font-black" /><span className="text-[10px] font-black leading-tight text-gray-600 font-black">子時加一日</span>
                </label>
              </div>
            </div>
            
            <div className="mt-8 bg-[#fafafa] border-2 border-dashed border-gray-200 rounded-[1.5rem] p-6 sm:p-10 font-black font-black">
              <h4 className="text-[10px] uppercase text-gray-400 mb-5 tracking-widest px-2 font-black font-black">雙胞胎進階設定</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-black font-black">
                <select value={formData.twinType} disabled={isLocked} onChange={(e) => setFormData({...formData, twinType: e.target.value})} className="w-full border-2 rounded-[1rem] px-4 py-3 font-black text-sm bg-white focus:border-blue-300 outline-none font-black font-black"><option value="none">無雙胞胎</option><option value="oldest">老大 (需父生日)</option><option value="second">老二 (需母生日)</option></select>
                {formData.twinType !== 'none' && (
                  <div className="space-y-1 animate-in slide-in-from-left font-black font-black"><label className="text-[10px] font-black text-rose-400 ml-1 font-black font-black">{formData.twinType === 'oldest' ? '輸入父親生日' : '輸入母親生日'}</label><input type="date" value={formData.parentBirthDate} disabled={isLocked} onChange={(e) => setFormData({...formData, parentBirthDate: e.target.value})} className="w-full border-2 border-rose-100 rounded-[1rem] px-4 py-3 text-sm font-bold bg-white font-black font-black" /></div>
                )}
              </div>
            </div>
          </div>

          {active && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 font-black font-black">
              <div className="lg:col-span-8 space-y-8 font-black font-black">
                <div className="bg-white/90 rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-12 shadow-2xl border-2 flex flex-col items-center font-black">
                  <div className="w-full flex flex-col sm:flex-row justify-between mb-10 gap-6 font-black font-black">
                    <div className="flex items-center gap-4 justify-center sm:justify-start font-black">
                      <div className="w-20 h-20 sm:w-28 rounded-[1.5rem] text-white flex flex-col items-center justify-center relative border-4 shadow-xl font-black font-black" style={{ backgroundColor: ELEMENT_THEMES[active.elements.mainEl].primary }}><Star className="absolute -top-2 -right-2 text-yellow-300 fill-current animate-pulse font-black" size={20} /><span className="text-[7px] uppercase font-black opacity-80 font-black">渴望</span><span className="text-3xl sm:text-5xl font-black font-black">{active.sourceDream}</span></div>
                      <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase text-gray-800 font-black font-black font-black">{active.modeLabel}命盤</h2>
                    </div>
                    <div className="flex gap-3 justify-center sm:justify-end font-black font-black">
                      <button onClick={handleShare} disabled={isSharing} className="bg-emerald-600 text-white px-6 py-3 rounded-[1rem] shadow-xl font-black text-xs flex items-center gap-2 font-black"><Share2 size={16} /> 分享</button>
                      <button onClick={handleDeepReportClick} className="text-white px-8 py-3 rounded-[1rem] shadow-xl font-black text-xs font-black font-black" style={{ backgroundColor: currentTheme.primary }}>深度報告</button>
                    </div>
                  </div>
                  <div className="w-full max-w-[420px] mb-8 font-black">
                    <svg viewBox="0 0 400 450" className="w-full h-auto drop-shadow-2xl overflow-visible font-black">
                      <path d="M50 80 L200 240 L350 80 Z" fill="none" stroke={currentTheme.primary} strokeWidth="1" strokeOpacity="0.2" />
                      <SvgNumNode x={50} y={80} value={active.nums.A} label="A" elementColor="#EF4444" starPos="left-top" />
                      <SvgNumNode x={120} y={80} value={active.nums.B} label="B" elementColor="#EF4444" />
                      <SvgNumNode x={280} y={80} value={active.nums.D} label="D" elementColor="#EF4444" />
                      <SvgNumNode x={350} y={80} value={active.nums.E} label="E" elementColor="#EF4444" starPos="right-top" />
                      <SvgNumNode x={85} y={160} value={active.nums.C} label="C" elementColor="#8B5CF6" />
                      <SvgNumNode x={315} y={160} value={active.nums.F} label="F" elementColor="#8B5CF6" />
                      <SvgNumNode x={200} y={240} value={active.nums.G} label="核心" elementColor={ELEMENT_THEMES[active.elements.mainEl].primary} isCore starPos="top" />
                      <SvgNumNode x={125} y={320} value={active.nums.I} label="I" elementColor="#10B981" />
                      <SvgNumNode x={275} y={320} value={active.nums.H} label="H" elementColor="#10B981" />
                      <SvgNumNode x={200} y={400} value={active.nums.J} label="J" elementColor="#374151" />
                    </svg>
                  </div>
                  <div className="bg-gray-100/70 px-6 py-3 rounded-full flex gap-8 border border-white shadow-inner font-black font-black font-black">
                    <div className="flex items-center gap-2 font-black font-black"><span className="text-[9px] text-gray-400 font-black -rotate-90">KLM</span><div className="flex gap-1.5 font-black">{[active.nums.M, active.nums.L, active.nums.K].map((n, i) => (<span key={i} className="bg-white px-2.5 py-1 rounded-lg text-lg text-blue-600 font-mono font-black font-black">{n}</span>))}</div></div>
                    <div className="w-px bg-gray-300 h-6 self-center font-black"></div>
                    <div className="flex items-center gap-2 font-black font-black"><div className="flex gap-1.5 font-black">{[active.nums.n, active.nums.O, active.nums.P].map((n, i) => (<span key={i} className="bg-white px-2.5 py-1 rounded-lg text-lg text-orange-600 font-mono font-black font-black">{n}</span>))}</div><span className="text-[9px] text-gray-400 rotate-90 font-black">NOP</span></div>
                  </div>
                </div>

                <div className="bg-white/95 rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-12 shadow-2xl border-2 overflow-hidden font-black">
                  <h3 className="mb-8 text-xl font-black text-gray-800 tracking-tight font-black font-black">自身五行排列-留意金的位置</h3>
                  <div className="overflow-x-auto rounded-[1.5rem] border shadow-inner font-black font-black">
                    <table className="w-full text-center border-collapse min-w-[600px] font-black font-black font-black">
                      <thead className="bg-[#f9fafb] text-[11px] text-gray-400 font-black font-black">
                        <tr className="font-black font-black"><th>日</th><th>當下財富</th><th>事業</th><th>官鬼</th><th>未來財富</th></tr>
                        <tr className="border-t border-gray-100 font-black font-black"><th>己</th><th>子女錢財</th><th>伴侶</th><th>疾病</th><th>父母貴人</th></tr>
                        <tr className="border-t border-gray-100 bg-white font-black font-black"><th>我</th><th className="text-[#10b981] py-3 text-lg font-black font-black">生</th><th className="text-[#ef4444] py-3 text-lg font-black font-black">克</th><th className="text-[#ef4444] py-3 text-lg font-black font-black">克</th><th className="text-[#10b981] py-3 text-lg font-black font-black">生</th></tr>
                      </thead>
                      <tbody className="bg-white border-t-4 border-gray-50 font-black font-black">
                        <tr className="text-xl font-black font-black">{active.elements.elOrder.map((el, i) => (<td key={i} className="py-8 font-black font-black" style={{ color: ELEMENT_THEMES[el]?.primary }}>{el}</td>))}</tr>
                        <tr className="bg-gray-50/50 text-xl text-gray-700 font-black font-mono font-black font-black">{active.elements.counts.map((c, i) => (<td key={i} className="py-8 font-black">{c}</td>))}</tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8 text-center font-black font-black">
                <div className="rounded-[2.5rem] p-8 bg-rose-600 text-white shadow-xl flex flex-col items-center border-4 border-white/20 font-black font-black">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase font-black font-black"><Search size={24}/> 缺失能量</h3>
                  <div className="flex flex-wrap gap-4 sm:gap-5 justify-center font-black">
                    {active.missing.length > 0 ? active.missing.map(n => (<div key={n} className="w-14 h-14 bg-white text-rose-900 rounded-[1.2rem] flex items-center justify-center text-3xl font-black shadow-xl font-black font-black">{n}</div>)) : <div className="text-lg italic font-black uppercase font-black font-black">能量圓滿</div>}
                  </div>
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 font-black font-black">
                  <h3 className="text-lg font-black mb-8 text-gray-800 tracking-tighter font-black font-black">隱藏碼-3萬倍力量！<br/><span className="text-xs font-bold text-gray-400 font-black font-black">深度報告見內容</span></h3>
                  <div className="bg-[#fcfcfc] p-10 rounded-[2rem] border-2 flex justify-center gap-6 text-4xl sm:text-6xl font-black shadow-inner font-black font-black" style={{ color: currentTheme.primary }}>
                    <span>{active.hidden.H1}</span><span>{active.hidden.H2}</span><span>{active.hidden.H3}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="text-center py-10 opacity-40 font-black font-black font-black font-black font-black font-black font-black"><p className="text-[12px] font-bold tracking-widest font-black font-black font-black font-black font-black">[mata設計.版權所有]</p></div>
        </div>
      </div>
    </ErrorBoundary>
  );
}