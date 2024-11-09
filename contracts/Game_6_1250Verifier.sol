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
    uint256 constant deltax1 = 4853119486537993111139926516770023632215498636379605448638313734428380986318;
    uint256 constant deltax2 = 20507045550476738186530833246233950319591534388924258539105972061743392580601;
    uint256 constant deltay1 = 18121024714595552872673747367018737738994720573324041651551454884551156340307;
    uint256 constant deltay2 = 19685596628271914848880931811101690630511260111487787556622139080692073710904;

    
    uint256 constant IC0x = 17793646304445794359190481355225801862794051470883867464348316576579362425868;
    uint256 constant IC0y = 456198724626697137759263938525650211638211476013095558825058803926859306817;
    
    uint256 constant IC1x = 21345417538814369653868514958447214064211376634473666966409846479426468924301;
    uint256 constant IC1y = 1675662048950629461228386266800516364961208248823109160477303443773701294000;
    
    uint256 constant IC2x = 13305063765287851151596155142450501913710245318615573111836543674151673312839;
    uint256 constant IC2y = 17850882683723688572320431976961901118943428900419309079105710865673815867782;
    
    uint256 constant IC3x = 21267785814346490585509192031476207758667273364190462287516060950012831555361;
    uint256 constant IC3y = 17458058565589449173376475333374046938504877810913044848221131826148683667873;
    
    uint256 constant IC4x = 19781721635246312350367363804358107730352880823629807841528797335308469055315;
    uint256 constant IC4y = 10740460423962812164640932704400438696120504685240301979261759127450491532368;
    
    uint256 constant IC5x = 430707746312956433748315631291345535244730057554203792940027598173425740717;
    uint256 constant IC5y = 9105455770965965032555706172780547620893730082455623904236393265093350275106;
    
    uint256 constant IC6x = 21716947170999213625598187563638483790951440654619251757893434872173001781155;
    uint256 constant IC6y = 15338008149398414563616157826904172513659303498466542426381809100100550635487;
    
    uint256 constant IC7x = 2853524086895578453787285910904796036899094240748810142072280310836732844855;
    uint256 constant IC7y = 15685384784313640858324890226389502875505621374051146253582667762856431994908;
    
    uint256 constant IC8x = 6378022418496738945976499817785663491280087453100331033947365692197614628780;
    uint256 constant IC8y = 14298301610417712953470056947959445118423389039768618462561067208473788158923;
    
    uint256 constant IC9x = 1716660048698489273527280043095591833574936824882763486291782133265925150917;
    uint256 constant IC9y = 18864126335280527363122477127703826809412777841992161276526973790605420772545;
    
    uint256 constant IC10x = 17235732796405297699708135701691775166470286817908425985121041931119220186983;
    uint256 constant IC10y = 21693158696648708835463159970922577739473664481831937374746649828281249923834;
    
    uint256 constant IC11x = 10138686469657580303580235697263229829529205124679453749973909571629910189224;
    uint256 constant IC11y = 20673433888218967575956230050062231272613082326917688693352555228841245830848;
    
    uint256 constant IC12x = 10935053685181688308116036899937841951153871995139427558122863669143396110529;
    uint256 constant IC12y = 13094230757808965908190485700554532698973948379170838628965631722241564753335;
    
    uint256 constant IC13x = 142173574178966583341091597993170675506055617096050777484706329050947973453;
    uint256 constant IC13y = 4074232017236267996226879584567250462933600348026925222210043536981597913596;
    
    uint256 constant IC14x = 20675050017323165014699349522644699774100198132332440642156535527278416259514;
    uint256 constant IC14y = 705409795982312123575253092638768224062925666335190116127003036024843324189;
    
    uint256 constant IC15x = 17328770166255149071243987169271904886553634524554692641086385980871175532225;
    uint256 constant IC15y = 14414988804455920050516314439800634387973564539538886205079705982038899620230;
    
    uint256 constant IC16x = 6950079612631286121504968781734012837791761997473441263869304203432792671596;
    uint256 constant IC16y = 13301481194820053116780504937508932760003848805225280415605744439290971517070;
    
    uint256 constant IC17x = 16665040919308521654604238859346102527172633873258205226151591173715617098006;
    uint256 constant IC17y = 2738926315084289287665273628830912404295842179786248543962446064371933247910;
    
    uint256 constant IC18x = 13460216634055293271148044185385764326746543742843011964642593071456208387975;
    uint256 constant IC18y = 18493522609019106455564193472745325473696452649965187187361878713644409637964;
    
    uint256 constant IC19x = 729871615156099256499098218444585657055135442060405509437043485970818993915;
    uint256 constant IC19y = 17763575967216818810612275658887931424055542331216820080852134762147867983361;
    
    uint256 constant IC20x = 14737005608234606601902233559998260784028095110519146249199009219143153880135;
    uint256 constant IC20y = 19055082392858408802598917038174094364444140118069983311171422673415632019929;
    
    uint256 constant IC21x = 411504632034565140251250959253416457014207852638622186870707795480271526275;
    uint256 constant IC21y = 13367651421654503466253697185946080290424033883667511792483815774136344420083;
    
    uint256 constant IC22x = 2767960476275800407664077396771341014881457411150247289685330008080196611143;
    uint256 constant IC22y = 4499472076974449735672529832235188402193019523385238871002496536701300381057;
    
    uint256 constant IC23x = 4454419336222867002619213265610274255079255842411103896990416303683838756751;
    uint256 constant IC23y = 15857243127614340845261305288316021871665874325493740669499003917922873334328;
    
    uint256 constant IC24x = 5518033889069766189587826999173828700247234371711539341052461811305150778555;
    uint256 constant IC24y = 16285775812892224527741431449573656900227411206604246296113543177906754013231;
    
    uint256 constant IC25x = 6413789654575420184970066081055050050307510083890435541702098466722313434043;
    uint256 constant IC25y = 19176479724641023070256881121929410145236339001857026164939668827868954383399;
    
    uint256 constant IC26x = 4838464185812383506087711984784375358822937701055414877578544843950233334222;
    uint256 constant IC26y = 15362074879611858236684962057326899633400087339959017760882668598406599813541;
    
    uint256 constant IC27x = 16080633967005427337982920877804343277769895632369602142052624944431161282810;
    uint256 constant IC27y = 5026289002165383480477497520063353360380726786214173039552824052048554890363;
    
    uint256 constant IC28x = 11440438624522191856617541214269889855712002378403489386737337630268926164753;
    uint256 constant IC28y = 6393902461575559377337927231111131450974998534735913309343944139426280359877;
    
    uint256 constant IC29x = 12466305616768660903934824533531911530878427515454962471853912931982496793896;
    uint256 constant IC29y = 15973568068568479939655507060860089354403405928599950407309328354902937326099;
    
    uint256 constant IC30x = 5245078906588993769747128227448307474195451854987019607893473553300510690814;
    uint256 constant IC30y = 10657711985225672528265282600343659733804654375268789305851336885258669995444;
    
    uint256 constant IC31x = 20563285692931016397745333575473076045282959878088054146134916582179778357738;
    uint256 constant IC31y = 10531528714053579826680897526572105371931170939561708961545223192822654406771;
    
    uint256 constant IC32x = 10939518768555617339263341152839858038745134150752359987743086689400693127724;
    uint256 constant IC32y = 10127057656859280841275556673951680016705360268179915282853960806019795274558;
    
    uint256 constant IC33x = 17911336711075251749403798419346231601367265763711639011434948312295629679945;
    uint256 constant IC33y = 737430577243995866029887488201507430460391027031264438591521312672721677887;
    
    uint256 constant IC34x = 9124694822564797078569934368928674513688500168102648391171940008157609159851;
    uint256 constant IC34y = 8012001687935908979437806966038831970776624067871487319503121756888739102802;
    
    uint256 constant IC35x = 5636865972131027051229130507726640122592582911132729695552206504511739882662;
    uint256 constant IC35y = 19930213750600330481638579634784406242479281094419603996589210926608328209058;
    
    uint256 constant IC36x = 15925979210206718619976910752625023296912624319659271998557107731385983992508;
    uint256 constant IC36y = 8621896390590383695099653853693437612106111782908600544394752448281798053306;
    
    uint256 constant IC37x = 345619542078346411359055862944357606547720306884178846356584984518334683700;
    uint256 constant IC37y = 9537046516388915345044293914609894806772039011117259851271057635707310924428;
    
    uint256 constant IC38x = 14975346233426385082357525150301705368155491018324267736674523739422785971400;
    uint256 constant IC38y = 16950680882824311060620016831085912608093789804290323195724015787082083407839;
    
    uint256 constant IC39x = 12774159438820128972980257703653858481864002082721121438526760531273313925070;
    uint256 constant IC39y = 13833529321360730384724703156641949834930614523880383389459301935033669174990;
    
    uint256 constant IC40x = 6205484596819160817367471147622555896444265765313458782197940131631748846723;
    uint256 constant IC40y = 16295984747794033449698217326413499458505424729649083540686388882201017690658;
    
    uint256 constant IC41x = 20286176649723123023587911182483641131231809930297676390584258973833074894238;
    uint256 constant IC41y = 7967370915362951970667225690866148886021687387122179050230646690806430643833;
    
    uint256 constant IC42x = 16554241912733925405436721195347287888973622712180647390154099647688638825300;
    uint256 constant IC42y = 16453354685518481387493335711124091325237445571227896578402097931166091757097;
    
    uint256 constant IC43x = 2299565510459627084740368187241398731735744337242198202834475606942495226960;
    uint256 constant IC43y = 16322636908571814954774432115857260223579202164462996943910078495441904710567;
    
    uint256 constant IC44x = 1460125438983468116443213464876422732249892843495277382796206087977318869281;
    uint256 constant IC44y = 16064127015924219340665135064058447157760515704885533375145254532729340281356;
    
    uint256 constant IC45x = 16014720149207465896384379806852331929781050383438946171043415725297385964392;
    uint256 constant IC45y = 12230485875574105421553241379717583643350435675321169410532957226637001511299;
    
    uint256 constant IC46x = 8355644484858335216355135523016554779564600670865397480043520600122344327623;
    uint256 constant IC46y = 1084594769097441165646852170956117733126337248694685872180438987750964505766;
    
    uint256 constant IC47x = 2841694689346735919546677042352819060871223882281585046468472599905826205992;
    uint256 constant IC47y = 1099172509264462932854867550054920571989467792203148490888368784847370993413;
    
    uint256 constant IC48x = 21698976921298739247932369877717999440007710670360139293304260533710007634869;
    uint256 constant IC48y = 4712920717080542997878906362501739917788083886196416084144597683264155259739;
    
    uint256 constant IC49x = 9691051135500241768520598190309338249222367189329236766006395369793782082937;
    uint256 constant IC49y = 20348301448809946858937168896561218154110048996745850238305332927858926363365;
    
    uint256 constant IC50x = 12681168519474719077397835847656437490498876522967229009648538968301855567400;
    uint256 constant IC50y = 20999394491409636155022471235899618385290788679721135630106061056923259526491;
    
    uint256 constant IC51x = 481325375673865343791688200682530051940480835909294027943091340627474675373;
    uint256 constant IC51y = 9548577702442169301767261013360248888880646129512846128700934753170938677489;
    
    uint256 constant IC52x = 732215848097957767557909039566275130251128338660051996913683646616559641129;
    uint256 constant IC52y = 12649608380197731912871242367635056632609333218070166234651593361456590053032;
    
    uint256 constant IC53x = 21699278003983404453242858825298185517891003706605896805223896656836531199898;
    uint256 constant IC53y = 7313835055425416139864663941274857335646678253543730862767245638397457879969;
    
    uint256 constant IC54x = 9512785427431953050731865833940738787964595094564777080092218186787860660206;
    uint256 constant IC54y = 11778908186909562858246285521198266488943020807528564360007577749262234426367;
    
    uint256 constant IC55x = 14359850361272309840522703832157571124274462226169849193154683426706950253793;
    uint256 constant IC55y = 17880771753889641654289505727705204867194265180780476133088899289534479610810;
    
    uint256 constant IC56x = 14437861869290139482260088657754866841978644226615261976993631207135234665952;
    uint256 constant IC56y = 16903854668376934576523812828945987981324302138359444783028621903443289007473;
    
    uint256 constant IC57x = 16899302163799524688272302193347383455978920267419892836120612475589673735552;
    uint256 constant IC57y = 3193607106257721124549928452726979299861295577823284554506235258380881571293;
    
    uint256 constant IC58x = 7835984703658086746400696529219320122983355619366973824826246595387375863158;
    uint256 constant IC58y = 21624144608885889090665334754793276090830315522867902020269307460262352845329;
    
    uint256 constant IC59x = 4009174267309973360110732490822414807467659916595285522281847371169830219317;
    uint256 constant IC59y = 18510181848256269339164934249823278016105599928793844170413057591164777137969;
    
    uint256 constant IC60x = 803681411278014111598619374919737300026680854734392540698950756488116524201;
    uint256 constant IC60y = 12521922961609897941825640442257534885716096444935373957714623215258548050601;
    
    uint256 constant IC61x = 1593706337465477343904898691639214732492745190122959293765218573972107901065;
    uint256 constant IC61y = 8699404950570699076530724201955838898291149801772506136933617278093593356209;
    
    uint256 constant IC62x = 10099679394382498282334210242831876763072318208487148598653084029404088732023;
    uint256 constant IC62y = 19532484793059550454038414672957800931008040876883292830215091399414536188696;
    
    uint256 constant IC63x = 8424944431024564637512076635324718204023927376910523795296868333051918267307;
    uint256 constant IC63y = 4770422189222808606946588985712055719821501306871435985659322177760274953663;
    
    uint256 constant IC64x = 17463826681248583896992603284726683644139246502728108696814069383264442265767;
    uint256 constant IC64y = 11881736997926523112506738642539741647619141615429909129970831041619619182560;
    
    uint256 constant IC65x = 11434273488265663757578161072914875544685264855041797721133512326646216804632;
    uint256 constant IC65y = 13952353103229210546287274250218502722813508311374168986783268788265521826216;
    
    uint256 constant IC66x = 9143638153522033095277351079154813787173608844771156400332452083246669126020;
    uint256 constant IC66y = 18943540824226971901761657345510122388821183872317138843249592495601715436536;
    
    uint256 constant IC67x = 20400214811085236933933731319886081091500892989951193740273692735840999808820;
    uint256 constant IC67y = 334733759023515278830096172618494261042144673288211415899201836732370073622;
    
    uint256 constant IC68x = 14970902131208028457659166816526102667185759431239391562909854812203606070886;
    uint256 constant IC68y = 4685153473433637638579933788508567754623068856114484808720795808488198088658;
    
    uint256 constant IC69x = 100708137549012056287994128453318979790834355421486691517795650974978169859;
    uint256 constant IC69y = 14199673114193478887404032761757235378079765436858411873757853680839224732079;
    
    uint256 constant IC70x = 921770324873611956914918378536008532817281860796858045279840590467044746211;
    uint256 constant IC70y = 21849294475529661643434399487276926557439101715452922706157641439001729363647;
    
    uint256 constant IC71x = 13210949481929613455263490613074038377640746541661118555859113954699650473788;
    uint256 constant IC71y = 19518517461471686888479787493310398619123458776474471745973064999692801916046;
    
    uint256 constant IC72x = 15615322929434480027315729297833262977569156775953782501753459426281486053213;
    uint256 constant IC72y = 11135035723056477791799354118517993963442482915121315786216691624825553512415;
    
 
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
