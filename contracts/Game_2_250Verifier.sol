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
    uint256 constant deltax1 = 4846814382002903765905858700302108529726000251863399623020028490066027905407;
    uint256 constant deltax2 = 14777258313374547526762970266482263123811425470563086585212698332167883284655;
    uint256 constant deltay1 = 19174341975253118603610410588866055152869804185609421839108014645284713130222;
    uint256 constant deltay2 = 1647592398709578228687049021414087807822780800925504875013600448292475949371;

    
    uint256 constant IC0x = 1492009021922040319433019921862173729470162302213834207479381221409571853705;
    uint256 constant IC0y = 21222477757584347468705155283562862973771640088478805798363675952468324232855;
    
    uint256 constant IC1x = 2310649769198900837828050336765392015360970792180928468190678690050772299285;
    uint256 constant IC1y = 7187610815530919800625432971634534328846844288610247755282602672749238549247;
    
    uint256 constant IC2x = 10474109080666281714190871123936051336465380897163747958508011116760817430993;
    uint256 constant IC2y = 21514028730682210131540420607079727523460371702812399285379441694325841374825;
    
    uint256 constant IC3x = 12450863301092422317619137059188225041982584983528089944629972754079634389901;
    uint256 constant IC3y = 20670227234944982435021195060676726283104053349293120644705548376682210006391;
    
    uint256 constant IC4x = 2722115588294114301623096965709538752787263586098908045857453915609281707389;
    uint256 constant IC4y = 18565658023823915114193020147544632938814620766753552481519376124784907421219;
    
    uint256 constant IC5x = 7512330660750913228629021229252600129894027467958042502050471784284488637215;
    uint256 constant IC5y = 12526052837340734801031590573992781782000025103610301144737636630426645963827;
    
    uint256 constant IC6x = 5903574859737937164640751469993174924075139700422585051000170856645909236182;
    uint256 constant IC6y = 12576481033247607036031111294359629814434680380796311577819805850290926651594;
    
    uint256 constant IC7x = 8003099007443146298323220942931240639529916997992708347683331866740091519344;
    uint256 constant IC7y = 6583926029100114318177168679937186463826274522717006882842896213406434580661;
    
    uint256 constant IC8x = 15794594866548667165976282540844159039609112048081418534071927871377851031648;
    uint256 constant IC8y = 13529889323369529537758458536772245531164843241323866053726657201569503665017;
    
    uint256 constant IC9x = 15462070426842867059230061224713838731609102913222541642024046052022355594793;
    uint256 constant IC9y = 13652497609039367086428834414039976639548668872444095499226549373532032572982;
    
    uint256 constant IC10x = 1642924194484354135795859838752106292483413397500868676057206594306006827521;
    uint256 constant IC10y = 18879431054009145897250707089427601768908269588348793803884993181471026312794;
    
    uint256 constant IC11x = 14884618644816019439872463873013833807433929012796802001539409546730605890170;
    uint256 constant IC11y = 14100004196694811705433108631267943249572860492766986671110350989512311269286;
    
    uint256 constant IC12x = 3710762792923029747926905384381544579587487733937100656987885408254036303232;
    uint256 constant IC12y = 8582118809646583236338820079153727745615355145620322792605694275201338627557;
    
    uint256 constant IC13x = 8816617452003199163011664347369217564210017388841489641218707248328353079844;
    uint256 constant IC13y = 4528445733084315878403039587539021850242436275210925473314659307438081702129;
    
    uint256 constant IC14x = 10425595217981184146295434388506851093873110515086887155170824408397468547418;
    uint256 constant IC14y = 15024268747597288185250640729898280305216987063261312353188239805473873091708;
    
    uint256 constant IC15x = 18947377496571261912089565174422354232937068891579147374434997993033249151262;
    uint256 constant IC15y = 21819793326014828925124659728283680963972360542914950669904078389771273402232;
    
    uint256 constant IC16x = 1529519490689852841463953198724937973863359181042109563762036940130294337843;
    uint256 constant IC16y = 11454579482302497128849591449199390719783377233162840393219588962622341578379;
    
    uint256 constant IC17x = 8614664967750532920572502253943492237919813472192895582735350764723254199364;
    uint256 constant IC17y = 5904329575607467822084887737799304451854791866690489547252020595096337220318;
    
    uint256 constant IC18x = 184492608264596809300134839195039818931040574067557857108223254705983002234;
    uint256 constant IC18y = 6581995997224263740795875580129487153048689574027652528532646166806527585114;
    
    uint256 constant IC19x = 15641501022857283778867661709219414545686840044184499228977638477222642139997;
    uint256 constant IC19y = 2915195711426072441748440390487806164273106369331682492486567468031414496374;
    
    uint256 constant IC20x = 9018709072514436250011562827507780647977689862886289569654046900361570713183;
    uint256 constant IC20y = 10711934310252769794238537773152919781009782684206465398610893031262324401648;
    
    uint256 constant IC21x = 14332420856613594379354211215954889874351733026631918157106152169997144742757;
    uint256 constant IC21y = 2700813970642167997004923600809058206821143559593320101072294540950803737448;
    
    uint256 constant IC22x = 8708801078972290474010335468813253786239096205350902547636418474707908223874;
    uint256 constant IC22y = 385368664723247737999843809712925190193018995464383689595761167005805426616;
    
    uint256 constant IC23x = 14812356269653592877097897793954435971803896922584761270856409822228013456110;
    uint256 constant IC23y = 7486815020056934570126526272871143594729205981916769221320435268408702585367;
    
    uint256 constant IC24x = 10898493728807476067805607786399101506280130278787443000488366312710448216595;
    uint256 constant IC24y = 17163762543938470468298881376287272612407670196697729533758120297369054856675;
    
    uint256 constant IC25x = 15411317849775912773360873744136356105322548495499761455810125704206180255016;
    uint256 constant IC25y = 7135183139154752259093768679200085064788790590101719348029031127710380860342;
    
    uint256 constant IC26x = 5778224990907212691370433041090963869034874923978119280037640312920648854523;
    uint256 constant IC26y = 9949614970028926645243912373572507966121566640432031641156864924424708533858;
    
    uint256 constant IC27x = 1376591970430891605210968209371580706384766465390155907135338565929863913482;
    uint256 constant IC27y = 17211560057101896760374550125788922694201807201814264331378352838159879795590;
    
    uint256 constant IC28x = 4881040663286908625609784831989999849621490407261598994794811196648190896557;
    uint256 constant IC28y = 4326799435218308735503680783954082367161106495676363842477951224076185442080;
    
    uint256 constant IC29x = 1250427819173358204376257347323536224307648337697985536010044205360562525592;
    uint256 constant IC29y = 17574505504376966375281017139831623418569219814076001845777101804211057515275;
    
    uint256 constant IC30x = 8537573027874432017845458444707190587620291153693446509283861833335990513446;
    uint256 constant IC30y = 4603833505656545606276230916515588659455431978416059169074573817116703903949;
    
    uint256 constant IC31x = 21795213898443173578448942854041061222875565070029372220449579953630737008554;
    uint256 constant IC31y = 4294952670186394380997318018000425858675731725502800780593534703129664695729;
    
    uint256 constant IC32x = 20197513323890922552438448277835081614424691640110043501517395178059892029277;
    uint256 constant IC32y = 5902049325825209418172944807376544192427301619057987718397588614826930462642;
    
 
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
