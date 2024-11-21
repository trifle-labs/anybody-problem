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
    uint256 constant deltax1 = 16701836507290398565728365620726995004022259902973634467609383012178168768759;
    uint256 constant deltax2 = 2497047295857239390853043588452982794402175693406484183300981010727065857118;
    uint256 constant deltay1 = 14506082775736690595642225701007251089257484585990424106994486801065709544661;
    uint256 constant deltay2 = 3036146790876975545294881983098206119683303665922633426484343092099027423461;

    
    uint256 constant IC0x = 6275415528249071190283048506147700421096788402639167837799061998123311578802;
    uint256 constant IC0y = 11125713476328307246600837885641515831429100063579970807946753578614701715674;
    
    uint256 constant IC1x = 8921885145249331708349148909390219955122494651018034641630342116208288960390;
    uint256 constant IC1y = 12682565675336705012838405899693262401002855668927554680364481746606629590691;
    
    uint256 constant IC2x = 8784020164083237660713793774242105936757316664411874024272485235977976039522;
    uint256 constant IC2y = 3215215518552606703390792194596952198736910909955208830491424326655501144762;
    
    uint256 constant IC3x = 207226448510784384854359267515827600801935958099920888234849869803077899693;
    uint256 constant IC3y = 12343086164937297671424840499354513949170033949732174159988138873793959518653;
    
    uint256 constant IC4x = 18666274037896845236515191173801470674430322459212041278907787696394401676412;
    uint256 constant IC4y = 15759811872963487770676587858832716623191848631686759852427792168673159742155;
    
    uint256 constant IC5x = 9861649372263698226548219871019747372856829178951633824587069171723846067595;
    uint256 constant IC5y = 9325772416705352081404383455649183697191691085311138081090987974171467561334;
    
    uint256 constant IC6x = 16640210295139910216498364691857153660989098839220968642895371144567452795531;
    uint256 constant IC6y = 16638753001802792150948124490382129531173337005363975272186722798149999950988;
    
    uint256 constant IC7x = 9111877592285170961274955032909482806669909734004900837309819386953373146041;
    uint256 constant IC7y = 19998289148613787693805169516992098780645673695487943747355848884348989424438;
    
    uint256 constant IC8x = 20541764001822819608892052141011251455112727226682012806000948177920350904101;
    uint256 constant IC8y = 18701638987169872310475633364666243571867267569850070989567715166101994263905;
    
    uint256 constant IC9x = 12830320145266205020345180090743969005418496137014162680176943299106332124676;
    uint256 constant IC9y = 1820475766701375410826146160254603625245557432810935819141253813996742425542;
    
    uint256 constant IC10x = 21450281248220390228159374888468695181013626213454604304980718874579030711818;
    uint256 constant IC10y = 870741312596995787526550136252886843110653871222775347373904039332441553491;
    
    uint256 constant IC11x = 20166446337472415055774013539923098412726886473073765832551363682749523801900;
    uint256 constant IC11y = 1907743556310933834382911683380069679789376760130721203854737656005085241060;
    
    uint256 constant IC12x = 14708624602081471656922832031968517825804173144063519574238963236938428112306;
    uint256 constant IC12y = 15722526895061349469055406398442431683802279667419081061206405579758742320804;
    
    uint256 constant IC13x = 4136259535555310961230513927049596558460231273233038058677438331990661708574;
    uint256 constant IC13y = 18232402976485915292316368921826851250660966436099433858310126826646356469021;
    
    uint256 constant IC14x = 5523395165052304893641472559663779987781976380484909297012356414239901966071;
    uint256 constant IC14y = 5898408079236511818614789651057743546261910824133231886357116833060882961287;
    
    uint256 constant IC15x = 4462121788795337563850767782432382748481864146737013675070449537420603191515;
    uint256 constant IC15y = 11329825476899049448160818669265387152497692321770415437639982345935013747732;
    
    uint256 constant IC16x = 81952475250543084804743986355606361447233659624925727019171748976254274320;
    uint256 constant IC16y = 1487528778482135961433270276943297154528242599231400161363070928742097104584;
    
    uint256 constant IC17x = 7248509061377142823901511348965342713293982699894306396409232382162657459440;
    uint256 constant IC17y = 16810681879364048070817284096833495989233872590658055159870105845411777842750;
    
    uint256 constant IC18x = 15428849131807000119106004912126668621561530068528373463555465783764939115309;
    uint256 constant IC18y = 19211115881334697833896713355003628600430115895403258685780181202860999264704;
    
    uint256 constant IC19x = 19992705982769858372820970086337666528153873079174844248350681344597563383627;
    uint256 constant IC19y = 14019996142159169234397116086216863491125665342819335957592814934121798322864;
    
    uint256 constant IC20x = 1487916360940553929433735254433837774988566299776833972205981355639052812102;
    uint256 constant IC20y = 10737000757521294965637608151446228423324348105464668451079557787749136506520;
    
    uint256 constant IC21x = 11475511825818844655104542570576972039983623303352980540870815375635735708764;
    uint256 constant IC21y = 20029098672741380238326745236114898016228999999830565023824383296435326779230;
    
    uint256 constant IC22x = 1590765857735657809654561198095772546088732622220191728012345798903946795781;
    uint256 constant IC22y = 2497594830035962353950277151089776710455133999594397119575137923899271405883;
    
    uint256 constant IC23x = 8324400304098483514498496388937306235321012785199506948744941461651986012347;
    uint256 constant IC23y = 12978422788645716703129800090258941005903145393738282503430230544838550284795;
    
    uint256 constant IC24x = 7135802963576493429196878003230671115064118480230016211470527996990596203675;
    uint256 constant IC24y = 2096914902303980181257894152731081403690346392939161312158532673047186576424;
    
    uint256 constant IC25x = 14936375353543880595649108650524704553124976280911816168526431957385782088667;
    uint256 constant IC25y = 16309788022937248708652779808046069188045155551731636141565712576645511947081;
    
    uint256 constant IC26x = 10351884541227614348962370982772634561467340000992704265985359138299051115437;
    uint256 constant IC26y = 21320257374687919624044855223412023334812678443187448003356508624393857079411;
    
    uint256 constant IC27x = 6043803339541942597541917374643357598652738753013781665725152561059425990400;
    uint256 constant IC27y = 13572043235235523708640185505079020839251604736055151441085934268121904232423;
    
    uint256 constant IC28x = 7349825421289298757915517611991700024346868649575331977401634595332937793475;
    uint256 constant IC28y = 15569627827581362891438649105427480058968842916483805814266369236303736460977;
    
    uint256 constant IC29x = 7606567106931611457435574053898355937401673710750267491820860536855024941408;
    uint256 constant IC29y = 10551939947074055561082852255337067703994528068171719600922064880276588029769;
    
    uint256 constant IC30x = 9460453646476845374323974080326953632335818666746477761406817842307318288253;
    uint256 constant IC30y = 8640133752658737666612987852938541835040589502160006127293337418896834087988;
    
    uint256 constant IC31x = 16705338777315901947461689530494351281041870147801405359338468790296357227022;
    uint256 constant IC31y = 3973939785824964727126550752434126202957020321279136206288831265924932981013;
    
    uint256 constant IC32x = 9664684065781221463516385856766771112287449886875674393936109549384946202655;
    uint256 constant IC32y = 953574230056987320889486542725323389738784397211796370394807548894171921486;
    
    uint256 constant IC33x = 16242332056729207698533440040624804021369877641850066883352705734000010798621;
    uint256 constant IC33y = 14326147954759386916869706762056061150423859574237380683238424782263690810784;
    
    uint256 constant IC34x = 12563987512905249736935500575077017309558029644307042311044692438823646542816;
    uint256 constant IC34y = 2340429932978753624320372751962789675280244868602371256459681011896310843808;
    
    uint256 constant IC35x = 1631268488145874879835132441905334955062365447702296727242075005734092144869;
    uint256 constant IC35y = 5866807800084592891342437976885274524947726265544758921213473711825180631079;
    
    uint256 constant IC36x = 15282075656509434562692804752829152936100745034448956800179999665275412796186;
    uint256 constant IC36y = 1973880773192532166644218545534698579265127104769462812849994476606869176075;
    
    uint256 constant IC37x = 7213395820429814494045210678747800168797906103072257089791421157380099307278;
    uint256 constant IC37y = 5644075943075029315867659700146303964653496985336507009127496761360146950030;
    
    uint256 constant IC38x = 18710721780329988392865044871039807453148543120081801705470724681583169401095;
    uint256 constant IC38y = 5669598551411689063529143598817788899845443458013152731725070025801063805010;
    
    uint256 constant IC39x = 21093223225218837362989937055124789406777218925071767518983490927229818548475;
    uint256 constant IC39y = 18903417437630939982750817792708185191527271751287319830889231905703005351066;
    
    uint256 constant IC40x = 12925492742484174889114674255159163212831191217974586053219831615407743851637;
    uint256 constant IC40y = 5007461461092826491823058669972734069139165496390812247681554949655316921247;
    
    uint256 constant IC41x = 1797433402678975283103335151259585613338185888186042889316433980141079278936;
    uint256 constant IC41y = 9706282411948234757299973078793649588781553584355534551579060060873141359676;
    
    uint256 constant IC42x = 18982141795519009504263716906233467318693824861416118169289666617947703044572;
    uint256 constant IC42y = 19330341050177775309166101290462905047669369648196205256611231734349671761266;
    
 
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
