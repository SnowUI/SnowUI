import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('..',import.meta.url));
const remote=execFileSync('git',['remote','get-url','origin'],{cwd,encoding:'utf8'}).trim();
if(!/^(?:https:\/\/github\.com\/|git@github\.com:)SnowUI\/SnowUI(?:\.git)?$/.test(remote))throw Error('Source sync requires the approved SnowUI/SnowUI remote');
const repo=JSON.parse(execFileSync('gh',['repo','view','SnowUI/SnowUI','--json','nameWithOwner,isPrivate'],{cwd,encoding:'utf8'}));
if(repo.nameWithOwner!=='SnowUI/SnowUI'||repo.isPrivate!==true)throw Error('Source sync refused: repository privacy could not be confirmed');
console.log('Source remote verified: private SnowUI/SnowUI');
