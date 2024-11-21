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
    uint256 constant deltax1 = 5241995662068367475869136892256844692416140110302636519962844740126938063875;
    uint256 constant deltax2 = 134096951853892381062173916331467634468678914515686281760882443472775903462;
    uint256 constant deltay1 = 5082542945570806761361141222881120515536499021823086838758958385921235466607;
    uint256 constant deltay2 = 14106809006210128871806172156714596647611808038359174452475826441046628667758;

    
    uint256 constant IC0x = 882582390271793403901797277838325683600014642836231700369383898679847315738;
    uint256 constant IC0y = 18415457004671385882127643099806919622189579256621415773570750159719324200452;
    
    uint256 constant IC1x = 6864267804466485132506866126031217731827531200444869761107779301202468759878;
    uint256 constant IC1y = 21030215671032859160585663535808263709469743231116912784733577789021155502859;
    
    uint256 constant IC2x = 14686745220850934028799013491617909752302187469976719311574167160396992637170;
    uint256 constant IC2y = 17888723658611387013237114755784289433617528388864099427717407766615571963350;
    
    uint256 constant IC3x = 19483529945723091033014165967402891087356282885133349560706935685460833758750;
    uint256 constant IC3y = 4167954629404853592600785827701202056664524263978672526412316596661794843513;
    
    uint256 constant IC4x = 1982912745465683578785699473197995131873150152490754003542112198247164160787;
    uint256 constant IC4y = 14031626155710995502723367931538078791362746400362496147959792422502768587103;
    
    uint256 constant IC5x = 20195741606542597816678757802026164151461732798053822503256465341835485222527;
    uint256 constant IC5y = 17515656407953121975768596327850901311282981198513957429599286145607496545043;
    
    uint256 constant IC6x = 4214403601882378221999337897403236459401492213009094967965528559818889012305;
    uint256 constant IC6y = 17154705499179853070222391919625058633294441309771023454702986755139031404628;
    
    uint256 constant IC7x = 2723210008018412250413254669082625555445077830119626716225419689292911301526;
    uint256 constant IC7y = 6067403293947856778121338763812241062399860804111449765146110562851056626640;
    
    uint256 constant IC8x = 5488261249653079915693819360213585958004137206571969833806721174199282395177;
    uint256 constant IC8y = 16685015257271826587362130694513688360539837685085473914163414233427417187653;
    
    uint256 constant IC9x = 4220322879192056646800159854659282415097230923694878017169084079041844003574;
    uint256 constant IC9y = 13492203282240101592667087541926124194321282937780883036797391223701011062613;
    
    uint256 constant IC10x = 15656559141458858055663930616390479923517497200306158544034712083706854441867;
    uint256 constant IC10y = 16647849542270215717851764567880787123801689122802416295227383053653354248858;
    
    uint256 constant IC11x = 10008840631783444674508080263114468967746505985887996910178896501934853112277;
    uint256 constant IC11y = 16936570667799938576720674672020880352745864020685762112062389878811942670453;
    
    uint256 constant IC12x = 5011295541785917253841138526393801554674138828598767265499922645012524973706;
    uint256 constant IC12y = 16349216152175104304359703013765160891794704624846039150494873367554395977639;
    
    uint256 constant IC13x = 7548817140284270024767897095191300906429628627848190048017422197184039345468;
    uint256 constant IC13y = 20572758876763961487189667745519827916441861261830008380795433287292668839436;
    
    uint256 constant IC14x = 9310202658901625130511022582678086202713821448286182983011894770178982336942;
    uint256 constant IC14y = 21508777100401785479849873114458695414378605252394186900598351725717526189557;
    
    uint256 constant IC15x = 12260964548592658396424901582131881359751554819427162177504443841765368321876;
    uint256 constant IC15y = 21301736234596282752590600516446149129316093334303375321673322411077259438655;
    
    uint256 constant IC16x = 14642487363334277771490793825005030053584080377788315143303114375684681938542;
    uint256 constant IC16y = 20664977713650680750281838383025238525713415094304945120004730449262488384022;
    
    uint256 constant IC17x = 11155558253783912280558999944178193173511187318050816746725717529951328284540;
    uint256 constant IC17y = 20270918106701838044029414642792178094661951548884991533905436418966923621204;
    
    uint256 constant IC18x = 15899525433604586299489303087397381627434708234565178521593785046668203550489;
    uint256 constant IC18y = 21824016866807150124015517974279411199130449789566947749017632765310230599399;
    
    uint256 constant IC19x = 18206298059099796998974980567851170868688661505006528917161885629028844273319;
    uint256 constant IC19y = 20205998420522370530015175567631937864564619951339244121274820768541699589312;
    
    uint256 constant IC20x = 16716732700347822216950736885335171256457458830095360382818581195245277662844;
    uint256 constant IC20y = 12620671344632097624479873273828489108167233217154355804270325218144715019625;
    
    uint256 constant IC21x = 15451727379452733529849866073401124935472505715724949099913064752553869375841;
    uint256 constant IC21y = 2158494354079555870408740408982601623248951309670788939773173665188999849514;
    
    uint256 constant IC22x = 12284916869162366603591536277341724694924567911001518117085010691159285217781;
    uint256 constant IC22y = 3593671237360147483394250564233844289003151048424309908847155770077900837396;
    
    uint256 constant IC23x = 5927916390106185710893591001482753681189190586739932433136759979576724457076;
    uint256 constant IC23y = 17599435048350890672110626193872822768209035418359930522010561240756721388640;
    
    uint256 constant IC24x = 10357931868184807162454228167040519777998312209268559210853555352156575979574;
    uint256 constant IC24y = 7417675271573989779085236286148208506480849672089795015947641449389114925808;
    
    uint256 constant IC25x = 3010789866507807199683295818137797298080293342308826284772296511624361032693;
    uint256 constant IC25y = 10883029039185081070287331826150260206804255483544441222181904381405366832480;
    
    uint256 constant IC26x = 14052810950992555814041035499198803453618213826282303164838796899766080803853;
    uint256 constant IC26y = 13787869378104349961875860786635600848608758857173989070700650448142243716915;
    
    uint256 constant IC27x = 4438184814904840719569729577942594719817707257590154686812204242033175243682;
    uint256 constant IC27y = 5293847823520586332773082241381604595409933105388054257434812639571372785033;
    
    uint256 constant IC28x = 12426062767280270413342564662359518141997462288241284017438655608080553101284;
    uint256 constant IC28y = 19934796116095975190501818026905984121241074331801352805708937025636092233315;
    
    uint256 constant IC29x = 19917477943324844916255800210447108539265540349330009748325835880239261186569;
    uint256 constant IC29y = 20607661626672167285897710278861348562213926060181371585376730941172539197897;
    
    uint256 constant IC30x = 15663529529817851445495805724697116793551842073110287348267972672089330537604;
    uint256 constant IC30y = 2990047183788148120908377069775001819299541212105999741830773738506267779547;
    
    uint256 constant IC31x = 15746021759002488832254562055094342761945226213397302973215346129252929703330;
    uint256 constant IC31y = 1779679476764911275724775229006921806747299080350306600219370216496476532009;
    
    uint256 constant IC32x = 5100443297376737166922471551514878258594598922375103842765986165975972291703;
    uint256 constant IC32y = 19717758233413391570700701720187644271680987013060568697606415012050381861288;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[32] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
