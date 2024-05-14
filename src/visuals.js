export const FPS = 50

const WITHERING_STEPS = 3000
const FACE_PNGS = [
  // [tired, tired_no_mouth, normal, normal_no_mouth, ecstatic, ecstatic_no_mouth]
  [
    new URL('/public/faces/face1_1.png', import.meta.url).href,
    new URL('/public/faces/face1_1_no.png', import.meta.url).href,
    new URL('/public/faces/face1_2.png', import.meta.url).href,
    new URL('/public/faces/face1_2_no.png', import.meta.url).href,
    new URL('/public/faces/face1_3.png', import.meta.url).href,
    new URL('/public/faces/face1_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face3_1.png', import.meta.url).href,
    new URL('/public/faces/face3_1_no.png', import.meta.url).href,
    new URL('/public/faces/face3_2.png', import.meta.url).href,
    new URL('/public/faces/face3_2_no.png', import.meta.url).href,
    new URL('/public/faces/face3_3.png', import.meta.url).href,
    new URL('/public/faces/face3_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face4_1.png', import.meta.url).href,
    new URL('/public/faces/face4_1_no.png', import.meta.url).href,
    new URL('/public/faces/face4_2.png', import.meta.url).href,
    new URL('/public/faces/face4_2_no.png', import.meta.url).href,
    new URL('/public/faces/face4_3.png', import.meta.url).href,
    new URL('/public/faces/face4_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face6_1.png', import.meta.url).href,
    new URL('/public/faces/face6_1_no.png', import.meta.url).href,
    new URL('/public/faces/face6_2.png', import.meta.url).href,
    new URL('/public/faces/face6_2_no.png', import.meta.url).href,
    new URL('/public/faces/face6_3.png', import.meta.url).href,
    new URL('/public/faces/face6_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face7_1.png', import.meta.url).href,
    new URL('/public/faces/face7_1_no.png', import.meta.url).href,
    new URL('/public/faces/face7_2.png', import.meta.url).href,
    new URL('/public/faces/face7_2_no.png', import.meta.url).href,
    new URL('/public/faces/face7_3.png', import.meta.url).href,
    new URL('/public/faces/face7_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face8_1.png', import.meta.url).href,
    new URL('/public/faces/face8_1_no.png', import.meta.url).href,
    new URL('/public/faces/face8_2.png', import.meta.url).href,
    new URL('/public/faces/face8_2_no.png', import.meta.url).href,
    new URL('/public/faces/face8_3.png', import.meta.url).href,
    new URL('/public/faces/face8_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face9_1.png', import.meta.url).href,
    new URL('/public/faces/face9_1_no.png', import.meta.url).href,
    new URL('/public/faces/face9_2.png', import.meta.url).href,
    new URL('/public/faces/face9_2_no.png', import.meta.url).href,
    new URL('/public/faces/face9_3.png', import.meta.url).href,
    new URL('/public/faces/face9_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face10_1.png', import.meta.url).href,
    new URL('/public/faces/face10_1_no.png', import.meta.url).href,
    new URL('/public/faces/face10_2.png', import.meta.url).href,
    new URL('/public/faces/face10_2_no.png', import.meta.url).href,
    new URL('/public/faces/face10_3.png', import.meta.url).href,
    new URL('/public/faces/face10_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face11_1.png', import.meta.url).href,
    new URL('/public/faces/face11_1_no.png', import.meta.url).href,
    new URL('/public/faces/face11_2.png', import.meta.url).href,
    new URL('/public/faces/face11_2_no.png', import.meta.url).href,
    new URL('/public/faces/face11_3.png', import.meta.url).href,
    new URL('/public/faces/face11_3_no.png', import.meta.url).href
  ],
  [
    new URL('/public/faces/face12_1.png', import.meta.url).href,
    new URL('/public/faces/face12_1_no.png', import.meta.url).href,
    new URL('/public/faces/face12_2.png', import.meta.url).href,
    new URL('/public/faces/face12_2_no.png', import.meta.url).href,
    new URL('/public/faces/face12_3.png', import.meta.url).href,
    new URL('/public/faces/face12_3_no.png', import.meta.url).href
  ]
]

const STAR_SVGS = [
  new URL(`/public/stars/star1.svg`, import.meta.url).href,
  new URL(`/public/stars/star2.svg`, import.meta.url).href,
  new URL(`/public/stars/star3.svg`, import.meta.url).href,
  new URL(`/public/stars/star4.svg`, import.meta.url).href,
  new URL(`/public/stars/star5.svg`, import.meta.url).href,
  new URL(`/public/stars/star6.svg`, import.meta.url).href,
  new URL(`/public/stars/star7.svg`, import.meta.url).href,
  new URL(`/public/stars/star8.svg`, import.meta.url).href,
  new URL(`/public/stars/star9.svg`, import.meta.url).href,
  new URL(`/public/stars/star10.svg`, import.meta.url).href
]

// const stars = {
//   1: `<path class="st1" d="M521.2,237.6c-8.4-4.6-18.3-5.7-27.6-3.6c-17.2,3.8-61.5,13.7-111.8,25c-6.7,1.5-13.5-2-16.2-8.2
//   c-0.1-0.3-0.2-0.5-0.3-0.8c-2.9-6.5-0.4-14.3,5.7-18c33.5-20.6,69.8-43.1,96.6-60.4c6.1-3.9,11-9.3,14.2-15.8
//   c6.3-12.7,10.5-34.3-13.4-58.2c0,0-22.9-20.9-48.5-13.4c-9.2,2.7-16.9,8.9-22.1,17c-9.5,15-34.3,53.8-62.1,97.8
//   c-3.7,5.9-11.1,8.1-17.6,5.5c-0.1,0-0.2-0.1-0.2-0.1c-6.6-2.7-10.4-9.7-8.7-16.6c9.2-38.5,19-80.5,25.8-111.9
//   c1.5-7.1,1.2-14.4-1.1-21.3C329.5,41.2,317.2,23,283.4,23c0,0-31,1.4-43.7,24.8c-4.6,8.4-5.7,18.3-3.6,27.6
//   c3.8,17.3,13.7,61.9,25.1,112.4c1.5,6.8-2.1,13.8-8.6,16.4c-0.6,0.2-1.1,0.5-1.7,0.7c-6.5,2.7-14,0.4-17.7-5.6
//   c-20.6-33.6-43.2-69.9-60.5-96.8c-3.9-6.1-9.3-11-15.8-14.2c-12.7-6.3-34.3-10.5-58.2,13.4c0,0-20.9,22.9-13.4,48.5
//   c2.7,9.2,8.9,16.9,17,22.1c14.8,9.5,53.1,33.8,96.5,61.2c6,3.8,8.2,11.3,5.4,17.8c-0.1,0.2-0.2,0.5-0.3,0.7
//   c-2.7,6.5-9.7,10.1-16.5,8.5C149.3,251.3,108,241.6,77,235c-7.1-1.5-14.4-1.2-21.3,1.1c-13.5,4.5-31.7,16.9-31.7,50.6
//   c0,0,1.4,31,24.8,43.7c8.4,4.6,18.3,5.7,27.6,3.6c17-3.8,60.6-13.4,110.1-24.6c6.9-1.6,13.8,2.2,16.4,8.8c0.1,0.3,0.3,0.7,0.4,1
//   c2.7,6.5,0.3,14-5.7,17.6c-33.1,20.4-68.9,42.5-95.3,59.6c-6.1,3.9-11,9.3-14.2,15.8c-6.3,12.7-10.5,34.3,13.4,58.2
//   c0,0,22.9,20.9,48.5,13.4c9.2-2.7,16.9-8.9,22.1-17c9.3-14.6,33.1-52,60.1-94.6c3.8-5.9,11.3-8.2,17.7-5.4c0.5,0.2,1.1,0.5,1.6,0.7
//   c6.5,2.7,10.1,9.7,8.5,16.5c-9,37.7-18.5,78.5-25.1,109.1c-1.5,7.1-1.2,14.4,1.1,21.3c4.5,13.5,16.9,31.7,50.6,31.7
//   c0,0,31-1.4,43.7-24.8c4.6-8.4,5.7-18.3,3.6-27.6c-3.8-17-13.4-60.3-24.5-109.7c-1.5-6.8,2-13.7,8.5-16.3c0.8-0.3,1.7-0.7,2.5-1.1
//   c6.5-2.9,14.2-0.5,17.9,5.6c20.2,32.9,42.2,68.2,59.1,94.4c3.9,6.1,9.3,11,15.8,14.2c12.7,6.3,34.3,10.5,58.2-13.4
//   c0,0,20.9-22.9,13.4-48.5c-2.7-9.2-8.9-16.9-17-22.1c-14.7-9.4-52.5-33.5-95.6-60.7c-5.8-3.7-8.2-10.9-5.6-17.3
//   c0.3-0.7,0.5-1.3,0.8-2c2.5-6.8,9.7-10.6,16.7-8.9c37.7,9,78.4,18.5,109,25.1c7.1,1.5,14.4,1.2,21.3-1.1
//   c13.5-4.5,31.7-16.9,31.7-50.6C546.1,281.4,544.7,250.4,521.2,237.6z" />`,
//   2: `<path class="st1" d="M536.1,223.4c0,0-10.4-19.9-73.2-32.4c-1.5-0.3-2.1,1.8-0.7,2.4c15.4,6.5,37.9,19.3,37.9,39c0,0,2,26-59,43
//   c0,0-28.3,12.3-147.2,9.3c-0.3,0-5-0.4-1.8-5.7l0,0c30.5-19.7,131.4-90.5,151.7-179.1c0,0,8.5-33.9-24.7-37.5
//   c0,0-21.5-6.7-74.7,28.9c-1.2,0.8-0.2,2.7,1.2,2.2c15.5-6.3,40.5-13.2,54.4,0.8c0,0,19.8,17-11.3,72.1c0,0-11.4,28.8-97.9,111
//   c-0.2,0.1-5.6,3.5-5-3.1l0,0c7.7-35.7,28.8-156.9-19.4-233.8c0,0-18-30-44-9c0,0-19.9,10.4-32.4,73.2c-0.3,1.5,1.8,2.1,2.4,0.7
//   c6.5-15.4,19.3-37.9,39-37.9c0,0,26-2,43,59c0,0,12.3,28.4,9.3,147.5c0,0.3-0.9,6.8-5.6,1.7l0,0c-19.4-30.2-90.4-131.6-179.3-152
//   c0,0-33.9-8.5-37.5,24.7c0,0-6.7,21.5,28.9,74.7c0.8,1.2,2.7,0.2,2.2-1.2c-6.3-15.5-13.2-40.5,0.8-54.4c0,0,17-19.8,72.1,11.3
//   c0,0,28.9,11.4,111.5,98.4c0.6,0.7,4.2,5-2.8,4.6l0,0c-34.6-7.5-157.1-29.4-234.6,19.2c0,0-30,18-9,44c0,0,10.4,19.9,73.2,32.4
//   c1.5,0.3,2.1-1.8,0.7-2.4c-15.4-6.5-37.9-19.3-37.9-39c0,0-2-26,59-43c0,0,28.5-12.3,148.5-9.3c0.1,0,4.9,1.2,1.7,4.9l0,0
//   c-28.9,18.5-132.3,90.1-153,179.9c0,0-8.5,33.9,24.7,37.5c0,0,21.5,6.7,74.7-28.9c1.2-0.8,0.2-2.7-1.2-2.2
//   c-15.5,6.3-40.5,13.2-54.4-0.8c0,0-19.8-17,11.3-72.1c0,0,11.5-29,98.9-112c0.3-0.2,4.9-3.6,4.3,2.3l0,0
//   c-7.3,33.2-30.1,157.3,19,235.6c0,0,18,30,44,9c0,0,19.9-10.4,32.4-73.2c0.3-1.5-1.8-2.1-2.4-0.7c-6.5,15.4-19.3,37.9-39,37.9
//   c0,0-26,2-43-59c0,0-12.4-28.6-9.3-149.2c0.1-0.4,1.1-5.9,4.8-1.2l0,0c18.3,28.7,90,132.5,180,153.1c0,0,33.9,8.5,37.5-24.7
//   c0,0,6.7-21.5-28.9-74.7c-0.8-1.2-2.7-0.2-2.2,1.2c6.3,15.5,13.2,40.5-0.8,54.4c0,0-17,19.8-72.1-11.3c0,0-29-11.5-112.1-99
//   c-0.1-0.2-2.5-4.2,4.8-3.7v0c36.4,7.8,156.7,28.4,233.2-19.5C527.1,267.4,557.1,249.4,536.1,223.4z" />`,
//   3: `<path class="st1" d="M525.7,283h-76.4c-2.4,0-3.5-3-1.8-4.6c0.6-0.6,1.3-1.2,1.9-1.8c0,0,83.5-71,8.9-164.6c-1-1.2-2.8-1.3-3.9-0.2
//   l-53.5,53.5c-1.7,1.7-4.6,0.4-4.5-2c0-0.6,0.1-1.2,0.1-1.9c0,0,8.9-109.2-110.1-122.7c-1.6-0.2-2.9,1.1-2.9,2.6v75
//   c0,2.4-2.9,3.5-4.6,1.8c-0.5-0.6-1.1-1.2-1.6-1.8c0,0-71-83.5-164.6-8.9c-1.2,1-1.3,2.8-0.2,3.9l54.2,54.2c1.7,1.7,0.4,4.6-2,4.5
//   c-1-0.1-2.1-0.1-3.1-0.1c0,0-109.2-8.9-122.7,110.1c-0.2,1.6,1.1,2.9,2.6,2.9h74.9c2.4,0,3.5,2.9,1.8,4.5c0,0,0,0-0.1,0
//   c0,0-83.5,71-8.9,164.6c1,1.2,2.8,1.3,3.9,0.2l53.5-53.5c1.7-1.7,4.6-0.4,4.5,2c-0.1,1.2-0.1,2.4-0.2,3.7
//   c0,0-8.9,109.2,110.1,122.7c1.6,0.2,2.9-1.1,2.9-2.6v-75.9c0-2.4,2.9-3.5,4.6-1.8c0.6,0.6,1.1,1.2,1.7,1.8c0,0,71,83.5,164.6,8.9
//   c1.2-1,1.3-2.8,0.2-3.9l-53.3-53.3c-1.7-1.7-0.4-4.6,2-4.5c0.6,0,1.2,0.1,1.9,0.1c0,0,109.2,8.9,122.7-110.1
//   C528.4,284.4,527.2,283,525.7,283z" />`,
//   4: ` <path class="st1" d="M286.4,291.8c6.1-20.9,28-82.3,80.2-114.8c1-0.7,1.2-2.1,0.2-2.9c-10.4-8.9-60.5-54.6-80.6-123.8
//   c-0.5-1.7-3-1.8-3.5,0c-6.1,20.1-28.5,84.2-77.3,119.8c-1,0.7-1,2.2,0,2.9c10.8,7.8,60.6,47.2,77.5,118.7
//   C283.3,293.5,285.8,293.6,286.4,291.8z" />
//   <path class="st1" d="M274.9,298.3c-18-12.4-69.5-52.2-84.1-111.9c-0.3-1.2-1.6-1.8-2.7-1.1c-11.7,7.1-70.7,40.4-142.8,38.1
//   c-1.8-0.1-2.6,2.3-1.1,3.3c17.3,12,71.1,53.3,89.7,110.7c0.4,1.2,1.8,1.7,2.8,0.9c10.8-7.8,63.7-42.9,137-36.6
//   C275.6,301.8,276.4,299.4,274.9,298.3z" />
//   <path class="st1" d="M277,310.3c-17.3,13.3-71.2,49.9-132.5,45.3c-1.2-0.1-2.2,1-1.9,2.2c3.1,13.4,16.6,79.8-8,147.6
//   c-0.6,1.7,1.3,3.2,2.8,2.1c16.8-12.7,72.6-51.1,133.1-51.1c1.2,0,2.1-1.2,1.8-2.4c-4.1-12.7-21.1-73.9,7.5-141.6
//   C280.5,310.8,278.5,309.2,277,310.3z" />
//   <path class="st1" d="M288.7,313.6c7.3,20.5,25.8,83,2.7,140c-0.5,1.1,0.3,2.4,1.5,2.5c13.7,1.1,81,8.6,138.1,52.7
//   c1.4,1.1,3.4-0.3,2.8-2c-7-19.9-26.5-84.8-8-142.3c0.4-1.2-0.5-2.4-1.7-2.4c-13.3,0-76.8-2.5-132.5-50.4
//   C290.2,310.4,288.1,311.8,288.7,313.6z" />
//   <path class="st1" d="M295,301.9c21.8-1,86.9-0.5,134.7,38.2c1,0.8,2.4,0.4,2.8-0.7c5-12.8,31.8-75,90.6-116.7
//   c1.5-1.1,0.7-3.4-1.1-3.3c-21,0.9-88.8,0.6-138.5-33.8c-1-0.7-2.4-0.2-2.8,1c-3.9,12.8-24.7,72.7-86.9,112.1
//   C292.4,299.5,293.2,302,295,301.9z" />`,
//   5: `<polygon class="st1" points="218.3,196.6 291.6,179.8 249.9,242.3 288.5,306.8 216.1,286.5 166.8,343.1 163.7,268 94.6,238.6
//   165.1,212.5 171.7,137.6 	" />
//   <polygon class="st1" points="329.5,375.1 383.8,409.1 321,421.7 305.4,483.8 274,428 210.1,432.3 253.5,385.2 229.6,325.8
//   287.8,352.6 337,311.4 	" />
//   <polygon class="st1" points="385.5,453.1 404.3,464.9 382.6,469.2 377.2,490.7 366.4,471.4 344.3,472.9 359.3,456.6 351,436.1
//   371.1,445.3 388.1,431.1 	" />
//   <polygon class="st1" points="429.1,492.7 436.6,504.2 423.3,501 414.7,511.7 413.6,498 400.8,493.1 413.4,487.9 414.1,474.2
//   423,484.6 436.2,481 	" />
//   <polygon class="st1" points="472.1,484.2 482.7,492.9 469,493.9 464,506.6 458.9,493.9 445.2,493.1 455.7,484.3 452.3,471
//   463.9,478.3 475.4,470.9 	" />
//   <polygon class="st1" points="224.8,138.8 223.8,116.6 239.7,132 260.4,124.3 250.7,144.2 264.5,161.5 242.6,158.4 230.4,176.8
//   226.6,155 205.2,149.1 	" />
//   <polygon class="st1" points="232.6,80.4 237.8,67.7 242.7,80.5 256.4,81.5 245.8,90.2 249.1,103.5 237.5,96.1 225.9,103.3
//   229.4,90 218.9,81.2 	" />
//   <polygon class="st1" points="201.2,49.8 202.4,36.2 210.9,46.9 224.2,43.8 216.7,55.2 223.8,67 210.6,63.3 201.6,73.7 201,60
//   188.4,54.7 	" />
//   <polygon class="st1" points="154.7,379.3 188.9,376.9 165.7,402.2 178.5,434 147.3,419.7 121,441.7 125,407.6 95.9,389.4
//   129.5,382.6 137.9,349.3 	" />
//   <polygon class="st1" points="365.2,233.5 389.7,257.5 355.4,256.9 340.2,287.7 330.1,254.9 296.1,249.9 324.2,230.2 318.5,196.4
//   345.9,217 376.3,201 	" />`,
//   6: `<path class="st1" d="M491.5,218.2c-71.7-22.8-125.4,41.2-125.4,41.2c-0.5,0.7-1,1.5-1.4,2.1c-2.7,4.5-6.8,7.9-11.8,9.5l-30.8,10.1
//   c-3.3,1.1-6.8,1.5-10.3,1.1c-4.5-6.6-11.1-11.5-18.9-13.8c-1-2.7-1.5-5.6-1.5-8.4v-32.4c0-5.2,2-10.2,5.4-14.1
//   c0.5-0.6,1.1-1.3,1.6-2c0,0,44-71,0-132c0,0-13-17-28,0c0,0-50,49,0,132c0,0,0.6,1,1.6,2.3c2.9,3.7,4.4,8.3,4.4,13v32.8
//   c0,3-0.8,5.8-2,8.5c-8.5,2.1-15.7,7.3-20.5,14.4c-2.8,0.1-5.7-0.3-8.4-1.2l-30.8-10.1c-5-1.6-9.1-5.1-11.8-9.5
//   c-0.4-0.7-0.9-1.4-1.4-2.1c0,0-53.7-64-125.4-41.2c0,0-20.2,7-8.7,26.6c0,0,31,62.8,125.4,41.2c0,0,1.1-0.2,2.7-0.8
//   c4.4-1.6,9.3-1.6,13.7-0.1l31.2,10.2c2.9,0.9,5.4,2.6,7.6,4.7c0,0.6-0.1,1.3-0.1,1.9c0,8.7,3.2,16.7,8.5,22.9
//   c-0.8,2-1.9,3.8-3.1,5.5l-19.4,25.9c-3.1,4.2-7.7,7-12.8,8.1c-0.8,0.2-1.6,0.4-2.5,0.6c0,0-77.8,30.4-79.2,105.6
//   c0,0,0.2,21.4,22.4,16.8c0,0,69.4-9.2,79.2-105.6c0,0,0.1-1.1,0.1-2.8c-0.1-4.7,1.4-9.3,4.3-13.1l19.7-26.2c1.5-2,3.4-3.7,5.6-4.9
//   c3.8,1.4,8,2.2,12.3,2.2c5,0,9.8-1.1,14.1-2.9c2.7,1.4,5.1,3.2,6.9,5.7l19.7,26.2c2.8,3.8,4.4,8.4,4.3,13.1c0,1.7,0.1,2.8,0.1,2.8
//   c9.8,96.4,79.2,105.6,79.2,105.6c22.2,4.6,22.4-16.8,22.4-16.8c-1.4-75.2-79.2-105.6-79.2-105.6c-0.9-0.2-1.7-0.5-2.5-0.6
//   c-5.1-1.1-9.7-3.9-12.8-8.1l-19.4-25.9c-1.9-2.5-3.3-5.3-4-8.3c4-5.7,6.3-12.6,6.3-20.1c0,0,0-0.1,0-0.1c0.1-0.1,0.1-0.1,0.2-0.2
//   c2.4-2.9,5.5-5.2,9.1-6.4l31.2-10.2c4.5-1.5,9.3-1.5,13.7,0.1c1.6,0.6,2.7,0.8,2.7,0.8c94.5,21.6,125.4-41.2,125.4-41.2
//   C511.7,225.3,491.5,218.2,491.5,218.2z" />`,
//   7: `<path class="st1" d="M283.5,35.5c-137,0-248,111-248,248s111,248,248,248s248-111,248-248S420.5,35.5,283.5,35.5z M374.7,438.8
//   l-80.4-58.4c-6.4-4.7-15.2-4.7-21.6,0l-80.4,58.4c-14.4,10.5-33.8-3.6-28.3-20.5l30.7-94.6c2.5-7.6-0.2-15.9-6.7-20.5l-80.4-58.4
//   c-14.4-10.5-7-33.2,10.8-33.2h99.4c8,0,15-5.1,17.5-12.7l30.7-94.6c5.5-16.9,29.4-16.9,34.9,0l30.7,94.6
//   c2.5,7.6,9.5,12.7,17.5,12.7h99.4c17.8,0,25.2,22.8,10.8,33.2l-80.4,58.4c-6.4,4.7-9.1,13-6.7,20.5l30.7,94.6
//   C408.5,435.2,389.1,449.2,374.7,438.8z" />`,
//   8: `<path class="st1" d="M474.7,232.3c-3.1-2.4-4.4-6.4-3.2-10.1c22.8-72.8-30.2-84.4-30.2-84.4c-31.5-8.1-55.7,11.5-68.7,26.1
//   c10.4-16.5,23-45.8,6-74.1c0,0-26.2-47.4-89.5-4.9c-3.2,2.2-7.5,2.1-10.6-0.2c-15.1-11.1-60.4-38-92,9.4c0,0-20.2,32,3.7,69.1
//   c-13.2-14.5-37.1-33.4-68-25.4c0,0-53,11.7-30.2,84.4c1.2,3.7-0.1,7.8-3.2,10.1c-14.9,11.3-53.6,47.1-17.2,90.9
//   c0,0,19.4,22.2,53.2,18.9c-16.4,9-34.3,24.7-36.5,51.1c0,0-6.4,53.8,69.8,56.3c3.9,0.1,7.3,2.7,8.5,6.4
//   c5.8,17.8,26.8,66.2,80.2,46.2c0,0,29-11.7,36-46.8c7,35.1,36,46.8,36,46.8c53.3,20,74.4-28.3,80.2-46.2c1.2-3.7,4.6-6.3,8.5-6.4
//   c76.2-2.5,69.8-56.3,69.8-56.3c-2.2-26.2-19.9-41.9-36.2-50.9c32.5,2.3,51.1-19.1,51.1-19.1C528.3,279.4,489.6,243.7,474.7,232.3z
//    M307.2,308.8c-5.3-1.1-10.4,2.5-11.1,7.8l-13.6,104.7l-13.6-104.7c-0.7-5.3-5.8-9-11.1-7.8l-96,20.7l92.2-46.3
//   c4.8-2.4,6.5-8.4,3.7-13L201.4,178c0,0-0.4-0.7-1.2-1.8c0.4,0.4,0.7,0.8,1.1,1.1l75.4,80.3c3.7,3.9,9.9,3.9,13.6-0.1l71.5-79.2
//   l-56.1,91.8c-2.8,4.6-1.1,10.6,3.7,13l90.9,45.7L307.2,308.8z" />`,
//   9: `<path class="st1" d="M556,283.9l-105-96.8L420.1,47.7L283.8,90.2L147.6,47.3l-31.3,139.3L11,283.1l105,96.8l30.9,139.4l136.3-42.5
//   l136.2,42.9l31.3-139.3L556,283.9z M404.4,493.7L283.4,376.1L162,493.3l41.3-163.6L41,283.1l162.3-46.1L162.6,73.3l121.1,117.6
//   L405,73.7l-41.3,163.6L526,283.9l-162.3,46.1L404.4,493.7z" />`,
//   10: `<polygon class="st1" points="551.2,214.9 511.8,215.8 498.8,178.6 487.5,216.3 448.1,217.3 471.5,233.5 452.6,233.9 436.9,189.1
//   423.3,234.6 375.9,235.7 402.9,254.4 319,254.4 292.4,172.7 320.3,193 305.6,147.9 344,120 296.6,120 290.7,102 313.8,118.7
//   301.6,81.3 333.4,58.1 294.1,58.1 281.9,20.7 269.7,58.1 230.4,58.1 262.2,81.3 250.1,118.7 273.1,102 267.2,120 219.8,120
//   258.2,147.9 243.5,193 271.4,172.7 244.8,254.4 161.7,254.4 189.8,236.9 142.5,233.5 131.1,187.4 113.2,231.3 94.4,229.9
//   118.6,214.9 79.3,212.1 69.9,173.8 55,210.3 15.8,207.4 45.9,232.8 31,269.3 64.5,248.5 94.5,273.9 87.7,246.3 102.2,258.5
//   84.3,302.4 124.6,277.4 160.9,308 152.6,274.5 221.9,324.9 196,404.7 187,373.4 170.8,418 123.4,416.4 160.8,445.6 154.3,463.3
//   146.5,436 133,473 93.7,471.6 124.7,495.8 111.2,532.8 143.9,510.8 174.9,535 164,497.2 196.7,475.2 168.2,474.2 183.9,463.6
//   221.3,492.8 208.2,447.2 247.5,420.7 211.7,419.4 281.9,368.4 352.1,419.4 316.9,420.7 356.3,447.2 343.2,492.8 380.6,463.6
//   396.2,474.2 367.8,475.2 400.4,497.2 389.6,535 420.6,510.8 453.2,532.8 439.8,495.8 470.8,471.6 431.5,473 418,436 410.1,463.3
//   403.7,445.6 441.1,416.4 393.7,418 377.5,373.4 368.2,405.8 341.9,324.9 411.4,274.4 401.3,308.1 439,279.3 478,306.3 462.3,261.6
//   477.3,250.1 469.2,277.4 500.5,253.5 532.9,275.9 519.8,238.8 	" />`
// }

export const Visuals = {
  async draw() {
    if (!this.showIt) return
    if (this.bodies.length < 3) {
      this.p.textSize(40)
      this.p.text('Use the panel to the right to add Bodies -> -> ->', 100, 400)
      this.p.text('(You need minimum 3 Bodies in your Problem)', 100, 500)
      this.setPause(true)
      return
    }
    if (!this.firstFrame && !this.hasStarted) {
      this.hasStarted = true
      this.started()
    }

    this.frames++
    const results = this.step(this.bodies, this.missiles)
    this.bodies = results.bodies || []
    this.missiles = results.missiles || []

    this.p.noFill()
    this.p.textStyle(this.p.BOLDITALIC)
    // this.p.textFont('Instrument Serif, serif')

    this.drawBg()
    if (this.globalStyle == 'psycho') {
      this.p.blendMode(this.p.DIFFERENCE)
    }
    this.drawTails()

    if (this.globalStyle == 'psycho') {
      this.p.blendMode(this.p.BLEND)
    }
    if (!this.firstFrame) {
      this.drawBodies()
    }

    if (
      this.mode == 'game' &&
      this.target == 'inside' &&
      !this.firstFrame &&
      this.globalStyle !== 'psycho'
    ) {
      for (let i = 0; i < this.bodies.length; i++) {
        const body = this.bodies[i]
        this.drawCenter(body)
      }
    }

    if (
      this.mode == 'game' &&
      this.target == 'outside' &&
      !this.firstFrame &&
      this.globalStyle !== 'psycho'
    ) {
      for (let i = 0; i < this.bodies.length; i++) {
        const body = this.bodies[i]
        this.drawCenter(body)
      }
    }
    this.drawWitheringBodies()

    if (this.frames % 10 == 0) {
      this.sound?.render(this)
    }

    if (
      this.mode == 'game' &&
      this.frames - this.startingFrame + FPS < this.timer &&
      this.bodies.reduce((a, c) => a + c.radius, 0) != 0
    ) {
      this.drawGun()
      this.drawMissiles()
    }
    this.drawExplosions()
    // this.drawBodyOutlines()

    this.drawPause()
    this.drawScore()

    const notPaused = !this.paused
    const framesIsAtStopEveryInterval =
      (this.frames - this.startingFrame) % this.stopEvery == 0
    const didNotJustPause = !this.justPaused
    // console.log({
    //   stopEvery: this.stopEvery,
    //   alreadyRun: this.alreadyRun,
    //   frames: this.frames,
    //   framesIsAtStopEveryInterval,
    //   frames_lt_timer: this.frames < this.timer
    // })
    if (
      !this.firstFrame &&
      notPaused &&
      framesIsAtStopEveryInterval &&
      didNotJustPause &&
      this.frames - this.startingFrame <= this.timer
    ) {
      if (didNotJustPause) {
        this.finish()
      }
    } else {
      this.justPaused = false
    }
    if (this.frames - this.startingFrame + FPS >= this.timer) {
      this.handleGameOver({ won: false })
    }
    if (
      !this.won &&
      this.mode == 'game' &&
      this.bodies.reduce((a, c) => a + c.radius, 0) == 0
    ) {
      this.handleGameOver({ won: true })
    }
    this.firstFrame = false
  },
  drawPause() {
    if (this.paused) {
      this.p.noStroke()
      this.p.strokeWeight(0)
      this.p.fill('rgba(0,0,0,0.4)')
      this.p.rect(0, 0, this.windowWidth, this.windowHeight)
      this.p.push()
      this.p.fill('white')
      this.p.translate(this.windowWidth / 2, this.windowHeight / 2)
      this.p.triangle(-100, -100, -100, 100, 100, 0)
      this.p.pop()
    }
  },
  drawBodyOutlines() {
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      const radius = body.radius * 4 + this.radiusMultiplyer

      this.p.stroke(this.getGrey())
      this.p.stroke('black')
      this.p.strokeWeight(1)
      this.p.color('rgba(0,0,0,0)')
      this.p.ellipse(body.position.x, body.position.y, radius, radius)
    }
  },

  drawStarBg() {
    // this.p.background('rgb(10,10,100)')
    this.p.background('rgb(10,10,10)')
    // this.p.background('white')
    if (!this.starBG) {
      this.starBG = this.p.createGraphics(this.windowWidth, this.windowHeight)
      for (let i = 0; i < 200; i++) {
        // this.starBG.stroke('black')
        this.starBG.noStroke()
        // this.starBG.fill('rgba(255,255,255,0.6)')
        // this.starBG.fill('black')
        this.starBG.fill('white')
        this.starBG.textSize(20)
        const strings = [',', '.', '*']
        this.starBG.text(
          strings[this.random(0, strings.length - 1)],
          this.random(0, this.windowWidth),
          this.random(0, this.windowHeight)
        )
      }
      //   const totalLines = 6
      //   for (let i = 0; i < totalLines; i++) {
      //     if (i % 5 == 5) {
      //       this.starBG.strokeWeight(1)
      //       // this.starBG.stroke(`hsl(${i * (360 / totalLines)}, 100%, 50%)`)
      //     } else {
      //       this.starBG.strokeWeight(1)
      //       // this.starBG.stroke('rgba(0,0,0,0.1)')
      //     }
      //     this.starBG.line(i * (this.windowWidth / totalLines), 0, i * (this.windowWidth / totalLines), this.windowHeight)
      //     this.starBG.line(0, i * (this.windowHeight / totalLines), this.windowWidth, i * (this.windowHeight / totalLines))
      //   }
      // }
    }

    const basicX =
      Math.floor((this.frames / FPS) * (this.frames / FPS)) % this.windowWidth
    const basicY =
      Math.floor((this.frames / FPS) * (this.frames / FPS)) % this.windowHeight

    // const basicX = this.accumX % this.windowWidth
    // const basicY = this.accumY % this.windowHeight

    const Xleft = basicX - this.windowWidth
    const Xright = basicX + this.windowWidth

    const Ytop = basicY - this.windowHeight
    const Ybottom = basicY + this.windowHeight

    this.confirmedStarPositions ||= []
    for (let i = 0; i < this.starPositions?.length; i++) {
      if (i < this.confirmedStarPositions.length) continue
      const starBody = this.starPositions[i]
      const radius = starBody.radius * 4
      if (Xleft < 10) {
        this.drawBodiesLooped(starBody, radius, this.drawStarOnBG)
        if (this.loaded) {
          this.confirmedStarPositions.push(this.starPositions[i])
        }
      } else {
        this.drawBodiesLooped(starBody, radius, this.drawStarOnTopOfBG)
      }
    }

    this.p.image(
      this.starBG,
      basicX,
      basicY,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(
      this.starBG,
      Xleft,
      basicY,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(
      this.starBG,
      Xright,
      basicY,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(this.starBG, basicX, Ytop, this.windowWidth, this.windowHeight)
    this.p.image(
      this.starBG,
      basicX,
      Ybottom,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(this.starBG, Xleft, Ytop, this.windowWidth, this.windowHeight)
    this.p.image(this.starBG, Xright, Ytop, this.windowWidth, this.windowHeight)
    this.p.image(
      this.starBG,
      Xleft,
      Ybottom,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(
      this.starBG,
      Xright,
      Ybottom,
      this.windowWidth,
      this.windowHeight
    )

    // Grid lines
    const boxCount = 6
    // this.p.stroke('black')
    this.p.stroke('white')
    for (let i = 1; i < boxCount; i++) {
      if (i % 5 == 5) {
        this.p.strokeWeight(1)
        // this.starBG.stroke(`hsl(${i * (360 / totalLines)}, 100%, 50%)`)
      } else {
        this.p.strokeWeight(1)
      }
      this.p.line(
        i * (this.windowWidth / boxCount),
        0,
        i * (this.windowWidth / boxCount),
        this.windowHeight
      )
      this.p.line(
        0,
        i * (this.windowHeight / boxCount),
        this.windowWidth,
        i * (this.windowHeight / boxCount)
      )
    }
  },

  tintImage(img, color) {
    const g = this.p.createGraphics(img.width, img.height)
    const cc = this.getTintFromColor(color)
    g.tint(cc[0], cc[1], cc[2], cc[3] * 255)
    g.image(img, 0, 0)
    return g
  },

  drawStarOnTopOfBG(x, y, v, radius, b) {
    const faceIdx = b.mintedBodyIndex || b.bodyIndex
    const expression = 1
    const with_mouth = expression * 2
    const face = this.pngFaces[faceIdx][with_mouth]

    // const star = this.starSVG[b.maxStarLvl]
    if (face) {
      this.p.image(face, x, y, radius, radius)
    }
  },

  drawStarOnBG(x, y, v, radius, b) {
    const faceIdx = b.mintedBodyIndex || b.bodyIndex
    const expression = 1
    const with_mouth = expression * 2
    this.pngFaces ||= new Array(FACE_PNGS.length)
      .fill(null)
      .map(() => new Array(FACE_PNGS[0].length))
    const face = this.pngFaces[faceIdx][with_mouth]

    if (!face) {
      this.pngFaces[faceIdx][with_mouth] = 'loading'
      const png = FACE_PNGS[faceIdx][with_mouth]
      this.p.loadImage(png, (face) => {
        // to make masked background

        // const bgSize = img.width * 1.2
        // const imgCopy = img.get()
        // this.maskImage(imgCopy, [255, 255, 255])
        // const tinted = this.p.createGraphics(bgSize, bgSize)
        // const cc = this.getTintFromColor(body.c)
        // tinted.tint(cc[0], cc[1], cc[2])
        // tinted.image(imgCopy, 0, 0, bgSize, bgSize)
        // tinted.noTint()
        // const offset = (bgSize - img.width) / 2
        // tinted.image(img, offset, offset)
        // this.pngFaces[faceIdx][expression] = tinted
        this.pngFaces[faceIdx][with_mouth] = face
        // let star = this.starSVG[b.maxStarLvl]
        // if (!star) return
        // star = this.tintImage(star, b.c)
        const newElement = this.p.createGraphics(
          this.windowWidth,
          this.windowHeight
        )
        newElement.image(this.starBG, 0, 0, this.windowWidth, this.windowHeight)
        // const resize = 1.2
        // newElement.image(
        //   this.starSVG[b.maxStarLvl],
        //   x + (radius - radius * resize) / 2,
        //   y + (radius - radius * resize) / 2,
        //   radius * resize,
        //   radius * resize
        // )
        newElement.fill(b.c.replace(this.opac, '1'))
        newElement.ellipse(x, y, radius, radius)
        newElement.image(face, x - radius / 2, y - radius / 2, radius, radius)
        this.starBG = newElement
      })
    } else {
      // let star = this.starSVG[b.maxStarLvl]
      // if (!star) return
      // star = this.tintImage(star, b.c)
      const newElement = this.p.createGraphics(
        this.windowWidth,
        this.windowHeight
      )
      newElement.image(this.starBG, 0, 0, this.windowWidth, this.windowHeight)
      // const resize = 1.2
      // newElement.image(
      //   this.starSVG[b.maxStarLvl],
      //   x + (radius - radius * resize) / 2,
      //   y + (radius - radius * resize) / 2,
      //   radius * resize,
      //   radius * resize
      // )
      newElement.fill(b.c.replace(this.opac, '1'))
      newElement.ellipse(x, y, radius, radius)
      newElement.image(face, x - radius / 2, y - radius / 2, radius, radius)
      this.starBG = newElement
    }
  },

  drawStaticBg() {
    const bw = true

    // Fill the background with static noise
    if (!this.staticBg) {
      this.staticBg = this.p.createGraphics(this.windowWidth, this.windowHeight)
      this.staticBg.loadPixels()
      for (let x = 0; x < this.staticBg.width; x++) {
        for (let y = 0; y < this.staticBg.height; y++) {
          let colorValue
          if (bw) {
            const noiseValue = this.staticBg.noise(x * 0.01, y * 0.01)
            colorValue = this.staticBg.map(noiseValue, 0, 1, 0, 255)
            colorValue = this.staticBg.color(colorValue)
          } else {
            // const noiseValue = this.staticBg.noise(x * 0.01, y * 0.01)
            const rNoise = this.staticBg.noise(x * 0.01, y * 0.01) // * 255
            const gNoise = this.staticBg.noise(x * 0.02, y * 0.02) // * 255 // Different scale for variation
            const bNoise = this.staticBg.noise(x * 0.03, y * 0.03) // * 255 // Different scale for variation
            const rColorValue = this.staticBg.map(rNoise, 0, 1.01, 0, 255)
            const gColorValue = this.staticBg.map(gNoise, 0, 1.02, 0, 255)
            const bColorValue = this.staticBg.map(bNoise, 0, 1.03, 0, 255)
            colorValue = this.staticBg.color(
              rColorValue,
              gColorValue,
              bColorValue
            )
          }
          this.staticBg.set(x, y, this.staticBg.color(colorValue))
        }
      }
      this.staticBg.updatePixels()
    }
    this.p.image(this.staticBg, 0, 0)
  },
  drawSolidBg() {
    this.p.background(255)
  },

  drawBg() {
    this.drawStarBg()
    // this.drawSolidBg()
    // this.drawStaticBg()
  },

  getColorDir(chunk) {
    return Math.floor(this.frames / (255 * chunk)) % 2 == 0
  },

  getBW() {
    const dir = this.getColorDir(this.chunk)
    const lowerHalf = Math.floor(this.frames / this.chunk) % 255 < 255 / 2
    if (dir && lowerHalf) {
      return 'white'
    } else if (!dir && !lowerHalf) {
      return 'white'
    } else if (!dir && lowerHalf) {
      return 'black'
    } else if (dir && !lowerHalf) {
      return 'black'
    }
    // return  ? 'white' : 'black'
  },

  getGrey() {
    if (this.getColorDir(this.chunk)) {
      return 255 - (Math.floor(this.frames / this.chunk) % 255)
    } else {
      return Math.floor(this.frames / this.chunk) % 255
    }
  },

  getNotGrey() {
    if (!this.getColorDir(this.chunk)) {
      return 255 - (Math.floor(this.frames / this.chunk) % 255)
    } else {
      return Math.floor(this.frames / this.chunk) % 255
    }
  },

  drawScore() {
    const { p } = this
    p.push()
    p.fill('white')
    p.noStroke()
    p.textAlign(p.LEFT, p.TOP)
    const secondsLeft = (this.startingFrame + this.timer - this.frames) / FPS

    if (this.gameOver) {
      this.scoreSize = this.initialScoreSize
      p.pop()
      this.won ? this.drawWinScreen() : this.drawLoseScreen()
      return
    }

    // make the timer bigger as time runs out
    if (secondsLeft <= 9 && this.scoreSize < 420) {
      this.scoreSize += 5
      p.fill(255, 255, 255, 150)
    } else if (secondsLeft < 30 && this.scoreSize < 160) {
      this.scoreSize += 2
      p.fill(255, 255, 255, 150)
    } else if (secondsLeft < 50 && this.scoreSize < 80) {
      this.scoreSize += 1
      p.fill(255, 255, 255, 150)
    }
    p.textSize(this.scoreSize)
    p.text(secondsLeft.toFixed(0), 20, 10)

    p.pop()
  },

  drawWinScreen() {
    const { p } = this
    p.push()
    p.noStroke()
    p.fill('white')

    p.textSize(128)
    p.textAlign(p.CENTER, p.TOP)
    p.text('SUCCESS', this.windowWidth / 2 - 8, 190) // adjust by 8 to center SF Pro weirdness

    // draw a white box behind the stats, with border radius
    p.fill('white')
    p.rect(this.windowWidth / 2 - 320, 350, 640, 300, 20, 20, 20, 20)

    // draw stats
    p.textSize(48)
    p.textStyle(p.BOLD)
    p.fill('black')
    for (const [i, line] of this.statsText.split('\n').entries()) {
      // print each stat line with left aligned label, right aligned stat
      if (line.match(/1x/)) {
        // gray text if 1x multiplier
        p.fill('rgba(0,0,0,0.3)')
        p.fill('black')
      } else {
        p.fill('black')
      }
      // last line has a bar on top
      const leading = 64
      let barPadding = 0
      const xLeft = this.windowWidth / 2 - 300
      const xRight = this.windowWidth / 2 + 300
      const y = 374 + leading * i
      if (i === 3) {
        p.stroke('black')
        p.strokeWeight(4)
        p.line(xLeft, y, xRight, y)
        p.noStroke()
        barPadding = 20
      }
      for (const [j, stat] of line.split(':').entries()) {
        if (j === 0) {
          p.textAlign(p.LEFT, p.TOP)
          p.text(stat, xLeft, y + barPadding)
        } else {
          p.textAlign(p.RIGHT, p.TOP)
          p.text(stat, xRight, y + barPadding)
        }
      }
    }

    // play again button
    if (this.showPlayAgain) {
      this.drawButton({
        text: 'retry',
        x: this.windowWidth / 2 - 140,
        y: this.windowHeight / 2 + 205,
        height: 90,
        width: 280,
        onClick: () => this.restart(null, false)
      })
    }

    p.pop()
  },

  drawButton({ text, x, y, height, width, onClick }) {
    const { p } = this

    // register the button if it's not registered
    const key = `${x}-${y}-${height}-${width}`
    let button = this.buttons[key]
    if (!button) {
      this.buttons[key] = { x, y, height, width, onClick }
      button = this.buttons[key]
    }

    p.push()
    p.textStyle(p.BOLDITALIC)
    p.stroke('white')
    p.textSize(48)
    p.strokeWeight(button.active ? 1 : 4)
    if (button.hover) {
      p.fill('rgba(255,255,255,0.5)')
    } else {
      p.noFill()
    }
    p.rect(x, y, width, height, 10)
    p.noStroke()
    p.fill('white')
    p.textAlign(p.CENTER, p.CENTER)
    p.text(text, x + width / 2, y + height / 2)
    p.pop()
  },

  drawLoseScreen() {
    const { p } = this
    p.push()
    p.noStroke()
    p.fill(this.randomColor(100))

    p.textSize(128)
    // game over in the center of screen
    p.textAlign(p.CENTER)

    p.text(
      'GAME OVER',
      this.windowWidth / 2,
      this.windowHeight / 2 + 44 // place the crease of the R on the line
    )
    p.textSize(40)
    if (this.showPlayAgain) {
      this.drawButton({
        text: 'retry',
        x: this.windowWidth / 2 - 140,
        y: this.windowHeight / 2 + 120,
        height: 90,
        width: 280,
        onClick: () => this.restart(null, false)
      })
    }

    p.pop()
  },

  drawGun() {
    this.p.stroke('rgba(200,200,200,1)')
    this.p.strokeCap(this.p.SQUARE)
    const { canvas } = this.p

    if (this.p.mouseX <= 0 && this.p.mouseY <= 0) return

    // Bottom left corner coordinates
    let startX = 0
    let startY = this.windowHeight
    this.p.strokeWeight(2)

    const crossHairSize = 25

    const scaleX = (val) => {
      return (val / canvas.offsetWidth) * this.windowWidth
    }
    const scaleY = (val) => {
      return (val / canvas.offsetHeight) * this.windowHeight
    }
    // Calculate direction from bottom left to mouse
    let dirX = scaleX(this.p.mouseX) - startX
    let dirY = scaleY(this.p.mouseY) - startY
    this.p.line(
      scaleX(this.p.mouseX) - crossHairSize,
      scaleX(this.p.mouseY),
      scaleX(this.p.mouseX) + crossHairSize,
      scaleX(this.p.mouseY)
    )
    this.p.line(
      scaleX(this.p.mouseX),
      scaleX(this.p.mouseY) - crossHairSize,
      scaleX(this.p.mouseX),
      scaleX(this.p.mouseY) + crossHairSize
    )
    // // Calculate the length of the direction
    // let len = this.p.sqrt(dirX * dirX + dirY * dirY)

    // // If the length is not zero, scale the direction to have a length of 100
    // if (len != 0) {
    //   dirX = (dirX / len) * 100
    //   dirY = (dirY / len) * 100
    // }

    // Draw the line
    // this.p.setLineDash([5, 15])
    const drawingContext = this.p.canvas.getContext('2d')
    const chunk = this.windowWidth / 100
    drawingContext.setLineDash([chunk])
    if (this.aimHelper) {
      drawingContext.lineDashOffset = -(this.frames * 10)
    }

    this.p.line(startX, startY, startX + dirX, startY + dirY)
    drawingContext.setLineDash([])
    drawingContext.lineDashOffset = 0
    this.p.strokeWeight(0)
  },

  drawExplosions() {
    const { p, explosions } = this

    for (let i = 0; i < explosions.length; i++) {
      const _explosion = explosions[i]
      const bomb = _explosion[0]
      p.fill('rgba(255,255,255,0.5)')
      p.stroke('white')
      p.strokeWeight(2)
      p.ellipse(bomb.x, bomb.y, bomb.i * 2, bomb.i * 2)
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.8, bomb.i * 1.8)
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.6, bomb.i * 1.6)
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.4, bomb.i * 1.4)
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.6, bomb.i * 1.6)
      p.fill('rgba(255,255,255,0.9)')
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.4, bomb.i * 1.4)
      _explosion.shift()
      if (_explosion.length == 0) {
        explosions.splice(i, 1)
      }
    }
  },

  drawMissiles() {
    this.p.noStroke()
    this.p.strokeWeight(0)

    const missileReverbLevels = 10
    const green = '2,247,123'
    // const yellow = '255,255,0'
    const color = green
    const c =
      Math.floor(this.frames / missileReverbLevels) % 2 == 0
        ? `rgb(${color})`
        : 'white'

    for (let i = 0; i < this.missiles.length; i++) {
      const body = this.missiles[i]
      this.p.noStroke()
      this.p.fill(c)
      this.p.ellipse(body.position.x, body.position.y, body.radius, body.radius)

      this.p.noFill()
      this.p.strokeWeight(1)
      for (let i = 0; i < missileReverbLevels; i++) {
        const c =
          Math.floor((this.frames - i) / missileReverbLevels) % 2 == 0
            ? `rgba(${color},${(missileReverbLevels - i) / missileReverbLevels})`
            : `rgba(255,255,255,${(missileReverbLevels - i) / missileReverbLevels})`
        this.p.stroke(c)
        const reverb = body.radius * (i + 1)
        this.p.ellipse(body.position.x, body.position.y, reverb, reverb)
      }
    }
  },

  paintAtOnce(n = this.paintSteps) {
    this.bodiesGraphic ||= this.p.createGraphics(
      this.windowWidth,
      this.windowHeight
    )

    for (let i = 0; i < n; i++) {
      const results = this.step(this.bodies, this.missiles)
      this.bodies = results.bodies
      this.missiles = results.missiles || []
      this.drawBodies(false)
      this.drawWitheringBodies()
      this.frames++
    }

    this.p.image(this.bodiesGraphic, 0, 0)
    this.bodiesGraphic.clear()
  },
  componentToHex(c) {
    var hex = parseInt(c).toString(16)
    return hex.length == 1 ? '0' + hex : hex
  },

  rgbToHex(r, g, b) {
    return (
      '0x' +
      this.componentToHex(r) +
      this.componentToHex(g) +
      this.componentToHex(b)
    )
  },
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
  },

  invertColorRGB(c) {
    throw new Error(`invert color is not meant for HSL colors (${c})`)
    // let [r, g, b] = c.replace('rgba(', '').split(',').slice(0, 3)
    // const hexColor = this.rgbToHex(r, g, b)
    // const invert = (parseInt(hexColor) ^ 0xffffff).toString(16).padStart(6, '0')
    // const invertRGB = this.hexToRgb(invert)
    // // r = r - 255
    // // g = g - 255
    // // b = b - 255
    // const newColor = this.p.color(invertRGB.r, invertRGB.g, invertRGB.b)
    // return newColor
  },

  ghostEyes(radius) {
    const eyeOffsetX = radius / 5
    const eyeOffsetY = radius / 12
    this.bodiesGraphic.fill('rgba(0,0,0,0.3)')
    this.bodiesGraphic.filter(this.p.BLUR)
    this.bodiesGraphic.ellipse(-eyeOffsetX, -eyeOffsetY, radius / 7, radius / 5)
    this.bodiesGraphic.ellipse(eyeOffsetX, -eyeOffsetY, radius / 7, radius / 5)
    this.bodiesGraphic.ellipse(0, +eyeOffsetY, radius / 7, radius / 7)
    // this.bodiesGraphic.fill(i % 2 == 0 ? 'white' : this.randomColor(0, 255))
  },

  drawStyleGhost(x, y, v, radius) {
    this.ghostEyes(radius)
  },

  // Function to apply mask color to the image
  maskImage(img, maskColor) {
    img.loadPixels() // Load the image's pixel data

    for (let i = 0; i < img.pixels.length; i += 4) {
      if (img.pixels[i + 3] == 0) continue // Skip transparent pixels (alpha = 0
      // Replace RGB values with the mask color's RGB, preserve the original alpha
      img.pixels[i] = maskColor[0] // R
      img.pixels[i + 1] = maskColor[1] // G
      img.pixels[i + 2] = maskColor[2] // B
      img.pixels[i + 3] = 255 // TODO: could be 100% or 1
      // Alpha remains unchanged to preserve transparency
    }

    img.updatePixels() // Update the image with the new pixel values
  },

  isMissileClose(body) {
    const minDistance = 300
    let closeEnough = false
    for (let i = 0; i < this.missiles.length; i++) {
      const missile = this.missiles[i]
      const distance = this.p.dist(
        body.position.x,
        body.position.y,
        missile.position.x,
        missile.position.y
      )
      if (distance < minDistance) {
        closeEnough = true
        break
      }
    }
    return closeEnough
  },

  drawPngFace(radius, body, offset) {
    const closeEnough = this.isMissileClose(body)
    if (body.radius !== 0 && !closeEnough) return
    this.pngFaces ||= new Array(FACE_PNGS.length)
      .fill(null)
      .map(() => new Array(FACE_PNGS[0].length))
    const faceIdx = body.mintedBodyIndex || body.bodyIndex

    // faceRotation: 'time' | 'hitcycle' | 'mania'
    // time: start sleepy and get happier as time goes on
    // hit: rotate to a new face each time (expression is starLvl % 3)
    // mania: when body is hit, cycle wildly until end of game
    let hit = body.radius === 0
    let expression = Math.ceil(
      (2 * (hit ? body.starLvl - 1 : body.starLvl)) / body.maxStarLvl
    ) // 0 sleepy, 1 normal, 2 ecstatic
    const framesLeft = this.startingFrame + this.timer - this.frames
    switch (this.faceRotation) {
      case 'time':
        expression = 2 - Math.floor((framesLeft / this.timer) * 3)
        break
      case 'hitcycle':
        expression = hit
          ? expression + (Math.floor(this.frames / 10) % 2)
          : expression
        break
      case 'mania':
        // cycle every 10 frames when hit
        expression = hit ? Math.floor(this.frames / 10) % 3 : expression
        break
    }
    expression = expression % 3
    const no_mouth = expression * 2 + 1
    const with_mouth = expression * 2

    // let closeEnough = this.isMissileClose(body)
    const whichFace = body.radius !== 0 ? no_mouth : with_mouth
    const face = this.pngFaces[faceIdx][whichFace]
    if (!face) {
      this.pngFaces[faceIdx][whichFace] = 'loading'
      const png = FACE_PNGS[faceIdx][whichFace]
      this.p.loadImage(png, (img) => {
        // to make masked background

        // const bgSize = img.width * 1.2
        // const imgCopy = img.get()
        // this.maskImage(imgCopy, [255, 255, 255])
        // const tinted = this.p.createGraphics(bgSize, bgSize)
        // const cc = this.getTintFromColor(body.c)
        // tinted.tint(cc[0], cc[1], cc[2])
        // tinted.image(imgCopy, 0, 0, bgSize, bgSize)
        // tinted.noTint()
        // const offset = (bgSize - img.width) / 2
        // tinted.image(img, offset, offset)
        // this.pngFaces[faceIdx][expression] = tinted
        this.pngFaces[faceIdx][whichFace] = img
      })
    }
    if (face && face !== 'loading') {
      const faceSize = radius / 1.5
      this.bodiesGraphic.image(
        face,
        -faceSize / 2,
        -faceSize / 2 + offset - (body.radius == 0 ? 0 : radius / 5),
        faceSize,
        faceSize
      )
    }
  },

  drawGlyphFace(radius, body) {
    const eyeArray = [
      '≖',
      '✿',
      'ಠ',
      '◉',
      '۞',
      '◉',
      'ಡ',
      '˘',
      '❛',
      '⊚',
      '✖',
      'ᓀ',
      '◔',
      'ಠ',
      '⊡',
      '◑',
      '■',
      '↑',
      '༎',
      'ಥ',
      'ཀ',
      '╥',
      '☯'
    ]
    const mouthArray = [
      '益',
      '﹏',
      '෴',
      'ᗜ',
      'ω',
      '_',
      '‿',
      '‿‿',
      '‿‿‿',
      '‿‿‿‿',
      '‿‿‿‿‿',
      '‿‿‿‿‿‿',
      '‿‿‿‿‿‿‿',
      '‿‿‿‿‿‿‿‿',
      '‿‿‿‿‿‿‿‿‿'
    ]

    const c = body.c.replace(this.opac, '0.1')
    const i = this.bodies.indexOf(body) // TODO: change to bodyId

    this.bodiesGraphic.noStroke()
    this.bodiesGraphic.fill(c)
    this.bodiesGraphic.ellipse(0, 0, radius, radius)
    this.bodiesGraphic.textSize(radius / 2.2)
    const eyeIndex = i % eyeArray.length
    const mouthIndex = i % mouthArray.length
    const face =
      eyeArray[eyeIndex] + mouthArray[mouthIndex] + eyeArray[eyeIndex]

    this.bodiesGraphic.fill(c)
    this.bodiesGraphic.strokeWeight(10)
    this.bodiesGraphic.stroke(c)
    this.bodiesGraphic.text(face, -radius / 2.4, radius / 8)

    const invertedC = this.invertColorRGB(c)
    this.bodiesGraphic.fill(invertedC)
    this.bodiesGraphic.noStroke()
    this.bodiesGraphic.text(face, -radius / 2.4, radius / 8)

    // hp in white text
    this.bodiesGraphic.fill('white')
    this.bodiesGraphic.textSize(radius / 4)
    this.bodiesGraphic.textAlign(this.p.CENTER, this.p.CENTER)
    this.bodiesGraphic.text(body.starLvl, 0, radius)
  },

  getTintFromColor(c) {
    const cc = c
      .split(',')
      .map((c) => parseFloat(c.replace(')', '').replace('hsla(', '')))
    return [cc[0], cc[1], cc[2], cc[2]]
  },

  drawLevels(radius, body, offset) {
    if (body.radius !== 0) return
    this.bodiesGraphic.push()
    this.bodiesGraphic.translate(0, offset)
    this.bodiesGraphic.rotate(3 * (this.p.PI / 2))
    const distance = radius / 1
    radius = radius - this.radiusMultiplyer
    // const blackTransparent = 'rgba(0,0,0,0.5)'
    const whiteTransparent = 'rgba(255,255,255,0.5)'
    this.bodiesGraphic.fill('transparent')
    this.bodiesGraphic.stroke(whiteTransparent)
    this.bodiesGraphic.strokeWeight(1)
    this.bodiesGraphic.ellipse(0, 0, distance * 2)
    for (let i = 0; i < body.maxStarLvl; i++) {
      this.bodiesGraphic.strokeWeight(0)
      this.bodiesGraphic.noStroke()
      // this.bodiesGraphic.stroke(whiteTransparent)
      const rotateOffset = this.frames / 80
      const rotated =
        i * (this.bodiesGraphic.TWO_PI / body.maxStarLvl) + rotateOffset
      const xRotated = distance * Math.cos(rotated)
      const yRotated = distance * Math.sin(rotated)

      // let c = body.c
      let c = body.c.replace(this.opac, '1')

      if (body.radius == 0) {
        if (i < body.starLvl) {
          // this.bodiesGraphic.fill(body.c.replace(this.opac, '1'))
          // if (i == body.starLvl - 1) {
          //   c = 'rgba(255,255,255,1)'
          //   this.bodiesGraphic.fill('white')
          // } else {
          // c = body.c.replace(this.opac, '1')
          this.bodiesGraphic.fill(c)
          // }
        } else {
          c = 'black'
          this.bodiesGraphic.strokeWeight(1)
          this.bodiesGraphic.stroke(whiteTransparent)
          this.bodiesGraphic.fill(c)
        }
      } else {
        if (i > 0 && i - 1 < body.starLvl) {
          this.bodiesGraphic.fill(c)
        } else {
          c = 'black'
          this.bodiesGraphic.strokeWeight(1)
          this.bodiesGraphic.stroke(whiteTransparent)
          this.bodiesGraphic.fill(c)
          // c = blackTransparent
        }
      }

      this.bodiesGraphic.ellipse(xRotated, yRotated, radius / 2)
      // this.starSVG ||= []
      // const star = this.starSVG[body.maxStarLvl]
      // if (!star) {
      //   const svg = STAR_SVGS[body.maxStarLvl - 1]
      //   this.p.loadImage(svg, (img) => {
      //     // this is a hack to tint the svg
      //     // const g = this.p.createGraphics(img.width, img.height)
      //     // const cc = c
      //     //   .split(',')
      //     //   .map((c) => parseFloat(c.replace(')', '').replace('rgba(', '')))
      //     // g.tint(cc[0], cc[1], cc[2], cc[3] * 255)
      //     // g.image(img, 0, 0)
      //     this.starSVG[body.maxStarLvl] = img //g
      //   })
      // }
      // if (star && star !== 'loading') {
      //   this.bodiesGraphic.image(
      //     star,
      //     xRotated - radius / 2,
      //     yRotated - radius / 2,
      //     radius,
      //     radius
      //   )
      // }

      // this.bodiesGraphic.fill('white')
      // this.bodiesGraphic.textSize(50)
      // this.bodiesGraphic.text(`${body.starLvl} / ${body.maxStarLvl}`, 0, radius)
    }
    this.bodiesGraphic.pop()
  },

  // async getStar(starIndex, color) {
  //   if (this.starPNGs[starIndex][color]) {
  //     return this.starPNGs[starIndex + color]
  //   }
  //   this.starPNGs[starIndex + color] = 'not-yet'
  //   const path = stars[starIndex]

  //   const starImg = this.p.loadImage(svg, (img) => {

  //   }
  //   this.starPNGs[starIndex][color] = starImg

  // },

  drawBodyStyle1(radius, body, offset) {
    this.bodiesGraphic.noStroke()

    const c =
      body.radius !== 0 ? body.c : this.replaceOpacity(body.c, this.deadOpacity)

    this.bodiesGraphic.fill(c)
    this.bodiesGraphic.ellipse(0, offset, radius, radius)
    if (this.globalStyle == 'psycho' && this.target == 'inside') {
      this.drawCenter(body, this.bodiesGraphic, 0, offset)
    }
  },

  moveAndRotate_PopAfter(graphic, x, y, v) {
    graphic.push()
    graphic.translate(x, y)
    const angle = v.heading() + this.p.PI / 2
    graphic.rotate(angle)
    // if (v.x > 0) {
    //   graphic.scale(-1, 1)
    // }
    // if (v.y > 0) {
    //   graphic.scale(1, -1)
    // }
  },

  drawBody(x, y, v, radius, body) {
    this.moveAndRotate_PopAfter(this.bodiesGraphic, x, y, v)

    const offset = this.getOffset(radius)

    switch (body.bodyStyle) {
      default:
        this.drawBodyStyle1(radius, body, offset)
    }
    if ((body.mintedBodyIndex || body.bodyIndex) <= FACE_PNGS.length) {
      this.drawPngFace(radius, body, offset)
    } else {
      this.drawGlyphFace(radius, body)
    }

    if (this.showLevels) {
      this.drawLevels(radius, body, offset)
    }

    this.bodiesGraphic.pop()
  },

  getBodyRadius(actualRadius) {
    return actualRadius * 4 + this.radiusMultiplyer
  },

  drawBodiesLooped(body, radius, drawFunction) {
    drawFunction = drawFunction.bind(this)
    drawFunction(body.position.x, body.position.y, body.velocity, radius, body)

    let loopedX = false,
      loopedY = false,
      loopX = body.position.x,
      loopY = body.position.y
    const loopGap = radius / 2

    // crosses right, draw on left
    if (body.position.x > this.windowWidth - loopGap) {
      loopedX = true
      loopX = body.position.x - this.windowWidth
      drawFunction(loopX, body.position.y, body.velocity, radius, body)
      // crosses left, draw on right
    } else if (body.position.x < loopGap) {
      loopedX = true
      loopX = body.position.x + this.windowWidth
      drawFunction(loopX, body.position.y, body.velocity, radius, body)
    }

    // crosses bottom, draw on top
    if (body.position.y > this.windowHeight - loopGap) {
      loopedY = true
      loopY = body.position.y - this.windowHeight
      drawFunction(body.position.x, loopY, body.velocity, radius, body)
      // crosses top, draw on bottom
    } else if (body.position.y < loopGap) {
      loopedY = true
      loopY = body.position.y + this.windowHeight
      drawFunction(body.position.x, loopY, body.velocity, radius, body)
    }

    // crosses corner, draw opposite corner
    if (loopedX && loopedY) {
      drawFunction(loopX, loopY, body.velocity, radius, body)
    }
  },

  // TODO: add this back as part of a end game animation
  drawWitheringBodies() {
    if (this.gameOver) {
      return
    }
    const { p } = this

    // draw a fake withering body for development
    // if (this.witheringBodies.length === 0) {
    //   this.witheringBodies = [{ position: p.createVector(100, 100) }]
    // }

    this.bodiesGraphic ||= p.createGraphics(this.windowWidth, this.windowHeight)
    this.bodiesGraphic.noStroke()
    for (const body of this.witheringBodies) {
      p.push()
      p.translate(body.position.x, body.position.y)
      body.witherSteps ||= 0
      body.witherSteps++
      if (body.witherSteps > WITHERING_STEPS) {
        this.witheringBodies = this.witheringBodies.filter((b) => b !== body)
        p.pop()
        continue
      }

      // the body should shrink to nothing over WITHERING_STEPS
      const radius = p.map(
        WITHERING_STEPS - body.witherSteps,
        0,
        WITHERING_STEPS,
        1,
        30 // start radius
      )

      // the ghost body pulses a little bit, isn't totally round
      body.zoff ||= 0
      p.stroke(255)
      p.noFill()
      p.fill(255, 255, 255, 230)
      p.beginShape()
      for (let a = 0; a < p.TWO_PI; a += 0.02) {
        let xoff = p.map(p.cos(a), -1, 1, 0, 2)
        let yoff = p.map(p.sin(a), -1, 1, 0, 2)
        const r = p.map(
          p.noise(xoff, yoff, body.zoff),
          0,
          1,
          radius - 10,
          radius
        )
        let x = r * p.cos(a)
        let y = r * p.sin(a)
        p.vertex(x, y)
      }
      p.endShape(p.CLOSE)
      body.zoff += 0.01

      p.pop()
    }
  },

  async drawBodyAsStar(body) {
    const star = this.starSVG[body.starLvl]
    if (!star) {
      this.starSVG[body.starLvl] = 'loading'
      const svg = STAR_SVGS[body.starLvl - 1]
      this.p.loadImage(svg, (img) => {
        this.starSVG[body.starLvl] = img
      })
    }
    if (star && star !== 'loading') {
      this.bodiesGraphic.image(
        star,
        body.position.x - body.radius * 2,
        body.position.y - body.radius * 2,
        body.radius,
        body.radius
      )
    }
  },

  async drawBodies(attachToCanvas = true) {
    this.bodiesGraphic ||= this.p.createGraphics(
      this.windowWidth,
      this.windowHeight
    )
    this.bodiesGraphic.noStroke()

    const bodyCopies = []
    for (let i = 0; i < this.bodies.length; i++) {
      // const body = this.bodies.sort((a, b) => b.radius - a.radius)[i]
      const body = this.bodies[i]
      // after final proof is sent, don't draw upgradable bodies
      if (this.finalBatchSent && body.maxStarLvl == body.starLvl) continue
      if (body.radius == 0) continue
      const bodyRadius = this.bodyCopies.filter(
        (b) => b.bodyIndex == body.bodyIndex
      )[0]?.radius
      const radius = this.getBodyRadius(bodyRadius)
      this.drawBodiesLooped(body, radius, this.drawBody)

      const bodyCopy = JSON.parse(
        JSON.stringify(
          body,
          (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
        )
      )
      bodyCopy.position = this.p.createVector(body.position.x, body.position.y)
      bodyCopy.velocity = this.p.createVector(body.velocity.x, body.velocity.y)
      bodyCopies.push(bodyCopy)
    }
    this.frames % this.tailMod == 0 && this.allCopiesOfBodies.push(bodyCopies)
    if (this.allCopiesOfBodies.length > this.tailLength) {
      this.allCopiesOfBodies.shift()
    }
    if (attachToCanvas) {
      this.p.image(this.bodiesGraphic, 0, 0)
    }
    this.bodiesGraphic.clear()
  },

  drawBorder() {
    // drawClock
    const clockCenter = this.windowWidth / 2

    // const radialStep1 = (this.frames / (this.chunk * 1) / 255) * 180 + 270 % 360
    // const clockRadius = this.windowWidth
    // const clockX = clockCenter + clockRadius * Math.cos(radialStep1 * Math.PI / 180)
    // const clockY = clockCenter + clockRadius * Math.sin(radialStep1 * Math.PI / 180)
    // this.bodiesGraphic.stroke(this.getBW())
    // this.bodiesGraphic.noStroke()
    // this.bodiesGraphic.fill(this.getNotGrey())
    // this.bodiesGraphic.ellipse(clockX, clockY, 100, 100)

    let size = this.windowWidth / Math.PI
    const radialStep2 =
      (this.frames / (this.chunk * 1) / 255) * 360 + (270 % 360)
    const clockRadius2 = this.windowWidth / 2 + size / 4

    const clockX2 =
      clockCenter + clockRadius2 * Math.cos((radialStep2 * Math.PI) / 180)
    const clockY2 =
      clockCenter + clockRadius2 * Math.sin((radialStep2 * Math.PI) / 180)
    // this.bodiesGraphic.stroke(this.getBW())
    this.bodiesGraphic.noStroke()
    // this.bodiesGraphic.stroke('white')
    this.bodiesGraphic.fill(this.getGrey())
    // if (size < 0) {
    //   size = 0
    // }
    this.bodiesGraphic.ellipse(clockX2, clockY2, size, size)
  },

  getAngledImage(body) {
    const graphic = this.p.createGraphics(this.windowWidth, this.windowHeight)
    graphic.push()
    graphic.translate(body.position.x, body.position.y)
    var angle = body.velocity.heading() + graphic.PI / 2
    graphic.rotate(angle)

    if (!this.eyes) {
      this.eyes = this.p.loadImage('/eyes-3.png')
    }
    const size = 6
    graphic.image(
      this.eyes,
      -body.radius * (size / 2),
      -body.radius * (size / 2),
      body.radius * size,
      body.radius * size
    )

    graphic.pop()
    graphic.push()
    graphic.translate(body.position.x, body.position.y)
    var angle2 = body.velocity.heading() + graphic.PI / 2
    graphic.rotate(angle2)
    graphic.pop()
    return graphic
  },

  getAngledBody(body, finalColor) {
    // rotate by velocity
    this.p.push()
    this.p.translate(body.position.x, body.position.y)
    var angle = body.velocity.heading() + this.p.PI / 2
    this.p.rotate(angle)

    this.p.strokeWeight(0)
    // stroke("white")
    this.p.fill(finalColor)
    // Calculate the vertices of the equilateral triangle
    let x1 = body.radius * 4 * this.p.cos(this.p.PI / 6)
    let y1 = body.radius * 4 * this.p.sin(this.p.PI / 6)

    let x2 = body.radius * 4 * this.p.cos(this.p.PI / 6 + this.p.TWO_PI / 3)
    let y2 = body.radius * 4 * this.p.sin(this.p.PI / 6 + this.p.TWO_PI / 3)

    let x3 =
      body.radius * 4 * this.p.cos(this.p.PI / 6 + (2 * this.p.TWO_PI) / 3)
    let y3 =
      body.radius * 4 * this.p.sin(this.p.PI / 6 + (2 * this.p.TWO_PI) / 3)

    this.p.triangle(x1, y1, x2, y2, x3, y3)
    this.p.pop()

    this.p.stroke('white')
    this.p.strokeWeight(1)
    this.p.push()
    this.p.translate(body.position.x, body.position.y)
    var angle2 = body.velocity.heading() + this.p.PI / 2
    this.p.rotate(angle2)
    this.p.pop()
  },

  drawTailStyle1(x, y, v, radius, finalColor, offset) {
    // finalColor = finalColor.replace(this.opac, '1')
    this.p.push()
    this.p.translate(x, y)
    this.p.rotate(v.heading() + this.p.PI / 2)

    // this.p.rotate(angle)
    this.p.fill(finalColor)
    this.p.noStroke()
    this.p.ellipse(0, offset, radius, radius)

    // this.p.image(this.drawTails[id], -radius / 2, -radius)
    this.p.pop()
  },

  drawTailStyleGhost(x, y, v, radius, finalColor) {
    // ghost version

    const id = radius + '-' + finalColor
    if (!this.tailGraphics) {
      this.tailGraphics = {}
    }
    if (!this.tailGraphics || this.tailGraphics[id] == undefined) {
      this.tailGraphics[id] = this.p.createGraphics(
        this.windowWidth,
        this.windowHeight
      )
      this.tailGraphics[id].noStroke()
      this.tailGraphics[id].fill(finalColor)

      this.tailGraphics[id].beginShape()
      // this.tailGraphics[id].vertex(radius, 0)
      // this.tailGraphics[id].vertex(0, 0)

      // this.p.arc(0, 0, radius, radius, this.p.PI, 2 * this.p.PI)
      const arcResolution = 20

      for (let j = 0; j < arcResolution; j++) {
        const ang = this.p.map(j, 0, arcResolution, 0, this.p.PI)
        const ax = radius / 2 + (this.p.cos(ang) * radius) / 2
        const ay = (2 * radius) / 2 + (-1 * this.p.sin(ang) * radius) / 2
        this.tailGraphics[id].vertex(ax, ay)
      }

      // this.tailGraphics[id].fill('red')
      // this.tailGraphics[id].rect(0, 0, radius, radius / 2)

      const bumps = 7
      let bumpHeight = radius / 6
      // let heightChanger = radius / 10
      // const bumpHeightMax = radius / 5
      // const bumpHeightMin = radius / 8
      const startY = radius * 1
      // this.tailGraphics[id].push()
      let remaindingWidth = radius
      for (let i = 0; i < bumps; i++) {
        let bumpWidth = radius / bumps
        // bumpHeight += heightChanger
        // if (bumpHeight > bumpHeightMax || bumpHeight < bumpHeightMin) {
        //   heightChanger *= -1
        // }
        let x = radius - remaindingWidth
        if (i % 2 == 1) {
          // this.tailGraphics[id].arc(x + bumpWidth / 2, startY, bumpWidth, bumpHeight, this.tailGraphics[id].PI, 0, this.tailGraphics[id].OPEN)
          for (let j = 0; j < arcResolution; j++) {
            const ang = this.p.map(j, 0, arcResolution, this.p.PI, 0)
            const ax = x + bumpWidth / 2 + (this.p.cos(ang) * bumpWidth) / 2
            const ay =
              startY + bumpHeight + (-1 * this.p.sin(ang) * bumpHeight) / 2
            this.tailGraphics[id].vertex(ax, ay)
          }
        } else {
          for (let j = 0; j < arcResolution; j++) {
            const ang = this.p.map(j, 0, arcResolution, this.p.PI, 0)
            const ax = x + bumpWidth / 2 + (this.p.cos(ang) * bumpWidth) / 2
            const ay = startY + bumpHeight + (this.p.sin(ang) * bumpHeight) / 2
            this.tailGraphics[id].vertex(ax, ay)
          }
          // this.tailGraphics[id].arc(x + bumpWidth / 2, startY + bumpWidth, bumpWidth, bumpHeight, 0, this.tailGraphics[id].PI, this.tailGraphics[id].OPEN)
        }
        remaindingWidth -= bumpWidth
      }
      this.tailGraphics[id].endShape(this.tailGraphics[id].CLOSE)
      // this.tailGraphics[id].pop()
    }

    // this.tailGraphics[id].push()
    // this.tailGraphics[id].translate(x, y)
    var angle = v.heading() + this.p.PI / 2
    // this.tailGraphics[id].rotate(angle)
    // this.tailGraphics[id].fill(finalColor)
    // this.tailGraphics[id].fill('rgba(255,0,0,1)')
    // this.tailGraphics[id].rect(0, 0, radius, radius / 4)
    // this.tailGraphics[id].pop()
    this.p.push()
    this.p.translate(x, y)
    this.p.rotate(angle)
    this.p.image(this.tailGraphics[id], -radius / 2, -radius)
    this.p.pop()
  },

  getOffset(radius) {
    return this.target == 'inside' ? 0 : radius / 1.5
  },

  drawTails() {
    for (let i = 0; i < this.allCopiesOfBodies.length; i++) {
      const copyOfBodies = this.allCopiesOfBodies[i]

      for (let j = 0; j < copyOfBodies.length; j++) {
        const body = copyOfBodies[j]
        if (this.gameOver || this.won) {
          if (
            this.witheringBodies.filter((b) => b.bodyIndex == body.bodyIndex)
              .length > 0
          )
            continue
        }
        if (body.radius == 0) continue
        const c =
          body.radius !== 0
            ? this.replaceOpacity(body.c, this.deadOpacity)
            : this.replaceOpacity(body.c, this.deadOpacity)
        this.p.fill(c)
        // if (this.mode == 'nft') {
        const bodyCopy = this.bodyCopies.filter(
          (b) => b.bodyIndex == body.bodyIndex
        )[0]
        const radius = this.getBodyRadius(bodyCopy.radius) * 1.1

        // this.p.ellipse(body.position.x, body.position.y, radius, radius)
        this.p.push()
        this.p.translate(body.position.x, body.position.y)
        this.p.rotate(body.velocity.heading() + this.p.PI / 2)
        // this.p.arc(0, 0, radius, radius, this.p.PI, 2 * this.p.PI)
        this.p.pop()
        const offset = this.getOffset(radius)

        switch (body.tailStyle) {
          case 1:
            this.drawTailStyle1(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              c,
              offset
            )
            break
          case 'ghost':
            this.drawTailStyleGhost(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              c,
              offset
            )
            break
          default:
            this.drawTailStyle1(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              c,
              offset
            )
        }
      }
    }
  },

  replaceOpacity(c, opacity) {
    const isHSLA = c.includes('hsla')
    const prefix = isHSLA ? 'hsla' : 'rgba'
    let cc = c
      .split(',')
      .map((c) => parseFloat(c.replace(')', '').replace(prefix + '(', '')))
    if (cc.length !== 4) {
      throw new Error('Color must have alpha value format, instead it has ' + c)
    }
    cc[3] = opacity
    if (isHSLA) {
      cc[1] = cc[1] + '%'
      cc[2] = cc[2] + '%'
    }
    return `${prefix}(${cc.join(',')})`
  },

  brighten(c, amount = 20) {
    let cc = c
      .split(',')
      .map((c) => parseFloat(c.replace(')', '').replace('hsla(', '')))
    cc[2] = cc[2] + amount
    cc[1] = cc[1] + '%'
    cc[2] = cc[2] + '%'
    return `hsla(${cc.join(',')})`
  },

  drawCenter(b, p = this.p, x, y) {
    let closeEnough = this.isMissileClose(b)
    // this.p.blendMode(this.p.DIFFERENCE)
    p.noStroke()
    x = x == undefined ? b.position.x : x
    y = y == undefined ? b.position.y : y
    const r = b.radius * 4
    if (r == 0) return
    let c = this.brighten(b.c).replace(this.opac, 1)

    if (this.target == 'outside') {
      p.fill(c)
      p.ellipse(x, y, r)
      const star = this.starSVG[b.maxStarLvl]
      p.image(star, x - r / 2, y - r / 2, r, r)
    } else {
      let darker = this.brighten(b.c, -30).replace(this.opac, 1)
      p.fill(darker)
      p.ellipse(x, y, r)
      if (closeEnough) {
        // draw teeth
        const teeth = 10
        const toothSize = r / 4.5
        // if (closeEnough) {
        p.fill(darker)
        p.ellipse(x, y, r)
        for (let i = 0; i < teeth; i++) {
          if (i == Math.floor(teeth / 4)) continue
          if (i == Math.ceil(teeth / 4)) continue

          if (i == Math.floor((3 * teeth) / 4)) continue
          if (i == Math.ceil((3 * teeth) / 4)) continue
          p.fill('white')
          // draw each tooth
          const angle = (i * this.p.TWO_PI) / teeth
          // add some rotation depending on vector of body
          const rotatedAngle = angle + b.velocity.heading()
          const x1 = x + (r / 2.3) * this.p.cos(rotatedAngle)
          const y1 = y + (r / 2.3) * this.p.sin(rotatedAngle)
          p.ellipse(x1, y1, toothSize)
        }

        p.stroke(darker)
        p.strokeWeight(r / 12)
        p.noFill()
        p.ellipse(x, y, r)
      } else {
        p.strokeWeight(0)
        const count = 3
        for (let i = 0; i < count; i++) {
          if (i % 2 == 1) {
            p.fill('white')
          } else {
            p.fill(darker)
          }
          p.ellipse(x, y, r - (i * r) / count)
        }
        // let star = this.starSVG[b.maxStarLvl]
        // star = this.tintImage(star, darker)
        // p.image(star, x - r / 2, y - r / 2, r, r)
      }
    }
    // p.blendMode(p.BLEND)
  },

  colorArrayToTxt(cc) {
    // let cc = baseColor.map(c => c + start + (chunk * i))
    cc.push(this.opac)
    cc = `hsla(${cc.join(',')})`
    return cc
  },

  createVector(x, y) {
    if (this.p) {
      return this.p.createVector(x, y)
    } else {
      return { x, y }
    }
  },

  frameRate() {
    this.lastFrameRateCheckAt ||= { frames: this.frames, time: Date.now() }
    this.lastFrameRate ||= 0

    if (this.frames - this.lastFrameRateCheckAt.frames > 30) {
      const diff = Date.now() - this.lastFrameRateCheckAt.time
      this.lastFrameRate =
        ((this.frames - this.lastFrameRateCheckAt.frames) / diff) * 1000
      this.lastFrameRateCheckAt = { frames: this.frames, time: Date.now() }
    }

    return this.lastFrameRate
  },
  async loadImages() {
    return
    // this.starSVG ||= {}
    // for (let i = 0; i < STAR_SVGS.length; i++) {
    //   const svg = STAR_SVGS[i]
    //   await new Promise((resolve) => {
    //     this.p.loadImage(svg, (img) => {
    //       this.starSVG[i + 1] = img
    //       resolve()
    //     })
    //   })
    // }
    // this.loaded = true
  }
}
