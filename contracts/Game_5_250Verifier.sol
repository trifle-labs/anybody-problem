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
    uint256 constant deltax1 = 16096610146051477095496881608324893487329270822300454335210746804371234899584;
    uint256 constant deltax2 = 9043462894393901474541452686489560207742182788701934695273084365001815569372;
    uint256 constant deltay1 = 1478229909794663078121353287985125577039439241314057032505936592801277797280;
    uint256 constant deltay2 = 587358612569581609251102512319859284229642038148602919457693398456370229468;

    
    uint256 constant IC0x = 2034343033010082087360208096419940151373469286175180875452721913995641139183;
    uint256 constant IC0y = 7456474554412177279934619197656559761564108969586275427608357433592469719286;
    
    uint256 constant IC1x = 870896950419369537566786486170926824506539998577762846474714184615054716529;
    uint256 constant IC1y = 5912742844348678992925350851215822461558067824444329157655601828207414475389;
    
    uint256 constant IC2x = 6865190872901096882417147053070114836826877847515135613004040232964899822874;
    uint256 constant IC2y = 20775564674189200350455959761868726363587416392579533882335008769745467437703;
    
    uint256 constant IC3x = 15626757208297050616634652416497100930238257682118160872895785030714801301928;
    uint256 constant IC3y = 1045663093876275885483745309106031484612183640624195753530606445930179955783;
    
    uint256 constant IC4x = 2171639474360955177476822187228825416050912648322743987790819930354361273204;
    uint256 constant IC4y = 6605125832602563985307498906523504277791468496545550419713925560003854626692;
    
    uint256 constant IC5x = 4270323935291710426987863764663082451794670736469430406734778385102631593350;
    uint256 constant IC5y = 5736308753820488083235444918569003389694642110985553075064605291956882628351;
    
    uint256 constant IC6x = 9643935444712364577501095875912357892986807767681678976502188197365647785293;
    uint256 constant IC6y = 10255922844381542630047404537667370716846782826875441724572072297414508062671;
    
    uint256 constant IC7x = 11138472123024497647316504306333076824816912950005638313871266062587320255069;
    uint256 constant IC7y = 8319183726811333544954245747187388809211868320353879403284306516524422856703;
    
    uint256 constant IC8x = 7775167305706866141861297429614341481790072289621993124776387073747457132913;
    uint256 constant IC8y = 13307169035921294850003087359605364461092520581972586675216504131358723828883;
    
    uint256 constant IC9x = 6379077849224000194113696724612305999056234369600858999273340254334249192738;
    uint256 constant IC9y = 16220201337523297086263443692643479316415432151713769706633694756380691287304;
    
    uint256 constant IC10x = 16399238059565152573697856187485930891625164494816402563950779315206719981777;
    uint256 constant IC10y = 11400695244705635725349923856622198859164918053406272684046628645721000956252;
    
    uint256 constant IC11x = 271772152182387309132489407537090716828989457130048178315272153312163146871;
    uint256 constant IC11y = 16292374522477599541710781080478319844387477977836613825509200953401877740668;
    
    uint256 constant IC12x = 7054327231691212531171334281251383284106139220562158833001034073369454297320;
    uint256 constant IC12y = 6698915721642074395437190895228513679894446480232756256070071254395267187009;
    
    uint256 constant IC13x = 11369149084491801987844318917680313809040388178911471991105816855834576849038;
    uint256 constant IC13y = 5489168336447085457005187380386044895163191169874961603003291922088499025696;
    
    uint256 constant IC14x = 7652253957412836278700118694430596473071860349574396159693922489293473465449;
    uint256 constant IC14y = 2921224586062092766255351964033021196819891005623452100535322195685242634104;
    
    uint256 constant IC15x = 15303358510104007635825164255281366718210826439630161111802075238370586549939;
    uint256 constant IC15y = 15379965727126747722053549768279955525033815926337381332024738751009267037998;
    
    uint256 constant IC16x = 4867886246229170039759419289808172690815204838680411868474448257458559007960;
    uint256 constant IC16y = 4163763378149801301816181974567890484365222925990852987362851493929237159262;
    
    uint256 constant IC17x = 16873727004604858780776755829043624804175869692621949599204826854143166734251;
    uint256 constant IC17y = 6244435004695053792931164896509607730281277108286930120195911345550131004743;
    
    uint256 constant IC18x = 21686198735608553362404275071281498122173166038753276265183459868331416514592;
    uint256 constant IC18y = 19937921482746497749461184056854842251508896954310886612075128632320261209695;
    
    uint256 constant IC19x = 13953789103195596175491193675776270240166584102591031257967047958721824988682;
    uint256 constant IC19y = 19859377418450635205446398419972428868102804740544278729323340973614876530918;
    
    uint256 constant IC20x = 19613487480711919207896793476044972762527827368649816392330527212516921338258;
    uint256 constant IC20y = 4783297857758296204504445872900542480063161632462287321265618477025368851762;
    
    uint256 constant IC21x = 12225935744820409469712808194887632262003832497823742519311281371023760622667;
    uint256 constant IC21y = 17193741625299433669129931396679214646288335599349316918997269064018211945734;
    
    uint256 constant IC22x = 9339806472200206663676263294495369745600713516176906943270105797436284213027;
    uint256 constant IC22y = 10116788072865113943068490911604684351796278053479967860058179091663955581625;
    
    uint256 constant IC23x = 2363754878840265015722222498286546009604251275487684966829545259272624561343;
    uint256 constant IC23y = 14417148708747773825417295725555251370743537677838818940019879457391655854617;
    
    uint256 constant IC24x = 2993827839272328466350746681439410323884856526670521070343854738290531839624;
    uint256 constant IC24y = 6866542410616968785294427670194740681344013437955401761709888752055632108114;
    
    uint256 constant IC25x = 9988086889141447366664364103689170888763829540446447245325103573758810233204;
    uint256 constant IC25y = 17635216427836906247486841612559593121460073592171333158460724098827122901041;
    
    uint256 constant IC26x = 9098340353506099088117893445556510825207630285077284951187111584786401071389;
    uint256 constant IC26y = 11022389449098454225550309154132090967153999989028978714735031668439024473461;
    
    uint256 constant IC27x = 7847090564613205236363848692658694994778924370421622681290902408610924111430;
    uint256 constant IC27y = 18315110189039803979905775174733239624001497742119885840525401933145703539038;
    
    uint256 constant IC28x = 5529290520992583127233391555322729364619007870333794138519946922349758596378;
    uint256 constant IC28y = 21337350010537659043180722229506747515251875389402838748518895518910859819422;
    
    uint256 constant IC29x = 14531386922201722950067366164222941956306135319187190798192443823250664983601;
    uint256 constant IC29y = 12765832156774233476805391417863609531919170004236757547464627975829312072511;
    
    uint256 constant IC30x = 6676583134658652590929866519327954580278725714410670463123434899206021232379;
    uint256 constant IC30y = 10745822627356621904937986356628630720988875261606628668433890766400996245867;
    
    uint256 constant IC31x = 9916559276320312023841442602617064858688258963450491970102268945125890057120;
    uint256 constant IC31y = 7711262051842314857088102473435728878707558373126802983189905351071587026028;
    
    uint256 constant IC32x = 9075458990633507934360256761557048941788685515931125679160998742759847247891;
    uint256 constant IC32y = 6589608369254352616548604706005052917382620120149336170534316640605796639783;
    
    uint256 constant IC33x = 15852126181968280003838696184951919037757385001343732463659548459262412596249;
    uint256 constant IC33y = 8317122607629818576249933772919865538048236997571047035419085623107834659004;
    
    uint256 constant IC34x = 18406324236712657121572016615884681900873659651070535414759936612908610031401;
    uint256 constant IC34y = 5429999393612322600437765407298688299696122357336623855859393642086566925239;
    
    uint256 constant IC35x = 2282833903709161152901443342962978709248705441195660810560203550144584646385;
    uint256 constant IC35y = 1225562373014488643410128917458067647720551635547207795003958168828437882349;
    
    uint256 constant IC36x = 11256370032259708141577206470451978241460044722146326738185435162783439168150;
    uint256 constant IC36y = 21356765018441806654239836301706524193918163031710532019917855270084756905197;
    
    uint256 constant IC37x = 8939295208117959936504404761141947388547908987063261627155894318000033361288;
    uint256 constant IC37y = 13133241625124996199994399104135370533045255995227454048155374399170630024016;
    
    uint256 constant IC38x = 11015401342441029078020101203900389570303962285296081928149174584461221375610;
    uint256 constant IC38y = 16600520222279674998021448305988278958104797371789004218234305221417079778627;
    
    uint256 constant IC39x = 18961597303053124931114836162941414232922974470873946197628885109274909625531;
    uint256 constant IC39y = 7141965182954946703671209069228175361280526505999997863655810335414475800835;
    
    uint256 constant IC40x = 1995086939649567365373371655164243134239618133555273065420229663210018113706;
    uint256 constant IC40y = 1051584703795704854895901261434077450623757488731993919637846573318403254000;
    
    uint256 constant IC41x = 9822525558949103556286900514926639330483908672286201568544109844898617066360;
    uint256 constant IC41y = 14636461646520467327505819497188094589802330657871301480552430268259558289392;
    
    uint256 constant IC42x = 9867415038892214953920867440407078170813103070056717637079226434646950347331;
    uint256 constant IC42y = 16361738757173304644548493852614839696980749817815740823588278174024561548768;
    
    uint256 constant IC43x = 11648141236188224215053780943553962475806576185767447712337284551310047370003;
    uint256 constant IC43y = 2565841324216811936922624228160843334376356648775081334349422155479263247139;
    
    uint256 constant IC44x = 18268857785689813651292831161064346232477162450312841854335165438567834825971;
    uint256 constant IC44y = 19079369991493358769099332127463391779914209132219699645363777395900023143446;
    
    uint256 constant IC45x = 9278174945088423656234849835465147398027750886704387383596666559891452328098;
    uint256 constant IC45y = 19244787847023609991160589698154829910202497261093347279433587052859906147867;
    
    uint256 constant IC46x = 4764156652875668152081403288032779091784774515528241034212116819453996595961;
    uint256 constant IC46y = 10749601766418734195136682730589723031935401480320099727826687609200081483396;
    
    uint256 constant IC47x = 9261403244054086300558909491163747442377176504217697058834902010403367356595;
    uint256 constant IC47y = 11357895882357461904654704200886747003830954279528449520047697920746973133242;
    
    uint256 constant IC48x = 17515149669605993681516151346346587019075777286404937404484627460966937528750;
    uint256 constant IC48y = 6562504125943312418669976963878260948820803940193402120980781501943923754709;
    
    uint256 constant IC49x = 4841981215917078137286062808960341799462111962068749895193088461261908804166;
    uint256 constant IC49y = 20695661522376503765774679552130772017288545685141577971132102573359906078366;
    
    uint256 constant IC50x = 13146262159428995143205090983381100682272114196270048276629100510198042962510;
    uint256 constant IC50y = 19142827401970129150715546627522044347122172087398570362325121222272731341340;
    
    uint256 constant IC51x = 9564175474905300921248752466663955038189551941103510842631053999017562943756;
    uint256 constant IC51y = 19190968716686657043636537729910185040982995853015971002290937210982333362918;
    
    uint256 constant IC52x = 2935058831697908944486486412253887050178119853441660196072796134437796551321;
    uint256 constant IC52y = 13213190268624332373563294854183929376738393666956919995173629886996409143984;
    
    uint256 constant IC53x = 13853745910354494248388098622786420587047052670155202317629089280730766575493;
    uint256 constant IC53y = 14230413167927243517240499617014399572203826204225597460400932427238440460555;
    
    uint256 constant IC54x = 1248597426708926459152716870846356576964591340803947818672414001778828781427;
    uint256 constant IC54y = 14339880697469246483196554492930247826104588137100394502483810031159590705594;
    
    uint256 constant IC55x = 19345780474374211987626729617197641728283683699719722885387955048997956807065;
    uint256 constant IC55y = 16001434737692943044638427730890825482036624308342937323963760034306427376135;
    
    uint256 constant IC56x = 21615576756197616830485646918622637088340708722025909831039400677078594348004;
    uint256 constant IC56y = 17966499567042185170228253095847866803622584948294340030892059208963623570452;
    
    uint256 constant IC57x = 21443220632401818569747518798746032537488602910641138354331718199591111806789;
    uint256 constant IC57y = 18522962614344644885151834694851397087826957463260285838529918585638170485241;
    
    uint256 constant IC58x = 15199073058476703871784315972828397734608262218871941920999154617229708939426;
    uint256 constant IC58y = 5470584904448136693117051592793396654697663238442904278421881996012801340515;
    
    uint256 constant IC59x = 5989688081276752822648389851914826896504755844604203883387366892353297493239;
    uint256 constant IC59y = 6303735559965378122821082011433106099552257670325643950729110686905729362922;
    
    uint256 constant IC60x = 11128615890561640926803479609234410089160812796444919390002900266191975498637;
    uint256 constant IC60y = 9608981424610086299672932696867828849076655339605434857516690721843186915016;
    
    uint256 constant IC61x = 4068783849320393038517681409157467254959138973851190130861610174054652655109;
    uint256 constant IC61y = 1755231969707813852860080923073441755311093403230896609369377604552718652666;
    
    uint256 constant IC62x = 19684884697915527287718178362643918818205493966682248796515219431142411913664;
    uint256 constant IC62y = 8608161332330026577613811143813769166755845253888232434240431486182906223396;
    
 
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
