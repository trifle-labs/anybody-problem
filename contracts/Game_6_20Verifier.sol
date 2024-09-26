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
    uint256 constant deltax1 = 10822563506981134671186004169307698867084491152273610325788807657327060327909;
    uint256 constant deltax2 = 19799304242938578016746445292829309671519348584970999777288072887633378839498;
    uint256 constant deltay1 = 21675960213992728327978924875492472387904177905601630779816420279126165861815;
    uint256 constant deltay2 = 3272188712442877466069474247969049179914426739701578920091785157647647647806;

    
    uint256 constant IC0x = 20941078105862902640672324322664284540959543274013772300709623117610023640286;
    uint256 constant IC0y = 2914632583948321609824843326100267881344633326331399340484341487974336237963;
    
    uint256 constant IC1x = 11104702129212425077381153330960826384803013121590100936276945994771944185057;
    uint256 constant IC1y = 8052352468811360894339492197067788325487336790046018322889345534299167005105;
    
    uint256 constant IC2x = 4435267008133121512071650901561661204868164198063043849869425387323641471505;
    uint256 constant IC2y = 10834090578527492670474171800732566147054035155886868898669736196239928213140;
    
    uint256 constant IC3x = 15663324809542285738111879862394594121187750853481267369829239510312351723767;
    uint256 constant IC3y = 3884241917787059862544717675894741133873140832888740737111969067908906451147;
    
    uint256 constant IC4x = 18295986215524867293581685835700041431396596012322480510382954552923920021712;
    uint256 constant IC4y = 10696075483615887985590161356245954413660602118732941596612969334388376911820;
    
    uint256 constant IC5x = 1616739655302156193198725461449939427137858442002525846913863439864550849909;
    uint256 constant IC5y = 3563984851132693212130682518416361654584520795237418909428278442645779143086;
    
    uint256 constant IC6x = 5232835108689322769423402965446856160571797257560875532308390888144411643128;
    uint256 constant IC6y = 2505132840778846732175606069232607894470533776048535662307434909751316957500;
    
    uint256 constant IC7x = 16393289592812950417966655940253314002382113387231903316793358956996087576590;
    uint256 constant IC7y = 18174914870097588535802988210053503315638724518211200073561211542759352086983;
    
    uint256 constant IC8x = 11540135278510143336496685850174167706899187516262424960180129311521942731845;
    uint256 constant IC8y = 15319321830602275789036695934578026924566691110518377935487495806657308393630;
    
    uint256 constant IC9x = 13619161389053391730500275210426698199773876064974511680579000033527024226976;
    uint256 constant IC9y = 9042051300073356482889663944119355021613851802883689075896223624587351642715;
    
    uint256 constant IC10x = 18109007556977420986361126729485718440226703668603904938180044437137140968016;
    uint256 constant IC10y = 10809561532950217440191810966542245701300899672541333694011520501525887130566;
    
    uint256 constant IC11x = 3272351704635588023133927909939426139305676809549286071661053125467319719344;
    uint256 constant IC11y = 6087703614494848127901670468540106236265812921231746345427433535428877024903;
    
    uint256 constant IC12x = 11573457639286400199855958526134032112134681879250089311732394845289706184923;
    uint256 constant IC12y = 5606173245866893728244099136293302853399900279182401633716599723818047988730;
    
    uint256 constant IC13x = 6690589698763252094769332601507328340625062664564380681881173738785476140264;
    uint256 constant IC13y = 2804325635274643182335141526576759626418665523590629023817894226764027798040;
    
    uint256 constant IC14x = 13852493502932636791787646798069531863880879624497154566164226241231709737539;
    uint256 constant IC14y = 16476412546636021593658119775291920251793465423736550162154403287255624614952;
    
    uint256 constant IC15x = 6761363128030860199893404069059762279101115809819001881545114395342891740822;
    uint256 constant IC15y = 17080515551561050395839243330469047135825176022005604248169554713456257872126;
    
    uint256 constant IC16x = 9110272419850879935347201750948190096425710240041655982489875652666518525197;
    uint256 constant IC16y = 17103708926566817324834687229754477522811905989565980114700634173438466332302;
    
    uint256 constant IC17x = 1479987346801906994710512032735983740786678553629977729748280967426455731196;
    uint256 constant IC17y = 6964737511006588077961567785534911077955242932777930966630895790399140953019;
    
    uint256 constant IC18x = 21779225890762036147544323486987079004595936582896215659536539504090660012740;
    uint256 constant IC18y = 14671878214696577910084356605811130219582107741538403154652236656889236097642;
    
    uint256 constant IC19x = 6661653097834435541515495806548177369833589983927987170787434501557793277537;
    uint256 constant IC19y = 14887823754062326714465185357564788271753449988651250121493959663987451336833;
    
    uint256 constant IC20x = 4761238007730529105770421862431068683892688492750629871208711601926817914089;
    uint256 constant IC20y = 5369403063057757151092150179875217622554159335638945089550445420359253079060;
    
    uint256 constant IC21x = 2104520663775961894149268996862295509420949090404322620146182446263578893167;
    uint256 constant IC21y = 19986049142289083266502492943127542171257134623066342789295269770913632955835;
    
    uint256 constant IC22x = 12500017317060789299529311029846712844371309578324383009128711494122814771540;
    uint256 constant IC22y = 15081646320542747072958763305201821218371737532804053503131533421793616289582;
    
    uint256 constant IC23x = 16121813701906797416265175844412556427216698793293738485917239641945088217246;
    uint256 constant IC23y = 17485686152009653185881989837830363760483927433519510041625850015571705342571;
    
    uint256 constant IC24x = 4438695095513437455030022217793574382421303196339647841247096380114779929724;
    uint256 constant IC24y = 2825944803952065212208519910608940691742155811484437223516495301495698166145;
    
    uint256 constant IC25x = 9360715362336817583371347543695294493071522926221190369848578331802832740249;
    uint256 constant IC25y = 20214181511286210809144905751837078779492148081616446913715977526512111233600;
    
    uint256 constant IC26x = 1538524231524763432498433332074742634720833050975279198626149747751538174007;
    uint256 constant IC26y = 18698969325533972815132398614662057521213914537054684228180712591851251630352;
    
    uint256 constant IC27x = 9922640554794206623344258636626741668813193313888861891654373167684204944414;
    uint256 constant IC27y = 15657900199358708123784620432363019716931878435778184251883469643565483853348;
    
    uint256 constant IC28x = 14126095475218972193058740640964921870678203905908731888544444460088195554579;
    uint256 constant IC28y = 16453621068881131865725856202276033779511890620856597319140069599835962150840;
    
    uint256 constant IC29x = 18200493865800409861131639629426420869696340862158694042568061308183947060845;
    uint256 constant IC29y = 4870201017714883665239228565128791974732203605720506604076434880872093964655;
    
    uint256 constant IC30x = 12031663614037320777246314816478988031211414569808779582403519960251620943034;
    uint256 constant IC30y = 21157712074700749298411830520924792572392894361024532832950086949222616963666;
    
    uint256 constant IC31x = 645817279334097822709577245849759462939813139142398324516912805142666733613;
    uint256 constant IC31y = 1501528927381430074489634582462016772108390740851525183885941647423607768000;
    
    uint256 constant IC32x = 6764341231329176796786287419791754734553398980118423452734634261537530571526;
    uint256 constant IC32y = 16172208098460802134266374531389138426561404799479946129059926402691992730901;
    
    uint256 constant IC33x = 1268808520303406106714443507812397149467833191981530708476379464393631102447;
    uint256 constant IC33y = 20896280437436107023929098452582586075100193147026527217740972074346638294786;
    
    uint256 constant IC34x = 12661124786792205938577184468138266444885879442518346870039409583307200083656;
    uint256 constant IC34y = 13922232898668186834422016022441396260376473601887187408532667798933258517502;
    
    uint256 constant IC35x = 3044318513496047929952247265321473723184044835501974118360065338285181181073;
    uint256 constant IC35y = 8212387945590564627600898859823078914023751169635089797963017736082786908275;
    
    uint256 constant IC36x = 7770925458301604078788517515611840938023168925703342265977736137795641067357;
    uint256 constant IC36y = 18120201495755211944561271044717601861420293905898281077955893062573423221038;
    
    uint256 constant IC37x = 12931527800899365381340197882548090327937190556652321638143083002320673383759;
    uint256 constant IC37y = 10041166919114907104517900225363487433936646619571826542188972255130352432250;
    
    uint256 constant IC38x = 5669115465376604813056849358069112130588258666310420575439667895663363153069;
    uint256 constant IC38y = 21661997612986953630502352336625828627751714548191209720378245196809198255054;
    
    uint256 constant IC39x = 6359011361545178253028612668068052654008349152681739247690926777351450063755;
    uint256 constant IC39y = 13322135351879559896296656643914077187774082877155434940125120268843328982097;
    
    uint256 constant IC40x = 17278597462650802226149007664379695150844747868461498829195188694317350874947;
    uint256 constant IC40y = 16831789710428775622107399756558221633171448728212315852188273756266645651128;
    
    uint256 constant IC41x = 4061157211112218840314494561186352550733907217631108427638809111495264845634;
    uint256 constant IC41y = 4268460078904706136619793281526544222979975734187084276171010518331468204442;
    
    uint256 constant IC42x = 3930597052321448015713971929934707318602354848214967393205557520698027608598;
    uint256 constant IC42y = 15665055745809428299094874805484774185007327843064653200645735945871788277114;
    
    uint256 constant IC43x = 19464287973348087960216653011823743377430123154139163233991948109171115695424;
    uint256 constant IC43y = 17951707391895501001218905724358812875871027981216961926312862928216260647921;
    
    uint256 constant IC44x = 13960925145313947503841961975874441756287938544728010146203312720691316608499;
    uint256 constant IC44y = 13908192597294832448898812588319385708583412468255426020407645850979998019609;
    
    uint256 constant IC45x = 7288687885986843207735100046816686579637520126658057803382017703119386287163;
    uint256 constant IC45y = 2811892151871940636442020760423622356880516736515000099911369633214282438451;
    
    uint256 constant IC46x = 14294252953320748370186767374717973932416015196053563100122425649481071260031;
    uint256 constant IC46y = 1888301226143590620353949860993674229199371435713273053506748125821641632592;
    
    uint256 constant IC47x = 13938220524104013390780380931786807397840833709344217934263226657398109438220;
    uint256 constant IC47y = 12472362527267990684915225675414495615435733870335193168767372263283504512429;
    
    uint256 constant IC48x = 7310617460129232658689434854220551799393530096930183963071014510845217191702;
    uint256 constant IC48y = 5038165405878834822322272177261113172400634069047261907340399821285442046752;
    
    uint256 constant IC49x = 21688561409767943514705181152648008638137515581103450501557707226632520515242;
    uint256 constant IC49y = 15243847221447813685597142292023090971896164657895357497807859421302956546906;
    
    uint256 constant IC50x = 4381275006947016398081801803761378342902509022112334606606206261734167988407;
    uint256 constant IC50y = 1184158640544108346332394272350813101751014913855962905537502025962418229826;
    
    uint256 constant IC51x = 8527958281301109825361112189725925840894808592248460596156688848034658288497;
    uint256 constant IC51y = 17216552915349956123663433226208551812987694260796860034246434355578542051923;
    
    uint256 constant IC52x = 4653080921232098134178885691727497977095296685213214546940457714064605196608;
    uint256 constant IC52y = 16787786506480682011007340520417105717623466624422566001182110043590983305416;
    
    uint256 constant IC53x = 1399748240405655391463119646973704563380329947182604529324210089706449804558;
    uint256 constant IC53y = 20217509538122811703370851086336004302646797439059028787612493994266801622420;
    
    uint256 constant IC54x = 2876138564665295293741690965395641479254747333360802414052106112801654525002;
    uint256 constant IC54y = 16122922086572348809151484125514140316187620672206386750124292790482758125572;
    
    uint256 constant IC55x = 1176580347155966895799949196851313986526669092270256269261813683011056390138;
    uint256 constant IC55y = 12752214120405293036258888325380040489433827592827642675874256062200463986813;
    
    uint256 constant IC56x = 11984323391640990420630104940902741752545616738389586803362286569641860791693;
    uint256 constant IC56y = 12640217710321112865382274017229362881915865327954203080143085401891229192340;
    
    uint256 constant IC57x = 21311232166959192271620824226003329923100425401527566043681519539000863384044;
    uint256 constant IC57y = 3217034342263295620637409874495570213005969063834154480283201634980772461280;
    
    uint256 constant IC58x = 16245149022297201249729265020080170278050832525659524254177897727260338143130;
    uint256 constant IC58y = 12480623895414923470078997814550421498583309539704136504030003787953113665069;
    
    uint256 constant IC59x = 8464668840407681371916064543263307811859052253545186416404831176501305875803;
    uint256 constant IC59y = 7310768658756284110350993507613550069522491855370723516757326365351535572561;
    
    uint256 constant IC60x = 5501389890829293234027407469684774510243204275224533576335464053076824794311;
    uint256 constant IC60y = 12337898237484681416029174610279232711835638061156206415155615305014650107903;
    
    uint256 constant IC61x = 18838419662768938287145972241232509494065885660077053639461870280774415180802;
    uint256 constant IC61y = 8764003657847095385204278695262207147070460141826122357640065533158481139785;
    
    uint256 constant IC62x = 3983841355019051380561911717288625755097304261743378446047321836350095613000;
    uint256 constant IC62y = 11323377434671158654655961163722262732451668320547750748455493955492857594343;
    
    uint256 constant IC63x = 14985723843988359924728559017182799673866053026717198390909686609792803417922;
    uint256 constant IC63y = 3534947220704065418227203925861594944401473661587914389547568389087944118038;
    
    uint256 constant IC64x = 1668775315137187335226097332156002014639378906246277614665268044701267542538;
    uint256 constant IC64y = 13451917482698438555489744892861768453631827995159700148055789941288940953213;
    
    uint256 constant IC65x = 11668595695855797242915059650124911218592680774810778046268384780052757264388;
    uint256 constant IC65y = 12325337971953154277311093617903584389864513177447366819077785871191820619604;
    
    uint256 constant IC66x = 11115964637123814576089601101553151446829303438375817787290174904795538374538;
    uint256 constant IC66y = 12910305956779569342046436149240795259979714884188430053910681237979232835705;
    
    uint256 constant IC67x = 2358006689582629001827418213579209771555122942258925078779659621280501236106;
    uint256 constant IC67y = 15289385209707192015018768725044312308005048287972792996479573028437345156235;
    
    uint256 constant IC68x = 2096115463046861142463931647602903725346218409221769530002842614855530484445;
    uint256 constant IC68y = 10699005461760254779313445117974027528500212208336157729145531495639631586002;
    
    uint256 constant IC69x = 14343736227313621392137153612991821987312138596979624467782996438152399540940;
    uint256 constant IC69y = 20319645031152949773591204407867823010114552031683296109508601076773914540679;
    
    uint256 constant IC70x = 14268479103312300416993344050797654779316045979211821318270193174552381306470;
    uint256 constant IC70y = 19721585362825205600226615079405136246547348409582451175875740774645327421132;
    
    uint256 constant IC71x = 12207777244183555090068216667186866057777927082356277564116013176722369208112;
    uint256 constant IC71y = 1925872307968689178138524851973915697580014772393601945456083418656802695228;
    
    uint256 constant IC72x = 5461340537114890688265484592297274505841823304971667609933528986699681793393;
    uint256 constant IC72y = 7150701002949089510360114401222317524711430462217780904403650280755624921577;
    
 
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
