import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const root=new URL('../../',import.meta.url);

test('manifest declares one complete untrusted Skill',()=>{
  const manifest=JSON.parse(readFileSync(new URL('ipollowork.plugin.json',root)));
  assert.equal(manifest.schemaVersion,2);
  assert.equal(manifest.id,'moe-run-readiness');
  assert.equal(manifest.source.trusted,false);
  assert.equal(manifest.package.version,'1.0.0');
  assert.deepEqual(manifest.package.compatibility,{ipollowork:'>=0.50.12'});
  assert.equal(manifest.resources.length,1);
  assert.deepEqual(manifest.resources[0],{type:'skill',id:'moe-run-readiness',label:'MoE Run Readiness',path:'skills/moe-run-readiness',required:true});
  assert.ok(!('permissions' in manifest));
});

test('release archives contain required roots and valid checksums',()=>{
  const dist=new URL('dist/',root);
  const files=['moe-run-readiness-1.0.0.ipollowork-plugin','moe-run-readiness-1.0.0-skill.zip','moe-run-readiness-1.0.0-source.zip','SHA256SUMS.txt'];
  for(const name of files) assert.ok(existsSync(new URL(name,dist)),`${name} missing`);
  const workflow=readFileSync(new URL('.github/workflows/release.yml',root),'utf8');
  for(const name of files) assert.match(workflow,new RegExp(`dist/${name.replaceAll('.','\\.')}`));
  assert.doesNotMatch(workflow,/fuzz-crash-handoff/);
  const plugin=execFileSync('unzip',['-Z1',new URL(files[0],dist).pathname],{encoding:'utf8'}).trim().split('\n');
  assert.deepEqual(plugin.sort(),['ipollowork.plugin.json','skills/moe-run-readiness/SKILL.md','skills/moe-run-readiness/references/readiness-rules.md','skills/moe-run-readiness/references/report-format.md'].sort());
  execFileSync('shasum',['-a','256','-c','SHA256SUMS.txt'],{cwd:dist,stdio:'pipe'});
});
