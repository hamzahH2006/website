const samples = {
 purchase: 'شراء عبر نقاط البيع\nبطاقة: **4521\nمبلغ: SAR 24.00\nلدى: HALF MILLION\nفي: 12-10-2026 09:41',
 salary: 'حوالة واردة محلية\nحساب: **7823\nمبلغ: SAR 12,000.00\nمن: الراتب الشهري\nفي: 12-10-2026 08:00',
 subscription: 'شراء عبر الإنترنت\nبطاقة: **4521\nمبلغ: SAR 39.00\nلدى: NETFLIX\nفي: 12-10-2026 10:15'
};
// Demo templates, not a claim of support for every production bank SMS format.
function parseSMS(message) {
 const amount = message.match(/مبلغ:\s*SAR\s*([\d,]+(?:\.\d+)?)/);
 const account = message.match(/(?:بطاقة|حساب):\s*\*\*(\d{4})/);
 const merchant = message.match(/(?:لدى|من):\s*([^\n]+)/);
 if (!amount || !account || !merchant) throw new Error('لم نتمكن من قراءة تفاصيل هذه الرسالة.');
 const incoming = message.includes('حوالة واردة');
 const recurring = /NETFLIX/i.test(merchant[1]);
 return {amount: Number(amount[1].replaceAll(',', '')),card: account[1],merchant:merchant[1],type:incoming?'حوالة واردة':'شراء',category:incoming?'راتب':recurring?'اشتراكات':'مطاعم ومقاهي',incoming};
}
function selectSample(key){
 const message = samples[key];
 const data = parseSMS(message);
 document.getElementById('sms-text').textContent = message;
 const formatted = data.amount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 for(const [id,value] of Object.entries({'result-amount':formatted,'result-type':data.type,'result-merchant':data.merchant,'result-category':data.category,'result-card':'•• '+data.card,'preview-merchant':data.merchant==='HALF MILLION'?'مقهى هاف مليون':data.merchant,'preview-category':data.category,'preview-amount':(data.incoming?'+':'−')+formatted})) {const target=document.getElementById(id);if(target)target.textContent=value;}
 document.querySelectorAll('[data-sample]').forEach(button=>{const selected=button.dataset.sample===key;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
 document.querySelectorAll('[data-preview-sample]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.previewSample===key))); const panel=document.querySelector('.result-panel'); panel.dataset.direction=data.incoming?'incoming':'outgoing'; panel.classList.remove('updated'); void panel.offsetWidth; panel.classList.add('updated');
}
document.querySelectorAll('[data-sample]').forEach(button=>button.addEventListener('click',()=>selectSample(button.dataset.sample)));
selectSample('purchase');
let theme;try{theme=localStorage.getItem('luma-theme'+(document.documentElement.dataset.design?'-'+document.documentElement.dataset.design:''))}catch{}if(theme==='dark'||theme==='light')document.documentElement.dataset.theme=theme;
document.getElementById('theme').addEventListener('click',()=>{const dark=getComputedStyle(document.documentElement).colorScheme==='dark';const next=dark?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('luma-theme'+(document.documentElement.dataset.design?'-'+document.documentElement.dataset.design:''),next)}catch{} document.getElementById('theme').setAttribute('aria-label',next==='dark'?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن')});
document.getElementById('download-button').addEventListener('click',()=>{document.getElementById('download-status').textContent='طلب تنزيل QPay.apk. تابع التنزيل من المتصفح.'});
document.getElementById('github-info').addEventListener('click',()=>{document.getElementById('footer-status').textContent='سيُضاف رابط مستودع GitHub الرسمي عند توفره.'});
document.getElementById('contact-info').addEventListener('click',()=>{document.getElementById('footer-status').textContent='لم يُحدّد بريد التواصل بعد.'});

document.querySelectorAll('[data-preview-sample]').forEach(button=>button.addEventListener('click',()=>selectSample(button.dataset.previewSample)));
document.querySelectorAll('[data-design-link]').forEach(link=>{if(link.dataset.designLink===document.documentElement.dataset.design)link.setAttribute('aria-current','page')});

const splitTotal=document.getElementById('split-total');
const splitPeople=document.getElementById('split-people');
function updateSplit(){const total=Number(splitTotal.value),people=Number(splitPeople.value);const valid=splitTotal.value!==''&&splitPeople.value!==''&&Number.isFinite(total)&&total>=0&&total<=1000000&&Number.isInteger(people)&&people>=1&&people<=100;document.getElementById('split-result').textContent=valid?(total/people).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' ر.س لكل شخص':'أدخل مبلغاً صحيحاً وعدد أشخاص من 1 إلى 100.';}
if(splitTotal&&splitPeople){splitTotal.addEventListener('input',updateSplit);splitPeople.addEventListener('input',updateSplit);updateSplit();}



