(function () {
  'use strict';
  const Art = window.TerrariumArt;
  const $ = id => document.getElementById(id);
  const svg = $('terrarium');
  const storageKey = 'glasshouse-terrarium-v1';
  const copy = value => JSON.parse(JSON.stringify(value));
  const clamp = (n, low, high) => Math.max(low, Math.min(high, Number(n)));
  const escape = str => String(str).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
  const itemInfo = type => Art.items.find(item => item.id === type);
  const backgrounds = {
    sand: { outer:'#eeeadd', top:'#f5f2e5', bottom:'#e4e1ce', ink:'#66745a' },
    sage: { outer:'#e1e8dc', top:'#eef3e6', bottom:'#cdddc8', ink:'#50654b' },
    rose: { outer:'#eee0d8', top:'#f8ece3', bottom:'#e0cbbb', ink:'#7b6e59' },
    night:{ outer:'#263d35', top:'#476054', bottom:'#243d34', ink:'#becfb4' }
  };
  const shapes = {
    round: 'M290 103H470V148C565 178 636 260 628 358C618 493 547 556 380 556C213 556 142 493 132 358C124 260 195 178 290 148Z',
    jar: 'M239 113H521V153C558 171 574 191 574 227V501Q574 558 516 562H244Q186 558 186 501V227Q186 185 239 153Z',
    geometric: 'M285 106H475L606 235L579 469L480 558H280L181 469L154 235Z'
  };
  function makePiece(type, x, offset, scale, seed) {
    return {id:seed,type,x,offset,scale,flip:false,seed};
  }
  const presets = [
    {id:'woodland',name:'Woodland escape',description:'Lush greens & a mossy floor',bg:'sand',vessel:'round',light:60,moisture:65,lid:true,soil:50,
      pieces:[makePiece('driftwood',399,-19,1.8,11),makePiece('fern',284,-12,1.8,12),makePiece('monstera',407,-15,1.65,13),makePiece('fittonia',487,12,1.35,14),makePiece('moss',261,24,1.45,15),makePiece('rock',409,26,1.15,16),makePiece('moss',494,28,1.25,17),makePiece('mushroom',339,19,1,18)]},
    {id:'desert',name:'Desert daydream',description:'Warm stone & sculptural greens',bg:'rose',vessel:'geometric',light:75,moisture:20,lid:false,soil:35,
      pieces:[makePiece('rock',452,-22,1.7,21),makePiece('driftwood',340,-17,1.5,22),makePiece('succulent',298,0,1.75,23),makePiece('succulent',435,17,1.2,24),makePiece('rock',334,27,.85,25),makePiece('succulent',503,10,.8,26)]},
    {id:'garden',name:'Secret garden',description:'Tiny mushrooms & soft pink veins',bg:'sage',vessel:'jar',light:55,moisture:70,lid:true,soil:60,
      pieces:[makePiece('fern',348,-26,1.65,31),makePiece('fittonia',460,-14,1.3,32),makePiece('driftwood',330,3,1.3,33),makePiece('moss',280,22,1.5,34),makePiece('moss',429,30,1.6,35),makePiece('mushroom',377,27,1.5,36),makePiece('rock',488,29,.7,37)]}
  ];
  const defaultState = () => ({version:1,name:'My woodland escape',vessel:'round',bg:'sand',light:60,moisture:65,lid:true,soil:50,pieces:copy(presets[0].pieces)});
  function validateState(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.pieces)) return null;
    const result = defaultState();
    result.name = typeof value.name === 'string' ? value.name.slice(0,48) : result.name;
    result.vessel = Object.hasOwn(shapes,value.vessel) ? value.vessel : 'round';
    result.bg = Object.hasOwn(backgrounds,value.bg) ? value.bg : 'sand';
    ['light','moisture','soil'].forEach(key => result[key] = Number.isFinite(value[key]) ? clamp(value[key],0,100) : result[key]);
    result.lid = typeof value.lid === 'boolean' ? value.lid : true;
    const seen = new Set();
    result.pieces = value.pieces.slice(0,40).filter(piece => {
      if (!piece || !itemInfo(piece.type) || ![piece.id,piece.x,piece.offset,piece.scale,piece.seed].every(Number.isFinite) || !Number.isSafeInteger(piece.id) || !Number.isSafeInteger(piece.seed) || piece.id>1e9 || seen.has(piece.id)) return false;
      seen.add(piece.id);return true;
    }).map(piece => ({id:piece.id,type:piece.type,x:clamp(piece.x,200,560),offset:clamp(piece.offset,-36,32),scale:clamp(piece.scale,.6,2.1),flip:!!piece.flip,seed:piece.seed}));
    return result;
  }
  let state = defaultState();
  let storageOK = true;
  try { const raw=localStorage.getItem(storageKey);if(raw)state=validateState(JSON.parse(raw))||state; } catch { storageOK=false; }
  let selected = null, category = 'plants', nextId = Math.max(100,...state.pieces.map(p=>p.id))+1;
  let undoStack = [], redoStack = [], drag = null, toastTimer, pendingSlider=null;
  let latestName=state.name;
  const ground = () => 432 - (state.soil-50)*.36;
  const limits = () => state.vessel==='jar' ? [247,513] : state.vessel==='geometric' ? [221,539] : [205,555];
  function constrainPieces() {
    const [low,high]=limits();state.pieces.forEach(piece=>piece.x=clamp(piece.x,low,high));
  }
  function remember(before) {
    const snapshot = typeof before==='string' ? before : JSON.stringify(before || state);
    if (snapshot===JSON.stringify(state) && before) return;
    undoStack.push(snapshot);if(undoStack.length>70)undoStack.shift();redoStack=[];
    updateHistory();
  }
  function change(action, message) {
    const before=JSON.stringify(state);action();if(before!==JSON.stringify(state))remember(before);
    render();save();if(message)toast(message);
  }
  function save() {
    try {localStorage.setItem(storageKey,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}
    $('save-status-text').textContent=storageOK?'Saved on this device':'Saving unavailable in this browser';
  }
  function updateHistory() {$('undo-button').disabled=!undoStack.length;$('redo-button').disabled=!redoStack.length;}
  function undo() {
    if(!undoStack.length)return;finishSlider();redoStack.push(JSON.stringify(state));state=JSON.parse(undoStack.pop());selected=null;render();save();toast('One step back.');
  }
  function redo() {
    if(!redoStack.length)return;undoStack.push(JSON.stringify(state));state=JSON.parse(redoStack.pop());selected=null;render();save();toast('One step forward.');
  }
  function toast(message) {
    clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2600);
  }
  function random(seed) {let t=seed>>>0;return()=>{t=(Math.imul(t,1664525)+1013904223)>>>0;return t/4294967296;};}
  function defs() {
    const bg=backgrounds[state.bg];
    return `<defs><clipPath id="vessel-clip"><path d="${shapes[state.vessel]}"/></clipPath>
      <linearGradient id="glass-fill" x1="0" x2="1"><stop stop-color="#f6fff3" stop-opacity=".23"/><stop offset=".35" stop-color="#d8e8c9" stop-opacity=".04"/><stop offset=".75" stop-color="#abc39f" stop-opacity=".08"/><stop offset="1" stop-color="#fafff2" stop-opacity=".32"/></linearGradient>
      <linearGradient id="glass-edge"><stop stop-color="#fff" stop-opacity=".83"/><stop offset=".32" stop-color="#a1b294" stop-opacity=".42"/><stop offset=".7" stop-color="#ecf4df" stop-opacity=".66"/><stop offset="1" stop-color="#fafff5" stop-opacity=".9"/></linearGradient>
      <linearGradient id="soil-gradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${state.moisture>75?'#55482f':'#796043'}"/><stop offset="1" stop-color="#4e3d29"/></linearGradient>
      <linearGradient id="cork" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#baa27c"/><stop offset=".24" stop-color="#bea883"/><stop offset="1" stop-color="#977b55"/></linearGradient>
      <radialGradient id="backdrop"><stop stop-color="${bg.top}"/><stop offset="1" stop-color="${bg.bottom}"/></radialGradient>
      <radialGradient id="shadow"><stop stop-color="#26381d" stop-opacity=".24"/><stop offset="1" stop-color="#26381d" stop-opacity="0"/></radialGradient>
      <pattern id="soil-grain" width="37" height="29" patternUnits="userSpaceOnUse"><circle cx="6" cy="5" r="1.5" fill="#b79b6d" opacity=".4"/><circle cx="23" cy="19" r="2" fill="#2b3221" opacity=".42"/><circle cx="33" cy="3" r="1" fill="#bba174" opacity=".25"/><path d="m11 22 4-2m12-9 3 2" stroke="#3c3725" stroke-width="2" opacity=".45"/></pattern>${Art.definitions||''}</defs>`;
  }
  function substrate() {
    const y=ground();const rng=random(770);let pebbles='';
    for(let i=0;i<200;i++){const x=130+rng()*500,py=511+rng()*55,rx=3+rng()*8,ry=3+rng()*4;pebbles+=`<ellipse cx="${x.toFixed(1)}" cy="${py.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${Math.round(rng()*60-30)} ${x.toFixed(1)} ${py.toFixed(1)})" fill="${['#c7bca2','#a29a81','#ddd1b6','#8f8975','#b6ab90'][i%5]}" stroke="#8f876d" stroke-width=".6"/>`;}
    const ridge=`M120 ${y+10}Q195 ${y-19} 265 ${y-8}T430 ${y-5}T640 ${y+9}V512H120Z`;
    return `<rect x="120" y="509" width="520" height="65" fill="#9d967e"/>${pebbles}<path d="M120 499Q310 508 450 501T650 500V516H120Z" fill="#3e4337"/><path d="${ridge}" fill="url(#soil-gradient)"/><path d="${ridge}" fill="url(#soil-grain)"/>
      <path d="M123 ${y+10}Q195 ${y-19} 265 ${y-8}T430 ${y-5}T640 ${y+9}" stroke="${state.moisture<35?'#a5a576':'#7f9152'}" stroke-width="8" fill="none"/><path d="M127 ${y+9}Q195 ${y-16} 265 ${y-7}T430 ${y-4}T635 ${y+8}" stroke="${state.moisture<35?'#b4b289':'#a0ae71'}" stroke-width="3" fill="none" opacity=".65"/>`;
  }
  function pieceMarkup(piece, interactive) {
    const name=itemInfo(piece.type).name;
    const y=ground()+piece.offset;
    const ring=interactive?`<ellipse class="selection-ring" cx="0" cy="-37" rx="63" ry="68" fill="#fff" fill-opacity=".2" stroke="#7e9c64" opacity="${piece.id===selected?1:0}"/>`:'';
    return `<g data-id="${piece.id}" class="piece${piece.id===selected?' is-selected':''}${drag&&drag.id===piece.id?' dragging':''}" transform="translate(${piece.x} ${y}) scale(${piece.flip?-piece.scale:piece.scale} ${piece.scale})" ${interactive?`tabindex="0" role="button" aria-label="${escape(name)}. Drag to move, or use the arrow keys."`:''}>${ring}${Art.renderItem(piece.type,piece.seed)}</g>`;
  }
  function glassDetails() {
    const common=`<path d="${shapes[state.vessel]}" fill="none" stroke="url(#glass-edge)" stroke-width="3.5"/><path d="${shapes[state.vessel]}" fill="none" stroke="#768c69" stroke-opacity=".24" stroke-width="1"/>`;
    if(state.vessel==='round')return common+`<path d="M208 205C159 255 146 308 157 375" fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round" opacity=".28"/><path d="M191 226C155 278 154 324 159 345" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".62"/><path d="M571 250C611 326 594 428 554 474" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".23"/><path d="M296 111H464M293 142H467" stroke="#e8eed8" stroke-width="4" opacity=".8"/><ellipse cx="380" cy="552" rx="123" ry="4" fill="#e3ead8" opacity=".4"/>`;
    if(state.vessel==='jar')return common+`<path d="M205 217V449" stroke="#fff" stroke-width="13" opacity=".22" stroke-linecap="round"/><path d="M205 217V382" stroke="#fff" stroke-width="3" opacity=".61" stroke-linecap="round"/><path d="M554 233V481" stroke="#fff" stroke-width="7" opacity=".19" stroke-linecap="round"/><path d="M244 123H516M240 145H520" stroke="#e7ecd7" stroke-width="4" opacity=".7"/>`;
    return common+`<path d="M285 106 280 558M475 106 480 558M154 235H606M181 469 380 235 579 469M280 558 380 235 480 558" stroke="#b9c3a9" stroke-width="2" opacity=".45" fill="none"/><path d="M286 113 167 237 191 457" fill="none" stroke="#fff" stroke-width="5" opacity=".23"/>`;
  }
  function lidMarkup() {
    if(!state.lid)return'';
    const x=state.vessel==='jar'?232:state.vessel==='round'?281:280;
    const width=state.vessel==='jar'?296:state.vessel==='round'?198:200;
    const y=state.vessel==='jar'?94:87;
    let grain='';const rng=random(45);for(let i=0;i<90;i++)grain+=`<ellipse cx="${(x+4+rng()*(width-8)).toFixed(1)}" cy="${(y+2+rng()*30).toFixed(1)}" rx="${(1+rng()*2.2).toFixed(1)}" ry=".8" fill="${i%2?'#786747':'#d9c49b'}" opacity=".32"/>`;
    return `<g><rect x="${x}" y="${y}" width="${width}" height="33" rx="6" fill="url(#cork)" stroke="#a68a61" stroke-width="1"/>${grain}<ellipse cx="${x+width/2}" cy="${y+2}" rx="${width/2-3}" ry="5" fill="#c4b18e"/><path d="M${x+9} ${y+5}H${x+width-9}" stroke="#e0ceb0" stroke-opacity=".65" stroke-width="1.3"/></g>`;
  }
  function renderSVG(interactive) {
    const sorted=state.pieces.slice().sort((a,b)=>a.offset-b.offset||a.id-b.id);
    let condensation='';
    if(state.lid&&state.moisture>72){const rng=random(908);for(let i=0;i<36;i++){const x=175+rng()*420,y=170+rng()*265;condensation+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(1+rng()*2).toFixed(1)}" ry="${(2+rng()*4).toFixed(1)}" fill="#f8fff2" opacity="${((state.moisture-70)*.012).toFixed(2)}"/>`;}}
    return `${defs()}<ellipse cx="380" cy="574" rx="220" ry="25" fill="url(#shadow)"/><path d="${shapes[state.vessel]}" fill="url(#glass-fill)"/><g clip-path="url(#vessel-clip)">${substrate()}${sorted.map(p=>pieceMarkup(p,interactive)).join('')}<g class="glass-highlight" pointer-events="none">${condensation}</g></g><g class="glass-highlight" pointer-events="none">${glassDetails()}${lidMarkup()}</g>`;
  }
  function renderScene() {
    svg.innerHTML=renderSVG(true);
    const bg=backgrounds[state.bg];$('scene').style.background=`radial-gradient(ellipse at 45% 28%,${bg.top},${bg.bottom})`;$('scene').dataset.background=state.bg;
    const n=state.pieces.length;$('piece-count').textContent=`${n} ${n===1?'piece':'pieces'}, one little world`;
    $('empty-prompt').hidden=!!n;
    svg.setAttribute('aria-label',`${state.name||'My terrarium'}, with ${n} pieces. Select and drag a piece to arrange it.`);
  }
  function renderCatalog() {
    const items=Art.items.filter(i=>category==='plants'?i.category==='plants':i.category!=='plants');
    $('catalog').innerHTML=items.map(item=>`<button class="item-card" data-type="${item.id}" aria-label="Add ${escape(item.name)}"><svg class="item-art" viewBox="-76 -160 152 172" aria-hidden="true">${Art.renderItem(item.id,77)}</svg><h3>${escape(item.name)}</h3><p>${escape(item.subtitle)}</p><span class="add-symbol"><svg><use href="#i-plus"/></svg></span></button>`).join('');
    $('catalog').setAttribute('aria-labelledby',category==='plants'?'plants-tab':'landscape-tab');
  }
  function sliderFill(input) {const n=(input.value-input.min)/(input.max-input.min)*100;input.style.background=`linear-gradient(to right,#8d9f73 ${n}%,#e6e9dd ${n}%)`;}
  function renderCare() {
    const hasDry=state.pieces.some(p=>p.type==='succulent');
    const hasMoist=state.pieces.some(p=>['fern','fittonia','monstera','moss'].includes(p.type));
    let title='Happy little habitat',message='Moisture-loving plants pair well with indirect light and a closed glass world.',warning=false;
    if(!hasDry&&!hasMoist){title='Room to grow';message='Add some greenery to bring your little landscape to life.';}
    else if(hasDry&&hasMoist){title='Different growing needs';message='Succulents prefer drier air than ferns and moss. Try keeping them in separate little worlds.';warning=true;}
    else if(hasDry&&(state.lid||state.moisture>40)){title='A little too cozy';message='Succulents suit an open vessel and a dry setting. Try opening the lid and lowering moisture.';warning=true;}
    else if(hasDry&&state.light<50){title='Let a little light in';message='Your succulent scene would suit a brighter spot. Move the light slider toward sunny.';warning=true;}
    else if(hasDry){title='A lovely desert day';message='An open vessel, low moisture, and bright light make a fitting home for your sculptural greens.';}
    else if(state.moisture>85){title='Less is a little more';message='Moist soil is lovely; waterlogged soil is not. Ease the moisture down for your woodland scene.';warning=true;}
    else if(state.moisture<40){title='A little more moisture';message='Ferns and moss suit a moist setting. Try bringing the moisture slider closer to the middle.';warning=true;}
    else if(state.light>83){title='Soften the sunshine';message='Closed terrariums suit bright, indirect light. Strong direct sun can make glass worlds too warm.';warning=true;}
    else if(state.light<25){title='A brighter corner';message='Your little woodland would suit more indirect light. Try a brighter setting.';warning=true;}
    else if(!state.lid){title='An airy little woodland';message='An open vessel loses moisture more easily. Keep an eye on the soil in a real terrarium.';}
    $('habitat-title').textContent=title;$('habitat-message').textContent=message;$('habitat-card').classList.toggle('warning',warning);
    $('habitat-icon').innerHTML=warning?'<svg><use href="#i-leaf"/></svg>':'<svg><use href="#i-check"/></svg>';
  }
  function renderSelection() {
    const piece=state.pieces.find(p=>p.id===selected);$('selection-editor').hidden=!piece;$('studio-tip').hidden=!!piece;
    if(piece){$('selected-name').textContent=itemInfo(piece.type).name.replace('Woodland ','').replace('Cushion ','').replace('Sage ','').replace('Mini ','').replace('River ','').replace('Tiny ','');$('size-slider').value=Math.round(piece.scale*100);$('size-value').textContent=`${Math.round(piece.scale*100)}%`;sliderFill($('size-slider'));}
  }
  function render() {
    constrainPieces();renderScene();renderSelection();renderCare();updateHistory();
    if(document.activeElement!==$('design-name'))$('design-name').value=state.name;
    ['light','moisture','soil'].forEach(key=>{$(`${key}-slider`).value=state[key];sliderFill($(`${key}-slider`));});
    $('light-value').textContent=state.light<25?'Shady':state.light>83?'Direct sun':state.light<45?'Soft light':'Indirect';
    if(state.pieces.some(p=>p.type==='succulent')&&!state.pieces.some(p=>['fern','fittonia','monstera','moss'].includes(p.type))&&state.light>=50)$('light-value').textContent='Bright';
    $('moisture-value').textContent=state.moisture<35?'Dry':state.moisture>75?'Humid':'Moist';$('soil-value').textContent=state.soil<30?'Shallow':state.soil>70?'Deep':'Medium';
    $('lid-toggle').classList.toggle('on',state.lid);$('lid-toggle').setAttribute('aria-checked',state.lid);
    document.querySelectorAll('[data-vessel]').forEach(button=>{const on=button.dataset.vessel===state.vessel;button.classList.toggle('active',on);button.setAttribute('aria-pressed',on);});
    document.querySelectorAll('[data-bg]').forEach(button=>{const on=button.dataset.bg===state.bg;button.classList.toggle('active',on);button.setAttribute('aria-pressed',on);});
    $('save-status-text').textContent=storageOK?'Saved on this device':'Saving unavailable in this browser';
  }
  function addPiece(type) {
    if(state.pieces.length>=40){toast('This little world has room for 40 pieces.');return;}
    const [low,high]=limits();const id=nextId++;
    change(()=>{const piece=makePiece(type,clamp(280+(state.pieces.length*73)%220,low,high),-10+(state.pieces.length*13)%38,['moss','rock','mushroom'].includes(type)?1.15:1.4,id);state.pieces.push(piece);selected=id;},`${itemInfo(type).name} planted.`);
  }
  function removeSelected() {
    if(selected===null)return;change(()=>{state.pieces=state.pieces.filter(p=>p.id!==selected);selected=null;},'A little room to grow.');
  }
  function point(event) {
    const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());
  }
  svg.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;finishSlider();const target=event.target.closest('[data-id]');
    if(!target){selected=null;renderScene();renderSelection();return;}
    const id=Number(target.dataset.id),piece=state.pieces.find(p=>p.id===id);if(!piece)return;
    const p=point(event);selected=id;drag={id,pointer:event.pointerId,startX:p.x,startY:p.y,x:piece.x,offset:piece.offset,before:JSON.stringify(state),moved:false};
    svg.setPointerCapture(event.pointerId);svg.focus({preventScroll:true});event.preventDefault();renderScene();renderSelection();
  });
  svg.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.pointer)return;const p=point(event);const dx=p.x-drag.startX,dy=p.y-drag.startY;
    if(Math.abs(dx)+Math.abs(dy)>2)drag.moved=true;
    const piece=state.pieces.find(p=>p.id===drag.id);if(!piece)return;
    const [low,high]=limits();piece.x=clamp(drag.x+dx,low,high);piece.offset=clamp(drag.offset+dy,-36,32);
    const group=svg.querySelector(`[data-id="${piece.id}"]`);
    if(group)group.setAttribute('transform',`translate(${piece.x} ${ground()+piece.offset}) scale(${piece.flip?-piece.scale:piece.scale} ${piece.scale})`);
  });
  function finishDrag(event) {
    if(!drag||(event&&event.pointerId!==drag.pointer))return;const current=drag;drag=null;
    if(svg.hasPointerCapture(current.pointer))svg.releasePointerCapture(current.pointer);
    if(current.moved){remember(current.before);save();}renderScene();renderSelection();updateHistory();
  }
  svg.addEventListener('pointerup',finishDrag);svg.addEventListener('pointercancel',finishDrag);svg.addEventListener('lostpointercapture',finishDrag);
  svg.addEventListener('focusin',event=>{const target=event.target.closest('[data-id]');if(target){selected=Number(target.dataset.id);renderSelection();}});
  svg.addEventListener('keydown',event=>{
    const piece=state.pieces.find(p=>p.id===selected);if(!piece)return;
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      event.preventDefault();const step=event.shiftKey?12:4;change(()=>{if(event.key==='ArrowLeft')piece.x-=step;if(event.key==='ArrowRight')piece.x+=step;if(event.key==='ArrowUp')piece.offset=clamp(piece.offset-step,-36,32);if(event.key==='ArrowDown')piece.offset=clamp(piece.offset+step,-36,32);constrainPieces();});svg.focus({preventScroll:true});
    }
  });
  $('catalog').addEventListener('click',event=>{const card=event.target.closest('[data-type]');if(card)addPiece(card.dataset.type);});
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
    category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(b=>{const on=b===button;b.classList.toggle('active',on);b.setAttribute('aria-selected',on);});renderCatalog();
  }));
  document.querySelectorAll('[data-vessel]').forEach(button=>button.addEventListener('click',()=>change(()=>state.vessel=button.dataset.vessel)));
  document.querySelectorAll('[data-bg]').forEach(button=>button.addEventListener('click',()=>change(()=>state.bg=button.dataset.bg)));
  $('lid-toggle').addEventListener('click',()=>change(()=>state.lid=!state.lid));
  function finishSlider() {
    if(!pendingSlider)return;remember(pendingSlider);pendingSlider=null;save();updateHistory();
  }
  ['light','moisture','soil','size'].forEach(key=>{
    const input=$(`${key}-slider`);
    input.addEventListener('input',()=>{
      if(!pendingSlider)pendingSlider=JSON.stringify(state);
      if(key==='size'){const piece=state.pieces.find(p=>p.id===selected);if(piece)piece.scale=Number(input.value)/100;}
      else state[key]=Number(input.value);
      render();
    });
    input.addEventListener('change',finishSlider);input.addEventListener('blur',finishSlider);
  });
  $('design-name').addEventListener('focus',()=>latestName=state.name);
  $('design-name').addEventListener('input',()=>{state.name=$('design-name').value;save();});
  $('design-name').addEventListener('change',()=>{if(state.name!==latestName){const before=copy(state);before.name=latestName;remember(before);latestName=state.name;}save();});
  $('undo-button').addEventListener('click',undo);$('redo-button').addEventListener('click',redo);
  $('flip-button').addEventListener('click',()=>change(()=>{const piece=state.pieces.find(p=>p.id===selected);if(piece)piece.flip=!piece.flip;}));
  $('delete-button').addEventListener('click',removeSelected);
  $('deselect-button').addEventListener('click',()=>{selected=null;renderScene();renderSelection();});
  $('reset-button').addEventListener('click',()=>change(()=>{state={...defaultState(),name:'My little world',pieces:[]};selected=null;},'A blank canvas. A new little world.'));
  document.addEventListener('keydown',event=>{
    if(event.target.matches('input,textarea,[contenteditable]'))return;
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();redo();}
    if((event.key==='Delete'||event.key==='Backspace')&&selected!==null&&!document.querySelector('dialog[open]')){event.preventDefault();removeSelected();}
    if(event.key==='Escape'){selected=null;renderScene();renderSelection();}
  });
  function showDialog(id) {const dialog=$(id);if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
  function closeDialog(dialog) {if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}
  $('guide-button').addEventListener('click',()=>showDialog('guide-dialog'));$('guide-done').addEventListener('click',()=>closeDialog($('guide-dialog')));
  $('presets-button').addEventListener('click',()=>showDialog('presets-dialog'));
  document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>closeDialog(button.closest('dialog'))));
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog);}));
  $('preset-cards').innerHTML=presets.map(preset=>`<button class="preset-card" data-preset="${preset.id}"><svg class="preset-art" viewBox="160 150 440 420" aria-hidden="true"><ellipse cx="380" cy="534" rx="200" ry="17" fill="#a7af92" opacity=".25"/><path d="M200 452Q380 408 560 452V524H200Z" fill="#809565"/>${preset.pieces.map(p=>`<g transform="translate(${p.x} ${455+p.offset}) scale(${p.scale})">${Art.renderItem(p.type,p.seed)}</g>`).join('')}</svg><h3>${preset.name}</h3><p>${preset.description}</p></button>`).join('');
  $('preset-cards').addEventListener('click',event=>{
    const button=event.target.closest('[data-preset]');if(!button)return;const preset=presets.find(p=>p.id===button.dataset.preset);
    change(()=>{state={version:1,name:`My ${preset.name.toLowerCase()}`,vessel:preset.vessel,bg:preset.bg,light:preset.light,moisture:preset.moisture,lid:preset.lid,soil:preset.soil,pieces:copy(preset.pieces).map(p=>({...p,id:nextId++,seed:nextId}))};selected=null;},'A new little world, ready for you.');closeDialog($('presets-dialog'));
  });
  function download(blob,extension) {
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=(state.name.trim()||'My terrarium').replace(/[^a-z0-9 _-]/gi,'').slice(0,48)+'.'+extension;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  $('export-button').addEventListener('click',async()=>{
    const button=$('export-button');button.disabled=true;
    try{
      const bg=backgrounds[state.bg];
      const markup=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 760 690" width="1520" height="1380"><rect width="760" height="690" fill="${bg.outer}"/><rect width="760" height="650" fill="url(#backdrop)"/>${renderSVG(false)}<text x="380" y="631" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="${bg.ink}">${escape(state.name||'My little world')}</text><text x="380" y="661" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" letter-spacing="3" fill="${bg.ink}" opacity=".65">GLASSHOUSE · YOUR OWN LITTLE WORLD</text></svg>`;
      const blob=new Blob([markup],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob);
      try{
        const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
        const canvas=document.createElement('canvas');canvas.width=1520;canvas.height=1380;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas not available');ctx.drawImage(image,0,0);
        const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!png)throw new Error('Export unavailable');download(png,'png');toast('Your little world, ready to keep.');
      }catch{download(blob,'svg');toast('Saved as a crisp SVG image.');}finally{URL.revokeObjectURL(url);}
    }catch{toast('Image export is unavailable. Your design is still saved here.');}finally{button.disabled=false;}
  });
  window.addEventListener('pagehide',save);
  renderCatalog();render();save();
})();
