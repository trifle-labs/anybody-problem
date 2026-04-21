// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Groth16Verifier {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 20491192805390485299153009773594534940189261866228447918068658471970481763042;
    uint256 constant alphay  = 9383485363053290200918347156157836566562967994039712273449902621266178545958;
    uint256 constant betax1  = 4252822878758300859123897981450591353533073413197771768651442665752259397132;
    uint256 constant betax2  = 6375614351688725206403948262868962793625744043794305715222011528459656738731;
    uint256 constant betay1  = 21847035105528745403288232691147584728191162732299865338377159692350059136679;
    uint256 constant betay2  = 10505242626370262277552901082094356697409835680220590971873171140371331206856;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 16073317037181520272191458754768969296121203493051568267668444485865521055537;
    uint256 constant deltax2 = 12027733453578076136503106192775024769923424719029685400948984155679954247979;
    uint256 constant deltay1 = 18295634773859937890749917779193400326836085183608012149652340238709221848710;
    uint256 constant deltay2 = 10582929186145260513414785456771461346508629774958610585088966388015551503224;

    
    uint256 constant IC0x = 8551694383954476817716769000603974181311137531822410793620234330766368707051;
    uint256 constant IC0y = 7190404862998478846221416527909531945623316446594383479457773311058532905;
    
    uint256 constant IC1x = 2606246439564142274964573507885999524799791190049295411624591125816143818824;
    uint256 constant IC1y = 8119756745627135921121640088593488565924128392655616660987251834684390194227;
    
    uint256 constant IC2x = 13999564087174789010273452767316166829371574172286796851671076912406294547107;
    uint256 constant IC2y = 12783900342404006823022587168181123473491492472876205763146116990390751067997;
    
    uint256 constant IC3x = 8595874619669559448546091948169390962512541417546497881722589821406636241261;
    uint256 constant IC3y = 4647749468344913256459407322665192664432127872010152963799776654552949579840;
    
    uint256 constant IC4x = 5294017964199587879597897385657066502249010843975754364804600333291953791184;
    uint256 constant IC4y = 19170139301314682207100158815900206130914327088557043253550912832545622362493;
    
    uint256 constant IC5x = 940917897778101546452683411332025521140017342401268762755498606223037818483;
    uint256 constant IC5y = 5966353534960901514945059578759470360372445447860757490163677199368129887597;
    
    uint256 constant IC6x = 21382002561652992607879103461512124846954129731823408038935197943933173949410;
    uint256 constant IC6y = 8815499514912322069161040353211926675140923706984652340524534147420242612271;
    
    uint256 constant IC7x = 15458714045614542299523422705732351222221972636152052851255044031149847268135;
    uint256 constant IC7y = 16360180050834366313156673187726871731091864884127912635349386345854750373774;
    
    uint256 constant IC8x = 15805287675810048203229529269633574952234203037061451567305172130084025563381;
    uint256 constant IC8y = 2086891431780748481783625961504044006461225139738787932052492643184815926059;
    
    uint256 constant IC9x = 3537374043940241269623160223160262953089911088921237212410604214776338451761;
    uint256 constant IC9y = 17394214497135221882090340302585672599755706200226218742928501068107302613383;
    
    uint256 constant IC10x = 9084665356021294646154000888607429356447996110534558953954364460677089605314;
    uint256 constant IC10y = 538164843162262965185565066680521749945215976784153359681737281391569297915;
    
    uint256 constant IC11x = 9841758684079179925690510262528362795903969420441132976812591334577989107021;
    uint256 constant IC11y = 19639445949388542595199479548274147347556993526962299156323056679166816995831;
    
    uint256 constant IC12x = 17465710709381114978165140023525318289665862792526215044320530645619888769081;
    uint256 constant IC12y = 15901811628949729861266705289354089849572974449410902616256168483937560151129;
    
    uint256 constant IC13x = 20776628544829232249490536540869503142429770092831004767199336860692468323324;
    uint256 constant IC13y = 18651076101718920796655264448713818244306986666556010759046778182296346227395;
    
    uint256 constant IC14x = 11712904965269404704355966301986956427875304261624837834102923976128582396362;
    uint256 constant IC14y = 19860687712495809008644502385457490295107424269249801118912040897931461325750;
    
    uint256 constant IC15x = 21505009959253078735797089912012675301796127244503787919957102219231225996285;
    uint256 constant IC15y = 3331287577753887902504306493926146442212915100530277641959174107451057333413;
    
    uint256 constant IC16x = 7062713956665922723551548290011529087856111940604883555477000099294784539049;
    uint256 constant IC16y = 1841827928082052823613576309324941145813022979806057336912482666426675149761;
    
    uint256 constant IC17x = 3018076684271394983447100612962950727932403025847551198594189788366716506553;
    uint256 constant IC17y = 11384799694640211175850850517318789298944890088945841179904074797254058024313;
    
    uint256 constant IC18x = 18865989826047021446372788618403547051730097573435485016214493705091565729261;
    uint256 constant IC18y = 639631814794661201742551184321169279068248393368447265526431470692143456956;
    
    uint256 constant IC19x = 12288797357725364357874415267046720945059604176944986716125149397596380165841;
    uint256 constant IC19y = 644764353259306399922304060880082766860350613584602723978550483026165320778;
    
    uint256 constant IC20x = 4919309084766715711177792271231143604498062595590295540218660557173286907584;
    uint256 constant IC20y = 10204859420535182935101820302681026742249845639925037134821787796468765701893;
    
    uint256 constant IC21x = 18134096466965348298420177228163924705264634872214202826540424353581574595061;
    uint256 constant IC21y = 3311791060425071942838668223157124419733359548877830786755939557933282532937;
    
    uint256 constant IC22x = 8071339696401630163544726587746459299451812671467517995565744107355849340897;
    uint256 constant IC22y = 6644469614634906161781970150311609619775905418834281565072656503352519654595;
    
    uint256 constant IC23x = 6226363530678650713208774912600968778752195024143868180839617886336876801528;
    uint256 constant IC23y = 19080003008694548584192208105433772699113164765680165745080493694676493985634;
    
    uint256 constant IC24x = 6432935066576978895042032855985911210599416074411890956884787528375449167946;
    uint256 constant IC24y = 21581651202140618687195246902952229192818411789718103830992187833433592338528;
    
    uint256 constant IC25x = 20573507038938182076688268206142409217835837335995527057352341526676817176771;
    uint256 constant IC25y = 10672888853762712127043148078037576172408710456416688864798923942428720944618;
    
    uint256 constant IC26x = 10398087856042333495628041987739938569340255091319042357601244375555389541870;
    uint256 constant IC26y = 21275302455989807514264009348510901509328514332678090736151025248544825993066;
    
    uint256 constant IC27x = 5251129533869662886591044456162118339126173083530937461892553789105479343874;
    uint256 constant IC27y = 16238790925235958078226419165361891154936303835607060987150580476765718983200;
    
    uint256 constant IC28x = 6208102485957852611610594524733194335640356414699563482207526901756907583083;
    uint256 constant IC28y = 14449880769518733087433395396318675806778604782475756756987436466923722268201;
    
    uint256 constant IC29x = 562752390789302880918182146141666938428944125925911182515131179025365830984;
    uint256 constant IC29y = 15732564583791476908074534091416649318653530106550121234161698326924206107809;
    
    uint256 constant IC30x = 18675912929868611384667209189561162452212340893116917942270242605271450655244;
    uint256 constant IC30y = 7984698971815663919454878554739821023494861801478689164266371367221391808639;
    
    uint256 constant IC31x = 19669601786686161937630283768622821189827408683846342893003399937890141069103;
    uint256 constant IC31y = 20398777562222353454189748219432643572490363453807164110555099364417412826938;
    
    uint256 constant IC32x = 18079915361449619977106617140877197274571220306265081435609788712598950609827;
    uint256 constant IC32y = 5216156220728464155168797347684428895336486038586004199441468842719324982143;
    
    uint256 constant IC33x = 6864172258902413223780017066537642786786146428721279840324771792281153702190;
    uint256 constant IC33y = 6160236744546180861904272284744271803929636304890913110018386684596160514278;
    
    uint256 constant IC34x = 12976433283860816541382486870569799629544422672126180413288442419050776786789;
    uint256 constant IC34y = 16327489288660431356189165550289584341643944170800934844535866440696110536459;
    
    uint256 constant IC35x = 13122362396586277951170712899198308865736125979001834626630346807713915425849;
    uint256 constant IC35y = 13282326565643400656554164193761800363574749399492992626872438794209422069276;
    
    uint256 constant IC36x = 6064186140100580715607781188585260921251760136150664473217018814924829398211;
    uint256 constant IC36y = 728779689216682514211607870492981227298963932499671886014553072996538339774;
    
    uint256 constant IC37x = 17260788306884015943450614963155351804731453356297895997913780711828578949941;
    uint256 constant IC37y = 12836635219001791664750551749972393442165809250706093102897842911986568853469;
    
    uint256 constant IC38x = 16614924414171945408041265872896665239673896772334251597097096257023223733173;
    uint256 constant IC38y = 14329652646087616245412443260873208822034893811341228404052192235276891706880;
    
    uint256 constant IC39x = 4545999994268006223226838258006834884584531329886208357199420632102324065982;
    uint256 constant IC39y = 10637227503884527524306342389180498812912463444254421124379178936256506760030;
    
    uint256 constant IC40x = 8186500483790832623392947747210974614059276577576230905284670503935073789964;
    uint256 constant IC40y = 19172728048511785851955139343165538183698848380177577429182097860465037507547;
    
    uint256 constant IC41x = 10145252542853894703524765717244912912437138976399041018897631528842900239244;
    uint256 constant IC41y = 17054650847952122600540347857590263534054913353884854094655690098700484954019;
    
    uint256 constant IC42x = 2205063993642600531963677857751228259399801200305694890489112352444077144878;
    uint256 constant IC42y = 10782349144652269409118016268201518250518122197815351564745308956243732996491;
    
    uint256 constant IC43x = 665644549380590752487412936106964263137577546099618252930113590478629655284;
    uint256 constant IC43y = 15354943295898400006773601521502207034367432414437621715526746833779793815688;
    
    uint256 constant IC44x = 20510442836844184503909606012366060183495410922994283624479713537109488745021;
    uint256 constant IC44y = 12725378010827548086957028701578651002901437258289471442812711099550746505337;
    
    uint256 constant IC45x = 12159984249081671726645089146861358898509441335049095697465512053899152148260;
    uint256 constant IC45y = 11106586214747543510776430125244395552869190933715552778547855442070765334603;
    
    uint256 constant IC46x = 17359637182078940794547897109515649345280276209305689022999390583104789615147;
    uint256 constant IC46y = 8192161745124705174363721649715328080502465677977579979730817315416856867758;
    
    uint256 constant IC47x = 1292281497215294005903267436669833706349825437612575899975773460242534105953;
    uint256 constant IC47y = 9737616418861570642813577800022211849195517722980874240428101811720119529110;
    
    uint256 constant IC48x = 20601174235198633077589152367272401007134257079958814647413391784347456328283;
    uint256 constant IC48y = 9889253821212952105409050845913306564798245889027935262289592598258596299867;
    
    uint256 constant IC49x = 22768843337103325000722103398360707191283014711382564306247997370200816301;
    uint256 constant IC49y = 14025390679013911090779222928340489607789833912211995282964392987989797183763;
    
    uint256 constant IC50x = 11919137503649668940640735835995713153122938638522251537414229968588221483651;
    uint256 constant IC50y = 2964126149372111337490104152029144465177207118339828598547838539946082788031;
    
    uint256 constant IC51x = 4240643880089091025300679302554544317369663402558556779157189649942175169028;
    uint256 constant IC51y = 4391851317464818356400022308444499580906123118215669880382463086849928183691;
    
    uint256 constant IC52x = 14000129196114942252128068260561002499431858119785492101467451453512043313085;
    uint256 constant IC52y = 21592383399132955018039641087591300805098345629769020730635234605735074972502;
    
    uint256 constant IC53x = 12620747922648146236461209590337854449057952241172172512406076243764175632876;
    uint256 constant IC53y = 12279863414578865513621242734909405401541500433413543654018929457646273275219;
    
    uint256 constant IC54x = 13093772790038806135606714476842042274574641569963286556394543458626322247066;
    uint256 constant IC54y = 2706909436065205490071457584323541745728955238317995167744301196546626061735;
    
    uint256 constant IC55x = 8553896252705971563254711064364216762053671299784104580410460533229855971171;
    uint256 constant IC55y = 16443773525065197502907326359272383582402985418989565124079570942940523052224;
    
    uint256 constant IC56x = 16464533065072871693315839093071851080336065171195039960271606270461363695489;
    uint256 constant IC56y = 17039006167424758761213320852255743843696395269007320137733692247461274593412;
    
    uint256 constant IC57x = 13828611968825782952760078571983882238512875209593492106418674617895228134464;
    uint256 constant IC57y = 17068062162866351146478121777924864553678469281129945789862032449867411862175;
    
    uint256 constant IC58x = 10068267712271355557640866069145744380918732979195808941958388575683578067344;
    uint256 constant IC58y = 63521931051464190068274359210700848051678754313200021394733844009994375522;
    
    uint256 constant IC59x = 18556185995114505363342143761867159440522683393417012028199871019180148363900;
    uint256 constant IC59y = 15189523042386144113934295578172725130092952278694882949757394508840597320829;
    
    uint256 constant IC60x = 1970272261256033867193235936495061507448632027827463723321558467256320831500;
    uint256 constant IC60y = 19462964029822104253046629165745133116974834771689739072574177396554240732290;
    
    uint256 constant IC61x = 5448338199913000383080955638927444431497319953387149270265571744888398944848;
    uint256 constant IC61y = 4735794170920302077087849612463794260113485640382460118386246760220489411011;
    
    uint256 constant IC62x = 6680674217748945820351940097050976222945514598056285086624773838802449315483;
    uint256 constant IC62y = 4481687999612578361917498625716207290176436858388810157673172316454196030117;
    
    uint256 constant IC63x = 15532180621901402826090543231870208615945153156259159662159234533670207681190;
    uint256 constant IC63y = 11800039078932417000267033767284744733819796320273277873899643975553862830402;
    
    uint256 constant IC64x = 10586500295531282481270542071481101942868376787870922743823752938165548173987;
    uint256 constant IC64y = 17943289036923760536983856658803364026965474553433463545582862625753016088157;
    
    uint256 constant IC65x = 2907242886802868757794845192130868335844270955889465960578311670157080040750;
    uint256 constant IC65y = 19852023170355225150186922220058288762782862321300526267704023704274458510054;
    
    uint256 constant IC66x = 11475440587569164366427494444028572273739119044072502582185803573205674534359;
    uint256 constant IC66y = 21850926965201441580592707646178900592463673622222571620811510043038777710760;
    
    uint256 constant IC67x = 8879989683972487465973916928861624175009641492805241571386053275704307199311;
    uint256 constant IC67y = 14899759631679734194185979140294096712421961460249214895599528881491792608075;
    
    uint256 constant IC68x = 21803082723223733678703606003379413884071618975902636860204192610800340435542;
    uint256 constant IC68y = 20962794259552772484470468426355391556375880255018757867631161586538816703870;
    
    uint256 constant IC69x = 4775905992504089181383977196258629150043165404644960308096112889515958163697;
    uint256 constant IC69y = 17786288767493387191586252911232848542784909122189137044650243497960571019873;
    
    uint256 constant IC70x = 20813983006782560912760541317862461926765108116322527684482150167375985650832;
    uint256 constant IC70y = 14595629778943300591538921377017147359641354911973270445411103822008803989965;
    
    uint256 constant IC71x = 17832683151843825966772766274417815094850780443955692308718209811931511687642;
    uint256 constant IC71y = 3833589439812715050767090907221927665904507415900763849922086521091553467720;
    
    uint256 constant IC72x = 20918198385099258269876982304592174933205767703149361661418916659003129982795;
    uint256 constant IC72y = 21653017040787599711341336762130784573014521188374517402136946152517256135174;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[72] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, q)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                
                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))
                
                g1_mulAccC(_pVk, IC3x, IC3y, calldataload(add(pubSignals, 64)))
                
                g1_mulAccC(_pVk, IC4x, IC4y, calldataload(add(pubSignals, 96)))
                
                g1_mulAccC(_pVk, IC5x, IC5y, calldataload(add(pubSignals, 128)))
                
                g1_mulAccC(_pVk, IC6x, IC6y, calldataload(add(pubSignals, 160)))
                
                g1_mulAccC(_pVk, IC7x, IC7y, calldataload(add(pubSignals, 192)))
                
                g1_mulAccC(_pVk, IC8x, IC8y, calldataload(add(pubSignals, 224)))
                
                g1_mulAccC(_pVk, IC9x, IC9y, calldataload(add(pubSignals, 256)))
                
                g1_mulAccC(_pVk, IC10x, IC10y, calldataload(add(pubSignals, 288)))
                
                g1_mulAccC(_pVk, IC11x, IC11y, calldataload(add(pubSignals, 320)))
                
                g1_mulAccC(_pVk, IC12x, IC12y, calldataload(add(pubSignals, 352)))
                
                g1_mulAccC(_pVk, IC13x, IC13y, calldataload(add(pubSignals, 384)))
                
                g1_mulAccC(_pVk, IC14x, IC14y, calldataload(add(pubSignals, 416)))
                
                g1_mulAccC(_pVk, IC15x, IC15y, calldataload(add(pubSignals, 448)))
                
                g1_mulAccC(_pVk, IC16x, IC16y, calldataload(add(pubSignals, 480)))
                
                g1_mulAccC(_pVk, IC17x, IC17y, calldataload(add(pubSignals, 512)))
                
                g1_mulAccC(_pVk, IC18x, IC18y, calldataload(add(pubSignals, 544)))
                
                g1_mulAccC(_pVk, IC19x, IC19y, calldataload(add(pubSignals, 576)))
                
                g1_mulAccC(_pVk, IC20x, IC20y, calldataload(add(pubSignals, 608)))
                
                g1_mulAccC(_pVk, IC21x, IC21y, calldataload(add(pubSignals, 640)))
                
                g1_mulAccC(_pVk, IC22x, IC22y, calldataload(add(pubSignals, 672)))
                
                g1_mulAccC(_pVk, IC23x, IC23y, calldataload(add(pubSignals, 704)))
                
                g1_mulAccC(_pVk, IC24x, IC24y, calldataload(add(pubSignals, 736)))
                
                g1_mulAccC(_pVk, IC25x, IC25y, calldataload(add(pubSignals, 768)))
                
                g1_mulAccC(_pVk, IC26x, IC26y, calldataload(add(pubSignals, 800)))
                
                g1_mulAccC(_pVk, IC27x, IC27y, calldataload(add(pubSignals, 832)))
                
                g1_mulAccC(_pVk, IC28x, IC28y, calldataload(add(pubSignals, 864)))
                
                g1_mulAccC(_pVk, IC29x, IC29y, calldataload(add(pubSignals, 896)))
                
                g1_mulAccC(_pVk, IC30x, IC30y, calldataload(add(pubSignals, 928)))
                
                g1_mulAccC(_pVk, IC31x, IC31y, calldataload(add(pubSignals, 960)))
                
                g1_mulAccC(_pVk, IC32x, IC32y, calldataload(add(pubSignals, 992)))
                
                g1_mulAccC(_pVk, IC33x, IC33y, calldataload(add(pubSignals, 1024)))
                
                g1_mulAccC(_pVk, IC34x, IC34y, calldataload(add(pubSignals, 1056)))
                
                g1_mulAccC(_pVk, IC35x, IC35y, calldataload(add(pubSignals, 1088)))
                
                g1_mulAccC(_pVk, IC36x, IC36y, calldataload(add(pubSignals, 1120)))
                
                g1_mulAccC(_pVk, IC37x, IC37y, calldataload(add(pubSignals, 1152)))
                
                g1_mulAccC(_pVk, IC38x, IC38y, calldataload(add(pubSignals, 1184)))
                
                g1_mulAccC(_pVk, IC39x, IC39y, calldataload(add(pubSignals, 1216)))
                
                g1_mulAccC(_pVk, IC40x, IC40y, calldataload(add(pubSignals, 1248)))
                
                g1_mulAccC(_pVk, IC41x, IC41y, calldataload(add(pubSignals, 1280)))
                
                g1_mulAccC(_pVk, IC42x, IC42y, calldataload(add(pubSignals, 1312)))
                
                g1_mulAccC(_pVk, IC43x, IC43y, calldataload(add(pubSignals, 1344)))
                
                g1_mulAccC(_pVk, IC44x, IC44y, calldataload(add(pubSignals, 1376)))
                
                g1_mulAccC(_pVk, IC45x, IC45y, calldataload(add(pubSignals, 1408)))
                
                g1_mulAccC(_pVk, IC46x, IC46y, calldataload(add(pubSignals, 1440)))
                
                g1_mulAccC(_pVk, IC47x, IC47y, calldataload(add(pubSignals, 1472)))
                
                g1_mulAccC(_pVk, IC48x, IC48y, calldataload(add(pubSignals, 1504)))
                
                g1_mulAccC(_pVk, IC49x, IC49y, calldataload(add(pubSignals, 1536)))
                
                g1_mulAccC(_pVk, IC50x, IC50y, calldataload(add(pubSignals, 1568)))
                
                g1_mulAccC(_pVk, IC51x, IC51y, calldataload(add(pubSignals, 1600)))
                
                g1_mulAccC(_pVk, IC52x, IC52y, calldataload(add(pubSignals, 1632)))
                
                g1_mulAccC(_pVk, IC53x, IC53y, calldataload(add(pubSignals, 1664)))
                
                g1_mulAccC(_pVk, IC54x, IC54y, calldataload(add(pubSignals, 1696)))
                
                g1_mulAccC(_pVk, IC55x, IC55y, calldataload(add(pubSignals, 1728)))
                
                g1_mulAccC(_pVk, IC56x, IC56y, calldataload(add(pubSignals, 1760)))
                
                g1_mulAccC(_pVk, IC57x, IC57y, calldataload(add(pubSignals, 1792)))
                
                g1_mulAccC(_pVk, IC58x, IC58y, calldataload(add(pubSignals, 1824)))
                
                g1_mulAccC(_pVk, IC59x, IC59y, calldataload(add(pubSignals, 1856)))
                
                g1_mulAccC(_pVk, IC60x, IC60y, calldataload(add(pubSignals, 1888)))
                
                g1_mulAccC(_pVk, IC61x, IC61y, calldataload(add(pubSignals, 1920)))
                
                g1_mulAccC(_pVk, IC62x, IC62y, calldataload(add(pubSignals, 1952)))
                
                g1_mulAccC(_pVk, IC63x, IC63y, calldataload(add(pubSignals, 1984)))
                
                g1_mulAccC(_pVk, IC64x, IC64y, calldataload(add(pubSignals, 2016)))
                
                g1_mulAccC(_pVk, IC65x, IC65y, calldataload(add(pubSignals, 2048)))
                
                g1_mulAccC(_pVk, IC66x, IC66y, calldataload(add(pubSignals, 2080)))
                
                g1_mulAccC(_pVk, IC67x, IC67y, calldataload(add(pubSignals, 2112)))
                
                g1_mulAccC(_pVk, IC68x, IC68y, calldataload(add(pubSignals, 2144)))
                
                g1_mulAccC(_pVk, IC69x, IC69y, calldataload(add(pubSignals, 2176)))
                
                g1_mulAccC(_pVk, IC70x, IC70y, calldataload(add(pubSignals, 2208)))
                
                g1_mulAccC(_pVk, IC71x, IC71y, calldataload(add(pubSignals, 2240)))
                
                g1_mulAccC(_pVk, IC72x, IC72y, calldataload(add(pubSignals, 2272)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            
            checkField(calldataload(add(_pubSignals, 32)))
            
            checkField(calldataload(add(_pubSignals, 64)))
            
            checkField(calldataload(add(_pubSignals, 96)))
            
            checkField(calldataload(add(_pubSignals, 128)))
            
            checkField(calldataload(add(_pubSignals, 160)))
            
            checkField(calldataload(add(_pubSignals, 192)))
            
            checkField(calldataload(add(_pubSignals, 224)))
            
            checkField(calldataload(add(_pubSignals, 256)))
            
            checkField(calldataload(add(_pubSignals, 288)))
            
            checkField(calldataload(add(_pubSignals, 320)))
            
            checkField(calldataload(add(_pubSignals, 352)))
            
            checkField(calldataload(add(_pubSignals, 384)))
            
            checkField(calldataload(add(_pubSignals, 416)))
            
            checkField(calldataload(add(_pubSignals, 448)))
            
            checkField(calldataload(add(_pubSignals, 480)))
            
            checkField(calldataload(add(_pubSignals, 512)))
            
            checkField(calldataload(add(_pubSignals, 544)))
            
            checkField(calldataload(add(_pubSignals, 576)))
            
            checkField(calldataload(add(_pubSignals, 608)))
            
            checkField(calldataload(add(_pubSignals, 640)))
            
            checkField(calldataload(add(_pubSignals, 672)))
            
            checkField(calldataload(add(_pubSignals, 704)))
            
            checkField(calldataload(add(_pubSignals, 736)))
            
            checkField(calldataload(add(_pubSignals, 768)))
            
            checkField(calldataload(add(_pubSignals, 800)))
            
            checkField(calldataload(add(_pubSignals, 832)))
            
            checkField(calldataload(add(_pubSignals, 864)))
            
            checkField(calldataload(add(_pubSignals, 896)))
            
            checkField(calldataload(add(_pubSignals, 928)))
            
            checkField(calldataload(add(_pubSignals, 960)))
            
            checkField(calldataload(add(_pubSignals, 992)))
            
            checkField(calldataload(add(_pubSignals, 1024)))
            
            checkField(calldataload(add(_pubSignals, 1056)))
            
            checkField(calldataload(add(_pubSignals, 1088)))
            
            checkField(calldataload(add(_pubSignals, 1120)))
            
            checkField(calldataload(add(_pubSignals, 1152)))
            
            checkField(calldataload(add(_pubSignals, 1184)))
            
            checkField(calldataload(add(_pubSignals, 1216)))
            
            checkField(calldataload(add(_pubSignals, 1248)))
            
            checkField(calldataload(add(_pubSignals, 1280)))
            
            checkField(calldataload(add(_pubSignals, 1312)))
            
            checkField(calldataload(add(_pubSignals, 1344)))
            
            checkField(calldataload(add(_pubSignals, 1376)))
            
            checkField(calldataload(add(_pubSignals, 1408)))
            
            checkField(calldataload(add(_pubSignals, 1440)))
            
            checkField(calldataload(add(_pubSignals, 1472)))
            
            checkField(calldataload(add(_pubSignals, 1504)))
            
            checkField(calldataload(add(_pubSignals, 1536)))
            
            checkField(calldataload(add(_pubSignals, 1568)))
            
            checkField(calldataload(add(_pubSignals, 1600)))
            
            checkField(calldataload(add(_pubSignals, 1632)))
            
            checkField(calldataload(add(_pubSignals, 1664)))
            
            checkField(calldataload(add(_pubSignals, 1696)))
            
            checkField(calldataload(add(_pubSignals, 1728)))
            
            checkField(calldataload(add(_pubSignals, 1760)))
            
            checkField(calldataload(add(_pubSignals, 1792)))
            
            checkField(calldataload(add(_pubSignals, 1824)))
            
            checkField(calldataload(add(_pubSignals, 1856)))
            
            checkField(calldataload(add(_pubSignals, 1888)))
            
            checkField(calldataload(add(_pubSignals, 1920)))
            
            checkField(calldataload(add(_pubSignals, 1952)))
            
            checkField(calldataload(add(_pubSignals, 1984)))
            
            checkField(calldataload(add(_pubSignals, 2016)))
            
            checkField(calldataload(add(_pubSignals, 2048)))
            
            checkField(calldataload(add(_pubSignals, 2080)))
            
            checkField(calldataload(add(_pubSignals, 2112)))
            
            checkField(calldataload(add(_pubSignals, 2144)))
            
            checkField(calldataload(add(_pubSignals, 2176)))
            
            checkField(calldataload(add(_pubSignals, 2208)))
            
            checkField(calldataload(add(_pubSignals, 2240)))
            
            checkField(calldataload(add(_pubSignals, 2272)))
            
            checkField(calldataload(add(_pubSignals, 2304)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
