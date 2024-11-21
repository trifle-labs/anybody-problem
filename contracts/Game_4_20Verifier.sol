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
    uint256 constant deltax1 = 6582808995186572554712453396739685223518070769299445922907784448024708451535;
    uint256 constant deltax2 = 16220871310876092658521630549238389230186082651148042369844538423518205776454;
    uint256 constant deltay1 = 14255457773866568217128700180401295470441528872252453431230752410101618825365;
    uint256 constant deltay2 = 4687690264269662847657605567053563247514065983919766593063418027155774959506;

    
    uint256 constant IC0x = 2828902839578276038193443186349470102672747282669648817598101646414229983357;
    uint256 constant IC0y = 1404539186166986767794827392794039462229846802403070263555767290721378908930;
    
    uint256 constant IC1x = 2103280060569099471838407333425245144620170198756789991901050575559489772945;
    uint256 constant IC1y = 20716851890558972080189981761375430324040285553323864626662004159273295506736;
    
    uint256 constant IC2x = 13641459169670747811750405982169522918979653150789571718817479141849780940186;
    uint256 constant IC2y = 7776125843420229904612383223976003659294151947158657099694823043540284213713;
    
    uint256 constant IC3x = 4956326181587586226751737320087806850515737218207455835647082321656553222480;
    uint256 constant IC3y = 3145177280894542035168453203026811934471603785730978165435540758401915112683;
    
    uint256 constant IC4x = 14099325584884870626972894221491208620847903583868342622396987227140443286079;
    uint256 constant IC4y = 11135004328085481825981671887964578214940136916574750104789040824563030185051;
    
    uint256 constant IC5x = 3917024054125833185355491484181302502216517916486173232878383955246897494168;
    uint256 constant IC5y = 9578484157897281459465283286269502235786943413614104786709285235473245305876;
    
    uint256 constant IC6x = 19331728913857774388748753051144411927178286347348356049776981343167217679170;
    uint256 constant IC6y = 12730763478717426511635762965443918833873329705076306049508838722250499332796;
    
    uint256 constant IC7x = 4075537215457920695970931089044392708771828849000213557275639650398406315562;
    uint256 constant IC7y = 6941920847438224689716257046093940630139179576603620212318073419444306485459;
    
    uint256 constant IC8x = 9059408547107184485916992873362932869300288000640935822969788845229609582078;
    uint256 constant IC8y = 12670645025926652039672308615395886027423207712811217940510566624905047943317;
    
    uint256 constant IC9x = 15787179468769483549653187536786081354771127282698955226107558810736697133603;
    uint256 constant IC9y = 9079272647737505180344341391689837632978168033408889682185721072509304157986;
    
    uint256 constant IC10x = 16310541427761545765111701953869724650295378884615765370721536606907542888253;
    uint256 constant IC10y = 18466199608670281342411044235503754757550035380442648390125953871390260340266;
    
    uint256 constant IC11x = 85647471650775009036792002984621026676473840950996306668069424094024393451;
    uint256 constant IC11y = 14893882381265789936335863806177267940857752118239495046908829633476573902258;
    
    uint256 constant IC12x = 20717120037410694864383155813149851098914063340540871742727133486645389256899;
    uint256 constant IC12y = 7268161190323924083689884512315033732501430444026105779199374780553238005069;
    
    uint256 constant IC13x = 2823990268313472553935134917893044309634597563860106122767989347385009118569;
    uint256 constant IC13y = 15538117454636378448381088765342008120177152317674307154923671349605024710130;
    
    uint256 constant IC14x = 7114180163146596275192474135609287230382986145467430624860962742508136150319;
    uint256 constant IC14y = 17634887659227141298612290061793595387906406524785090775295351332432470588472;
    
    uint256 constant IC15x = 3020261246489071998543709084739257393174561282016715874992960263547170216348;
    uint256 constant IC15y = 28510467536706649938890578771292275325622118196282815271407195357822575437;
    
    uint256 constant IC16x = 14763751490551605207714216411591455511793381895656744082522874280872530308671;
    uint256 constant IC16y = 5901185292118202355255422286943175354137320221186133549678911320168484429005;
    
    uint256 constant IC17x = 5351194280710830083089910928410679344446978849746172012558905434079081044560;
    uint256 constant IC17y = 6225899924215180771666108569912844152406857923426110093219525518808030155525;
    
    uint256 constant IC18x = 1945924107049911535730571834499773335832503739815483448803151142255951147848;
    uint256 constant IC18y = 4655517686568512890184768598313892953254924834291602769313537167620718867318;
    
    uint256 constant IC19x = 14886649837804672059649860425546877762784825978936923661902816286478060014929;
    uint256 constant IC19y = 18792002790886066135821689608400386323092888002754078737319002566708861840061;
    
    uint256 constant IC20x = 3006402280118820744942935618784447664160314795537305780151346437199669514169;
    uint256 constant IC20y = 16173079763625715819863367118637103096712607825052967459322611294925466279417;
    
    uint256 constant IC21x = 17285343239588721907255340181082272075587762720976933836007812676087052495294;
    uint256 constant IC21y = 6694454313480976961368894941570100405853963326723123934470671427211764546002;
    
    uint256 constant IC22x = 1371864796551355018095793081822678031591029889105360545730657777261117150304;
    uint256 constant IC22y = 5035940640665292479047698099581862779279187118104105274553537105534504256998;
    
    uint256 constant IC23x = 14652054951878581804278918243874143748040228660400601992965461708511847559093;
    uint256 constant IC23y = 1472379801643689241873483817662947161181840990640443368507104826378715523978;
    
    uint256 constant IC24x = 20072748604377995989936904296395745850877793917740362980743992393228024739686;
    uint256 constant IC24y = 10145353081802762925125704388255195981151936131018091985309712936366084131030;
    
    uint256 constant IC25x = 13619054108941145666675309020045257577673106189652071839704443264659101767108;
    uint256 constant IC25y = 12330585367391214941864456708314367566527962882089267604751022722329279290138;
    
    uint256 constant IC26x = 8305900796285755633384356168107121729585262588053042412812986294887404565258;
    uint256 constant IC26y = 1515520174131892976578253156117714734143754499866320754051827832656585875803;
    
    uint256 constant IC27x = 4557777697796746242730682726299039106592954383395222280648674678429765907633;
    uint256 constant IC27y = 4473521648256234732142690248690261438706938425526557338376991377077304735282;
    
    uint256 constant IC28x = 9770472826692646517807385325142998432565267911322833514440248613070225159809;
    uint256 constant IC28y = 3718700672944604421357506479942428208220768978273235778676598005883278544017;
    
    uint256 constant IC29x = 16060797312843869376086632406513882999523664141450656458646783980101471850277;
    uint256 constant IC29y = 21552037803353580033501535682109565753580630786608976256631405888208713041442;
    
    uint256 constant IC30x = 15148463067713313370680332718323967695668882099820066366901714082618379615597;
    uint256 constant IC30y = 10828858852135617340531169653042878697066969722153089942402748227220520864776;
    
    uint256 constant IC31x = 561205430223439591375222937612736217359274483328906249562168429675883661092;
    uint256 constant IC31y = 10081015954203664630752507912472932476800443963486248735066105288855937750562;
    
    uint256 constant IC32x = 490245103788052703520789245559002764283838703323070153797731359948427553521;
    uint256 constant IC32y = 8386084497369910609594014959861196406332971984167281222076843173544555313733;
    
    uint256 constant IC33x = 6646081547480432575330364774726770799557412101629242113169345575147343531639;
    uint256 constant IC33y = 786617492704568576237265843644318845057151585635086772665718210272274387581;
    
    uint256 constant IC34x = 8466414591840663582632937060612829320807314382058569806907226703648675529861;
    uint256 constant IC34y = 16017774390411956785290354913233887246850864631355385533633990913029178817862;
    
    uint256 constant IC35x = 19699065114238503168741082459165865156248463869564395204010373417705455228553;
    uint256 constant IC35y = 14409922346129459163972034558169676994418217718572457401314143844229342204328;
    
    uint256 constant IC36x = 6067251916952919288294750916524984095088205970969091231589543437079606714108;
    uint256 constant IC36y = 3143807825764393566937772935955207159216747055021926737424333176252291777070;
    
    uint256 constant IC37x = 11415003593937818341215556237202919418585855978744310918639649181632436688823;
    uint256 constant IC37y = 16952102429497837724034425451639701988019247948534843958532496334978169919811;
    
    uint256 constant IC38x = 13657666092148640299194309957776245537824008186538535231343856947649706053941;
    uint256 constant IC38y = 9396382668207068347504143231098658017769198239867014344996022721779129777858;
    
    uint256 constant IC39x = 1785732522703216728186899506074353645836819654839322314560102718450566588999;
    uint256 constant IC39y = 6865821372139813677931601350630634066223121919224225211794507609952506145071;
    
    uint256 constant IC40x = 10224248468051684750733216773458459636401100720145327972778500450556659682865;
    uint256 constant IC40y = 10566133765670173958024011028569329400824865276098440655575551064996597591942;
    
    uint256 constant IC41x = 12573568622104763042076223589269386384785210975810788299746880705422245957998;
    uint256 constant IC41y = 5905051912104255687075722305649570843897103991317334620617109271426921023263;
    
    uint256 constant IC42x = 20528379922667167770500268639035257294112152606376294973458699510095603183217;
    uint256 constant IC42y = 14901263441614774257075397065767671166366537929050445836947801147242159243480;
    
    uint256 constant IC43x = 14490917941141935812476557381894841059099362760468573405188400394061435681763;
    uint256 constant IC43y = 13086916293381779450382830741998263738709519528392967936103784446259217816245;
    
    uint256 constant IC44x = 15822567680088944280083487637482474157167612532311122817337820530925337213000;
    uint256 constant IC44y = 19621931177509926716993072851044888313944300121694838525877979244467852084275;
    
    uint256 constant IC45x = 8823741225783963795535104586756138900194365311859941903335075950592287167238;
    uint256 constant IC45y = 114986791286051485742711052496708834424959940924423673484904368157377216423;
    
    uint256 constant IC46x = 11785402127796751780783924367854752699926087307579903799473102555885312164513;
    uint256 constant IC46y = 5483169917567693783277007997962390689567401507471725291421969416466886025653;
    
    uint256 constant IC47x = 13947985717330982063307929155632276384062573893549688035100012571136118463005;
    uint256 constant IC47y = 2508226307428280774915887341688514952442388534598204736775048181486860199501;
    
    uint256 constant IC48x = 8198456789695313551902168876725077990778480123652607171846007279593831680347;
    uint256 constant IC48y = 979943406311504652621464041575448800148844120339790871232781609004674880104;
    
    uint256 constant IC49x = 9836943313679713646679947339360386193227948076582311028934064193234287196165;
    uint256 constant IC49y = 11765581428724323207668807735060154943342601722223709980866508450161113409674;
    
    uint256 constant IC50x = 2449926140775964627258368443906516902899149823933252694060018538135300359508;
    uint256 constant IC50y = 15143849783681472175139610700218614529971577450167146472229608375198159987580;
    
    uint256 constant IC51x = 4845738079177155541174775573126292783963887360269814564786509372259046164659;
    uint256 constant IC51y = 5582120346752015209883795116966208366218705718254403308244186381039635043940;
    
    uint256 constant IC52x = 9427221810137184898363561534534333813879313854851313277835738534855410760807;
    uint256 constant IC52y = 11254684797363946925852754365408799665126282895862547580899855308711381951037;
    
 
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
