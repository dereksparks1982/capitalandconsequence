/* OpenAI-compatible local server transport. The renderer cannot select an address.
 * Works with localhost llama.cpp server and Ollama's /v1 API. No external requests.
 */
'use strict';
const http=require('node:http');
const DEFAULT_PORT=8080,MAX_CONTENT=16384,MAX_BODY=131072;
function portFrom(value){
 const port=Number(value??DEFAULT_PORT);
 if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid local model port');
 return port;
}
function validate(messages){
 if(!Array.isArray(messages)||messages.length<2||messages.length>30)throw Error('Invalid conversation length');
 return messages.map(m=>{
  if(!m||!['system','user','assistant'].includes(m.role)||
   typeof m.content!=='string'||!m.content.trim()||m.content.length>MAX_CONTENT)throw Error('Invalid conversation message');
  return {role:m.role,content:m.content};
 });
}
function chat(messages,config={}){
 const normalized=validate(messages);
 const port=portFrom(config.port??process.env.FE_LLM_PORT);
 const model=typeof config.model==='string'&&config.model.trim()?config.model.trim().slice(0,128):
  (process.env.FE_LLM_MODEL||'local').slice(0,128);
 const payload=JSON.stringify({model,messages:normalized,temperature:0.65,max_tokens:300,stream:false});
 if(Buffer.byteLength(payload)>MAX_BODY)throw Error('Conversation request too large');
 const timeout=Number.isFinite(config.timeout)&&config.timeout>=500&&config.timeout<=90000?config.timeout:60000;
 return new Promise((resolve,reject)=>{
  let done=false,bytes=0,result='';
  const fail=e=>{if(done)return;done=true;reject(e instanceof Error?e:new Error(String(e)))};
  const req=http.request({hostname:'127.0.0.1',port,path:'/v1/chat/completions',method:'POST',
   headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload),'Accept':'application/json'},
   agent:false},res=>{
   if(res.statusCode!==200){res.resume();return fail(Error('Local model HTTP '+res.statusCode))}
   res.setEncoding('utf8');
   res.on('data',chunk=>{bytes+=Buffer.byteLength(chunk);if(bytes>MAX_BODY){req.destroy();return fail(Error('Local model reply too large'))}result+=chunk});
   res.on('error',fail);
   res.on('end',()=>{if(done)return;try{
    const parsed=JSON.parse(result),raw=parsed?.choices?.[0]?.message?.content;
    if(typeof raw!=='string'||!raw.trim())throw Error('Local model returned no conversation text');
    done=true;resolve({ok:true,text:raw.trim().slice(0,4000)});
   }catch(e){fail(e)}});
  });
  req.setTimeout(timeout,()=>req.destroy(Error('Local model timed out')));
  req.on('error',fail);
  req.end(payload);
 });
}
module.exports=Object.freeze({chat,validate,portFrom});
