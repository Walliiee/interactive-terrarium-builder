/* Botanical objects are drawn at their planting point (0, 0). */
(function () {
  'use strict';

  const items = [
    { id: 'fern', name: 'Woodland fern', category: 'plants', subtitle: 'Feathery & wild' },
    { id: 'fittonia', name: 'Nerve plant', category: 'plants', subtitle: 'A little pink detail' },
    { id: 'monstera', name: 'Mini monstera', category: 'plants', subtitle: 'Big tropical energy' },
    { id: 'moss', name: 'Cushion moss', category: 'moss', subtitle: 'A soft forest floor' },
    { id: 'succulent', name: 'Sage succulent', category: 'plants', subtitle: 'Sculptural & serene' },
    { id: 'rock', name: 'River stones', category: 'decor', subtitle: 'Beautiful little boulders' },
    { id: 'driftwood', name: 'Driftwood', category: 'decor', subtitle: 'A twist of character' },
    { id: 'mushroom', name: 'Tiny mushrooms', category: 'decor', subtitle: 'A touch of woodland magic' }
  ];

  const fmt = value => Number(value.toFixed(2));
  const path = (d, fill, extra = '') => `<path d="${d.replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi, value => String(fmt(Number(value))))}" fill="${fill}" ${extra}/>`;
  const stroke = (d, color, width = 1, extra = '') => path(d, 'none', `stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}`);
  const ellipse = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${fmt(cx)}" cy="${fmt(cy)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${fill}" ${extra}/>`;
  function random(seed) {
    let state = 2166136261;
    for (const character of String(seed)) state = Math.imul(state ^ character.charCodeAt(0), 16777619);
    return function () {
      state += 0x6D2B79F5;
      let n = state;
      n = Math.imul(n ^ n >>> 15, n | 1);
      n ^= n + Math.imul(n ^ n >>> 7, n | 61);
      return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }
  function leaf(length, width, fill, highlight, veins = false) {
    let result = path(`M0 0 C${-width} ${-length * .2} ${-width * 1.1} ${-length * .7} 0 ${-length} C${width * 1.05} ${-length * .69} ${width} ${-length * .18} 0 0Z`, fill);
    result += path(`M0 0 C${-width * .67} ${-length * .23} ${-width * .69} ${-length * .71} 0 ${-length} C${-width * .14} ${-length * .62} ${-width * .08} ${-length * .27} 0 0Z`, highlight, 'opacity=".76"');
    result += stroke(`M0 -1 Q${-width * .08} ${-length * .54} 0 ${-length * .93}`, veins ? '#efb3ac' : '#bfd2a0', veins ? .8 : .5, `opacity="${veins ? .95 : .48}"`);
    if (veins) {
      for (let index = 1; index < 5; index++) {
        const y = -length * (.12 + index * .15);
        const edge = width * Math.sin(Math.PI * (-y / length)) * .76;
        result += stroke(`M0 ${y} Q${-edge * .6} ${y - 2} ${-edge} ${y - length * .11} M0 ${y} Q${edge * .6} ${y - 2} ${edge} ${y - length * .11}`, '#e8a19e', .6, 'opacity=".85"');
      }
    }
    return result;
  }
  function fern(rng) {
    const ends = [[-48,-75],[-42,-107],[-20,-128],[3,-139],[26,-123],[46,-98],[53,-63]];
    let result = ellipse(0,-1,28,4,'#1e3b27','opacity=".16"');
    ends.forEach(([endX, endY], frond) => {
      const ex = endX + (rng() - .5) * 5;
      const ey = endY + (rng() - .5) * 5;
      const c1 = [ex * .03, ey * .44];
      const c2 = [ex * .83, ey * .82];
      const point = t => {
        const u = 1 - t;
        return [3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*ex, 3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*ey];
      };
      const tangent = t => {
        const u = 1 - t;
        const dx = 3*u*u*c1[0]+6*u*t*(c2[0]-c1[0])+3*t*t*(ex-c2[0]);
        const dy = 3*u*u*c1[1]+6*u*t*(c2[1]-c1[1])+3*t*t*(ey-c2[1]);
        const mag = Math.hypot(dx,dy);
        return [dx/mag,dy/mag];
      };
      result += stroke(`M0 0 C${c1.join(' ')} ${c2.join(' ')} ${ex} ${ey}`, '#416b40', 1.35);
      for (let n = 0; n < 13; n++) {
        const t = .2+n*.059;
        const [x,y] = point(t);
        const [tx,ty] = tangent(t);
        const length = (4+15*Math.pow(Math.sin(Math.PI*t),.8)) * (frond===3 ? .84 : 1);
        [-1,1].forEach(side => {
          const vx = -ty*side+tx*.62;
          const vy = tx*side+ty*.62;
          const angle = Math.atan2(vy,vx)*180/Math.PI+90;
          const green = ['#386447','#477c4d','#4c8150','#578c55'][(n+frond)%4];
          result += `<g transform="translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(angle)})">${leaf(length,2.5+length*.06,green,'#88a965')}</g>`;
        });
      }
      result += `<g transform="translate(${fmt(ex)} ${fmt(ey+4)}) rotate(${fmt(Math.atan2(ex-c2[0],-(ey-c2[1]))*180/Math.PI)})">${leaf(8,2.1,'#649258','#9cba75')}</g>`;
    });
    return result;
  }
  function fittonia(rng) {
    let result = ellipse(0,-1,26,4,'#253b2b','opacity=".16"');
    const positions = [
      [-5,-39,-58,36,14], [9,-33,54,40,16], [-3,-59,-30,40,17],
      [6,-60,29,39,17], [-6,-26,-78,31,13], [5,-19,74,31,13],
      [0,-73,-9,39,17], [-3,-42,-18,34,15], [8,-44,45,33,15]
    ];
    result += stroke('M0 0 Q-7 -35 -1 -83 M-1 -21 Q-13 -37 -7 -58 M1 -18 Q13 -39 8 -61','#657347',2.1);
    positions.forEach(([x,y,angle,len,w],i) => {
      const jitter = (rng()-.5)*7;
      result += stroke(`M0 ${Math.min(y+20,-4)} Q${x*.6} ${y+9} ${x} ${y}`,'#6f7950',1.3);
      result += `<g transform="translate(${x} ${y}) rotate(${angle+jitter})">${leaf(len,w,i%3===0?'#315646':'#3d654c',i%3===0?'#6c8660':'#6f9464',true)}</g>`;
    });
    return result;
  }
  function monsteraLeaf(fill, light) {
    const outline = 'M0 -5 C-10 2 -21 -4 -30 -13 C-35 -18 -39 -22 -41 -29 L-14 -25 L-30 -36 L-44 -43 C-46 -50 -45 -57 -43 -64 L-13 -45 L-30 -65 L-38 -75 C-34 -86 -26 -94 -17 -99 C-7 -105 -2 -110 0 -112 C4 -106 12 -103 19 -97 C28 -91 36 -82 40 -72 L27 -65 L13 -45 L42 -61 C46 -51 44 -43 43 -40 L29 -34 L14 -24 L39 -29 C36 -19 29 -11 22 -6 C11 2 5 -1 0 -5Z';
    const holes = 'M-9 -83 C-16 -82 -17 -73 -13 -68 C-9 -66 -6 -75 -9 -83Z M9 -91 C4 -88 5 -78 9 -76 C14 -77 15 -87 9 -91Z M-7 -59 C-11 -59 -11 -51 -8 -47 C-3 -47 -3 -55 -7 -59Z M8 -64 C3 -60 4 -53 7 -52 C12 -52 13 -61 8 -64Z';
    return path(outline+' '+holes,fill,'fill-rule="evenodd"')
      + path('M0 -5 C-4 -37 -3 -86 0 -110 C3 -91 4 -63 3 -35 L0 -5Z',light,'opacity=".32"')
      + stroke('M0 -6 Q-2 -57 0 -107 M0 -27 Q-11 -37 -26 -39 M0 -48 Q-13 -60 -29 -69 M1 -24 Q15 -34 29 -35 M1 -49 Q17 -64 29 -68',light,1.2,'opacity=".62"');
  }
  function monstera(rng) {
    let result = ellipse(0,-1,26,4,'#183525','opacity=".14"');
    result += stroke('M0 0 Q-4 -31 -19 -41 M0 0 Q8 -31 19 -51 M0 0 Q-6 -29 -2 -58','#43694a',2.4);
    result += `<g transform="translate(-19 -39) rotate(${-35+(rng()-.5)*5}) scale(.62)">${monsteraLeaf('#386d4f','#9fbc72')}</g>`;
    result += `<g transform="translate(19 -49) rotate(${33+(rng()-.5)*5}) scale(.65)">${monsteraLeaf('#477d53','#c3cd8a')}</g>`;
    result += `<g transform="translate(-2 -55) rotate(${(rng()-.5)*7}) scale(.73)">${monsteraLeaf('#2f6248','#9cbb72')}</g>`;
    result += stroke('M0 0 Q4 -11 8 -16','#72915b',1.5);
    return result;
  }
  function moss(rng) {
    let result = ellipse(0,-1,52,5,'#31402b','opacity=".15"');
    result += path('M-52 0 C-59 -9 -49 -19 -41 -18 C-45 -30 -28 -34 -20 -27 C-13 -40 8 -39 15 -31 C29 -39 43 -27 40 -19 C53 -18 59 -5 50 0Z','#547047');
    result += path('M-51 -4 C-49 -18 -37 -17 -30 -15 C-34 -27 -14 -35 -6 -27 C3 -37 23 -29 22 -22 C39 -27 51 -17 48 -7 C30 1 -32 2 -51 -4Z','#78934f');
    result += path('M-42 -10 C-37 -20 -23 -24 -14 -18 C-7 -30 8 -29 16 -21 C30 -24 40 -17 41 -11 C18 -3 -22 -3 -42 -10Z','#92a55f','opacity=".75"');
    for (let i=0;i<68;i++) {
      const x = (rng()-.5)*93;
      const y = -8-rng()*(25*Math.sqrt(Math.max(0,1-(x/49)**2)));
      const height = 2.5+rng()*4;
      const shade = ['#bad083','#a5bd71','#627f42','#d0d693'][i%4];
      result += stroke(`M${fmt(x)} ${fmt(y+3)} Q${fmt(x-.4)} ${fmt(y-height*.25)} ${fmt(x+1)} ${fmt(y-height)} M${fmt(x)} ${fmt(y)} L${fmt(x-2.5)} ${fmt(y-2)} M${fmt(x+.3)} ${fmt(y-.5)} L${fmt(x+3)} ${fmt(y-3)}`,shade,.85,'opacity=".85"');
      result += ellipse(x+1,y-height,.75,1.2,shade);
    }
    return result;
  }
  function succulentPetal(cx,cy,x,y,width,fill,highlight) {
    const dx=x-cx,dy=y-cy,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
    const bx=cx+dx*.55,by=cy+dy*.55;
    const d=`M${cx} ${cy} Q${fmt(bx+nx*width)} ${fmt(by+ny*width)} ${x} ${y} Q${fmt(bx-nx*width)} ${fmt(by-ny*width)} ${cx} ${cy}Z`;
    return path(d,fill,'stroke="#47735d" stroke-width=".45"')
      +path(`M${cx} ${cy} Q${fmt(bx+nx*width*.62)} ${fmt(by+ny*width*.62)} ${x} ${y} Q${fmt(bx+nx*width*.1)} ${fmt(by+ny*width*.1)} ${cx} ${cy}Z`,highlight,'opacity=".72"')
      +stroke(`M${fmt(cx+dx*.25)} ${fmt(cy+dy*.25)} Q${fmt(bx)} ${fmt(by)} ${fmt(x-dx*.08)} ${fmt(y-dy*.08)}`,'#d7dfb9',.5,'opacity=".3"');
  }
  function succulent(rng) {
    let result=ellipse(0,-1,37,5,'#273e30','opacity=".16"');
    result+=ellipse(0,-14,37,14,'#43725f');
    const rings=[{count:11,r:53,cy:-30,w:16,colors:['#729985','#87aa92','#789d88']},{count:9,r:37,cy:-33,w:13,colors:['#8eae93','#a4bca1','#7e9f86']},{count:6,r:22,cy:-36,w:11,colors:['#a6bda1','#b8c9a9','#9ab594']}];
    rings.forEach((ring,k)=>{
      const petals=[];
      for(let i=0;i<ring.count;i++){
        const angle=(i/ring.count)*Math.PI*2+k*.33+.1;
        const x=Math.cos(angle)*ring.r;
        const y=ring.cy+Math.sin(angle)*ring.r*.59;
        petals.push({x,y,color:ring.colors[i%3]});
      }
      petals.sort((a,b)=>a.y-b.y);
      petals.forEach(({x,y,color})=>{
        result+=succulentPetal(0,ring.cy+7,fmt(x),fmt(y),ring.w,color,'#ced6b4');
      });
    });
    result+=path('M0 -30 C-10 -35 -7 -44 0 -49 C8 -45 10 -34 0 -30Z','#b8c9a8');
    result+=path('M0 -31 C-5 -36 -4 -41 0 -47 C2 -40 2 -35 0 -31Z','#e0dfba');
    return result;
  }
  function rock(rng) {
    let result=ellipse(0,-1,51,5,'#373729','opacity=".15"');
    result+=path('M-52 -5 L-46 -20 L-28 -29 L-12 -24 L-3 -11 L-10 -1 L-36 1Z','#888b80');
    result+=path('M-52 -5 L-46 -20 L-28 -29 L-22 -17 L-34 -10Z','#b4b5a2');
    result+=path('M-22 -17 L-12 -24 L-3 -11 L-10 -1 L-34 -10Z','#74796f');
    result+=path('M-28 -1 L-29 -21 L-20 -42 L1 -52 L23 -47 L36 -28 L32 -9 L18 1Z','#8b9185');
    result+=path('M-29 -21 L-20 -42 L1 -52 L23 -47 L16 -35 L-5 -30Z','#bdc0a9');
    result+=path('M-5 -30 L16 -35 L23 -47 L36 -28 L32 -9 L18 1 L14 -18Z','#6f7b73');
    result+=path('M-5 -30 L14 -18 L18 1 L-28 -1 L-29 -21Z','#989e8d');
    result+=path('M16 1 L20 -15 L34 -24 L48 -18 L54 -6 L42 2Z','#a3a293');
    result+=path('M20 -15 L34 -24 L48 -18 L36 -10 L17 -2Z','#cbc7af');
    result+=path('M36 -10 L48 -18 L54 -6 L42 2 L17 -2Z','#898f81');
    result+=stroke('M-17 -35 L-8 -34 L-1 -37 M3 -45 L13 -42 M26 -24 L22 -14 M-43 -17 L-34 -20','#d4d2bb',.8,'opacity=".5"');
    for(let i=0;i<19;i++){
      const x=(rng()-.5)*38,y=-6-rng()*31;
      result+=ellipse(x,y,.5+rng(),.4+rng()*.6,i%2?'#68736a':'#d3d1b6','opacity=".54"');
    }
    return result;
  }
  function driftwood(rng) {
    let result=ellipse(2,-1,42,4,'#4d3c29','opacity=".14"');
    result+=path('M-38 0 C-39 -10 -28 -21 -13 -32 C-10 -40 -14 -52 -20 -62 C-23 -68 -21 -73 -18 -75 C-10 -68 -5 -56 -3 -47 C1 -60 8 -72 18 -80 L27 -86 L31 -83 C20 -72 11 -58 9 -45 C17 -52 32 -53 42 -48 L50 -40 L46 -35 C33 -42 20 -42 9 -34 C0 -27 -2 -16 4 -9 L18 -4 L23 0Z','#81735d');
    result+=path('M-36 0 C-31 -11 -21 -19 -6 -30 C0 -37 -1 -43 4 -57 C9 -67 20 -77 28 -82 L30 -82 C15 -65 8 -49 8 -34 C-3 -26 -9 -14 -4 -3Z','#aa9472');
    result+=path('M-17 -70 C-10 -59 -8 -46 -9 -35 L-5 -31 C-3 -42 -6 -56 -13 -66Z','#b9a17b');
    result+=path('M9 -36 C19 -44 34 -48 47 -39 L45 -37 C28 -41 17 -39 9 -32Z','#baa582');
    result+=path('M-23 -2 C-20 -13 -10 -21 1 -29 C-2 -17 -1 -8 8 -4 L17 -1Z','#665d4f');
    result+=stroke('M-30 -2 C-24 -17 -5 -22 1 -42 C7 -61 17 -71 24 -77 M-25 -3 C-21 -11 -11 -17 -8 -21 M-13 -61 Q-9 -47 -12 -38 M16 -37 Q29 -45 42 -39','#d0b78c',1.1,'opacity=".72"');
    result+=stroke('M-29 -10 Q-12 -23 -9 -30 M-9 -3 Q-14 -8 -10 -13 M8 -50 Q10 -64 19 -71 M21 -43 L31 -45 M-16 -63 L-13 -58','#5b574b',1,'opacity=".7"');
    result+=ellipse(-7,-26,3.1,5.3,'#665d4c','transform="rotate(28 -7 -26)"');
    result+=ellipse(-7,-26,1.3,3,'#c0a780','transform="rotate(28 -7 -26)"');
    result+=path('M-35 -1 C-32 -8 -26 -7 -23 -4 C-20 -10 -10 -7 -9 -1Z','#647c49');
    for(let i=0;i<10;i++)result+=stroke(`M${-32+i*2.3} -1 l${fmt((rng()-.5)*3)} ${fmt(-2-rng()*3)}`,'#99a969',.9);
    return result;
  }
  function mushroomOne(x,y,scale,fill,capLight,spots) {
    let result=path('M-5 0 C-7 -18 -4 -37 -5 -54 C-3 -59 6 -59 7 -54 C8 -37 3 -20 8 -3 C5 2 -1 3 -5 0Z','#d8cfab');
    result+=path('M1 0 C-1 -16 3 -39 1 -55 L6 -54 C8 -36 3 -20 8 -3Z','#afa78c','opacity=".72"');
    result+=stroke('M-2 -6 Q-3 -25 0 -43','#eee3c2',1.2,'opacity=".7"');
    result+=ellipse(1,-56,29,6.4,'#b0a187');
    for(let i=-5;i<=5;i++)result+=stroke(`M0 -55 Q${i*2} -54 ${i*4.8} -56`,'#847763',.7,'opacity=".65"');
    result+=path('M-31 -58 C-26 -66 -19 -90 -1 -94 C18 -95 29 -75 34 -59 C19 -52 -12 -52 -31 -58Z',fill);
    result+=path('M-27 -61 C-21 -73 -13 -88 -1 -90 C10 -93 21 -78 25 -68 C8 -71 -11 -71 -27 -61Z',capLight,'opacity=".6"');
    result+=stroke('M-27 -58 Q-1 -52 30 -59','#f4dfb1',1.1,'opacity=".8"');
    if(spots){
      [[-13,-76,3.2,2],[1,-86,3.3,2.1],[13,-77,3.9,2.3],[-18,-64,2.9,1.6],[0,-68,4,2.4],[23,-65,2,1.7]].forEach(([px,py,rx,ry])=>result+=ellipse(px,py,rx,ry,'#e8dbc0','opacity=".93"'));
    } else {
      result+=stroke('M-18 -64 Q-15 -75 -8 -82 M-9 -63 Q-6 -73 -2 -76 M12 -65 Q11 -71 8 -75','#dcc694',.6,'opacity=".38"');
    }
    return `<g transform="translate(${x} ${y}) scale(${scale})">${result}</g>`;
  }
  function mushroom(rng) {
    let result=ellipse(0,-1,35,4,'#4c3927','opacity=".13"');
    result+=mushroomOne(19,-1,.57,'#b29353','#d8bb74',false);
    result+=mushroomOne(-9,-1,.94,'#b87555','#d49b73',true);
    result+=mushroomOne(-31,0,.36,'#c1a069','#e1c287',false);
    result+=stroke('M6 -1 Q11 -6 12 -9 M9 -1 Q15 -3 18 -2 M-21 -1 L-24 -6','#728452',1.5);
    return result;
  }
  const renderers={fern,fittonia,monstera,moss,succulent,rock,driftwood,mushroom};
  window.TerrariumArt={
    definitions:'',
    items,
    renderItem(type,seed=1){
      const render=renderers[type];
      return render ? `<g class="botanical-art" stroke-linejoin="round">${render(random(`${type}:${seed}`))}</g>` : '';
    }
  };
}());
