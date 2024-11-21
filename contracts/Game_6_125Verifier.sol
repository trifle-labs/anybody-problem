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
    uint256 constant deltax1 = 17542214800284618289252434614794539475392343496739968826720588811991106794058;
    uint256 constant deltax2 = 7241714775968178843962304211051408366629995207668323275676571451988594993262;
    uint256 constant deltay1 = 20134737641020816829650885723044097128185374551670570401214571372922594649121;
    uint256 constant deltay2 = 4281523330911512852145371100880891761319835754263809350870418262091765734847;

    
    uint256 constant IC0x = 8960515414065762439175951891980527771624902743267644525114045224533904987076;
    uint256 constant IC0y = 10134167436360489905716559169811263259859415983996943671351818913255191208104;
    
    uint256 constant IC1x = 20079118957177375799511284213409827221410441183283075032374579134464188080328;
    uint256 constant IC1y = 10754846190670136322469379726974512506836080842778196879038725075177076682978;
    
    uint256 constant IC2x = 3277718835876942805737693034583619890348959716216865559787476559484375464729;
    uint256 constant IC2y = 7794067658453175733988197924488211469648364102137194721780416296871683865931;
    
    uint256 constant IC3x = 8994043257028266571704850838303711988266088210552030778398676985729442361919;
    uint256 constant IC3y = 14437552612488246305156715594639263511662605175550684803054103490318902497015;
    
    uint256 constant IC4x = 14297120099402618566667179561991224541163425367298836355770983265490151823673;
    uint256 constant IC4y = 11131751569460475183212442802256876626465014964628559338262446269468800271259;
    
    uint256 constant IC5x = 7593646596672700455654127338055257845236822551763941138218491857799219320719;
    uint256 constant IC5y = 16633474002030946812683232514852162907871037493091320017607837350129422853737;
    
    uint256 constant IC6x = 2402463069485642312189911767355838548582134348643864820282469509075264632785;
    uint256 constant IC6y = 10329915799745230882073503903199049536905193354100612863453997320223036678258;
    
    uint256 constant IC7x = 19856743836295041060212152877938730156954708680765824545169839595965235526985;
    uint256 constant IC7y = 19746591877749059692749959316585486850326372249938800068786404926533320489735;
    
    uint256 constant IC8x = 17924509742057807067461031696115500203291211675900250430486983582393795836050;
    uint256 constant IC8y = 19883831081171852633011516337567238020673254890024240448281478237088835265950;
    
    uint256 constant IC9x = 12597439127866522903945787998276699526372568298528945076500465471315753621284;
    uint256 constant IC9y = 8943517591989824968100217902871052654727852539500734153866364406773628438170;
    
    uint256 constant IC10x = 18491633904301956420928739635974264038312335338088499279586416399247878725383;
    uint256 constant IC10y = 14241503822598104384401078832167541520866177504153012941577672496441938926839;
    
    uint256 constant IC11x = 5276209340182563871512598757623253990082411028434596774061021129048816253892;
    uint256 constant IC11y = 20369564339563175380604348321973069442273673244669259082362423748841224503767;
    
    uint256 constant IC12x = 15176927876859366825702732195648900090793436399138178193001596441638927168581;
    uint256 constant IC12y = 14211546704733303059280244709551627683793809347505254003404484231418610378124;
    
    uint256 constant IC13x = 19215586839281070402184208840812765888657824744591584632659359436643238381418;
    uint256 constant IC13y = 13069460933523426588802761686870485792974517203422764573818323289309693191540;
    
    uint256 constant IC14x = 4785401114547322778832709325217944089240070809843296952658300093515019931407;
    uint256 constant IC14y = 8934512877694446562004413859509579678986294963103052081556842352508519347043;
    
    uint256 constant IC15x = 4224557107502775762909725352863338643408728952992821245943856203103144958557;
    uint256 constant IC15y = 10604001264755757741282523337684769079306123645409951506600885836674578757473;
    
    uint256 constant IC16x = 15967213936129735639859408030218061522706340767159412825214591946409444572428;
    uint256 constant IC16y = 19357077642585333981143422257548820195755919744772559464445771655759976422074;
    
    uint256 constant IC17x = 3229620647586330154469861599881590973415099669118610923562802420391593034249;
    uint256 constant IC17y = 19843207051887536964615042794290003122238951013103681085718260643690340254991;
    
    uint256 constant IC18x = 18124985091892231596847098852212878742803534328515681126127871275783951825248;
    uint256 constant IC18y = 13611468876641575287519803042842008021993366538877879180739395269501414881561;
    
    uint256 constant IC19x = 1745957264441020390840456758410348359891735094430394391176312552398560806608;
    uint256 constant IC19y = 12136326584390334454747642064245000909850126195043942094976563768579186350563;
    
    uint256 constant IC20x = 18517491835789696906407855869649668463113398643698255938917056544717396219257;
    uint256 constant IC20y = 6483727746632302259753263455037726220922005556421452645724239394252421077587;
    
    uint256 constant IC21x = 18237713973697643353962044406639874348543209487556364575963654596409747585888;
    uint256 constant IC21y = 5402331047908245870765227409872450539704784559122062844269929108002604020079;
    
    uint256 constant IC22x = 13803101470801554504727511290499788742327820692366606904463503189917844922953;
    uint256 constant IC22y = 900687246166530849751448717751254567174054550048128449255088591936586545538;
    
    uint256 constant IC23x = 6496889034187632403762473984983303766731594975135299445504907496059810539505;
    uint256 constant IC23y = 8796303644606473029590202427693990622887417769514524443922495416239474646319;
    
    uint256 constant IC24x = 9426365995781912907914972463960943564290104572173339972511911660489922835596;
    uint256 constant IC24y = 19756536197118509080313465551261765483535186189247418265957958252407026435430;
    
    uint256 constant IC25x = 7554897715539461288728435800609596540207483411250828442638868032720475081387;
    uint256 constant IC25y = 16635586317427330535380591768221868984576291529950326721997391244717908914327;
    
    uint256 constant IC26x = 18848219594413934823565002397265325213380153645597077036465166536877325194171;
    uint256 constant IC26y = 5519074327817892052387543639443092964882492604217910989340257137648793565210;
    
    uint256 constant IC27x = 1184855051386123825127389309939064749693926366975410375065390007141472649184;
    uint256 constant IC27y = 9021222897430626912955144987695404512855164586232217055145027970111677548285;
    
    uint256 constant IC28x = 18369548573283161236137131556744434649038419494934144122927004021458558277277;
    uint256 constant IC28y = 10901539766607669389495007340525353568164438548793173517642584989938210423518;
    
    uint256 constant IC29x = 853497424575824796484899734665261745583443250149842813360262629167544591142;
    uint256 constant IC29y = 10036810902562338811055170374827206707139348168794528713649508118000004316674;
    
    uint256 constant IC30x = 18553964889722959321691408019844984008738320800507043959472352487123348151513;
    uint256 constant IC30y = 16439347602868388555194177303343814325978524965297167319969282909842241587146;
    
    uint256 constant IC31x = 12059045053612794212944299244347505795022227596802286959795145179897163521771;
    uint256 constant IC31y = 17132551574007062349340388036051763226994273635237717067339735342171854362096;
    
    uint256 constant IC32x = 13874702273737686802125753222326502674704077739429782572669323722654534706606;
    uint256 constant IC32y = 19601173631611648161350994248991646212179513464312482156492158794964829929571;
    
    uint256 constant IC33x = 11351445678833448155452314688236951573694933503826452527837433294912260590789;
    uint256 constant IC33y = 17090956337004437118319782873501441852138868674054245182941047044042514522762;
    
    uint256 constant IC34x = 3322541883270592383622655959789076472700059600524034799063518564382443958323;
    uint256 constant IC34y = 14124045962770303688683803628872404157251436190755608204888492913244684462467;
    
    uint256 constant IC35x = 14167575554106970785520708156246534291103873761223597901866247007929645780912;
    uint256 constant IC35y = 3560057810483406531130782801780003420363796508026733852919740923994534622420;
    
    uint256 constant IC36x = 17837633581930605721071477087984378886275701119225163583587817025607365680262;
    uint256 constant IC36y = 3129825740105264423575255799262843457078836695680095704957634401332321345638;
    
    uint256 constant IC37x = 1380009537177004712039971718269969273309909881040381364195978776841579639881;
    uint256 constant IC37y = 2300580780974085544351922974807011245972195506042270605464870753951532652825;
    
    uint256 constant IC38x = 19746893526139114965605313955530266207020693501455387988741045739454399561704;
    uint256 constant IC38y = 13830330821593606478485787957126576318124613255938831041586688091006355037802;
    
    uint256 constant IC39x = 12987148621778397019257836546060396198693476913262857169672835916646303089701;
    uint256 constant IC39y = 8483379304933007754230773823604829266986415547669781487512445900603074221963;
    
    uint256 constant IC40x = 4289132875586818819198024484398060519844441403516306652769600824516626712804;
    uint256 constant IC40y = 7060107803326146003865440122560813406740112944197160267845118391004783960682;
    
    uint256 constant IC41x = 16715113330845607747859032172788597557883770848581868621537056469192247097880;
    uint256 constant IC41y = 16729058938077022334900033162345841805360458284013342085945620713929944296220;
    
    uint256 constant IC42x = 14445517999898513555443144826304079231577916727284079863438766247097250660902;
    uint256 constant IC42y = 16211123525373657113449653175274903518403068749910472388046820193748552521187;
    
    uint256 constant IC43x = 16434833035593137198916734250219336976523157104628099047034617850358784055008;
    uint256 constant IC43y = 16413354659051866028949718005181755331075278800781153971438486575439722150833;
    
    uint256 constant IC44x = 2370751464023792537531789355119119599688178075932952878809093686911655994457;
    uint256 constant IC44y = 14736931532702606470350650835306773682818783301108709352437441761029680837967;
    
    uint256 constant IC45x = 5452437795103120158358040015671488811395963008117301428890331127328184562587;
    uint256 constant IC45y = 2217803826978140060568019551329319945652649729686403417091343888082430378808;
    
    uint256 constant IC46x = 812004984233735145912370081482457433310200104488713730167942712343750541670;
    uint256 constant IC46y = 2219176944027938815987804816758424304932069692007751319692547167013087180347;
    
    uint256 constant IC47x = 9317676028592664416370412385082706974720627204610742963181023434265666348655;
    uint256 constant IC47y = 14075141049309514411225064064932183962617391821600566690573972539044637553842;
    
    uint256 constant IC48x = 13980444113743797576678295575111539759153391266619462610459042812823682307386;
    uint256 constant IC48y = 19668205335681951506436187862182951804267024643375738955143376603726987826256;
    
    uint256 constant IC49x = 8246067710312721337919822422597969793857889801652034217208244597014715139965;
    uint256 constant IC49y = 11412224146766897888666052220895278667657359280919500650586871436354840370409;
    
    uint256 constant IC50x = 6311677667185802051549104744924527857629290942858764040600490454467135368779;
    uint256 constant IC50y = 9560839192636604940001934305339297478719132538481441988317578829553915279538;
    
    uint256 constant IC51x = 14468957706809380443357148660799017812129411043973856633562235792288916588221;
    uint256 constant IC51y = 12928070042431977120653557196434352372586244468026746556591653915825938534825;
    
    uint256 constant IC52x = 21413984586995685790819005753673626025673620787086529443652154931673347409419;
    uint256 constant IC52y = 14419541702349819466277807388575636539409219235383764413489841152478354756046;
    
    uint256 constant IC53x = 20887436196938439620156447806793661825454888284691460156433167742201726553501;
    uint256 constant IC53y = 8209541081592351320643688053075850383507362178296515561294347758463851535949;
    
    uint256 constant IC54x = 12569891059599868420812267755979383937579658161789177943447339234173019698903;
    uint256 constant IC54y = 1968690439799300251254341152761179836190953855772267186675960668496861403638;
    
    uint256 constant IC55x = 112795166247687775828281460094487748113630954569024356128926731987415103400;
    uint256 constant IC55y = 7053500326626568658948813207374423131288822233258666284852666198152223886933;
    
    uint256 constant IC56x = 9275349155803899488265651030564420009167056673643438624506888629506262534516;
    uint256 constant IC56y = 1175797542509073464662860121528389410250533865115589351964920068782989862392;
    
    uint256 constant IC57x = 825877147770165664757272723111011088772215172305671495782425372606046501519;
    uint256 constant IC57y = 7387784438775828495274151555974911222483052051962421040238174184317585061218;
    
    uint256 constant IC58x = 13908071530643107315028557119942320379190951415777034501792375197633900552263;
    uint256 constant IC58y = 13925105185388434412730127739927940828604646101509874217903425308713912692928;
    
    uint256 constant IC59x = 20584446007391946789265830513218551278835033536687794980312711362657201549696;
    uint256 constant IC59y = 14447421857756152431643694507480218385563037547196285584034164283293351568228;
    
    uint256 constant IC60x = 13971891661513138448918361370856502804016053619792329837503807542693288069885;
    uint256 constant IC60y = 8885248403479150835263558334801389748825793105848148873200095155863115107961;
    
    uint256 constant IC61x = 844976624504844709651139000972125039861885970864873697332581727732591091183;
    uint256 constant IC61y = 12454342167036928867358090897955984507522445070598055645202965984407056280277;
    
    uint256 constant IC62x = 3488989273938250687211333459953592091141631409705431286458806574052772406429;
    uint256 constant IC62y = 21019255424925481531279058185868850059870923752574605825507890439233329029961;
    
    uint256 constant IC63x = 17181048418757047933858773684665271255522133487770996326544743781115263029928;
    uint256 constant IC63y = 4274045665240061876281082423570379580335252131737441176787632905926489506741;
    
    uint256 constant IC64x = 899470774570512377366153676685405356468352058150616520427762210072856439767;
    uint256 constant IC64y = 10198360198106815324199208718967459676504050660515798146928909234026907814833;
    
    uint256 constant IC65x = 2263247641920921231066082623354973922904647868125449213710549482797114230214;
    uint256 constant IC65y = 13989539308941778258744067058159186232600287220898661819044387823930273631333;
    
    uint256 constant IC66x = 19974290791628905098072012942830547180274943158463886572425408132322198225745;
    uint256 constant IC66y = 1317557771721240817394023184128626464491831623838446324104612150077665980144;
    
    uint256 constant IC67x = 5609793208626319120444447195501537876427312030929354216368959669187781867640;
    uint256 constant IC67y = 327458065216465160882667196448161954020092779938184321968102480795761328035;
    
    uint256 constant IC68x = 21691817818906961076062374936247780248535035098468704226325213010775366772018;
    uint256 constant IC68y = 20607303897258147625709406869088630875305053474225609566343337860292823911698;
    
    uint256 constant IC69x = 4029115376959344663864148087053078933700445261581283223482410608262385344012;
    uint256 constant IC69y = 4802783714498058001293847797986855313339201255234112005832558889368100021012;
    
    uint256 constant IC70x = 6330361547479029045697063510065339608147213111431780962522506459265442570953;
    uint256 constant IC70y = 14249209321399588069541119026033300656038401278671190646630935102543980943125;
    
    uint256 constant IC71x = 13523838381675356984701542976305883383530585987932386241195056964489365350821;
    uint256 constant IC71y = 15975416009985995446804134987281378490855636078889654367906956523909261973580;
    
    uint256 constant IC72x = 9395825003401660764532850673892069361794350604163128607157605106438294285508;
    uint256 constant IC72y = 535977957856547964504786609681257116473316362370580821188216224996765063479;
    
 
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
