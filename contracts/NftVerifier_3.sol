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
    uint256 constant deltax1 = 9805300709482788282281847177610142730179468461290664205524862351246335536806;
    uint256 constant deltax2 = 10401085359381212252749988057539532958516170577570301646667282395519983688745;
    uint256 constant deltay1 = 4571363799804332680879644144513890700454183212389226721099501325813868391935;
    uint256 constant deltay2 = 5438216857384334012298178329579693298907969105913469636098282673266816831587;

    
    uint256 constant IC0x = 17233542492199456147797472912112708802409115179009234542410118697456376121651;
    uint256 constant IC0y = 4698898288217602442921081236007371305744749640277347555822081515279696026560;
    
    uint256 constant IC1x = 19792227961488830580192490598438851477498630309730658887215313434251878324387;
    uint256 constant IC1y = 10763414841848795006245818747578581427350168475042638860730719789838169607720;
    
    uint256 constant IC2x = 11423676458552064050514062007973628625907472979447307477817733167530979584351;
    uint256 constant IC2y = 2043841477427175629380743728280510473691110971720028987946758707481533872071;
    
    uint256 constant IC3x = 2856651707723788026105485793003230563142709043035348655343716384815504231615;
    uint256 constant IC3y = 14030777233082381095658494115550736711779961125603928775332975851171880590298;
    
    uint256 constant IC4x = 21821977959526211944611337235502713747028939761907590143878835080168012915814;
    uint256 constant IC4y = 13697818018723561697199930798310452049871138703332607324365692939256954459346;
    
    uint256 constant IC5x = 11622284474877309550024227653813629746026311052560561284904704517147004970040;
    uint256 constant IC5y = 814755218055713863244304915364625012195867301033440845077279223310685962039;
    
    uint256 constant IC6x = 9725054332369596985257010423571872843979094941628899902373574384064838284561;
    uint256 constant IC6y = 3869194870659403828413033138349226684498806465851328439917107567786463054068;
    
    uint256 constant IC7x = 20899263370306671395504731672612713208402089078275845392582978066636696921025;
    uint256 constant IC7y = 16514533554829703547447742400696161557559175376941788135717552491230686403142;
    
    uint256 constant IC8x = 8950983431313796838884118487543969359390237889183965157165074377822186153886;
    uint256 constant IC8y = 4715278138953856387568544179629235682723987306145196180503409063783517405445;
    
    uint256 constant IC9x = 16715189829298013446660372553769540597294612878422370913840290845820681793462;
    uint256 constant IC9y = 14374862488087359614428251187888656072153462749129905950656586974341000075061;
    
    uint256 constant IC10x = 16372464712987501253817770914183900752038562304398583385077084438553604957257;
    uint256 constant IC10y = 3288592603334923750271572672152326442260849086044506486853290264508730916397;
    
    uint256 constant IC11x = 20783536858277810400443328845380585320346769773803202693936838227469238424191;
    uint256 constant IC11y = 11891239371086376621659170946717973815562727470666285285611033845438982798180;
    
    uint256 constant IC12x = 17369599009533194060498140717047904663217095724485902374455511756342763645691;
    uint256 constant IC12y = 21003587020688864368115499104992178519793053740136573499544147731416561834019;
    
    uint256 constant IC13x = 7912504721160953906750226077310611670399014878536101612397392954784693074201;
    uint256 constant IC13y = 10762769404929792790264562154524527520118043081941007271037685777151376410887;
    
    uint256 constant IC14x = 4689561934866372822447956102853883306311311200050071832061080745951824939965;
    uint256 constant IC14y = 5088116292420709450095572769612751321709544854227073647368556217767951922825;
    
    uint256 constant IC15x = 1235964592556527354813367781854627120776162131099051344206937383161642677573;
    uint256 constant IC15y = 21048838186488496742613899527420813310266344229983751209776924599011778155366;
    
    uint256 constant IC16x = 20544792284707650784704558616575149382907364966140492079335801082219417379285;
    uint256 constant IC16y = 16684939432837907130439824100465059144952270562544557027937233526036940613523;
    
    uint256 constant IC17x = 19473712375122698917152148105708664890369960717824734523468851789778414335287;
    uint256 constant IC17y = 6074845575071533724082956093551499217856546049031809784328384949095018497704;
    
    uint256 constant IC18x = 18264794044681079616215724670455540677952711366500716641221523980835000039493;
    uint256 constant IC18y = 12479266643417772349050572532250763185738703367556841997899489586475537173722;
    
    uint256 constant IC19x = 11738114350946251384184171874745873937062251903865310287836169554146463910012;
    uint256 constant IC19y = 19865484618336495810655731161539836277219222342832653180122559186631458568464;
    
    uint256 constant IC20x = 11774165766182667573962467909647130617749071495370575672406748010794128863322;
    uint256 constant IC20y = 4433489467711785734341214522944570117011916561388733595153213422058053654984;
    
    uint256 constant IC21x = 3238768653539771407251421501199061149589958482185920291223443469583025202232;
    uint256 constant IC21y = 6412433032838790732651674235727100247450297266161100642794364469841070149859;
    
    uint256 constant IC22x = 12353389571984385425127487574465579455136769211791804174867763318708931098776;
    uint256 constant IC22y = 2879884000044624053825534048045659950599346388597094303205761769678975182078;
    
    uint256 constant IC23x = 148016353590853073231415651984887776876800853696275105903121032835753381753;
    uint256 constant IC23y = 21676270453077149101043186523806330527774601078934157828087306320912569440074;
    
    uint256 constant IC24x = 9619490377978080520587279049631525718844202572418605486891512103438294000465;
    uint256 constant IC24y = 2314115473883869211344280836052086276046234221876022086390173168050466894186;
    
    uint256 constant IC25x = 11759520668595890543400901954969635906543635551175723922379238440290777586482;
    uint256 constant IC25y = 16272401289105913303340982374876702802519393220570641843270060177362590265109;
    
    uint256 constant IC26x = 12733185901849830206704531429367143422663394368573257224274293499819113879231;
    uint256 constant IC26y = 10316270910080968074775773634564822056503827316836008960111159797930727284782;
    
    uint256 constant IC27x = 4992408499510961050749458170953938732283178082557103449384499189672891921749;
    uint256 constant IC27y = 13599871310734139541924523685045692329670814862112423575118031272322969969873;
    
    uint256 constant IC28x = 4171211634405481399485430667195214386426294466579080841540061747284404761437;
    uint256 constant IC28y = 19484844620956241972351071111914365320649377981635035614230894582324281874048;
    
    uint256 constant IC29x = 5404591551408807084827719040979106690512873633880374009068754355697604222002;
    uint256 constant IC29y = 21812058462319563431491165877374041476944544639098595622404763312895315526864;
    
    uint256 constant IC30x = 19582329616535792222997045283212086744466928007923077736283358438847607489870;
    uint256 constant IC30y = 4077140639748356794899815417354575548481643813163173474610192888336798483575;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[30] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
