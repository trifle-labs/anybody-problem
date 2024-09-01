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
    uint256 constant deltax1 = 17826910205698822274646094233194463481593699482141118453179477495631972769434;
    uint256 constant deltax2 = 14708131736652443458715979613193900350503322673449245006486532909645507531014;
    uint256 constant deltay1 = 9493962061625049181067489344293692882544602896527856995216804924048936776316;
    uint256 constant deltay2 = 5134342065890847500269564112309581522865885620455495376586054491398962451607;

    
    uint256 constant IC0x = 4243810872987081053756653602891721935992813259724441002761333081566676344178;
    uint256 constant IC0y = 6668530910088280021134197136804336179237342943242594773567896531592226464085;
    
    uint256 constant IC1x = 11930911982252107267501700238674980403871984933873509454663460090608691880316;
    uint256 constant IC1y = 4789061611889264923348492092970225683652571667484420355448201782371786132649;
    
    uint256 constant IC2x = 6313594382981520870539587289189409365059994049061270224296039754561631135768;
    uint256 constant IC2y = 9522299368574252560054674504785429648330582857581236644661875986329658649530;
    
    uint256 constant IC3x = 10162959771807558740323459247830318543912822502971511702667912260909372388917;
    uint256 constant IC3y = 11375446936534704613643322628952317864481602645163870427411583248034190592087;
    
    uint256 constant IC4x = 15235071510307580592403192828503319647321065833954579886799299439132883670098;
    uint256 constant IC4y = 9057719258841569995820285627157977452194012637037542315372743640308556489855;
    
    uint256 constant IC5x = 16916256572838047442103894182331762161240227180469704839208699691999141634791;
    uint256 constant IC5y = 14086278028588554094443873083400518441764510282767097713770187573739488785319;
    
    uint256 constant IC6x = 8703429292921127305223072831654076866696218630192428990119095920661022689757;
    uint256 constant IC6y = 13946254375819927741935183158562748923258696339209505223275804425470897040063;
    
    uint256 constant IC7x = 11539894247730359980186519435475562714051778057561814471132364470592508090894;
    uint256 constant IC7y = 14322948809248300096793955429855791842472504077308238978882185590044942008689;
    
    uint256 constant IC8x = 5123658305898628261391356579829975553286615816068310877510550309717006851433;
    uint256 constant IC8y = 10612887348817896583921973047508044794649366635277148943386052155105378482925;
    
    uint256 constant IC9x = 21162407449024431927169299357246223781830434746986089268261393534064025702682;
    uint256 constant IC9y = 19147597056513986440429992938320102140738656067625681118244690982793467391610;
    
    uint256 constant IC10x = 8453128278198871987834230716342320140094927617896909354140259203202995602513;
    uint256 constant IC10y = 21016104149726652047895619212930067391330218812491350776512431691204518833817;
    
    uint256 constant IC11x = 905964741386234651563945920269684959456106085023479861973830311377961205662;
    uint256 constant IC11y = 3262774820139319231201003370834818927048024469063071579755447227137952404285;
    
    uint256 constant IC12x = 21286052291245636666785175110095426572969485512660740061295717690240956654009;
    uint256 constant IC12y = 9758698646687714850741645754962495559372855557610415875271861219806739979382;
    
    uint256 constant IC13x = 9984466426688427867484563042877285941705261656386343761278338839531892330575;
    uint256 constant IC13y = 2034170369085086621866757065704003172574280243390947447779504371045208168124;
    
    uint256 constant IC14x = 13886398730336104956499327668037758148687146806782187494420998166956257268077;
    uint256 constant IC14y = 8459791130583158547795372641509284661529889268685814678745732365076579352544;
    
    uint256 constant IC15x = 7273261755145777493081279548820290471133755954759240244543460958972148349824;
    uint256 constant IC15y = 456174651164043493988753661215832088080987564246405195442866886559339093673;
    
    uint256 constant IC16x = 14989057877398133012933380965774614050482676473237521608956568142948317414199;
    uint256 constant IC16y = 2448161473511073004334436262160184400150188878538630174405825507586017892295;
    
    uint256 constant IC17x = 2097455282856132736502049061937106215697810803813240490916486830108438691954;
    uint256 constant IC17y = 2901246186275715733042632820410244866852127469265509904835394021915448778603;
    
    uint256 constant IC18x = 18375931025649281328117798839442547094656236163121626880582780225421140958676;
    uint256 constant IC18y = 18295885893507166299986025157589644838338391455557155600968874958516489334826;
    
    uint256 constant IC19x = 5706064366751364424825913677091240182206133800227119454118610310238482716688;
    uint256 constant IC19y = 13773505931231331595957778633616376173826697493420604919162530544033793443901;
    
    uint256 constant IC20x = 19293420215467041880140855981659352137970084879181873334394456253047297005209;
    uint256 constant IC20y = 18333221144262693268645678602844948425370935947019801791270485051700299493670;
    
    uint256 constant IC21x = 20081418089048695760674942593296657120427488650487659847991920205858390153799;
    uint256 constant IC21y = 728093075860257324886449682954691409345725605078112323069498002628449221305;
    
    uint256 constant IC22x = 7823439965560129521917212263740406722743112015251393443684921625323766149408;
    uint256 constant IC22y = 18693611606702584393160789104459150038026032900698161645031695188309633086247;
    
    uint256 constant IC23x = 18330183283452366248087424550012237750860381486478943978719693303244343537786;
    uint256 constant IC23y = 14883509095305137773064487482165403128960869407445653520092771219665670916840;
    
    uint256 constant IC24x = 6776810811638402646943544720950830488031463220850330097998484828089344629853;
    uint256 constant IC24y = 13737101873031976694102812621310496459946720422122865271840812511994743143323;
    
    uint256 constant IC25x = 8135766480134772167668722364770540474001973355231221024661054784996005791892;
    uint256 constant IC25y = 4335901104901569793964762548880271642655990511810559703323509431047801621434;
    
    uint256 constant IC26x = 21038017705741876530274373262431594750824536153674916729768704577102122491277;
    uint256 constant IC26y = 9127772190019830212297447684815455568830279925169256081098640823150906074018;
    
    uint256 constant IC27x = 1811928396473291431231694612181485100186675399842752764408319544446255125114;
    uint256 constant IC27y = 12955947007848229235526395614906318973747249331763621101008179936899644826408;
    
    uint256 constant IC28x = 21117828956264176827764153353351161948359973852521334015849568001525989642755;
    uint256 constant IC28y = 6858657286330051150800236533351417715939349959921917522705961255948495296878;
    
    uint256 constant IC29x = 16443940633249550210035837326543613279301333913638553405773587292789922712072;
    uint256 constant IC29y = 20045298832420844112875129496012135682747445702956957663388887897737588252044;
    
    uint256 constant IC30x = 1413920774507214570803050401290153125569493455043629017804882827382379825138;
    uint256 constant IC30y = 9122513250246627154779369240775121568410330671621733415963496139451937348501;
    
    uint256 constant IC31x = 6218504001813559228145791440677021778665427367853524182287107096966764612648;
    uint256 constant IC31y = 16870164591076295481368652501118470598103297869314283718866042065083544125001;
    
    uint256 constant IC32x = 14755235917031969569317661402492230808044800818746862339370671642986863873257;
    uint256 constant IC32y = 17657117405037673424712324134760419653413230635883723182263638708665987443653;
    
    uint256 constant IC33x = 14660498635826893997579950123284831266689113873508367531323556547504366528226;
    uint256 constant IC33y = 1528402575945374194856117818821825245205959236831634723931996163891185464254;
    
    uint256 constant IC34x = 14854305518626321349967855337884769520281844861337884006705881188124783207822;
    uint256 constant IC34y = 19843127789577718788855855304856975039045063374415702303447009677427196553840;
    
    uint256 constant IC35x = 1908722067774164858056464778910212000320649067403213021372190704180480894890;
    uint256 constant IC35y = 17281139762603836356043117147651798837019946221122531502005676967276857083296;
    
    uint256 constant IC36x = 15590135898504266294605886075826079531702444116301380012659422448811579930113;
    uint256 constant IC36y = 19580598694575460471530686010269002040921948388355071306546311534618552631212;
    
    uint256 constant IC37x = 12906086048817901851426136908666007756779245808714703204632518311075307430061;
    uint256 constant IC37y = 15420344625692378567086596188460540310775011791274683128625261707083283639867;
    
    uint256 constant IC38x = 16176262007464831511765834871068269745117516398627661142164136081986773457274;
    uint256 constant IC38y = 4031595546479849651423360234628188241623668461898578308803116217606170951081;
    
    uint256 constant IC39x = 11921793710485613540617860300360204745568092564820253192600068485245267168377;
    uint256 constant IC39y = 6089207725369865343602407450669810566323262033519834082912718357230449318924;
    
    uint256 constant IC40x = 13147091462542808889052270281426283114593128367968926095218984521301248138921;
    uint256 constant IC40y = 13956536896756761271920328473593407395693262674068810999193964199032858118557;
    
    uint256 constant IC41x = 3021985722562712220130428786831341742926976323169371611615255314510196170477;
    uint256 constant IC41y = 8356218987256183647891586863265094920190847885135000974672411446682489531470;
    
    uint256 constant IC42x = 3080765951182315086685860387794118033511820680684723850045273304356439861970;
    uint256 constant IC42y = 1072500294153698425874574252370707573482459564858633728886167472957349233203;
    
    uint256 constant IC43x = 2392426998321975924118245482637780994885170197233083594157620937976101186891;
    uint256 constant IC43y = 4681118849275808228948867888956559101718058762818131005826852277386088580337;
    
    uint256 constant IC44x = 8307670675842401800771492222165537660212982961517901250946137659621790028805;
    uint256 constant IC44y = 10627394786779688511084294501784769089268804219764838008913792500589061949985;
    
    uint256 constant IC45x = 446422637715027939843988798882644266330381384172888101795229203953905755408;
    uint256 constant IC45y = 1056824247502062354611168826951692401652923672779909393059425596783059537833;
    
    uint256 constant IC46x = 15292780228385252106277054772601277668424169137517966235930185534060386102730;
    uint256 constant IC46y = 12189546653774541426888258085886068250727281700141884355816543681754530576268;
    
    uint256 constant IC47x = 8454151180955466188579989370970249503781363798634161285203497725466012439274;
    uint256 constant IC47y = 13231841782460487123967056529545037517649805715772306626990608937114689527344;
    
    uint256 constant IC48x = 6186223535689336230535665036095256059743446734166987924446753436907253928271;
    uint256 constant IC48y = 13576122607581429827154860600236839804850729025402017231586141770697188692494;
    
    uint256 constant IC49x = 5562006980120364201944308307060710480541506491455947368390676241337173871447;
    uint256 constant IC49y = 2894423142138720245819933347398245709150341153431930171996765414583675620139;
    
    uint256 constant IC50x = 6970948301709525025276865821069183227460266071932849696463460703512356436707;
    uint256 constant IC50y = 17546783598803244953007192096116702121397938391739438455683797394039700897143;
    
    uint256 constant IC51x = 2102806671830695468586921955288293427530514497688547810302645090629085375087;
    uint256 constant IC51y = 5085670459709357471506791194856721948779316371444669335351071071467173354823;
    
    uint256 constant IC52x = 6102836027533308097375770886631521989082942274606991907762553712402711374602;
    uint256 constant IC52y = 21853381517044520239250052688234735161058361162376235593693585907275816037437;
    
    uint256 constant IC53x = 12712802884208276336229934747841858184937980936109910137377886177294861433140;
    uint256 constant IC53y = 6187369864717917896753218258706902288857244113202657182988738439640937622116;
    
    uint256 constant IC54x = 9673233911704509414509485891486689934323839092988731664280425005022283148531;
    uint256 constant IC54y = 11148500866011489531591191555972210794102285849725269159098799343134885442011;
    
    uint256 constant IC55x = 4784262475232152911872704521200438546747046945920739361504683039160389836935;
    uint256 constant IC55y = 12604446335277393149565337300068105044707665599983646901213065435137378583541;
    
    uint256 constant IC56x = 16028433264512454424836338766911116549942428998561346767160450717517031675697;
    uint256 constant IC56y = 5712114559903699352248047039221706255619672607208564820006301698426976392682;
    
    uint256 constant IC57x = 7274754892876371970393905318646437084168200742604211482294156009267362084846;
    uint256 constant IC57y = 10554495739865481226870654691759301617783095234160575307383973852082701992139;
    
    uint256 constant IC58x = 17097373980336321214935484370211947361500002542334564767771526133484141721022;
    uint256 constant IC58y = 10902486404953423251323715367124676830174666499986158463555006879884723674628;
    
    uint256 constant IC59x = 7782323759288910924688051931789949431198393767253103674776947960919530526173;
    uint256 constant IC59y = 9751281276124730379485401531251341020261569634456509421261275186120184619542;
    
    uint256 constant IC60x = 4217497065892781021864933304762955911614225023699743624660188905706351368902;
    uint256 constant IC60y = 16124861623951416863525689510645162811790232091427451071914737036702442029253;
    
    uint256 constant IC61x = 3462686458037660095386309077719656248024855958545561316581318137461570107916;
    uint256 constant IC61y = 6235224441381052161932453925994222988768726689720208456317955938833431789117;
    
    uint256 constant IC62x = 9203122259643950079087943415315089368494610843178191997672766780662693326225;
    uint256 constant IC62y = 13609151265820556496015169052777486707863836529672753982987991279201106475494;
    
 
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
