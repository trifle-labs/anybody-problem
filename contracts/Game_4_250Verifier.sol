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
    uint256 constant deltax1 = 5137157611818670835725647271320937935994388117477222893339623043284884773704;
    uint256 constant deltax2 = 8407292432571930426062926624456247001485816745969413442907518378117804992860;
    uint256 constant deltay1 = 6540977956938744964694955090974443619330540824368621120516518605333150228228;
    uint256 constant deltay2 = 5620417415999685736545556511682056306845400486021131559002657689167549972736;

    
    uint256 constant IC0x = 11199469645057225056944539572014065189511362223621035502681503095514035604212;
    uint256 constant IC0y = 18583615368301161913622084879219149110704290175492562623330496512017209789108;
    
    uint256 constant IC1x = 1630918334837363726717502450719997651503554123011513571151346500099107338561;
    uint256 constant IC1y = 7421774727316813189570193930218394462907294041461166872021892849629156485324;
    
    uint256 constant IC2x = 16229237199267753537681313714618484368212346065149532178840677382788596164878;
    uint256 constant IC2y = 2249830745060257187860629685339770062148571244704834639917639111849544986806;
    
    uint256 constant IC3x = 16823445275477789105062263606600950854743412948359474770428651266836963258186;
    uint256 constant IC3y = 12638629598071126310994285946614219227478809801964500300811756483316295259279;
    
    uint256 constant IC4x = 15743183801662391180864064118425910445761354160381620157220978701567655943810;
    uint256 constant IC4y = 8021185759316388460638397577791344789497719574808179052928480217693839097449;
    
    uint256 constant IC5x = 7308277071157582572167728413106243456873071237435126458286544852633232348844;
    uint256 constant IC5y = 6639800055638603822218098712285504061930947336701879742272075353449604390402;
    
    uint256 constant IC6x = 18400570734383946835101415508891613107073822155363244807845090463520159495360;
    uint256 constant IC6y = 5575999929268318254745552255325038565997316984680283475139616582855372712957;
    
    uint256 constant IC7x = 611793944428100142214551067907275034894385546838353703425048881873866644298;
    uint256 constant IC7y = 14548774246011634679916323058201441349972952016811161279285803990843423713220;
    
    uint256 constant IC8x = 8566770307158959236779688069673516995678906791590235481229525312525699061583;
    uint256 constant IC8y = 19478079738782759428858247257642902194553392277747398319957048631738144740369;
    
    uint256 constant IC9x = 10922162551889316280482290919026872841812340637518023730052286384659157428300;
    uint256 constant IC9y = 1208058448213963509310177022771340150711165943888173734487878128891608319888;
    
    uint256 constant IC10x = 8432646542846868247562447249901025591033996731875300958483323990994199709303;
    uint256 constant IC10y = 13789999420996161469473633463662031143630573221554537579141487196084731694413;
    
    uint256 constant IC11x = 6479835712434731595294901134078030156660211689797159702535227256081316408912;
    uint256 constant IC11y = 4881073172406015702828560714752785537144936253008045112499797887190467285867;
    
    uint256 constant IC12x = 409076764243788295340800402358184748160300302921784616142024032627031423062;
    uint256 constant IC12y = 9225109599582410846473529944847835475788888278245405097944973719909070213044;
    
    uint256 constant IC13x = 10210048648316190237678021201666303732771777938177999013302069590895139577020;
    uint256 constant IC13y = 20525079268346116354270022689983985519378233161316532095451077009040050767462;
    
    uint256 constant IC14x = 1150836082434379685420104246742924889089444807552557539687124464510733867424;
    uint256 constant IC14y = 20680271604672561677371150995907457483166132210953280866459507868545331358778;
    
    uint256 constant IC15x = 11040388165387687147608013087510770575381138555672790580967177043160730794006;
    uint256 constant IC15y = 9352100146784348902961417644973184635686439742975730037190088818035451898485;
    
    uint256 constant IC16x = 19248806202378311929977293483626413692039203808846375943401245358426797968588;
    uint256 constant IC16y = 18596417217279096871323902804205454368006061591592606397450724076066646617002;
    
    uint256 constant IC17x = 11018067378686696371259317005543809660048851987433237837161018137880242326328;
    uint256 constant IC17y = 14586162197251117409444615643312345616167363014852454803621085087811518038587;
    
    uint256 constant IC18x = 3901469706044346706722185734637780246594848941351171204943912945375733510368;
    uint256 constant IC18y = 8295774162472086908119201998078289951688284544772758151690435197670462935077;
    
    uint256 constant IC19x = 21773718738682793690390383463308734080460916659043955736483585818741189342341;
    uint256 constant IC19y = 496864844074889454541606348462091378138881962678843451864992395636843102182;
    
    uint256 constant IC20x = 10696323253013036239336608275699984247602490211549345620448293763573737702636;
    uint256 constant IC20y = 18320456101888780563655546509497648355898631691472602485716660699401677653868;
    
    uint256 constant IC21x = 10304839964734197345407359608786800294069519124265055946921149856264499082147;
    uint256 constant IC21y = 3920909044385434763565126222389717258720694065353917502229878902120367180493;
    
    uint256 constant IC22x = 15359483438300540859315412423166405732250661012084235448852090147710230400291;
    uint256 constant IC22y = 16572283166685359511480781948324490461889056581043464088797898191961036538591;
    
    uint256 constant IC23x = 16091872136696528953412221602094913465152494328587047353566788661855657464443;
    uint256 constant IC23y = 14405375431627146940035852580739252100276408652055860660638451611632005441210;
    
    uint256 constant IC24x = 21076195881247047110912325180660071223419655868566465254233348424963630396308;
    uint256 constant IC24y = 9525974977337505626200079848822885215380277991322609843279165101314618980878;
    
    uint256 constant IC25x = 4506298608525340437387331626279207341371156847848025494854950356233636363929;
    uint256 constant IC25y = 21485422580509440678456229207843742069113355148588407918952174350527584238782;
    
    uint256 constant IC26x = 14479218060049969338381799565462582209333100892792389034556958933725911896501;
    uint256 constant IC26y = 4179434539696017017240215241447382409180559607571357952675706252732276642933;
    
    uint256 constant IC27x = 2460971820550153577004049662202201106309179833969856953926769913135176118220;
    uint256 constant IC27y = 8408637174635572464104962169617051649203626983650362262517698402506825507622;
    
    uint256 constant IC28x = 9420482864238695131557671569515153809350574757808253871934264743995354915034;
    uint256 constant IC28y = 605322626891841329529431714312154127414728259836335720133212700300294801158;
    
    uint256 constant IC29x = 19712867421736831770145602440489500562331789418956769197255110653106956475985;
    uint256 constant IC29y = 1234355859568408801506146287758461147706440675436194404831812465217427065082;
    
    uint256 constant IC30x = 15804507825830102937369146534259500887541094184694931896867955799548677756533;
    uint256 constant IC30y = 8488403074641659531294492524510059960506275969348701531951956437419984049293;
    
    uint256 constant IC31x = 14440470227524506271080102748006398717144016033960844952084553825325797713170;
    uint256 constant IC31y = 4662944163101883280323962677796815165206673687721895794109167344475967830244;
    
    uint256 constant IC32x = 15799677223439562776757846849298920295129771308081920213036634386461287898105;
    uint256 constant IC32y = 14996675077606455481682143834303491798304251403225365531902785970019540531048;
    
    uint256 constant IC33x = 2863731875626688223837871721465113598906104856680431073461380354611558347341;
    uint256 constant IC33y = 19518663927787341671332283128774599667530081274781486933510957632687655667937;
    
    uint256 constant IC34x = 10355360054606868056324184883777045514756793071641577537524120129987812394293;
    uint256 constant IC34y = 5394747944992890586276420743103218759751296304970173065515882998366942637391;
    
    uint256 constant IC35x = 296881867877831741499799792870571896049879333890611828946068346276697989761;
    uint256 constant IC35y = 17582837546175487152427654532037808141370710694220730135134670778861094254426;
    
    uint256 constant IC36x = 20217270082391948121157869080804495767265289194614527623478337873600736775238;
    uint256 constant IC36y = 9524456507295372313821861511887379696599947872161051511768518649460409935552;
    
    uint256 constant IC37x = 17212036215192813996087030921928514843041929053269515968331596204681379349973;
    uint256 constant IC37y = 17480795202351155566168104480852831487075386011437816580340515065538390655281;
    
    uint256 constant IC38x = 21815730873277583811096276594444398619218987672402596106496385786832174532814;
    uint256 constant IC38y = 7840211772897951044660638381440591272120501539858275554230004313032881221329;
    
    uint256 constant IC39x = 10800007036997671120578994750275474468903493995330037209572283183933825983328;
    uint256 constant IC39y = 12901612336059202748661538171473664498430712947797826387831733716900906195863;
    
    uint256 constant IC40x = 15791386201220933566198035323542311268493013331815950970816140158646236956338;
    uint256 constant IC40y = 6127554307202213399988984303935013861421855836154807079361923548261643100211;
    
    uint256 constant IC41x = 13898263123490180787409441035719528351351983193931993386951581800143073613527;
    uint256 constant IC41y = 19020744251310409766689145749688025758548431289383982232050753791968238369672;
    
    uint256 constant IC42x = 20505310648133051256899437174483692744155882498773622186074519461534030147643;
    uint256 constant IC42y = 17945167563726643283778497800359216027219796008929564332784772008862379288267;
    
    uint256 constant IC43x = 16464835543930849529802209723717707198205699962622034198247311245914066503381;
    uint256 constant IC43y = 7146706300189558098880083068482163424474762346040735801233669165459999595441;
    
    uint256 constant IC44x = 13876466699469375196717037837966091662045884884711252314177001633877820936556;
    uint256 constant IC44y = 4958809069487069757658972127379351538457225782342394753562950938278198438579;
    
    uint256 constant IC45x = 716494602496335636384560929447172545909794556338031660323535615315197455943;
    uint256 constant IC45y = 2119987637872816845880811104352854067758262977376106806433161750239701257743;
    
    uint256 constant IC46x = 5326227916591495894693509720254372049727680882886883474915360031572123636724;
    uint256 constant IC46y = 17652121187938469425255029719435929376167855492046593969409049000855614352871;
    
    uint256 constant IC47x = 16605143956649072843994023691603947255104919975923379872628789072181162520550;
    uint256 constant IC47y = 18043404731499170973535528639961146174034481978068728273916453105002300162139;
    
    uint256 constant IC48x = 1307036267933839625153265275143904089303258863245813293952349425823776229589;
    uint256 constant IC48y = 4968775773064407453286732184813671924754950404598507606287494923411009972176;
    
    uint256 constant IC49x = 7035213593926325268059435067385004716250646284249831536181984808613377649735;
    uint256 constant IC49y = 14096245776460606810221486218303556498336027772521469022655061876711200677090;
    
    uint256 constant IC50x = 3397724063466077632558277264834337251250613672639489676058286639992556870295;
    uint256 constant IC50y = 5279422289283142246717097480408967677164707086340653337956071688498078740128;
    
    uint256 constant IC51x = 19029258283012038124021779851803272594260458913598938568118560160072535906745;
    uint256 constant IC51y = 10946426943859613213309572388011785804387100357426801155339615265285837817903;
    
    uint256 constant IC52x = 14027721292825071352341242520063075115055331059522188694311270765522433666656;
    uint256 constant IC52y = 10228819750700122303841152180095973433047984693287069513756443095679556456041;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[52] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
