'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('FE_DISK_SAVES',Object.freeze({
 write:(profileId,json)=>ipcRenderer.invoke('fe:saves:write',{profileId,json}),
 read:profileId=>ipcRenderer.invoke('fe:saves:read',{profileId}),
 remove:profileId=>ipcRenderer.invoke('fe:saves:remove',{profileId})
}));
contextBridge.exposeInMainWorld('FE_NPC_LLM',Object.freeze({
 chat:({messages})=>ipcRenderer.invoke('fe:llm:chat',{messages})
}));
