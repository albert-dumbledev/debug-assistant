import path from 'path';

export const paths = {
  common: path.resolve(__dirname, '../../common'),
  client: path.resolve(__dirname, '../../client'),
  server: path.resolve(__dirname, '../../server'),
};

export const aliases = {
  '@common': paths.common,
  '@': path.resolve(paths.client, './src'),
}; 