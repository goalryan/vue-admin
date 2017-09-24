/**
 * Created by liushaojun on 2017/9/22.
 */
const CUS_DOC_NO_LIST = "CusDocNoList";
export default {
    fetchCustomers() {
        return [
            {name: '王珍珍', phone: '15200682875', address: '湖南省常德市汉寿县烈士公园水电安装宿舍201'},
            {name: '王敏羲', phone: '15969092397', address: '云南省红河哈尼族彝族自治州个旧市大屯镇浴场路39号'},
            {name: '肖家文', phone: '18777317722', address: '广西壮族自治区桂林市恭城瑶族自治县多艺墙纸'},
            {name: '李芮', phone: '18574302287', address: '湖南省株洲市天元区湖南工业大学新校区'},
            {name: '孔瑶', phone: '18573991643', address: '四川省成都市双流县西航港街道大件路文星段168号西南民族大学航空港校区'},
            {name: '杨军', phone: '13606769885', address: '浙江省台州市路桥区新桥镇前七份村安置小区篮球场对面'},
            {name: '陈静茹', phone: '15207008237', address: '江西省鹰潭市月湖区梅枫路10号核工和谐小区'},
            {name: '韩礼', phone: '18670057008', address: '湖南省长沙市望城区金山桥社区街道乌龙塘重建地第六排鸿运批发超市'},
            {name: '郑燕', phone: '18873670128', address: '湖南省常德市石门外贸居家养老中心'},
            {name: '胡翠莉', phone: '13510681961', address: '广东省深圳市南山区华润城润府一期3栋26C'},
            {name: '苏富娟', phone: '13979821213', address: '江西省景德镇市昌江广场四季春晖17#701'},
            {name: '陈润富', phone: '13927721849', address: '广东省佛山市禅城区南庄镇季华西路瓷海国际C22座1-6号博成陶瓷'},
            {name: '贺雯雯', phone: '15874683575', address: '湖南省永州市零陵区杨梓塘路130号湖南科技学院'},
            {name: '肖祥双', phone: '18750539208', address: '福建省泉州市晋江市陈埭镇沟西碧林鞋业有限公司'},
            {name: '龙盼', phone: '13689518603', address: '广东省深圳市南山区科苑南路三湘海尚写字楼E座9D'},
            {name: '杨珺', phone: '18852891349', address: '江苏省镇江市京口区江苏大学b区3栋'},
            {name: '林晓玲', phone: '15980195295', address: '福建省福州市平潭县北厝镇人民政府'},
            {name: '陈亮', phone: '18605661067', address: '广东省东莞市东坑镇华步塘46号东莞市法拉欧电器有限公司采购部'},
            {name: '贺丹', phone: '18218767677', address: '广东省深圳市福田区上沙龙秋村9巷5号1101'},
            {name: '吉玉燕', phone: '18751480908', address: '江苏省扬州市宝应县曹甸镇快递自取'},
            {name: '赵依情', phone: '15616182099', address: '湖南省长沙市长沙县黄花镇自提'},
            {name: '刘丹', phone: '18873623055', address: '湖南省常德市石门县人民医院德馨楼18楼'},
            {name: '王霞', phone: '13510718581', address: '广东省东莞常平桥沥万科城观湖3栋3002'},
            {name: '谭妙', phone: '15019413310', address: '广东省深圳市龙岗区布吉科技园路29号润祥家园F栋5B'},
            {name: '赵静', phone: '13902899375', address: '广东省佛山市禅城区湖景路18号恒福湖景湾'},
            {name: '吴文辉', phone: '13422219530', address: '广东省广州市白云区京溪街道沙太中路668之维也纳智好酒店'},
            {name: '李清', phone: '18423339652', address: '重庆市万州区五桥街道张家湾居委会2号楼1单元602'},
            {name: '覃奇璇', phone: '15773150492', address: '湖南省长沙市岳麓区咸嘉湖路省肿瘤医院职工小区13栋'},
            {name: '陈球', phone: '15974223459', address: '湖南省长沙市岳麓区雷锋镇鸭婆塘4栋3门浏河源店'},
            {name: '张英溶', phone: '15027186694', address: '湖北省武汉市粮道街办事处湖北中医药大学昙华林校区21栋'},
            {name: '熊斌', phone: '18890706396', address: '湖南省常德市鼎城区经济技术开发区德山大道325号金德镭射科技有限公司'},
            {name: '李燕伶', phone: '18084867622', address: '四川省成都市郫县红光镇宋家林村九组'},
            {name: '黄娟', phone: '15197667101', address: '湖南省常德市第四人民医院妇产科六楼'},
            {name: '陈漫漫', phone: '18169253118', address: '湖南省常德市石门县楚江镇融聚雅苑一栋'},
            {name: '李青', phone: '13872227121', address: '湖北省荆州市沙市区美林湖畔小区10栋507'},
            {name: '廖敏', phone: '18142602186', address: '湖南省长沙市宁乡二环路玉虹蓝庭国际城3栋1405'},
            {name: '覃叔英', phone: '15115655037', address: '湖南省常德市石门县楚江镇老西门连杆家属区'},
            {name: '曹丽群', phone: '13829738692', address: '广东省广州市花都区狮岭镇义坑南新村南方驾校利进皮具'},
            {name: '唐芳', phone: '18974255318', address: '湖南省常德市石门县夹山镇杨萍市场'},
            {name: '唐萍梅', phone: '15814201799', address: '广东省东莞市厚街新糖新兴路胜和公寓'},
            {name: '颜塞南', phone: '13824398578', address: '广东省深圳市宝安区沙井北方永发上寮科技园D2栋三楼'},
            {name: '陈静怡', phone: '18152679775', address: '四川省成都市郫县西南交通大学犀浦校区'},
            {name: '胡巧宏', phone: '13874735194', address: '湖南省永州市零陵区湖南科技学院'},
            {name: '七宝', phone: '13217466534', address: '湖南省永州市零陵区湖南科技学院'},
            {name: '陈良', phone: '18621567466', address: '上海市普陀区宜川二村179号102室'},
            {name: '朱浪平', phone: '13874942237', address: '湖南省长沙市岳麓区岳华路458号车管车务'},
            {name: '周蕾 ', phone: '15820105758', address: '广东省韶关市曲江区马坝镇南华馨苑5栋'},
            {name: '代佳佳', phone: '15001909516', address: '湖南省怀化市溆浦县警预路白马服饰楼上一单元902室'},
            {name: '杨小颖', phone: '13576311082', address: '江西省上饶市余干县沙窝街230号'},
            {name: '贺娟', phone: '18173601792', address: '湖南省常德市石门县江南康城一期门卫'},
            {name: '朱小姐', phone: '13928458121', address: '广东省深圳市龙华新区观澜街道樟坑径村盛通工业园一栋三楼  '},
            {name: '张帆', phone: '15217553859', address: '广东省佛山市南海区狮山镇大涡塘工业区张冯便利店(即树和家具厂对面小店)'},
            {name: '杨静', phone: '13683381251', address: '河北省廊坊市燕郊镇上上城五期北院4-4-1303'},
            {name: '郑燕', phone: '18873670128', address: '湖南省常德市石门县外贸新雅家园卓美纹绣'},
            {name: '刘正南', phone: '15273453896', address: '广东省深圳市龙岗区宝龙比亚迪26栋'},
            {name: '陈梅', phone: '15574098999', address: '湖南省益阳市赫山区秀峰西路太平洋财产险保险'},
            {name: '张淑娟', phone: '18273606522', address: '湖南省常德市桃源县青林村青林一组'},
            {name: '陆洁静', phone: '15038528336', address: '北京市顺义区空港物流基地顺航路12号客服部 '},
            {name: '杨小凡', phone: '18627398822', address: '湖南省长沙市岳麓区桐梓坡路恒万西溪里A栋432'},
            {name: '查曼婷', phone: '18905563202', address: '安徽省安庆市怀宁县马庙镇马庙邮政局(查曼婷)'},
            {name: '林欢彤', phone: '15918904362', address: '广东省汕头市澄海区东里镇观一村新宫秦牧路2号'},
            {name: '蔡丽', phone: '18273620899', address: '湖南省常德市石门县人民医院博爱楼9楼妇科'},
            {name: '韩礼', phone: '18670057008', address: '湖南省长沙市望城区金山桥社区街道乌龙塘重建地第六排鸿运批发超市'},
            {name: '龙盼', phone: '13689518603', address: '广东省深圳市南山区科苑南路三湘海尚写字楼E座9D'},
            {name: '陈亮', phone: '18605661067', address: '广东省东莞市东坑镇华步塘46号东莞市法拉欧电器有限公司采购部'},
            {name: '赵静', phone: '13902899375', address: '广东省佛山市禅城区湖景路18号恒福湖景湾'},
            {name: '覃叔英', phone: '15115655037', address: '湖南省常德市石门县楚江镇老西门连杆家属区'},
            {name: '冯莘岚', phone: '13970165260', address: '江西省鹰潭市月湖区梅园街道滨江广场16栋'},
            {name: '王武略', phone: '15826653600', address: '湖北省荆州市石首市建宁大道石狮路6号'}]
        // return JSON.parse(window.localStorage.getItem(
        //     CUS_DOC_NO_LIST || "[]"))
    },
    fetchCustomersByPhone(phone) {

    },
}
