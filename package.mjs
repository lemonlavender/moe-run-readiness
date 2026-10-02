import {cpSync,existsSync,mkdirSync,mkdtempSync,readFileSync,readdirSync,rmSync,statSync,utimesSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {basename,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root=dirname(fileURLToPath(import.meta.url));
const epoch=new Date('2000-01-01T00:00:00Z');
const walk=(dir,rel='')=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const file=rel?`${rel}/${entry.name}`:entry.name;
  const full=join(dir,entry.name);
  if(entry.isSymbolicLink()) throw Error(`symbolic link: ${file}`);
  return entry.isDirectory()?walk(full,file):entry.isFile()?[file]:[];
});
const copy=(from,to,files)=>files.forEach(file=>{
  const out=join(to,file);
  mkdirSync(dirname(out),{recursive:true});
  cpSync(join(from,file),out);
  utimesSync(out,epoch,epoch);
});
const zip=(cwd,out,files)=>execFileSync('zip',['-X','-q',out,...files],{cwd,env:{...process.env,TZ:'UTC'}});
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');

const manifest=JSON.parse(readFileSync(join(root,'ipollowork.plugin.json')));
if(manifest.schemaVersion!==2||manifest.source.trusted!==false||manifest.resources.length!==1) throw Error('invalid manifest');
const stem=`${manifest.id}-${manifest.package.version}`;
const dist=join(root,'dist');
mkdirSync(dist,{recursive:true});
const stage=mkdtempSync(join(tmpdir(),'moe-run-readiness-plugin-'));
try {
  const pluginFiles=['ipollowork.plugin.json',...walk(join(root,'skills'),'skills')];
  copy(root,stage,pluginFiles);
  const plugin=join(dist,`${stem}.ipollowork-plugin`);
  rmSync(plugin,{force:true});
  zip(stage,plugin,pluginFiles);
  if(!existsSync(plugin)||statSync(plugin).size>12*1024*1024) throw Error('plugin archive invalid');

  const skillStage=mkdtempSync(join(tmpdir(),'moe-run-readiness-skill-'));
  try {
    const skillRoot=join(root,'skills/moe-run-readiness');
    const files=walk(skillRoot);
    const skillPrefix='moe-run-readiness';
    copy(skillRoot,join(skillStage,skillPrefix),files);
    const skill=join(dist,`${stem}-skill.zip`);
    rmSync(skill,{force:true});
    zip(skillStage,skill,files.map(file=>`${skillPrefix}/${file}`));

    const sourceStage=mkdtempSync(join(tmpdir(),'moe-run-readiness-source-'));
    try {
      const ignored=new Set(['dist','.git','.venv','completed-tdd-archives']);
      const sourceFiles=readdirSync(root,{withFileTypes:true}).filter(entry=>!ignored.has(entry.name)).flatMap(entry=>{
        if(entry.isSymbolicLink()) throw Error(`symbolic link: ${entry.name}`);
        if(entry.isDirectory()) return walk(join(root,entry.name),entry.name);
        return entry.isFile()?[entry.name]:[];
      });
      const prefix=`${stem}-source`;
      copy(root,join(sourceStage,prefix),sourceFiles);
      const source=join(dist,`${stem}-source.zip`);
      rmSync(source,{force:true});
      zip(sourceStage,source,sourceFiles.map(file=>`${prefix}/${file}`));
      writeFileSync(join(dist,'SHA256SUMS.txt'),`${hash(plugin)}  ${basename(plugin)}\n${hash(skill)}  ${basename(skill)}\n${hash(source)}  ${basename(source)}\n`);
    } finally { rmSync(sourceStage,{recursive:true,force:true}); }
  } finally { rmSync(skillStage,{recursive:true,force:true}); }
} finally { rmSync(stage,{recursive:true,force:true}); }
