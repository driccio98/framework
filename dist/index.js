var o=class{static join(...e){return this.normalize(e)}static normalize(e){let t=(typeof e=="string"?e.split(this.separator):e).filter(s=>s!==""),i=[];for(let s=0;s<t.length;s++)t[s]===".."?i.length>0&&i[i.length-1]!==".."?i.pop():i.push(".."):t[s]!=="."&&i.push(t[s]);return i.join(this.separator)}static relative(e,t){let i=this.normalize(e).split(this.separator),s=this.normalize(t).split(this.separator),r=[],l=0;for(;s[l]!==void 0&&i[l]===s[l];)++l;for(let a=s.length-l;a>0;a--)r.push("..");for(;i[l]!==void 0;)r.push(i[l++]);return r.join(this.separator)}static addSlashes(e){return e.replaceAll("\\","\\\\").replaceAll('"','\\"')}};o.separator="/",o.delimiter=":";var u=class{static resolvePath(e){return new Promise(async t=>{this.dirs[e]===null&&(this.dirs[e]=await Neutralino.os.getPath(e)),t(this.dirs[e])})}static get data(){return this.resolvePath("data")}static get documents(){return this.resolvePath("documents")}static get pictures(){return this.resolvePath("pictures")}static get music(){return this.resolvePath("music")}static get video(){return this.resolvePath("video")}static get downloads(){return this.resolvePath("downloads")}};u.dirs={temp:null,data:null,documents:null,pictures:null,music:null,video:null,downloads:null},u.cwd=NL_CWD,u.app=NL_PATH,u.temp="/tmp";var v=class{static read(e,t=!1){return new Promise(async i=>{i(t?await Neutralino.filesystem.readBinaryFile(e):await Neutralino.filesystem.readFile(e))})}static write(e,t){return new Promise(i=>{typeof t=="string"?Neutralino.filesystem.writeFile(e,t).then(i):Neutralino.filesystem.writeBinaryFile(e,t).then(i)})}static exists(e){return new Promise(t=>{Neutralino.filesystem.getStats(e).then(()=>t(!0)).catch(()=>t(!1))})}static stats(e){return new Promise(t=>{Neutralino.filesystem.getStats(e).then(i=>t({type:i.isFile?"file":"directory",size:i.size})).catch(()=>t(null))})}static remove(e){return new Promise(t=>{Neutralino.os.execCommand(`rm -rf "${o.addSlashes(e)}"`).then(()=>t())})}static files(e){return new Promise(t=>{Neutralino.filesystem.readDirectory(e).then(i=>{t(i.filter(s=>s!=="."&&s!==".."))})})}static mkdir(e){return new Promise(t=>{Neutralino.os.execCommand(`mkdir -p "${o.addSlashes(e)}"`).then(()=>t())})}static copy(e,t){return new Promise((i,s)=>{this.stats(e).then(r=>{r===null?s(new Error("File or directory doesn't exist")):Neutralino.os.execCommand(`cp -r "${o.addSlashes(e)}" "${o.addSlashes(t)}"`).then(()=>i())})})}static move(e,t){return new Promise((i,s)=>{this.stats(e).then(r=>{r===null?s(new Error("File or directory doesn't exist")):Neutralino.os.execCommand(`mv "${o.addSlashes(e)}" "${o.addSlashes(t)}"`).then(()=>i())})})}};var w=class{static get current(){return Neutralino.window}static open(e,t={}){return new Promise(async i=>{let s=await Neutralino.window.create(`/${e}.html`,{width:600,height:400,enableInspector:!1,exitProcessOnClose:!0,...t});i({status:s!==void 0,data:s})})}};var h=class{constructor(e,t=null){this.runningInterval=200;this.outputInterval=500;this.outputOffset=0;this._finished=!1;this.id=e,this.outputFile=t;let i=()=>{this.running().then(s=>{s?this.runningInterval&&setTimeout(i,this.runningInterval):(this._finished=!0,this.onFinish&&this.onFinish(this))})};if(this.runningInterval&&setTimeout(i,this.runningInterval),this.outputFile){let s=()=>{Neutralino.filesystem.readFile(this.outputFile).then(r=>{this.onOutput&&this.onOutput(r.substring(this.outputOffset),this),this.outputOffset=r.length,this._finished?Neutralino.filesystem.removeFile(this.outputFile):this.outputInterval&&setTimeout(s,this.outputInterval)}).catch(()=>{this.outputInterval&&!this._finished&&setTimeout(s,this.outputInterval)})};this.outputInterval&&setTimeout(s,this.outputInterval)}}get finished(){return this._finished}finish(e){this.onFinish=e,this._finished?e(this):this.runningInterval===null&&this.running().then(t=>{t||(this._finished=!0,e(this))})}output(e){this.onOutput=e}kill(e=!1){return Neutralino.filesystem.removeFile(this.outputFile),h.kill(this.id,e)}running(){return new Promise(e=>{Neutralino.os.execCommand(`ps -p ${this.id} -S`).then(t=>{e(t.stdOut.includes(this.id)&&!t.stdOut.includes("Z   "))})})}static run(e,t={}){return new Promise(async i=>{let s=`${await u.temp}/${1e4+Math.round(Math.random()*89999)}.tmp`;if(t.env)for(let a of Object.keys(t.env))e=`${a}="${o.addSlashes(t.env[a].toString())}" ${e}`;e=`${e} > "${o.addSlashes(s)}" 2>&1`,t.cwd&&(e=`cd "${o.addSlashes(t.cwd)}" && ${e}`);let r=await Neutralino.os.execCommand(e,{background:!0}),l=async()=>{let a=await Neutralino.os.execCommand(`pgrep -P ${r.pid}`);if(a.stdOut=="")setTimeout(l,t.childInterval??50);else{let c=parseInt(a.stdOut.substring(0,a.stdOut.length-1));i(new h(c,s))}};setTimeout(l,t.childInterval??50)})}static kill(e,t=!1){return new Promise(i=>{Neutralino.os.execCommand(`kill ${t?"-9":"-15"} ${e}`).then(()=>i())})}},C=h;Neutralino.events.on("trayMenuItemClicked",n=>{for(let e of m.trays)for(let t of e.items)if(t.id===n.detail.id){t.click&&t.click({id:n.detail.id,text:n.detail.text,disabled:n.detail.isDisabled,checked:n.detail.isChecked,click:t.click});return}});var x=class{constructor(e,t=[]){this._items=[];this.icon=e,this.items=t,x.trays.push(this)}get items(){return this._items.map(e=>({id:e.id,text:e.text,disabled:e.isDisabled,checked:e.isChecked,click:e.click}))}set items(e){this._items=e.map(t=>(t.id===void 0&&t.click!==void 0&&(t.id="click:"+Math.random().toString().substring(2)),{id:t.id,text:t.text,isDisabled:t.disabled,isChecked:t.checked,click:t.click}))}update(e=null){return e!==null&&(this.items=e),Neutralino.os.setTray({icon:this.icon,menuItems:this._items})}hide(){return Neutralino.os.setTray({icon:this.icon,menuItems:[]})}},m=x;m.trays=[];var N=class{constructor(e,t,i){this.id=e,this.time=t,this.data=i}pop(){return f.remove(this),this}get(){return{id:this.id,time:this.time,data:this.data}}},f=class{static read(){return new Promise(async e=>{Neutralino.filesystem.readFile(this.file).then(t=>e(JSON.parse(t).map(i=>new N(i.id,i.time,i.data)))).catch(()=>e([]))})}static write(e){return new Promise(async t=>{let i=await this.read(),s=new N(Math.round(Math.random()*1e5),Date.now(),e);i.push(s),await Neutralino.filesystem.writeFile(this.file,JSON.stringify(i)),t(s)})}static remove(e){return new Promise(async t=>{let i=await this.read();i=i.filter(s=>typeof e=="number"?s.id!==e:s.id!==e.id||s.time!==e.time),await Neutralino.filesystem.writeFile(this.file,JSON.stringify(i)),t()})}static purge(){return new Promise(async e=>{Neutralino.filesystem.removeFile(this.file).then(()=>e()).catch(()=>e())})}};f.file=`${u.temp}/.${NL_APPID}.ipc.json`;var I=class{static show(e){let t=`notify-send "${o.addSlashes(e.title)}" "${o.addSlashes(e.body)}"`;e.icon&&(t+=` -i "${o.addSlashes(e.icon)}"`),e.duration&&(t+=` -d ${e.duration}`),e.importance&&(t+=` -u ${e.importance}`),Neutralino.os.execCommand(t,{background:!0})}};function p(n){return new Promise(async e=>{if(typeof n=="function")e(await Promise.resolve(n()));else if(typeof n.then=="function")e(await n);else{let t={};if(n.callAtOnce){let i=n.callbacks.length;for(let r=0;r<n.callbacks.length;++r)p(n.callbacks[r]).then(l=>{t[r]=l,--i});let s=()=>{i>0?setTimeout(s,n.interval??100):e(t)};setTimeout(s,n.interval??100)}else{for(let i=0;i<n.callbacks.length;++i)t[i]=await p(n.callbacks[i]);e(t)}}})}var O=class{constructor(e,t=null){this._id=-1;this.progressInterval=500;this.unpacked=0;this.started=!1;this.finished=!1;this.throwedError=!1;this.path=e,this.unpackDir=t,this.started=!0,this.onStart&&this.onStart(),b.getInfo(e).then(i=>{if(i===null)this.throwedError=!0,this.onError&&this.onError();else{this.archive=i;let s={tar:`tar -xvf "${o.addSlashes(e)}"${t?` -C "${o.addSlashes(t)}"`:""}`,zip:`unzip -o "${o.addSlashes(e)}"${t?` -d "${o.addSlashes(t)}"`:""}`}[this.archive.type];t&&(s=`mkdir -p "${o.addSlashes(t)}" && ${s}`);let r=this.archive.files,l=t??NL_CWD;Neutralino.os.execCommand(s,{background:!0}).then(c=>{this._id=c.pid});let a=async()=>{let c=0,$=[];r.forEach(d=>{d.path!="#unpacked#"&&$.push(()=>new Promise(z=>{Neutralino.filesystem.getStats(`${l}/${d.path}`).then(()=>{this.unpacked+=d.size.uncompressed,c+=d.size.uncompressed,d.path="#unpacked#",z()}).catch(()=>z())}))}),await p({callbacks:$,callAtOnce:!0,interval:200}),r=r.filter(d=>d.path!="#unpacked#"),this.onProgress&&this.onProgress(this.unpacked,this.archive.size.uncompressed,c),this.unpacked>=this.archive.size.uncompressed&&(this.finished=!0,this.onFinish&&this.onFinish()),this.finished||setTimeout(a,this.progressInterval)};setTimeout(a,this.progressInterval)}})}get id(){return this._id}start(e){this.onStart=e,this.started&&e()}progress(e){this.onProgress=e}finish(e){this.onFinish=e,this.finished&&e()}error(e){this.onError=e,this.throwedError&&e()}close(e=!1){Neutralino.os.execCommand(`kill ${e?"-9":"-15"} ${this._id}`)}},b=class{static getType(e){return e.substring(e.length-4)==".zip"?"zip":e.substring(e.length-7,e.length-2)==".tar."?"tar":null}static getInfo(e){return new Promise(async t=>{let i={type:this.getType(e),size:{compressed:null,uncompressed:null},files:[]};switch(i.type){case"tar":let s=await Neutralino.os.execCommand(`tar -tvf "${e}"`);for(let l of s.stdOut.matchAll(/^[dwxr\-]+ [\w/]+[ ]+(\d+) [0-9\-]+ [0-9\:]+ (.+)/gm)){let a=parseInt(l[1]);i.size.uncompressed+=a,i.files.push({path:l[2],size:{compressed:null,uncompressed:a}})}t(i);break;case"zip":let r=await Neutralino.os.execCommand(`unzip -v "${e}"`);for(let l of r.stdOut.matchAll(/^(\d+)  [a-zA-Z\:]+[ ]+(\d+)[ ]+[0-9\-]+% [0-9\-]+ [0-9\:]+ [a-f0-9]{8}  (.+)/gm)){let a=parseInt(l[1]),c=parseInt(l[2]);i.size.compressed+=c,i.size.uncompressed+=a,i.files.push({path:l[3],size:{compressed:c,uncompressed:a}})}t(i);break;default:t(null);break}})}static extract(e,t=null){return new Promise(i=>{let s=new O(e,t);this.streams.push(s),i(s)})}static closeStreams(e=!1){this.streams.forEach(t=>{t.close(e)})}};b.streams=[];var F=class{constructor(e,t,i){this.url=e,this.status=t,this.length=i,this.ok=t>=200&&t<=299}body(e=null){return new Promise(t=>{Neutralino.os.execCommand(`curl -s -L ${e!==null?`-m ${e/1e3}`:""} "${this.url}"`).then(i=>t(i.stdOut))})}};function y(n,e=null){return new Promise(async t=>{let i=await Neutralino.os.execCommand(`curl -s -I -L ${e!==null?`-m ${e/1e3}`:""} "${n}"`);i.stdOut==""?i=i.stdErr:i=i.stdOut,i=i.split(/^HTTP\/[\d\.]+ /mi).pop();let s=parseInt(i.split(/\s/).shift()),r=/^content-length: ([\d]+)/mi.exec(i);isNaN(s)&&(s=null),r!==null&&(r=parseInt(r[1])),t(new F(n,s,r))})}var S=class{static getInfo(e){return new Promise(async t=>{let i=await Neutralino.os.execCommand(`ping -n -4 -w 1 -B "${o.addSlashes(e)}"`),s=i.stdOut||i.stdErr;if(s.includes("Name or service not known"))t({uri:e,available:!1});else{let r=/PING (.*) \(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\) .* ([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}) : [\d]+\([\d]+\)/gm.exec(s);r!==null&&t({uri:r[1],remoteIp:r[2],localIp:r[3],available:r[2]!==r[3]})}})}};var k=class{constructor(e,t,i){this._id=-1;this.progressInterval=200;this.pauseInterval=500;this.previous=0;this.started=!1;this.paused=!0;this.finished=!1;this.uri=e,this.output=t,this.total=i,this.started=!0,this.onStart&&this.onStart(),this.resume();let s=()=>{this.paused?setTimeout(s,this.pauseInterval):Neutralino.filesystem.getStats(t).then(r=>{this.onProgress&&this.onProgress(r.size,this.total,r.size-this.previous),this.previous=r.size,r.size>=this.total&&(this.finished=!0,this.onFinish&&this.onFinish()),this.finished||setTimeout(s,this.progressInterval)}).catch(()=>{this.finished||setTimeout(s,this.progressInterval)})};setTimeout(s,this.progressInterval)}get id(){return this._id}start(e){this.onStart=e,this.started&&e()}progress(e){this.onProgress=e}finish(e){this.onFinish=e,this.finished&&e()}pause(){this.paused||(this.close(!0),this.paused=!0)}resume(){if(this.paused){let e=`curl -s -L -N -C - -o "${o.addSlashes(this.output)}" "${this.uri}"`;Neutralino.os.execCommand(e,{background:!0}).then(t=>{this._id=t.pid}),this.paused=!1}}close(e=!1){Neutralino.os.execCommand(`kill ${e?"-9":"-15"} ${this._id}`)}},P=class{static async download(e,t=null){return new Promise(async i=>{y(e).then(s=>{let r=new k(e,t??this.fileFromUri(e),s.length);this.streams.push(r),i(r)})})}static fileFromUri(e){let t=e.split("/").pop().split("#")[0].split("?")[0];return t===""?"index.html":`https://${t}`!=e&&`http://${t}`!=e?t:"index.html"}static closeStreams(e=!1){this.streams.forEach(t=>{t.close(e)})}};P.streams=[];var g=class{static get(e){return new Promise(async t=>{if(this.cache!==null&&this.cache[e]!==void 0){let i=this.cache[e].ttl!==null?Date.now()>this.cache[e].ttl*1e3:!1;t({expired:i,value:this.cache[e].value})}else Neutralino.filesystem.readFile(this.file).then(i=>{if(this.cache=JSON.parse(i),this.cache[e]===void 0)t(null);else{let s={expired:this.cache[e].ttl!==null?Date.now()>this.cache[e].ttl*1e3:!1,value:this.cache[e].value};t(s)}}).catch(()=>t(null))})}static set(e,t,i=null){return new Promise(s=>{let r=()=>{this.cache[e]={ttl:i!==null?Math.round(Date.now()/1e3)+i:null,value:t},Neutralino.filesystem.writeFile(this.file,JSON.stringify(this.cache)).then(()=>s())};this.cache===null?Neutralino.filesystem.readFile(this.file).then(l=>{this.cache=JSON.parse(l),r()}).catch(()=>{this.cache={},r()}):r()})}};g.file=`${u.temp}/.${NL_APPID}.cache.json`,g.cache=null;export{b as Archive,g as Cache,S as Domain,P as Downloader,f as IPC,I as Notification,C as Process,m as Tray,w as Windows,u as dir,y as fetch,v as fs,o as path,p as promisify};
