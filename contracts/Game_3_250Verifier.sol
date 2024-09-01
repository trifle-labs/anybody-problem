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
    uint256 constant deltax1 = 14560134422850237747592194898693654827173300180073442225203599163069524991237;
    uint256 constant deltax2 = 5776246509577523990659767304848586525129454388389588232610734862788804082212;
    uint256 constant deltay1 = 16070273647082707108744104620433651969265854621837986230578506531264264645468;
    uint256 constant deltay2 = 5310240859043101628565507760367382129934402578608720584038355498640734144910;

    
    uint256 constant IC0x = 7764365361902581414174581791208190254122591292215263171446355957179845670810;
    uint256 constant IC0y = 1364297700847308560358738199429346008003686480180511662436077734076800487857;
    
    uint256 constant IC1x = 10342165055229139335537257482781119112958130570254855837749649905088987485638;
    uint256 constant IC1y = 6040592508593962743992145771719890979225790616605307716103557068259956875703;
    
    uint256 constant IC2x = 8650267867056716291510205591656410924812957687228182614917603496437329919292;
    uint256 constant IC2y = 18009216660085264202270021080169075333824966654115800809615718047127787775828;
    
    uint256 constant IC3x = 19344175667798260480280203670482890737317507341873492603782359610124726334471;
    uint256 constant IC3y = 7762731375425659417320528237905084369144052546808475983936000805839594791810;
    
    uint256 constant IC4x = 2828584596907523590450509980137158013789142280650821293310503769187816107119;
    uint256 constant IC4y = 19234243138752305903446633295476279093186466813819164416676099281151936216170;
    
    uint256 constant IC5x = 5164905385182366544762962055628517212535242206942670054900907959012806665592;
    uint256 constant IC5y = 15511010145785403670599031537349695082548564433763922004552903526384722018852;
    
    uint256 constant IC6x = 6013179347351702024287866314657727737798584098964427110856705983373634491041;
    uint256 constant IC6y = 19401019681649934127449235416623117641367469217112084462719221468645329393148;
    
    uint256 constant IC7x = 11248480752765863614767205198660031081217299016374235647625012493817742980024;
    uint256 constant IC7y = 3180453039353599340380187754410295036290444472595393063399144769424980926658;
    
    uint256 constant IC8x = 8901054949418154197815079469635474599270075374416655943389776504868600592825;
    uint256 constant IC8y = 19399404651349043198640595259813591266698472163740846969581911313211320283702;
    
    uint256 constant IC9x = 3741218395543883259960155038035394865594443822650010293124159840873245794382;
    uint256 constant IC9y = 19009931343243016163433927641130943195336090702883301707326551470069486358758;
    
    uint256 constant IC10x = 18621071902864452168251266956399221947203642722637848227146892409642896552707;
    uint256 constant IC10y = 8861425868294754898632089805767349351200651628368930640213891170247291664762;
    
    uint256 constant IC11x = 11527835760140601230788566923601457106888093234926600235829480267327165810428;
    uint256 constant IC11y = 10267138280007018763993545005524061951177114416921653596769189069901790199509;
    
    uint256 constant IC12x = 11259709604178476954746077273030736760506714999128475794256797777539224415207;
    uint256 constant IC12y = 11249908955122515117541331737980347826235443459878026123850741912362285065964;
    
    uint256 constant IC13x = 275703561852492400963180778351885451387447525666170748457010194742624650369;
    uint256 constant IC13y = 17579354490901430420547969022001042284095841392597127078025900046447678918324;
    
    uint256 constant IC14x = 16099241818704386353696733092661985938083569084683004937807173578903769790939;
    uint256 constant IC14y = 2577136082686515648914775742697882145849009921008656980941080716494004589449;
    
    uint256 constant IC15x = 8169614266292109260935252984018250410790577824610575926900417380615784653551;
    uint256 constant IC15y = 8172584766921008370417538341671445057305633455495774135775130020187536796707;
    
    uint256 constant IC16x = 20495258347187820156753552386605567894925036471767426286759183689057299900626;
    uint256 constant IC16y = 17737296639281589724805726000031273001473199686246605551433145601015049579190;
    
    uint256 constant IC17x = 3945672037218351373848318931547389211056185174652874576505840389858342629135;
    uint256 constant IC17y = 11606666909489144289391648840594881110081775712820625195673613711384235526188;
    
    uint256 constant IC18x = 21759317421408459673587152563104855892625389910340470568546706731862556781910;
    uint256 constant IC18y = 6957935020385239654548924469795899673711490377719661730300960231243159179943;
    
    uint256 constant IC19x = 9219492569038127367088018452595346912304193711110633079962224342547764385688;
    uint256 constant IC19y = 15232376992146455320344933576880142538036706178984995492897470349913655354859;
    
    uint256 constant IC20x = 14881753207585855477875030972512959837905079386832898867579063099932117892567;
    uint256 constant IC20y = 11963325384231398852247824837796668421614540920368457599482830660356475113943;
    
    uint256 constant IC21x = 5578085861914725625868251045278861974265268945964360642550511344112333554367;
    uint256 constant IC21y = 18949456617436060980128818226231996834685515515142147858699815282758541480465;
    
    uint256 constant IC22x = 19657404122193625504807579140077329890041482458087705136670972360137733880130;
    uint256 constant IC22y = 4224376660457253081313751608368384016277673807240105116469373251892353428596;
    
    uint256 constant IC23x = 15451840103591058923657402766143650281133349389856474474584596908845457596400;
    uint256 constant IC23y = 19313971429226923324857828812962372535499868378036137710492930391618838579401;
    
    uint256 constant IC24x = 11960246640814361266244266590713501526133289233769509744088903156525710861407;
    uint256 constant IC24y = 6065169358998432516802827476930045910445997393153043558185382099828582169900;
    
    uint256 constant IC25x = 18538648572039179373032263424964326479189123661117473409978081218418774387848;
    uint256 constant IC25y = 9374769248242531457590449591955740239595412391921078393855903496860039439081;
    
    uint256 constant IC26x = 6863171843975376491569777638133034064079551554511291727939853484077319562875;
    uint256 constant IC26y = 20264747018233566226082962328279489442921507549151982749402465860293372057098;
    
    uint256 constant IC27x = 6661618114942670580095462137063384405582406916735399898031742396934065324476;
    uint256 constant IC27y = 8612285024979391018552308095102944215299147106074356895110232369218432734689;
    
    uint256 constant IC28x = 867859844478025481508074098989229887891937682797675756601239781832389926814;
    uint256 constant IC28y = 15681075001390320571268244993746404400198173774524565428472442266277027242601;
    
    uint256 constant IC29x = 1463644038548776002484899509800380534490947176642973721022080805377116067188;
    uint256 constant IC29y = 17338037987187754983578381065999940582455047076265154201969295146309495175677;
    
    uint256 constant IC30x = 12081441984953089514813577922235533793574337946152041911820762756644996845217;
    uint256 constant IC30y = 6069955891030643072159035171366576363660066357856145404470261974758109006692;
    
    uint256 constant IC31x = 1920404109506705801563978256166309718527447299747131989979371620571009743723;
    uint256 constant IC31y = 16945710011659352209169364503055998784296001867037664208770791931443006732356;
    
    uint256 constant IC32x = 18989183762427117901950528589768646852504295462839798136990535354340822015033;
    uint256 constant IC32y = 16677785597563249523885213403445550720268411446385895041381842534903943205240;
    
    uint256 constant IC33x = 14398914459712370771003121290174055266462800089950035418416815180339958705592;
    uint256 constant IC33y = 15663533987819366157429439407256779566922023545642324487538974056547534129986;
    
    uint256 constant IC34x = 16809491323222372917997013256184579311187014753457926856308720987023561726009;
    uint256 constant IC34y = 16026654519753576989808437617424018526525603036624908730012013439848438665455;
    
    uint256 constant IC35x = 11820149797053488159512731789344636251560649829679571594130334217893258831702;
    uint256 constant IC35y = 13018643523700060338130090606807988193439312060447009520917029061656716078712;
    
    uint256 constant IC36x = 16701927882988474481696432298962475308105167811776648714021495137375758770273;
    uint256 constant IC36y = 2157845812257396911420293782173883794499880901615939577106233968376627878984;
    
    uint256 constant IC37x = 6451119276871031376649271999025228480451163682141558414154065914352548499035;
    uint256 constant IC37y = 4025873613188505505049719021435219043546168078722230607192620138805138135153;
    
    uint256 constant IC38x = 4738888243639478075502505487349906111730540096000861686089331238801086330111;
    uint256 constant IC38y = 3730180131618305084132911890270788648836100637360275791723540673224588042995;
    
    uint256 constant IC39x = 21255556294962407012733173522732172552036085045187512047870715960117262972686;
    uint256 constant IC39y = 15972177292201014700466277151564496962518307810380215353187825448832867560194;
    
    uint256 constant IC40x = 20241962120163128182919219381539950881842331207482801408983956664796117625928;
    uint256 constant IC40y = 8050115223626749005965157826272152363466541472992729327118006239069520043131;
    
    uint256 constant IC41x = 18669928206349659224354730730399850634240421193769476717079939628073239836765;
    uint256 constant IC41y = 14499140870244636820635101481418128874885338000168798453844121746102792170353;
    
    uint256 constant IC42x = 13524776280948979459976540773708351285368380212002562477833026483657827316415;
    uint256 constant IC42y = 16959498043432446543150443446075052748542924944276711688839081456945511614027;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[42] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
