// Deliberate subset used by the checked-in schemas; unknown validation keywords fail closed.
const supported=new Set(['$schema','type','properties','required','additionalProperties','items','minItems','maxItems','uniqueItems','minLength','maxLength','minimum','maximum','enum','const','pattern']);
export function checkSchema(value,schema,path='$',errors=[]){
 for(const k of Object.keys(schema))if(!supported.has(k))throw Error('Unsupported schema keyword '+k);
 const fail=message=>errors.push(`${path}: ${message}`);
 if(Object.hasOwn(schema,'const')&&JSON.stringify(value)!==JSON.stringify(schema.const))fail('constant mismatch');
 if(schema.enum&&!schema.enum.includes(value))fail('invalid enum');
 const type=Array.isArray(value)?'array':value===null?'null':typeof value;
 if(schema.type&&(schema.type==='integer'?!Number.isSafeInteger(value):type!==schema.type)){fail('expected '+schema.type);return errors;}
 if(type==='object'){
  for(const k of schema.required||[])if(!Object.hasOwn(value,k))fail('missing '+k);
  for(const [k,v]of Object.entries(value)){
   if(['__proto__','constructor','prototype'].includes(k)){fail('unsafe key');continue;}
   if(Object.hasOwn(schema.properties||{},k))checkSchema(v,schema.properties[k],path+'.'+k,errors);
   else if(schema.additionalProperties===false)fail('unknown field '+k);
   else if(typeof schema.additionalProperties==='object')checkSchema(v,schema.additionalProperties,path+'.'+k,errors);
  }
 }
 if(type==='array'){
  if(value.length<(schema.minItems??0)||value.length>(schema.maxItems??Infinity))fail('array length');
  if(schema.uniqueItems&&new Set(value.map(v=>JSON.stringify(v))).size!==value.length)fail('duplicates');
  value.forEach((v,i)=>checkSchema(v,schema.items||{},path+'['+i+']',errors));
 }
 if(type==='string'){
  if(value.length<(schema.minLength??0)||value.length>(schema.maxLength??Infinity))fail('string length');
  if(schema.minLength>0&&!value.trim())fail('empty text');
  if(schema.pattern&&!new RegExp(schema.pattern).test(value))fail('invalid pattern');
 }
 if(type==='number'&&(value<(schema.minimum??-Infinity)||value>(schema.maximum??Infinity)))fail('number range');
 return errors;
}
