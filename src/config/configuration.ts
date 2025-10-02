import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';
const expandRegex = /\${\s*(\w+)\s*(?::-([^}]*))?}/;

function expandValue(value: any): any {
  if (typeof value !== 'string') return value;

  let newValue: string = value;

  let m = value.match(expandRegex);

  while (m) {
    const replacement = process.env[m[1]] || m[2];
    newValue = newValue.replace(
      m[0],
      replacement !== undefined ? replacement : '',
    );
    m = newValue.match(expandRegex);
  }

  return newValue;
}

function fixEntry(entry: [string, any]): [string, any] {
  const [key, value] = entry;
  if (typeof value === 'object') return [key, fixEnvVars(value)];
  return [key, expandValue(value)];
}

export function fixEnvVars(configs: Record<string, any>): Record<string, any> {
  return Object.fromEntries(Object.entries(configs).map(fixEntry));
}

export default () => {
  const str = readFileSync(join('./config', YAML_CONFIG_FILENAME), 'utf8');
  const configs = yaml.load(str) as Record<string, any>;
  return fixEnvVars(configs);
};
