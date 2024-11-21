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
    uint256 constant deltax1 = 16917939319533639033905906830382289971887862525362224529676404659291144550116;
    uint256 constant deltax2 = 18765461185213949420049264448733379590972052650478791931654018597412919351098;
    uint256 constant deltay1 = 5712293378830819223875806445866045618443731001734933600378415641998020223602;
    uint256 constant deltay2 = 18911492584096800608957481359012436477027397758682701067026887045533769701498;

    
    uint256 constant IC0x = 19078512625388927704828690063330620922375395404872927619758529744564249791247;
    uint256 constant IC0y = 12719561926853135444293139752461643469028601984263451289098742735487507212660;
    
    uint256 constant IC1x = 9130001238863704857921691170160043102089094735862511153947092666368575693668;
    uint256 constant IC1y = 17170255394106001801056982845033671857356922397691300602823773817593584379826;
    
    uint256 constant IC2x = 10774177704917788704719403144860328873609315968436244614867158416771694712062;
    uint256 constant IC2y = 17815427645177310380541961290232881173262213727628556251132397203197931188660;
    
    uint256 constant IC3x = 14559218746862032213298649054116797845984942479286185168446682796175583502156;
    uint256 constant IC3y = 14790897541045846754063817211963345457419646815972593740549102953560728110308;
    
    uint256 constant IC4x = 17892666742377416907845778309232127435446142612979690168162520045637509271205;
    uint256 constant IC4y = 17366248965612923998859471869827551754132894549901012382748704025647275143762;
    
    uint256 constant IC5x = 5715363708553419584526905739951090732528531168440165099755728793078721456234;
    uint256 constant IC5y = 5342485145645491408887250140378099343167791147933802153732215456294318550915;
    
    uint256 constant IC6x = 4862783642675781423025768496405199600424087990592685173611610816878859915916;
    uint256 constant IC6y = 869584502413634186095160013625018231832369308599864305212218755890369303432;
    
    uint256 constant IC7x = 15018264942853052119126841307993026349905082342390194534436763430382949652769;
    uint256 constant IC7y = 14515775334429651249123211277086670475481883213554588512859473586323363707351;
    
    uint256 constant IC8x = 2424340040398092677770462430457690575299303776007020244550324628583363787340;
    uint256 constant IC8y = 4734778465461961321504805018458879099366733226813599223642225653754291057830;
    
    uint256 constant IC9x = 8157826627839201911925674833383918780645892439037987909190108090244257057770;
    uint256 constant IC9y = 1436197399039885314894172037113300286827447948478440387172918156716251311541;
    
    uint256 constant IC10x = 9789317472864573819887959471096587052865274429099173420765210178039441862988;
    uint256 constant IC10y = 14944519506299063255582348685526186844339048179311055960116154257742709873842;
    
    uint256 constant IC11x = 9716137981059100404002096774127417944654618371351003631625302029298256441871;
    uint256 constant IC11y = 5859430396863885762503812355624757192334883591689131990684307726053283496352;
    
    uint256 constant IC12x = 3843212750384807131444681083107990961178253313858266559376723190642074079995;
    uint256 constant IC12y = 2703750133276803849702477407039365039431047171781424040761311230577361311900;
    
    uint256 constant IC13x = 14644209001555905819864577731865172979391678069806955863039554655782570122211;
    uint256 constant IC13y = 16559306724612808154890110800835948246052720733782468053779510874420443751713;
    
    uint256 constant IC14x = 13365634568497689118847804350376106616366782140232147586347620031641572939334;
    uint256 constant IC14y = 13444786690892818084725936905187474594314320732540536315763545531184153543731;
    
    uint256 constant IC15x = 15040594960087785978746215274308035734096716348407203495103217883955650595711;
    uint256 constant IC15y = 4705744210311831632311648126459703815023716984707436479701730696209915456570;
    
    uint256 constant IC16x = 20416146435755543764914496094244852227338246339555631744295317739568391106957;
    uint256 constant IC16y = 689215034331079894021908538915551363823019493917101838470685636513383122371;
    
    uint256 constant IC17x = 17883123920170023570107787478975117249160795363790691118889887524661916783716;
    uint256 constant IC17y = 20003845600351524661509551617960989688173552121544857291219502208694449732718;
    
    uint256 constant IC18x = 16993190517476457200325560660462304174105469783551019279159915415995600238859;
    uint256 constant IC18y = 8282317897638735536739246985964021013111592001185170816868898918494107662014;
    
    uint256 constant IC19x = 21354467242021692125084534816786661714158326206836699952982241511749908312435;
    uint256 constant IC19y = 1257477240841559054232121636052061502906722525298447729212704046277636615830;
    
    uint256 constant IC20x = 17355749903561018961274499653110251888083999496717634030810343840302927531462;
    uint256 constant IC20y = 741994989208023327366293250087423183409462600526706085786721137502248800031;
    
    uint256 constant IC21x = 12247783365175089861216995971044119149055629661044763397317440792978866634701;
    uint256 constant IC21y = 14286539500901221991540522021952287477512876014647590428582285958444876983726;
    
    uint256 constant IC22x = 795217076412900201546504050330078727067367546971231285284086658077088315449;
    uint256 constant IC22y = 21837490373552923621775496887382459348548903175131097229857290254881215665145;
    
    uint256 constant IC23x = 7766470638841969355268925932096606406660238669666315678232346566760167040662;
    uint256 constant IC23y = 17412883458608298691399602659588762607409499067347316228632766956386335525546;
    
    uint256 constant IC24x = 17431537522198056629413798846973020648139335388505067069249713306307321186285;
    uint256 constant IC24y = 7097618044294650629266075972347690885619343942379444158617767982426101165189;
    
    uint256 constant IC25x = 3155681218236750597379112829924709045990923867321235410268579680335256789090;
    uint256 constant IC25y = 1033376757343194025753187207617798707806476392932116941427743417375045465955;
    
    uint256 constant IC26x = 3931115808050748055429523237297252010822682625409973659634754447730167469327;
    uint256 constant IC26y = 4731597992170562450795311947046159697243146199643539869671347544000297508190;
    
    uint256 constant IC27x = 12806320909352991918035855547739108234309859364075855364859611861899206495946;
    uint256 constant IC27y = 3506678489010210329415241670651863814560712943204305501728886061259480241417;
    
    uint256 constant IC28x = 1130904219324136713466066267844041249459454982454903301853233517729769638771;
    uint256 constant IC28y = 14481461561971719078753915635829888750976751375948344404477005532550979991195;
    
    uint256 constant IC29x = 19564529635901790075150033345215786019478755932310662530892848038639349100178;
    uint256 constant IC29y = 19779966454081759515861861772145142057783463046949927922738801415925692144548;
    
    uint256 constant IC30x = 10531202208158220207119845857061598166247411590136664898797467999342785443126;
    uint256 constant IC30y = 557299773904683522822999603582531390038154058556612834493840012874423481021;
    
    uint256 constant IC31x = 21072954121751659891371703298673003923549960131883040806225695038230180178368;
    uint256 constant IC31y = 2445426393592615171314003432316981511343343671195241811122478736150627853301;
    
    uint256 constant IC32x = 8214734030189827699545215810521443854076532807479657205281815070904826422514;
    uint256 constant IC32y = 9207359836150468051460573709800765626555800781286571469308031224581556588372;
    
    uint256 constant IC33x = 12501617256812802379822915741285774174617363402624808721081058438531842605171;
    uint256 constant IC33y = 566574592441257103357412176551082897350697442987485814329327377472200208673;
    
    uint256 constant IC34x = 887518416062692548306936799736348742279569750142903828669090452013515948523;
    uint256 constant IC34y = 13596840658015551803749264365214379671210981923174367092275997008597656120475;
    
    uint256 constant IC35x = 4071843302050042505655379603208408433023165704414902480015206550975099095589;
    uint256 constant IC35y = 21515418626493000232508382768494869876060083783723979021921612691740615184350;
    
    uint256 constant IC36x = 158277893168242752068645014231354609763136777603098933737103904238038329217;
    uint256 constant IC36y = 10556279831720780891794707536502932554206507696283146257824160644728662357538;
    
    uint256 constant IC37x = 2225006997040619393980278516785676980540278954911325253482629039206458490303;
    uint256 constant IC37y = 15572174899099989160487992025143696617715798812869802752164996570815140749936;
    
    uint256 constant IC38x = 14468002244959496315360459289877865369298797901051404952101316073070450511956;
    uint256 constant IC38y = 14262974196152350021524962845366603971180759644688816988330868636408475969185;
    
    uint256 constant IC39x = 2012190539933564433998158983186848837091942565878686860523614372039609304410;
    uint256 constant IC39y = 6078644476853555304835602345646318133540578170099170027981614887917140040485;
    
    uint256 constant IC40x = 16918397882155889078551894158330136437565891936471636766023559003132093576559;
    uint256 constant IC40y = 7998087503224446508030204838930387681361977435182384172795536828847472946276;
    
    uint256 constant IC41x = 7485913331931669537048267019200086325286301726722509470799975057309320764420;
    uint256 constant IC41y = 3920851256303151869530955140672113124528092905347213306617890299213885497044;
    
    uint256 constant IC42x = 21403548638074022156640097047881698940120920413951357592928446505875797636461;
    uint256 constant IC42y = 3063143217952495889973600481920784557594824321853472167220270936143053665521;
    
    uint256 constant IC43x = 5610402660102624893298804285801672150119047070922424813586454323761391704001;
    uint256 constant IC43y = 16651359344489960865554360957544516559249438584846330639006639822299574023258;
    
    uint256 constant IC44x = 17134056002014118405741045923185142049188089050284616414806858313130048785053;
    uint256 constant IC44y = 8176927193990954032843605506698069580026557675579426297532626250038359963995;
    
    uint256 constant IC45x = 4528418017985567411162089831543541194490598812134584127428751444274581017357;
    uint256 constant IC45y = 4755991391093924598380357624805048386622774830623180649009033361428228727901;
    
    uint256 constant IC46x = 15663428252685696637563034735020357595662232298715732747439625035609252608354;
    uint256 constant IC46y = 20988053896534258020130691024447730952163684796126530980499836371325540056488;
    
    uint256 constant IC47x = 21731168240246216954433090175291232228700938825081700811368287521087861116729;
    uint256 constant IC47y = 8603712911370177334295045186469079555085396468100520686442431841058290317604;
    
    uint256 constant IC48x = 6894837932869563135160929949882404062988090075127071915278850211864152541706;
    uint256 constant IC48y = 7975062133710504939517476392062225442161144110675187708567127038672113011697;
    
    uint256 constant IC49x = 455355439697885599380207291792345305749181703663466352681352210575422352048;
    uint256 constant IC49y = 2419038405431256210745412711089159961778493112431894516545803919393689308729;
    
    uint256 constant IC50x = 4918460143477613278483763307934738527257315174731265467022051952429052840137;
    uint256 constant IC50y = 674810866807544038086179479078108763835903034365757734354913135102122006246;
    
    uint256 constant IC51x = 16181413484492933492808014797317530098221309619749169290590579541498540405453;
    uint256 constant IC51y = 4963358555272322180998150530998104278863581297611611655262606235390175673108;
    
    uint256 constant IC52x = 5307332838370317766774656039241132968171768794801521082934676071672574349536;
    uint256 constant IC52y = 12949954456246082508793213526120140544981244357283598245912073023110348296471;
    
    uint256 constant IC53x = 6438221534112503353711616446390166858199602893501137180721320635345545756401;
    uint256 constant IC53y = 19573073710253156335643862507987822385987381693120402434038893318062676304419;
    
    uint256 constant IC54x = 16414743275543491668754686840035485867394693171576648411640073205610543674139;
    uint256 constant IC54y = 10868762208972555326698582928267962073086094108123260964750491201248097436934;
    
    uint256 constant IC55x = 8633904979198980901137037809121883869555174643703377052934497631223676380331;
    uint256 constant IC55y = 9318756750020663202783502293766656162268317336527333419757359355466856897380;
    
    uint256 constant IC56x = 16447204875003246182189435998521034376712135608145528651388232176740283394230;
    uint256 constant IC56y = 17779183074402941006255235006005122130434139553322430698351499498487083725653;
    
    uint256 constant IC57x = 11333885504628770483048975830137908138461371174192501205048565307722836122792;
    uint256 constant IC57y = 21812585373117845382323921901120955407203395368678525583406277845734974904754;
    
    uint256 constant IC58x = 18824877939343106111442231987742639227851287503135535141752751221469146789506;
    uint256 constant IC58y = 1700644350384366128844585514187714230573339186228446557064562924741541969704;
    
    uint256 constant IC59x = 10399338676398783901710453785094479843503355092668295515695769879269907159740;
    uint256 constant IC59y = 20165222580487898689766126946947016768299566746980436215253594167954870330880;
    
    uint256 constant IC60x = 8760959157773189770895947517759244647702987232072759475306272328521946398654;
    uint256 constant IC60y = 3990080934855098725832349509698755422881228673044122768017345853198814910350;
    
    uint256 constant IC61x = 21675399341410965421763531157488279112743487963218116097825943678172057665817;
    uint256 constant IC61y = 4451817341110184021557965737926251757682279374362307515196087770233921969505;
    
    uint256 constant IC62x = 14301792351366550949727247127245670717202407632333226849893756498979929606274;
    uint256 constant IC62y = 19647967857750127084533236086340970161409642487642164354403796870586001024704;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[62] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
