// Theme choice belongs to each design so comparing one does not alter the others.
const design=document.documentElement.dataset.design;
if(design){let chosen;try{chosen=localStorage.getItem('luma-theme-'+design)}catch{}document.documentElement.dataset.theme=(new URLSearchParams(location.search).has('preview')?((design==='tech'||design==='glass')?'dark':'light'):chosen)||((design==='tech'||design==='glass')?'dark':matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}


